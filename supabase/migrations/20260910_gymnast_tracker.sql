-- Gymnast award tracker
create table if not exists gymnasts (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  date_of_birth date,
  current_level integer not null default 1 check (current_level between 1 and 6),
  school text,
  notes text,
  created_at timestamptz default now()
);

-- One row per skill per gymnast (skill_key matches keys in award tracker data)
create table if not exists gymnast_skills (
  id uuid primary key default gen_random_uuid(),
  gymnast_id uuid references gymnasts(id) on delete cascade not null,
  level integer not null check (level between 1 and 6),
  apparatus text not null, -- beam | bars | floor | rebound
  skill_key text not null,
  signed_off_by text not null,
  signed_off_at timestamptz default now(),
  unique(gymnast_id, skill_key)
);

-- Level sign-off (coach signs when all apparatus skills done)
create table if not exists gymnast_level_signoffs (
  id uuid primary key default gen_random_uuid(),
  gymnast_id uuid references gymnasts(id) on delete cascade not null,
  level integer not null check (level between 1 and 6),
  coach_name text not null,
  signed_at timestamptz default now(),
  unique(gymnast_id, level)
);

-- RLS
alter table gymnasts enable row level security;
alter table gymnast_skills enable row level security;
alter table gymnast_level_signoffs enable row level security;

create policy "Coaches manage own gymnasts"
  on gymnasts for all
  using (auth.uid() = coach_id)
  with check (auth.uid() = coach_id);

create policy "Coaches manage gymnast skills"
  on gymnast_skills for all
  using (gymnast_id in (select id from gymnasts where coach_id = auth.uid()))
  with check (gymnast_id in (select id from gymnasts where coach_id = auth.uid()));

create policy "Coaches manage gymnast level signoffs"
  on gymnast_level_signoffs for all
  using (gymnast_id in (select id from gymnasts where coach_id = auth.uid()))
  with check (gymnast_id in (select id from gymnasts where coach_id = auth.uid()));

create index if not exists gymnasts_coach_id on gymnasts(coach_id);
create index if not exists gymnast_skills_gymnast_id on gymnast_skills(gymnast_id);
create index if not exists gymnast_level_signoffs_gymnast_id on gymnast_level_signoffs(gymnast_id);
