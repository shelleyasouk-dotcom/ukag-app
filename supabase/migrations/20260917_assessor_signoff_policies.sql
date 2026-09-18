-- Allow assessors, area_leads, and admins to read and write practical_assessments
-- and practical_signoffs for candidates assigned to them.
-- Without this, the assessor view auto-create silently fails (RLS blocks the insert)
-- and the "Confirm Sign Off" button does nothing.

-- practical_assessments: assessors and admins can read any assigned candidate's record
create policy "Assessors read candidate assessments"
  on practical_assessments for select
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role in ('admin', 'area_lead')
    )
    or exists (
      select 1 from assessor_candidates
      where assessor_id = auth.uid() and candidate_id = practical_assessments.user_id
    )
  );

-- practical_assessments: assessors and admins can insert a record for a candidate
-- (needed when the candidate has never opened their portfolio)
create policy "Assessors insert candidate assessments"
  on practical_assessments for insert
  with check (
    exists (
      select 1 from profiles where id = auth.uid() and role in ('admin', 'area_lead')
    )
    or exists (
      select 1 from assessor_candidates
      where assessor_id = auth.uid() and candidate_id = practical_assessments.user_id
    )
  );

-- practical_assessments: assessors and admins can update a candidate's record
-- (needed for final declarations)
create policy "Assessors update candidate assessments"
  on practical_assessments for update
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role in ('admin', 'area_lead')
    )
    or exists (
      select 1 from assessor_candidates
      where assessor_id = auth.uid() and candidate_id = practical_assessments.user_id
    )
  );

-- practical_signoffs: assessors and admins can read sign-offs for assigned candidates
create policy "Assessors read candidate signoffs"
  on practical_signoffs for select
  using (
    exists (
      select 1 from practical_assessments pa
      join profiles pr on pr.id = auth.uid()
      where pa.id = practical_signoffs.assessment_id
        and pr.role in ('admin', 'area_lead')
    )
    or exists (
      select 1 from practical_assessments pa
      join assessor_candidates ac on ac.candidate_id = pa.user_id
      where pa.id = practical_signoffs.assessment_id
        and ac.assessor_id = auth.uid()
    )
  );

-- practical_signoffs: assessors and admins can insert/update sign-offs for candidates
create policy "Assessors insert candidate signoffs"
  on practical_signoffs for insert
  with check (
    exists (
      select 1 from practical_assessments pa
      join profiles pr on pr.id = auth.uid()
      where pa.id = practical_signoffs.assessment_id
        and pr.role in ('admin', 'area_lead')
    )
    or exists (
      select 1 from practical_assessments pa
      join assessor_candidates ac on ac.candidate_id = pa.user_id
      where pa.id = practical_signoffs.assessment_id
        and ac.assessor_id = auth.uid()
    )
  );

create policy "Assessors update candidate signoffs"
  on practical_signoffs for update
  using (
    exists (
      select 1 from practical_assessments pa
      join profiles pr on pr.id = auth.uid()
      where pa.id = practical_signoffs.assessment_id
        and pr.role in ('admin', 'area_lead')
    )
    or exists (
      select 1 from practical_assessments pa
      join assessor_candidates ac on ac.candidate_id = pa.user_id
      where pa.id = practical_signoffs.assessment_id
        and ac.assessor_id = auth.uid()
    )
  );
