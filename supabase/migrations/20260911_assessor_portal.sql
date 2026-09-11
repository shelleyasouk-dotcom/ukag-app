-- Link assessors to candidates
create table if not exists assessor_candidates (
  id uuid primary key default gen_random_uuid(),
  assessor_id uuid not null references profiles(id) on delete cascade,
  candidate_id uuid not null references profiles(id) on delete cascade,
  course_id text not null default 'level1_assistant_v1',
  linked_at timestamptz default now(),
  unique(assessor_id, candidate_id, course_id)
);
alter table assessor_candidates enable row level security;
-- Assessors see their own candidate links; admins see all
create policy "Assessors view own candidates" on assessor_candidates
  for select using (auth.uid() = assessor_id);
create policy "Admin manage assessor_candidates" on assessor_candidates
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Add participant reflection column to practical_signoffs
alter table practical_signoffs
  add column if not exists participant_reflection text;
