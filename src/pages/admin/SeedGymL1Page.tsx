import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { CheckCircle, PlayCircle, BookOpen, HelpCircle, Upload } from 'lucide-react'

// ── Full course data extracted from UKAG_Gymnastics_L1_Coaching_Certificate_Course_Pack.docx ──

const WEEK1_READING = `WEEK 1 — ROLE, RESPONSIBILITIES & SESSION STRUCTURE

SESSION OBJECTIVES
By the end of this session you will:
• Understand the role of a UKAG Level 1 Coach
• Be clear on your responsibilities and boundaries
• Understand UKAG best practice expectations
• Know your coaching scope for Awards Levels 1–3
• Know what you need to complete after today's session

─────────────────────────────────────────

THE ROLE OF A UKAG LEVEL 1 COACH

As a UKAG Level 1 Coach, you are trained to:
• Lead a small group of gymnasts (typically 4–8 children)
• Coach basic and early intermediate skills across Floor, Vault, Beam and Bars
• Lead warm-ups and cool-downs
• Support Awards skill development for Levels 1–3
• Work under the direction of a Lead Coach

─────────────────────────────────────────

ROLE BOUNDARIES — BEST PRACTICE

There are clear boundaries to your role. These are not limitations — they are what makes coaching at this level safe and effective.

A Level 1 Coach MUST:
• Work within a planned session
• Follow approved lesson plans
• Ask for support when unsure

A Level 1 Coach must NOT:
• Lead sessions independently
• Plan sessions without oversight
• Assess Awards independently
• Manage safeguarding concerns alone

Staying within your role keeps gymnasts safe and protects you as a coach.

─────────────────────────────────────────

BEST PRACTICE & PROFESSIONAL CONDUCT

UKAG best practice requires coaches to:
• Prioritise safety at all times
• Act in the best interests of the gymnast
• Maintain appropriate boundaries
• Communicate clearly and calmly
• Model professional behaviour

Professional expectations include:
• Arriving prepared and on time
• Wearing appropriate coaching attire
• Using positive, age-appropriate language
• Remaining calm and consistent
• Working respectfully within a coaching team

Coaching responsibility always comes before skill progression.

─────────────────────────────────────────

UKAG SESSION STRUCTURE — BEFORE, DURING, AFTER

Before the Session:
• Arrive early
• Assist with equipment and mat checks
• Be aware of space and layout
• Understand the session focus
• Clarify your role for that session

During the Session:
• Position yourself correctly
• Actively supervise your group
• Manage behaviour calmly
• Follow progressions as planned
• Maintain clear sight of gymnasts

After the Session:
• Support safe pack-down
• Reinforce positive feedback
• Reflect briefly on the session
• Communicate concerns to the Lead Coach

Preparation reduces risk and builds confidence. Where you stand matters as much as what you coach. Reflection supports development and safeguarding.

─────────────────────────────────────────

SCENARIO FOR REFLECTION

You arrive and the Lead Coach is delayed. Children are entering the space.

Consider:
• What is your responsibility in this situation?
• What actions are appropriate?
• What actions should you avoid?

Think through this before your quiz — it tests exactly this kind of judgement.`

