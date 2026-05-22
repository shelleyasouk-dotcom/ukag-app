-- UKAG Learning Portal — Course Module Schema
-- Run this in the Supabase SQL Editor after the main schema

-- ─── Course Weeks ─────────────────────────────────────────────────────────────
create table course_weeks (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  week_number int not null,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (course_id, week_number)
);

-- ─── Course Lessons ───────────────────────────────────────────────────────────
create table course_lessons (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references course_weeks(id) on delete cascade,
  lesson_number int not null,
  title text not null,
  type text not null default 'video'
    check (type in ('video', 'reading', 'quiz')),
  duration_minutes int,
  content_placeholder text,
  created_at timestamptz not null default now(),
  unique (week_id, lesson_number)
);

-- ─── Week Assessments ─────────────────────────────────────────────────────────
create table week_assessments (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references course_weeks(id) on delete cascade,
  type text not null default 'video_submission'
    check (type in ('video_submission', 'practical_signoff')),
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

-- ─── Lesson Completions ───────────────────────────────────────────────────────
create table lesson_completions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references course_lessons(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (lesson_id, profile_id)
);

-- ─── Assessment Submissions ───────────────────────────────────────────────────
create table assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references week_assessments(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'submitted'
    check (status in ('submitted', 'approved', 'failed')),
  submitted_at timestamptz not null default now(),
  unique (assessment_id, profile_id)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table course_weeks enable row level security;
alter table course_lessons enable row level security;
alter table week_assessments enable row level security;
alter table lesson_completions enable row level security;
alter table assessment_submissions enable row level security;

create policy "course_weeks_read" on course_weeks for select using (auth.uid() is not null);
create policy "course_weeks_insert" on course_weeks for insert with check (current_user_role() = 'admin');
create policy "course_weeks_update" on course_weeks for update using (current_user_role() = 'admin');
create policy "course_weeks_delete" on course_weeks for delete using (current_user_role() = 'admin');

create policy "course_lessons_read" on course_lessons for select using (auth.uid() is not null);
create policy "course_lessons_insert" on course_lessons for insert with check (current_user_role() = 'admin');
create policy "course_lessons_update" on course_lessons for update using (current_user_role() = 'admin');
create policy "course_lessons_delete" on course_lessons for delete using (current_user_role() = 'admin');

create policy "week_assessments_read" on week_assessments for select using (auth.uid() is not null);
create policy "week_assessments_insert" on week_assessments for insert with check (current_user_role() = 'admin');
create policy "week_assessments_update" on week_assessments for update using (current_user_role() = 'admin');
create policy "week_assessments_delete" on week_assessments for delete using (current_user_role() = 'admin');

create policy "lesson_completions_read" on lesson_completions for select using (profile_id = auth.uid() or current_user_role() = 'admin');
create policy "lesson_completions_insert" on lesson_completions for insert with check (profile_id = auth.uid());
create policy "lesson_completions_delete" on lesson_completions for delete using (profile_id = auth.uid());

create policy "assessment_submissions_read" on assessment_submissions for select using (profile_id = auth.uid() or current_user_role() = 'admin');
create policy "assessment_submissions_insert" on assessment_submissions for insert with check (profile_id = auth.uid());
