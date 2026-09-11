-- Practical assessment tracking for blended courses (e.g. Level 1 Gymnastics)
create table if not exists practical_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  course_id text not null,
  lead_coach_name text,
  area_lead_name text,
  schools text,
  final_lead_coach_name text,
  final_lead_coach_signed_at timestamptz,
  final_area_lead_name text,
  final_area_lead_signed_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, course_id)
);

create table if not exists practical_signoffs (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references practical_assessments(id) on delete cascade not null,
  section_id text not null,
  item_key text not null,
  signed_off_by text not null,
  notes text,
  signed_off_at timestamptz default now(),
  unique(assessment_id, item_key)
);

-- RLS
alter table practical_assessments enable row level security;
alter table practical_signoffs enable row level security;

create policy "Users manage own assessments"
  on practical_assessments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own signoffs"
  on practical_signoffs for all
  using (
    assessment_id in (
      select id from practical_assessments where user_id = auth.uid()
    )
  )
  with check (
    assessment_id in (
      select id from practical_assessments where user_id = auth.uid()
    )
  );

create index if not exists practical_assessments_user_course on practical_assessments(user_id, course_id);
create index if not exists practical_signoffs_assessment on practical_signoffs(assessment_id);
