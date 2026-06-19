import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { ArrowLeft, ChevronDown, ChevronUp, BookOpen, CheckCircle, Award, HelpCircle, FileText, AlertCircle } from 'lucide-react'

type Section = 'overview' | 'books' | 'signoff' | 'glossary' | 'faq'

const GLOSSARY = [
  { term: 'S', definition: 'Supported — the coach must provide physical support throughout the skill' },
  { term: 'US', definition: 'Unsupported — the child performs the skill completely independently' },
  { term: 'H', definition: 'Held — a balance position held for a minimum of 3 seconds unless stated otherwise' },
  { term: '½', definition: 'Half turn / half twist (180°)' },
  { term: '1/1', definition: 'Full turn / full twist (360°)' },
  { term: 'FWD', definition: 'Forward — direction of travel or rotation' },
  { term: 'BWD', definition: 'Backward — direction of travel or rotation' },
  { term: 'H&K', definition: 'Hands and Knees — a landing position on the trampoline' },
  { term: 'Seat', definition: 'Seat drop — landing in a sitting position on the trampoline' },
  { term: 'Front', definition: 'Front drop — landing on the front of the body on the trampoline' },
  { term: 'Back', definition: 'Back drop — landing on the back on the trampoline' },
  { term: 'Tuck', definition: 'Body shape with knees drawn up to the chest and shins parallel to the floor' },
  { term: 'Pike', definition: 'Body shape with legs straight and body bent at the hips' },
  { term: 'Straddle', definition: 'Legs spread wide apart — used in jumps, holds and shapes' },
  { term: 'Straight', definition: 'Body fully extended — legs together, arms by the sides or overhead' },
  { term: 'Star', definition: 'Body extended with arms and legs spread wide apart (also called "star jump")' },
  { term: 'Dish', definition: 'Hollow body hold — lower back pressed to floor, legs and shoulders lifted' },
  { term: 'Arch', definition: 'Backward body curve — chest and legs lifted from the floor simultaneously' },
  { term: 'BWO', definition: 'Back Walkover — continuous backward rotation over the hands' },
  { term: 'FWO', definition: 'Forward Walkover — continuous forward rotation over the hands' },
  { term: 'UKAG', definition: 'UK Academies of Gymnastics — the qualification and awards provider' },
  { term: 'L1 / L2', definition: 'UKAG Level 1 Coach / Level 2 Lead Coach qualification levels' },
]

const FAQ = [
  {
    q: 'Can a child skip a level?',
    a: 'No. The levels are sequential. A child who can perform Level 3 skills must still complete Levels 1 and 2. The foundation levels contain skills and understanding that sit beneath the higher-level work. Skipping is not permitted and would invalidate the award.',
  },
  {
    q: 'Can a child repeat a level?',
    a: 'A child can work on a level for as long as needed. There is no time pressure. If a child completes Level 2 and then loses confidence or regresses, they continue from where they are rather than starting Level 3. The award book is a record of what they have achieved — it never goes backwards.',
  },
  {
    q: 'What if a child is ready for Level 4 but there is no Level 2 coach available?',
    a: 'Level 4, 5 and 6 skills cannot be signed off without a Level 2 coach present. The child continues working on and consolidating Level 3 skills until a Level 2 coach is available. Use the time to build quality, not frustration.',
  },
  {
    q: 'A parent says their child is at a higher level than the book shows. What do I do?',
    a: 'Be calm and direct. Explain that the award reflects what has been observed and signed off by a qualified UKAG coach. If they believe their child is ready to progress, the correct process is for the child to demonstrate the skills to a coach in the next session. The book is the record — not what the child can do at home.',
  },
  {
    q: 'What if a child loses their award book?',
    a: 'Contact UKAG at info@uk-ag.co.uk. If there is a record in the UKAG app or in coach notes, a replacement book can be issued at the coach\'s discretion. Completed levels can be reinstated with evidence. A lost book is not the end of a child\'s awards progress — it is an admin task.',
  },
  {
    q: 'Can I use the trampoline book for mini trampoline sessions?',
    a: 'The trampoline awards are designed for full-size recreational trampolines. Mini trampoline work in a school hall context does not qualify for the same awards. UKAG is developing a separate recreational movement award that covers mini trampoline and rebound activities. Ask your Area Lead for the current position on this.',
  },
  {
    q: 'How long should each level take?',
    a: 'There is no fixed timeline. A child who attends twice a week will progress faster than one who attends once a week. Level 1 typically takes 6 to 12 weeks for most children. Level 5 and 6 can take a year or more. Focus on quality, not speed.',
  },
  {
    q: 'Can a child do both gymnastics and trampoline awards simultaneously?',
    a: 'Yes. The two books are entirely separate. A child can be at Level 3 gymnastics and Level 1 trampolining at the same time. There is no requirement for the levels to match. Each discipline has its own progression pathway.',
  },
]

