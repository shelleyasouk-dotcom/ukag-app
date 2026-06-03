export interface SessionStage {
  stage: string
  time: string
  description: string
  coachingFocus: string
}

export interface ApparatusSkills {
  apparatus: string
  coreSkills: string[]
  progressionPathway: string
  keyCoachingCues: string
}

export interface AssistantCoachRole {
  area: string
  responsibility: string
}

export interface LibraryLevel {
  level: number
  name: string
  fullTitle: string
  ageGroup: string
  delivery: string
  duration: string
  colour: string
  textColour: 'white' | 'dark'
  tagline: string
  sessionOverview: SessionStage[]
  objectives: string[]
  apparatusSkills: ApparatusSkills[]
  teachingFocus: string[]
  assistantCoachRoles: AssistantCoachRole[]
  safetyChecklist: string[]
  coachingReminders: string[]
}

const BASE_OVERVIEW: SessionStage[] = [
  {
    stage: 'Pre-Session Setup',
    time: '15 min before',
    description: 'Coaches prepare equipment, complete safety checks and register while children change/snack.',
    coachingFocus: 'Equipment secure, clear walkways, set rotations.',
  },
  {
    stage: 'Welcome & Safety Brief',
    time: '5 min',
    description: 'Introduce coaches, review safety rules, explain session flow.',
    coachingFocus: 'Use "Stop–Look–Listen" signal, encourage confidence.',
  },
  {
    stage: 'Heart Raiser',
    time: '5 min',
    description: 'Coach-choice fun game (Shape Tag / Bean Game / Relay).',
    coachingFocus: 'Raise pulse, include shapes & coordination.',
  },
  {
    stage: 'Official UKAG Stretch Sequence',
    time: '10 min',
    description: 'Guided dynamic stretches from UKAG warm-up (pike/straddle, cats, bridge, dish/arch, supports).',
    coachingFocus: 'Emphasise posture, body tension, breathing.',
  },
  {
    stage: 'Skill Rotations (2–3 stations)',
    time: '25–30 min',
    description: 'Floor / Beam / Bars / Vault or Rebound rotations.',
    coachingFocus: '6–8 min per station; reinforce shapes & safe landings.',
  },
  {
    stage: 'Cool Down & Reflection',
    time: '5 min',
    description: 'Partner stretch + "Freeze Balance" game; recap skills.',
    coachingFocus: 'Positive feedback & team praise.',
  },
  {
    stage: 'Pack Down & Feedback',
    time: '5–10 min',
    description: 'Tidy equipment, update register, submit feedback.',
    coachingFocus: 'Record attendance & notes; upload photo if required.',
  },
]

