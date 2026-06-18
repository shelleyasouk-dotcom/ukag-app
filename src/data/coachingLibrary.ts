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

const TRAMPOLINE_BASE_OVERVIEW: SessionStage[] = [
  {
    stage: 'Pre-Session Setup',
    time: '15 min before',
    description: 'Check trampoline frame, springs, and bed. Ensure end-deck mats and side pads are fitted. Complete safety check sheet.',
    coachingFocus: 'Spring tension even, no damaged springs, safety pads secure, clear space around all four sides.',
  },
  {
    stage: 'Welcome & Safety Brief',
    time: '5 min',
    description: 'Introduce coaches, explain trampoline rules (one at a time, stop signal, stepping off safely).',
    coachingFocus: 'Emphasise "one on" rule and how to safely stop bouncing.',
  },
  {
    stage: 'Floor Warm-Up',
    time: '8 min',
    description: 'Jogging, arm circles, ankle rotations, leg swings, shallow squats. Core activation (plank / dish).',
    coachingFocus: 'Prepare joints for repetitive impact — focus on ankles and core.',
  },
  {
    stage: 'Trampoline Familiarisation',
    time: '5 min',
    description: 'Controlled walking on bed, gentle bouncing, stop practice.',
    coachingFocus: 'Teach "Kill the Bounce" — bend knees, absorb and stop.',
  },
  {
    stage: 'Skill Work',
    time: '25 min',
    description: 'Progressive skill stations on trampoline and floor. Rotate every 6–8 min.',
    coachingFocus: 'One skill at a time, demonstrate then allow practice with spot if needed.',
  },
  {
    stage: 'Cool Down & Reflection',
    time: '5 min',
    description: 'Seated stretches, partner quad stretch, recap of skills covered.',
    coachingFocus: 'Positive reinforcement, ask gymnasts to name one thing they improved.',
  },
  {
    stage: 'Pack Down & Feedback',
    time: '5–10 min',
    description: 'End-deck mats back in position, update register, log any incidents.',
    coachingFocus: 'Ensure all gymnasts signed out safely before dismantling.',
  },
]