const WEEK2_READING = `WEEK 2 — SESSION STRUCTURE & SKILL FOUNDATIONS

SESSION OBJECTIVES
By the end of this session you will be able to:
• Understand the standard UKAG session structure
• Support or lead an effective heart raiser
• Deliver gymnastics-focused stretches and key shapes
• Recognise safe skill progressions for Awards Levels 1–3
• Use clear, age-appropriate coaching language

─────────────────────────────────────────

UKAG STANDARD SESSION STRUCTURE — 45 MINUTES TOTAL

Time      Phase
5 mins    Heart raiser
10 mins   Gymnastics-focused stretch
25 mins   Equipment rotations
5 mins    Cool down

Level 1 coaches are expected to understand and work confidently within this structure in every session.

─────────────────────────────────────────

PHASE 1: HEART RAISER (5 MINUTES)

Purpose:
• Raise pulse and body temperature
• Engage children quickly
• Reinforce session routines

Key features:
• Simple and familiar — use the same format regularly
• Whole-group activity — everyone moving at the same time
• Clear start and stop signals — children must know when to respond

Effective heart raisers:
• Use one clear instruction at a time
• Keep children spaced safely
• Avoid long explanations
• Focus on engagement, not exhaustion

One clear instruction is better than five corrections.

Sample Heart Raiser — Numbers Game:
Children run in single file around the room. The coach calls a number and the group responds:
1 = Touch the floor
2 = Stretch jump
3 = Jumping jacks
4 = FREEZE!
5 = V-sit

Add new numbers as the weeks progress to build familiarity and routine.

─────────────────────────────────────────

PHASE 2: GYMNASTICS-FOCUSED STRETCH (10 MINUTES)

Purpose: prepare the body for gymnastics, reinforce key shapes, improve control and body awareness. Stretching should be active, controlled and purposeful — not rushed.

Stand Like a Gymnast:
• Legs straight, lean forward to touch toes — hold 5 seconds × 3
• Sit in pike — pike fold × 3 for 5 seconds
• Sit in straddle — lean over each leg for 5 seconds × 3
• Japana — lean to the middle for 5 seconds × 3

Animal Stretches:
• Happy Cat, Sad Cat, Lazy Cat, Seal Cat — repeat × 3
• Gymnast Cat × 3

Bridge:
• Lay flat, hands under shoulders, feet tucked close, push hips up and head off the floor — hold 5 seconds × 3

KEY GYMNASTICS SHAPES — Used Across All Apparatus

These shapes underpin all skill development at Levels 1–3. Knowing and coaching them well is fundamental to your role.

• Tuck
• Pike
• Straddle
• Dish — 10 second hold × 3
• Arch — 10 second hold × 3
• Front Support — 10 second hold × 3
• Side Support — 10 second hold × 3
• Back Support — 10 second hold × 3

Focus on:
• Shape quality over hold length
• Clear demonstrations before children attempt
• Simple, single coaching cues
• A calm, consistent coaching tone

Avoid rushing shapes to 'get on with skills' — the shapes ARE the foundation of the skills.

─────────────────────────────────────────

PHASE 3: EQUIPMENT ROTATIONS (25 MINUTES)

Purpose: apply skills safely, work across apparatus, support progression.

Structure:
• 2–3 stations running simultaneously
• Small groups at each (4–8 children)
• Groups rotate every 6–7 minutes
• A Level 1 coach supervises and coaches one assigned station

Your role at your station is to deliver the planned progression, maintain safe supervision, and give clear, positive feedback.

─────────────────────────────────────────

PHASE 4: COOL DOWN (5 MINUTES)

Purpose: lower heart rate, stretch muscles, calm and close the session.

Cool downs help children leave feeling successful. Never skip this phase, even when time is short — reduce the rotation time instead.

A good cool down includes gentle stretches, a moment of stillness, and positive acknowledgement of the session.

─────────────────────────────────────────

FURTHER PREPARATION

Before Week 3:
• Practise delivering the heart raiser and stretch sequence in a real session
• Identify which key shapes the children in your group find hardest
• Review the Vault, Beam and Bars progressions in the Awards Levels 1–3 quick reference`

