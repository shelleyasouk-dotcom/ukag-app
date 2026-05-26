-- ============================================================
-- Module 4 & Recap Update
-- Run this if you already ran seed_junior_coach.sql
-- It replaces the Week 4 placeholder with real content
-- and updates the Week 5 recap reading.
-- ============================================================

DO $$
DECLARE
  v_course UUID;
  v_w4     UUID;
  v_w5     UUID;
  v_les    UUID;
  v_q1 UUID; v_q2 UUID; v_q3 UUID; v_q4 UUID; v_q5 UUID;
BEGIN

  -- Find the Junior Coach Certificate course
  SELECT id INTO v_course
  FROM courses
  WHERE course_type = 'Junior Coach Certificate'
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Junior Coach Certificate course not found. Run seed_junior_coach.sql first.';
  END IF;

  -- Find Week 4
  SELECT id INTO v_w4
  FROM course_weeks
  WHERE course_id = v_course AND week_number = 4;

  -- Find Week 5
  SELECT id INTO v_w5
  FROM course_weeks
  WHERE course_id = v_course AND week_number = 5;

  -- Update Week 4 description
  UPDATE course_weeks
  SET title = 'Module 4: Supporting Basic Gymnastics',
      description = 'Learn how to support gymnasts working towards their UKAG Level 1 award across floor, beam, bars, and rebound. Includes how to assist with awards recording.'
  WHERE id = v_w4;

  -- Remove placeholder lessons for Week 4
  DELETE FROM course_lessons WHERE week_id = v_w4;

  -- ── Week 4 Video lesson
  INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes)
  VALUES (v_w4, 1, 'Module 4 Video', 'video', 18);

  -- ── Week 4 Reading lesson
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

These shapes build flexibility and control and appear throughout gymnastics at all levels.

**Dish, Hollow and Superman (Arch)**

- **Dish/Hollow** - gymnast lies on their back with arms and legs lifted off the floor
- **Superman/Arch** - gymnast lies on their front with arms and legs lifted

These positions develop the core body tension needed for all gymnastics skills.

**Front Support and Back Support**

- **Front support** is like the start of a press-up position
- **Back support** has the arms behind the body with the chest lifted high

Encourage correct shapes and remind gymnasts to stay tight throughout.

**Forward Roll down an Incline**

Focus on gymnasts tucking their head correctly and rolling smoothly. Begin on an inclined mat to help gymnasts find momentum safely.

**Bunny Hops**

Bunny hops develop arm strength, coordination, and confidence. Gymnasts move their weight through their hands - encourage them to keep arms straight and look forward.

**Straight Jumps**

Remind gymnasts to land with knees bent and feet together. Teach the **Block and Present** finish: feet together, knees absorb the landing, arms raise up.

Give praise for every effort and encourage correct body shapes at all times.

---

### Beam Skills (UKAG Level 1)

Level 1 beam work is all about **confidence and balance**. Always begin on a floor beam or two upturned benches before using any raised equipment.

Level 1 beam skills include:

- **Straddle mount** - stepping or jumping onto the beam with legs apart
- **Tiptoe walk** - walking along the beam on tiptoes
- **Diddy walk** - a crouched walk along the beam for balance
- **Leg lifts while walking** - lifting each leg to the side or front while moving along
- **Straight jump dismount** - finishing with a controlled jump off the end

**Your role on beam:** Stand alongside the gymnast to give confidence, offer a supporting hand if needed, and give positive encouragement. Always ensure mats are placed alongside and underneath the beam.

---

### Bar Skills (UKAG Level 1)

At Level 1, gymnasts work on developing hanging strength and body control on the low bar:

- **Hanging in Tuck, Straddle, and Pike shapes** - holding body tension while suspended
- **Rocking between Dish and Arch shapes while hanging** - developing swing control
- **Front support position on the low bar** - arms straight, body above the bar

Always ensure mats are positioned correctly and work alongside the lead coach during bar activities. Never leave gymnasts on bars unsupervised.

---

### Rebound Skills (UKAG Level 1)

Rebound activities focus on **jumping, coordination, and controlled landings**.

**Running Approach into a Hurdle Step**

Gymnasts start with a running approach into a hurdle step - they take off on one foot and land on two feet onto the springboard. This prepares them for safe and powerful jumping.

**Straight Jump from Springboard**

Gymnasts jump from the springboard onto landing mats. Mats must always be placed securely. The landing position is: **knees bent, feet together, arms raised**.

**Hand-to-Foot Squat onto a Low Platform**

Gymnasts learn to squat from the springboard onto a low platform. This builds confidence for vaulting movements later on, while keeping the height low and safe.

**Landings**

An important part of rebound is the landing. Gymnasts practise the **Block and Present** position:
- Feet together
- Knees bent to absorb impact
- Arms raised up

Then they hold still to **stick the landing** and show control.

