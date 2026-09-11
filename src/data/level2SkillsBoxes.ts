export interface SkillsBoxCriteria {
  skill: string
  levelTarget: string
  progressionNotes: string
}

export interface SkillsBox {
  id: string
  label: string
  apparatus: string
  emoji: string
  leaderships: string[]
  skills: SkillsBoxCriteria[]
}

export const SKILLS_BOXES: SkillsBox[] = [
  {
    id: 'box_a',
    label: 'Box A',
    apparatus: 'Floor (Level 4–5)',
    emoji: '🤸',
    leaderships: [
      'Deliver a full warm-up and cool-down independently',
      'Brief and manage at least one Level 1 assistant during the session',
      'Differentiate activities for mixed-ability gymnasts',
    ],
    skills: [
      {
        skill: 'Handstand',
        levelTarget: 'Level 4',
        progressionNotes: 'Wall handstand → kick up with support → unsupported 3-second hold; straight body line, pointed toes',
      },
      {
        skill: 'Cartwheel to handstand',
        levelTarget: 'Level 4–5',
        progressionNotes: 'Correct arm sequencing, straight arms throughout, controlled landing in handstand before stepping down',
      },
      {
        skill: 'Round-off',
        levelTarget: 'Level 5',
        progressionNotes: 'From run and hurdle step; emphasis on correct rebound and body tension at completion; both feet together landing',
      },
      {
        skill: 'Back walkover preparation',
        levelTarget: 'Level 5',
        progressionNotes: 'Bridge to standing required first; shoulder flexibility assessment; back bend from standing; spotter throughout',
      },
      {
        skill: 'Bridge to standing',
        levelTarget: 'Level 4',
        progressionNotes: 'From lying, push to bridge, push up to standing; correct weight shift, arms driving overhead',
      },
    ],
  },
  {
    id: 'box_b',
    label: 'Box B',
    apparatus: 'Beam & Bars (Level 4–5)',
    emoji: '⚖️',
    leaderships: [
      'Plan and present a complete session plan to your assessor before the session',
      'Demonstrate correct spotting at beam and bars for at least two different skills',
      'Give structured post-session feedback to your Level 1 assistant',
    ],
    skills: [
      {
        skill: 'Pivot turn on beam',
        levelTarget: 'Level 4',
        progressionNotes: 'Relevé balance, 180° turn with controlled landing back to relevé or flat; arms in crown position throughout',
      },
      {
        skill: 'Arabesque balance',
        levelTarget: 'Level 4',
        progressionNotes: 'Standing leg straight, working leg raised to at least 45°, 3-second hold; arms extended for balance',
      },
      {
        skill: 'Hip circle on bars',
        levelTarget: 'Level 4',
        progressionNotes: 'Correct overgrip, body resting on bar at hips, circular motion; consistent body tension and finish position',
      },
      {
        skill: 'Back hip circle introduction',
        levelTarget: 'Level 5',
        progressionNotes: 'Correct grip, casting to horizontal, shoulder engagement; close bar contact throughout the rotation',
      },
      {
        skill: 'Beam cartwheel',
        levelTarget: 'Level 5',
        progressionNotes: 'Practise on low beam first; correct hand placement one at a time, legs passing through vertical; spotter on both sides',
      },
    ],
  },
  {
    id: 'box_c',
    label: 'Box C',
    apparatus: 'Vault & Rebound (Level 4–5)',
    emoji: '🏃',
    leaderships: [
      'Conduct the pre-session equipment safety check and explain each check to assessor',
      'Adapt a vault/rebound activity mid-session for a gymnast who is struggling',
      'Document the session and submit a written reflection within 48 hours',
    ],
    skills: [
      {
        skill: 'Squat-through vault',
        levelTarget: 'Level 4',
        progressionNotes: 'Approach, hurdle, two-foot takeoff from springboard, hands on vault, tuck-through landing; controlled block action',
      },
      {
        skill: 'Straddle vault',
        levelTarget: 'Level 4–5',
        progressionNotes: 'Two-foot takeoff, straddle over vault, controlled landing; progression from low table to competition height',
      },
      {
        skill: 'Handspring vault introduction',
        levelTarget: 'Level 5',
        progressionNotes: 'Blocking action from shoulders, rebound mat used initially; never without qualified spotter; flight phase develops over time',
      },
      {
        skill: 'Seat drop to back drop',
        levelTarget: 'Level 4',
        progressionNotes: 'From seat drop, lean back to controlled back drop; arms drive forward for return; correct body position throughout',
      },
      {
        skill: 'Back drop to feet',
        levelTarget: 'Level 5',
        progressionNotes: 'From back drop, pike and drive up through arms to standing; timing of arm drive is the key coaching point',
      },
    ],
  },
  {
    id: 'box_d',
    label: 'Box D',
    apparatus: 'Multi-Apparatus (Level 5–6)',
    emoji: '🌟',
    leaderships: [
      'Lead a full 30-minute session incorporating three apparatus',
      'Manage a Level 1 assistant at one apparatus independently while you coach another',
      'Complete a post-session verbal debrief with your assessor including self-reflection',
    ],
    skills: [
      {
        skill: 'Round-off rebound',
        levelTarget: 'Level 5',
        progressionNotes: 'Round-off into immediate rebound; gymnast must have consistent round-off before adding rebound; tension throughout',
      },
      {
        skill: 'Back handspring introduction',
        levelTarget: 'Level 6',
        progressionNotes: 'Spotter required at all times; progressions: standing back bend drill, board-assisted, spotter-assisted on floor; never unsupported until fully consistent with spotter',
      },
      {
        skill: 'Clear hip on bars',
        levelTarget: 'Level 5–6',
        progressionNotes: 'From support position, cast to horizontal, wrap to clear hip circle; correct shoulder engagement and bar contact pattern',
      },
      {
        skill: 'Beam back walkover',
        levelTarget: 'Level 6',
        progressionNotes: 'Requires consistent back walkover on floor first; low beam with spotter; hand placement on beam, weight shift, leg kick-over; never without spotter',
      },
      {
        skill: 'Handspring vault',
        levelTarget: 'Level 6',
        progressionNotes: 'Consistent blocking action from arms; correct approach speed; post-flight body tension; qualified spotter required; competition-height vault only when consistent on rebound mat',
      },
    ],
  },
]