const TABS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Framework', icon: <BookOpen size={15} /> },
  { key: 'books', label: 'Using the Books', icon: <FileText size={15} /> },
  { key: 'signoff', label: 'Signing Off', icon: <CheckCircle size={15} /> },
  { key: 'glossary', label: 'Glossary', icon: <Award size={15} /> },
  { key: 'faq', label: 'FAQ', icon: <HelpCircle size={15} /> },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-semibold text-gray-900 text-sm pr-4">{q}</span>
        {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  )
}

export function AwardsGuidePage() {
  const [activeTab, setActiveTab] = useState<Section>('overview')

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/library" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          Coaching Library
        </Link>
        <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 100%)', color: '#fff' }}>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 border-white/30 bg-white/10">
              📋
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest opacity-70" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                UKAG Coach Reference
              </div>
              <h1 className="text-xl sm:text-2xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Awards Coach Guide
              </h1>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed max-w-2xl">
            Your practical reference for delivering the UKAG Awards framework. How the books work, what each skill requires, how to sign off progress, and how to manage the awards process with your gymnasts and their families.
          </p>
        </div>

        {/* Tab bar — scrollable on mobile */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 flex-shrink-0 py-2 px-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
              style={
                activeTab === tab.key
                  ? { backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontFamily: 'Montserrat, sans-serif' }
                  : { color: '#6b7280' }
              }
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>What the Awards Are</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                The UKAG Recreational Awards are a structured progression framework for children aged 4 to 14. They exist across two disciplines — gymnastics and trampolining — and cover six levels in each. Every level builds on the last. Every skill has a standard. Every sign-off means something.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                The awards are not competitive. There are no scores, no rankings and no eliminations. They are a personal achievement system — each child progresses at their own pace, and every level completed is a genuine accomplishment to be celebrated.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: '#4f46e518' }}>🤸</div>
                  <h3 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Gymnastics Award Book</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">Six levels covering Beam, Bars, Floor and Rebound. Skills progress from basic shapes and rolls (Level 1) through to complex linking sequences and advanced vaults (Level 6).</p>
                <Link to="/library" className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: '#4f46e5' }}>
                  View Gymnastics Library →
                </Link>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: '#0891b218' }}>🛡️</div>
                  <h3 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Trampolining Award Book</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">Six levels from Foundation to Excellence. Skills progress from basic bounces and landings to somersaults and linking combinations. Every routine is 10 contacts.</p>
                <Link to="/library" className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: '#0891b2' }}>
                  View Trampolining Library →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>The Six Levels</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <th className="px-4 py-3 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>Level</th>
                      <th className="px-4 py-3 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>Name</th>
                      <th className="px-4 py-3 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>Typical Age</th>
                      <th className="px-4 py-3 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>Coach Requirement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { level: 1, name: 'Foundation', age: '4–6', coach: 'UKAG Level 1 Coach' },
                      { level: 2, name: 'Developing', age: '5–7', coach: 'UKAG Level 1 Coach' },
                      { level: 3, name: 'Progressing', age: '6–9', coach: 'UKAG Level 1 Coach' },
                      { level: 4, name: 'Advancing', age: '7–11', coach: 'UKAG Level 2 Lead Coach required for sign-off' },
                      { level: 5, name: 'Performance', age: '9–13', coach: 'UKAG Level 2 Lead Coach required for sign-off' },
                      { level: 6, name: 'Excellence', age: '10–14', coach: 'UKAG Level 2 Lead Coach required for sign-off' },
                    ].map(row => (
                      <tr key={row.level} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-black text-gray-900 whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>{row.level}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{row.name}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{row.age}</td>
                        <td className="px-4 py-3 text-gray-700">{row.coach}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-black text-amber-800 text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Level 4, 5 and 6 Sign-Off Rule</div>
                  <p className="text-sm text-amber-800 leading-relaxed">Skills and level completions for Levels 4, 5 and 6 must only be signed off with a UKAG Level 2 Lead Coach present. A Level 1 coach can deliver the sessions and support skill development, but cannot finalise sign-off for these levels.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOOKS */}
        {activeTab === 'books' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>What the Book Contains</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Each child has their own Personal Award Book. It belongs to them. Your job is to work through it with them — not to fill it in for them, and not to use one book for a group. The book travels with the child — if they move clubs or schools, their progress record goes with them.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>The Skill Circles</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Each skill has an empty circle next to it. This is the sign-off marker. When a child achieves the skill to the required standard, you fill in the circle. You then write the date in the date field and add your name. That is the record.
              </p>
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-sm text-indigo-800">
                Initials are acceptable for individual skill circles. Your full name is required on the Level Complete page.
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Completing a Level — All Four Steps</h2>
              <div className="space-y-3">
                {[
                  { n: 1, text: 'All apparatus skills are ticked and signed on the skills pages' },
                  { n: 2, text: 'The floor routine (gymnastics) or trampoline routine (trampolining) has been performed and recorded' },
                  { n: 3, text: 'The Level Complete page is signed by a coach' },
                  { n: 4, text: 'The child has completed their reflection page' },
                ].map(step => (
                  <div key={step.n} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 text-white" style={{ backgroundColor: '#4f46e5', fontFamily: 'Montserrat, sans-serif' }}>{step.n}</span>
                    <p className="text-sm text-gray-700">{step.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 font-semibold">
                Only order the certificate when all four steps are complete. Do not order early.
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Moving to the Next Level</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Once a level is complete and the certificate is ordered, the child can begin working on the next level immediately. They do not need to wait for the physical certificate to arrive before starting. The coach sign-off on the level complete page is the official record.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Using the App Alongside the Book</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                The UKAG app allows you to track awards progress digitally alongside the physical award book. The app does not replace the book — both run together. The book is the official record; the app is the management tool.
              </p>
              <div className="space-y-2">
                {[
                  'During the session — use the app to note which skills have been achieved',
                  'At the end of the session — transfer app records into the physical books with your signature',
                  'Never sign off a level completion only in the app — the physical book must also be signed',
                  'The app syncs across devices — what you log is visible to the Level 2 Lead Coach in real time',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#4f46e5' }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SIGN-OFF */}
        {activeTab === 'signoff' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>The Sign-Off Standard</h2>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-indigo-900 font-semibold italic leading-relaxed">
                  "Before you tick a circle, ask yourself one question: would I be happy explaining this decision to the child's parent, their school, and the UKAG Director?"
                </p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                If the answer is yes, sign it off. If there is any doubt, give it another session. The awards have value because the sign-off means something. The moment coaches lower the bar to make a child feel better or to save time, the qualification loses credibility.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                All balances must be held for a minimum of 3 seconds unless the skill description states otherwise. Skills marked <strong>(S)</strong> require continuous physical support from the coach. Skills marked <strong>(US)</strong> must be performed completely independently.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>What to Write When You Sign Off</h2>
              <div className="space-y-3">
                {[
                  { label: 'Individual skill', detail: 'Fill the circle, write the date, add your initials' },
                  { label: 'Level Complete page', detail: 'Fill the circle, write the date, write your full name' },
                  { label: 'Why both?', detail: 'This creates a clear audit trail. If a skill is disputed later, the record must be complete.' },
                ].map((row, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="font-bold text-gray-900 flex-shrink-0 min-w-[140px]">{row.label}</span>
                    <span className="text-gray-700">{row.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Signing Off the Level Complete Page</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Do not sign off the Level Complete page until you have personally checked that every apparatus page is complete. It is not enough for another coach to tell you — check the book yourself before you sign.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                Levels 4, 5 and 6 must be signed off by a UKAG Level 2 Lead Coach. A Level 1 coach cannot complete this step.
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Ordering Certificates</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Certificates are ordered online at <strong>www.uk-ag.co.uk</strong>. You cannot print them yourself — they are issued by UKAG centrally to maintain consistency and quality. Each certificate has a unique UKAG reference number.
              </p>
              <div className="space-y-2 mb-4">
                {[
                  'Order the certificate as soon as the Level Complete page is signed — do not sit on it',
                  'Certificates are dispatched within 5 working days',
                  'If a certificate has not arrived after 10 working days, contact info@uk-ag.co.uk',
                  'Lost certificates can be reissued — contact UKAG with the child\'s name, level and completion date',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Medals and Digital Badges</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Digital badges are available to download through the UKAG app for each level completion. Physical medals are available at additional cost from <strong>www.uk-ag.co.uk</strong>. The Level 6 Platinum Medal is a special award and should be presented with appropriate ceremony where possible.
              </p>
            </div>
          </div>
        )}

        {/* GLOSSARY */}
        {activeTab === 'glossary' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Terms and Abbreviations</h2>
              <p className="text-sm text-gray-500 mb-4">These abbreviations appear throughout the award books. They define the standard of delivery for each skill — not optional shorthand.</p>
              <div className="space-y-0 divide-y divide-gray-100">
                {GLOSSARY.map(({ term, definition }) => (
                  <div key={term} className="flex items-start gap-4 py-3">
                    <span
                      className="font-black text-sm flex-shrink-0 w-14 text-center py-0.5 rounded-md"
                      style={{ backgroundColor: '#4f46e518', color: '#4f46e5', fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {term}
                    </span>
                    <span className="text-sm text-gray-700 leading-relaxed">{definition}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4 mb-2">
              <p className="text-sm text-indigo-800">Common questions coaches ask about delivering the UKAG Awards framework.</p>
            </div>
            {FAQ.map(({ q, a }) => (
              <FAQItem key={q} q={q} a={a} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
