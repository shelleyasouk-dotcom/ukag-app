import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import {
  BookOpen,
  HelpCircle,
  Upload,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Info,
  AlertTriangle,
  Lightbulb,
  PlayCircle,
} from 'lucide-react'

// ── Copy-to-clipboard helper ─────────────────────────────────────────────────

function CopyBlock({ label, content }: { label: string; content: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white">
        <span className="text-xs font-bold text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {label}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          style={{ color: copied ? '#16a34a' : '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="px-4 py-3 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">
        {content}
      </pre>
    </div>
  )
}

// ── Accordion section ────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  subtitle,
  colour,
  children,
  defaultOpen = false,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  title: string
  subtitle: string
  colour: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: colour + '18' }}
        >
          <Icon size={20} style={{ color: colour }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2
            className="font-black text-gray-900 text-sm"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {title}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        {open ? (
          <ChevronUp size={18} className="text-gray-400 flex-shrink-0 mt-1" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0 mt-1" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-6 border-t border-gray-100 pt-5 space-y-5">
          {children}
        </div>
      )}
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
      <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-blue-800 leading-relaxed">{children}</p>
    </div>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
      <Lightbulb size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-800 leading-relaxed">{children}</p>
    </div>
  )
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
      <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-red-800 leading-relaxed">{children}</p>
    </div>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-xs font-black text-gray-700 uppercase tracking-widest pt-2"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {children}
    </h3>
  )
}

// ── Template content ─────────────────────────────────────────────────────────

const READING_TEMPLATE = `WEEK [NUMBER] BRIEF — [WEEK TITLE]

INTRODUCTION
[2–3 sentences setting the context for this week. What is the candidate going to learn? Why does it matter for their coaching practice?]

Example: This week we focus on planning and structuring a gymnastics session. Effective planning ensures every child progresses safely and confidently. By the end of this brief you should be able to write a session plan and explain the reasoning behind each element.

---

LEARNING OUTCOMES
By the end of this week you will be able to:
• [Outcome 1 — use action verbs: plan, deliver, assess, explain, demonstrate]
• [Outcome 2]
• [Outcome 3]

---

SECTION 1: [HEADING]

[Write 2–4 paragraphs of factual content here. Keep sentences short. Use second-person "you" to speak directly to the candidate.]

Key points:
• [Point 1]
• [Point 2]
• [Point 3]

---

SECTION 2: [HEADING]

[Continue with next topic. Break long information into bullet points or numbered steps wherever possible.]

Step-by-step:
1. [First step]
2. [Second step]
3. [Third step]

---

SECTION 3: [HEADING]

[Include a practical or scenario-based example here to bring the content to life.]

Example scenario: [Describe a realistic coaching situation that illustrates the key point.]

---

FURTHER READING / PREPARATION
Before your next session, please:
• [Action 1 — e.g. review your session plan template]
• [Action 2 — e.g. watch the video linked above]
• [Action 3 — e.g. complete the quiz below]`

const QUIZ_TEMPLATE = `QUIZ QUESTION TEMPLATE

Question: [Write a clear, unambiguous question. Avoid double negatives.]

Option A: [Correct answer — factually accurate, specific]
Option B: [Plausible distractor — partially correct or a common misconception]
Option C: [Plausible distractor — sounds reasonable but is wrong]
Option D: [Clearly wrong but not obviously silly]

Correct: A

Explanation: [1–2 sentences explaining WHY A is correct and why the others are not. This is shown to the candidate after they answer.]

---

TIPS FOR GOOD QUIZ QUESTIONS:
• One clearly correct answer — no ambiguity
• Distractors should be plausible, not trick questions
• Avoid "all of the above" and "none of the above"
• Keep the question under 25 words
• Test understanding, not memory of exact wording from the brief
• Aim for 5–8 questions per week (enough to reinforce learning without overwhelming)`