**Your role in rebound:**
- Focus gymnasts on strong take-offs and controlled landings
- Check mats are always securely in place before each attempt
- Keep side activities simple while the lead coach gives individual support
- **Motivate gymnasts and remind them of safe habits** that will carry through into higher levels

---

### Helping with Awards Recording

When gymnasts are ready, the lead coach will assess their skills for the UKAG Level 1 award. Your role is to:

- Help set up assessment stations
- Encourage gymnasts and remind them of the skill requirements
- Record information as directed by the lead coach

**Important:** You should never make the final decision on whether a skill is passed. Award decisions are always the lead coach responsibility.
$txt$);

  -- ── Week 4 Quiz
  INSERT INTO course_lessons (week_id, lesson_number, title, type, duration_minutes, pass_threshold)
  VALUES (v_w4, 3, 'Module 4 Quiz', 'quiz', 15, 100)
  RETURNING id INTO v_les;

  INSERT INTO quiz_questions (lesson_id, question_number, question_text)
  VALUES (v_les, 1, 'What are the three basic body shapes gymnasts learn at UKAG Level 1?') RETURNING id INTO v_q1;
  INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
    (v_q1, 'A', 'Straight, Bent, and Twisted', FALSE),
    (v_q1, 'B', 'Tuck, Straddle, and Pike', TRUE),
    (v_q1, 'C', 'Forward, Backward, and Sideways', FALSE),
    (v_q1, 'D', 'Circle, Square, and Triangle', FALSE);

  INSERT INTO quiz_questions (lesson_id, question_number, question_text)
  VALUES (v_les, 2, 'When practising straight jumps, how should gymnasts land?') RETURNING id INTO v_q2;
  INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
    (v_q2, 'A', 'On tiptoes with legs completely straight', FALSE),
    (v_q2, 'B', 'Knees bent, feet together, arms raised', TRUE),
    (v_q2, 'C', 'Sitting back onto the mat for safety', FALSE),
    (v_q2, 'D', 'On one foot first, transferring to two', FALSE);

  INSERT INTO quiz_questions (lesson_id, question_number, question_text)
  VALUES (v_les, 3, 'What is a Junior Coach role when gymnasts are being assessed for their UKAG Level 1 award?') RETURNING id INTO v_q3;
  INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
    (v_q3, 'A', 'To decide which skills meet the pass criteria', FALSE),
    (v_q3, 'B', 'To lead the assessment session independently', FALSE),
    (v_q3, 'C', 'To help with setup, encourage gymnasts, and record as directed by the lead coach', TRUE),
    (v_q3, 'D', 'To award gymnasts their Level 1 badge at the end', FALSE);

  INSERT INTO quiz_questions (lesson_id, question_number, question_text)
  VALUES (v_les, 4, 'What must always be checked before gymnasts use the springboard in rebound?') RETURNING id INTO v_q4;
  INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
    (v_q4, 'A', 'That gymnasts have completed 20 minutes of warm-up', FALSE),
    (v_q4, 'B', 'That mats are always securely placed', TRUE),
    (v_q4, 'C', 'That parents have provided written permission', FALSE),
    (v_q4, 'D', 'That the session is being filmed for review', FALSE);

  INSERT INTO quiz_questions (lesson_id, question_number, question_text)
  VALUES (v_les, 5, 'Which of these is a Level 1 beam skill?') RETURNING id INTO v_q5;
  INSERT INTO quiz_options (question_id, option_letter, option_text, is_correct) VALUES
    (v_q5, 'A', 'Back walkover', FALSE),
    (v_q5, 'B', 'Cartwheel onto the beam', FALSE),
    (v_q5, 'C', 'Tiptoe walk', TRUE),
    (v_q5, 'D', 'Round-off dismount', FALSE);

  -- ── Update Week 5 recap reading to include Module 4
  UPDATE course_lessons
  SET content_placeholder = $txt$
## Final Assessment: Key Points Review

Before you take your final assessment, here is a summary of the key points from all four modules.

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

### Module 4: Supporting Basic Gymnastics

- Focus on **UKAG Level 1 skills**: floor, beam, bars, and rebound
- Level 1 body shapes: **Tuck, Straddle, and Pike**; also Dish, Arch, Front Support, Back Support
- Straight jumps: land with **knees bent, feet together** (Block and Present)
- Beam work begins on a **floor beam or benches** for confidence and balance
- Bar skills include hanging in shapes and front support on the low bar
- Rebound: mats must always be **securely placed**; focus on controlled landings
- Your role in awards recording is to **support the lead coach** - never make pass decisions yourself

---

### You are almost there!

When you are ready, proceed to the **Final Assessment**. You can use your notes, but try to answer from memory first. You need **80% or more** to pass.

**Good luck!**
$txt$
  WHERE week_id = v_w5
  AND title = 'Key Points Review';

END $$;
