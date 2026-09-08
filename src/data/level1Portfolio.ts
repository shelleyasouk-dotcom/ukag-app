export interface PortfolioItem {
  key: string
  label: string
}

export interface PortfolioSection {
  id: string
  title: string
  emoji: string
  items: PortfolioItem[]
}

export const PRACTICAL_SECTIONS: PortfolioSection[] = [
  {
    id: 'B1',
    title: 'Floor',
    emoji: '🤸',
    items: [
      { key: 'B1_body_shapes',  label: 'Coaches basic body shapes (star, straight, tuck, pike, straddle)' },
      { key: 'B1_rolls',        label: 'Coaches forward and backward rolls safely' },
      { key: 'B1_jumps',        label: 'Coaches jumps and basic landings' },
      { key: 'B1_balances',     label: 'Coaches static balances appropriate to Level 1–3' },
      { key: 'B1_cartwheel',    label: 'Supports supported cartwheel progressions' },
      { key: 'B1_backbend',     label: 'Supports supported back bend progressions' },
      { key: 'B1_spotting',     label: 'Applies correct spotting position for floor skills' },
    ],
  },
  {
    id: 'B2',
    title: 'Vault / Rebound',
    emoji: '🏃',
    items: [
      { key: 'B2_approach',   label: 'Coaches a safe, controlled approach' },
      { key: 'B2_takeoff',    label: 'Coaches correct take-off technique' },
      { key: 'B2_squat_on',   label: 'Coaches squat-on progressions' },
      { key: 'B2_straddle',   label: 'Coaches straddle-on progressions' },
      { key: 'B2_landings',   label: 'Coaches and reinforces safe landings' },
      { key: 'B2_equipment',  label: 'Manages equipment set-up and mat placement correctly' },
    ],
  },
  {
    id: 'B3',
    title: 'Beam',
    emoji: '⚖️',
    items: [
      { key: 'B3_balance',    label: 'Coaches static balance on beam' },
      { key: 'B3_travelling', label: 'Coaches basic travelling movements along beam' },
      { key: 'B3_routines',   label: 'Coaches simple beam routines appropriate to Level 1–3' },
      { key: 'B3_spotting',   label: 'Maintains close, correct spotting position throughout' },
      { key: 'B3_group',      label: 'Manages group control and turn-taking safely' },
    ],
  },
  {
    id: 'B4',
    title: 'Bars',
    emoji: '🎯',
    items: [
      { key: 'B4_grip',     label: 'Coaches correct grip technique' },
      { key: 'B4_hang',     label: 'Coaches safe hang positions' },
      { key: 'B4_support',  label: 'Coaches support positions' },
      { key: 'B4_strength', label: 'Coaches basic strength skills (e.g. up circle) appropriate to Level 1–3' },
      { key: 'B4_spotting', label: 'Applies correct spotting position for bar skills' },
    ],
  },
  {
    id: 'B5',
    title: 'Coaching Practice & Professionalism',
    emoji: '⭐',
    items: [
      { key: 'B5_prepared',    label: 'Arrives prepared, on time and appropriately dressed' },
      { key: 'B5_position',    label: 'Positions self correctly and maintains clear sightlines to all gymnasts' },
      { key: 'B5_behaviour',   label: 'Manages behaviour calmly and consistently' },
      { key: 'B5_comms',       label: 'Communicates clearly using positive, age-appropriate language' },
      { key: 'B5_lesson_plan', label: 'Follows approved lesson plans and stays within the Level 1 role' },
      { key: 'B5_equipment',   label: 'Supports safe equipment set-up and pack-down' },
      { key: 'B5_feedback',    label: 'Gives positive, constructive feedback to gymnasts' },
      { key: 'B5_reflects',    label: 'Reflects on sessions and communicates concerns to Lead Coach' },
      { key: 'B5_escalation',  label: 'Demonstrates understanding of when to ask for support / escalate' },
    ],
  },
]

export const ALL_COMPETENCY_KEYS = PRACTICAL_SECTIONS.flatMap(s => s.items.map(i => i.key))

export const WEEKLY_LOG_KEYS = ['C_week_1', 'C_week_2', 'C_week_3', 'C_week_4']

export const TOTAL_SIGNOFFS = ALL_COMPETENCY_KEYS.length + WEEKLY_LOG_KEYS.length // 32 + 4 = 36
