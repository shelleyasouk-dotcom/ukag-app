create table if not exists level1_completion_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id text not null,
  outcome text not null default 'pass',
  feedback text,
  lead_coach_name text,
  area_lead_name text,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table level1_completion_letters enable row level security;

-- Candidates can read their own letter
create policy "Candidates read own letter"
  on level1_completion_letters for select
  using (auth.uid() = user_id);

-- Assessors and admins can insert/update
create policy "Assessors write letters"
  on level1_completion_letters for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role in ('assessor', 'area_lead', 'admin')
    )
  );

create policy "Assessors update letters"
  on level1_completion_letters for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role in ('assessor', 'area_lead', 'admin')
    )
  );
