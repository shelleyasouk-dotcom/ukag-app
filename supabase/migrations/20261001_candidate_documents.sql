-- Candidate Documents
-- Stores admin-uploaded certificates and assessment letters for coaching awards.
--
-- BEFORE running this migration, create the storage bucket in Supabase:
--   Dashboard → Storage → New bucket
--   Name: candidate-docs
--   Public: OFF (private)
--   File size limit: 10 MB
--   Allowed MIME types: application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document

CREATE TABLE IF NOT EXISTS candidate_documents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_key   text NOT NULL,
  document_type text NOT NULL CHECK (document_type IN ('certificate', 'letter')),
  file_name    text NOT NULL,
  storage_path text NOT NULL,
  uploaded_by  uuid REFERENCES profiles(id),
  uploaded_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_key, document_type)
);

ALTER TABLE candidate_documents ENABLE ROW LEVEL SECURITY;

-- Admins and super admins can read/write all documents
CREATE POLICY "Admins manage candidate documents"
  ON candidate_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND (role IN ('admin', 'area_lead') OR is_super_admin = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND (role IN ('admin', 'area_lead') OR is_super_admin = true)
    )
  );

-- Candidates can read their own documents
CREATE POLICY "Candidates read own documents"
  ON candidate_documents FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Storage RLS policies (run these in the SQL editor too):
--
-- Allow admins to upload/delete:
-- CREATE POLICY "Admins upload candidate docs"
--   ON storage.objects FOR INSERT TO authenticated
--   WITH CHECK (
--     bucket_id = 'candidate-docs'
--     AND EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE id = auth.uid()
--         AND (role IN ('admin', 'area_lead') OR is_super_admin = true)
--     )
--   );
--
-- CREATE POLICY "Admins delete candidate docs"
--   ON storage.objects FOR DELETE TO authenticated
--   USING (
--     bucket_id = 'candidate-docs'
--     AND EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE id = auth.uid()
--         AND (role IN ('admin', 'area_lead') OR is_super_admin = true)
--     )
--   );
--
-- Allow authenticated users to read (signed URLs handle access control):
-- CREATE POLICY "Authenticated users read candidate docs"
--   ON storage.objects FOR SELECT TO authenticated
--   USING (bucket_id = 'candidate-docs');