const WEEK3_READING = `WEEK 3 — APPARATUS PROGRESSIONS & SAFETY IN PRACTICE

SESSION OBJECTIVES
By the end of this session you will:
• Understand Vault, Beam and Bars progressions for Levels 1–3
• Identify common risks within apparatus work
• Understand safe setup principles
• Recognise your responsibilities as a Level 1 coach

─────────────────────────────────────────

THE FOUR AREAS OF LEARNING

Level 1 coaches must be confident coaching introductory progressions across all four apparatus areas:

Floor — shapes, rolls, jumps, balances, up to supported cartwheels and back bends
Vault — approach, take-off, squat and straddle on, and safe landings
Beam — balance, movement, routines and control
Bars — grip, hang, support and basic strength skills such as up circle

The focus is understanding progressions and safety — not difficulty. Progression should feel achievable, not pressured.

─────────────────────────────────────────

SKILL PROGRESSIONS BY APPARATUS

VAULT / REBOUND (Levels 1–3)
Each skill should be performed twice. Coaches must be confident with the hurdle step, squat on, and straddle on, including correct support positions.

Level 1:
• Run into Hurdle Step → Jump to springboard → Safe landing, Block, Present
• Standing Squat to feet (height 2) → Straight jump off, Block, Present
• Standing Straddle to feet (height 2) → Star jump off, Block, Present

Level 2:
• Run into Hurdle Step on springboard → Squat to feet on low vault (height 2/3) → Tuck jump off, Block, Present
• Straddle to feet on low vault (height 2/3) → Star jump off, Block, Present

Level 3:
• Squat on or over (height 3/4) → Tuck jump off, Block (3 seconds), Present
• Straddle on or over (height 3/4) → Straddle jump off, Block (3 seconds), Present

─────────────────────────────────────────

BEAM (Levels 1–3)

Level 1:
• Straddle mount (supported)
• Tiptoes (supported) — 4 steps
• Diddy Walk — 4 steps
• Leg Lifts (supported) — 4 steps
• Straight Jump Dismount, Block, Present

Level 2:
• Straddle lever swing or V-sit mount (supported at hips)
• Dips (scoop foot downward each step)
• Half Pivot turn (supported)
• Leg Lifts (supported), Arabesque
• Star Jump dismount, Block, Present

Level 3:
• V-Sit / kneeling leg lift / simple mount
• Dipped Leg Lifts
• Half Pivot turn on toe
• Y Balance (supported), Coupe Ankles
• V-Sit to shoulderstand roll to stand
• Tuck Jump dismount, Block, Present

─────────────────────────────────────────

BARS (Levels 1–3)

Level 1:
• High Bar — Hold Tuck, Straddle & Pike 3 seconds each
• Low Bar — hang upside down, progress to up circle
• Low Bar — forward circle

Level 2:
• High Bar — Dish/Arch 5 swings, dismount backwards, Block & Present
• High Bar — Tuck, Straddle & Pike hold 5 seconds
• Low Bar — jump to front support × 3
• High Bar — 2 static turns in straight dish shape

Level 3:
• Dish/Arch 10 swings with re-grasps
• Back release dismount, Block & Present
• Low Bar — back hip circle (supported)
• Low Bar — cast × 3 to dismount jump to front support
• Low Bar — forward circle dismount (straight legs/arms)
• High Bar — 10 swings with re-grasping (unsupported)
• 2× half turns in the swings, rear dismount, Block & Present

─────────────────────────────────────────

RISK ASSESSMENT & SAFE SETUP

What Is Risk Assessment?
Risk assessment is constant awareness — not just paperwork. Apply these four steps in every session:

1. Identify hazard — what could cause harm?
2. Assess risk — how likely is it, and how serious would it be?
3. Apply control — what action reduces or removes the risk?
4. Monitor — check controls are working; reassess if anything changes

Common Hazards in School Halls:
• Mats with gaps between them
• Equipment placed too close together
• Unlocked or unstable wall frames
• Children running unsafely between stations
• Jewellery or socks (no bare feet on apparatus)

Safe Setup Principles — Before Children Enter:
• Mats secure and gap-free
• All equipment stable and locked where required
• Clear pathways between stations
• Defined station areas — children know where to stand
• Safe spacing between children and apparatus

Equipment Set-Up Considerations:
When arranging gymnastics equipment, always consider:
• Headroom — risk of hitting walls, beams or ceiling structures
• Lighting and other activities in the hall (especially ball sports)
• Safety mats around every piece of apparatus, especially over hard sports hall floors
• Manual handling — all equipment must be moved and stored safely

Level 1 coaches must check their own station before each session begins. Do not assume someone else has done it.

─────────────────────────────────────────

COACHING LANGUAGE ACROSS SESSIONS

Effective coaching language is:
• Clear — one instruction at a time
• Positive — acknowledge what's right before correcting what isn't
• Age-appropriate — speak to the child, not over them
• Precise — 'straight legs' is better than 'tidy it up'

Avoid:
• Long explanations before children attempt a skill
• Multiple corrections at once
• Shouting over noise — gain attention first, then speak

When watching and giving feedback on skills:
Floor — focus on progression steps, safety, simplicity of coaching cues
Beam & Vault — focus on coach positioning, use of mats, confidence building
Bars — focus on grip, body tension, and appropriate support or spotting`

