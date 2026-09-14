-- Allow admins to insert, update and delete course certificates for any user
-- (needed for the 'Issue Prior Learning Certificate' admin feature)

drop policy if exists "certs_admin_all" on course_certificates;
create policy "certs_admin_all" on course_certificates
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Ensure select covers assessors too
drop policy if exists "certs_select" on course_certificates;
create policy "certs_select" on course_certificates
  for select using (
    user_id = auth.uid() or
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'assessor'))
  );

-- Keep coaches inserting their own certs (from module completion)
drop policy if exists "certs_insert_own" on course_certificates;
create policy "certs_insert_own" on course_certificates
  for insert with check (
    user_id = auth.uid()
  );