const ASSESSMENT_NOTES_TEMPLATE = `FINAL ASSESSMENT GUIDANCE NOTES
(Shared with candidates before the final week)

WHAT TO EXPECT
Your final assessment consists of two parts:
1. A practical coaching session that you will record and upload as a video
2. A written reflection completed after your session

WHAT TO RECORD
Film a minimum of 10 minutes of you leading a gymnastics/trampolining session with real participants. Ensure the video clearly shows:
• Your warm-up and cool-down
• At least two skill progressions being taught
• How you manage safety and correct technique
• How you communicate with and motivate participants

REFLECTION QUESTIONS (to write and upload alongside your video)
Please write 200–400 words addressing the following:
1. What went well in your session and why?
2. What would you do differently if you were to deliver this session again?
3. How did you adapt your coaching for different ability levels?
4. Describe one safety decision you made and explain your reasoning.

ASSESSMENT CRITERIA
Your lead coach will assess your video and reflection against six criteria:
• Planning & Preparation — Did your session have clear structure and appropriate progressions?
• Technical Knowledge & Delivery — Did you demonstrate correct technique and safe progressions?
• Safety Awareness & Risk Management — Did you identify and manage risks appropriately?
• Communication & Engagement — Did you communicate clearly and keep participants engaged?
• Participant Management — Did you manage the group effectively and inclusively?
• Reflective Practice — Did your reflection show honest self-evaluation and insight?

Each criterion is rated 1–4:
1 = Insufficient  2 = Developing  3 = Competent  4 = Proficient

OVERALL RESULT
• Pass — Competent or above in all six criteria
• Refer — One or more criteria rated Developing; you will be given a second opportunity
• Not Yet Competent — Significant gaps; further training and a full reassessment required

UPLOADING YOUR EVIDENCE
Upload both your video file and your written reflection (as a Word document or PDF) in the Assessment tab of Week [N]. Your lead coach will review them and notify you of your result within [X] days.`

const WEEK_STRUCTURE_EXAMPLE = `EXAMPLE: LEVEL 1 GYMNASTICS COACH — WEEK 1

Week title: Introduction to Gymnastics Coaching

Reading content:
- What gymnastics coaching involves at Level 1
- The UKAG coaching philosophy and values
- Safeguarding fundamentals every coach must know
- Session structure: warm-up, skill work, cool-down
- Your responsibilities as an assistant coach

Quiz (6 questions):
- Q1: What is the primary responsibility of an assistant coach? [safety-focused answer]
- Q2: At what point should a coach stop an activity? [correct: whenever safety is at risk]
- Q3: Which of the following is NOT part of a warm-up? [tests understanding of structure]
- Q4: What should you do if a child discloses a safeguarding concern? [critical topic]
- Q5: How should you adapt an activity for a participant with limited mobility?
- Q6: Who is responsible for completing a pre-session risk assessment?

No upload required this week.

---

EXAMPLE: LEVEL 1 GYMNASTICS COACH — WEEK 4 (FINAL)

Week title: Practical Assessment

Reading content:
- Recap of all four weeks: structure, technique, safety, reflection
- What assessors look for and how criteria are applied
- How to film your session effectively
- Common pitfalls and how to avoid them
- What happens after your result

Quiz (4 recap questions):
- Q1: Which document should you complete before every session you lead?
- Q2: A child lands awkwardly and complains of wrist pain. What is your first action?
- Q3: Name the six assessment criteria used in this qualification.
- Q4: What does "reflective practice" mean in the context of gymnastics coaching?

Upload required: Yes — coaching video + written reflection
Final assessment: Yes — coach completes assessment form after reviewing upload`

// ── Page ─────────────────────────────────────────────────────────────────────