const WEEK4_READING = `WEEK 4 — FINAL RECAP & ASSESSMENT PREPARATION

Week 4 marks the transition from learning to assessment readiness. This session consolidates everything covered throughout the course and ensures every coach understands exactly what is expected during their video assessment.

─────────────────────────────────────────

FULL COURSE RECAP

This course has covered:
• The role and responsibilities of a Level 1 coach
• The 45-minute session structure: heart raiser, stretch, rotations, cool down
• Floor progressions (Levels 1–3)
• Beam progressions (Levels 1–3)
• Vault progressions (Levels 1–3)
• Bars progressions (Levels 1–3)
• Risk awareness and safe setup
• Clear communication and calm authority

Strong Level 1 coaching is not about demonstrating the most advanced skills. It is about being safe, structured and clear.

─────────────────────────────────────────

VIDEO ASSESSMENT OVERVIEW

Your formal qualification assessment is a video submission of a real session you coach — not a staged demonstration to camera. Your assessor will review your footage against four assessment boxes.

BOX 1 — WARM-UP
• Lead or clearly support an age-appropriate heart raiser
• Use clear instructions and safe spacing
• Demonstrate a clear start and stop signal
• Show engagement-focused delivery, not exhaustion-focused

BOX 2 — STRETCHES
• Deliver or support a gymnastics-focused stretch sequence
• Reinforce at least two key shapes (Tuck, Pike, Straddle, Dish, Arch, Front/Back Support)
• Show controlled, purposeful stretching — not rushed
• Use simple, clear coaching cues

BOX 3 — SKILL DEVELOPMENT (3–4 APPARATUS)
• Show coaching across at least 3 of: Floor, Vault, Beam, Bars
• Demonstrate safe progressions within Awards Levels 1–3
• Show correct coach positioning and appropriate support or spotting
• Give corrective feedback to at least one participant on camera

BOX 4 — SESSION MANAGEMENT
• Show equipment rotation or station management in practice
• Demonstrate group control and safe supervision throughout
• Use clear, calm, age-appropriate coaching language
• Show a structured close to the session — cool down and pack-down

─────────────────────────────────────────

VIDEO REQUIREMENTS

Your video must meet ALL of the following:
• Minimum 10 minutes of unedited footage
• Must show a real group session — not a solo demonstration or scripted performance
• Footage should reflect a real session from start to finish where possible: warm-up through to session close
• Participants must be real children you coach — parental consent must be obtained (template on the UKAG Coach Portal)
• You must appear on camera as the coach for the full duration
• Audio must be audible — your coaching cues must be clearly heard
• Submit via the UKAG Coach Portal — do not send via email or personal file share

SUBMISSION DEADLINE: Your video must be submitted within 4 weeks of completing Week 4. Extensions must be agreed in writing with your tutor before the deadline.

─────────────────────────────────────────

ASSESSMENT OUTCOMES

PASS — All four boxes signed off by your assessor
→ UKAG Level 1 Gymnastics certificate issued within 5 working days

REFER — Assessor notes sent with specific development points
→ One resubmission permitted within 6 weeks

FAIL — Non-submission by deadline without agreed extension
→ Full reassessment required

─────────────────────────────────────────

NEXT STEPS

1. Film your coaching video within 4 weeks of this session
2. Write your reflection (200–400 words — prompts in the Upload tab)
3. Upload both files in the Assessment tab below
4. Your lead coach will review and notify you of your result within 5 working days

You are not expected to be perfect. You are expected to be safe, structured and clear.

Strong Level 1 coaching is simple, calm and controlled.`

const WEEK4_UPLOAD_PROMPT = `Upload two files:

1. YOUR COACHING VIDEO (minimum 10 minutes, unedited)
   Must show a real group session covering warm-up, stretches, skill development across at least 3 apparatus areas (Floor, Vault, Beam, Bars), and a structured close. You must appear on camera as coach throughout. Audio must be clear.

2. YOUR WRITTEN REFLECTION (Word doc or PDF, 200–400 words)
   Answer all four questions:
   a) What went well in your session and why?
   b) What would you do differently if you delivered this session again?
   c) How did you adapt your coaching for different ability levels in the group?
   d) Describe one safety decision you made during the session and explain your reasoning.

Both files must be uploaded here. Your lead coach will review them and notify you of your result within 5 working days of submission.`

// ── Quiz data — directly from the course pack ────────────────────────────────

