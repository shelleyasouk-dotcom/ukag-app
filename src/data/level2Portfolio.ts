export interface Level2PortfolioItem {
  key: string
  label: string
}

export interface Level2PortfolioSection {
  id: string
  title: string
  emoji: string
  items: Level2PortfolioItem[]
}

export const LEVEL2_SECTIONS: Level2PortfolioSection[] = [
  {
    id: 'A',
    title: 'Leadership & Mentoring',
    emoji: '👥',
    items: [
      { key: 'A_plans_sessions',    label: 'Plans and delivers complete sessions independently' },
      { key: 'A_adapts_difficulty', label: 'Adapts difficulty within session based on gymnast performance' },
      { key: 'A_wellbeing',         label: 'Monitors gymnast wellbeing and adjusts session accordingly' },
      { key: 'A_safety_aware',      label: 'Demonstrates proactive safety awareness throughout' },
      { key: 'A_leads_assistants',  label: 'Effectively leads Level 1 assistants during session' },
      { key: 'A_mentors_l1',        label: 'Provides structured feedback to Level 1 assistants post-session' },
    ],
  },
  {
    id: 'B',
    title: 'Administration & H&S',
    emoji: '📁',
    items: [
      { key: 'B_register',           label: 'Completes register accurately and addresses absences' },
      { key: 'B_registration_forms', label: 'Verifies registration forms are complete and current' },
      { key: 'B_contact_details',    label: 'Confirms emergency contact details available for all participants' },
      { key: 'B_send_notification',  label: 'Acts on any SEND notifications before session starts' },
      { key: 'B_ready_to_learn',     label: 'Assesses participants\' readiness and adjusts if needed' },
      { key: 'B_equipment_check',    label: 'Completes pre-session equipment safety inspection' },
      { key: 'B_class_overview',     label: 'Manages class structure and group work effectively' },
      { key: 'B_group_allocation',   label: 'Allocates groups appropriately by ability and needs' },
      { key: 'B_safeguarding',       label: 'Demonstrates correct safeguarding procedures' },
      { key: 'B_first_aid',          label: 'Demonstrates knowledge of first aid procedures and kit location' },
      { key: 'B_area_head_comms',    label: 'Maintains appropriate communication with Area Head' },
    ],
  },
  {
    id: 'C',
    title: 'Advanced Skills L4+',
    emoji: '⭐',
    items: [
      { key: 'C_floor_l4',          label: 'Coaches Level 4 floor skills (handstand, cartwheel progressions)' },
      { key: 'C_floor_l56',         label: 'Coaches Level 5–6 floor skills (walkovers, round-offs, handspring progressions)' },
      { key: 'C_beam_l4',           label: 'Coaches Level 4 beam skills (pivot turns, arabesque, basic jumps)' },
      { key: 'C_beam_l56',          label: 'Coaches Level 5–6 beam skills (cartwheels, back walkovers, leaps)' },
      { key: 'C_bars_l4',           label: 'Coaches Level 4 bars skills (hip circle, forward roll on bars)' },
      { key: 'C_bars_l56',          label: 'Coaches Level 5–6 bars skills (back hip circle, clear hip progressions)' },
      { key: 'C_vault_l4',          label: 'Coaches Level 4 vault/rebound (squat through, handspring progressions)' },
      { key: 'C_vault_l56',         label: 'Coaches Level 5–6 vault skills (handspring, front somersault on trampet)' },
      { key: 'C_mentor_coaches',    label: 'Coaches and supervises Level 1 assistants delivering apparatus stations' },
      { key: 'C_adapts_progressions', label: 'Adapts skill progressions dynamically based on individual gymnast needs' },
    ],
  },
]

export const ALL_L2_COMPETENCY_KEYS = LEVEL2_SECTIONS.flatMap(s => s.items.map(i => i.key))
export const L2_WEEKLY_LOG_KEYS = ['L2_week_1', 'L2_week_2', 'L2_week_3', 'L2_week_4', 'L2_week_5', 'L2_week_6']
export const L2_TOTAL_SIGNOFFS = ALL_L2_COMPETENCY_KEYS.length + L2_WEEKLY_LOG_KEYS.length
