import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { LEADERSHIP_COURSE } from '../../data/leadershipCourse'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react'

type QuizState = 'idle' | 'answered' | 'passed' | 'failed'

export function LeadershipModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const mod = LEADERSHIP_COURSE.modules.find(m => m.id === moduleId)

  const [tab, setTab] = useState<'content' | 'quiz'>('content')
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [quizState, setQuizState] = useState<QuizState>('idle')

  if (!mod) return <Navigate to="/courses/leadership" replace />

  const moduleIndex = LEADERSHIP_COURSE.modules.findIndex(m => m.id === moduleId)
  const prevModule = moduleIndex > 0 ? LEADERSHIP_COURSE.modules[moduleIndex - 1] : null
  const nextModule = moduleIndex < LEADERSHIP_COURSE.modules.length - 1 ? LEADERSHIP_COURSE.modules[moduleIndex + 1] : null

  function startQuiz() {
    setAnswers(new Array(mod!.quiz.length).fill(null))
    setQuizState('idle')
    setTab('quiz')
  }

  function selectAnswer(qi: number, ai: number) {
    if (quizState === 'answered') return
    setAnswers(prev => {
      const next = [...prev]
      next[qi] = ai
      return next
    })
  }

  function submitQuiz() {
    if (!mod) return
    const score = mod.quiz.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)
    setQuizState(score >= mod.passThreshold ? 'passed' : 'failed')
  }

  function retryQuiz() {
    setAnswers(new Array(mod!.quiz.length).fill(null))
    setQuizState('idle')
  }

  const allAnswered = answers.length === mod.quiz.length && answers.every(a => a !== null)

  return (
    <Layout>
      <div className="mb-2">
        <Link to="/courses/leadership" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          Back to course
        </Link>
      </div>

      {/* Module header */}
      <div className={`bg-gradient-to-br ${mod.gradient} rounded-xl p-6 mb-6 flex items-center gap-4`}>
        <span className="text-4xl">{mod.emoji}</span>
        <div>
          <div className="text-xs font-bold text-white/60 uppercase tracking-wide mb-0.5">
            Module {mod.number} of {LEADERSHIP_COURSE.modules.length}
          </div>
          <h1 className="text-xl font-black text-white leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {mod.title}
          </h1>
          <p className="text-sm text-white/80 mt-0.5">{mod.subtitle}</p>
          <div className="flex items-center gap-1.5 text-xs text-white/60 mt-2">
            <Clock size={12} />
            {mod.duration}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab('content')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${tab === 'content' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Content
        </button>
        <button
          onClick={() => setTab('quiz')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${tab === 'quiz' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Quiz
        </button>
      </div>

      {tab === 'content' && (
        <div className="space-y-6">
          {mod.sections.map((section, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {section.heading}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{section.body}</p>
              {section.bullets && (
                <ul className="space-y-2">
                  {section.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2 text-sm text-gray-700">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                        style={{ backgroundColor: '#1e52a4' }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={startQuiz}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              Take the Quiz
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {tab === 'quiz' && (
        <div>
          {quizState === 'passed' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
              <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
              <h2 className="font-black text-green-800 text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Module Complete!
              </h2>
              <p className="text-sm text-green-700">
                You passed with {mod.quiz.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)}/{mod.quiz.length} correct.
              </p>
            </div>
          )}

          {quizState === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
              <XCircle size={40} className="text-red-500 mx-auto mb-3" />
              <h2 className="font-black text-red-800 text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Not quite — try again
              </h2>
              <p className="text-sm text-red-700 mb-4">
                You scored {mod.quiz.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)}/{mod.quiz.length}. You need {mod.passThreshold} to pass.
              </p>
              <button
                onClick={retryQuiz}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
              >
                Retry Quiz
              </button>
            </div>
          )}

          <div className="space-y-6">
            {mod.quiz.map((q, qi) => {
              const chosen = answers[qi] ?? null
              const isAnswered = quizState === 'passed' || quizState === 'failed'

              return (
                <div key={qi} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 text-white"
                      style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {qi + 1}
                    </span>
                    <p className="text-sm font-bold text-gray-900">{q.question}</p>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, ai) => {
                      let style = 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
                      if (chosen === ai && !isAnswered) style = 'border-[#1e52a4] bg-[#1e52a4]/10 text-[#1e52a4]'
                      if (isAnswered && ai === q.correct) style = 'border-green-400 bg-green-50 text-green-800'
                      else if (isAnswered && chosen === ai && ai !== q.correct) style = 'border-red-400 bg-red-50 text-red-800'

                      return (
                        <button
                          key={ai}
                          onClick={() => selectAnswer(qi, ai)}
                          disabled={isAnswered}
                          className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${style} disabled:cursor-default`}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>

                  {isAnswered && (
                    <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
                      <span className="font-bold text-gray-700">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {quizState === 'idle' && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={submitQuiz}
                disabled={!allAnswered}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
              >
                Submit Answers
              </button>
            </div>
          )}
        </div>
      )}

      {/* Module navigation */}
      <div className="mt-8 flex justify-between gap-4">
        {prevModule ? (
          <Link
            to={`/courses/leadership/${prevModule.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            onClick={() => { setTab('content'); setQuizState('idle'); setAnswers([]) }}
          >
            <ArrowLeft size={14} />
            {prevModule.title}
          </Link>
        ) : <div />}

        {nextModule ? (
          <Link
            to={`/courses/leadership/${nextModule.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            onClick={() => { setTab('content'); setQuizState('idle'); setAnswers([]) }}
          >
            {nextModule.title}
            <ArrowRight size={14} />
          </Link>
        ) : (
          <Link
            to="/courses/leadership"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: '#22c55e', fontFamily: 'Montserrat, sans-serif' }}
          >
            Finish Course
            <CheckCircle size={14} />
          </Link>
        )}
      </div>
    </Layout>
  )
}