const WEEK1_QUIZ = [
  {
    question: 'As a Level 1 Coach, you are trained to do which of the following?',
    options: [
      'Lead sessions independently with no oversight',
      'Lead a small group under the direction of a Lead Coach',
      'Plan and deliver competition-level training',
      'Assess Awards independently',
    ],
    correct: 1,
    explanation: 'A Level 1 Coach works under the direction of a Lead Coach at all times. Independent session leadership and Award assessment are outside the Level 1 scope.',
  },
  {
    question: 'Which of the following is something a Level 1 Coach must NOT do?',
    options: [
      'Follow approved lesson plans',
      'Ask for support when unsure',
      'Manage a safeguarding concern alone',
      'Work within a planned session',
    ],
    correct: 2,
    explanation: 'Safeguarding concerns must always be escalated to the Lead Coach or Designated Safeguarding Lead — never dealt with alone. Options A, B and D are all things a Level 1 Coach should do.',
  },
  {
    question: 'What should you do if a child discloses a concern to you during a session?',
    options: [
      'Promise to keep it secret to make the child feel safe',
      'Ask detailed follow-up questions to find out more',
      'Listen, do not promise confidentiality, then report to the Lead Coach or DSL',
      'Deal with it yourself after the session has finished',
    ],
    correct: 2,
    explanation: 'Never promise confidentiality or investigate yourself. Listen, stay calm, do not probe with questions, and report to the Lead Coach or Designated Safeguarding Lead as soon as possible.',
  },
  {
    question: 'UKAG Level 1 coaching scope covers which Awards Levels?',
    options: [
      'Levels 1–3',
      'Levels 4–6',
      'All Levels 1–6',
      'Levels 2–4',
    ],
    correct: 0,
    explanation: 'Level 1 Coaches are qualified to support and coach gymnastics skills within Awards Levels 1–3 only. Higher-level skills fall within the Level 2 Lead Coach scope.',
  },
  {
    question: 'Which best describes the UKAG coaching session structure?',
    options: [
      'Before, During, After — each phase has specific coach responsibilities',
      'Warm-up only — no further structure is needed at Level 1',
      'Whatever the coach decides on the day based on the group',
      'Structure is only required for Lead Coaches, not assistants',
    ],
    correct: 0,
    explanation: 'The Before, During, After framework applies to all coaches at every level. Each phase — preparation, active coaching, and post-session reflection — has distinct responsibilities for a Level 1 Coach.',
  },
]

const WEEK2_QUIZ = [
  {
    question: 'What is the total active time for a standard UKAG gymnastics session?',
    options: ['30 minutes', '45 minutes', '60 minutes', '90 minutes'],
    correct: 1,
    explanation: 'A UKAG session is 45 minutes: 5 mins heart raiser, 10 mins stretch, 25 mins equipment rotations, 5 mins cool down.',
  },
  {
    question: 'How long should a heart raiser typically last in a UKAG session?',
    options: ['2 minutes', '5 minutes', '15 minutes', '20 minutes'],
    correct: 1,
    explanation: 'The heart raiser is 5 minutes — long enough to raise pulse and engage children, but short enough to leave time for the stretching and skills phases.',
  },
  {
    question: 'What should coaches focus on when teaching gymnastics shapes?',
    options: [
      'Hold length above all else',
      'Shape quality over hold length',
      'Speed of completion',
      'Getting straight to apparatus skills as quickly as possible',
    ],
    correct: 1,
    explanation: 'Shape quality is always the priority. A well-formed dish held for 5 seconds is more valuable than a poor shape held for 10. The shapes underpin all skills that follow.',
  },
  {
    question: 'How often should equipment rotation groups change stations?',
    options: [
      'Every 1–2 minutes',
      'Every 6–7 minutes',
      'Every 20 minutes',
      'Never — groups stay at one station for the whole session',
    ],
    correct: 1,
    explanation: 'Groups rotate every 6–7 minutes during the 25-minute equipment phase. This gives enough time to practise skills meaningfully while ensuring all children experience multiple apparatus areas.',
  },
  {
    question: 'Why does the cool down matter at the end of a session?',
    options: [
      "It's optional and can be skipped if the session runs over time",
      'It lowers heart rate, stretches muscles, and helps children leave feeling successful',
      "It's only required for advanced gymnasts working at higher intensities",
      'It replaces the need for stretching earlier in the session',
    ],
    correct: 1,
    explanation: 'The cool down is a required part of the session structure. It has physical benefits (lowering heart rate, stretching working muscles) and a psychological one — children leave on a positive note.',
  },
]

