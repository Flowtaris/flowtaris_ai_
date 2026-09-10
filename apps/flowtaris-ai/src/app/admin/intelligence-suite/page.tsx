'use client'

import { useEffect, useState } from 'react'
import {
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  Zap, BarChart2, TrendingDown, FlaskConical, Layout, BarChart3, Trash2, Plus
} from 'lucide-react'

// ── Shared primitives ─────────────────────────────────────────────────────────

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
    {children}
  </label>
)

const TextInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input
    type="text"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-sm
      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
      focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400
      placeholder-gray-400 transition-all"
  />
)

const Textarea = ({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-sm
      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y
      focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400
      placeholder-gray-400 transition-all"
  />
)

// ── Collapsible Section Wrapper ───────────────────────────────────────────────

function Section({
  title, description, icon: Icon, color = 'blue', defaultOpen = true, children,
}: {
  title: string; description: string; icon: React.ElementType; color?: string; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const borderMap: Record<string, string> = {
    blue: 'border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/10',
    amber: 'border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/10',
    rose: 'border-rose-200 dark:border-rose-800/40 bg-rose-50/50 dark:bg-rose-900/10',
    violet: 'border-violet-200 dark:border-violet-800/40 bg-violet-50/50 dark:bg-violet-900/10',
    indigo: 'border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/50 dark:bg-indigo-900/10',
  }
  const iconMap: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-100 dark:bg-blue-800/30',
    amber: 'text-amber-500 bg-amber-100 dark:bg-amber-800/30',
    rose: 'text-rose-500 bg-rose-100 dark:bg-rose-800/30',
    violet: 'text-violet-500 bg-violet-100 dark:bg-violet-800/30',
    indigo: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-800/30',
  }

  return (
    <div className={`rounded-2xl border ${borderMap[color] || borderMap.blue} mb-5 overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconMap[color] || iconMap.blue}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-white/50 dark:border-white/5 pt-5">{children}</div>}
    </div>
  )
}

// ── Default Data ──────────────────────────────────────────────────────────────

const DEFAULT_TOOLS = [
  {
    id: 'assessment', tab: 'AI Readiness Score',
    tagline: 'AI Readiness Assessment', ctaLabel: 'Take the Assessment', ctaHref: '/assessment',
    headline: '6 questions. Your personalized AI roadmap.',
    description: 'Answer 6 questions about your ERP stack, pain points, and team — receive a scored roadmap categorising your highest-ROI opportunities into Quick Wins, Strategic plays, and Innovation bets.',
    metrics: [
      { v: '~4 min', l: 'Completion' }, { v: '6', l: 'Steps' },
      { v: '3', l: 'Score Tiers' }, { v: 'Free', l: 'Cost' },
    ],
  },
  {
    id: 'roi', tab: 'ROI Calculator',
    tagline: 'Enterprise ROI Calculator', ctaLabel: 'Calculate My ROI', ctaHref: '/roi-calculator',
    headline: 'Drag a slider. Watch $4.5M appear in real-time.',
    description: 'Enter your invoice volume, team size, and error rate. Our engine outputs annual savings, payback period, FTE freed, and 3-year NPV across 15 global currencies and 5 ERP platforms.',
    metrics: [
      { v: '15', l: 'Currencies' }, { v: '5', l: 'ERP Platforms' },
      { v: '$4.5M', l: 'Avg Savings' }, { v: '3 mo', l: 'Avg Payback' },
    ],
  },
  {
    id: 'inaction', tab: 'Cost of Waiting',
    tagline: 'Cost of Inaction Engine', ctaLabel: 'Calculate My Delay Cost', ctaHref: '/cost-of-inaction',
    headline: 'Every day of delay costs money. See yours live.',
    description: 'Built for CFOs and board decks. Calculates monthly revenue leakage, compliance risk exposure, 3-year competitive gap, and the cost of a 6-month delay — in your local currency.',
    metrics: [
      { v: 'Live', l: 'Leakage Calc' }, { v: 'Quantified', l: 'Compliance' },
      { v: 'Included', l: '3-Yr Model' }, { v: 'Board PDF', l: 'Output' },
    ],
  },
  {
    id: 'lab', tab: 'Innovation Lab',
    tagline: 'Flowtaris Innovation Lab', ctaLabel: 'Explore the Lab', ctaHref: '/innovation-lab',
    headline: 'Where R&D becomes your competitive edge.',
    description: '6 active research tracks — from Conversational ERP at 92% NL-to-SQL accuracy to GenAI Document Understanding at 99.5%+ to Agentic Workflow Orchestration. Battle-tested before reaching your ERP.',
    metrics: [
      { v: '6 active', l: 'Research Tracks' }, { v: '99.5%+', l: 'Doc AI' },
      { v: '15+', l: 'Languages' }, { v: '78%', l: 'Agentic' },
    ],
  },
]

const DEFAULT_HEADER = {
  eyebrow: 'The Flowtaris Intelligence Suite',
  headline_1: 'Stop guessing.',
  headline_2: 'Start calculating.',
  description: "Four enterprise-grade tools — built on real benchmarks — that prove AI's financial impact before you sign a contract.",
}

const TOOL_ICONS = [Zap, BarChart2, TrendingDown, FlaskConical]
const TOOL_COLORS = ['blue', 'amber', 'rose', 'violet']

const DEFAULT_STATS = [
  { v: '$4.5M', l: 'Avg Annual Savings' },
  { v: '3 mo',  l: 'Avg Payback Period' },
  { v: '99.5%', l: 'Document AI Accuracy' },
  { v: '6',     l: 'Live R&D Tracks' },
  { v: '15+',   l: 'Languages Supported' },
  { v: 'Free',  l: 'All Tools, No Signup' },
]

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function IntelligenceSuiteConfigPage() {
  const [header, setHeader] = useState(DEFAULT_HEADER)
  const [tools, setTools] = useState(DEFAULT_TOOLS)
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg?.intelligenceSuiteConfig) {
          const saved = cfg.intelligenceSuiteConfig
          if (saved.header) setHeader(prev => ({ ...prev, ...saved.header }))
          if (saved.tools && Array.isArray(saved.tools)) {
            setTools(prev => prev.map((t, i) => ({
              ...t,
              ...(saved.tools[i] || {}),
              metrics: saved.tools[i]?.metrics || t.metrics,
            })))
          }
          if (saved.stats && Array.isArray(saved.stats)) {
            setStats(saved.stats)
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updateTool = (index: number, field: string, value: string) => {
    setTools(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const updateMetric = (toolIndex: number, metricIndex: number, field: 'v' | 'l', value: string) => {
    setTools(prev => {
      const next = [...prev]
      const metrics = [...next[toolIndex].metrics]
      metrics[metricIndex] = { ...metrics[metricIndex], [field]: value }
      next[toolIndex] = { ...next[toolIndex], metrics }
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setStatus(null)
    try {
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intelligence_suite_config: { header, tools, stats } }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setStatus({ type: 'success', msg: 'Intelligence Suite configuration saved! Changes go live in ~60 seconds.' })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Save failed'
      setStatus({ type: 'error', msg })
    } finally {
      setSaving(false)
      setTimeout(() => setStatus(null), 5000)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <span>Loading Intelligence Suite configuration…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-50">Intelligence Suite Config</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 pl-13">
          Manage the &ldquo;Stop guessing. Start calculating.&rdquo; section — section headline and all 4 tool tabs.
        </p>
      </div>

      {/* Status Banner */}
      {status && (
        <div className={`mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border ${
          status.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300'
        }`}>
          {status.type === 'success'
            ? <CheckCircle2 className="w-4 h-4 shrink-0" />
            : <AlertCircle className="w-4 h-4 shrink-0" />}
          {status.msg}
        </div>
      )}

      <form onSubmit={e => { e.preventDefault(); handleSave() }}>

        {/* 1. Section Header */}
        <Section title="Section Header" description="The headline displayed above the 4 tabs." icon={Layout} color="indigo" defaultOpen>
          <div className="space-y-4">
            <div>
              <Label>Eyebrow Label (small pill text above headline)</Label>
              <TextInput value={header.eyebrow} onChange={v => setHeader(p => ({ ...p, eyebrow: v }))} placeholder="The Flowtaris Intelligence Suite" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Headline — Line 1 (white text)</Label>
                <TextInput value={header.headline_1} onChange={v => setHeader(p => ({ ...p, headline_1: v }))} placeholder="Stop guessing." />
              </div>
              <div>
                <Label>Headline — Line 2 (gradient colour)</Label>
                <TextInput value={header.headline_2} onChange={v => setHeader(p => ({ ...p, headline_2: v }))} placeholder="Start calculating." />
              </div>
            </div>
            <div>
              <Label>Sub-description</Label>
              <Textarea value={header.description} onChange={v => setHeader(p => ({ ...p, description: v }))} rows={2} />
            </div>
          </div>
        </Section>

        {/* 2–5. One collapsible per tool tab */}
        {tools.map((tool, i) => {
          const Icon = TOOL_ICONS[i]
          const color = TOOL_COLORS[i]
          return (
            <Section
              key={tool.id}
              title={`Tab ${i + 1}: ${tool.tab}`}
              description={`Content shown when the "${tool.tab}" tab is active.`}
              icon={Icon}
              color={color}
              defaultOpen={i === 0}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tab Label (the pill button label)</Label>
                    <TextInput value={tool.tab} onChange={v => updateTool(i, 'tab', v)} />
                  </div>
                  <div>
                    <Label>Badge / Tagline</Label>
                    <TextInput value={tool.tagline} onChange={v => updateTool(i, 'tagline', v)} />
                  </div>
                </div>

                <div>
                  <Label>Headline</Label>
                  <TextInput value={tool.headline} onChange={v => updateTool(i, 'headline', v)} />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea value={tool.description} onChange={v => updateTool(i, 'description', v)} rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>CTA Button Label</Label>
                    <TextInput value={tool.ctaLabel} onChange={v => updateTool(i, 'ctaLabel', v)} />
                  </div>
                  <div>
                    <Label>CTA Button URL</Label>
                    <TextInput value={tool.ctaHref} onChange={v => updateTool(i, 'ctaHref', v)} placeholder="/assessment" />
                  </div>
                </div>

                <div>
                  <Label>4 Metric Boxes</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {tool.metrics.map((m, mi) => (
                      <div key={mi} className="flex gap-2 bg-gray-50/60 dark:bg-gray-800/30 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                        <div className="flex-1">
                          <Label>Value</Label>
                          <TextInput value={m.v} onChange={v => updateMetric(i, mi, 'v', v)} placeholder="~4 min" />
                        </div>
                        <div className="flex-1">
                          <Label>Label</Label>
                          <TextInput value={m.l} onChange={v => updateMetric(i, mi, 'l', v)} placeholder="Completion" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          )
        })}

        {/* Bottom Stats Section */}
        <Section title="Bottom Stats Bar" description="The 6 headline numbers displayed at the very bottom of the section." icon={BarChart3} color="indigo" defaultOpen={false}>
          <div className="space-y-3">
            {stats.map((s, i) => (
              <div key={i} className="flex gap-3 items-end bg-gray-50/60 dark:bg-gray-800/30 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                <div className="flex-1">
                  <Label>Value</Label>
                  <TextInput value={s.v} onChange={v => setStats(prev => { const n = [...prev]; n[i] = { ...n[i], v }; return n })} placeholder="$4.5M" />
                </div>
                <div className="flex-1">
                  <Label>Label</Label>
                  <TextInput value={s.l} onChange={v => setStats(prev => { const n = [...prev]; n[i] = { ...n[i], l: v }; return n })} placeholder="Avg Annual Savings" />
                </div>
                <button type="button" onClick={() => setStats(prev => prev.filter((_, idx) => idx !== i))} className="p-2 mb-0.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setStats(prev => [...prev, { v: 'New', l: 'Stat Label' }])}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Stat
            </button>
          </div>
        </Section>

        {/* Sticky Save Button */}
        <div className="sticky bottom-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4 mt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">Changes go live within ~60 seconds after cache revalidation.</p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-60"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Save Configuration
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
