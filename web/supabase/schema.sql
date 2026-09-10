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
