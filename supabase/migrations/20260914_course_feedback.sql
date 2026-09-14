-- Course feedback submitted by coaches/assessors after completing a course
create table if not exists course_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id text not null,
  rating int not null check (rating between 1 and 5),
  enjoyed text,
  suggestions text,
  submitted_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table course_feedback enable row level security;

-- Users can manage their own feedback
create policy "feedback_own" on course_feedback
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Assessors and admins can read all feedback
create policy "feedback_read_staff" on course_feedback
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'assessor'))
  );
