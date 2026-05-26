-- ============================================================
-- UKAG Junior Coach Certificate — Seed Data
-- Run AFTER schema_quiz.sql in Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_course  UUID;
  v_w1 UUID; v_w2 UUID; v_w3 UUID; v_w4 UUID; v_w5 UUID;
  v_les UUID;
  v_q1 UUID; v_q2 UUID; v_q3 UUID; v_q4 UUID; v_q5 UUID;
  v_q6 UUID; v_q7 UUID; v_q8 UUID; v_q9 UUID; v_q10 UUID;
BEGIN

-- ============================================================
-- COURSE
-- ============================================================
INSERT INTO courses (title, discipline, course_type, description, status)
VALUES (
  'Junior Coach Certificate',
  'gymnastics',
  'Junior Coach Certificate',
  'The UKAG Junior Coach Certificate is an introductory qualification for young people aged 12-16 who want to develop their coaching skills and assist qualified coaches in a gymnastics club environment. The course covers your role and responsibilities, safe practice, professional boundaries, and key coaching values.',
  'open'
) RETURNING id INTO v_course;

-- ============================================================
-- WEEK 1: INTRODUCTION
-- ============================================================
INSERT INTO course_weeks (course_id, week_number, title, description)
VALUES (v_course, 1, 'Introduction', 'Welcome to the Junior Coach Certificate programme. Discover what it means to be a Junior Coach and how this course works.')
RETURNING id INTO v_w1;

-- Video
INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes)
VALUES (v_w1, 1, 'Introduction Video', 'video', 10);

-- Reading
INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes, content_placeholder)
VALUES (v_w1, 2, 'Welcome to the Junior Coach Certificate', 'reading', 15, $txt$
## Welcome to the UKAG Junior Coach Certificate

Welcome to UK Academies of Gymnastics! This course is designed for young coaches aged 12-16 who want to develop their gymnastics coaching skills and contribute positively to their club.

### What is the Junior Coach Certificate?

The Junior Coach Certificate is an introductory qualification that equips you with the knowledge and skills to assist qualified coaches in a gymnastics environment. By completing this course, you will:

- Understand your role and responsibilities as a Junior Coach
- Learn the importance of safe practice and appropriate boundaries
- Develop communication skills to work effectively with gymnasts and coaches
- Build confidence to support sessions under qualified supervision

### Your Role as a Junior Coach

As a Junior Coach, you will work **under the supervision** of a qualified gymnastics coach at all times. Your role is to **support and assist** - not to lead sessions independently.

You will help with:
- Demonstrating skills and exercises
- Spotting and supporting gymnasts during activities
- Encouraging and motivating participants
- Setting up and packing away equipment

---

### How This Course Works

This online course is divided into modules, each containing:
- A **video lesson** with voiceover commentary
- A **reading section** with key information
- A **quiz** to check your understanding

You must score **100%** on each module quiz before progressing. The final assessment requires **80%** to pass and earn your certificate.

### Getting Started

Take your time with each module. Read carefully, watch the videos, and use the quizzes to test your knowledge. You can retake quizzes as many times as needed.

**Good luck - we are excited to have you on board!**
$txt$);

-- Quiz
INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes, pass_threshold)
VALUES (v_w1, 3, 'Introduction Quiz', 'quiz', 15, 100)
RETURNING id INTO v_les;

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 1, 'What age range is the Junior Coach Certificate designed for?') RETURNING id INTO v_q1;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q1, 'A', '8-12', FALSE), (v_q1, 'B', '12-16', TRUE),
  (v_q1, 'C', '16-21', FALSE), (v_q1, 'D', 'Any age', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 2, 'When can a Junior Coach lead a gymnastics session independently?') RETURNING id INTO v_q2;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q2, 'A', 'After completing Module 1', FALSE),
  (v_q2, 'B', 'After passing the full certificate', FALSE),
  (v_q2, 'C', 'Never - always under qualified supervision', TRUE),
  (v_q2, 'D', 'When no qualified coach is available', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 3, 'What does the Junior Coach role primarily involve?') RETURNING id INTO v_q3;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q3, 'A', 'Planning and leading full sessions', FALSE),
  (v_q3, 'B', 'Supporting and assisting qualified coaches', TRUE),
  (v_q3, 'C', 'Making decisions about gymnast progression', FALSE),
  (v_q3, 'D', 'Conducting parent consultations', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 4, 'What percentage is required to pass each module quiz?') RETURNING id INTO v_q4;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q4, 'A', '60%', FALSE), (v_q4, 'B', '75%', FALSE),
  (v_q4, 'C', '80%', FALSE), (v_q4, 'D', '100%', TRUE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 5, 'Which of the following is a Junior Coach responsible for?') RETURNING id INTO v_q5;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q5, 'A', 'Awarding gymnastics badges', FALSE),
  (v_q5, 'B', 'Writing full session plans independently', FALSE),
  (v_q5, 'C', 'Demonstrating skills and encouraging gymnasts', TRUE),
  (v_q5, 'D', 'Conducting risk assessments independently', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 6, 'What is the minimum pass mark for the final assessment?') RETURNING id INTO v_q6;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q6, 'A', '60%', FALSE), (v_q6, 'B', '70%', FALSE),
  (v_q6, 'C', '80%', TRUE),  (v_q6, 'D', '100%', FALSE);