export const TRAMPOLINE_LIBRARY: LibraryLevel[] = [
  {
    level: 1,
    name: 'Foundation',
    fullTitle: 'UKAG Recreational Trampolining — Level 1',
    ageGroup: 'Ages 4–14',
    delivery: 'UKAG / BG Qualified Trampoline Coach',
    duration: '45 mins active (65–70 mins total)',
    colour: '#0e9f6e',
    textColour: 'white',
    tagline: 'Safe mounting, body shape jumps, seat landing and front landing',
    sessionOverview: TRAMPOLINE_BASE_OVERVIEW,
    objectives: [
      'Demonstrate waiting patiently and following coach instructions.',
      'Mount and dismount the trampoline safely.',
      'Jump consistently in the centre of the bed.',
      'Perform a controlled stop on command.',
      'Complete 5 tuck jumps, 5 star jumps and 5 straight jumps.',
      'Achieve a seat landing and a ½ twist jump.',
      'Progress through hands-and-knees bouncing to front landing (with and without mat).',
      'Design and perform a 10-contact routine from Level 1 skills.',
    ],
    apparatusSkills: [
      {
        apparatus: 'Jumps & Shapes',
        coreSkills: [
          '5 Tuck Jumps',
          '5 Star Jumps',
          '5 Straight Jumps',
          '½ Twist Jump',
          'Jumping in the centre (consistency)',
          'Controlled stop on command',
        ],
        progressionPathway: 'Straight bounce on cross → tuck/star/straight shapes in air → ½ twist → consistent return to cross',
        keyCoachingCues: '"Hips up – shape clearly – return to feet – land central on the cross."',
      },
      {
        apparatus: 'Landings',
        coreSkills: [
          'Seat Landing',
          'Seat Landing ½ Twist to Feet',
          'Hands and Knees Bouncing to Front Landing',
          'Front Landing with Mat',
          'Front Landing without Mat',
        ],
        progressionPathway: 'Hands/knees on still bed → bouncing in hands/knees position → front landing with mat → front landing without mat',
        keyCoachingCues: '"Land flat — hips, chest and chin simultaneously. Push to feet."',
      },
      {
        apparatus: 'Safety & Routine',
        coreSkills: [
          'Waiting patiently on the side',
          'Mounting and dismounting safely',
          '10-contact routine (present at start and finish)',
        ],
        progressionPathway: 'Individual skills → link two skills → build to 10-contact routine → present at start and finish',
        keyCoachingCues: '"Present tall – perform – present tall. Show you are in control."',
      },
    ],
    teachingFocus: [
      'Safety rules and the "one on" rule are established from the very first session — rules before bouncing.',
      'Short turns (6–8 contacts) keep gymnasts focused and prevent fatigue-related errors.',
      'Demonstrate every skill before the gymnast attempts it — visual modelling is essential.',
      'Front landing technique: the entire front surface lands simultaneously — hips, chest, and chin at the same moment.',
      'Praise effort and small improvements consistently; enjoyment drives long-term participation.',
    ],
    assistantCoachRoles: [
      { area: 'End-Deck Position', responsibility: 'Stand ready at end-deck to support seat landing and front landing progressions.' },
      { area: 'Queue Management', responsibility: 'Keep waiting gymnasts calm, engaged and safely away from the frame at all times.' },
      { area: 'Floor Warm-Up', responsibility: 'Lead shape jumps and core warm-up for gymnasts not currently on the trampoline.' },
      { area: 'Register & Sign-Offs', responsibility: 'Record attendance and note award skill sign-offs as each skill is achieved.' },
    ],
    safetyChecklist: [
      'Frame pads and spring pads checked before every session',
      'End-deck safety mats fitted and flush with the bed',
      'Only one gymnast on the trampoline at any time',
      'No jewellery; bare feet or non-slip socks on the trampoline bed',
      'Clear space (minimum 1.5 m) around all four sides',
      'First aid kit and incident log accessible',
      'Gymnasts must wait their turn a safe distance from the frame',
    ],
    coachingReminders: [
      'Never leave the trampoline unattended while gymnasts are present.',
      '"Kill the Bounce" must be practised every session before any skill work begins.',
      'Front landings: use the mat until technique is fully consistent — never rush to remove it.',
      'Celebrate every first: first seat landing, first front landing without the mat.',
    ],
  },

  {
    level: 2,
    name: 'Development',
    fullTitle: 'UKAG Recreational Trampolining — Level 2',
    ageGroup: 'Ages 4–14',
    delivery: 'UKAG / BG Qualified Trampoline Coach',
    duration: '45 mins active (65–70 mins total)',
    colour: '#0891b2',
    textColour: 'white',
    tagline: 'Spotting awareness, back landing, full twist and combination skills',
    sessionOverview: TRAMPOLINE_BASE_OVERVIEW,
    objectives: [
      'Understand why we spot each other on the trampoline.',
      'Perform 10 tuck, straddle and pike jumps with control.',
      'Achieve 5 consistent seat landings.',
      'Complete a full twist jump (360°).',
      'Perform seat ½ twist combinations and ½ twist to seat landing.',
      'Progress through flat back and back landings (mat assisted to independent).',
      'Link seat landing through hands and knees to front landing.',
      'Design and perform a 10-contact routine from Level 2 skills.',
    ],
    apparatusSkills: [
      {
        apparatus: 'Jumps & Twists',
        coreSkills: [
          '10 Tuck Jumps',
          '10 Straddle Jumps',
          '10 Pike Jumps',
          'Full Twist Jump (360°)',
          'Seat Landing ½ Twist to Feet, Seat Landing',
          '½ Twist to Seat Landing',
        ],
        progressionPathway: '½ twist secure → full twist with arms driving tight to body → land on cross every time',
        keyCoachingCues: '"Spot a point – pull arms tight – feet follow – central landing."',
      },
      {
        apparatus: 'Landings',
        coreSkills: [
          '5 Seat Landings (controlled)',
          'Flat Back Landing on a Mat',
          'Back Landing on a Mat',
          'Back Landing (independent)',
          'Seat Landing to Hands and Knees to Front Landing',
          'Hands and Knees to Seat Landing',
        ],
        progressionPathway: 'Flat back on mat → back landing on mat → independent back landing; seat → hands/knees → front landing as a linked sequence',
        keyCoachingCues: '"Chin to chest — hands up — land flat on your back — push to feet."',
      },
      {
        apparatus: 'Routine',
        coreSkills: [
          '10-contact routine from Level 2 skills',
          'Present at start and finish',
          'Control and consistency throughout',
        ],
        progressionPathway: 'Individual skills → link pairs → build to 10 contacts → perform with presentation',
        keyCoachingCues: '"Flow from skill to skill — land central before the next move."',
      },
    ],
    teachingFocus: [
      'Introduce spotting responsibility: gymnasts learn why we protect each other when two people are near the trampoline.',
      'Back landing: chin to chest is non-negotiable — the head must never contact the bed.',
      'Always use the mat for back landing until technique is completely secure — never rush to remove it.',
      'Full twist: teach the body wrap (arms pull tight) rather than a wide swing-through action.',
      'Video analysis at this level helps gymnasts see their own technique and track improvement session to session.',
    ],
    assistantCoachRoles: [
      { area: 'Physical Support', responsibility: 'Support back landing learning from end-deck — be ready to intervene if technique breaks.' },
      { area: 'Mat Management', responsibility: 'Place and remove landing mats on instruction of head coach only.' },
      { area: 'Routine Counting', responsibility: 'Count contacts in routine practice and note which skills the gymnast includes.' },
      { area: 'Register & Sign-Offs', responsibility: 'Record skill sign-offs and any incidents during the session.' },
    ],
    safetyChecklist: [
      'Landing mats / flat back mats positioned for back landing progressions',
      'End-deck mats fitted and flush throughout',
      'Minimum 2 coaches present when practising back landings',
      'No unsupervised practice of back landings at any time',
      'Height kept low until back landing technique is consistent and secure',
      'Gymnasts understand the spotter role before Level 2 back landing begins',
    ],
    coachingReminders: [
      'Never progress to independent back landing without the mat-assisted version being fully secure.',
      'Chin to chest: reinforce on every single back landing attempt without exception.',
      'Combination skills: always teach each element individually before linking them together.',
      'Back landing at this level must be from a low bounce — height is not the goal.',
    ],
  },

  {
    level: 3,
    name: 'Intermediate',
    fullTitle: 'UKAG Recreational Trampolining — Level 3',
    ageGroup: 'Ages 4–14',
    delivery: 'UKAG / BG Qualified Trampoline Coach',
    duration: '45 mins active (65–70 mins total)',
    colour: '#7c3aed',
    textColour: 'white',
    tagline: '1.5 twist, swivel hips, seat-to-front and front-to-seat combinations, forward roll',
    sessionOverview: TRAMPOLINE_BASE_OVERVIEW,
    objectives: [
      'Support other bouncers through mat-pushing and motivation.',
      'Perform 10 tuck, straddle and pike jumps with consistency.',
      'Achieve 5 controlled seat landings.',
      'Complete a 1.5 twist jump.',
      'Perform swivel hips: seat landing, ½ twist, seat landing.',
      'Link seat landing → hands and knees → front landing → feet.',
      'Progress seat-to-front and front-to-seat landing combinations (with and without mat).',
      'Perform a forward roll on the trampoline.',
      'Design and perform a 10-contact routine from Level 3 skills.',
    ],
    apparatusSkills: [
      {
        apparatus: 'Jumps & Twists',
        coreSkills: [
          '10 Tuck / Straddle / Pike Jumps',
          '5 Seat Landings',
          '1.5 Twist Jump',
          'Swivel Hips (Seat Landing ½ Twist Seat Landing)',
        ],
        progressionPathway: '1 twist secure → 1.5 twist with controlled arm drive overhead → swivel hips as a smooth, linked movement',
        keyCoachingCues: '"Drive arms over – keep hips up – pull tight to complete the extra half."',
      },
      {
        apparatus: 'Landing Combinations',
        coreSkills: [
          'Seat Landing to Hands and Knees to Front Landing to Feet',
          'Seat to Front Landing with Mat',
          'Seat to Front Landing to Feet',
          'Front Landing to Seat Landing with Mat',
          'Front to Seat Landing to Feet',
        ],
        progressionPathway: 'Each transition practised separately → linked pairs → full combination → remove mat only when consistently secure',
        keyCoachingCues: '"Each landing is a platform — control it, then drive into the next skill."',
      },
      {
        apparatus: 'Rolls',
        coreSkills: [
          'Forward Roll on Trampoline',
        ],
        progressionPathway: 'Forward roll on floor mat → forward roll on stationary trampoline bed → forward roll from a low bounce',
        keyCoachingCues: '"Chin to chest – tuck tight – reach through – push to feet."',
      },
    ],
    teachingFocus: [
      'Peer support becomes an active skill at Level 3: gymnasts learn mat-pushing and motivational support — these are coached behaviours.',
      'Swivel hips: the ½ twist must be fully completed before the seat lands again — it is not a gradual roll through.',
      'Seat-to-front combination: gymnasts must fully control the seat landing before driving into the front landing.',
      'Front-to-seat: the return from front to seat requires a strong, flat push from the bed with arms extended.',
      'Forward roll: the roll must be controlled and tight — a collapse or rushed roll is a technique error, not a style choice.',
    ],
    assistantCoachRoles: [
      { area: 'Mat Pushing', responsibility: 'Push mat into position under gymnast during seat-to-front progressions on head coach instruction only.' },
      { area: 'Physical Support', responsibility: 'Support forward roll and seat/front landing combinations from end-deck position.' },
      { area: 'Peer Role Modelling', responsibility: 'Coach gymnasts explicitly in how to support and encourage their peers constructively.' },
      { area: 'Register & Sign-Offs', responsibility: 'Record skill completions and note which combination links have been achieved.' },
    ],
    safetyChecklist: [
      'Landing mats available for all seat-to-front and front-to-seat progressions',
      'Mat pushing must be done by assistant coach only — not by gymnasts without explicit training',
      'End-deck mats fitted throughout all Level 3 sessions',
      'Forward roll: always begin on floor mat — first attempt must never be on the trampoline bed',
      'Minimum 2 coaches present for all combination landing sessions',
    ],
    coachingReminders: [
      'Remove the mat for seat-to-front only when the gymnast is completely consistent and controlled with it.',
      'Swivel hips: a common error is rotating the hips only — the whole body must rotate together.',
      'Forward roll on trampoline: gymnasts who hesitate must return to the floor mat before retrying.',
      'Acknowledge gymnasts who show good peer support — it builds a strong, positive club culture.',
    ],
  },

  {
    level: 4,
    name: 'Progressive',
    fullTitle: 'UKAG Recreational Trampolining — Level 4',
    ageGroup: 'Ages 4–14',
    delivery: 'UKAG / BG Qualified Trampoline Coach',
    duration: '45 mins active (65–70 mins total)',
    colour: '#d97706',
    textColour: 'white',
    tagline: 'Backward roll, seat-to-front sequences, back landing twists and forward turnover',
    sessionOverview: TRAMPOLINE_BASE_OVERVIEW,
    objectives: [
      'Encourage and support other bouncers consistently.',
      'Perform 10 tuck, straddle and pike jumps confidently.',
      'Perform seat → front → seat → front landing sequence.',
      'Complete a backward roll on the trampoline.',
      'Perform swivel hips continuing to ½ twist to feet.',
      'Execute back landing ½ twist to feet and ½ twist to back landing combinations.',
      'Achieve forward turnover to back landing.',
      'Perform front landing ½ twist to feet and ½ twist to front landing combinations.',
      'Design and perform a 10-contact routine from Level 4 skills.',
    ],
    apparatusSkills: [
      {
        apparatus: 'Seat & Front Sequences',
        coreSkills: [
          'Seat → Front → Seat → Front Landing (continuous)',
          'Front Landing ½ Twist to Feet',
          '½ Twist to Front Landing to Feet',
          'Front Landing ½ Twist to Hands and Knees, Front Landing to Feet',
          'Hands and Knees ½ Twist to Front Landing to Feet',
        ],
        progressionPathway: 'Seat/front pairs → seat/front/seat → full four-landing sequence; front landing twists taught after front landing is independently secure',
        keyCoachingCues: '"Control each landing — push flat — stay tight through the twist."',
      },
      {
        apparatus: 'Back Landing Twists',
        coreSkills: [
          'Swivel Hips ½ Twist to Feet (seat, ½ twist, seat, ½ twist, feet)',
          'Back Landing ½ Twist to Feet',
          '½ Twist to Back Landing to Feet',
          'Back Landing ½ Twist to Feet, Back Landing to Feet',
          'Back Landing to Feet, ½ Twist to Back Landing to Feet',
        ],
        progressionPathway: 'Back landing secure → ½ twist from back landing → ½ twist to back landing → combine both directions in sequence',
        keyCoachingCues: '"Chin to chest on every back landing — initiate twist from shoulders — drive to feet."',
      },
      {
        apparatus: 'Rolls & Turnovers',
        coreSkills: [
          'Backward Roll on Trampoline',
          'Forward Turnover to Back Landing',
        ],
        progressionPathway: 'Backward roll on mat → backward roll on stationary bed → from low bounce; forward turnover always with physical support until consistent',
        keyCoachingCues: '"Tight tuck – chin to chest – roll through evenly – do not rush."',
      },
    ],
    teachingFocus: [
      'Level 4 introduces complex combinations — each element must be individually secure before linking.',
      'Backward roll: weight is carried through the shoulders — the head must not bear any weight during the roll.',
      'Forward turnover to back landing: always taught with hands-on physical support — this is the foundation of the back somersault.',
      'Back landing twists: chin-to-chest must be maintained throughout the rotation — never allow the head to lead.',
      'Encourage gymnasts to design their own 10-contact routine using Level 4 elements — builds ownership and routine awareness.',
    ],
    assistantCoachRoles: [
      { area: 'Physical Support', responsibility: 'Support backward roll and forward turnover with hands-on spotting under head coach direction.' },
      { area: 'Combination Sequencing', responsibility: 'Help gymnasts recall and rehearse the order of elements in their combination sequences.' },
      { area: 'Peer Encouragement', responsibility: 'Model and prompt gymnast-to-gymnast encouragement as an explicitly coached behaviour.' },
      { area: 'Register & Sign-Offs', responsibility: 'Record individual skill sign-offs and report any technique concerns to head coach.' },
    ],
    safetyChecklist: [
      'Physical support in place for backward roll until gymnast is fully independent',
      'Forward turnover to back landing: always with hands-on support until consistency is established',
      'End-deck mats fitted throughout all Level 4 sessions',
      'Minimum 2 coaches present for all turnover and backward roll work',
      'Height kept controlled — technique must never be sacrificed to gain height',
    ],
    coachingReminders: [
      'Backward roll on trampoline: return to floor mat immediately if technique breaks down.',
      'Forward turnover is the foundation of the back somersault — be patient and precise at this stage.',
      'Back landing twists: gymnast must return to feet independently from back landing before any twist is added.',
      'Level 4 gymnasts should be able to explain their routine elements — not just perform them.',
    ],
  },

  {
    level: 5,
    name: 'Performance',
    fullTitle: 'UKAG Recreational Trampolining — Level 5',
    ageGroup: 'Ages 4–14',
    delivery: 'UKAG / BG Qualified Trampoline Coach',
    duration: '55 mins active (75–80 mins total)',
    colour: '#dc2626',
    textColour: 'white',
    tagline: 'Backward pullover, full twist landing combinations and turntable',
    sessionOverview: TRAMPOLINE_BASE_OVERVIEW.map((s: SessionStage, i: number) =>
      i === 4 ? { ...s, description: 'Backward pullover, full-twist-to-landing combinations, turntable, and 10-contact routine refinement.', coachingFocus: 'Physical support mandatory for backward pullover; gymnasts provide hand support to peers under coach direction.' }
      : s
    ),
    objectives: [
      'Provide hand support to other gymnasts under coach supervision.',
      'Warm up independently to 50 contacts of varied moves.',
      'Achieve backward pullover on the trampoline.',
      'Link back landing to front landing to feet (and reverse).',
      'Complete full twist to front landing to feet.',
      'Complete full twist to back landing to feet.',
      'Perform seat landing full twist and full twist to seat landing.',
      'Achieve seat landing ½ twist to back landing.',
      'Complete front landing ½ twist to front landing (turntable).',
      'Design and perform a 10-contact routine from Level 5 skills.',
    ],
    apparatusSkills: [
      {
        apparatus: 'Full Twist Combinations',
        coreSkills: [
          'Full Twist to Front Landing to Feet',
          'Full Twist to Back Landing to Feet',
          'Seat Landing Full Twist',
          'Full Twist to Seat Landing',
          'Seat Landing ½ Twist to Back Landing',
        ],
        progressionPathway: 'Full twist jump secure → full twist to front landing → full twist to back landing; seat landing twists build from ½ to full',
        keyCoachingCues: '"Complete the twist before the landing — do not open out early."',
      },
      {
        apparatus: 'Advanced Combinations',
        coreSkills: [
          'Back Landing to Front Landing to Feet',
          'Front Landing to Back Landing to Feet',
          'Front Landing ½ Twist to Front Landing (Turntable)',
        ],
        progressionPathway: 'Each transition individually first → linked pair → full sequence; turntable requires immediate hip rotation from the front landing rebound',
        keyCoachingCues: '"Land flat, drive the hips — rotate efficiently — return to the same position."',
      },
      {
        apparatus: 'Backward Pullover',
        coreSkills: [
          'Warm-Up: 50 Contacts of Varied Moves',
          'Backward Pullover (with coach hand support)',
        ],
        progressionPathway: 'Forward roll secure → backward roll secure → backward pullover with hands-on support → gradually reduce support as confidence grows',
        keyCoachingCues: '"Tuck tight – chin to chest – pull over – find the bed – push to feet."',
      },
    ],
    teachingFocus: [
      'Gymnasts begin to assist each other with hand support at Level 5 — this is a coached skill, taught explicitly with correct hand positions.',
      'Backward pullover: always with physical hand support — never attempted without a coach present and supporting.',
      'Turntable (front ½ twist to front): the ½ twist must be initiated immediately from the front landing rebound — the hips must lead the rotation.',
      'Full twist to landing: the twist must be completed before the landing surface is reached — any late opening creates unsafe and uncontrolled landings.',
      'The 50-contact warm-up develops conditioning and body memory; gymnasts should actively vary their shapes and skill choices throughout.',
    ],
    assistantCoachRoles: [
      { area: 'Hand Support Training', responsibility: 'Teach gymnasts correct hand support position and when to apply it, under head coach direction only.' },
      { area: 'Physical Support — Pullover', responsibility: 'Provide hands-on support for backward pullover under head coach guidance throughout the learning phase.' },
      { area: 'Warm-Up Management', responsibility: 'Count contacts and actively coach variety of moves during the 50-contact warm-up.' },
      { area: 'Routine Practice Judging', responsibility: 'Act as practice judge for routines using Level 5 criteria to prepare gymnasts for competition.' },
    ],
    safetyChecklist: [
      'Backward pullover: hands-on support is mandatory at all times during the learning phase',
      'Hand support positions must be explicitly taught — gymnasts never support without a coach instruction',
      'End-deck mats fitted throughout all Level 5 sessions',
      'Minimum 2 coaches present for backward pullover and full twist to landing sessions',
      'Turntable: begin with landing mat assistance if gymnast is uncertain of rotation direction',
    ],
    coachingReminders: [
      'Never allow a gymnast to attempt backward pullover without hands-on support until both coach and gymnast are completely confident.',
      'Full twist to landing: if gymnast is opening the twist early, reduce height and rebuild the arm wrap before adding height again.',
      'Level 5 gymnasts should understand competition format and be able to discuss their routine element choices.',
      'Peer hand support is a responsibility at this level — acknowledge gymnasts who support their peers effectively.',
    ],
  },

  {
    level: 6,
    name: 'Elite',
    fullTitle: 'UKAG Recreational Trampolining — Level 6 (Platinum)',
    ageGroup: 'Ages 4–14',
    delivery: 'UKAG / BG Qualified Trampoline Coach (overhead rig or belt required for somersaults)',
    duration: '55 mins active (75–80 mins total)',
    colour: '#0f172a',
    textColour: 'white',
    tagline: 'Back and front somersaults, barani, cradle and Platinum award completion',
    sessionOverview: TRAMPOLINE_BASE_OVERVIEW.map((s: SessionStage, i: number) =>
      i === 4 ? { ...s, description: 'Somersault progressions (overhead rig / spotting belt), linking somersaults, cradle, barani. Routine building to Platinum standard.', coachingFocus: 'Overhead rig or spotting belt mandatory for all somersault work until the gymnast is formally assessed as independent.' }
      : i === 3 ? { ...s, description: 'Controlled straight bounce to height, consistent stop on command, 50-contact varied warm-up.', coachingFocus: 'Height and consistency on the stop must be established before any somersault work begins.' }
      : s
    ),
    objectives: [
      'Actively support other gymnasts in achieving their goals.',
      'Warm up independently to 50 contacts of varied moves.',
      'Complete back somersault in tuck, pike and straight positions.',
      'Complete front somersault in tuck and pike positions.',
      'Link somersaults together within a routine.',
      'Perform a cradle (back landing ½ twist to back landing).',
      'Perform a barani (front somersault with ½ twist).',
      'Design and perform a 10-contact routine to Platinum standard.',
    ],
    apparatusSkills: [
      {
        apparatus: 'Back Somersaults',
        coreSkills: [
          'Back Somersault — Tuck (belted / spotted)',
          'Back Somersault — Pike (belted / spotted)',
          'Back Somersault — Straight (belted / spotted)',
        ],
        progressionPathway: 'Forward turnover → backward pullover → belted back tuck → reduce support incrementally → back pike → back straight',
        keyCoachingCues: '"Punch the bed – set height – tuck tight – spot the bed – kick out and land tall."',
      },
      {
        apparatus: 'Front Somersaults & Advanced Skills',
        coreSkills: [
          'Front Somersault — Tuck (belted / spotted)',
          'Front Somersault — Pike (belted / spotted)',
          'Barani (Front Somersault with ½ Twist)',
          'Cradle (Back Landing ½ Twist to Back Landing)',
        ],
        progressionPathway: 'Front landing to feet secure → belted front tuck → front pike; barani only after front tuck is independent; cradle from Level 5 back landing base',
        keyCoachingCues: '"Drive forward from the bed – tuck hard – spot the bed – kick through to land."',
      },
      {
        apparatus: 'Linking & Routine',
        coreSkills: [
          'Linking Somersaults (e.g. back tuck to back tuck)',
          '10-contact Platinum routine',
          'Present at start and finish',
          'Consistent height and control throughout',
        ],
        progressionPathway: 'Individual somersaults consistent → two linked → three linked → routine incorporating somersaults and non-somersault elements',
        keyCoachingCues: '"Each somersault must be consistent alone before you link — quality always over quantity."',
      },
    ],
    teachingFocus: [
      'All somersault work at Level 6 must use an overhead rig, spotting belt, or consistent physical support — this is not negotiable.',
      'Barani: gymnasts must have a fully consistent, independent front somersault tuck before any barani work begins; the ½ twist is initiated at the peak of the somersault.',
      'Cradle: independent back landing must be fully established at Level 5 before the cradle is introduced.',
      'Linking somersaults: do not link two somersaults until each is individually consistent — linking before readiness is the leading cause of serious injury at this level.',
      'Level 6 gymnasts become role models for the whole programme — actively harness this to build a strong club community.',
    ],
    assistantCoachRoles: [
      { area: 'Overhead Rig / Belt Operation', responsibility: 'Operate overhead rig under head coach direction only — must hold the relevant BG/UKAG rig certification.' },
      { area: 'Physical Spotting', responsibility: 'Spot somersaults from end-deck under head coach direction for gymnasts not yet using the rig.' },
      { area: 'Role Model Facilitation', responsibility: 'Support Level 6 gymnasts in mentoring and inspiring lower-level gymnasts in the session.' },
      { area: 'Platinum Record Keeping', responsibility: 'Maintain detailed records of somersault progressions and all Platinum award sign-offs.' },
    ],
    safetyChecklist: [
      'Overhead rig / spotting belt inspected, certified and correctly set up before session begins',
      'Minimum 2 qualified coaches present for all somersault sessions',
      'Written parent / guardian consent obtained for overhead rig or belt work',
      'No independent somersault practice — a coach must be actively present and attentive at all times',
      'Crash mats positioned for all somersault progressions not on the rig',
      'Maximum 1 coach per 3 gymnasts during somersault sessions',
      'Rig height adjusted correctly for each gymnast before use',
    ],
    coachingReminders: [
      'Never allow an unsupported somersault until both head coach and gymnast are completely confident — the decision is always the coach\'s.',
      'Barani: gymnasts who rush the ½ twist initiation create dangerous landings — patience at this stage is essential.',
      'Platinum completion is a major milestone — celebrate it properly and ensure it is recorded in the gymnast\'s award book.',
      'Encourage Level 6 gymnasts toward the competitive or teacher/assessor pathway if they show the aptitude and interest.',
    ],
  },
]
