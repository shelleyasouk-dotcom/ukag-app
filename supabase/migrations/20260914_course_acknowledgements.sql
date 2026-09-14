create table if not exists course_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id text not null,
  acknowledged_at timestamptz default now(),
  unique(user_id, course_id)
);

alter table course_acknowledgements enable row level security;

drop policy if exists "Users manage own acknowledgements" on course_acknowledgements;
create policy "Users manage own acknowledgements" on course_acknowledgements
  for all using (auth.uid() = user_id);

drop policy if exists "Admins view acknowledgements" on course_acknowledgements;
create policy "Admins view acknowledgements" on course_acknowledgements
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'assessor'))
  );
