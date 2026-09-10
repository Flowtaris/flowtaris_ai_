'use client'

import { useEffect, useState } from 'react'
import {
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Plus, Trash2,
  Sparkles, Layers, Sliders, Database, Gauge, HelpCircle, Mail,
  ArrowRight, Shield, Zap, TrendingUp, DollarSign
} from 'lucide-react'

// ── Shared UI Primitives ──────────────────────────────────────────────────────

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
    {children}
  </label>
)

const Field = ({ label, id, children, hint }: { label: string; id?: string; children: React.ReactNode; hint?: string }) => (
  <div className="mb-4">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{hint}</p>}
  </div>
)

const TextInput = ({
  id, value, onChange, placeholder, disabled,
}: { id?: string; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean }) => (
  <input
    id={id}
    type="text"
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5
      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
      placeholder-gray-400 disabled:opacity-50 transition-all"
  />
)

const NumberInput = ({
  id, value, onChange, min = 0, step = 1, placeholder,
}: { id?: string; value: number; onChange: (v: number) => void; min?: number; step?: number; placeholder?: string }) => (
  <input
    id={id}
    type="number"
    value={isNaN(value) ? '' : value}
    onChange={e => onChange(parseFloat(e.target.value) || 0)}
    min={min}
    step={step}
    placeholder={placeholder}
    className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5
      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
      placeholder-gray-400 transition-all"
  />
)