const WEEK3_QUIZ = [
  {
    question: 'What are the four apparatus areas a Level 1 coach should be confident with?',
    options: [
      'Floor, Vault, Beam, Bars',
      'Floor, Trampoline, Beam, Rings',
      'Vault, Pommel, Rings, Bars',
      'Floor, Beam, Bars, Music',
    ],
    correct: 0,
    explanation: 'Level 1 coaches work across Floor, Vault, Beam and Bars. Trampoline coaching is a separate qualification. Pommel and Rings are not part of the UKAG Awards framework.',
  },
  {
    question: 'What does risk assessment involve in a gymnastics session?',
    options: [
      'Filling in a risk assessment form once per year',
      'Identify hazard, assess risk, apply control, monitor — as an ongoing process',
      'Only checking equipment before competitions',
      "Something only the Lead Coach needs to think about, not Level 1 coaches",
    ],
    correct: 1,
    explanation: 'Risk assessment is constant awareness, not a one-off form. All four steps — identify, assess, control, monitor — apply throughout every session, for every coach.',
  },
  {
    question: 'Which of these is a common hazard in school gymnasium sessions?',
    options: [
      'Mats with gaps between them',
      'Children wearing trainers',
      'Bright overhead lighting',
      'Small group sizes',
    ],
    correct: 0,
    explanation: 'Gaps between mats are a genuine hazard — a gymnast can catch a foot or land between surfaces. Trainers, lighting and small groups are not typically hazards in this context.',
  },
  {
    question: 'What should a Level 1 coach check before children enter their apparatus station?',
    options: [
      "Nothing — checking equipment is solely the Lead Coach's responsibility",
      'Mats secure, equipment stable, clear pathways, defined station areas, safe spacing',
      'Only the specific piece of equipment they personally set up',
      'The weather forecast to assess whether the session can go ahead',
    ],
    correct: 1,
    explanation: "Level 1 coaches must check their own station fully — mats, equipment stability, pathways and spacing — before children arrive. Don't assume someone else has done it.",
  },
  {
    question: 'What is the key focus when a Level 1 coach watches floor skill progressions?',
    options: [
      'The speed of execution only',
      'Progression steps, safety, and simplicity of coaching cues',
      'How advanced the skill looks compared to Level 3',
      'Whether music is playing in the background',
    ],
    correct: 1,
    explanation: 'When supervising floor skills, focus on whether progressions are being followed in order, whether participants are safe, and whether your coaching cues are clear and simple. Complexity is not the goal.',
  },
]

