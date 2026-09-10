-- ============================================================
--  Database schema for the cognitive-training platform.
--  Run in the Supabase SQL Editor (Dashboard → SQL Editor).
--  Row Level Security ensures each user sees only their own data.
-- ============================================================

-- ------------------------- diagnostic_results -------------------------
create table if not exists public.diagnostic_results (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  finished_at timestamptz not null default now(),
  estimates   jsonb not null default '{}'::jsonb,
  items       jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists diagnostic_results_user_idx
  on public.diagnostic_results (user_id, finished_at desc);

alter table public.diagnostic_results enable row level security;

drop policy if exists "own diagnostics" on public.diagnostic_results;
create policy "own diagnostics"
  on public.diagnostic_results
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------- review_cards -------------------------
create table if not exists public.review_cards (
  user_id     uuid not null references auth.users (id) on delete cascade,
  question_id text not null,
  skill       text not null,
  fsrs        jsonb not null,
  due         timestamptz not null,
  updated_at  timestamptz not null default now(),
  primary key (user_id, question_id)
);

create index if not exists review_cards_due_idx
  on public.review_cards (user_id, due);

alter table public.review_cards enable row level security;

drop policy if exists "own review cards" on public.review_cards;
create policy "own review cards"
  on public.review_cards
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------- ai_usage (rate limiting) -------------------------
-- Per-identity daily AI-call counter. Locked down (no direct access); only the
-- security-definer function below touches it.
create table if not exists public.ai_usage (
  identity text not null,
  day      date not null default current_date,
  count    int  not null default 0,
  primary key (identity, day)
);

alter table public.ai_usage enable row level security;
-- (intentionally no policies: direct access is denied)

-- Atomically increments today's counter for an identity and returns whether the
-- call is allowed (i.e. was under the limit). Runs as owner to bypass RLS, and
-- is callable by anon/authenticated so the server can enforce limits.
create or replace function public.bump_ai_usage(p_identity text, p_limit int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  cur int;
begin
  select count into cur from public.ai_usage
    where identity = p_identity and day = current_date
    for update;

  if cur is null then
    insert into public.ai_usage (identity, day, count)
      values (p_identity, current_date, 1)
      on conflict (identity, day) do update set count = public.ai_usage.count + 1;
    return true;
  end if;

  if cur >= p_limit then
    return false;
  end if;

  update public.ai_usage set count = count + 1
    where identity = p_identity and day = current_date;
  return true;
end;
$$;

revoke all on function public.bump_ai_usage(text, int) from public;
grant execute on function public.bump_ai_usage(text, int) to anon, authenticated;

-- ------------------------- daily_scores (leaderboard) -------------------------
create table if not exists public.daily_scores (
  date         date not null,
  user_id      uuid not null references auth.users (id) on delete cascade,
  display_name text not null default 'Player',
  correct      int  not null,
  time_ms      int  not null,
  score        int  not null,
  created_at   timestamptz not null default now(),
  primary key (date, user_id)
);

create index if not exists daily_scores_board_idx
  on public.daily_scores (date, score desc);

alter table public.daily_scores enable row level security;

-- Anyone may read the leaderboard...
drop policy if exists "read leaderboard" on public.daily_scores;
create policy "read leaderboard" on public.daily_scores for select using (true);

-- ...and nobody writes it directly. The old "own daily score" policy let any
-- holder of the public anon key insert an arbitrary score for an arbitrary date
-- (fabricating streaks and owning the board), so writes now go through
-- submit_daily_score() only.
drop policy if exists "own daily score" on public.daily_scores;

-- Defence in depth: even the security-definer function can't store nonsense.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'daily_scores_sane'
  ) then
    alter table public.daily_scores
      add constraint daily_scores_sane check (
        correct between 0 and 10
        and time_ms between 1000 and 3600000
        and char_length(display_name) between 1 and 24
      );
  end if;
end $$;

revoke insert, update, delete on public.daily_scores from anon, authenticated;

-- The one legal way to post a score.
--   * the SERVER decides the date  → no reserving tomorrow, no faking a streak
--   * the SERVER computes the score → no hand-picked numbers, cap always applied
--   * one row per player per day    → replaying can't overwrite the first result
--   * returns what was actually stored → the UI can stop claiming false success
create or replace function public.submit_daily_score(
  p_correct       int,
  p_time_ms       int,
  p_display_name  text
)
returns table (accepted boolean, stored_score int, stored_date date)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid   uuid := auth.uid();
  v_date  date := (now() at time zone 'Africa/Cairo')::date;
  v_name  text;
  v_score int;
  v_ins   int;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  -- Clamp rather than reject: a real player with a slow connection or a long
  -- session should still land on the board, just not with an absurd row.
  p_correct := least(10, greatest(0, coalesce(p_correct, 0)));
  p_time_ms := least(3600000, greatest(1000, coalesce(p_time_ms, 1000)));
  v_name    := left(nullif(btrim(coalesce(p_display_name, '')), ''), 24);
  if v_name is null then v_name := 'Player'; end if;

  -- Same formula as the client's dailyScore(): accuracy first, time as a
  -- tiebreak that can never outweigh one correct answer.
  v_score := p_correct * 10000 - least(9999, round(p_time_ms / 100.0)::int);

  insert into public.daily_scores (date, user_id, display_name, correct, time_ms, score)
    values (v_date, v_uid, v_name, p_correct, p_time_ms, v_score)
    on conflict (date, user_id) do nothing;

  get diagnostics v_ins = row_count;

  if v_ins = 0 then
    -- Already played today: report the stored row, not the new attempt.
    select ds.score into v_score
      from public.daily_scores ds
     where ds.date = v_date and ds.user_id = v_uid;
  end if;

  return query select (v_ins = 1), v_score, v_date;
end;
$$;

revoke all on function public.submit_daily_score(int, int, text) from public;
grant execute on function public.submit_daily_score(int, int, text) to anon, authenticated;
