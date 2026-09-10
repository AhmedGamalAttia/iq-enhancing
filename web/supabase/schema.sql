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
