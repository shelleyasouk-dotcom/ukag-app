export interface MaintenanceModule {
  id: string
  title: string
  duration: string
  sections: {
    heading: string
    content: string
    bullets?: string[]
    warning?: string
    tip?: string
  }[]
  quiz: {
    question: string
    options: string[]
    correct: number
    explanation: string
  }[]
}

export const MAINTENANCE_COURSE_ID = 'maintenance_technician_v1'

export const MAINTENANCE_MODULES: MaintenanceModule[] = [
  {
    id: 'mod1',
    title: 'Introduction & Scope',
    duration: '20 min',
    sections: [
      {
        heading: 'Purpose of This Course',
        content: 'This course sets out the Standard Operating Procedures (SOPs) for all inspection, maintenance, and servicing work carried out under the UKAG Maintenance & Servicing arm. It applies to all equipment found in school sports halls, gymnastics studios, and trampoline facilities.',
        bullets: [
          'To provide clear, consistent, and safe working procedures for all UKAG servicing technicians',
          'To form the basis of the UKAG Equipment Servicing Technician training qualification',
        ],
      },
      {
        heading: 'Equipment Categories Covered',
        content: 'UKAG Maintenance & Servicing technicians are qualified to inspect, maintain, and service the following categories of school-based gymnastics and trampoline equipment:',
        bullets: [
          'School trampolines (folding, wheeled — e.g. Nissen 77A)',
          'Gymnastics frames, A-frames, and wall bars',
          'Vaulting tables and stackable vaults',
          'Springboards and beatboards',
          'Floor mats and crash mats',
          'Gymnastics benches and PE storage furniture',
        ],
      },
      {
        heading: 'Types of Visit',
        content: 'UKAG technicians attend schools for three defined types of visit. The visit type determines the scope of work and the documentation required:',
        bullets: [
          'Type A — Visual inspection only. No maintenance or repair work carried out. A written report is still required.',
          'Type B — Visual inspection plus basic maintenance (spring replacement, lubrication, pad refitting, minor adjustments).',
          'Type C — Full servicing visit. Complete inspection, all maintenance tasks, dimensional checks, load testing, full condition report, and photographs.',
        ],
      },
      {
        heading: 'Qualifications & Authorisation',
        content: 'No technician may carry out servicing work under the UKAG Maintenance & Servicing brand unless they meet all of the following requirements:',
        bullets: [
          'Hold a current UKAG Equipment Servicing Technician certificate',
          'Have been formally authorised by the UKAG Director',
          'Hold a current enhanced DBS certificate',
          'Have completed UKAG safeguarding awareness training',
        ],
        warning: 'Junior technicians in training must be supervised at all times by a qualified technician. Unsupervised work by unqualified technicians is not permitted under any circumstances.',
      },
    ],
    quiz: [
      {
        question: 'Which type of visit includes a full load test and dimensional checks?',
        options: ['Type A', 'Type B', 'Type C', 'All visit types'],
        correct: 2,
        explanation: 'Type C is the full servicing visit. It includes everything in Type B plus dimensional checks, load testing, full condition reports, and photographs.',
      },
      {
        question: 'What must a junior technician always have when attending a school visit?',
        options: ['A UKAG polo shirt', 'Supervision from a qualified technician', 'A copy of the SOP document', 'Written permission from the school'],
        correct: 1,
        explanation: 'Junior technicians in training must be supervised at all times by a qualified technician. This is a non-negotiable safety and safeguarding requirement.',
      },
      {
        question: 'Which of the following is NOT a requirement to carry out work under the UKAG brand?',
        options: ['Current UKAG Technician certificate', 'Enhanced DBS certificate', 'Level 2 gymnastics coaching award', 'UKAG safeguarding awareness'],
        correct: 2,
        explanation: 'A gymnastics coaching award is not required for maintenance technicians. The requirements are: UKAG Technician certificate, DBS, formal UKAG Director authorisation, and safeguarding awareness.',
      },
    ],
  },
  {
    id: 'mod2',
    title: 'Pre-Visit Safety & PPE',
    duration: '25 min',
    sections: [
      {
        heading: 'Pre-Visit Checklist',
        content: 'Before attending any school visit, the technician must confirm all of the following have been arranged and are in place:',
        bullets: [
          'School visit is booked and confirmed with the school contact',
          'Visit type (A, B, or C) has been agreed in advance',
          'UKAG ID badge is current and will be carried',
          'Enhanced DBS certificate is current',
          'All tools and replacement parts required for the visit type are packed',
          'Blank UKAG Service Report forms (paper or digital) are available',
          'Vehicle is roadworthy and insured for business use',
          'Any lone working procedure required by UKAG is in place',
        ],
      },
      {
        heading: 'Arrival at School',
        content: 'School safeguarding procedures must be followed without exception on every visit. The following arrival procedure applies to all visit types:',
        bullets: [
          'Report to school reception — do not go directly to the sports hall',
          'Sign in as required by the school\'s visitor procedure',
          'Present your UKAG ID badge and confirm the name of the school contact',
          'Wait to be escorted to the sports hall or storage area — do not move independently around the school',
          'Confirm with the school contact whether any children will be present during the visit',
        ],
        warning: 'Never enter a school building without signing in and being issued a visitor badge. Never be alone with children at any point during the visit.',
      },
      {
        heading: 'Personal Protective Equipment (PPE)',
        content: 'The following PPE applies to all Type B and Type C visits. Technicians are responsible for supplying and maintaining their own PPE in serviceable condition:',
        bullets: [
          'Safety footwear (steel toecap) — required whenever heavy equipment is being moved',
          'Gloves — required when handling springs, sharp metal components, or cleaning chemicals',
          'Eye protection — required when using spray lubricants or cleaning agents',
          'Knee pads — recommended when working at ground level for extended periods',
        ],
        tip: 'Type A (inspection-only) visits do not require PPE as no physical work is carried out, but safety footwear is always recommended in a sports hall environment.',
      },
      {
        heading: 'Manual Handling',
        content: 'School gymnastics and trampoline equipment is heavy. All technicians must follow safe manual handling practices at all times. Injuries from poor manual handling are the most common risk in this role.',
        bullets: [
          'Never attempt to move trampolines, heavy vaulting tables, or folded gymnastics frames alone',
          'Always use a second person or appropriate mechanical aid for heavy items',
          'Assess the load before lifting — plan the route and clear the path first',
          'Bend at the knees, keep the load close to the body, do not twist while carrying',
          'Use folding wheels or sack trucks where available for large trampoline frames',
        ],
        warning: 'If a safe second person is not available and the equipment cannot safely be moved alone, do not move it. Document this on the service report and rearrange.',
      },
      {
        heading: 'Completing the Visit',
        content: 'The following steps must be completed before leaving the school on every visit:',
        bullets: [
          'Ensure all equipment is returned to its correct storage position',
          'Complete the UKAG Service Report before leaving the school',
          'Provide a copy of the report to the school contact on the day',
          'Sign out at reception',
          'Submit the digital report to UKAG within 24 hours of the visit',
          'Log any defective equipment with the UKAG Equipment Defect Register',
        ],
      },
    ],
    quiz: [
      {
        question: 'Where must you go first when you arrive at a school?',
        options: ['Directly to the sports hall', 'To the PE office', 'To reception', 'To the equipment storage area'],
        correct: 2,
        explanation: 'Always report to reception first, without exception. Sign in, present your ID badge, and wait to be escorted. Never move independently around a school.',
      },
      {
        question: 'When is eye protection required?',
        options: ['On all visits', 'When using spray lubricants or cleaning agents', 'Only on Type C visits', 'When working near children'],
        correct: 1,
        explanation: 'Eye protection is required specifically when using spray lubricants or cleaning agents, where there is a risk of splashing.',
      },
      {
        question: 'What should you do if no second person is available to help move a heavy trampoline?',
        options: ['Move it carefully alone using correct technique', 'Ask a member of school staff to help', 'Leave the equipment in place, document it, and rearrange', 'Use a trolley to move it alone'],
        correct: 2,
        explanation: 'If a safe second person is not available and the equipment cannot safely be moved alone, do not move it. Document this on the service report and rearrange the visit.',
      },
    ],
  },
  {
    id: 'mod3',
    title: 'School Trampolines — Inspection',
    duration: '30 min',
    sections: [
      {
        heading: 'Overview of School Trampolines',
        content: 'School trampolines are folding, wheeled trampolines designed for safe storage and deployment in school sports halls. The Nissen 77A is the most common model in UK schools. Understanding the key components is essential before beginning any inspection.',
        bullets: [
          'Folding frame — the main structural element; inspected for cracks, corrosion, and weld integrity',
          'Bed (woven or mesh) — the bouncing surface; inspected for wear, tears, and tension',
          'Springs — connect the bed to the frame; inspected for deformation, rust, and completeness',
          'Safety pads — cover the springs and frame edges; inspected for tears and security',
          'End decks — access platforms at each end; inspected for stability and surface condition',
          'Rollers — allow the trampoline to be moved; inspected for damage and free movement',
          'Locking mechanisms — secure the frame when deployed; inspected for function and security',
        ],
      },
      {
        heading: 'Visual Inspection: Frame',
        content: 'Begin every trampoline visit with a full visual inspection before touching or moving any equipment. Work systematically around the frame:',
        bullets: [
          'Check all welds for cracking, separation, or signs of repair',
          'Check all frame tubes for dents, bends, or corrosion — pay particular attention to the folding hinge areas',
          'Check all locking pins and mechanisms — confirm they engage fully and hold securely',
          'Check roller condition — tyres should be intact, axles free-moving',
          'Check end deck stability — no movement when pressure applied',
        ],
        warning: 'Any crack in a weld or frame tube requires immediate removal from use. This is not a maintenance item — it is a structural failure.',
      },
      {
        heading: 'Visual Inspection: Bed',
        content: 'The bed must be inspected across its full surface — do not assume uniform condition:',
        bullets: [
          'Check for tears, holes, or fraying at any point — pay particular attention to the attachment points where the bed hooks onto springs',
          'Check bed tension — the surface should feel consistent across the full area with no significant loose or tight zones',
          'Check woven beds for broken strands — more than 3 broken strands in any area is a removal criterion',
          'Check mesh beds for punctures or distortion',
        ],
      },
      {
        heading: 'Visual Inspection: Springs',
        content: 'A full spring count and condition check must be carried out. Work systematically around the bed:',
        bullets: [
          'Count all springs — compare against the manufacturer\'s specification for the model',
          'Any missing spring is a removal from use criterion until replaced',
          'Check each spring for rust — light surface rust is acceptable; deep pitting is not',
          'Check each spring hook — both frame hook and bed hook must be fully engaged and undamaged',
          'Check for deformed or stretched springs — these should be replaced at the next Type B visit minimum',
        ],
        warning: 'A trampoline with a missing spring must be immediately removed from use and tagged. It cannot be used until the spring is replaced by a qualified technician.',
      },
      {
        heading: 'Visual Inspection: Pads & End Decks',
        content: 'Safety pads and end decks are critical safety components:',
        bullets: [
          'Check all pad surfaces for tears, splits, or compression damage to the foam beneath',
          'Check all pad tie points — every tie must be secured; loose or missing ties are a defect',
          'Check pad overlap — no spring should be visible between pad sections',
          'Check end deck surfaces for cracks, loose fixings, or slippery surfaces',
          'Check end deck attachment to the frame — no movement should be present',
        ],
      },
    ],
    quiz: [
      {
        question: 'What should you do if you find a crack in a frame weld during inspection?',
        options: ['Note it on the report and continue the visit', 'Apply a repair and continue', 'Remove from use immediately and tag it', 'Monitor it and report at the next visit'],
        correct: 2,
        explanation: 'Any crack in a weld is a structural failure requiring immediate removal from use. It cannot be repaired on-site and must be tagged before you leave.',
      },
      {
        question: 'How many broken strands on a woven bed triggers removal from use?',
        options: ['1', '3', 'More than 3 in any area', '10'],
        correct: 2,
        explanation: 'More than 3 broken strands in any area of a woven bed is a removal from use criterion.',
      },
      {
        question: 'A trampoline has one missing spring. What action is required?',
        options: ['It can be used with the pad covering the gap', 'It must be removed from use until the spring is replaced', 'Note it on the report and replace at the next scheduled visit', 'It depends on which spring is missing'],
        correct: 1,
        explanation: 'A trampoline with a missing spring must be immediately removed from use and tagged. No discretion applies — it cannot be used until the spring is replaced by a qualified technician.',
      },
    ],
  },
  {
    id: 'mod4',
    title: 'School Trampolines — Maintenance & Servicing',
    duration: '35 min',
    sections: [
      {
        heading: 'Spring Replacement (Type B & C)',
        content: 'Spring replacement is the most common maintenance task on school trampolines. Following the correct procedure ensures safety and consistent bed tension:',
        bullets: [
          'Identify and record all springs requiring replacement before beginning — do not replace one at a time without a full assessment',
          'Use the correct spring hook tool — do not use improvised tools such as pliers or screwdrivers',
          'Replace like-for-like — confirm spring length, gauge, and hook type matches the existing springs exactly',
          'Seat each new spring fully — both the frame hook and the bed hook must be fully and correctly engaged',
          'After all replacements, check bed tension across the full surface — it should feel even throughout',
          'Record all springs replaced on the service report, including location by quadrant (front-left, front-right, back-left, back-right)',
        ],
        tip: 'If more than 10% of springs require replacement, consider recommending a full spring set replacement to the school rather than piecemeal replacements.',
      },
      {
        heading: 'Pad Replacement & Refitting (Type B & C)',
        content: 'Safety pads must be replaced or refitted methodically to ensure complete coverage:',
        bullets: [
          'Remove all pads from the section to be worked on before beginning',
          'Inspect the frame beneath the pad for any hidden damage not visible during the initial inspection',
          'Fit replacement pads ensuring all tie points are fully secured before moving to the next pad',
          'Check pad overlap where sections meet — no spring should be exposed between sections',
          'Check pad ends are tucked in where applicable — no gaps at corners',
        ],
        warning: 'Never leave a trampoline with pads partially fitted. Either complete the task fully or remove the trampoline from use until the job can be completed.',
      },
      {
        heading: 'Lubrication (Type B & C)',
        content: 'Lubrication should be applied to mechanical components as part of every Type B and C visit:',
        bullets: [
          'Apply light machine oil or manufacturer-recommended lubricant to all folding pivot points',
          'Apply lubricant to locking pin mechanisms if stiff or showing signs of corrosion',
          'Wipe away all excess lubricant after application',
          'Never apply lubricant to the bed surface, pad surfaces, or end deck surfaces — these must remain dry and grippy',
        ],
      },
      {
        heading: 'Type C Full Servicing — Additional Requirements',
        content: 'A Type C full service visit includes everything in Type B, plus the following:',
        bullets: [
          'Full spring count and individual condition record — replace any spring showing wear, deformation, or rust beyond surface level',
          'Frame dimensional check — measure bed dimensions in both axes (length and width). Significant deviation from the manufacturer\'s specification indicates frame distortion',
          'Full pad replacement where overall condition warrants it, rather than spot repairs',
          'Record the serial number, model, estimated age, and overall condition rating (Good / Fair / Poor / Remove from Use)',
          'Photograph all defects found — photographs must be included with the Type C service report',
        ],
      },
      {
        heading: 'Condition Ratings',
        content: 'Every piece of equipment must be given a condition rating at the end of the inspection. Use the following definitions consistently:',
        bullets: [
          'Good — Equipment is fully serviceable. No defects found or all defects resolved during this visit.',
          'Fair — Equipment is serviceable but has minor defects noted. A follow-up visit is recommended within 6 months.',
          'Poor — Equipment is serviceable with conditions. Named defects must be monitored closely; a follow-up visit within 3 months is required.',
          'Remove from Use — Equipment must not be used until the specified defect is resolved. Must be tagged before leaving.',
        ],
        warning: 'Condition ratings are formal records. Do not use "Poor" to avoid a difficult conversation about removing equipment from use. If it meets the Remove from Use criteria, it must be rated accordingly.',
      },
    ],
    quiz: [
      {
        question: 'When replacing springs, what must you confirm before fitting each new spring?',
        options: ['The spring is the cheapest available', 'The spring matches the existing springs in length, gauge, and hook type', 'The spring is new in packaging', 'The spring is made by the same manufacturer as the trampoline'],
        correct: 1,
        explanation: 'Springs must be replaced like-for-like. Confirm spring length, gauge, and hook type exactly matches the existing springs. Mismatched springs affect bed tension and safety.',
      },
      {
        question: 'Which condition rating means the equipment must not be used until a defect is resolved?',
        options: ['Poor', 'Fair', 'Remove from Use', 'Defective'],
        correct: 2,
        explanation: '"Remove from Use" means the equipment cannot be used until the specified defect is resolved. It must be physically tagged before the technician leaves.',
      },
      {
        question: 'What must you never apply lubricant to?',
        options: ['Locking pin mechanisms', 'Folding pivot points', 'The bed surface, pad surfaces, or end deck surfaces', 'Roller axles'],
        correct: 2,
        explanation: 'Never apply lubricant to the bed surface, pad surfaces, or end deck surfaces — these must remain dry and grippy for safety.',
      },
    ],
  },
  {
    id: 'mod5',
    title: 'Gymnastics Frames & Wall Bars',
    duration: '25 min',
    sections: [
      {
        heading: 'Visual Inspection: Freestanding Frames & A-Frames',
        content: 'Freestanding gymnastics frames must be inspected for structural integrity before any maintenance is carried out:',
        bullets: [
          'Check all uprights for bends, dents, or corrosion — pay particular attention to the base and any welded sections',
          'Check all cross-bracing and locking collars — collars must be fully tightened and not showing movement',
          'Check rubber feet — must be present on all legs, intact, and providing grip',
          'Check adjustment mechanisms — height adjustments must lock securely with no slippage under load',
          'Check bars and rungs for bending, corrosion, or sharp edges',
        ],
        warning: 'Any frame with a bent or cracked upright must be removed from use immediately. A gymnastics frame failure under load can cause serious injury.',
      },
      {
        heading: 'Visual Inspection: Wall-Mounted Frames & Wall Bars',
        content: 'Wall-mounted equipment requires additional attention to the fixing points — structural issues here cannot be resolved on-site:',
        bullets: [
          'Check all wall fixings — bolts should be tight and there should be no visible movement of the fixing plate',
          'Check the wall surface around fixings for cracking or damage',
          'Check all fold-down components for smooth operation and secure locking in the in-use position',
          'Check bar surfaces for splinters, sharp edges, or corrosion',
          'Apply downward pressure to bars during inspection — there should be no flex or movement in the wall fixings',
        ],
        tip: 'If wall fixings show any movement, advise the school in writing that a structural survey is required before the equipment is returned to use. This is beyond the scope of UKAG Maintenance & Servicing.',
      },
      {
        heading: 'Basic Maintenance: Type B Visits',
        content: 'The following maintenance tasks apply to gymnastics frames on Type B visits:',
        bullets: [
          'Tighten all accessible bolts, nuts, and locking collars using appropriate tools — do not overtighten',
          'Replace rubber feet / non-slip pads where worn, missing, or no longer providing grip',
          'Apply light lubrication to adjustment mechanisms and pivot points where specified by the manufacturer',
          'Remove any burrs or sharp edges from bar surfaces using a fine file and/or sandpaper — finish smooth',
          'Re-seat any loose bars or rungs — if movement cannot be resolved by tightening, record and escalate',
        ],
      },
      {
        heading: 'Full Servicing: Type C Visits',
        content: 'Type C visits require all Type B tasks plus the following:',
        bullets: [
          'Full load test — apply controlled downward pressure across the bar and frame; record any flex, movement, or noise',
          'Photograph frame condition including any corrosion, damage, or evidence of previous repair',
          'Record the serial number, manufacturer, model, estimated age, and condition rating',
          'Where wall fixings are suspect, advise the school in writing that a structural survey is required before the equipment is returned to use',
        ],
        warning: 'If a load test reveals significant flex or movement in a freestanding frame, remove it from use. If a wall-mounted frame shows movement at the fixings, remove from use and notify the school in writing.',
      },
    ],
    quiz: [
      {
        question: 'You find a gymnastics frame upright with a bend in it. What do you do?',
        options: ['Straighten the bend and continue', 'Note it on the report and monitor', 'Remove from use immediately', 'Reduce the load rating'],
        correct: 2,
        explanation: 'Any frame with a bent or cracked upright must be removed from use immediately. A gymnastics frame failure under load can cause serious injury.',
      },
      {
        question: 'Wall fixings are showing slight movement during your inspection. What is the correct action?',
        options: ['Tighten the bolts and continue', 'Advise the school in writing that a structural survey is required before use', 'Remove and refit the fixings', 'Apply sealant and continue'],
        correct: 1,
        explanation: 'Moving wall fixings are beyond the scope of UKAG Maintenance & Servicing. The school must be advised in writing that a structural survey is required before the equipment is returned to use.',
      },
    ],
  },
  {
    id: 'mod6',
    title: 'Vaulting Tables & Springboards',
    duration: '25 min',
    sections: [
      {
        heading: 'Vaulting Table: Visual Inspection',
        content: 'Vaulting tables consist of multiple stacking sections. The inspection must cover both the individual sections and the assembly:',
        bullets: [
          'Check all locking pins and section fixings — every pin must be present and fully engaged',
          'Check the top surface for tears, cracks, or significant compression (depressed areas)',
          'Check each section for deformation, cracks, or damage to the casing',
          'Check the base for stability — it should not rock or flex under pressure',
          'Check the area around where the springboard connects for wear or damage',
        ],
      },
      {
        heading: 'Vaulting Table: Maintenance',
        content: 'Vaulting table maintenance tasks on Type B visits:',
        bullets: [
          'Tighten all section locking pins and fixing mechanisms',
          'Clean surface with appropriate vinyl or leather cleaner — remove chalk, dirt, and moisture fully',
          'Apply vinyl conditioner to the top surface if cracking or dryness is evident',
          'Replace any missing locking pins with correct-specification replacements — do not use improvised substitutes',
        ],
        warning: 'Never use a vaulting table with a missing locking pin. The sections can shift under load causing the vault to collapse during use.',
      },
      {
        heading: 'Vaulting Table: Type C Full Servicing',
        content: 'Type C visits include all Type B tasks plus:',
        bullets: [
          'Load test — apply controlled downward pressure to the top surface; check for flex, movement, or noise between sections',
          'Assess the top surface for replacement if tears, cracks, or significant compression are present',
          'Record all section heights, overall condition, and manufacturer details',
          'Photograph any defects found',
        ],
      },
      {
        heading: 'Springboards & Beatboards',
        content: 'Springboards and beatboards are inspection and clean-down items — structural repair is not possible on-site:',
        bullets: [
          'Check the top surface for tears, splits, or excessive wear',
          'Check non-slip feet — replace if worn, compressed, or missing',
          'Check structural integrity — press along the length of the board; there should be no cracking sounds or flex beyond the normal spring',
          'Clean the top surface — remove chalk and dirt with appropriate cleaner',
          'Check beatboards for delamination — any separation of layers is a removal criterion',
        ],
        warning: 'Any springboard with a structurally compromised spring core, or beatboard with significant delamination, must be removed from use. These cannot be repaired on-site.',
      },
    ],
    quiz: [
      {
        question: 'A vaulting table has one missing locking pin. Can it be used?',
        options: ['Yes, if only one section is affected', 'Yes, if an alternative fixing holds the sections', 'No — it must be removed from use until replaced', 'Yes, for lower-level vaulting only'],
        correct: 2,
        explanation: 'A vaulting table with a missing locking pin must be removed from use. The sections can shift under load causing collapse during use.',
      },
      {
        question: 'A beatboard is showing delamination between layers. What action do you take?',
        options: ['Glue the layers and return to use', 'Remove from use — cannot be repaired on-site', 'Wrap with tape and return to use', 'Reduce the weight limit'],
        correct: 1,
        explanation: 'Significant delamination of a beatboard requires removal from use. These cannot be repaired on-site.',
      },
    ],
  },
  {
    id: 'mod7',
    title: 'Floor Mats & Crash Mats',
    duration: '20 min',
    sections: [
      {
        heading: 'Visual Inspection: Mat Covers & Surfaces',
        content: 'Mats are the most frequently used equipment in a school gymnasium and often show wear earlier than other items:',
        bullets: [
          'Check all cover surfaces for tears, splits, or exposed foam — any exposed foam is a removal criterion',
          'Check zip closures — zips must be fully closed during use; broken or missing zips must be repaired or the mat removed',
          'Check velcro connection strips where applicable — worn velcro must be replaced',
          'Check handles and carry straps for integrity',
          'Check for staining or contamination — heavily soiled mats should be cleaned or removed from use',
        ],
      },
      {
        heading: 'Visual Inspection: Foam Condition',
        content: 'The condition of the foam inside the mat cannot always be assessed visually, but the following signs indicate internal deterioration:',
        bullets: [
          'Significant compression or flat spots visible on the surface — press down; foam should return to shape',
          'Crunching or crackling sounds when the mat is walked on or compressed',
          'Noticeable unevenness across the mat surface',
          'Age — foam in school mats typically degrades significantly after 10+ years of regular use',
        ],
        tip: 'When in doubt about foam condition, note it on the report and recommend a replacement review. Compromised crash mat foam can fail to absorb the impact it is designed to protect against.',
      },
      {
        heading: 'Maintenance',
        content: 'Mat maintenance is primarily cleaning and minor repairs:',
        bullets: [
          'Clean mat covers using appropriate upholstery or vinyl cleaner — follow product instructions',
          'Allow mats to dry fully before stacking — never store damp mats; this causes mould and degradation of the foam',
          'Replace damaged zip pulls or velcro closures where possible',
          'Mats with compromised foam must be recorded and foam replacement recommended to the school in writing',
        ],
        warning: 'Mats with significantly compromised foam must be removed from use. A mat that looks serviceable externally but has collapsed foam offers no meaningful protection.',
      },
    ],
    quiz: [
      {
        question: 'A crash mat has a small tear exposing the foam beneath. What is the correct action?',
        options: ['Apply tape over the tear and continue', 'Remove from use — exposed foam is a removal criterion', 'Note it on the report for future reference', 'Reduce the height it can be used under'],
        correct: 1,
        explanation: 'Exposed foam is a removal from use criterion. A mat cover that has torn is no longer providing the protective cover surface the mat requires.',
      },
      {
        question: 'Why should mats never be stored damp?',
        options: ['It makes them slippery', 'It causes mould and degradation of the foam', 'It damages the floor beneath', 'It makes them harder to stack'],
        correct: 1,
        explanation: 'Damp storage causes mould growth and degrades the foam inside the mat, compromising its protective properties.',
      },
    ],
  },
  {
    id: 'mod8',
    title: 'Benches & PE Furniture',
    duration: '20 min',
    sections: [
      {
        heading: 'Visual Inspection: Gymnastics Benches',
        content: 'Gymnastics benches are simple but heavily used items. The key structural concerns are leg fixings and the condition of the top surface:',
        bullets: [
          'Check all four legs for stability — grip each leg and apply sideways pressure; there should be no movement',
          'Check all leg bolts and bracket fixings — tighten any that are loose',
          'Check rubber feet on all legs — must be present and providing grip on all surfaces',
          'Check the top surface for splinters, significant roughness, cracks, or warping',
          'Check the bench for overall straightness — significant warping can cause instability in use',
        ],
      },
      {
        heading: 'Visual Inspection: PE Storage Trolleys & Furniture',
        content: 'Storage trolleys and furniture require a functional and safety check:',
        bullets: [
          'Check all castors/wheels — must move freely and lock securely when the brake is applied',
          'Check structural integrity — no significant bending, cracking, or loose fixings',
          'Check any restraining straps or securing mechanisms for equipment during storage',
          'Check for sharp edges or protrusions that could cause injury',
        ],
      },
      {
        heading: 'Maintenance',
        content: 'Bench and furniture maintenance tasks:',
        bullets: [
          'Tighten all bench leg bolts and bracket fixings',
          'Replace rubber feet where worn, missing, or no longer providing grip',
          'Sand bench top surfaces where minor grain raising or roughness is present',
          'Apply appropriate wood treatment to sanded areas — use products suitable for sports equipment',
          'Benches with significant warping, cracking, or structural weakness should be removed from gymnastics use and replacement recommended in writing',
        ],
        warning: 'Benches with significant warping must be removed from gymnastics use. A warped bench is unstable — do not simply note it for future action.',
      },
    ],
    quiz: [
      {
        question: 'You find a gymnastics bench with a leg bolt that is loose but still in place. What do you do?',
        options: ['Remove the bench from use', 'Tighten it and record on the service report', 'Note it for the next visit', 'Replace the whole bench'],
        correct: 1,
        explanation: 'A loose leg bolt should be tightened during the visit as part of standard Type B maintenance. Record that the tightening was carried out on the service report.',
      },
    ],
  },
  {
    id: 'mod9',
    title: 'Reporting & Documentation',
    duration: '35 min',
    sections: [
      {
        heading: 'The UKAG Service Report',
        content: 'A UKAG Service Report must be completed for every visit — regardless of visit type. The report is the formal legal record of the visit. It must be accurate, complete, and signed before leaving the school.',
        bullets: [
          'School name, address, and contact name',
          'Date and time of visit',
          'Visit type (Type A / B / C)',
          'Technician name and UKAG technician number',
          'List of all equipment inspected',
          'Condition rating for each item (Good / Fair / Poor / Remove from Use)',
          'Details of all work carried out — parts replaced, adjustments made, cleaning completed',
          'Details of any equipment removed from use, with reason',
          'Photographs of any defects recorded (required for Type B and C visits)',
          'Recommendations for future action',
          'Technician signature and date',
          'School contact signature confirming receipt of report',
        ],
        warning: 'A visit without a completed and signed Service Report has not been completed. Do not leave a school without a signed report.',
      },
      {
        heading: 'Defect Tagging',
        content: 'Any equipment rated "Poor" or "Remove from Use" must be physically tagged before the technician leaves the school. Tags must be clearly visible and state:',
        bullets: [
          '"NOT FOR USE — UKAG Maintenance & Servicing"',
          'Date of inspection',
          'Technician name and UKAG technician number',
          'Reason (brief — e.g. "Missing springs" / "Frame instability" / "Damaged pads")',
          'UKAG contact number',
        ],
        warning: 'Never leave a school without tagging equipment rated Remove from Use. A verbal instruction to the school contact is not sufficient — the tag is the formal notice.',
      },
      {
        heading: 'UKAG Equipment Defect Register',
        content: 'All equipment rated "Poor" or "Remove from Use" must be entered into the UKAG Equipment Defect Register within 24 hours of the visit:',
        bullets: [
          'School name and address',
          'Equipment type, manufacturer, model, and serial number',
          'Condition rating and specific defect description',
          'Date of inspection',
          'Technician name',
          'Action required and recommended timeline',
          'Status — open / follow-up booked / resolved',
        ],
        tip: 'The Defect Register is reviewed quarterly by the UKAG Director. Accurate and timely entries are essential for monitoring equipment safety across all schools.',
      },
      {
        heading: 'Serious Defect Escalation',
        content: 'If a technician identifies a defect presenting an immediate and serious risk to safety — particularly structural failure of a frame, weld, or wall fixing — the following escalation procedure applies immediately:',
        bullets: [
          '1. Remove the equipment from use and tag immediately',
          '2. Inform the school contact in person before leaving',
          '3. Send written notification to the school by email within 2 hours',
          '4. Notify the UKAG Director by phone the same day',
          '5. Complete the serious defect section of the UKAG Service Report',
          '6. Log in the Defect Register marked as "Urgent"',
        ],
        warning: 'Serious defect escalation is not optional. If in doubt about whether a defect meets this threshold, escalate. It is always better to report and be wrong than to fail to report.',
      },
    ],
    quiz: [
      {
        question: 'When must the UKAG Service Report be completed?',
        options: ['Within 24 hours of the visit', 'Before leaving the school on the day', 'Within 48 hours of the visit', 'At the end of the working week'],
        correct: 1,
        explanation: 'The UKAG Service Report must be completed and signed before leaving the school. A visit without a completed and signed report has not been completed.',
      },
      {
        question: 'You find a frame with a cracked weld. After tagging and informing the school contact, what must you do?',
        options: ['Log it in the Defect Register within 1 week', 'Send written notification to the school within 2 hours and call the UKAG Director the same day', 'Submit the service report within 48 hours', 'Arrange a return visit within 7 days'],
        correct: 1,
        explanation: 'A serious structural defect triggers the escalation procedure: remove, tag, inform school contact in person, send written notification within 2 hours, and call the UKAG Director the same day.',
      },
      {
        question: 'What must a defect tag always include?',
        options: ['The cost of repair', 'Technician name, date, reason, and UKAG contact number', 'The school\'s insurance details', 'The replacement part number'],
        correct: 1,
        explanation: 'Defect tags must state "NOT FOR USE", the date, the technician name and number, the reason, and UKAG contact details.',
      },
    ],
  },
  {
    id: 'mod10',
    title: 'Quick Reference: Remove from Use Criteria',
    duration: '15 min',
    sections: [
      {
        heading: 'Mandatory Remove from Use — No Discretion',
        content: 'The following conditions require immediate removal from use regardless of visit type. These are not judgment calls — if any of the following are found, the equipment must be removed from use and tagged before the technician leaves.',
        warning: 'These criteria are absolute. There are no exceptions and no discretion. If unsure whether a condition meets the threshold, remove from use.',
        bullets: [
          'TRAMPOLINES: Any missing spring',
          'TRAMPOLINES: Any cracked or broken weld on the frame',
          'TRAMPOLINES: More than 3 broken strands on a woven bed in any area',
          'TRAMPOLINES: Any hole or tear in the bed reaching a spring attachment point',
          'TRAMPOLINES: Missing or unfastened safety pads leaving springs exposed',
          'GYMNASTICS FRAMES: Any cracked, bent, or broken upright or cross-member',
          'GYMNASTICS FRAMES: Wall fixings showing movement',
          'GYMNASTICS FRAMES: Missing or non-functioning locking collar',
          'VAULTING TABLES: Any missing locking pin',
          'VAULTING TABLES: Top surface with tears reaching the foam beneath',
          'SPRINGBOARDS/BEATBOARDS: Delamination or structurally compromised spring core',
          'CRASH MATS: Torn cover with exposed foam',
          'CRASH MATS: Foam with significant compression loss (fails to return to shape)',
          'GYMNASTICS BENCHES: Significant warping or structural cracking',
          'ALL EQUIPMENT: Any item where a reasonable person would consider it unsafe to use',
        ],
      },
      {
        heading: 'After This Course',
        content: 'On completing all modules of this course you will be assessed and, on passing, issued with your UKAG Equipment Servicing Technician certificate. This course must be renewed every 3 years.',
        bullets: [
          'Always follow the SOPs — do not take shortcuts',
          'When in doubt, remove from use — err on the side of safety',
          'Complete every service report fully and accurately',
          'Escalate serious defects immediately',
          'Your signature on a service report is a professional and legal statement',
        ],
        tip: 'Keep a copy of these Remove from Use criteria accessible during every visit. A quick reference card is available from UKAG.',
      },
    ],
    quiz: [
      {
        question: 'A trampoline has pads missing over two spring sections. What do you do?',
        options: ['Continue — pads are not structural', 'Note it on the report and advise replacement', 'Remove from use immediately', 'Secure the area with cones and continue the visit'],
        correct: 2,
        explanation: 'Missing or unfastened safety pads leaving springs exposed is a mandatory Remove from Use criterion. No discretion applies.',
      },
      {
        question: 'How long before this qualification must be renewed?',
        options: ['1 year', '2 years', '3 years', '5 years'],
        correct: 2,
        explanation: 'The UKAG Equipment Servicing Technician certificate must be renewed every 3 years.',
      },
      {
        question: 'You find a piece of equipment in a condition not specifically listed in the Remove from Use criteria, but you believe it is unsafe. What should you do?',
        options: ['Leave it in use as it is not on the criteria list', 'Remove from use — the final criterion is "any item a reasonable person would consider unsafe"', 'Take photographs and submit to UKAG for a decision', 'Reduce the equipment to light use only'],
        correct: 1,
        explanation: 'The final Remove from Use criterion is "any item where a reasonable person would consider it unsafe to use". If in doubt, remove from use.',
      },
    ],
  },
]
