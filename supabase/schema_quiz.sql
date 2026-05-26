-- ============================================================
-- UKAG Quiz Schema — run once in Supabase SQL Editor
-- ============================================================

-- Add quiz/video columns to course_lessons
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS pass_threshold INT DEFAULT 100;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Quiz questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id     UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, question_number)
);

-- Quiz options
CREATE TABLE IF NOT EXISTS quiz_options (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id   UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_letter CHAR(1) NOT NULL,
  option_text   TEXT NOT NULL,
  is_correct    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id, option_letter)
);

-- Quiz attempts (history per user)
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id       UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score           INT NOT NULL,
  total_questions INT NOT NULL,
  passed          BOOLEAN NOT NULL,
  answers         JSONB,
  attempted_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_options   ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts  ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "auth_read_quiz_questions" ON quiz_questions;
CREATE POLICY "auth_read_quiz_questions" ON quiz_questions
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "admin_all_quiz_questions" ON quiz_questions;
CREATE POLICY "admin_all_quiz_questions" ON quiz_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "auth_read_quiz_options" ON quiz_options;
CREATE POLICY "auth_read_quiz_options" ON quiz_options
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "admin_all_quiz_options" ON quiz_options;
CREATE POLICY "admin_all_quiz_options" ON quiz_options
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "own_quiz_attempts" ON quiz_attempts;
CREATE POLICY "own_quiz_attempts" ON quiz_attempts
  FOR ALL USING (
    profile_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
