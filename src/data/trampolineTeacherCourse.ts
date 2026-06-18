export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
}

export interface ModuleSection {
  title: string
  content: string[]
}

export interface CourseModule {
  id: string
  title: string
  duration: string
  sections: ModuleSection[]
  quiz: QuizQuestion[]
}

export interface TrampolineTeacherCourseData {
  id: 'trampoline_teacher_v1'
  title: string
  description: string
  modules: CourseModule[]
}

export const TRAMPOLINE_TEACHER_COURSE: TrampolineTeacherCourseData = {
  id: 'trampoline_teacher_v1',
  title: 'UKAG Trampolining Teacher Certificate (Level 1 & 2)',
  description: 'The UKAG combined Level 1 and Level 2 Trampolining Teacher Certificate for school-based PE and sports teachers. Covers safe delivery of trampolining as part of a PE curriculum, from equipment checks to advanced skill progressions.',
  modules: [
    {
      id: 'module-1',
      title: 'Code of Practice & Your Responsibilities',
      duration: '15 min',
      sections: [
        {
          title: 'Code of Practice',
          content: [
            'UK Academies of Gymnastics promotes current Best Coaching Practice through its coach education programme and provides Codes of Practice and Ethics through the Health Welfare and Safety Policy Document.',
            'Trampolining is potentially dangerous. The purpose of this Code of Practice is to help both participants and coaches operate safely.',
            'It is recommended that all equipment is inspected annually.',
            'This guide is for all those who coach/teach and participate in trampolining. A safety poster should be displayed prominently in the facility.',
          ],
        },
        {
          title: 'General Guidelines',
          content: [
            'Trampolining should always be supervised by a qualified coach/teacher.',
            'The coach/organiser is responsible for assessing the suitability of the environment.',
            'Coaches/Teachers may, during and post course guided learning, practise coaching those elements covered on the course, under the guidance of a Mentor Coach. However, they may not prepare participants for competition until fully qualified at that level.',
            'Coaches/Teachers should be aware of emergency procedures for trampolining at the facility.',
            'When using more than one trampoline, coaches should carefully assess: the age, experience, varying abilities, number and discipline of the participants; their own qualifications and experience; their ability to observe, advise, support and respond to the difficulties of anyone in the trampolining area.',
            'It is the responsibility of the coach to ensure that the person sliding in the push-in mat, both in training and competition, if not a qualified coach, is trained, experienced, familiar with the performer and of sufficient maturity.',
          ],
        },
        {
          title: 'Your Scope of Practice',
          content: [
            'As a UKAG Trampolining Teacher, you are qualified to lead class-based trampolining lessons in a school setting.',
            'You may teach elements covered on this course under the guidance of a Mentor Coach during post-course guided learning.',
            'You must not prepare participants for competition until you hold the appropriate competition qualification.',
            'Always work within your qualification level and seek further development when needed.',
          ],
        },
      ],
      quiz: [
        {
          question: 'Who is responsible for assessing the suitability of the trampolining environment?',
          options: [
            'The school headteacher',
            'The coach/organiser',
            'The local authority',
            'The pupils themselves',
          ],
          answer: 1,
        },
        {
          question: 'How often is it recommended that trampoline equipment is inspected?',
          options: [
            'Monthly',
            'Every six months',
            'Annually',
            'Every two years',
          ],
          answer: 2,
        },
        {
          question: 'When may a newly qualified teacher prepare participants for competition?',
          options: [
            'Immediately after qualifying',
            'After 6 months of teaching',
            'Only when fully qualified at that competition level',
            'Never',
          ],
          answer: 2,
        },
        {
          question: 'What should be displayed prominently in the trampolining facility?',
          options: [
            'The register of qualified coaches',
            'The safety poster',
            'The session timetable',
            'The equipment manual',
          ],
          answer: 1,
        },
      ],
    },
    {
      id: 'module-2',
      title: 'Equipment Setup & Safety Checks',
      duration: '20 min',
      sections: [
        {
          title: 'Key Safety Risks During Setup',
          content: [
            'There are two main designs of trampoline with different risks. People putting trampolines away should be aware of three major risks.',
            'While folding the frame ends in, the risk of arms becoming trapped between the frame end and frame.',
            'While using lift-lower roller stands, the risk of being struck by the lever.',
            'Where lift-lower roller stands are not available, the need for good lifting practice to reduce the risk of back injury.',
            'All manual handling of trampolines should be undertaken under the supervision of a person trained in safe handling by a qualified coach or tutor.',
            'It is common practice for children to assist under supervision of trained persons — particularly close supervision is required while this experience is gained.',
          ],
        },
        {
          title: 'Equipment Arrangement',
          content: [
            'The arrangement of trampolines should be chosen with regard to best overall safety, considering: headroom, risk of hitting walls, lighting, other activities (particularly ball sports), providing safety mats at the end of each trampoline, and practicability of manual handling.',
            'Generally it is beneficial to provide safety mats at each end of the trampoline, supported where possible at trampoline level.',
            'Floor mats beside the trampoline help keep feet warm and provide cushioning in the event of tripping.',
            'Equipment should be checked regularly and inspected (typically annually). Defects that affect safety should be rectified before equipment is returned to use.',
            'Coaches/teachers should be aware of the emergency plans at the facility.',
          ],
        },
        {
          title: 'Pre-Session Safety Checks',
          content: [
            'SUSPENSION: The sharp edge of springs should be on the underside of the trampoline (not pointing up).',
            'SAFETY MATTING: Frame pads are attached to the frame; pads retain foam throughout.',
            'BEDS: Are in acceptable condition — run fingers along centre box to quickly check for loose stitching.',
            'FRAME: Allen screws, hinge pins, t-joints and chains are present and tight; frame is level; leg braces are inserted.',
            'ROLLER STANDS: Castors and wheels move freely; safety catches engage positively.',
          ],
        },
        {
          title: 'Bouncer Safety Rules (Display in Your Facility)',
          content: [
            '1 person on the trampoline at a time (unless being instructed)',
            'Do not put your fingers in the bed/holes',
            'Do not touch the springs',
            'Do not go under the trampoline',
            'Do not distract the bouncer',
            'Carefully mount and dismount the trampoline',
            'Bounce in the middle facing the end decks',
            'Long hair must be tied back',
            'Spot other bouncers while waiting',
          ],
        },
      ],
      quiz: [
        {
          question: 'Where should the sharp edge of trampoline springs face?',
          options: [
            'Upward, to be visible',
            'Downward, on the underside of the bed',
            'Outward to the side',
            'It does not matter',
          ],
          answer: 1,
        },
        {
          question: 'What is the first priority for available safety mats?',
          options: [
            'Beside the trampoline for stepping on',
            'At each end of the trampoline at trampoline level',
            'Under the trampoline frame',
            'Against the wall',
          ],
          answer: 1,
        },
        {
          question: 'How do you quickly check the trampoline bed for loose stitching?',
          options: [
            'Bounce on it lightly',
            'Run your fingers along the centre box',
            'Check visually from the side',
            'Use a torch to inspect underneath',
          ],
          answer: 1,
        },
        {
          question: 'What is the maximum number of people on the trampoline at one time during a class?',
          options: [
            '2, to allow peer support',
            '3, with an experienced teacher present',
            '1 person, unless being instructed',
            'As many as can fit safely',
          ],
          answer: 2,
        },
      ],
    },
    {
      id: 'module-3',
      title: 'Teaching Shape Jumps & Twists',
      duration: '25 min',
      sections: [
        {
          title: 'Mounting & Dismounting Safely',
          content: [
            'Participants should jump up to mount, being aware not to grab springs or use chains to climb up.',
            'Coaching blocks or a suitable surface can be used as a step to assist mounting.',
            'When dismounting, participants must stop bouncing, walk to the edge, sit down and slide onto the front, slowly dismounting.',
            'Never allow participants to jump off the trampoline.',
          ],
        },
        {
          title: 'The Four Shape Jumps',
          content: [
            'TUCK JUMP: Both knees pulled up toward the chest, hands placed on shins, body upright in the air.',
            'PIKE JUMP: Legs straight and raised to horizontal or above, hands reach toward feet, body piked at the hips.',
            'STRADDLE JUMP: Legs straight and spread wide apart in a straddle position, hands reach toward feet.',
            'STRETCH/STRAIGHT JUMP: Body fully extended and straight, arms raised, good body tension throughout.',
            'Teaching tip: Establish the straight jump first as the foundation. Practise each shape individually before combining them in a sequence.',
          ],
        },
        {
          title: 'Teaching Twists',
          content: [
            '½ TWIST JUMP (180°): Half rotation of the body. Start with small rotations — practise ¼ twist first to build confidence before progressing to ½ twist.',
            'FULL TWIST JUMP (360°): Full rotation. Ensure the half twist is consistent and well controlled before introducing the full twist.',
            '1.5 TWIST JUMP (450°): One and a half rotations. Only progress here once the full twist is fully secure.',
            'Key teaching principle: always reduce to ¼ twist before moving to ½ twist when introducing any new twisting move. Use a mat to build confidence.',
            'Pupils should always know which direction they will twist before beginning the skill.',
          ],
        },
        {
          title: 'Controlled Stops',
          content: [
            'The controlled stop is one of the most important skills to establish early.',
            'Teach pupils to absorb the bounce on landing, bending the knees, and bringing the body to a complete stop in the centre of the bed.',
            'Practise the controlled stop after every sequence until it becomes automatic.',
            'A pupil who cannot perform a controlled stop should not progress to more complex skills.',
          ],
        },
        {
          title: 'Warm-Up Sequence (Beginner)',
          content: [
            'Begin every session with a structured warm-up on the trampoline. The UKAG recommended beginner warm-up is consecutive bounces as follows:',
            '10 Tuck Jumps → 10 Pike Jumps → 10 Straddle Jumps → 5 Seat Landings to Feet',
            'This sequence ensures pupils are warmed up, height is controlled, and fundamental shapes are reviewed at the start of each lesson.',
          ],
        },
      ],
      quiz: [
        {
          question: 'What is the correct way for a pupil to dismount a trampoline?',
          options: [
            'Jump off the end onto a safety mat',
            'Walk to the edge, sit, and slide off slowly',
            'Step off the side onto a coaching block',
            'Jump off with a controlled landing',
          ],
          answer: 1,
        },
        {
          question: 'Which jump should be established first as the foundation for all shape jumps?',
          options: [
            'Tuck jump',
            'Straddle jump',
            'Stretch/straight jump',
            'Pike jump',
          ],
          answer: 2,
        },
        {
          question: 'What is the teaching progression for introducing twist jumps?',
          options: [
            'Start with the full twist and reduce if needed',
            'Practise ¼ twist before moving to ½ twist',
            'Begin with 1.5 twist and work backward',
            'Only introduce twists once somersaults are learned',
          ],
          answer: 1,
        },
        {
          question: 'When should a pupil progress to more complex skills?',
          options: [
            'After 5 successful attempts at the current skill',
            'Once they can perform a controlled stop consistently',
            'After the teacher judges them ready',
            'At the start of the next lesson',
          ],
          answer: 1,
        },
      ],
    },
    {
      id: 'module-4',
      title: 'Body Landings & Progressions',
      duration: '25 min',
      sections: [
        {
          title: 'Seat Landing',
          content: [
            'POSITION: Seated in a pike position, legs straight and together, hands placed flat on the bed with fingers facing forward.',
            'Teaching tip: Establish a solid static seat landing position on the bed before bouncing into it.',
            'Progress to seat landing with small bounces before adding height.',
          ],
        },
        {
          title: 'Front Landing',
          content: [
            'POSITION: Lying on the front, hands under the chest, feet raised by bending the knees.',
            'KEY COACHING POINT: Centre of mass is pushed BACK in forward motion moves. This is critical for safety.',
            'PROGRESSION SEQUENCE: (1) Steady hands and knees bouncing → (2) Hands and knees to front landing → (3) From feet to hands and knees to front landing → (4) Front landing with a push and go on a landing mat → (5) Front landing with bouncing on a landing mat → (6) Front landing with a push and go on the bed → (7) Front landing with small bounces on the bed.',
            'Always use a landing mat when first introducing front landing to the trampoline bed.',
          ],
        },
        {
          title: 'Back Landing',
          content: [
            'POSITION: Lying on the back, legs raised at an angle, arms in line with the legs, head and shoulders off the bed looking forward.',
            'KEY COACHING POINT: Centre of mass is pushed FORWARD in back motion moves. This is critical for safety.',
            'PROGRESSION SEQUENCE: (1) Flatback on a safety mat — arms crossed in front of chest, hips pushed up and forward for bouncer to land on their back in the centre of the mat → (2) Back landing with a push and go on a landing mat → (3) Back landing with bouncing on a landing mat → (4) Back landing with a push and go on the bed → (5) Back landing with small bounces on the bed.',
          ],
        },
        {
          title: 'Beginner Linked Moves',
          content: [
            'Only introduce linked moves once the individual elements are fully secure.',
            'BEGINNER LINKED ROTATIONS AND TWISTS: Seat landing ½ twist to feet; ½ twist to seat landing to feet; ½ twist to front landing to feet; Front landing ½ twist to feet; ½ twist to back landing to feet; Back landing ½ twist to feet; Seat landing to front landing to feet; Front landing to seat landing to feet; Seat landing ½ twist to seat landing to feet (Swivel Hips); Hands and knees forward turnover to back or seat to feet.',
            'PROGRESSION TIPS FOR LINKED TWISTS: Reduce any twisting moves to ¼ before moving to ½ twists. Use a mat to build confidence.',
            'PROGRESSION TIPS FOR LINKED ROTATIONS: Where possible, use hands and knees to link rotations. Use a push-in mat to catch the second move.',
            'All positions should be safely performed at their basic level before pressing forward to linked moves.',
          ],
        },
      ],
      quiz: [
        {
          question: 'In the front landing position, where are the hands placed?',
          options: [
            'Stretched above the head',
            'Under the chest with fingers forward',
            'Flat by the sides of the body',
            'Gripping the edge of the trampoline bed',
          ],
          answer: 1,
        },
        {
          question: 'What is the critical coaching point for front landing (forward motion moves)?',
          options: [
            'Centre of mass pushed forward',
            'Centre of mass pushed back',
            'Keep the chin tucked',
            'Arms must stay extended',
          ],
          answer: 1,
        },
        {
          question: 'What is the recommended first step when introducing back landing?',
          options: [
            'Jump straight into a back landing on the bed',
            'Practise the flatback position on a safety mat first',
            'Link it directly to a seat landing',
            'Introduce it alongside front somersault',
          ],
          answer: 1,
        },
        {
          question: 'What progression tool is recommended to catch the second move in linked rotations?',
          options: [
            'An overhead rig',
            'A judo belt',
            'A push-in mat',
            'A coaching block',
          ],
          answer: 2,
        },
      ],
    },
    {
      id: 'module-5',
      title: 'Lesson Planning & Class Management',
      duration: '20 min',
      sections: [
        {
          title: 'Class Structure',
          content: [
            'Arrive and begin setting up trampolines at least 10 minutes before the lesson start time. For two trampolines, allow a full 10-minute setup period.',
            'Structure every session as follows: Warm-up on trampolines (3 minutes each) → Floor stations if required → Skills practice — trampolining (3–4 minutes each, 2 rotations) → Cool-down (5 minutes before the end) → Take down of trampolines (10 minutes).',
            'Always plan a cool-down into your lesson. Never finish on high-intensity jumping.',
            'Allow 10 minutes for taking down and storing equipment safely at the end.',
          ],
        },
        {
          title: 'Planning Your Session',
          content: [
            'Identify the ability level of your class before planning: Beginner, Intermediate or Advanced. Do not mix significantly different levels on the same trampoline without clear differentiation.',
            'Choose skills that are appropriate to the level: Beginners — shape jumps, basic body landings, controlled stops. Intermediate — linked moves, body landing combinations. Advanced — somersaults, advanced routine work.',
            'Have a clear learning objective for the session — what skill or concept do you want pupils to leave with?',
            'Plan for progressions within the lesson: start from a skill pupils already know well, then build toward the target skill.',
          ],
        },
        {
          title: 'Managing Multiple Trampolines',
          content: [
            'When using more than one trampoline simultaneously, position yourself so you can observe all trampolines.',
            'Rotate pupils systematically — use a clear signal (whistle or clap) so all pupils know to stop and swap.',
            'Ensure spotters are briefed and in position before each pupil begins bouncing.',
            'Floor stations (conditioning exercises, flexibility, shape practice off the trampoline) are useful when trampoline time is limited and pupil numbers are high.',
          ],
        },
        {
          title: 'Differentiation in Class',
          content: [
            'Pupils progress at different rates — always have a next challenge ready for those who progress quickly.',
            'For pupils who are not yet ready to progress: allow additional practice time on their current skill level, focus on quality of technique rather than moving on.',
            "Be aware of pupils with additional needs — refer to UKAG SEND guidance and your school's inclusion policy.",
            'Never pressure a pupil to attempt a skill they are not confident or ready for.',
          ],
        },
      ],
      quiz: [
        {
          question: 'How long before the lesson should setup begin for two trampolines?',
          options: [
            '5 minutes',
            '10 minutes',
            '15 minutes',
            '20 minutes',
          ],
          answer: 1,
        },
        {
          question: 'How long should skills practice rotations last?',
          options: [
            '1–2 minutes per turn',
            '3–4 minutes per turn',
            '5–6 minutes per turn',
            '10 minutes per turn',
          ],
          answer: 1,
        },
        {
          question: 'What is a key tool for managing rotations when multiple trampolines are in use?',
          options: [
            'A countdown timer on the board',
            'A clear signal such as a whistle or clap',
            'Pupils self-managing their own rotations',
            'The teacher physically tapping each pupil',
          ],
          answer: 1,
        },
        {
          question: 'What is the purpose of floor stations in a trampolining lesson?',
          options: [
            'Punishment for poor behaviour',
            'Useful when trampoline time is limited and pupil numbers are high',
            'Replacement for the cool-down',
            'Preparation for competitive routines only',
          ],
          answer: 1,
        },
      ],
    },
    {
      id: 'module-6',
      title: 'Intermediate Skills & Linked Moves',
      duration: '25 min',
      sections: [
        {
          title: 'Intermediate Level Overview',
          content: [
            'Intermediate skills build directly on the beginner foundations. All beginner body landing positions must be fully secure before progressing to intermediate linked moves.',
            'Intermediate work focuses on linking body landings with twists and rotations with increased control and height.',
            'Key intermediate skills are: more complex linked twists and rotations; combined body landing sequences; and introduction of the Forward Turnover and Back Landing Back Pullover.',
          ],
        },
        {
          title: 'Intermediate Linked Twists & Rotations',
          content: [
            'Seat landing ½ twist to back landing to feet',
            'Back landing ½ twist to seat landing to feet',
            'Back landing to front landing to feet',
            'Front landing to back landing to feet',
            'Seat, front & back landing full twist to feet',
            'Full twist to seat, front & back landing to feet',
            'Seat landing full twist to seat landing (Roller)',
            'Back landing ½ twist to back landing to feet (Cradle)',
            'Forward turnover (¾ front somersault)',
            'Back landing back pullover to feet',
          ],
        },
        {
          title: 'Teaching the Forward Turnover',
          content: [
            'The Forward Turnover (¾ front somersault) is a significant step in progression and must only be introduced when all front landing progressions are fully secure.',
            'Use a push-in mat when first introducing this skill. The coach should always be in a supporting position.',
            'Teach the dive onto the mat first, ensuring the pupil can control the landing, before progressing to the trampoline bed.',
            'Reinforce the coaching point: centre of mass is pushed back throughout forward motion.',
          ],
        },
        {
          title: 'Routine Examples — Intermediate Level',
          content: [
            'INTERMEDIATE 1 (10-contact): Full twist → Straddle jump → Swivel hips → Pike jump → Back landing ½ twist → Tuck jump → Forward turnover → Stretch jump → Stop.',
            'INTERMEDIATE 2 (10-contact): ½ twist jump → Straddle jump → Back landing to front landing to feet → Pike jump → Swivel hips ½ twist to feet → Tuck jump → Full twist → Stretch jump → Stop.',
            'Assessment principle: Students should perform core skills/techniques in increasingly demanding and progressive practices. Moves may start in isolation but students should aim to increase height and maintain consistency.',
          ],
        },
      ],
      quiz: [
        {
          question: 'What must be fully secure before a pupil attempts intermediate linked moves?',
          options: [
            'All advanced shape jumps',
            'All beginner body landing positions',
            'The 1.5 twist jump',
            'The forward somersault',
          ],
          answer: 1,
        },
        {
          question: 'What is the Roller in trampolining?',
          options: [
            'A back landing ½ twist to back landing to feet',
            'A seat landing full twist to seat landing',
            'A front landing full twist to back landing',
            'A back landing to front landing sequence',
          ],
          answer: 1,
        },
        {
          question: 'What is the Cradle in trampolining?',
          options: [
            'A seat landing full twist to seat landing',
            'A back landing ½ twist to back landing to feet',
            'A front landing ½ twist to seat landing',
            'A back pullover to feet',
          ],
          answer: 1,
        },
        {
          question: 'When introducing the Forward Turnover, what should you use first?',
          options: [
            'The overhead rig',
            'The competition trampoline',
            'A push-in mat',
            'No support — confidence is key',
          ],
          answer: 2,
        },
      ],
    },
    {
      id: 'module-7',
      title: 'Hand & Body Contact Support',
      duration: '20 min',
      sections: [
        {
          title: 'Principles of Safe Support',
          content: [
            'Trampolining is a hands-on sport. Without appropriate support it is difficult to coach many moves safely.',
            'It is advisable to minimise body contact as much as possible. If contact with the body is necessary, performers must first be told what to expect, and a full explanation should be given.',
            'Where possible, coaches should use alternate methods of holding a performer — the use of judo belts is advised as a first option.',
            'Always use a clenched fist rather than an open hand when hands are near the body (except when catching).',
            'If you are going to place a hand on the body, make sure it is placed away from areas of sensitivity. This applies to both male and female performers.',
            'DO NOT grasp the waistband of tracksuit bottoms or shorts. Use a belt if a secure grip is required.',
          ],
        },
        {
          title: 'Using a Judo Belt',
          content: [
            'A judo belt can be substituted for most (if not all) hand support, except where both hand and belt support is used simultaneously.',
            'The judo belt allows the coach to support the performer from a distance, reducing physical body contact while maintaining safety and control.',
            'Ensure the belt is properly fastened and the coach is positioned appropriately before the pupil begins.',
            'Brief the pupil fully on what the belt is for and how it will be used before beginning.',
          ],
        },
        {
          title: 'Support for Specific Skills',
          content: [
            'FRONT SOMERSAULT SUPPORT: Place hand on top of shoulder or behind the shoulder, not in front. If the performer dives into the somersault or has excessive travel, gripping the upper arm or front of the shoulder is acceptable — but only use this grip where there is a problem.',
            'BACK SOMERSAULT SUPPORT: Keep your free hand in the small of the back or just above the knee. Avoid pushing on the hips if at all possible.',
            "DOUBLE SUPPORT: If two coaches are supporting simultaneously, both coaches must be fully aware of each other's hand positions before the skill begins. Communication between coaches is essential.",
          ],
        },
        {
          title: 'Handling Incidents',
          content: [
            'If inappropriate contact is made during a catch (an inevitability at some point), the coach should apologise immediately.',
            'Do not let an incident of inappropriate contact go by with no response or a mumbled response. Make it clear that it was an accident, but point out that you avoided a potential injury.',
            'Document any incident and inform your school safeguarding lead if appropriate.',
            'Always work with transparency — if possible, have another adult present during trampolining sessions.',
          ],
        },
      ],
      quiz: [
        {
          question: 'What is the recommended first alternative to hand support in trampolining?',
          options: [
            'An overhead rig',
            'A judo belt',
            'A crash mat',
            'A second coach',
          ],
          answer: 1,
        },
        {
          question: 'Where should your hand be placed when supporting a front somersault?',
          options: [
            "On the performer's lower back",
            'On the front of the shoulder',
            'On top of or behind the shoulder',
            "On the performer's waist",
          ],
          answer: 2,
        },
        {
          question: 'What should a coach do if inappropriate contact is made accidentally during a catch?',
          options: [
            'Say nothing to avoid embarrassment',
            'Apologise immediately and make clear it was an accident',
            'Stop the session immediately',
            'Ask the pupil if they are unhappy',
          ],
          answer: 1,
        },
        {
          question: 'When should the coach explain the purpose of the judo belt to the pupil?',
          options: [
            'After the first attempt at the skill',
            'Only if asked',
            'Before beginning — always brief the pupil first',
            'It is not necessary to explain',
          ],
          answer: 2,
        },
      ],
    },
    {
      id: 'module-8',
      title: 'Advanced Skills & Routine Development',
      duration: '25 min',
      sections: [
        {
          title: 'Advanced Skills Overview',
          content: [
            'Advanced skills are introduced only once intermediate skills are fully established and consistent.',
            'Advanced work at UKAG Level 2 includes full somersaults (forward and backward) and advanced twist combinations.',
            'As a Level 2 qualified teacher, you are responsible for teaching and supporting intermediate and advanced skill levels, advanced and multiple-person support techniques, and routine development.',
            'Advanced skills carry significantly higher risk. Always ensure thorough progressions are in place and hand/belt support is used throughout the learning process.',
          ],
        },
        {
          title: 'Advanced Twists & Rotations',
          content: [
            'FRONT SOMERSAULT: Tucked and Piked variations. Always progress through the forward turnover (¾ front somersault) and ensure full consistency before attempting the completed somersault.',
            'BACK SOMERSAULT: Tuck, Piked and Straight variations. The tucked back somersault is the entry point. Progress to piked and straight only when the tuck is fully consistent and well supported.',
            'FRONT SOMERSAULT ½ TWIST (BARANI): A front somersault with a ½ twist. Requires a fully secure front somersault before introducing the twist element.',
            '¾ BACK SOMERSAULT (LAZY BACK): An advanced skill — back somersault landing on the back. Requires full back somersault competence.',
          ],
        },
        {
          title: 'Progressions for Somersaults',
          content: [
            'For all somersaults: begin with the skill in an overhead rig (where available), then progress to hand support, then to the trampoline bed with support, and finally to unsupported performance.',
            'Use a push-in mat extensively during early learning phases.',
            'Never progress to unsupported somersaults until the skill is fully consistent with support.',
            'Progressions for linked twists in advanced work: reduce any twisting moves to ¼ before moving to ½ twists. Use a mat to build confidence. Positions should be safely performed at their basic level before pressing forward.',
          ],
        },
        {
          title: 'Routine Development & Assessment',
          content: [
            'UKAG uses a 10-contact routine format for assessment. Students perform 10 consecutive moves without stopping.',
            'ADVANCED 1 (10-contact): Full twist → Straddle jump → Swivel hips ½ twist to feet → Pike jump → Back landing ½ twist → Tuck jump → Front somersault → Stretch jump → Stop.',
            'ADVANCED 2 (10-contact): Back somersault (straight) → Straddle jump → Swivel hips ½ twist to feet → Pike jump → Back landing ½ twist → Tuck jump → Barani → Stretch jump → Stop.',
            'ASSESSMENT PRINCIPLE: Students should perform core skills/techniques in increasingly demanding practices. The difficulty tariff of moves selected by the candidate should be considered when marking (AQA framework). Assessment must not be based on fully competitive competition standards.',
            'Coaches should be suitably qualified to supervise the difficulty level of moves chosen by candidates.',
          ],
        },
      ],
      quiz: [
        {
          question: 'What is the first variation of the front somersault to teach?',
          options: [
            'Piked front somersault',
            'Straight front somersault',
            'Tucked front somersault',
            'Barani',
          ],
          answer: 2,
        },
        {
          question: 'What is a Barani in trampolining?',
          options: [
            'A back somersault landing on the back',
            'A front somersault with a ½ twist',
            'A full twist jump',
            'A back somersault with a full twist',
          ],
          answer: 1,
        },
        {
          question: 'How many contacts make up a UKAG assessment routine?',
          options: [
            '8',
            '10',
            '12',
            '15',
          ],
          answer: 1,
        },
        {
          question: 'What is the progression pathway for teaching somersaults?',
          options: [
            'Straight to the trampoline bed with a spotter',
            'Overhead rig (if available) → hand support → trampoline with support → unsupported',
            'Push-in mat → overhead rig → unsupported',
            'Hand support → push-in mat → competition',
          ],
          answer: 1,
        },
      ],
    },
  ],
}