const TextArea = ({
  id, value, onChange, rows = 3, placeholder,
}: { id?: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) => (
  <textarea
    id={id}
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    rows={rows}
    placeholder={placeholder}
    className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5
      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y
      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
      placeholder-gray-400 transition-all"
  />
)

// ── Collapsible Section Wrapper ───────────────────────────────────────────────

function Section({
  title, description, icon: Icon, color = 'blue', defaultOpen = true, children,
}: {
  title: string; description: string; icon: React.ElementType; color?: 'blue' | 'indigo' | 'emerald' | 'purple' | 'amber' | 'slate'; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const colors = {
    blue: 'border-blue-200 dark:border-blue-800/40 bg-blue-50/30 dark:bg-blue-900/10',
    indigo: 'border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/30 dark:bg-indigo-900/10',
    emerald: 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/30 dark:bg-emerald-900/10',
    purple: 'border-purple-200 dark:border-purple-800/40 bg-purple-50/30 dark:bg-purple-900/10',
    amber: 'border-amber-200 dark:border-amber-800/40 bg-amber-50/30 dark:bg-amber-900/10',
    slate: 'border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30',
  }
  const iconColors = {
    blue: 'text-blue-500',
    indigo: 'text-indigo-500',
    emerald: 'text-emerald-500',
    purple: 'text-purple-500',
    amber: 'text-amber-500',
    slate: 'text-gray-500'
  }

  return (
    <div className={`rounded-2xl border ${colors[color]} mb-6 overflow-hidden shadow-sm transition-all`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            color === 'blue' ? 'bg-blue-100 dark:bg-blue-800/30' :
            color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-800/30' :
            color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-800/30' :
            color === 'purple' ? 'bg-purple-100 dark:bg-purple-800/30' :
            color === 'amber' ? 'bg-amber-100 dark:bg-amber-800/30' :
            'bg-gray-200 dark:bg-gray-700'
          }`}>
            <Icon className={`w-4 h-4 ${iconColors[color]}`} />
          </div>
          <div>
            <p className="text-base font-bold text-gray-800 dark:text-gray-100">{title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Default Assessment Data Structure ─────────────────────────────────────────

export interface AssessmentConfigData {
  intro: {
    eyebrowBadge: string
    heading: string
    description: string
    walkawayTitle: string
    walkawayDeliverables: Array<{ id: string; number: string; title: string; body: string }>
    ctaButtonText: string
    confidentialityNote: string
  }
  step1Erp: {
    stepEyebrow: string
    stepTitle: string
    stepSubtitle: string
    erpList: Array<{ value: string; abbr: string; label: string; sub: string; accent: string }>
  }
  step2Pain: {
    stepEyebrow: string
    stepTitle: string
    stepSubtitle: string
    maxSelections: number
    painList: Array<{ value: string; label: string; detail: string; metric: string; unit: string; severity: number; color: string }>
  }
  step3Volume: {
    stepEyebrow: string
    stepTitle: string
    stepSubtitle: string
    benchmarks: {
      invoiceCostRate: number
      transactionCostRate: number
      savingsMultiplier: number
      invoicesBenchText: string
      employeesBenchText: string
      transactionsBenchText: string
      poLinesBenchText: string
    }
  }
  step4State: {
    stepEyebrow: string
    stepTitle: string
    stepSubtitle: string
    stateList: Array<{ value: string; label: string; tag: string; level: number }>
  }
  step5Maturity: {
    stepEyebrow: string
    stepTitle: string
    stepSubtitle: string
    maturityList: Array<{ value: string; label: string; tag: string; year: string }>
  }
  step6Urgency: {
    stepEyebrow: string
    stepTitle: string
    stepSubtitle: string
    urgencyList: Array<{ value: string; label: string; tag: string; signal: string; signalColor: string; priority: number }>
  }
  tourAndResults: {
    tourSteps: Array<{ target: string; text: string }>
    assessmentCompleteLabel: string
    resultsHeading: string
    resultsSubtitle: string
    scoreLabel: string
    estSavingsLabel: string
    perYearLabel: string
    kpiOpportunitiesLabel: string
    kpiOpportunitiesUnit: string
    kpiQuickWinsLabel: string
    kpiQuickWinsUnit: string
    kpiFastestPaybackLabel: string
    kpiFastestPaybackUnit: string
    kpiProfileLabel: string
    kpiProfileUnit: string
    catQuickWinLabel: string
    catQuickWinSub: string
    catStrategicLabel: string
    catStrategicSub: string
    catInnovationLabel: string
    catInnovationSub: string
    emailCaptureHeadline: string
    emailCaptureDescription: string
    emailCaptureButtonText: string
    ctaRoiTitle: string
    ctaRoiSubtitle: string
    ctaContactTitle: string
    ctaContactSubtitle: string
  }
}

export const DEFAULT_ASSESSMENT_CONFIG: AssessmentConfigData = {
  intro: {
    eyebrowBadge: '• FREE · TAKES ~3 MINUTES · NO CARD REQUIRED',
    heading: 'Find out what your finance team is leaving on the table',
    description: 'Answer 6 questions about your current setup and we will give you a specific, quantified breakdown of where you are losing money — and what it would take to fix it. No generic playbooks, no sales pitch disguised as content.',
    walkawayTitle: 'What you walk away with',
    walkawayDeliverables: [
      { id: '1', number: '01', title: 'Your AI Readiness Score', body: 'A 0–100 score built from 6 dimensions of your finance operation, benchmarked against peers at your scale.' },
      { id: '2', number: '02', title: 'A dollar figure on your inefficiency', body: 'We calculate your estimated annual bleed based on invoice volume, team size, and error rates — not ballpark guesses.' },
      { id: '3', number: '03', title: 'A sequenced action plan', body: 'Quick wins you can start this quarter, plus the longer-term strategic moves that compound over 12–18 months.' },
    ],
    ctaButtonText: 'Begin Assessment',
    confidentialityNote: 'Your answers are never sold or shared. We use them only to generate your report.',
  },
  step1Erp: {
    stepEyebrow: 'Step 1 of 6 · ERP Platform',
    stepTitle: 'Which system runs your finance operation?',
    stepSubtitle: 'We tailor every recommendation to your specific ERP. Different platforms have different automation ceilings — this matters.',
    erpList: [
      { value: 'NetSuite', abbr: 'NS', label: 'Oracle NetSuite', sub: 'Cloud ERP', accent: '#0ea5e9' },
      { value: 'SAP', abbr: 'SAP', label: 'SAP S/4HANA', sub: 'Hybrid ERP', accent: '#6366f1' },
      { value: 'Coupa', abbr: 'CPA', label: 'Coupa BSM', sub: 'Procurement', accent: '#f97316' },
      { value: 'Workday', abbr: 'WD', label: 'Workday Finance', sub: 'HCM & Finance', accent: '#22c55e' },
      { value: 'Multiple', abbr: '2+', label: 'Multiple Systems', sub: 'Multi-platform', accent: '#a855f7' },
    ]
  },
  step2Pain: {
    stepEyebrow: 'Step 2 of 6 · Pain Points',
    stepTitle: 'Where does your team feel the most friction?',
    stepSubtitle: 'Pick up to 3. Be honest — the cost estimates next to each one are real industry benchmarks.',
    maxSelections: 3,
    painList: [
      { value: 'Manual data entry', label: 'Manual Invoice Processing', detail: 'Teams spending hours on data entry that should take seconds', metric: '$14.20', unit: '/ invoice', severity: 92, color: '#ef4444' },
      { value: 'Invoice processing delays', label: 'Cash Flow Blind Spots', detail: 'No real-time view of cash position or receivables aging', metric: '11 days', unit: 'avg DSO gap', severity: 78, color: '#f59e0b' },
      { value: 'Integration Failures', label: 'Integration Failures', detail: 'Systems that don\'t talk to each other, causing manual reconciliation', metric: '4.3 hrs', unit: 'downtime/mo', severity: 84, color: '#f97316' },
      { value: 'Compliance risks', label: 'Compliance & Audit Risk', detail: 'Manual controls create gaps that auditors flag every cycle', metric: '$82K', unit: 'avg fine risk', severity: 89, color: '#ef4444' },
      { value: 'Slow decision making', label: 'Slow Financial Close', detail: 'Month-end taking 7+ days instead of under 3', metric: '7.5 days', unit: 'avg cycle', severity: 71, color: '#eab308' },
      { value: 'High error rates', label: 'Error Rates & Disputes', detail: 'Vendor disputes and payment errors eating into relationships', metric: '4.8%', unit: 'error rate', severity: 76, color: '#ef4444' },
    ]
  },
  step3Volume: {
    stepEyebrow: 'Step 3 of 6 · Volume',
    stepTitle: 'Give us a rough sense of scale',
    stepSubtitle: 'Rough numbers are completely fine. We use these to calculate your actual dollar exposure, not to judge you.',
    benchmarks: {
      invoiceCostRate: 14.20,
      transactionCostRate: 3.50,
      savingsMultiplier: 0.78,
      invoicesBenchText: 'Industry avg: $14.20 per invoice manual',
      employeesBenchText: 'Fully-loaded ~$72K/yr per person',
      transactionsBenchText: 'Industry avg: $3.50 per transaction',
      poLinesBenchText: '~8 min of manual work per line',
    }
  },
  step4State: {
    stepEyebrow: 'Step 4 of 6 · Current State',
    stepTitle: 'How does finance actually work at your company today?',
    stepSubtitle: 'This tells us your automation ceiling — how much room there is to improve, and how fast.',
    stateList: [
      { value: 'Manual', label: 'Fully Manual', tag: 'Spreadsheets, email, and paper trails', level: 1 },
      { value: 'Partial', label: 'Some Automation', tag: 'Basic OCR or RPA, still lots of exceptions', level: 2 },
      { value: 'iPaaS', label: 'Middleware Connected', tag: 'MuleSoft, Boomi, Celigo in play', level: 3 },
      { value: 'Custom', label: 'Custom-Built Logic', tag: 'Internal scripts and automation tooling', level: 3 },
      { value: "Don't know", label: "Honestly not sure", tag: "Mixed bag, varies by team", level: 0 },
    ]
  },
  step5Maturity: {
    stepEyebrow: 'Step 5 of 6 · Tech Maturity',
    stepTitle: 'How would you describe your underlying tech stack?',
    stepSubtitle: 'Older infrastructure doesn\'t disqualify you — it just shapes how we\'d phase the work and what we\'d tackle first.',
    maturityList: [
      { value: 'Legacy', label: 'Legacy Core', tag: 'On-premise, pre-2018 ERP landscape', year: 'Pre-2018' },
      { value: 'Hybrid', label: 'Hybrid Mix', tag: 'Some cloud, some legacy, not fully committed', year: '2018–2022' },
      { value: 'Modern', label: 'Cloud-First', tag: 'SaaS-first, API-driven, modern stack', year: '2022+' },
      { value: 'AI Pilot', label: 'Already Running AI', tag: 'Active ML pilots or production AI in finance', year: 'Now' },
    ]
  },
  step6Urgency: {
    stepEyebrow: 'Step 6 of 6 · Timeline',
    stepTitle: 'What\'s driving the timing on this?',
    stepSubtitle: 'This changes how we structure your roadmap — internal exploring looks very different from an audit deadline.',
    urgencyList: [
      { value: 'Exploring', label: 'Just researching', tag: 'No deadline, building internal awareness', signal: 'LOW', signalColor: '#64748b', priority: 1 },
      { value: 'Budget Approved', label: 'Budget is approved', tag: 'We have funding, now need the right partner', signal: 'MED', signalColor: '#3b82f6', priority: 2 },
      { value: 'Audit-Driven', label: 'Audit or regulatory deadline', tag: 'External compliance is forcing our hand', signal: 'HIGH', signalColor: '#f59e0b', priority: 3 },
      { value: 'Board Mandate', label: 'Board or executive mandate', tag: 'Leadership has made this a company priority', signal: 'CRIT', signalColor: '#ef4444', priority: 4 },
    ]
  },
  tourAndResults: {
    tourSteps: [
      { target: 'erp-section', text: 'Pick your ERP — we use this to calibrate every recommendation to your actual platform constraints.' },
      { target: 'pain-section', text: 'Select your top pain points. We\'ll show industry cost benchmarks next to each one.' },
      { target: 'sidebar-score', text: 'Your AI Readiness Score updates live as you answer. It\'s based on real finance benchmarks.' },
    ],
    assessmentCompleteLabel: 'Assessment complete',
    resultsHeading: 'Your roadmap is ready.',
    resultsSubtitle: 'Based on your inputs, our engine has generated this customized, sequenced action plan. Here is exactly what you should build, in what order, and the financial impact it will have.',
    scoreLabel: 'Score',
    estSavingsLabel: 'Est. savings',
    perYearLabel: 'per year',
    kpiOpportunitiesLabel: 'Opportunities',
    kpiOpportunitiesUnit: 'found',
    kpiQuickWinsLabel: 'Quick Wins',
    kpiQuickWinsUnit: 'this quarter',
    kpiFastestPaybackLabel: 'Fastest Payback',
    kpiFastestPaybackUnit: 'to value',
    kpiProfileLabel: 'Profile',
    kpiProfileUnit: 'tier',
    catQuickWinLabel: 'Quick Wins',
    catQuickWinSub: '0–3 months',
    catStrategicLabel: 'Strategic',
    catStrategicSub: '3–9 months',
    catInnovationLabel: 'Innovation',
    catInnovationSub: '9–18 months',
    emailCaptureHeadline: 'Get the full report in your inbox',
    emailCaptureDescription: 'We\'ll send a PDF with implementation steps, CFO talking points, and comparable customer outcomes. No spam.',
    emailCaptureButtonText: 'Send my complete roadmap',
    ctaRoiTitle: 'Full ROI Calculator',
    ctaRoiSubtitle: 'Build a 3-year financial model',
    ctaContactTitle: 'Talk to the team',
    ctaContactSubtitle: '30-min call with a solutions engineer',
  }
}

// ── Admin Assessment Config Page Component ───────────────────────────────────

export default function AdminAssessmentConfigPage() {
  const [data, setData] = useState<AssessmentConfigData>(DEFAULT_ASSESSMENT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true)
        const res = await fetch('/api/site-config')
        if (res.ok) {
          const cfg = await res.json()
          if (cfg?.assessmentConfig) {
            setData({
              intro: { ...DEFAULT_ASSESSMENT_CONFIG.intro, ...cfg.assessmentConfig.intro },
              step1Erp: { ...DEFAULT_ASSESSMENT_CONFIG.step1Erp, ...cfg.assessmentConfig.step1Erp },
              step2Pain: { ...DEFAULT_ASSESSMENT_CONFIG.step2Pain, ...cfg.assessmentConfig.step2Pain },
              step3Volume: { ...DEFAULT_ASSESSMENT_CONFIG.step3Volume, ...cfg.assessmentConfig.step3Volume, benchmarks: { ...DEFAULT_ASSESSMENT_CONFIG.step3Volume.benchmarks, ...cfg.assessmentConfig.step3Volume?.benchmarks } },
              step4State: { ...DEFAULT_ASSESSMENT_CONFIG.step4State, ...cfg.assessmentConfig.step4State },
              step5Maturity: { ...DEFAULT_ASSESSMENT_CONFIG.step5Maturity, ...cfg.assessmentConfig.step5Maturity },
              step6Urgency: { ...DEFAULT_ASSESSMENT_CONFIG.step6Urgency, ...cfg.assessmentConfig.step6Urgency },
              tourAndResults: { ...DEFAULT_ASSESSMENT_CONFIG.tourAndResults, ...cfg.assessmentConfig.tourAndResults },
            })
          }
        }
      } catch (err) {
        console.error('Failed to load assessment config:', err)
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    setSaveStatus(null)

    try {
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment_config: data }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save configuration')

      setSaveStatus({ type: 'success', message: 'Assessment configuration saved successfully! Live site is updated.' })
      setTimeout(() => setSaveStatus(null), 5000)
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: err.message || 'Error saving configuration' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading Assessment Configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              Interactive Diagnostic Tool
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Gauge className="w-7 h-7 text-blue-500" />
            Assessment Configuration
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Customize the public AI Readiness Diagnostic wizard (<a href="/assessment" target="_blank" className="text-blue-600 underline font-medium hover:text-blue-700">/assessment</a>), diagnostic steps, benchmarks, and email lead capture.
          </p>
        </div>
      </div>

      {/* Save Notification */}
      {saveStatus && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border transition-all ${
          saveStatus.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300'
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800/60 dark:text-red-300'
        }`}>
          {saveStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          )}
          <span className="text-sm font-semibold">{saveStatus.message}</span>
        </div>
      )}

      {/* ── SECTION 1: INTRO & DELIVERABLES ──────────────────────────────────── */}
      <Section
        title="Step 0: Intro & Deliverables"
        description="Landing screen copy, top badge, primary headline, 3 walk-away deliverables, and confidentiality note."
        icon={Sparkles}
        color="blue"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Eyebrow Badge" hint="Badge text shown at the very top of the intro page">
              <TextInput
                value={data.intro.eyebrowBadge}
                onChange={v => setData(d => ({ ...d, intro: { ...d.intro, eyebrowBadge: v } }))}
                placeholder="• FREE · TAKES ~3 MINUTES · NO CARD REQUIRED"
              />
            </Field>

            <Field label="Primary CTA Button Label" hint="Action button to start diagnostic">
              <TextInput
                value={data.intro.ctaButtonText}
                onChange={v => setData(d => ({ ...d, intro: { ...d.intro, ctaButtonText: v } }))}
                placeholder="Begin Assessment"
              />
            </Field>
          </div>

          <Field label="Main Headline (H1)" hint="High-impact hook for finance executives">
            <TextInput
              value={data.intro.heading}
              onChange={v => setData(d => ({ ...d, intro: { ...d.intro, heading: v } }))}
              placeholder="Find out what your finance team is leaving on the table"
            />
          </Field>

          <Field label="Intro Description Paragraph" hint="Explains what the assessment calculates">
            <TextArea
              rows={3}
              value={data.intro.description}
              onChange={v => setData(d => ({ ...d, intro: { ...d.intro, description: v } }))}
              placeholder="Answer 6 questions about your current setup..."
            />
          </Field>

          <Field label="Confidentiality Note" hint="Displayed next to the CTA button">
            <TextInput
              value={data.intro.confidentialityNote}
              onChange={v => setData(d => ({ ...d, intro: { ...d.intro, confidentialityNote: v } }))}
              placeholder="Your answers are never sold or shared. We use them only to generate your report."
            />
          </Field>

          {/* Walkaway Deliverables List */}
          <div className="mt-6 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <Label>What You Walk Away With (3 Deliverables)</Label>
                <p className="text-[11px] text-gray-400">Highlighted value points shown to encourage completion.</p>
              </div>
            </div>

            <div className="space-y-3">
              {data.intro.walkawayDeliverables.map((item, idx) => (
                <div key={item.id || idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-mono font-black text-xs flex items-center justify-center">
                      {item.number || `0${idx + 1}`}
                    </div>
                    <div className="flex-1">
                      <TextInput
                        value={item.title}
                        onChange={v => {
                          const list = [...data.intro.walkawayDeliverables]
                          list[idx] = { ...list[idx], title: v }
                          setData(d => ({ ...d, intro: { ...d.intro, walkawayDeliverables: list } }))
                        }}
                        placeholder="Deliverable Title"
                      />
                    </div>
                  </div>
                  <TextArea
                    rows={2}
                    value={item.body}
                    onChange={v => {
                      const list = [...data.intro.walkawayDeliverables]
                      list[idx] = { ...list[idx], body: v }
                      setData(d => ({ ...d, intro: { ...d.intro, walkawayDeliverables: list } }))
                    }}
                    placeholder="Deliverable explanation text..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 2: STEP 1 - ERP PLATFORMS ────────────────────────────────── */}
      <Section
        title="Step 1: ERP Platforms"
        description="Configure the primary enterprise ERP options, abbreviations, sublabels, and brand accents."
        icon={Database}
        color="indigo"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Step Eyebrow Title">
              <TextInput
                value={data.step1Erp.stepEyebrow}
                onChange={v => setData(d => ({ ...d, step1Erp: { ...d.step1Erp, stepEyebrow: v } }))}
                placeholder="Step 1 of 6 · ERP Platform"
              />
            </Field>

            <Field label="Question Heading">
              <TextInput
                value={data.step1Erp.stepTitle}
                onChange={v => setData(d => ({ ...d, step1Erp: { ...d.step1Erp, stepTitle: v } }))}
                placeholder="Which system runs your finance operation?"
              />
            </Field>
          </div>

          <Field label="Question Subtitle">
            <TextInput
              value={data.step1Erp.stepSubtitle}
              onChange={v => setData(d => ({ ...d, step1Erp: { ...d.step1Erp, stepSubtitle: v } }))}
              placeholder="We tailor every recommendation to your specific ERP..."
            />
          </Field>

          {/* ERP Cards List */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Supported ERP Platforms</Label>
              <button
                type="button"
                onClick={() => {
                  const newErp = { value: 'Custom', abbr: 'ERP', label: 'Custom System', sub: 'Custom ERP', accent: '#3b82f6' }
                  setData(d => ({ ...d, step1Erp: { ...d.step1Erp, erpList: [...d.step1Erp.erpList, newErp] } }))
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add ERP
              </button>
            </div>

            <div className="space-y-3">
              {data.step1Erp.erpList.map((erp, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-black text-white"
                      style={{ background: erp.accent || '#3b82f6' }}
                    >
                      {erp.abbr}
                    </div>
                    <TextInput
                      value={erp.abbr}
                      onChange={v => {
                        const list = [...data.step1Erp.erpList]
                        list[idx] = { ...list[idx], abbr: v }
                        setData(d => ({ ...d, step1Erp: { ...d.step1Erp, erpList: list } }))
                      }}
                      placeholder="Abbr"
                    />
                  </div>

                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <TextInput
                      value={erp.label}
                      onChange={v => {
                        const list = [...data.step1Erp.erpList]
                        list[idx] = { ...list[idx], label: v }
                        setData(d => ({ ...d, step1Erp: { ...d.step1Erp, erpList: list } }))
                      }}
                      placeholder="Label (e.g. Oracle NetSuite)"
                    />
                    <TextInput
                      value={erp.sub}
                      onChange={v => {
                        const list = [...data.step1Erp.erpList]
                        list[idx] = { ...list[idx], sub: v }
                        setData(d => ({ ...d, step1Erp: { ...d.step1Erp, erpList: list } }))
                      }}
                      placeholder="Category Sublabel (e.g. Cloud ERP)"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={erp.accent || '#3b82f6'}
                        onChange={e => {
                          const list = [...data.step1Erp.erpList]
                          list[idx] = { ...list[idx], accent: e.target.value }
                          setData(d => ({ ...d, step1Erp: { ...d.step1Erp, erpList: list } }))
                        }}
                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 p-0.5 cursor-pointer"
                      />
                      <TextInput
                        value={erp.accent}
                        onChange={v => {
                          const list = [...data.step1Erp.erpList]
                          list[idx] = { ...list[idx], accent: v }
                          setData(d => ({ ...d, step1Erp: { ...d.step1Erp, erpList: list } }))
                        }}
                        placeholder="#0ea5e9"
                      />
                    </div>
                  </div>

                  {data.step1Erp.erpList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const list = data.step1Erp.erpList.filter((_, i) => i !== idx)
                        setData(d => ({ ...d, step1Erp: { ...d.step1Erp, erpList: list } }))
                      }}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 3: STEP 2 - PAIN POINTS & BENCHMARKS ─────────────────────── */}
      <Section
        title="Step 2: Friction Points & Cost Benchmarks"
        description="Manage the operational pain points, benchmark figures, severity ratings, and color markers."
        icon={TrendingUp}
        color="emerald"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Step Eyebrow Title">
              <TextInput
                value={data.step2Pain.stepEyebrow}
                onChange={v => setData(d => ({ ...d, step2Pain: { ...d.step2Pain, stepEyebrow: v } }))}
                placeholder="Step 2 of 6 · Pain Points"
              />
            </Field>

            <Field label="Question Heading">
              <TextInput
                value={data.step2Pain.stepTitle}
                onChange={v => setData(d => ({ ...d, step2Pain: { ...d.step2Pain, stepTitle: v } }))}
                placeholder="Where does your team feel the most friction?"
              />
            </Field>

            <Field label="Max Allowable Selections">
              <NumberInput
                min={1}
                value={data.step2Pain.maxSelections}
                onChange={v => setData(d => ({ ...d, step2Pain: { ...d.step2Pain, maxSelections: v } }))}
                placeholder="3"
              />
            </Field>
          </div>

          <Field label="Question Subtitle">
            <TextInput
              value={data.step2Pain.stepSubtitle}
              onChange={v => setData(d => ({ ...d, step2Pain: { ...d.step2Pain, stepSubtitle: v } }))}
              placeholder="Pick up to 3. Be honest — the cost estimates next to each one are real..."
            />
          </Field>

          {/* Pain Point Cards List */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Friction Points & Metric Costs</Label>
              <button
                type="button"
                onClick={() => {
                  const newItem = {
                    value: `custom-pain-${Date.now()}`,
                    label: 'New Friction Area',
                    detail: 'Operational delay causing inefficiency',
                    metric: '$25K',
                    unit: 'avg cost',
                    severity: 80,
                    color: '#ef4444'
                  }
                  setData(d => ({ ...d, step2Pain: { ...d.step2Pain, painList: [...d.step2Pain.painList, newItem] } }))
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Friction Point
              </button>
            </div>

            <div className="space-y-3">
              {data.step2Pain.painList.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <TextInput
                        value={item.label}
                        onChange={v => {
                          const list = [...data.step2Pain.painList]
                          list[idx] = { ...list[idx], label: v, value: v }
                          setData(d => ({ ...d, step2Pain: { ...d.step2Pain, painList: list } }))
                        }}
                        placeholder="Friction Label"
                      />
                      <TextInput
                        value={item.detail}
                        onChange={v => {
                          const list = [...data.step2Pain.painList]
                          list[idx] = { ...list[idx], detail: v }
                          setData(d => ({ ...d, step2Pain: { ...d.step2Pain, painList: list } }))
                        }}
                        placeholder="Detail description..."
                      />
                    </div>

                    {data.step2Pain.painList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const list = data.step2Pain.painList.filter((_, i) => i !== idx)
                          setData(d => ({ ...d, step2Pain: { ...d.step2Pain, painList: list } }))
                        }}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Metric Cost</span>
                      <TextInput
                        value={item.metric}
                        onChange={v => {
                          const list = [...data.step2Pain.painList]
                          list[idx] = { ...list[idx], metric: v }
                          setData(d => ({ ...d, step2Pain: { ...d.step2Pain, painList: list } }))
                        }}
                        placeholder="$14.20"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Unit</span>
                      <TextInput
                        value={item.unit}
                        onChange={v => {
                          const list = [...data.step2Pain.painList]
                          list[idx] = { ...list[idx], unit: v }
                          setData(d => ({ ...d, step2Pain: { ...d.step2Pain, painList: list } }))
                        }}
                        placeholder="/ invoice"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Severity %</span>
                      <NumberInput
                        min={0}
                        value={item.severity}
                        onChange={v => {
                          const list = [...data.step2Pain.painList]
                          list[idx] = { ...list[idx], severity: v }
                          setData(d => ({ ...d, step2Pain: { ...d.step2Pain, painList: list } }))
                        }}
                        placeholder="85"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Color Marker</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={item.color || '#ef4444'}
                          onChange={e => {
                            const list = [...data.step2Pain.painList]
                            list[idx] = { ...list[idx], color: e.target.value }
                            setData(d => ({ ...d, step2Pain: { ...d.step2Pain, painList: list } }))
                          }}
                          className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 p-0.5 cursor-pointer"
                        />
                        <TextInput
                          value={item.color}
                          onChange={v => {
                            const list = [...data.step2Pain.painList]
                            list[idx] = { ...list[idx], color: v }
                            setData(d => ({ ...d, step2Pain: { ...d.step2Pain, painList: list } }))
                          }}
                          placeholder="#ef4444"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 4: STEP 3 - VOLUME & CALCULATION BENCHMARKS ───────────────── */}
      <Section
        title="Step 3: Volume & Annual Bleed Benchmarks"
        description="Configure unit cost rates, savings multipliers, and live benchmark subtext."
        icon={DollarSign}
        color="purple"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Step Eyebrow Title">
              <TextInput
                value={data.step3Volume.stepEyebrow}
                onChange={v => setData(d => ({ ...d, step3Volume: { ...d.step3Volume, stepEyebrow: v } }))}
                placeholder="Step 3 of 6 · Volume"
              />
            </Field>

            <Field label="Question Heading">
              <TextInput
                value={data.step3Volume.stepTitle}
                onChange={v => setData(d => ({ ...d, step3Volume: { ...d.step3Volume, stepTitle: v } }))}
                placeholder="Give us a rough sense of scale"
              />
            </Field>
          </div>

          <Field label="Question Subtitle">
            <TextInput
              value={data.step3Volume.stepSubtitle}
              onChange={v => setData(d => ({ ...d, step3Volume: { ...d.step3Volume, stepSubtitle: v } }))}
              placeholder="Rough numbers are completely fine..."
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Field label="Invoice Manual Unit Cost ($)" hint="Cost per manual invoice">
              <NumberInput
                step={0.1}
                value={data.step3Volume.benchmarks.invoiceCostRate}
                onChange={v => setData(d => ({ ...d, step3Volume: { ...d.step3Volume, benchmarks: { ...d.step3Volume.benchmarks, invoiceCostRate: v } } }))}
                placeholder="14.20"
              />
            </Field>

            <Field label="Transaction Manual Cost ($)" hint="Cost per manual transaction">
              <NumberInput
                step={0.1}
                value={data.step3Volume.benchmarks.transactionCostRate}
                onChange={v => setData(d => ({ ...d, step3Volume: { ...d.step3Volume, benchmarks: { ...d.step3Volume.benchmarks, transactionCostRate: v } } }))}
                placeholder="3.50"
              />
            </Field>

            <Field label="Expected Savings Multiplier" hint="0.78 = 78% annual savings">
              <NumberInput
                step={0.01}
                value={data.step3Volume.benchmarks.savingsMultiplier}
                onChange={v => setData(d => ({ ...d, step3Volume: { ...d.step3Volume, benchmarks: { ...d.step3Volume.benchmarks, savingsMultiplier: v } } }))}
                placeholder="0.78"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Invoices Benchmark Tagline">
              <TextInput
                value={data.step3Volume.benchmarks.invoicesBenchText}
                onChange={v => setData(d => ({ ...d, step3Volume: { ...d.step3Volume, benchmarks: { ...d.step3Volume.benchmarks, invoicesBenchText: v } } }))}
                placeholder="Industry avg: $14.20 per invoice manual"
              />
            </Field>

            <Field label="Headcount Benchmark Tagline">
              <TextInput
                value={data.step3Volume.benchmarks.employeesBenchText}
                onChange={v => setData(d => ({ ...d, step3Volume: { ...d.step3Volume, benchmarks: { ...d.step3Volume.benchmarks, employeesBenchText: v } } }))}
                placeholder="Fully-loaded ~$72K/yr per person"
              />
            </Field>

            <Field label="Transactions Benchmark Tagline">
              <TextInput
                value={data.step3Volume.benchmarks.transactionsBenchText}
                onChange={v => setData(d => ({ ...d, step3Volume: { ...d.step3Volume, benchmarks: { ...d.step3Volume.benchmarks, transactionsBenchText: v } } }))}
                placeholder="Industry avg: $3.50 per transaction"
              />
            </Field>

            <Field label="PO Lines Benchmark Tagline">
              <TextInput
                value={data.step3Volume.benchmarks.poLinesBenchText}
                onChange={v => setData(d => ({ ...d, step3Volume: { ...d.step3Volume, benchmarks: { ...d.step3Volume.benchmarks, poLinesBenchText: v } } }))}
                placeholder="~8 min of manual work per line"
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* ── SECTION 5: STEP 4 - CURRENT AUTOMATION STATE ──────────────────────── */}
      <Section
        title="Step 4: Current Automation State"
        description="Edit the 5 current-state operational maturity options and ladder bar levels."
        icon={Sliders}
        color="amber"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Step Eyebrow Title">
              <TextInput
                value={data.step4State.stepEyebrow}
                onChange={v => setData(d => ({ ...d, step4State: { ...d.step4State, stepEyebrow: v } }))}
                placeholder="Step 4 of 6 · Current State"
              />
            </Field>

            <Field label="Question Heading">
              <TextInput
                value={data.step4State.stepTitle}
                onChange={v => setData(d => ({ ...d, step4State: { ...d.step4State, stepTitle: v } }))}
                placeholder="How does finance actually work at your company today?"
              />
            </Field>
          </div>

          <Field label="Question Subtitle">
            <TextInput
              value={data.step4State.stepSubtitle}
              onChange={v => setData(d => ({ ...d, step4State: { ...d.step4State, stepSubtitle: v } }))}
              placeholder="This tells us your automation ceiling..."
            />
          </Field>

          {/* State List */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Maturity Levels & Options</Label>
              <button
                type="button"
                onClick={() => {
                  const newState = { value: 'Custom', label: 'Custom Automation', tag: 'Internal bots and scripts', level: 2 }
                  setData(d => ({ ...d, step4State: { ...d.step4State, stateList: [...d.step4State.stateList, newState] } }))
                }}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add State Option
              </button>
            </div>

            <div className="space-y-3">
              {data.step4State.stateList.map((st, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="w-16">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Level (0-3)</span>
                    <NumberInput
                      min={0}
                      value={st.level}
                      onChange={v => {
                        const list = [...data.step4State.stateList]
                        list[idx] = { ...list[idx], level: v }
                        setData(d => ({ ...d, step4State: { ...d.step4State, stateList: list } }))
                      }}
                      placeholder="1"
                    />
                  </div>

                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <TextInput
                      value={st.label}
                      onChange={v => {
                        const list = [...data.step4State.stateList]
                        list[idx] = { ...list[idx], label: v, value: v }
                        setData(d => ({ ...d, step4State: { ...d.step4State, stateList: list } }))
                      }}
                      placeholder="State Label"
                    />
                    <TextInput
                      value={st.tag}
                      onChange={v => {
                        const list = [...data.step4State.stateList]
                        list[idx] = { ...list[idx], tag: v }
                        setData(d => ({ ...d, step4State: { ...d.step4State, stateList: list } }))
                      }}
                      placeholder="Description Tag"
                    />
                  </div>

                  {data.step4State.stateList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const list = data.step4State.stateList.filter((_, i) => i !== idx)
                        setData(d => ({ ...d, step4State: { ...d.step4State, stateList: list } }))
                      }}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 6: STEP 5 - TECH MATURITY LANDSCAPE ──────────────────────── */}
      <Section
        title="Step 5: Tech Stack Maturity Era"
        description="Configure the architecture maturity cards (Legacy, Hybrid, Modern, AI Pilot)."
        icon={Layers}
        color="indigo"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Step Eyebrow Title">
              <TextInput
                value={data.step5Maturity.stepEyebrow}
                onChange={v => setData(d => ({ ...d, step5Maturity: { ...d.step5Maturity, stepEyebrow: v } }))}
                placeholder="Step 5 of 6 · Tech Maturity"
              />
            </Field>

            <Field label="Question Heading">
              <TextInput
                value={data.step5Maturity.stepTitle}
                onChange={v => setData(d => ({ ...d, step5Maturity: { ...d.step5Maturity, stepTitle: v } }))}
                placeholder="How would you describe your underlying tech stack?"
              />
            </Field>
          </div>

          <Field label="Question Subtitle">
            <TextInput
              value={data.step5Maturity.stepSubtitle}
              onChange={v => setData(d => ({ ...d, step5Maturity: { ...d.step5Maturity, stepSubtitle: v } }))}
              placeholder="Older infrastructure doesn't disqualify you..."
            />
          </Field>

          {/* Maturity Cards List */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Architecture Era Cards</Label>
              <button
                type="button"
                onClick={() => {
                  const newMat = { value: 'Composable', label: 'Composable ERP', tag: 'Microservices and event streams', year: 'Future' }
                  setData(d => ({ ...d, step5Maturity: { ...d.step5Maturity, maturityList: [...d.step5Maturity.maturityList, newMat] } }))
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Era Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.step5Maturity.maturityList.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <TextInput
                      value={m.year}
                      onChange={v => {
                        const list = [...data.step5Maturity.maturityList]
                        list[idx] = { ...list[idx], year: v }
                        setData(d => ({ ...d, step5Maturity: { ...d.step5Maturity, maturityList: list } }))
                      }}
                      placeholder="Era (e.g. Pre-2018)"
                    />

                    {data.step5Maturity.maturityList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const list = data.step5Maturity.maturityList.filter((_, i) => i !== idx)
                          setData(d => ({ ...d, step5Maturity: { ...d.step5Maturity, maturityList: list } }))
                        }}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <TextInput
                    value={m.label}
                    onChange={v => {
                      const list = [...data.step5Maturity.maturityList]
                      list[idx] = { ...list[idx], label: v, value: v }
                      setData(d => ({ ...d, step5Maturity: { ...d.step5Maturity, maturityList: list } }))
                    }}
                    placeholder="Era Title (e.g. Cloud-First)"
                  />

                  <TextArea
                    rows={2}
                    value={m.tag}
                    onChange={v => {
                      const list = [...data.step5Maturity.maturityList]
                      list[idx] = { ...list[idx], tag: v }
                      setData(d => ({ ...d, step5Maturity: { ...d.step5Maturity, maturityList: list } }))
                    }}
                    placeholder="Tagline description..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 7: STEP 6 - TIMELINE & URGENCY ───────────────────────────── */}
      <Section
        title="Step 6: Timeline & Urgency Signals"
        description="Configure the 4 timeline urgency signals (Exploring, Budget Approved, Audit-Driven, Board Mandate)."
        icon={Zap}
        color="emerald"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Step Eyebrow Title">
              <TextInput
                value={data.step6Urgency.stepEyebrow}
                onChange={v => setData(d => ({ ...d, step6Urgency: { ...d.step6Urgency, stepEyebrow: v } }))}
                placeholder="Step 6 of 6 · Timeline"
              />
            </Field>

            <Field label="Question Heading">
              <TextInput
                value={data.step6Urgency.stepTitle}
                onChange={v => setData(d => ({ ...d, step6Urgency: { ...d.step6Urgency, stepTitle: v } }))}
                placeholder="What's driving the timing on this?"
              />
            </Field>
          </div>

          <Field label="Question Subtitle">
            <TextInput
              value={data.step6Urgency.stepSubtitle}
              onChange={v => setData(d => ({ ...d, step6Urgency: { ...d.step6Urgency, stepSubtitle: v } }))}
              placeholder="This changes how we structure your roadmap..."
            />
          </Field>

          {/* Urgency List */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Urgency Trigger Cards</Label>
              <button
                type="button"
                onClick={() => {
                  const newUrg = { value: 'Transformation', label: 'Company-Wide Transformation', tag: 'Broad modernization wave', signal: 'HIGH', signalColor: '#f59e0b', priority: 3 }
                  setData(d => ({ ...d, step6Urgency: { ...d.step6Urgency, urgencyList: [...d.step6Urgency.urgencyList, newUrg] } }))
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Urgency Card
              </button>
            </div>

            <div className="space-y-3">
              {data.step6Urgency.urgencyList.map((u, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="w-20">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Signal</span>
                    <TextInput
                      value={u.signal}
                      onChange={v => {
                        const list = [...data.step6Urgency.urgencyList]
                        list[idx] = { ...list[idx], signal: v }
                        setData(d => ({ ...d, step6Urgency: { ...d.step6Urgency, urgencyList: list } }))
                      }}
                      placeholder="LOW"
                    />
                  </div>

                  <div className="w-16">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Priority</span>
                    <NumberInput
                      min={1}
                      value={u.priority}
                      onChange={v => {
                        const list = [...data.step6Urgency.urgencyList]
                        list[idx] = { ...list[idx], priority: v }
                        setData(d => ({ ...d, step6Urgency: { ...d.step6Urgency, urgencyList: list } }))
                      }}
                      placeholder="1"
                    />
                  </div>

                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <TextInput
                      value={u.label}
                      onChange={v => {
                        const list = [...data.step6Urgency.urgencyList]
                        list[idx] = { ...list[idx], label: v, value: v }
                        setData(d => ({ ...d, step6Urgency: { ...d.step6Urgency, urgencyList: list } }))
                      }}
                      placeholder="Label (e.g. Budget is approved)"
                    />
                    <TextInput
                      value={u.tag}
                      onChange={v => {
                        const list = [...data.step6Urgency.urgencyList]
                        list[idx] = { ...list[idx], tag: v }
                        setData(d => ({ ...d, step6Urgency: { ...d.step6Urgency, urgencyList: list } }))
                      }}
                      placeholder="Tag (e.g. We have funding...)"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={u.signalColor || '#3b82f6'}
                      onChange={e => {
                        const list = [...data.step6Urgency.urgencyList]
                        list[idx] = { ...list[idx], signalColor: e.target.value }
                        setData(d => ({ ...d, step6Urgency: { ...d.step6Urgency, urgencyList: list } }))
                      }}
                      className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 p-0.5 cursor-pointer"
                    />
                  </div>

                  {data.step6Urgency.urgencyList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const list = data.step6Urgency.urgencyList.filter((_, i) => i !== idx)
                        setData(d => ({ ...d, step6Urgency: { ...d.step6Urgency, urgencyList: list } }))
                      }}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 8: GUIDED TOUR & LEAD CAPTURE ────────────────────────────── */}
      <Section
        title="Guided Tour & Email Report Lead Capture"
        description="Manage floating guided tour tips, result page headings, and email capture form text."
        icon={Mail}
        color="slate"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Results Roadmap Heading">
              <TextInput
                value={data.tourAndResults.resultsHeading}
                onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, resultsHeading: v } }))}
                placeholder="Your roadmap is ready."
              />
            </Field>

            <Field label="Email Capture Button Text">
              <TextInput
                value={data.tourAndResults.emailCaptureButtonText}
                onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, emailCaptureButtonText: v } }))}
                placeholder="Send my complete roadmap"
              />
            </Field>
          </div>

          <Field label="Results Roadmap Subtitle">
            <TextArea
              rows={2}
              value={data.tourAndResults.resultsSubtitle}
              onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, resultsSubtitle: v } }))}
              placeholder="Based on your inputs, our engine has generated..."
            />
          </Field>

          {/* ── Results Header Label ── */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <Label>Results Page — Header &amp; Score Card Labels</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <Field label="Assessment Complete Label">
                <TextInput
                  value={data.tourAndResults.assessmentCompleteLabel}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, assessmentCompleteLabel: v } }))}
                  placeholder="Assessment complete"
                />
              </Field>
              <Field label="Score Card — Score Label">
                <TextInput
                  value={data.tourAndResults.scoreLabel}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, scoreLabel: v } }))}
                  placeholder="Score"
                />
              </Field>
              <Field label="Score Card — Savings Label">
                <TextInput
                  value={data.tourAndResults.estSavingsLabel}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, estSavingsLabel: v } }))}
                  placeholder="Est. savings"
                />
              </Field>
              <Field label="Score Card — Per Year Label">
                <TextInput
                  value={data.tourAndResults.perYearLabel}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, perYearLabel: v } }))}
                  placeholder="per year"
                />
              </Field>
            </div>
          </div>

          {/* ── KPI Cards ── */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <Label>Results Page — KPI Cards</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
              <Field label="KPI 1 — Label">
                <TextInput
                  value={data.tourAndResults.kpiOpportunitiesLabel}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, kpiOpportunitiesLabel: v } }))}
                  placeholder="Opportunities"
                />
              </Field>
              <Field label="KPI 1 — Unit">
                <TextInput
                  value={data.tourAndResults.kpiOpportunitiesUnit}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, kpiOpportunitiesUnit: v } }))}
                  placeholder="found"
                />
              </Field>
              <Field label="KPI 2 — Label">
                <TextInput
                  value={data.tourAndResults.kpiQuickWinsLabel}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, kpiQuickWinsLabel: v } }))}
                  placeholder="Quick Wins"
                />
              </Field>
              <Field label="KPI 2 — Unit">
                <TextInput
                  value={data.tourAndResults.kpiQuickWinsUnit}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, kpiQuickWinsUnit: v } }))}
                  placeholder="this quarter"
                />
              </Field>
              <Field label="KPI 3 — Label">
                <TextInput
                  value={data.tourAndResults.kpiFastestPaybackLabel}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, kpiFastestPaybackLabel: v } }))}
                  placeholder="Fastest Payback"
                />
              </Field>
              <Field label="KPI 3 — Unit">
                <TextInput
                  value={data.tourAndResults.kpiFastestPaybackUnit}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, kpiFastestPaybackUnit: v } }))}
                  placeholder="to value"
                />
              </Field>
              <Field label="KPI 4 — Label">
                <TextInput
                  value={data.tourAndResults.kpiProfileLabel}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, kpiProfileLabel: v } }))}
                  placeholder="Profile"
                />
              </Field>
              <Field label="KPI 4 — Unit">
                <TextInput
                  value={data.tourAndResults.kpiProfileUnit}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, kpiProfileUnit: v } }))}
                  placeholder="tier"
                />
              </Field>
            </div>
          </div>

          {/* ── Roadmap Category Labels ── */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <Label>Roadmap Categories (Quick Wins / Strategic / Innovation)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <Field label="Category 1 — Label">
                <TextInput
                  value={data.tourAndResults.catQuickWinLabel}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, catQuickWinLabel: v } }))}
                  placeholder="Quick Wins"
                />
              </Field>
              <Field label="Category 1 — Timeline">
                <TextInput
                  value={data.tourAndResults.catQuickWinSub}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, catQuickWinSub: v } }))}
                  placeholder="0–3 months"
                />
              </Field>
              <div />
              <Field label="Category 2 — Label">
                <TextInput
                  value={data.tourAndResults.catStrategicLabel}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, catStrategicLabel: v } }))}
                  placeholder="Strategic"
                />
              </Field>
              <Field label="Category 2 — Timeline">
                <TextInput
                  value={data.tourAndResults.catStrategicSub}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, catStrategicSub: v } }))}
                  placeholder="3–9 months"
                />
              </Field>
              <div />
              <Field label="Category 3 — Label">
                <TextInput
                  value={data.tourAndResults.catInnovationLabel}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, catInnovationLabel: v } }))}
                  placeholder="Innovation"
                />
              </Field>
              <Field label="Category 3 — Timeline">
                <TextInput
                  value={data.tourAndResults.catInnovationSub}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, catInnovationSub: v } }))}
                  placeholder="9–18 months"
                />
              </Field>
            </div>
          </div>

          {/* ── CTA Cards ── */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <Label>CTA Cards (Bottom of Results Page)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <Field label="CTA 1 — Title (ROI Calculator)">
                <TextInput
                  value={data.tourAndResults.ctaRoiTitle}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, ctaRoiTitle: v } }))}
                  placeholder="Full ROI Calculator"
                />
              </Field>
              <Field label="CTA 1 — Subtitle">
                <TextInput
                  value={data.tourAndResults.ctaRoiSubtitle}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, ctaRoiSubtitle: v } }))}
                  placeholder="Build a 3-year financial model"
                />
              </Field>
              <Field label="CTA 2 — Title (Contact)">
                <TextInput
                  value={data.tourAndResults.ctaContactTitle}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, ctaContactTitle: v } }))}
                  placeholder="Talk to the team"
                />
              </Field>
              <Field label="CTA 2 — Subtitle">
                <TextInput
                  value={data.tourAndResults.ctaContactSubtitle}
                  onChange={v => setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, ctaContactSubtitle: v } }))}
                  placeholder="30-min call with a solutions engineer"
                />
              </Field>
            </div>
          </div>


          {/* Tour Steps */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Guided Tour Tooltip Steps</Label>
            </div>

            <div className="space-y-3">
              {data.tourAndResults.tourSteps.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-1">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <TextInput
                      value={step.text}
                      onChange={v => {
                        const list = [...data.tourAndResults.tourSteps]
                        list[idx] = { ...list[idx], text: v }
                        setData(d => ({ ...d, tourAndResults: { ...d.tourAndResults, tourSteps: list } }))
                      }}
                      placeholder="Tooltip prompt text..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Floating Sticky Save Bar at Bottom */}
      <div className="sticky bottom-4 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Updates publish to <a href="/assessment" target="_blank" className="font-bold underline text-blue-600">/assessment</a> immediately.</span>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
      {/* Save Button */}
      <div className="sticky bottom-0 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-50 rounded-t-xl">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Changes are saved to the database and go live immediately.
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="/assessment"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial text-center px-6 py-2.5 text-sm font-semibold rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors"
          >
            Preview Live
          </a>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-2.5 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-60 transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
