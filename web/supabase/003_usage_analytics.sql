-- ============================================================
--  الدفعة ٥ — إحصاءات استخدام مجهولة تماماً
--  الصقها كاملة في Supabase → SQL Editor → Run (مرة واحدة).
--  آمنة للتشغيل أكثر من مرة.
--
--  المبدأ: عدّاد واحد لكل (يوم، حدث، لغة). لا user_id، ولا session،
--  ولا وقت أدق من اليوم، ولا رابط صفحة، ولا أي خاصية حرّة.
--  يعني مستحيل نربط أي صف بشخص — وعشان كده ينفع نكتبه صريح في سياسة الخصوصية.
-- ============================================================

create table if not exists public.usage_events (
  day    date not null default current_date,
  event  text not null,
  locale text not null default 'ar',
  count  int  not null default 0,
  primary key (day, event, locale)
);

alter table public.usage_events enable row level security;
-- لا سياسات: الوصول المباشر ممنوع، والدالة أدناه وحدها هي اللي بتكتب.

revoke all on public.usage_events from anon, authenticated;

-- الأحداث المسموح بها فقط — عشان محدّش يقدر يزرع صفوف عشوائية بالمفتاح العلني.
create or replace function public.bump_usage_event(p_event text, p_locale text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_locale text := case when p_locale in ('ar','en') then p_locale else 'ar' end;
begin
  if p_event is null or p_event not in (
    'home_view',
    'diagnostic_start', 'diagnostic_resume', 'diagnostic_finish',
    'practice_start', 'practice_finish',
    'daily_start', 'daily_finish', 'daily_share',
    'abstract_start', 'nback_finish',
    'signup', 'signin'
  ) then
    return; -- تجاهل بصمت: الإحصاءات ما تكسرش أي جلسة
  end if;

  insert into public.usage_events (day, event, locale, count)
    values (current_date, p_event, v_locale, 1)
    on conflict (day, event, locale)
    do update set count = public.usage_events.count + 1;
end;
$$;

revoke all on function public.bump_usage_event(text, text) from public;
grant execute on function public.bump_usage_event(text, text) to anon, authenticated;

-- ------------------------------------------------------------
-- استعلامات جاهزة تشوف بيها القُمع (شغّلها وقت ما تحب):
--
--   select day, event, sum(count) as n
--     from public.usage_events
--    where day > current_date - 30
--    group by day, event
--    order by day desc, n desc;
--
--   -- نسبة إكمال التقييم آخر ٧ أيام:
--   select round(100.0 *
--            sum(count) filter (where event = 'diagnostic_finish') /
--            nullif(sum(count) filter (where event = 'diagnostic_start'), 0)
--          ) as completion_pct
--     from public.usage_events
--    where day > current_date - 7;
-- ------------------------------------------------------------
