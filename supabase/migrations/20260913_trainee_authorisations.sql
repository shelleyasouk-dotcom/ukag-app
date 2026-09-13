create table if not exists trainee_authorisations (
  id uuid primary key default gen_random_uuid(),
  -- Coach info
  coach_full_name text not null,
  date_of_birth date,
  ukag_membership_id text,
  user_id uuid references profiles(id) on delete set null,
  -- Qualifications
  level1_completion_date date not null,
  cpd_completion_date date not null,
  level2_start_date date,
  level2_expected_completion date,
  -- Compliance
  safeguarding_confirmed boolean not null default false,
  dbs_confirmed boolean not null default false,
  first_aid_confirmed boolean not null default false,
  -- Organisation
  organisation text,
  -- Authorisation
  authorisation_type text not null default 'trainee_level2_lead',
  authorised_by text not null,
  authorised_by_id uuid references profiles(id) on delete set null,
  authorisation_date date not null,
  expiry_date date,
  -- Status
  status text not null default 'active',
  notes text,
  -- Audit
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  completed_at timestamptz
);
alter table trainee_authorisations enable row level security;
drop policy if exists "Admins manage authorisations" on trainee_authorisations;
drop policy if exists "Users view own authorisation" on trainee_authorisations;
create policy "Admins manage authorisations" on trainee_authorisations for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Users view own authorisation" on trainee_authorisations for select using (
  auth.uid() = user_id
);
