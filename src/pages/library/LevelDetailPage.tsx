import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { COACHING_LIBRARY } from '../../data/coachingLibrary'
import { ArrowLeft } from 'lucide-react'

type Tab = 'session' | 'skills' | 'notes'

export function LevelDetailPage() {
  const { level } = useParams<{ level: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('session')

  const levelNum = parseInt(level ?? '', 10)
  const data = COACHING_LIBRARY.find(l => l.level === levelNum)

  if (!data) return <Navigate to="/library" replace />

  const textOnColour = data.textColour === 'dark' ? '#0f172a' : '#ffffff'

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/library" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          Coaching Library
        </Link>

        <div
          className="rounded-2xl p-6 sm:p-8 mb-6"
          style={{ backgroundColor: data.colour, color: textOnColour }}
        >
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black border-2 border-white/30"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {data.level}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest opacity-70" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                UKAG Level {data.level}
              </div>
              <h1 className="text-xl sm:text-2xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {data.fullTitle}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs opacity-80">
            <span>{data.ageGroup}</span>
            <span>·</span>
            <span>{data.delivery}</span>
            <span>·</span>
            <span>{data.duration}</span>
          </div>
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 max-w-md">
          {([
            { key: 'session', label: 'Session Plan' },
            { key: 'skills', label: 'Skill Progressions' },
            { key: 'notes', label: 'Coaching Notes' },
          ] as { key: Tab; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
              style={
                activeTab === tab.key
                  ? { backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontFamily: 'Montserrat, sans-serif' }
                  : { color: '#6b7280' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'session' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Session Objectives</h2>
              <ul className="space-y-2">
                {data.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: data.colour + '20', color: data.colour }}>
                      {i + 1}
                    </span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Session Overview</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <th className="px-4 py-3 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>Stage</th>
                      <th className="px-4 py-3 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>Time</th>
                      <th className="px-4 py-3 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>Description</th>
                      <th className="px-4 py-3 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>Coaching Focus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sessionOverview.map((stage, i) => (
                      <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap align-top">{stage.stage}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap align-top">{stage.time}</td>
                        <td className="px-4 py-3 text-gray-700 align-top">{stage.description}</td>
                        <td className="px-4 py-3 text-gray-600 align-top">{stage.coachingFocus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="grid md:grid-cols-2 gap-5">
            {data.apparatusSkills.map(app => (
              <div key={app.apparatus} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>{app.apparatus}</h3>
                <div className="mb-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Core Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {app.coreSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: data.colour + '18', color: data.colour }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>Progression Pathway</div>
                  <p className="text-sm text-gray-700">{app.progressionPathway}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Key Coaching Cues</div>
                  <p className="text-sm text-amber-800 italic">{app.keyCoachingCues}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Teaching Focus</h2>
              <ul className="space-y-2">
                {data.teachingFocus.map((focus, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: data.colour }} />
                    {focus}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Assistant Coach Roles</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <th className="px-4 py-3 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>Area</th>
                      <th className="px-4 py-3 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>Responsibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.assistantCoachRoles.map((role, i) => (
                      <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap align-top">{role.area}</td>
                        <td className="px-4 py-3 text-gray-700 align-top">{role.responsibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Safety Checklist</h2>
              <ul className="space-y-2">
                {data.safetyChecklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 mt-0.5">✅</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Coaching Reminders</h2>
              <ul className="space-y-2">
                {data.coachingReminders.map((reminder, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: data.colour + '20', color: data.colour }}
                    >
                      !
                    </span>
                    {reminder}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