export function CourseAuthorGuidePage() {
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
          Admin Resource
        </div>
        <h1
          className="text-2xl font-black text-gray-900 mb-2"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Course Structure & Content Guide
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
          Everything you need to plan and write supporting documents for candidates on your live courses.
          Use the templates below as starting points — copy them, paste into the week editor, and adapt to your content.
        </p>
      </div>

      {/* Quick nav */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 mb-8">
        <p
          className="text-xs font-black uppercase tracking-widest text-white/50 mb-3"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Jump to
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { label: 'How a Course Works', href: '#how' },
            { label: 'Writing a Week Brief', href: '#reading' },
            { label: 'Writing Quiz Questions', href: '#quiz' },
            { label: 'Assessment Week', href: '#assessment' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <ChevronDown size={11} />
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-4">

        {/* ── HOW A COURSE WORKS ─────────────────────────────────── */}
        <div id="how">
          <Section
            icon={PlayCircle}
            title="How a Cohort Course Works"
            subtitle="The full flow from creation to candidate completion"
            colour="#1e52a4"
            defaultOpen={true}
          >
            <SubHeading>The five-step cycle</SubHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { n: '1', label: 'Create', desc: 'Admin creates the course instance and sets the number of weeks' },
                { n: '2', label: 'Build', desc: 'Admin writes reading content and quiz questions for each week' },
                { n: '3', label: 'Enrol', desc: 'Admin adds candidates by their portal email address' },
                { n: '4', label: 'Unlock', desc: 'Admin unlocks each week when the live session happens' },
                { n: '5', label: 'Assess', desc: 'Coach fills in the final assessment form per candidate' },
              ].map(step => (
                <div key={step.n} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <div
                    className="w-7 h-7 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-black"
                    style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {step.n}
                  </div>
                  <div
                    className="text-xs font-black text-gray-900 mb-1"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {step.label}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <SubHeading>What candidates see each week</SubHeading>
            <div className="space-y-2">
              {[
                {
                  icon: BookOpen,
                  label: 'Reading tab',
                  desc: 'The week brief you write. They read it in full, then click "Mark as Read" to continue. Supports plain text with paragraph breaks.',
                  colour: '#1e52a4',
                },
                {
                  icon: HelpCircle,
                  label: 'Quiz tab',
                  desc: 'Multiple-choice questions. Pass mark is 70%. They see which answers were correct and the explanation you wrote. They can retake until they pass.',
                  colour: '#7c3aed',
                },
                {
                  icon: Upload,
                  label: 'Upload tab',
                  desc: 'Only shown when you enable "Require upload" on a week. Candidates upload video files, PDFs or images. All uploads are visible to you in the Candidates tab.',
                  colour: '#0d9488',
                },
                {
                  icon: ClipboardCheck,
                  label: 'Assessment result',
                  desc: 'On the final assessment week, once you submit the coach assessment form, the candidate sees their result (Pass / Refer / Not Yet Competent) and your notes.',
                  colour: '#ef462c',
                },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.colour + '18' }}
                  >
                    <item.icon size={14} style={{ color: item.colour }} />
                  </div>
                  <div>
                    <span
                      className="text-xs font-black text-gray-900"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {item.label}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <SubHeading>Week completion rules</SubHeading>
            <p className="text-xs text-gray-600 leading-relaxed">
              A week is marked complete when the candidate has: (1) clicked Mark as Read, AND (2) passed the quiz (if one exists), AND (3) uploaded at least one file (if upload is required). Progress is saved automatically so they can leave and return.
            </p>

            <SubHeading>Example — Level 1 Gymnastics, 4 weeks</SubHeading>
            <CopyBlock label="Course structure example" content={WEEK_STRUCTURE_EXAMPLE} />
          </Section>
        </div>

        {/* ── WRITING A READING BRIEF ───────────────────────────── */}
        <div id="reading">
          <Section
            icon={BookOpen}
            title="Writing a Week Brief (Reading Content)"
            subtitle="How to structure the weekly study material candidates read before their session"
            colour="#1e52a4"
          >
            <Note>
              The reading content is plain text. Use blank lines to separate paragraphs. Bullet points using "•" and numbered steps work well. The text appears exactly as you type it, so structure it clearly using headings in CAPS or with dashes.
            </Note>

            <SubHeading>Recommended structure</SubHeading>
            <div className="space-y-2">
              {[
                { section: 'Introduction', words: '50–80 words', desc: 'Set context: what this week covers and why it matters. Speak directly to the candidate.' },
                { section: 'Learning Outcomes', words: '3–5 bullet points', desc: 'What will they be able to do after reading this? Use action verbs: plan, explain, demonstrate, identify, apply.' },
                { section: 'Main Content (2–4 sections)', words: '200–500 words total', desc: 'Break into themed sections with a short heading. Mix paragraphs, bullet lists and numbered steps. Include one practical example or scenario.' },
                { section: 'Further preparation', words: '3–5 bullet points', desc: 'What should they do before the next session? Review, practise, prepare, watch.' },
              ].map(row => (
                <div key={row.section} className="grid grid-cols-[auto_1fr] gap-3 items-start">
                  <div className="flex-shrink-0">
                    <span
                      className="inline-block bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {row.section}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {row.words}
                    </span>
                    <span className="text-xs text-gray-500"> — {row.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <SubHeading>Content writing tips</SubHeading>
            <div className="space-y-1.5">
              {[
                'Write at a reading age of around 16 — clear, direct, no jargon unless you define it',
                'Use "you" to address the candidate directly rather than "coaches should…"',
                'Keep paragraphs to 3–4 sentences maximum',
                'Underpin every point with WHY it matters in practice',
                'Include at least one real scenario or example that a coach on the ground would recognise',
                'End each section with a bridge to the next: "Now that you understand X, let\'s look at Y…"',
                'Total brief should take 10–20 minutes to read carefully',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-white text-xs font-black"
                    style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif', fontSize: '9px' }}
                  >
                    {i + 1}
                  </span>
                  {tip}
                </div>
              ))}
            </div>

            <Tip>
              Write the brief AFTER you know what you're teaching in the live session that week — the brief should prepare them to get more out of the practical, not just repeat what you'll cover face-to-face.
            </Tip>

            <SubHeading>Reading brief template</SubHeading>
            <CopyBlock label="Week brief template — copy and adapt" content={READING_TEMPLATE} />
          </Section>
        </div>

        {/* ── WRITING QUIZ QUESTIONS ────────────────────────────── */}
        <div id="quiz">
          <Section
            icon={HelpCircle}
            title="Writing Quiz Questions"
            subtitle="How to write multiple-choice questions that test real understanding — pass mark is 70%"
            colour="#7c3aed"
          >
            <Note>
              Each question has exactly 4 answer options. You select one as correct. The candidate sees which answer was right (highlighted green) and wrong (struck through) after submitting. If you write an explanation, it appears beneath the question as a learning note.
            </Note>

            <SubHeading>Anatomy of a good question</SubHeading>
            <div className="space-y-3">
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-purple-50 px-4 py-2.5 border-b border-gray-200">
                  <span
                    className="text-xs font-black text-purple-800"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Example question
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-sm font-bold text-gray-900">
                    A participant lands awkwardly and complains of wrist pain. What is your first action?
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { opt: 'A', text: 'Stop the activity immediately and keep the participant still', correct: true },
                      { opt: 'B', text: 'Apply ice from the first aid kit before doing anything else', correct: false },
                      { opt: 'C', text: 'Ask the participant to walk it off and monitor for five minutes', correct: false },
                      { opt: 'D', text: 'Continue the session and report the incident at the end', correct: false },
                    ].map(o => (
                      <div
                        key={o.opt}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${o.correct ? 'bg-green-50 border border-green-200 text-green-800 font-bold' : 'border border-gray-100 text-gray-600'}`}
                      >
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs font-black flex-shrink-0 ${o.correct ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {o.opt}
                        </span>
                        {o.text}
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs text-blue-800 mt-2">
                    <strong>Explanation:</strong> The priority is always to stop and assess before any treatment. Moving an injured participant or continuing the session risks further harm.
                  </div>
                </div>
              </div>
            </div>

            <SubHeading>Rules for effective questions</SubHeading>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: 'One clearly correct answer', desc: 'There must be no ambiguity. If two options could be argued as correct, rewrite.' },
                { label: 'Plausible distractors', desc: 'Wrong answers should reflect genuine misconceptions — not obviously silly options.' },
                { label: 'Test understanding, not memory', desc: "Ask candidates to apply what they've read, not recall exact phrases from the brief." },
                { label: 'Keep it concise', desc: 'The question stem should be under 30 words. Longer questions become comprehension tests.' },
                { label: 'No trick questions', desc: 'Avoid double negatives, "which is NOT" unless essential, and always/never statements.' },
                { label: 'Write the explanation', desc: 'Even for a correct answer, explain WHY. It reinforces learning rather than just telling them they got it right.' },
              ].map(rule => (
                <div key={rule.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div
                    className="text-xs font-black text-gray-900 mb-0.5"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    ✓ {rule.label}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>

            <SubHeading>Suggested topics by week type</SubHeading>
            <div className="space-y-2 text-xs text-gray-700">
              {[
                { week: 'Week 1 (Introduction)', topics: 'Role of a coach, safeguarding principles, session structure, duty of care, UKAG values' },
                { week: 'Week 2 (Technical)', topics: 'Skill progressions, spotting techniques, equipment safety, common errors and corrections' },
                { week: 'Week 3 (Delivery)', topics: 'Differentiation, communication styles, behaviour management, warm-up and cool-down rationale' },
                { week: 'Week 4 (Assessment)', topics: 'Recap of key principles, risk assessment, reflective practice, next steps in development' },
              ].map(row => (
                <div key={row.week} className="flex gap-2">
                  <span
                    className="font-bold text-gray-900 flex-shrink-0 w-36"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {row.week}
                  </span>
                  <span className="text-gray-500">{row.topics}</span>
                </div>
              ))}
            </div>

            <SubHeading>Quiz question template</SubHeading>
            <CopyBlock label="Quiz question planning template — copy for each question" content={QUIZ_TEMPLATE} />

            <Warning>
              The pass mark is fixed at 70%. For a 5-question quiz that means 4 correct; for 10 questions it's 7. Aim for 6–8 questions per week so a single wrong answer doesn't mean a fail. Avoid questions where a careful reader could argue more than one answer is defensible.
            </Warning>
          </Section>
        </div>

        {/* ── ASSESSMENT WEEK ───────────────────────────────────── */}
        <div id="assessment">
          <Section
            icon={ClipboardCheck}
            title="The Final Assessment Week"
            subtitle="What to set up, what candidates submit, and how to assess them"
            colour="#ef462c"
          >
            <Note>
              The final week has a special "Final Assessment" flag that enables the coach assessment form in the admin panel. Candidates upload their evidence, you review it and fill in the form — their result then appears in their portal automatically.
            </Note>

            <SubHeading>Setting up the final week</SubHeading>
            <div className="space-y-1.5">
              {[
                'In the week editor, write a reading brief that recaps the whole course and prepares candidates for what to film',
                'Add a short quiz (4–6 questions) covering key safety and reflective practice points',
                'Tick "Require file/video upload"',
                'In the upload prompt field, tell candidates exactly what to submit (video length, reflection questions, file format)',
                'Tick "This is the final assessment week" — this enables the Assessments tab in the admin panel',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <span
                    className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-white text-xs font-black"
                    style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif', fontSize: '9px' }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>

            <SubHeading>The six assessment criteria</SubHeading>
            <div className="space-y-2">
              {[
                { criterion: 'Planning & Preparation', look: 'Did the session have clear structure, appropriate progressions, and suitable learning objectives for the group?' },
                { criterion: 'Technical Knowledge & Delivery', look: 'Was technique demonstrated correctly? Were progressions safe and appropriate? Were corrections given clearly?' },
                { criterion: 'Safety Awareness & Risk Management', look: 'Was the environment checked? Were risks identified and managed? Was the candidate aware of emergency procedures?' },
                { criterion: 'Communication & Engagement', look: 'Were instructions clear, age-appropriate and well-paced? Did participants remain engaged and motivated?' },
                { criterion: 'Participant Management', look: 'Was the group managed effectively? Were individual needs considered? Was behaviour handled appropriately?' },
                { criterion: 'Reflective Practice', look: 'Does the reflection show honest self-evaluation? Does it demonstrate insight into what worked and what to improve?' },
              ].map((c, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-100 p-3"
                >
                  <div
                    className="text-xs font-black text-gray-900 mb-0.5"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {i + 1}. {c.criterion}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.look}</p>
                </div>
              ))}
            </div>

            <SubHeading>Rating scale</SubHeading>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { score: '1', label: 'Insufficient', desc: 'Significant gaps — not yet safe to practise', colour: '#dc2626' },
                { score: '2', label: 'Developing', desc: 'Shows understanding but lacks consistent application', colour: '#f59e0b' },
                { score: '3', label: 'Competent', desc: 'Meets the standard; safe and effective', colour: '#2563eb' },
                { score: '4', label: 'Proficient', desc: 'Above standard; shows initiative and skill', colour: '#16a34a' },
              ].map(r => (
                <div key={r.score} className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                  <div
                    className="text-lg font-black mb-1"
                    style={{ color: r.colour, fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {r.score}
                  </div>
                  <div
                    className="text-xs font-black text-gray-900 mb-1"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {r.label}
                  </div>
                  <p className="text-xs text-gray-500 leading-snug">{r.desc}</p>
                </div>
              ))}
            </div>

            <SubHeading>Overall result decisions</SubHeading>
            <div className="space-y-2">
              {[
                { result: 'Pass', colour: '#16a34a', bg: 'bg-green-50 border-green-200', rule: 'Rate 3 or above in ALL six criteria. The candidate has met the standard and may receive their qualification.' },
                { result: 'Refer', colour: '#b45309', bg: 'bg-amber-50 border-amber-200', rule: 'One or two criteria rated 2 (Developing). The candidate has another opportunity — usually a further observation or additional work. Use the Notes field to specify what is needed.' },
                { result: 'Not Yet Competent', colour: '#dc2626', bg: 'bg-red-50 border-red-200', rule: 'Three or more criteria rated 1 or 2, or any criteria rated 1 that relate to safeguarding or safety. A full reassessment after further training is required.' },
              ].map(r => (
                <div
                  key={r.result}
                  className={`rounded-xl border p-3 ${r.bg}`}
                >
                  <div
                    className="text-xs font-black mb-0.5"
                    style={{ color: r.colour, fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {r.result}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: r.colour }}>
                    {r.rule}
                  </p>
                </div>
              ))}
            </div>

            <Tip>
              Complete the assessment form as soon as possible after reviewing the submission — ideally within 5 working days. The candidate can see their result and your notes the moment you save it.
            </Tip>

            <SubHeading>Candidate-facing assessment guidance (copy into final week brief)</SubHeading>
            <CopyBlock label="Assessment guidance for candidates — paste into Week 4 reading content" content={ASSESSMENT_NOTES_TEMPLATE} />
          </Section>
        </div>

        {/* ── QUICK REFERENCE ──────────────────────────────────── */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h2
            className="font-black text-gray-900 text-sm mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Quick Reference — What Goes Where
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-2 text-gray-500 font-bold pr-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Field</th>
                  <th className="text-left pb-2 text-gray-500 font-bold pr-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Where to find it</th>
                  <th className="text-left pb-2 text-gray-500 font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>What to put in it</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { field: 'Course title', where: 'Create course modal', what: 'Full formal course name + year, e.g. "Level 1 Gymnastics Coach — Spring 2026"' },
                  { field: 'Week title', where: 'Week editor → Title field', what: 'Short topic title, e.g. "Introduction to Coaching" or "Technical Skills & Progressions"' },
                  { field: 'Reading content', where: 'Week editor → large text area', what: 'Full week brief — use template above. Plain text, blank lines = paragraph breaks.' },
                  { field: 'Video URL', where: 'Week editor → Video URL field', what: 'YouTube or Vimeo embed URL (share → embed → copy src URL). Leave blank if no video.' },
                  { field: 'Quiz questions', where: 'Week editor → Quiz section → Add Question', what: '4-option MCQs. Mark correct answer by selecting the radio button. Add explanations.' },
                  { field: 'Upload prompt', where: 'Week editor → Upload section', what: 'Tell candidates exactly what to submit: file type, length, content expected.' },
                  { field: 'Assessment notes', where: 'Coach assessment form → Notes field', what: 'Specific, developmental feedback. Minimum 2 sentences. Say what was strong AND what to work on.' },
                ].map((row, i) => (
                  <tr key={i} className="text-gray-700">
                    <td className="py-2 pr-4 font-bold text-gray-900 align-top whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>{row.field}</td>
                    <td className="py-2 pr-4 text-blue-700 align-top whitespace-nowrap">{row.where}</td>
                    <td className="py-2 text-gray-600 align-top leading-relaxed">{row.what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3 flex-wrap">
          <Link
            to="/admin/course-instances"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
          >
            <PlayCircle size={14} />
            Go to Live Courses
          </Link>
          <a
            href="#how"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 border border-gray-200 hover:bg-gray-50"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Back to top
          </a>
        </div>
      </div>
    </Layout>
  )
}
