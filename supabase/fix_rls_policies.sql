-- ============================================================
-- FIX: RLS policies for online course tables + profile updates
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── course_enrollments ──────────────────────────────────────
-- Coaches can see their own enrollments
-- Admins can read, insert, and delete any enrollment
alter table course_enrollments enable row level security;

drop policy if exists "enrollments_select_own" on course_enrollments;
create policy "enrollments_select_own" on course_enrollments
  for select using (user_id = auth.uid() or current_user_role() = 'admin');

drop policy if exists "enrollments_insert_admin" on course_enrollments;
create policy "enrollments_insert_admin" on course_enrollments
  for insert with check (current_user_role() = 'admin');

drop policy if exists "enrollments_delete_admin" on course_enrollments;
create policy "enrollments_delete_admin" on course_enrollments
  for delete using (current_user_role() = 'admin');

-- ── course_access_requests ──────────────────────────────────
-- Coaches can submit and read their own requests
-- Admins can read and update all requests
alter table course_access_requests enable row level security;

drop policy if exists "requests_select" on course_access_requests;
create policy "requests_select" on course_access_requests
  for select using (user_id = auth.uid() or current_user_role() = 'admin');

drop policy if exists "requests_insert_own" on course_access_requests;
create policy "requests_insert_own" on course_access_requests
  for insert with check (user_id = auth.uid());

drop policy if exists "requests_update_admin" on course_access_requests;
create policy "requests_update_admin" on course_access_requests
  for update using (current_user_role() = 'admin');

-- ── course_progress ─────────────────────────────────────────
-- Coaches can read and write their own progress
-- Admins can read all progress
alter table course_progress enable row level security;

drop policy if exists "progress_select" on course_progress;
create policy "progress_select" on course_progress
  for select using (user_id = auth.uid() or current_user_role() = 'admin');

drop policy if exists "progress_insert_own" on course_progress;
create policy "progress_insert_own" on course_progress
  for insert with check (user_id = auth.uid());

drop policy if exists "progress_upsert_own" on course_progress;
create policy "progress_upsert_own" on course_progress
  for update using (user_id = auth.uid());

-- ── course_certificates ─────────────────────────────────────
-- Coaches can read their own certificates
-- Admins can read all and insert (awarded on completion)
alter table course_certificates enable row level security;

drop policy if exists "certs_select" on course_certificates;
create policy "certs_select" on course_certificates
  for select using (user_id = auth.uid() or current_user_role() = 'admin');

drop policy if exists "certs_insert_own" on course_certificates;
create policy "certs_insert_own" on course_certificates
  for insert with check (user_id = auth.uid() or current_user_role() = 'admin');

-- ── profiles (update) ───────────────────────────────────────
-- Make sure admins can update any profile (role change)
drop policy if exists "profiles_update" on profiles;
create policy "profiles_update" on profiles
  for update using (auth.uid() = id or current_user_role() = 'admin');
