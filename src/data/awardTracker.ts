export type Apparatus = 'beam' | 'bars' | 'floor' | 'rebound'

export interface TrackerSkill {
  key: string
  label: string
}

export interface ApparatusSkills {
  apparatus: Apparatus
  label: string
  emoji: string
  skills: TrackerSkill[]
}

export interface TrackerLevel {
  level: number
  title: string
  subtitle: string
  colour: string
  quote: string
  apparatus: ApparatusSkills[]
  floorRoutine: string[]
}

export const TRACKER_LEVELS: TrackerLevel[] = [
  {
    level: 1,
    title: 'Foundation',
    subtitle: 'Level 1',
    colour: '#ef462c',
    quote: '"Jump off the beam, flip off the bars, follow your dreams and reach for the stars." — Nadia Comaneci',
    apparatus: [
      {
        apparatus: 'beam',
        label: 'Beam',
        emoji: '⚖️',
        skills: [
          { key: 'L1_beam_straddle_mount', label: 'Straddle mount (supported)' },
          { key: 'L1_beam_tiptoes', label: 'Tiptoes (supported)' },
          { key: 'L1_beam_diddy_walk', label: 'Diddy Walk' },
          { key: 'L1_beam_leg_lifts', label: 'Leg Lifts (supported)' },
          { key: 'L1_beam_straight_jump_dismount', label: 'Straight Jump Dismount' },
          { key: 'L1_beam_block', label: 'Block (hold 3 secs)' },
          { key: 'L1_beam_present', label: 'Present' },
        ],
      },
      {
        apparatus: 'bars',
        label: 'Bars',
        emoji: '🎯',
        skills: [
          { key: 'L1_bars_hold_shapes', label: 'Hold Tuck, Straddle & Pike — 3 secs each (LB or HB)' },
          { key: 'L1_bars_hang_upside', label: 'LB — Hang upside down, progress to up-circle (S)' },
          { key: 'L1_bars_forward_circle', label: 'LB — Forward circle (S)' },
          { key: 'L1_bars_dish_arch', label: 'HB — Dish/Arch 5 swings' },
          { key: 'L1_bars_dismount', label: 'Dismount, Block and Present' },
        ],
      },
      {
        apparatus: 'floor',
        label: 'Floor',
        emoji: '🤸',
        skills: [
          { key: 'L1_floor_dish_arch', label: 'Dish & Arch hold 3 seconds' },
          { key: 'L1_floor_support', label: 'Front & Back Support 3 secs' },
          { key: 'L1_floor_arabesque', label: 'Arabesque angle' },
          { key: 'L1_floor_forward_roll', label: 'Forward roll (S)' },
          { key: 'L1_floor_bunny_hop', label: 'Bunny Hop forward and side' },
          { key: 'L1_floor_vsit', label: 'V-Sit (S)' },
          { key: 'L1_floor_chasse', label: 'Chassé' },
          { key: 'L1_floor_side_splits', label: 'Side Splits' },
          { key: 'L1_floor_front_splits', label: 'Front Splits' },
          { key: 'L1_floor_straight_jump', label: 'Straight Jump B&P' },
        ],
      },
      {
        apparatus: 'rebound',
        label: 'Rebound',
        emoji: '🏃',
        skills: [
          { key: 'L1_reb_hurdle', label: 'Run into Hurdle Step' },
          { key: 'L1_reb_springboard', label: 'Jump to Springboard' },
          { key: 'L1_reb_safe_landing', label: 'Safe Landing B&P' },
          { key: 'L1_reb_squat_feet', label: 'Standing Squat to feet (vault height 2)' },
          { key: 'L1_reb_straight_jump', label: 'Straight jump off B&P' },
          { key: 'L1_reb_straddle', label: 'Standing Straddle to feet (2)' },
          { key: 'L1_reb_star_jump', label: 'Star jump off B&P' },
        ],
      },
    ],
    floorRoutine: [
      'Present on beep',
      '2–3 Chassé steps forward',
      'Forward Roll',
      'Sit Tuck — 3 secs',
      'Sit Straddle — move around feet & Japana 3 secs',
      'Sit Pike 3 secs',
      'V-Sit 3 secs',
      'Dish–Arch 3 secs',
      'Front support–Back support 3 secs',
      'Run jump straight',
      'Bunny Hops',
      'Side Splits',
      'Skipping',
      'Arabesque 3 secs',
      'Present',
    ],
  },
  {
    level: 2,
    title: 'Developing',
    subtitle: 'Level 2',
    colour: '#1e52a4',
    quote: '"To be a gymnast, you must have the strength to hold on and the courage to let go." — Madison Kocian',
    apparatus: [
      {
        apparatus: 'beam',
        label: 'Beam',
        emoji: '⚖️',
        skills: [
          { key: 'L2_beam_mount', label: 'Straddle lever swing or V-Sit mount (S)' },
          { key: 'L2_beam_dips', label: 'Dips' },
          { key: 'L2_beam_pivot', label: '½ Pivot turn (S)' },
          { key: 'L2_beam_leg_lifts', label: 'Leg Lifts (S)' },
          { key: 'L2_beam_arabesque', label: 'Arabesque' },
          { key: 'L2_beam_star_jump', label: 'Star Jump dismount' },
          { key: 'L2_beam_block_present', label: 'Block (3 secs) and Present' },
        ],
      },
      {
        apparatus: 'bars',
        label: 'Bars',
        emoji: '🎯',
        skills: [
          { key: 'L2_bars_hold_shapes', label: 'HB — Tuck, Straddle & Pike Hold (5 secs)' },
          { key: 'L2_bars_front_support', label: 'LB — Jump to Front Support (bar to knee) ×3' },
          { key: 'L2_bars_dish_arch', label: 'HB — Dish/Arch 10 swings and static turns ×2' },
          { key: 'L2_bars_regrasping', label: 'Re-grasping (S optional)' },
          { key: 'L2_bars_dismount', label: 'Back release Dismount B&P' },
        ],
      },
      {
        apparatus: 'floor',
        label: 'Floor',
        emoji: '🤸',
        skills: [
          { key: 'L2_floor_dish_arch', label: 'Dish & Arch rocks and rolls' },
          { key: 'L2_floor_support', label: 'Side, Front & Back Support' },
          { key: 'L2_floor_splits', label: 'Splits — Side and Front' },
          { key: 'L2_floor_t_balance', label: 'T Balance' },
          { key: 'L2_floor_frog_balance', label: 'Frog Balance' },
          { key: 'L2_floor_forward_roll', label: 'Forward Roll' },
          { key: 'L2_floor_back_roll', label: 'Back Roll to straddle stand (S)' },
          { key: 'L2_floor_handstand', label: 'Handstand (S)' },
          { key: 'L2_floor_vsit', label: 'V-Sit (unsupported)' },
          { key: 'L2_floor_bridge', label: 'Bridge (S)' },
          { key: 'L2_floor_catleaps', label: 'Chassé Catleaps' },
          { key: 'L2_floor_tuck_jump', label: 'Tuck Jump B&P' },
        ],
      },
      {
        apparatus: 'rebound',
        label: 'Rebound',
        emoji: '🏃',
        skills: [
          { key: 'L2_reb_hurdle', label: 'Run into Hurdle Step on Springboard' },
          { key: 'L2_reb_squat', label: 'Squat to feet on low vault (2/3)' },
          { key: 'L2_reb_tuck_jump', label: 'Tuck jump off, Block & Present' },
          { key: 'L2_reb_straddle', label: 'Straddle to feet on low vault (2/3)' },
          { key: 'L2_reb_star_jump', label: 'Star jump off, Block and Present' },
        ],
      },
    ],
    floorRoutine: [
      'Present on beep',
      '2–3 Chassé steps and catleap',
      'Forward Roll',
      '½ Turn',
      'Backward Roll to straddle stand',
      'Side Splits',
      'Sit Straddle — move around feet & Japana 3 secs',
      'Sit Pike 3 secs',
      'Shoulderstand 3 secs',
      'Dish — 3 secs',
      'Lay flat to Bridge, roll to stand',
      'Frog Balance',
      'Leaps forward',
      'Handstand',
      'T Balance',
      'Present',
    ],
  },
  {
    level: 3,
    title: 'Progressing',
    subtitle: 'Level 3',
    colour: '#f4cc2c',
    quote: '"Part of being a good gymnast is being very disciplined." — Jonathan Horton',
    apparatus: [
      {
        apparatus: 'beam',
        label: 'Beam',
        emoji: '⚖️',
        skills: [
          { key: 'L3_beam_mount', label: 'V-Sit / kneeling leg lift / simple individual mount' },
          { key: 'L3_beam_leg_lifts', label: 'Dipped Leg Lifts' },
          { key: 'L3_beam_pivot', label: '½ Pivot turn on toe' },
          { key: 'L3_beam_straight_jump', label: 'Straight Jump (S)' },
          { key: 'L3_beam_y_balance', label: 'Y Balance (S)' },
          { key: 'L3_beam_coupe', label: 'Coupe Ankles' },
          { key: 'L3_beam_vsit_shoulder', label: 'V-Sit to shoulderstand, roll to stand' },
          { key: 'L3_beam_tuck_jump', label: 'Tuck Jump dismount' },
          { key: 'L3_beam_block_present', label: 'Block (3 secs) and Present' },
        ],
      },
      {
        apparatus: 'bars',
        label: 'Bars',
        emoji: '🎯',
        skills: [
          { key: 'L3_bars_hip_circle', label: 'LB — Up hip circle (S)' },
          { key: 'L3_bars_cast', label: 'LB — Cast ×3 to dismount jump to front support' },
          { key: 'L3_bars_forward_dismount', label: 'LB — Forward dismount (straight legs and arms)' },
          { key: 'L3_bars_swings', label: 'HB — 10 Swings with Re-grasping (unsupported)' },
          { key: 'L3_bars_half_turns', label: '2× Half Turns' },
          { key: 'L3_bars_dismount', label: 'Rear Dismount, Block and Finish' },
        ],
      },
      {
        apparatus: 'floor',
        label: 'Floor',
        emoji: '🤸',
        skills: [
          { key: 'L3_floor_dish_arch', label: 'Dish & Arch rolls and press' },
          { key: 'L3_floor_support', label: 'Side, Front & Back Support with press' },
          { key: 'L3_floor_splits', label: 'Splits' },
          { key: 'L3_floor_y_balance', label: 'Y Balance' },
          { key: 'L3_floor_dive_roll', label: 'Dive Forward Roll' },
          { key: 'L3_floor_back_roll', label: 'Back Roll' },
          { key: 'L3_floor_headstand', label: 'Headstand' },
          { key: 'L3_floor_handstand', label: 'Handstand' },
          { key: 'L3_floor_cartwheel', label: 'Cartwheel (S)' },
          { key: 'L3_floor_shoulderstand', label: 'Shoulderstand (S)' },
          { key: 'L3_floor_back_bend', label: 'Back Bend into Bridge' },
          { key: 'L3_floor_catleaps', label: 'Chassé Catleaps, high hops' },
          { key: 'L3_floor_straddle_jump', label: 'Straddle Jump B&P' },
        ],
      },
      {
        apparatus: 'rebound',
        label: 'Rebound',
        emoji: '🏃',
        skills: [
          { key: 'L3_reb_squat_on', label: 'Squat on or over (vault 3/4), Tuck jump off' },
          { key: 'L3_reb_squat_block', label: 'Block (3 secs) and Present' },
          { key: 'L3_reb_straddle_on', label: 'Straddle on or over (3/4), Straddle jump off' },
          { key: 'L3_reb_straddle_block', label: 'Block (3 secs) and Present (2)' },
        ],
      },
    ],
    floorRoutine: [
      'Present on beep',
      '2–3 Chassé steps, catleap high hop',
      'Dive Forward Roll',
      'Chassé ½ turn high hop',
      'Backward Roll',
      'Front Splits',
      'Sit Pike with toe touches, roll to stand',
      'Cartwheel',
      'Chassé Catleap high hop',
      'Back Bend to Bridge',
      'Dish to Arch',
      'Headstand',
      'Y Balance',
      'Handstand',
      'Run to Straddle Jump',
      'Present',
    ],
  },
  {
    level: 4,
    title: 'Advancing',
    subtitle: 'Level 4',
    colour: '#0d9488',
    quote: '"You just have to be yourself and go full with confidence and be courageous." — Gabby Douglas',
    apparatus: [
      {
        apparatus: 'beam',
        label: 'Beam',
        emoji: '⚖️',
        skills: [
          { key: 'L4_beam_mount', label: 'Individual mount (simple)' },
          { key: 'L4_beam_leg_lifts', label: 'Dipped Leg Lifts on tiptoes' },
          { key: 'L4_beam_pivot', label: 'Squat Pivot Turn' },
          { key: 'L4_beam_forward_roll', label: 'Forward Roll' },
          { key: 'L4_beam_coupe', label: 'Coupe Knees ½ pivot 1 foot' },
          { key: 'L4_beam_y_balance', label: 'Y Balance (unsupported)' },
          { key: 'L4_beam_tuck_jump', label: 'Tuck Jump (S)' },
          { key: 'L4_beam_cat_leap', label: 'Cat Leap' },
          { key: 'L4_beam_dismount', label: 'Handspring (S) OR Cartwheel ¼ Turn Dismount' },
          { key: 'L4_beam_block_present', label: 'Block (3 secs) and Present' },
        ],
      },
      {
        apparatus: 'bars',
        label: 'Bars',
        emoji: '🎯',
        skills: [
          { key: 'L4_bars_hip_circle', label: 'LB — Up hip circle (single leg allowed)' },
          { key: 'L4_bars_back_hip', label: 'LB — Casts to Back Hip Circle (S)' },
          { key: 'L4_bars_stand_jump', label: 'LB — Stand on or straddle from cast to LB, jump to HB' },
          { key: 'L4_bars_swings', label: 'HB — 10 Swings re-grasping' },
          { key: 'L4_bars_half_turns', label: '2× Half Turns' },
          { key: 'L4_bars_german_hang', label: 'German Back Hang in Pike (S)' },
          { key: 'L4_bars_dismount', label: 'Dismount, Block and Finish' },
        ],
      },
      {
        apparatus: 'floor',
        label: 'Floor',
        emoji: '🤸',
        skills: [
          { key: 'L4_floor_dish_arch', label: 'Dish & Arch rolls and press' },
          { key: 'L4_floor_support', label: 'Side, Front & Back Support with fall' },
          { key: 'L4_floor_splits', label: 'Splits' },
          { key: 'L4_floor_elbow_balance', label: 'Elbow Balance' },
          { key: 'L4_floor_dive_roll', label: 'Dive Forward Roll to bunny hop HS' },
          { key: 'L4_floor_back_roll', label: 'Back Roll to Front Support' },
          { key: 'L4_floor_hs_fwd_roll', label: 'Handstand Forward Roll' },
          { key: 'L4_floor_cartwheel', label: 'Cartwheel (1-handed / side to side)' },
          { key: 'L4_floor_shoulderstand', label: 'Shoulderstand' },
          { key: 'L4_floor_back_walkover', label: 'Backward Walkover' },
          { key: 'L4_floor_leaps', label: 'Chassé, Catleaps, high hops, stag leaps' },
          { key: 'L4_floor_roundoff', label: 'Roundoff' },
        ],
      },
      {
        apparatus: 'rebound',
        label: 'Rebound',
        emoji: '🏃',
        skills: [
          { key: 'L4_reb_headspring', label: 'Head/Hand Spring off box top (S)' },
          { key: 'L4_reb_squat_tuck', label: 'Squat on, tuck off (vault 4)' },
          { key: 'L4_reb_squat_through', label: 'Squat Through (3/4)' },
          { key: 'L4_reb_straddle_on_off', label: 'Straddle on, straddle off (4)' },
          { key: 'L4_reb_straddle_over', label: 'Straddle Over (3/4)' },
          { key: 'L4_reb_block_present', label: 'Block and Present' },
        ],
      },
    ],
    floorRoutine: [
      'Present on beep',
      'Hands on hips — knees up ×4 or ×6',
      'Front to back cartwheel to 1-handed cartwheel',
      '1 leg squat to sit',
      'Sit Pike 3 secs',
      'Shoulderstand (S)',
      'Shoulderstand (unsupported)',
      'Dish 3 secs, roll to stand',
      'Back Walkover',
      'Backward Roll to Front Support',
      'Bunny Hop to Handstand Forward Roll',
      'Individual move (tumble/stationary)',
      'Travel to Elbow Stand',
      'FINISH — Present',
    ],
  },
  {
    level: 5,
    title: 'Performance',
    subtitle: 'Level 5',
    colour: '#8b5cf6',
    quote: '"My dream is to do a skill that nobody has ever done before." — Max Whitlock',
    apparatus: [
      {
        apparatus: 'beam',
        label: 'Beam',
        emoji: '⚖️',
        skills: [
          { key: 'L5_beam_mount', label: 'Springboard Tuck Jump Mount (S)' },
          { key: 'L5_beam_coupe', label: 'Full Coupe' },
          { key: 'L5_beam_pivot', label: '½ and Full Pivot Turn on Toes' },
          { key: 'L5_beam_leg_swings', label: 'Kneeling Leg Swings to Lift' },
          { key: 'L5_beam_y_balance', label: 'Y Balance' },
          { key: 'L5_beam_star_jump', label: 'Star Jump (S)' },
          { key: 'L5_beam_turn_jumps', label: 'Jump ½ Turn and Jump Full Turn' },
          { key: 'L5_beam_handstand', label: 'Handstand (S)' },
          { key: 'L5_beam_cartwheel', label: 'Cartwheel (S)' },
          { key: 'L5_beam_roundoff', label: 'Roundoff Dismount' },
          { key: 'L5_beam_block_present', label: 'Block (3 secs) and Present' },
        ],
      },
      {
        apparatus: 'bars',
        label: 'Bars',
        emoji: '🎯',
        skills: [
          { key: 'L5_bars_hip_circle', label: 'LB — Up hip circle (from 2 feet)' },
          { key: 'L5_bars_clear_hip', label: 'LB — Casts to clear Hip Circle (US)' },
          { key: 'L5_bars_undershoot', label: 'LB — Squat/straddle swing to undershoot' },
          { key: 'L5_bars_hb_sequence', label: 'Repeat: squat/straddle on, jump to HB, 2× ½ turns' },
          { key: 'L5_bars_dismount', label: 'German Back Hang Dismount OR Forward ½ Turn Dismount' },
          { key: 'L5_bars_block_present', label: 'Block and Present' },
        ],
      },
      {
        apparatus: 'floor',
        label: 'Floor',
        emoji: '🤸',
        skills: [
          { key: 'L5_floor_back_roll_hs', label: 'Back Roll to Handstand' },
          { key: 'L5_floor_hs_pirouette', label: 'Handstand Pirouette' },
          { key: 'L5_floor_cartwheel', label: 'Cartwheel consecutive' },
          { key: 'L5_floor_back_handspring', label: 'Back Handspring (S)' },
          { key: 'L5_floor_forward_walkover', label: 'Forward Walkover (S)' },
        ],
      },
      {
        apparatus: 'rebound',
        label: 'Rebound',
        emoji: '🏃',
        skills: [
          { key: 'L5_reb_squat_through', label: 'Squat Through B&P' },
          { key: 'L5_reb_straddle_over', label: 'Straddle Over B&P' },
          { key: 'L5_reb_headspring', label: 'Headspring (3/4 vault) B&P' },
          { key: 'L5_reb_handspring', label: 'Handspring (3/4 vault) B&P' },
          { key: 'L5_reb_dive_roll', label: 'Dive Forward Roll (Trampet)' },
          { key: 'L5_reb_hs_flat_back', label: 'Handstand flat back (Trampet)' },
        ],
      },
    ],
    floorRoutine: ['Individual routine — see coach for guidance', 'Must include skills from this level', 'Performed individually'],
  },
  {
    level: 6,
    title: 'Excellence',
    subtitle: 'Level 6',
    colour: '#0f172a',
    quote: '"If you mess up, don\'t panic — learning from mistakes is one of life\'s most important lessons." — Beth Tweddle',
    apparatus: [
      {
        apparatus: 'beam',
        label: 'Beam',
        emoji: '⚖️',
        skills: [
          { key: 'L6_beam_mount', label: 'Individual Mount' },
          { key: 'L6_beam_travel', label: 'Travelling at least 2 lengths of the beam' },
          { key: 'L6_beam_jumps', label: '4 jumps, leaps and turns' },
          { key: 'L6_beam_balances', label: '3 balances' },
          { key: 'L6_beam_travelling', label: '2 travelling moves' },
          { key: 'L6_beam_dismount', label: '1 tumble dismount' },
        ],
      },
      {
        apparatus: 'bars',
        label: 'Bars',
        emoji: '🎯',
        skills: [
          { key: 'L6_bars_hip_circle', label: 'LB — Up hip circle (from 2 feet)' },
          { key: 'L6_bars_clear_hip', label: 'LB — Casts to clear Hip Circle' },
          { key: 'L6_bars_upstart', label: 'LB — Squat/straddle swing to upstart' },
          { key: 'L6_bars_hb_sequence', label: 'Repeat: squat/straddle on, jump to HB upstart, 2× ½ turn jumps' },
          { key: 'L6_bars_dismount', label: 'Forward swing Back Tuck dismount' },
          { key: 'L6_bars_block_present', label: 'Block and Present' },
        ],
      },
      {
        apparatus: 'floor',
        label: 'Floor',
        emoji: '🤸',
        skills: [
          { key: 'L6_floor_roundoff_tuck', label: 'Roundoff Back Tuck' },
          { key: 'L6_floor_roundoff_bhs', label: 'Roundoff BHS multiple' },
          { key: 'L6_floor_flyspring', label: 'Flyspring' },
          { key: 'L6_floor_aerial', label: 'Aerial' },
        ],
      },
      {
        apparatus: 'rebound',
        label: 'Rebound',
        emoji: '🏃',
        skills: [
          { key: 'L6_reb_squat_through', label: 'Squat Through B&P' },
          { key: 'L6_reb_straddle_over', label: 'Straddle Over B&P' },
          { key: 'L6_reb_handspring_turn', label: 'Handspring ½ turn B&P' },
          { key: 'L6_reb_front_tuck', label: 'Front Tuck (Trampet)' },
          { key: 'L6_reb_back_tuck', label: 'Back Tuck (from platform)' },
        ],
      },
    ],
    floorRoutine: ['Individual floor and beam routines', 'Designed with your coach', 'Must demonstrate full Level 6 skill set'],
  },
]

export function getLevelData(level: number): TrackerLevel | undefined {
  return TRACKER_LEVELS.find(l => l.level === level)
}

export function getLevelSkillKeys(level: number): string[] {
  const l = getLevelData(level)
  if (!l) return []
  return l.apparatus.flatMap(a => a.skills.map(s => s.key))
}
