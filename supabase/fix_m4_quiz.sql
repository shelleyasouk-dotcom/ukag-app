-- ============================================================
-- Fix: Ensure Module 4 quiz lesson exists with questions
-- Safe to run multiple times (idempotent)
-- ============================================================

DO $$
DECLARE
  v_course UUID;
  v_w4     UUID;
  v_quiz   UUID;
  v_q1 UUID; v_q2 UUID; v_q3 UUID; v_q4 UUID; v_q5 UUID;
BEGIN
  -- Find course
  SELECT id INTO v_course
  FROM courses WHERE course_type = 'Junior Coach Certificate'
  ORDER BY created_at DESC LIMIT 1;

  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Junior Coach Certificate not found — run seed_junior_coach.sql first';
  END IF;

  -- Find / create week 4
  SELECT id INTO v_w4
  FROM course_weeks WHERE course_id = v_course AND week_number = 4;

  IF v_w4 IS NULL THEN
    INSERT INTO course_weeks (course_id, week_number, title, description)
    VALUES (
      v_course, 4,
      'Module 4: Supporting Basic Gymnastics',
      'Learn how to support gymnasts working towards their UKAG Level 1 award across floor, beam, bars, and rebound.'
    ) RETURNING id INTO v_w4;
  ELSE
    UPDATE course_weeks
    SET title = 'Module 4: Supporting Basic Gymnastics',
        description = 'Learn how to support gymnasts working towards their UKAG Level 1 award across floor, beam, bars, and rebound.'
    WHERE id = v_w4;
  END IF;

  -- Ensure video + reading lessons exist
  IF NOT EXISTS (SELECT 1 FROM course_lessons WHERE week_id = v_w4 AND type = 'video') THEN
    INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes)
    VALUES (v_w4, 1, 'Module 4 Video', 'video', 18);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM course_lessons WHERE week_id = v_w4 AND type = 'reading') THEN
    INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes, content_placeholder)
    VALUES (v_w4, 2, 'Supporting Basic Gymnastics', 'reading', 25, $txt$
## Module 4: Supporting Basic Gymnastics

In this module you will learn how to support gymnasts working towards their UKAG Level 1 award. Your role is always to assist the lead coach - never to lead a session independently.

---

### Floor Skills (UKAG Level 1)

**Basic Body Shapes**

At Level 1, gymnasts learn three fundamental shapes. Encourage gymnasts to hold each shape with control and body tension:

- **Tuck** - knees pulled tightly into the chest
- **Straddle** - legs apart in a wide V shape
- **Pike** - legs together, straight out in front

**Dish, Hollow and Superman**

- **Dish/Hollow** - gymnast lies on their back with arms and legs lifted
- **Superman/Arch** - gymnast lies on their front with arms and legs lifted

These positions develop core body tension needed for all gymnastics skills.

**Front Support and Back Support**

- **Front support** is like the start of a press-up position
- **Back support** has the arms behind the body with the chest lifted high

**Forward Roll down an Incline**

Focus on gymnasts tucking their head correctly and rolling smoothly. Begin on an inclined mat.

**Bunny Hops**

Develop arm strength, coordination, and confidence. Gymnasts move their weight through their hands.

**Straight Jumps**

Remind gymnasts to land with knees bent and feet together. Teach the **Block and Present** finish.

Encourage correct body shapes and give praise for every effort.

---

### Beam Skills (UKAG Level 1)

Level 1 beam work is all about **confidence and balance**. Always begin on a floor beam or two upturned benches.

Level 1 beam skills include:

- **Straddle mount** - stepping or jumping onto the beam with legs apart
- **Tiptoe walk** - walking along the beam on tiptoes
- **Diddy walk** - a crouched walk along the beam for balance
- **Leg lifts while walking** - lifting each leg while moving along
- **Straight jump dismount** - finishing with a controlled jump off the end

Stand alongside the gymnast to give confidence and positive encouragement. Always ensure mats are placed alongside and underneath.

---

### Bar Skills (UKAG Level 1)

At Level 1, gymnasts develop hanging strength and body control:

- **Hanging in Tuck, Straddle, and Pike shapes**
- **Rocking between Dish and Arch shapes while hanging**
- **Front support position on the low bar** - arms straight, body above the bar

Always ensure mats are correctly positioned and work alongside the lead coach.

---

### Rebound Skills (UKAG Level 1)

Rebound activities focus on **jumping, coordination, and controlled landings**.

**Running Approach into a Hurdle Step**

Gymnasts take off on one foot and land on two feet onto the springboard. This prepares them for safe and powerful jumping.

**Straight Jump from Springboard**

Mats must always be placed securely. Landing position: **knees bent, feet together, arms raised**.

**Hand-to-Foot Squat onto a Low Platform**

Builds confidence for vaulting movements later on, while keeping the height low and safe.

**Landings — Block and Present**

Feet together, knees bent to absorb impact, arms raised — then hold still to stick the landing and show control.

**Your role in rebound:**
- Focus gymnasts on strong take-offs and controlled landings
- Check mats are always securely in place before each attempt
- Keep side activities simple while the lead coach gives individual support
- Motivate gymnasts and remind them of safe habits that will carry into higher levels

---

### Helping with Awards Recording

Your role is to help with setup, encourage gymnasts, and record as directed by the lead coach.

**Important:** You should never make the final decision on whether a skill is passed. Award decisions are always the lead coach responsibility.
$txt$);
  END IF;

  -- Find or create quiz lesson
  SELECT id INTO v_quiz FROM course_lessons
  WHERE week_id = v_w4 AND type = 'quiz' LIMIT 1;

  IF v_quiz IS NULL THEN
    INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes, pass_threshold)
    VALUES (v_w4, 3, 'Module 4 Quiz', 'quiz', 15, 100)
    RETURNING id INTO v_quiz;
  END IF;

  -- Add questions only if none exist yet
  IF NOT EXISTS (SELECT 1 FROM quiz_questions WHERE lesson_id = v_quiz) THEN

    INSERT INTO quiz_questions (lesson_id, question_number, question_text)
    VALUES (v_quiz, 1, 'What are the three basic body shapes gymnasts learn at UKAG Level 1?') RETURNING id INTO v_q1;
    INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
      (v_q1, 'A', 'Straight, Bent, and Twisted', FALSE),
      (v_q1, 'B', 'Tuck, Straddle, and Pike', TRUE),
      (v_q1, 'C', 'Forward, Backward, and Sideways', FALSE),
      (v_q1, 'D', 'Circle, Square, and Triangle', FALSE);

    INSERT INTO quiz_questions (lesson_id, question_number, question_text)
    VALUES (v_quiz, 2, 'When practising straight jumps, how should gymnasts land?') RETURNING id INTO v_q2;
    INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
      (v_q2, 'A', 'On tiptoes with legs completely straight', FALSE),
      (v_q2, 'B', 'Knees bent, feet together, arms raised', TRUE),
      (v_q2, 'C', 'Sitting back onto the mat for safety', FALSE),
      (v_q2, 'D', 'On one foot first, transferring to two', FALSE);

    INSERT INTO quiz_questions (lesson_id, question_number, question_text)
    VALUES (v_quiz, 3, 'What is a Junior Coach role when gymnasts are assessed for their UKAG Level 1 award?') RETURNING id INTO v_q3;
    INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
      (v_q3, 'A', 'To decide which skills meet the pass criteria', FALSE),
      (v_q3, 'B', 'To lead the assessment session independently', FALSE),
      (v_q3, 'C', 'To help with setup, encourage gymnasts, and record as directed by the lead coach', TRUE),
      (v_q3, 'D', 'To award gymnasts their Level 1 badge at the end', FALSE);

    INSERT INTO quiz_questions (lesson_id, question_number, question_text)
    VALUES (v_quiz, 4, 'What must always be checked before gymnasts use the springboard in rebound?') RETURNING id INTO v_q4;
    INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
      (v_q4, 'A', 'That gymnasts have completed 20 minutes of warm-up', FALSE),
      (v_q4, 'B', 'That mats are always securely placed', TRUE),
      (v_q4, 'C', 'That parents have provided written permission', FALSE),
      (v_q4, 'D', 'That the session is being filmed for review', FALSE);

    INSERT INTO quiz_questions (lesson_id, question_number, question_text)
    VALUES (v_quiz, 5, 'Which of these is a Level 1 beam skill?') RETURNING id INTO v_q5;
    INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
      (v_q5, 'A', 'Back walkover', FALSE),
      (v_q5, 'B', 'Cartwheel onto the beam', FALSE),
      (v_q5, 'C', 'Tiptoe walk', TRUE),
      (v_q5, 'D', 'Round-off dismount', FALSE);

  END IF;
END $$;