const WEEK4_QUIZ = [
  {
    question: 'What is the main focus of the video assessment for the Level 1 qualification?',
    options: [
      'Demonstrating the most advanced gymnastics skills possible',
      'Structured, safe coaching within the Level 1 scope',
      'Performing a solo gymnastics skills routine to camera',
      'Reading from a prepared script to demonstrate knowledge',
    ],
    correct: 1,
    explanation: "Coaches are not assessed on the difficulty of skills coached. The focus is safe, structured delivery within the Level 1 scope — coaches who demonstrate simple, calm, well-organised coaching pass. Those who attempt to impress with complexity often don't.",
  },
  {
    question: 'Which of these is NOT evaluated in the video assessment?',
    options: [
      'Communication clarity',
      'Safety and supervision',
      'Advanced somersault technique',
      'Professional conduct',
    ],
    correct: 2,
    explanation: 'Advanced somersault technique is beyond Level 1 scope entirely and is not assessed. Communication, safety, supervision and professional conduct are all core to the assessment matrix.',
  },
  {
    question: 'By when must the video assessment be submitted?',
    options: [
      'Immediately after completing Week 1',
      'Within 4 weeks of completing Week 4',
      'There is no set deadline',
      'Within 24 hours of completing Week 4',
    ],
    correct: 1,
    explanation: 'Candidates have 4 weeks from the end of Week 4 to submit their video. Extensions must be agreed in writing with the tutor before the deadline — late submissions without an extension require a full reassessment.',
  },
  {
    question: 'What best describes strong Level 1 gymnastics coaching?',
    options: [
      'Fast-paced and ambitious, covering as many skills as possible',
      'Simple, calm and controlled',
      'Focused primarily on Level 3 progressions to challenge the group',
      'Loud and highly directive to maintain group control',
    ],
    correct: 1,
    explanation: "Simple, calm and controlled is the standard. Attempting to rush progressions or cover too much in one session is a common mistake. The course pack says clearly: you are expected to be safe, structured and clear — not perfect.",
  },
  {
    question: 'After qualifying, what should a Level 1 coach expect going forward?',
    options: [
      'No further observation is needed once the certificate is issued',
      'Ongoing informal observations from their Lead Coach may continue',
      'They immediately progress to Lead Coach status',
      'They no longer need to hold a valid DBS certificate',
    ],
    correct: 1,
    explanation: 'Qualifying is the beginning, not the end. Level 1 coaches continue to work under Lead Coach supervision, and ongoing informal observation supports professional development. A valid DBS remains required throughout.',
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export function SeedGymL1Page() {
  const [startDate, setStartDate] = useState('')
  const [leadCoachEmail, setLeadCoachEmail] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  async function handleCreate() {
    setCreating(true)
    setError(null)

    let leadCoachId: string | null = null
    if (leadCoachEmail.trim()) {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', leadCoachEmail.trim())
        .maybeSingle()
      if (!data) {
        setError('Lead coach email not found in the portal. Check the email and try again.')
        setCreating(false)
        return
      }
      leadCoachId = data.id
    }

    const { data: inst, error: instErr } = await supabase
      .from('course_instances')
      .insert({
        title: 'Level 1 Gymnastics Coaching Certificate',
        course_type: 'gymnastics_l1',
        description: 'UKAG Level 1 Gymnastics Assistant Coach — 4-week online course covering role and responsibilities, session structure, apparatus progressions and final video assessment. Suitable for coaches aged 16+ working with Awards Levels 1–3.',
        start_date: startDate || null,
        weeks_total: 4,
        lead_coach_id: leadCoachId,
        status: 'active',
      })
      .select()
      .single()

    if (instErr || !inst) {
      console.error('course_instances insert error:', instErr)
      setError(`Failed to create course instance: ${instErr?.message || 'unknown error'}`)
      setCreating(false)
      return
    }

    const weeks = [
      {
        instance_id: inst.id,
        week_number: 1,
        title: 'Role, Responsibilities & Session Structure',
        is_unlocked: false,
        reading_content: WEEK1_READING,
        quiz: WEEK1_QUIZ,
        requires_upload: false,
        upload_prompt: null,
        is_final_assessment: false,
      },
      {
        instance_id: inst.id,
        week_number: 2,
        title: 'Session Structure & Skill Foundations',
        is_unlocked: false,
        reading_content: WEEK2_READING,
        quiz: WEEK2_QUIZ,
        requires_upload: false,
        upload_prompt: null,
        is_final_assessment: false,
      },
      {
        instance_id: inst.id,
        week_number: 3,
        title: 'Apparatus Progressions & Safety in Practice',
        is_unlocked: false,
        reading_content: WEEK3_READING,
        quiz: WEEK3_QUIZ,
        requires_upload: false,
        upload_prompt: null,
        is_final_assessment: false,
      },
      {
        instance_id: inst.id,
        week_number: 4,
        title: 'Final Recap & Assessment Preparation',
        is_unlocked: false,
        reading_content: WEEK4_READING,
        quiz: WEEK4_QUIZ,
        requires_upload: true,
        upload_prompt: WEEK4_UPLOAD_PROMPT,
        is_final_assessment: true,
      },
    ]

    const { error: weeksErr } = await supabase.from('course_instance_weeks').insert(weeks)

    if (weeksErr) {
      console.error('course_instance_weeks insert error:', weeksErr)
      setError(`Course created but weeks failed to save: ${weeksErr.message}. Open the course and check the Weeks tab.`)
      setCreating(false)
      setDone(inst.id)
      return
    }

    setDone(inst.id)
    setCreating(false)
  }

  const WEEKS_PREVIEW = [
    {
      n: 1,
      title: 'Role, Responsibilities & Session Structure',
      topics: ['UKAG Level 1 role and scope', 'Role boundaries (must/must not)', 'Best practice and professional conduct', 'Before, During, After session structure', 'Safeguarding essentials'],
      quiz: 5,
      upload: false,
    },
    {
      n: 2,
      title: 'Session Structure & Skill Foundations',
      topics: ['45-minute session breakdown', 'Heart raiser — purpose and delivery', 'Gymnastics-focused stretches and key shapes', 'Equipment rotations structure', 'Cool down rationale'],
      quiz: 5,
      upload: false,
    },
    {
      n: 3,
      title: 'Apparatus Progressions & Safety in Practice',
      topics: ['Vault, Beam and Bars progressions Levels 1–3', 'Risk assessment: identify, assess, control, monitor', 'Common hazards in school halls', 'Safe setup principles', 'Coaching language across apparatus'],
      quiz: 5,
      upload: false,
    },
    {
      n: 4,
      title: 'Final Recap & Assessment Preparation',
      topics: ['Full course recap', 'Video assessment four-box matrix', 'Video requirements and submission deadline', 'Assessment outcomes: Pass / Refer / Fail', 'Final message to candidates'],
      quiz: 5,
      upload: true,
      final: true,
    },
  ]

  return (
    <Layout>
      <Link
        to="/admin/course-instances"
        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-5"
      >
        ← Live Course Management
      </Link>

      <div className="mb-8">
        <div
          className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Course Seeder
        </div>
        <h1
          className="text-2xl font-black text-gray-900 mb-2"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Level 1 Gymnastics Coaching Certificate
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
          This will create the complete 4-week Level 1 Gymnastics course in the portal, pre-populated with all reading content, 20 quiz questions and the final video assessment from the UKAG course pack. You'll be taken straight to the course to add candidates and unlock weeks.
        </p>
      </div>

      {done ? (
        <div className="bg-white rounded-2xl border border-green-200 p-8 text-center max-w-md mx-auto">
          <CheckCircle size={44} className="text-green-500 mx-auto mb-4" />
          <h2
            className="font-black text-gray-900 text-lg mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Course Created!
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            All 4 weeks are ready with reading content, quizzes and the assessment week. Next: add your candidates and unlock Week 1.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to={`/admin/course-instances/${done}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              <PlayCircle size={16} />
              Open Course →
            </Link>
            <Link
              to="/admin/course-instances"
              className="text-xs text-gray-500 hover:text-gray-700 text-center"
            >
              Back to all courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Course preview */}
          <div className="lg:col-span-2 space-y-4">
            <h2
              className="font-black text-gray-900 text-sm"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              What will be created
            </h2>

            {WEEKS_PREVIEW.map(week => (
              <div key={week.n} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-sm font-black"
                    style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {week.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-black text-gray-900 text-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Week {week.n} — {week.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <BookOpen size={11} /> Reading
                      </span>
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <HelpCircle size={11} /> {week.quiz} quiz questions
                      </span>
                      {week.upload && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <Upload size={11} /> {week.final ? 'Video assessment' : 'Upload'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ul className="space-y-1">
                  {week.topics.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0 mt-1.5" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p
                className="text-xs font-black text-blue-900 mb-1"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                20 quiz questions included
              </p>
              <p className="text-xs text-blue-800 leading-relaxed">
                All questions are taken directly from the UKAG Level 1 Course Pack with correct answers pre-set and explanations written for each. Pass mark is 70% per week. Candidates can retake until they pass.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p
                className="text-xs font-black text-amber-900 mb-1"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                All weeks start locked
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                No weeks are unlocked by default. Unlock each week in the course management page when you're ready for candidates to access it — typically at the start of each weekly online session.
              </p>
            </div>
          </div>

          {/* Create panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
              <h2
                className="font-black text-gray-900 text-sm mb-4"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Create This Course
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-xs font-bold text-gray-700 mb-1"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Course Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <p className="text-xs text-gray-400 mt-1">Optional — the date your first session ran</p>
                </div>

                <div>
                  <label
                    className="block text-xs font-bold text-gray-700 mb-1"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Lead Coach Email
                  </label>
                  <input
                    type="email"
                    value={leadCoachEmail}
                    onChange={e => setLeadCoachEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="coach@email.com"
                  />
                  <p className="text-xs text-gray-400 mt-1">Must have a portal account. Optional.</p>
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                  style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                >
                  <PlayCircle size={16} />
                  {creating ? 'Creating Course…' : 'Create Level 1 Course'}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p
                  className="text-xs font-bold text-gray-500 mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  After creating:
                </p>
                <div className="space-y-1.5">
                  {[
                    'Add candidates by portal email',
                    'Unlock Week 1 to open it to candidates',
                    'Unlock subsequent weeks each session',
                    'Fill in assessments from the Assessments tab',
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <span
                        className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black"
                        style={{ backgroundColor: '#0d9488', fontFamily: 'Montserrat, sans-serif', fontSize: '9px' }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
