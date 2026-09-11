-- Level 2 practical assessments
create table if not exists level2_practical_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id text not null default 'level2_lead_v1',
  lead_coach_name text,
  area_lead_name text,
  schools text,
  final_advanced_assessor_name text,
  final_advanced_assessor_signed_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, course_id)
);
alter table level2_practical_assessments enable row level security;
create policy "Users manage own l2 assessments" on level2_practical_assessments for all using (auth.uid() = user_id);
create policy "Assessors view l2 assessments" on level2_practical_assessments for select using (exists (select 1 from profiles where id = auth.uid() and role in ('assessor','admin')));
create policy "Assessors update l2 assessments" on level2_practical_assessments for update using (exists (select 1 from profiles where id = auth.uid() and role in ('assessor','admin')));

-- Level 2 signoffs
create table if not exists level2_practical_signoffs (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references level2_practical_assessments(id) on delete cascade,
  item_key text not null,
  section_id text not null,
  practical_demonstrated boolean default false,
  theory_demonstrated boolean default false,
  trainer_notes text,
  candidate_notes text,
  signed_off_by text,
  signed_off_at timestamptz,
  created_at timestamptz default now(),
  unique(assessment_id, item_key)
);
alter table level2_practical_signoffs enable row level security;
create policy "Users manage own l2 signoffs" on level2_practical_signoffs for all using (
  exists (select 1 from level2_practical_assessments where id = assessment_id and user_id = auth.uid())
);
create policy "Assessors manage l2 signoffs" on level2_practical_signoffs for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('assessor','admin'))
);

-- Level 2 video submissions
create table if not exists level2_video_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id text not null default 'level2_lead_v1',
  skills_box_id text,
  video_url text,
  status text not null default 'pending',
  assessor_feedback text,
  assessor_id uuid references profiles(id),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, course_id)
);
alter table level2_video_submissions enable row level security;
create policy "Users manage own l2 video" on level2_video_submissions for all using (auth.uid() = user_id);
create policy "Assessors manage l2 video" on level2_video_submissions for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('assessor','admin'))
);

-- Level 2 completion letters
create table if not exists level2_completion_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id text not null default 'level2_lead_v1',
  outcome text not null,
  feedback text,
  progression_advice text,
  assessor_id uuid references profiles(id),
  assessor_name text,
  completed_at timestamptz default now(),
  unique(user_id, course_id)
);
alter table level2_completion_letters enable row level security;
create policy "Users view own l2 letters" on level2_completion_letters for select using (auth.uid() = user_id);
create policy "Assessors manage l2 letters" on level2_completion_letters for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('assessor','admin'))
);