export const COACHING_LIBRARY: LibraryLevel[] = [
  {
    level: 1,
    name: 'Foundation',
    fullTitle: 'UKAG Level 1 — Foundation Gymnastics',
    ageGroup: 'Ages 4–11',
    delivery: 'Assistant Coach (Level 1) or Lead Coach',
    duration: '45 mins active (65–70 mins total incl. changeover)',
    colour: '#f4cc2c',
    textColour: 'dark',
    tagline: 'Body shapes, basic supports, first rolls and jumps',
    sessionOverview: BASE_OVERVIEW,
    objectives: [
      'Establish safety routines and classroom management.',
      'Introduce fundamental body shapes and supports.',
      'Build spatial awareness and confidence on all apparatus.',
      'Reinforce "Block & Present" as the universal finishing position.',
      'Encourage teamwork and positive participation.',
    ],
    apparatusSkills: [
      {
        apparatus: 'Floor',
        coreSkills: [
          'Dish & Arch holds (3 s)',
          'Front/Back Support',
          'Forward Roll (supported)',
          'Bunny Hops',
          'V-Sit',
          'Straight Jump & Present',
        ],
        progressionPathway: 'Shapes → Supports → Rock to Roll → Jump Sequence → Stretch & Split holds',
        keyCoachingCues: '"Tight tummy – point toes – stretch long."',
      },
      {
        apparatus: 'Beam / Balance Line',
        coreSkills: [
          'Straddle Mount',
          'Tiptoe Walk',
          'Diddy Walk',
          'Leg Lift (supported)',
          'Straight Jump Dismount',
        ],
        progressionPathway: 'Floor line → low beam → supported tiptoe → leg lifts → controlled jump off',
        keyCoachingCues: '"Eyes up – arms out – soft knees on landing."',
      },
      {
        apparatus: 'Bars',
        coreSkills: [
          'Tuck/Straddle/Pike Hold (3 s)',
          'Hang Upside Down (supported)',
          'Forward Circle (supported)',
          '5 Swings',
          'Dismount & Present',
        ],
        progressionPathway: 'Floor bar shapes → low bar hang → swing → forward circle → present finish',
        keyCoachingCues: '"Thumbs around bar – dish to arch – block to finish."',
      },
      {
        apparatus: 'Vault / Rebound',
        coreSkills: [
          'Run → Hurdle → Springboard Jump → Safe Landing',
          'Star Jump Dismount',
          'Tuck Jump Dismount',
        ],
        progressionPathway: 'Floor take-off → springboard → low block jumps → 2-foot landings → add shape jumps',
        keyCoachingCues: '"Run–Hop–Jump–Land–Present."',
      },
    ],
    teachingFocus: [
      'Keep instructions short & visual.',
      'Emphasise fun and movement exploration for under-7s; precision and technique for 8+.',
      'Use progressions rather than repetition of one skill.',
      'Praise effort > outcome.',
    ],
    assistantCoachRoles: [
      { area: 'Warm-Up & Heart Raiser', responsibility: 'Lead group games; demonstrate stretches.' },
      { area: 'Floor Station', responsibility: 'Spot forward rolls & basic jumps safely.' },
      { area: 'Beam or Vault', responsibility: 'Support balance line & landing technique.' },
      { area: 'Admin & Feedback', responsibility: 'Help record attendance & award notes.' },
    ],
    safetyChecklist: [
      'Mats flat and joined securely',
      'No jewellery or socks on apparatus',
      'Water bottles off floor area',
      'Wall frames locked if unused',
      'Clear exits and first-aid available',
    ],
    coachingReminders: [
      'Assistant Coaches (Level 1) may deliver Levels 1–3.',
      'Lead Coaches may deliver all Levels 1–6.',
      'End every skill with "Block & Present" position.',
      'Praise small wins and visible progress each week.',
    ],
  },

  {
    level: 2,
    name: 'Development',
    fullTitle: 'UKAG Level 2 — Development Gymnastics',
    ageGroup: 'Ages 4–11',
    delivery: 'Assistant Coach (Level 1) or Lead Coach',
    duration: '45 mins active (65–70 mins total incl. changeover)',
    colour: '#22c55e',
    textColour: 'white',
    tagline: 'Rolls, bridges, pivot turns and vault progressions',
    sessionOverview: BASE_OVERVIEW.map((s, i) =>
      i === 3 ? { ...s, description: 'Pike/Straddle/Japana holds · Cat Series · Bridge · Dish/Arch · Front/Back Supports.', coachingFocus: 'Emphasise active stretching and longer holds.' }
      : i === 4 ? { ...s, description: 'Apparatus-based skill work from the Level 2 Awards.', coachingFocus: 'Use progressions and repetition for confidence.' }
      : i === 5 ? { ...s, description: 'Team stretches and shape challenge game.', coachingFocus: "Praise improvement and set next week's focus." }
      : s
    ),
    objectives: [
      'Reinforce core shapes and body control.',
      'Develop balance, travel, and strength across apparatus.',
      'Introduce jumping, mounting, and landing variations.',
      'Progress toward independent execution of Level 2 Award skills.',
      'Build teamwork, rhythm, and confidence.',
    ],
    apparatusSkills: [
      {
        apparatus: 'Floor',
        coreSkills: [
          'Dish & Arch rocks/rolls',
          'Side/Front/Back Support',
          'Splits (side/front)',
          'Frog Balance',
          'Forward & Backward Roll (supported)',
          'V-Sit (unsupported)',
          'Bridge (supported)',
          'Tuck Jump',
          'Chassé & Cat Leaps',
        ],
        progressionPathway: 'Shapes → Rocks & Rolls → Frog/T-Balance → Forward Roll → Back Roll (to straddle) → Bridge & Leaps',
        keyCoachingCues: '"Strong arms, tight tummy, toes pointed."',
      },
      {
        apparatus: 'Beam / Balance Line',
        coreSkills: [
          'Straddle Lever or V-Sit Mount',
          'Dips',
          '½ Pivot Turn (supported)',
          'Arabesque',
          'Star Jump Dismount',
        ],
        progressionPathway: 'Mount (supported) → simple travel → pivot turn → arabesque hold → star jump dismount',
        keyCoachingCues: '"Arms out – eyes up – land soft."',
      },
      {
        apparatus: 'Bars',
        coreSkills: [
          'Tuck/Straddle/Pike Hold (5 s)',
          'Jump to Front Support',
          'Dish/Arch Swing (10 reps)',
          'Static Turns (×2)',
          'Re-grasp & Back Release Dismount',
        ],
        progressionPathway: 'Floor-bar grip → front support → 10 swings → small turn re-grasp → dismount & present',
        keyCoachingCues: '"Swing from shoulders, not knees; finish tall."',
      },
      {
        apparatus: 'Vault / Rebound',
        coreSkills: [
          'Run → Hurdle → Springboard → Squat On low vault (2–3 blocks)',
          'Tuck Jump off',
          'Straddle Jump off',
        ],
        progressionPathway: 'Floor jump → springboard → squat-on → tuck/straddle dismount → present',
        keyCoachingCues: '"Run–Hop–Push–Land–Present."',
      },
    ],
    teachingFocus: [
      'Precision in shape and form.',
      'Controlled entry and exit from apparatus.',
      'Teaching rhythm in swings, jumps, and turns.',
      'Reinforce safety landing (bend–present).',
      'Build confidence through progressive repetition.',
    ],
    assistantCoachRoles: [
      { area: 'Warm-Up', responsibility: 'Lead or demonstrate stretch sequence.' },
      { area: 'Floor Station', responsibility: 'Spot forward/backward rolls safely.' },
      { area: 'Beam / Vault', responsibility: 'Support dismounts and turns.' },
      { area: 'Bars', responsibility: 'Count swings & hold times; cue "block & present".' },
      { area: 'Admin', responsibility: 'Record notes or photos for feedback.' },
    ],
    safetyChecklist: [
      'Mats secure under each apparatus',
      'Springboard locked and aligned',
      '1 gymnast per bar at a time',
      'Check landings before every jump',
      'No socks, jewellery, or water near equipment',
    ],
    coachingReminders: [
      'Lead Coaches may deliver all levels (1–6).',
      'Assistant Coaches may deliver up to Level 3 skills under supervision.',
      'Ensure every child finishes each activity in "Block & Present" position.',
      'Praise small wins and visible progress each week.',
    ],
  },

  {
    level: 3,
    name: 'Improver',
    fullTitle: 'UKAG Level 3 — Improver Gymnastics',
    ageGroup: 'Ages 4–11',
    delivery: 'Assistant Coach (Level 1) or Lead Coach',
    duration: '45 mins active (65–70 mins total incl. changeover)',
    colour: '#1e52a4',
    textColour: 'white',
    tagline: 'Handstands, cartwheels, hip circles and squat-over vault',
    sessionOverview: BASE_OVERVIEW.map((s, i) =>
      i === 1 ? { ...s, description: 'Recap safety signals and routines; introduce new challenge focus for Level 3.', coachingFocus: '"We\'re building strength and confidence to try new shapes & movements."' }
      : i === 2 ? { ...s, description: 'Coach-choice aerobic starter (Shape Circuits / Floor Relay / Beam Walk Race).', coachingFocus: 'Focus on control and alignment — warm muscles, not chaos.' }
      : i === 3 ? { ...s, description: 'Full-body stretch including: Pike / Straddle / Japana / Cat Series / Dish / Arch / Supports.', coachingFocus: 'Hold 10 seconds per shape; encourage precision and breathing.' }
      : i === 4 ? { ...s, description: 'Apparatus work using Level 3 Award skills. Rotate every 7–8 minutes.', coachingFocus: 'Encourage independence, posture, and clean finishes.' }
      : i === 5 ? { ...s, description: 'Stretch and breathing cool down; group reflection on achievements.', coachingFocus: 'Praise risk-taking and confidence.' }
      : s
    ),
    objectives: [
      'Develop strength, precision, and confidence in travelling, jumping, and rolling.',
      'Introduce handstands, cartwheels, and supported beam/bars dismounts.',
      'Encourage independence — children start to self-correct and spot shapes.',
      'Reinforce control in transitions and body alignment.',
      'Prepare gymnasts for intermediate apparatus work (Level 4).',
    ],
    apparatusSkills: [
      {
        apparatus: 'Floor',
        coreSkills: [
          'Dish/Arch Rolls',
          'Side/Front/Back Support with press',
          'Splits',
          'Y-Balance',
          'Dive Forward Roll',
          'Backward Roll',
          'Headstand',
          'Handstand (supported)',
          'Cartwheel (supported)',
          'Bridge → Shoulderstand',
          'Backbend into Bridge',
          'Chassé & Cat Leaps',
          'Straddle Jump',
        ],
        progressionPathway: 'Shapes → Rolls → Balances → Inversions → Cartwheel',
        keyCoachingCues: '"Strong arms – eyes between hands – land & present."',
      },
      {
        apparatus: 'Beam / Balance Line',
        coreSkills: [
          'V-Sit or Kneeling Mount',
          'Dipped Leg Lifts',
          '½ Pivot Turn (on toe)',
          'Y-Balance (supported)',
          'Straight Jump & Tuck Jump Dismount',
          'Coupe Ankles',
          'V-Sit to Shoulderstand Roll',
        ],
        progressionPathway: 'Floor line → low beam → toe travel → supported turns & balances → safe landings',
        keyCoachingCues: '"Arms open – tight core – focus forward."',
      },
      {
        apparatus: 'Bars',
        coreSkills: [
          'Up-Hip Circle (supported)',
          'Cast ×3 → Jump to Front Support',
          'Forward Dismount (straight arms & legs)',
          '10 Swings with Re-grasp',
          'Rear Dismount',
          '2× Half Turns',
        ],
        progressionPathway: 'Hang to swing → cast to front support → up-hip support → release dismount',
        keyCoachingCues: '"Swing dish to arch – squeeze the bar – finish tall."',
      },
      {
        apparatus: 'Vault / Rebound',
        coreSkills: [
          'Squat On/Over (3–4 blocks)',
          'Tuck/Straddle Jump Off',
          'Block Hold & Present',
          'Dive Roll (low mat)',
          'Safe Landing Practice',
        ],
        progressionPathway: 'Run → hurdle → springboard → vault → controlled landings',
        keyCoachingCues: '"Fast run – two-foot jump – land soft – arms up."',
      },
    ],
    teachingFocus: [
      'Encourage independence and self-correction.',
      'Begin introducing dynamic movement sequences (link 2–3 skills).',
      'Increase quality of lines, pointed toes, and arm placement.',
      'Reinforce upright posture in landings and dismounts.',
      'Reward confidence and perseverance when learning new shapes.',
    ],
    assistantCoachRoles: [
      { area: 'Warm-Up', responsibility: 'Lead heart raiser or stretch demonstration.' },
      { area: 'Floor', responsibility: 'Spot cartwheels and supported handstands.' },
      { area: 'Beam', responsibility: 'Support turns and dismounts.' },
      { area: 'Bars', responsibility: 'Supervise swing count; assist hip circle setup.' },
      { area: 'Admin', responsibility: 'Record Award progress; help with end-of-session notes.' },
    ],
    safetyChecklist: [
      'Bar mats and crash mats secure under apparatus',
      'Beam height adjusted for confidence',
      'Springboard placement checked before every use',
      '1 gymnast per bar or vault at a time',
      'Wall frames locked when not in use',
    ],
    coachingReminders: [
      'Lead Coaches can deliver Levels 1–6.',
      'Assistant Coaches can deliver Levels 1–3 under supervision.',
      'Always encourage safe exploration but controlled risk-taking.',
      'Reinforce "Block & Present" at every dismount.',
    ],
  },

  {
    level: 4,
    name: 'Intermediate',
    fullTitle: 'UKAG Level 4 — Intermediate Gymnastics',
    ageGroup: 'Ages 4–11',
    delivery: 'Lead Coach only',
    duration: '45 mins active (65–70 mins total incl. transitions)',
    colour: '#8b5cf6',
    textColour: 'white',
    tagline: 'Linking sequences, walkovers, roundoff and hip circles',
    sessionOverview: BASE_OVERVIEW.map((s, i) =>
      i === 1 ? { ...s, description: 'Welcome group, review safety rules and session theme ("linking skills with confidence").', coachingFocus: 'Demonstrate landings and spotting techniques visually.' }
      : i === 2 ? { ...s, description: 'Coach-choice cardio start (Shape Relay / Equipment Chase / Circuit Tag).', coachingFocus: 'Raise heart rate and introduce agility.' }
      : i === 3 ? { ...s, description: 'Pike/Straddle holds · Japana stretch · Cat series · Bridge · Dish/Arch · Support shapes.', coachingFocus: 'Hold longer positions; improve form and control.' }
      : i === 4 ? { ...s, description: 'Apparatus-based work from Level 4 Awards (Floor, Beam, Bars, Vault/Rebound).', coachingFocus: 'Increase precision, link skills together, and encourage independence.' }
      : i === 5 ? { ...s, description: 'Group stretch and breathing focus; reflect on confidence and control.', coachingFocus: 'Discuss what went well / new skill attempted.' }
      : i === 6 ? { ...s, description: 'Coaches pack away equipment safely. Children change and have their snack.', coachingFocus: 'Maintain supervision; ensure smooth handover to parents/teachers.' }
      : s
    ),
    objectives: [
      'Develop linking sequences across multiple apparatus.',
      'Improve balance, power, and landing technique.',
      'Strengthen inversions (handstands, bridges, walkovers).',
      'Build independence — gymnasts recall and perform learned skills.',
      'Reinforce safe transitions and preparation for higher-level routines.',
    ],
    apparatusSkills: [
      {
        apparatus: 'Floor',
        coreSkills: [
          'Handstand Forward Roll',
          'Dive Forward Roll to Bunny Hop',
          'Back Roll to Front Support',
          'Cartwheel (1 Hand / Side-to-Side)',
          'Shoulderstand',
          'Backward Walkover (supported)',
          'Handstand → Forward Roll',
          'Chassé / Cat Leaps / Stag Leaps',
          'Roundoff',
        ],
        progressionPathway: 'Shapes → Rolls → Inversions → Cartwheel → Linked Sequences',
        keyCoachingCues: '"Strong push – arms locked – eyes between hands – stretch to finish."',
      },
      {
        apparatus: 'Beam / Balance Line',
        coreSkills: [
          'Simple Mount',
          'Dipped Leg Lifts on Tiptoes',
          'Squat Pivot Turn',
          'Forward Roll on Low Beam (optional)',
          'Y-Balance',
          'Cat Leap',
          'Cartwheel (supported)',
          'Roundoff Dismount',
        ],
        progressionPathway: 'Floor line → low beam → supported inversion → cartwheel dismount',
        keyCoachingCues: '"Focus forward – core tight – soft landings."',
      },
      {
        apparatus: 'Bars',
        coreSkills: [
          'Up-Hip Circle (1 leg allowed)',
          'Casts to Back Hip Circle (supported)',
          'Stand or Straddle Jump to High Bar',
          '10 Re-grasps',
          'German Back Hang (supported)',
          'Straight Dismount',
        ],
        progressionPathway: 'Floor bar → low bar → cast/hip circle → transfer → high bar swings',
        keyCoachingCues: '"Swing dish to arch – press hips – finish block."',
      },
      {
        apparatus: 'Vault / Rebound',
        coreSkills: [
          'Squat Through / Straddle Over (3–4 blocks)',
          'Headspring / Handspring (supported)',
          'Dive Forward Roll',
          'Handstand Flat Back (trampette)',
        ],
        progressionPathway: 'Run → hurdle → board → vault → landing → linking jumps',
        keyCoachingCues: '"Fast run – strong push – land soft – arms up."',
      },
    ],
    teachingFocus: [
      'Link 2–3 skills into short sequences.',
      'Improve technique, posture, and pointed toe control.',
      'Encourage spatial awareness in inversions.',
      'Increase independence — gymnasts take more ownership.',
      'Spot safely but reduce reliance on support as confidence grows.',
    ],
    assistantCoachRoles: [
      { area: 'Warm-Up', responsibility: 'Lead heart raiser or stretch under direction.' },
      { area: 'Floor', responsibility: 'Support rolls, bridges, or cartwheel entries.' },
      { area: 'Beam', responsibility: 'Help gymnasts mount and dismount safely.' },
      { area: 'Bars', responsibility: 'Supervise swing count and spot supported hip circles.' },
      { area: 'Admin', responsibility: 'Record progress for Award tracking.' },
    ],
    safetyChecklist: [
      'Springboard and vault boxes secured before every run',
      'Spotter positioned on active apparatus',
      'Mats cover all dismount and landing areas',
      '1 gymnast per bar at a time',
      'Equipment checked for stability before each rotation',
    ],
    coachingReminders: [
      'Lead Coaches may deliver Levels 1–6.',
      'Assistant Coaches may assist up to Level 3 skills only.',
      'Encourage confidence over perfection — praise visible effort.',
      'End every session with calm, structured change & snack routine.',
      'Reinforce "Block & Present" across all apparatus.',
    ],
  },

  {
    level: 5,
    name: 'Advanced Foundation',
    fullTitle: 'UKAG Level 5 — Advanced Foundation Gymnastics',
    ageGroup: 'Ages 4–11',
    delivery: 'Lead Coach (Level 2+)',
    duration: '45 mins active (65–70 mins total incl. transitions)',
    colour: '#ef462c',
    textColour: 'white',
    tagline: 'Back handspring, walkovers, clear hip circles and flight vaults',
    sessionOverview: BASE_OVERVIEW.map((s, i) =>
      i === 1 ? { ...s, description: 'Revisit "controlled power" and focus for the session (e.g., linking power skills).', coachingFocus: 'Use visual demo of handspring or hip circle to set goal.' }
      : i === 2 ? { ...s, description: 'Coach-choice power game (e.g., Sprint Tag / Vault Run Relay / Jump Challenge).', coachingFocus: 'Focus on leg drive and upper-body activation.' }
      : i === 3 ? { ...s, description: 'Dynamic stretches + Bridge to Kick-Over prep + Dish/Arch holds (10 s) + Splits.', coachingFocus: 'Hold each shape with accuracy and breath control.' }
      : i === 4 ? { ...s, description: 'Apparatus stations from Level 5 Awards (Floor, Beam, Bars, Vault/Rebound).', coachingFocus: 'Coach power, control, and safe spotting.' }
      : i === 5 ? { ...s, description: 'Static stretches and deep breathing; reflect on achievement & confidence.', coachingFocus: 'Encourage children to name skills they mastered.' }
      : i === 6 ? { ...s, description: 'Coaches tidy equipment safely while children change and have snack.', coachingFocus: 'Supervise and support smooth transition to collection.' }
      : s
    ),
    objectives: [
      'Develop power, speed, and body tension for dynamic skills.',
      'Strengthen foundational inversions (bridges, handsprings, walkovers).',
      'Introduce basic flight skills on vault and trampette.',
      'Build confidence in performing short linked routines.',
      'Reinforce safety and self-awareness through coach-assisted progressions.',
    ],
    apparatusSkills: [
      {
        apparatus: 'Floor',
        coreSkills: [
          'Back Roll → Handstand',
          'Handstand Pirouette',
          'Cartwheel × 2 (consecutive)',
          'Back Handspring (supported)',
          'Forward Walkover (supported)',
        ],
        progressionPathway: 'Roll → Handstand → Cartwheel → Link → Walkover',
        keyCoachingCues: '"Strong arms – push through shoulders – finish block and present."',
      },
      {
        apparatus: 'Beam / Line',
        coreSkills: [
          'Springboard Tuck Mount',
          'Full Coupe',
          '½ and Full Pivot Turns',
          'Star Jump (supported)',
          'Handstand (supported)',
          'Cartwheel / Round-off Dismount',
        ],
        progressionPathway: 'Low beam mount → turns → supported handstand → cartwheel off',
        keyCoachingCues: '"Eyes forward – hips square – land soft."',
      },
      {
        apparatus: 'Bars',
        coreSkills: [
          'Up Hip Circle (from 2 feet)',
          'Clear Hip Circle (assisted)',
          'Squat/Straddle Swing to Undershoot',
          'Jump to High Bar → 2 × ½ Turns',
          'German Back Hang Dismount',
        ],
        progressionPathway: 'Low bar hip circle → clear hip → swing transfer → release',
        keyCoachingCues: '"Open shoulders – tight legs – press the bar."',
      },
      {
        apparatus: 'Vault / Rebound',
        coreSkills: [
          'Squat Through',
          'Straddle Over',
          'Handspring (¾ Vault)',
          'Headspring (trampette)',
          'Dive Forward Roll',
          'Front Tuck (trampette)',
        ],
        progressionPathway: 'Run → Hurdle → Board → Block Vault → Tuck Land',
        keyCoachingCues: '"Fast run – strong block – land soft – arms up."',
      },
    ],
    teachingFocus: [
      'Encourage controlled power and extension.',
      'Teach safe spotting techniques for inversions and flight skills.',
      'Promote linking of 2–3 skills into mini routines.',
      'Strengthen core engagement and balance on apparatus.',
      'Encourage independent self-correction and awareness of form.',
    ],
    assistantCoachRoles: [
      { area: 'Warm-Up', responsibility: 'Lead heart raiser under lead direction; support stretch demo.' },
      { area: 'Floor Station', responsibility: 'Assist with spotting rolls and cartwheel drills only — no handsprings.' },
      { area: 'Beam / Vault', responsibility: 'Supervise mounts and landings; maintain safety spacing.' },
      { area: 'Bars', responsibility: 'Count swings and hold times; never spot flight elements.' },
      { area: 'Admin', responsibility: 'Record attendance & progress notes for feedback.' },
    ],
    safetyChecklist: [
      'Vault run clear and dry',
      'Springboard aligned to vault box',
      'Crash mats cover landing zones',
      'Bar area matted and 1 gymnast at a time',
      'Spotter ready for handsprings or walkovers',
    ],
    coachingReminders: [
      'Only Lead Coaches deliver Level 5 skills independently.',
      'Assistants may support basic progressions only (Levels 1–3).',
      'Prioritise technique over height or speed — quality first.',
      'Always finish every station in "Block & Present".',
      'Ensure children change and snack after class while coaches pack down.',
    ],
  },

  {
    level: 6,
    name: 'Advanced',
    fullTitle: 'UKAG Level 6 — Advanced Gymnastics',
    ageGroup: 'Ages 4–11',
    delivery: 'Lead Coaches only',
    duration: '45 mins active (65–70 mins total incl. transitions)',
    colour: '#0f172a',
    textColour: 'white',
    tagline: 'Aerials, tumbling combinations, full routines and flight dismounts',
    sessionOverview: BASE_OVERVIEW.map((s, i) =>
      i === 1 ? { ...s, description: 'Introduce theme: "Control + Creativity." Review safety, spotting zones, and expectations for independence.', coachingFocus: 'Model aerial or linking skill visually; explain controlled exits.' }
      : i === 2 ? { ...s, description: 'Power-based warm-up (Sprint Circuit / Tuck Jump Relay / Shape Chase).', coachingFocus: 'Activate legs and shoulders; emphasise posture and focus.' }
      : i === 3 ? { ...s, description: 'Advanced version — Pike, Straddle, Japana, Bridge to Kick-Over, Dish/Arch, Shoulder openers, Full Splits (20 s holds).', coachingFocus: 'Increase precision and range of motion.' }
      : i === 4 ? { ...s, description: 'Level 6 apparatus skills and sequences. Rotate every 8 min; encourage self-coaching.', coachingFocus: 'Teach dynamic connection between power and control.' }
      : i === 5 ? { ...s, description: 'Static stretching and breathing. Group reflection on focus and creativity.', coachingFocus: 'Praise mastery and goal-setting for next session.' }
      : i === 6 ? { ...s, description: 'Coaches clear equipment; children change and have snack.', coachingFocus: 'Maintain calm, structured handover; check safety.' }
      : s
    ),
    objectives: [
      'Consolidate technical skill accuracy and power.',
      'Introduce safe aerial and twisting movements.',
      'Perform linked mini-routines confidently.',
      'Develop body awareness, rhythm, and artistry.',
      'Reinforce independence, self-correction, and peer support.',
    ],
    apparatusSkills: [
      {
        apparatus: 'Floor',
        coreSkills: [
          'Round-off Back Tuck',
          'Round-off → Back Handspring (multi)',
          'Flyspring',
          'Aerial Cartwheel',
        ],
        progressionPathway: 'Round-off → Handspring → Tuck → Layout → Aerial link',
        keyCoachingCues: '"Fast run – block through shoulders – tight core – land and present."',
      },
      {
        apparatus: 'Beam / Line',
        coreSkills: [
          'Individual Routine (travels, leaps, balances, turns, tumble dismount)',
        ],
        progressionPathway: 'Low beam sequence → full beam travel → link leaps & turns → dismount',
        keyCoachingCues: '"Focus eyes – breathe steady – control each transition."',
      },
      {
        apparatus: 'Bars',
        coreSkills: [
          'Upstart from 2 feet',
          'Clear Hip Circle',
          'Squat/Straddle Swing to Upstart',
          'Forward Swing → Back Tuck Dismount',
        ],
        progressionPathway: 'Low bar cast → clear hip → upstart → swing + release',
        keyCoachingCues: '"Hips open – squeeze bar – extend on release – block finish."',
      },
      {
        apparatus: 'Vault / Rebound',
        coreSkills: [
          'Handspring ½ Turn B&P',
          'Front Tuck (trampette)',
          'Back Tuck (platform)',
        ],
        progressionPathway: 'Handspring flat-back → ½ turn → front/back tuck',
        keyCoachingCues: '"Fast run – explode off board – tight tuck – soft landing."',
      },
    ],
    teachingFocus: [
      'Emphasise safe power and precise technique.',
      'Develop routine building — encourage creative linking of 3–5 skills.',
      'Reinforce strength control in aerial movements.',
      'Allow gymnasts to problem-solve and self-coach corrections.',
      'Highlight artistry, performance quality, and presentation.',
    ],
    assistantCoachRoles: [
      { area: 'Warm-Up', responsibility: 'May assist with stretch demonstration only under Lead supervision.' },
      { area: 'Floor / Beam', responsibility: 'Manage safety spacing; no spotting aerials or flight elements.' },
      { area: 'Bars / Vault', responsibility: 'Support setup and visual feedback only.' },
      { area: 'Admin', responsibility: 'Record attendance, photos, and progress for Awards.' },
    ],
    safetyChecklist: [
      'Extra mats for aerial and vault landings',
      '1 gymnast per apparatus at a time',
      'Spotter assigned for every flight station',
      'Vault run clear and non-slip',
      'Equipment re-checked before and after each class',
    ],
    coachingReminders: [
      'Only Lead Coaches may deliver Level 6 independently.',
      'Prioritise safe progression over skill difficulty.',
      'Always reinforce "Block & Present" at each dismount.',
      'Celebrate creativity — allow gymnasts to design short routines.',
      'Ensure calm post-session change/snack routine and clear handover.',
    ],
  },
]