-- ============================================================
-- WEEK 2: RESPONSIBILITIES
-- ============================================================
INSERT INTO course_weeks (course_id, week_number, title, description)
VALUES (v_course, 2, 'Module 2: Your Role & Responsibilities', 'Learn about your duty of care, safeguarding responsibilities, health and safety, and professional conduct as a Junior Coach.')
RETURNING id INTO v_w2;

INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes)
VALUES (v_w2, 1, 'Responsibilities Video', 'video', 12);

INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes, content_placeholder)
VALUES (v_w2, 2, 'Your Role & Responsibilities', 'reading', 20, $txt$
## Module 2: Your Role & Responsibilities as a Junior Coach

### Duty of Care

As a Junior Coach, you have a **duty of care** to every gymnast you work with. This means you are responsible for taking reasonable steps to ensure their safety and wellbeing at all times.

This includes:
- Following all club rules and codes of conduct
- Reporting any concerns to a qualified coach or club welfare officer
- Never leaving gymnasts unsupervised
- Responding calmly and appropriately in emergency situations

---

### Safeguarding Responsibilities

Safeguarding means protecting children and young people from harm. As a Junior Coach, you must:

- **Always work with** a qualified adult coach present
- Be aware of signs that a gymnast may be struggling (physically or emotionally)
- Know who your club Welfare Officer is and how to contact them
- Never ignore or dismiss a concern - always pass it on

### Health & Safety in the Gym

A safe gym is everyone's responsibility. You should:

- Check equipment is set up correctly before use
- Ensure the training area is clear of hazards
- Know the location of first aid kits and emergency exits
- Report any damaged equipment to a qualified coach immediately

---

### Communication Guidelines

Good communication is at the heart of effective coaching. As a Junior Coach:

- Use **positive, encouraging language** at all times
- Avoid shouting or negative comments
- Speak clearly and at a level appropriate to the gymnast age
- Keep parents and guardians informed via the qualified coach - never through your own personal devices

### Professional Conduct

You represent UKAG and your club whenever you coach. This means:

- Arriving on time and dressed appropriately
- Putting the gymnasts needs first
- Respecting all coaches, gymnasts, and parents
- **Never coaching** when feeling unwell, upset, or distracted

---

### Summary

Your responsibilities as a Junior Coach can be summarised as:

- **Safety first** - always prioritise the wellbeing of gymnasts
- **Work within your limits** - only do what you are trained and authorised to do
- **Communicate and report** - never keep concerns to yourself
- **Be a positive role model** - your attitude and behaviour sets the tone
$txt$);

INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes, pass_threshold)
VALUES (v_w2, 3, 'Responsibilities Quiz', 'quiz', 15, 100)
RETURNING id INTO v_les;

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 1, 'What does duty of care mean for a Junior Coach?') RETURNING id INTO v_q1;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q1, 'A', 'Filling in registration forms', FALSE),
  (v_q1, 'B', 'Taking reasonable steps to ensure gymnasts safety and wellbeing', TRUE),
  (v_q1, 'C', 'Leading warm-up activities', FALSE),
  (v_q1, 'D', 'Keeping training records', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 2, 'Who should you report safeguarding concerns to?') RETURNING id INTO v_q2;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q2, 'A', 'The gymnast parents directly', FALSE),
  (v_q2, 'B', 'Your friends or family', FALSE),
  (v_q2, 'C', 'Your club Welfare Officer or a qualified coach', TRUE),
  (v_q2, 'D', 'Post on social media for advice', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 3, 'What should you do if you notice damaged equipment in the gym?') RETURNING id INTO v_q3;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q3, 'A', 'Try to fix it yourself', FALSE),
  (v_q3, 'B', 'Ignore it if it seems minor', FALSE),
  (v_q3, 'C', 'Report it to a qualified coach immediately', TRUE),
  (v_q3, 'D', 'Remove it and dispose of it', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 4, 'Which language approach should Junior Coaches use?') RETURNING id INTO v_q4;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q4, 'A', 'Firm and demanding', FALSE),
  (v_q4, 'B', 'Positive and encouraging', TRUE),
  (v_q4, 'C', 'Competitive and challenging', FALSE),
  (v_q4, 'D', 'Detailed and technical only', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 5, 'When should you coach if you are feeling unwell?') RETURNING id INTO v_q5;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q5, 'A', 'If it is just a mild cold', FALSE),
  (v_q5, 'B', 'Never - inform a qualified coach and step back', TRUE),
  (v_q5, 'C', 'Only for the first 30 minutes', FALSE),
  (v_q5, 'D', 'If no one else is available', FALSE);


-- ============================================================
-- WEEK 3: BOUNDARIES
-- ============================================================
INSERT INTO course_weeks (course_id, week_number, title, description)
VALUES (v_course, 3, 'Module 3: Boundaries & Safe Practice', 'Understand the professional, physical, social, and digital boundaries that keep everyone safe in the coaching environment.')
RETURNING id INTO v_w3;

INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes)
VALUES (v_w3, 1, 'Boundaries Video', 'video', 10);

INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes, content_placeholder)
VALUES (v_w3, 2, 'Boundaries & Safe Practice', 'reading', 20, $txt$
## Module 3: Boundaries & Safe Practice

### What Are Boundaries?

Boundaries are the professional and personal limits that keep everyone safe in a coaching environment. As a Junior Coach, understanding and maintaining appropriate boundaries is one of the most important parts of your role.

Good boundaries protect:
- The gymnasts you work with
- You as a Junior Coach
- Your club and UKAG

---

### Physical Boundaries

In gymnastics, physical contact is sometimes necessary for **spotting and supporting** gymnasts. However, it must always be:

- **Appropriate and necessary** - only touch when required for safety or technique
- **Explained first** - always tell the gymnast where and why you are going to make contact
- **Welcomed** - stop immediately if a gymnast shows discomfort or asks you to stop
- **Witnessed** - always work in view of a qualified adult coach

You should **never**:
- Use physical contact as a reward or punishment
- Make contact that is not related to the gymnastics activity
- Be alone with a gymnast in a private space

---

### Emotional & Social Boundaries

As a Junior Coach, you should maintain a **warm but professional** relationship with gymnasts. This means:

- Being friendly and supportive without forming special individual relationships
- Avoiding sharing personal problems with gymnasts
- Not accepting gifts or money from gymnasts or their families
- Treating all gymnasts equally and fairly

---

### Online & Social Media Boundaries

**UKAG digital safeguarding policy states:**

- Do **not** follow, friend, or message gymnasts on personal social media accounts
- Do **not** share photos or videos of gymnasts without club permission
- Any club communication should go through the club official channels only
- If a gymnast contacts you personally online, inform a qualified coach immediately

---

### Recognising & Reporting Concerns

If you are ever concerned about a gymnast safety or wellbeing, you **must** report it. This includes:

- Physical marks or injuries that seem unusual
- Changes in behaviour (becoming withdrawn, upset, or anxious)
- Something a gymnast tells you about their home life
- Any behaviour by an adult that makes you uncomfortable

**How to report:**
- Do not investigate yourself
- Tell your club Welfare Officer or a qualified coach immediately
- Write down what you saw or heard (date, time, what was said)
- Do not promise to keep secrets

---

### Remember

Boundaries are not about being unfriendly - they are about creating a **safe, professional, and positive** environment for everyone. When in doubt, always ask a qualified coach for guidance.
$txt$);

INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes, pass_threshold)
VALUES (v_w3, 3, 'Boundaries Quiz', 'quiz', 15, 100)
RETURNING id INTO v_les;

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 1, 'When is physical contact in gymnastics appropriate?') RETURNING id INTO v_q1;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q1, 'A', 'As a reward for good performance', FALSE),
  (v_q1, 'B', 'When necessary for spotting or safety, explained and agreed beforehand', TRUE),
  (v_q1, 'C', 'Whenever it helps build rapport with gymnasts', FALSE),
  (v_q1, 'D', 'Physical contact should never occur in gymnastics', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 2, 'What is UKAG policy on social media contact with gymnasts?') RETURNING id INTO v_q2;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q2, 'A', 'You may message gymnasts about training schedules', FALSE),
  (v_q2, 'B', 'You may follow gymnasts on your personal accounts', FALSE),
  (v_q2, 'C', 'All contact should be through official club channels only', TRUE),
  (v_q2, 'D', 'Video calls for coaching are encouraged', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 3, 'If a gymnast tells you something that worries you about their wellbeing, what should you do?') RETURNING id INTO v_q3;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q3, 'A', 'Promise to keep it secret and try to help them yourself', FALSE),
  (v_q3, 'B', 'Ignore it if they say they are fine', FALSE),
  (v_q3, 'C', 'Report your concern to a Welfare Officer or qualified coach immediately', TRUE),
  (v_q3, 'D', 'Speak to the gymnast parents yourself', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 4, 'Why is it important to always work in view of a qualified coach?') RETURNING id INTO v_q4;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q4, 'A', 'So they can help you with demonstrations', FALSE),
  (v_q4, 'B', 'To ensure appropriate supervision and safeguarding for everyone', TRUE),
  (v_q4, 'C', 'Because you need permission to speak to gymnasts', FALSE),
  (v_q4, 'D', 'So they can award your coaching hours', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 5, 'Which of the following describes an appropriate boundary in coaching?') RETURNING id INTO v_q5;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q5, 'A', 'Being best friends with gymnasts outside of the club', FALSE),
  (v_q5, 'B', 'Treating all gymnasts equally and maintaining a professional relationship', TRUE),
  (v_q5, 'C', 'Giving gifts to gymnasts who work especially hard', FALSE),
  (v_q5, 'D', 'Messaging gymnasts you have met through personal social media', FALSE);


-- ============================================================
-- WEEK 4: MODULE 4 (placeholder until PDF is uploaded)
-- ============================================================
INSERT INTO course_weeks (course_id, week_number, title, description)
VALUES (v_course, 4, 'Module 4', 'Content for Module 4 will be published shortly. Check back soon!')
RETURNING id INTO v_w4;

INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes)
VALUES (v_w4, 1, 'Module 4 Video', 'video', 15);

INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes, content_placeholder)
VALUES (v_w4, 2, 'Module 4 Reading', 'reading', 20, $txt$
## Module 4

This module is coming soon. We are uploading the materials now - please check back shortly.
$txt$);


-- ============================================================
-- WEEK 5: FINAL ASSESSMENT
-- ============================================================
INSERT INTO course_weeks (course_id, week_number, title, description)
VALUES (v_course, 5, 'Final Assessment & Recap', 'Review everything you have learned and complete your final assessment. You need 80% to pass and earn your Junior Coach Certificate.')
RETURNING id INTO v_w5;

INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes)
VALUES (v_w5, 1, 'Course Recap Video', 'video', 15);

INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes, content_placeholder)
VALUES (v_w5, 2, 'Key Points Review', 'reading', 10, $txt$
## Final Assessment: Key Points Review

Before you take your final assessment, here is a summary of the key points from all modules.

---

### Module 1: Introduction

- The Junior Coach Certificate is for young people aged **12-16**
- Your role is to **support and assist** qualified coaches - never lead independently
- Module quizzes require **100%**; the final assessment requires **80%**

---

### Module 2: Responsibilities

- You have a **duty of care** to every gymnast you work with
- Safeguarding concerns must be reported to your **Welfare Officer** or a qualified coach
- Use **positive, encouraging language** at all times
- Do not coach if unwell - inform a qualified coach and step back

---

### Module 3: Boundaries

- Physical contact must be **appropriate, explained, and witnessed** - never when alone
- Do **not** contact gymnasts through personal social media accounts
- If a gymnast shares a concern, report it - **never promise to keep secrets**
- Work in view of a qualified adult coach at **all times**

---

### You are almost there!

When you are ready, proceed to the **Final Assessment**. You can use your notes, but try to answer from memory first.

**Good luck!**
$txt$);

INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes, pass_threshold)
VALUES (v_w5, 3, 'Final Assessment', 'quiz', 30, 80)
RETURNING id INTO v_les;

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 1, 'The Junior Coach Certificate is designed for which age group?') RETURNING id INTO v_q1;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q1, 'A', '8-12', FALSE), (v_q1, 'B', '12-16', TRUE),
  (v_q1, 'C', '16-21', FALSE), (v_q1, 'D', 'Adults only', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 2, 'As a Junior Coach, when can you lead a session without a qualified coach present?') RETURNING id INTO v_q2;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q2, 'A', 'After completing the full certificate', FALSE),
  (v_q2, 'B', 'In an emergency only', FALSE),
  (v_q2, 'C', 'Never', TRUE),
  (v_q2, 'D', 'When agreed with the club manager', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 3, 'What does safeguarding mean?') RETURNING id INTO v_q3;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q3, 'A', 'Checking equipment before use', FALSE),
  (v_q3, 'B', 'Protecting children and young people from harm', TRUE),
  (v_q3, 'C', 'Following health and safety rules', FALSE),
  (v_q3, 'D', 'Signing attendance registers', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 4, 'If you notice a gymnast has unexplained bruising, what should you do?') RETURNING id INTO v_q4;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q4, 'A', 'Ask the gymnast how it happened and decide if it is serious', FALSE),
  (v_q4, 'B', 'Ignore it unless the gymnast says something', FALSE),
  (v_q4, 'C', 'Report it to the Welfare Officer or a qualified coach', TRUE),
  (v_q4, 'D', 'Tell other gymnasts to be careful around them', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 5, 'What is the correct approach to physical contact during spotting?') RETURNING id INTO v_q5;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q5, 'A', 'Use contact freely if you think it will help', FALSE),
  (v_q5, 'B', 'Always explain and get agreement before making contact', TRUE),
  (v_q5, 'C', 'Avoid all contact even if there is a safety risk', FALSE),
  (v_q5, 'D', 'Only use contact for elite gymnasts', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 6, 'Which of the following is an inappropriate use of social media as a Junior Coach?') RETURNING id INTO v_q6;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q6, 'A', 'Sharing club newsletters on the club official page', FALSE),
  (v_q6, 'B', 'Messaging a gymnast on your personal social media account', TRUE),
  (v_q6, 'C', 'Watching club-approved training videos', FALSE),
  (v_q6, 'D', 'Viewing the club official social media posts', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 7, 'A gymnast asks you to keep something secret. What do you do?') RETURNING id INTO v_q7;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q7, 'A', 'Keep the secret - building trust is important', FALSE),
  (v_q7, 'B', 'Only share it if you think it is very serious', FALSE),
  (v_q7, 'C', 'Report your concern to a qualified adult regardless', TRUE),
  (v_q7, 'D', 'Write it down but take no further action', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 8, 'What should you do if club equipment is damaged?') RETURNING id INTO v_q8;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q8, 'A', 'Try to repair it yourself', FALSE),
  (v_q8, 'B', 'Put it aside and say nothing', FALSE),
  (v_q8, 'C', 'Report it to a qualified coach immediately', TRUE),
  (v_q8, 'D', 'Continue using it if the damage seems minor', FALSE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 9, 'Good communication as a Junior Coach includes:') RETURNING id INTO v_q9;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q9, 'A', 'Using highly technical language with all gymnasts', FALSE),
  (v_q9, 'B', 'Shouting instructions across the gym', FALSE),
  (v_q9, 'C', 'Sending individual messages to gymnasts', FALSE),
  (v_q9, 'D', 'Using positive, clear, and age-appropriate language', TRUE);

INSERT INTO quiz_questions (lesson_id, question_number, question_text)
VALUES (v_les, 10, 'Why is professional conduct important for Junior Coaches?') RETURNING id INTO v_q10;
INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
  (v_q10, 'A', 'Because it earns better marks on your certificate', FALSE),
  (v_q10, 'B', 'Because you represent UKAG and your club, and gymnasts look up to you', TRUE),
  (v_q10, 'C', 'Because it is a legal requirement', FALSE),
  (v_q10, 'D', 'Because the club monitors your every behaviour', FALSE);

END $$;
