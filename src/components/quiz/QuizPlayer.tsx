import { useEffect, useState, type ReactElement } from 'react'
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import type { QuizOption } from '../../types'

interface QuestionWithOptions {
  id: string
  lesson_id: string
  question_number: number
  question_text: string
  options: QuizOption[]
}

interface QuizPlayerProps {
  lessonId: string
  passThreshold: number
  isAlreadyComplete: boolean
  onPass: () => void
}

type Phase = 'loading' | 'quiz' | 'result' | 'review'

export function QuizPlayer({ lessonId, passThreshold, isAlreadyComplete, onPass }: QuizPlayerProps): ReactElement {
  const { profile } = useAuth()
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<Phase>('loading')
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadQuestions() }, [lessonId])

  async function loadQuestions() {
    const { data } = await supabase
      .from('quiz_questions')
      .select('*, options:quiz_options(*)')
      .eq('lesson_id', lessonId)
      .order('question_number')

    if (data && data.length > 0) {
      const sorted = (data as QuestionWithOptions[]).map(q => ({
        ...q,
        options: [...(q.options ?? [])].sort((a, b) =>
          a.option_letter.localeCompare(b.option_letter)
        ),
      }))
      setQuestions(sorted)
      setPhase(isAlreadyComplete ? 'result' : 'quiz')
      if (isAlreadyComplete) {
        setPassed(true)
        setScore(sorted.length)
      }
    } else {
      setPhase('quiz')
    }
  }

  function selectAnswer(questionId: string, letter: string) {
    setAnswers(prev => ({ ...prev, [questionId]: letter }))
  }

  async function submitQuiz() {
    if (!profile) return
    setSubmitting(true)

    let correct = 0
    for (const q of questions) {
      const chosen = answers[q.id]
      const correctOpt = q.options.find(o => o.is_correct)
      if (chosen && correctOpt && chosen === correctOpt.option_letter) correct++
    }

    const pct = Math.round((correct / questions.length) * 100)
    const didPass = pct >= passThreshold
    setScore(correct)
    setPassed(didPass)

    await supabase.from('quiz_attempts').insert({
      lesson_id: lessonId,
      profile_id: profile.id,
      score: correct,
      total_questions: questions.length,
      passed: didPass,
      answers,
    })

    if (didPass) {
      const { data: existing } = await supabase
        .from('lesson_completions')
        .select('id')
        .eq('lesson_id', lessonId)
        .eq('profile_id', profile.id)
        .maybeSingle()
      if (!existing) {
        await supabase.from('lesson_completions').insert({
          lesson_id: lessonId,
          profile_id: profile.id,
        })
      }
      onPass()
    }

    setSubmitting(false)
    setPhase('result')
  }

  function retake() {
    setAnswers({})
    setCurrent(0)
    setPhase('quiz')
  }

  // ── Loading ──────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500" />
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 text-sm">
        Quiz questions are being added — check back soon.
      </div>
    )
  }

  // ── Result ───────────────────────────────────────────────────
  if (phase === 'result') {
    const pct = isAlreadyComplete ? 100 : Math.round((score / questions.length) * 100)
    return (
      <div className="p-8 flex flex-col items-center gap-5 text-center">
        {passed ? (
          <Trophy size={52} className="text-amber-400" />
        ) : (
          <XCircle size={52} className="text-red-400" />
        )}
        <div>
          <div className={`text-2xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {isAlreadyComplete ? 'Already Passed!' : `${pct}% — ${passed ? 'Passed!' : 'Not quite…'}`}
          </div>
          {!isAlreadyComplete && (
            <div className="text-gray-500 text-sm mt-1">
              {score} of {questions.length} correct · {passThreshold}% required
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPhase('review')}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Review Answers
          </button>
          {!passed && (
            <button
              onClick={retake}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              <RotateCcw size={14} /> Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Review ───────────────────────────────────────────────────
  if (phase === 'review') {
    return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Answer Review</h3>
          {!passed && (
            <button onClick={retake} className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700">
              <RotateCcw size={14} /> Retake
            </button>
          )}
        </div>
        {questions.map((q, i) => {
          const chosen = answers[q.id]
          const correctOpt = q.options.find(o => o.is_correct)
          const isCorrect = chosen === correctOpt?.option_letter
          return (
            <div key={q.id} className={`rounded-xl border p-4 ${
              isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-start gap-2 mb-3">
                {isCorrect
                  ? <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                  : <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                }
                <p className="text-sm font-medium text-gray-800">{i + 1}. {q.question_text}</p>
              </div>
              <div className="space-y-1.5 pl-6">
                {q.options.map(opt => {
                  const isChosen = chosen === opt.option_letter
                  const isRight = opt.is_correct
                  return (
                    <div key={opt.id} className={`text-sm px-3 py-1.5 rounded-lg ${
                      isRight ? 'bg-green-100 text-green-800 font-medium' :
                      isChosen ? 'bg-red-100 text-red-700 line-through' :
                      'text-gray-500'
                    }`}>
                      {opt.option_letter}. {opt.option_text}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ── Quiz ─────────────────────────────────────────────────────
  const q = questions[current]
  const isLast = current === questions.length - 1
  const allAnswered = questions.every(qq => answers[qq.id])
  const currentAnswer = answers[q.id]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>Question {current + 1} of {questions.length}</span>
        <span>{passThreshold}% to pass</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
        <div
          className="bg-amber-400 h-1.5 rounded-full transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-base font-semibold text-gray-900 mb-4">{q.question_text}</p>

      <div className="space-y-2.5 mb-6">
        {q.options.map(opt => (
          <button
            key={opt.id}
            onClick={() => selectAnswer(q.id, opt.option_letter)}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
              currentAnswer === opt.option_letter
                ? 'border-amber-500 bg-amber-50 text-amber-900 font-medium'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="font-bold mr-2">{opt.option_letter}.</span>{opt.option_text}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrent(c => c - 1)}
          disabled={current === 0}
          className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        {isLast ? (
          <button
            onClick={submitQuiz}
            disabled={!allAnswered || submitting}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
          >
            {submitting ? 'Submitting…' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            onClick={() => setCurrent(c => c + 1)}
            disabled={!currentAnswer}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
