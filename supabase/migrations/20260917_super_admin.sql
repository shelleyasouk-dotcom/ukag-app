-- Add super_admin flag to profiles
alter table profiles
  add column if not exists is_super_admin boolean not null default false;

-- Only super admins can update the is_super_admin flag on any profile.
-- Regular admins cannot elevate themselves or demote a super admin.
-- (The update policies for profiles are handled in application code;
--  this policy just ensures the DB enforces it too.)

-- Allow super admins to update any profile field including is_super_admin.
-- Regular admin update policy remains as-is (set in earlier migrations).
-- Note: if no prior update policy exists for admins on profiles, add one here.
create policy "Super admins update any profile"
  on profiles for update
  using (
    exists (select 1 from profiles where id = auth.uid() and is_super_admin = true)
  );
