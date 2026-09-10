-- ============================================================
--  الدفعة ٢ — نزاهة لوحة التحدّي اليومي
--  الصقها كاملة في Supabase → SQL Editor → Run (مرة واحدة).
--  آمنة للتشغيل أكثر من مرة.
-- ============================================================

-- 1) القراءة تبقى للجميع...
drop policy if exists "read leaderboard" on public.daily_scores;
create policy "read leaderboard" on public.daily_scores for select using (true);

-- 2) ...والكتابة المباشرة تُغلق تماماً.
--    السياسة القديمة كانت تسمح لأي حامل للمفتاح العلني بإدراج نتيجة من اختياره
--    في تاريخ من اختياره (تلفيق سلسلة، واحتلال اللوحة).
drop policy if exists "own daily score" on public.daily_scores;
revoke insert, update, delete on public.daily_scores from anon, authenticated;

-- 3) تصحيح الصفوف القديمة قبل فرض القيود:
--    الحدود تُقصّ، والنقاط تُعاد حسابها بالصيغة المسقوفة (لا نحذف تاريخ أحد).
update public.daily_scores set
  correct      = least(10, greatest(0, correct)),
  time_ms      = least(3600000, greatest(1000, time_ms)),
  display_name = coalesce(left(nullif(btrim(display_name), ''), 24), 'Player');

update public.daily_scores
   set score = correct * 10000 - least(9999, round(time_ms / 100.0)::int)
 where score <> correct * 10000 - least(9999, round(time_ms / 100.0)::int);

-- 4) قيود على مستوى الجدول: حتى الدالة نفسها لا تستطيع تخزين قيم غير منطقية.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'daily_scores_sane') then
    alter table public.daily_scores
      add constraint daily_scores_sane check (
        correct between 0 and 10
        and time_ms between 1000 and 3600000
        and char_length(display_name) between 1 and 24
      );
  end if;
end $$;

-- 5) الطريق الوحيد المشروع لتسجيل نتيجة.
--    * الخادم يقرّر التاريخ   → لا حجز للغد ولا تلفيق سلسلة
--    * الخادم يحسب النقاط     → لا أرقام يدوية، والسقف الزمني مطبَّق دائماً
--    * صف واحد لكل لاعب يومياً → إعادة اللعب لا تستطيع الكتابة فوق النتيجة الأولى
--    * ترجّع ما خُزّن فعلاً    → الواجهة لم تعد تدّعي نجاحاً كاذباً
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

  p_correct := least(10, greatest(0, coalesce(p_correct, 0)));
  p_time_ms := least(3600000, greatest(1000, coalesce(p_time_ms, 1000)));
  v_name    := left(nullif(btrim(coalesce(p_display_name, '')), ''), 24);
  if v_name is null then v_name := 'Player'; end if;

  v_score := p_correct * 10000 - least(9999, round(p_time_ms / 100.0)::int);

  insert into public.daily_scores (date, user_id, display_name, correct, time_ms, score)
    values (v_date, v_uid, v_name, p_correct, p_time_ms, v_score)
    on conflict (date, user_id) do nothing;

  get diagnostics v_ins = row_count;

  if v_ins = 0 then
    select ds.score into v_score
      from public.daily_scores ds
     where ds.date = v_date and ds.user_id = v_uid;
  end if;

  return query select (v_ins = 1), v_score, v_date;
end;
$$;

revoke all on function public.submit_daily_score(int, int, text) from public;
grant execute on function public.submit_daily_score(int, int, text) to anon, authenticated;
