'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { runAssessment, type AssessmentAnswers, type AssessmentResult, type Recommendation } from '@flowtaris/assessment-engine'
import { insertAssessmentLead } from '@flowtaris/supabase-client'
import { analytics } from '@flowtaris/analytics'
import { ArrowRight, ChevronLeft, Activity, Mail, CheckCircle2 } from 'lucide-react'

// ─── TYPES ───────────────────────────────────────────────────────────────────
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
    // Results page header
    assessmentCompleteLabel: string
    resultsHeading: string
    resultsSubtitle: string
    // Score card labels
    scoreLabel: string
    estSavingsLabel: string
    perYearLabel: string
    // KPI card labels
    kpiOpportunitiesLabel: string
    kpiOpportunitiesUnit: string
    kpiQuickWinsLabel: string
    kpiQuickWinsUnit: string
    kpiFastestPaybackLabel: string
    kpiFastestPaybackUnit: string
    kpiProfileLabel: string
    kpiProfileUnit: string
    // Category labels
    catQuickWinLabel: string
    catQuickWinSub: string
    catStrategicLabel: string
    catStrategicSub: string
    catInnovationLabel: string
    catInnovationSub: string
    // Email capture
    emailCaptureHeadline: string
    emailCaptureDescription: string
    emailCaptureButtonText: string
    // CTA cards
    ctaRoiTitle: string
    ctaRoiSubtitle: string
    ctaContactTitle: string
    ctaContactSubtitle: string
  }
}

const STORAGE_KEY = 'flowtaris-assessment-v5'
const initialAnswers: AssessmentAnswers = {
  erp: '', painPoints: [],
  volume: { invoicesPerMonth: 0, employees: 1, transactions: 0, poLines: 0 },
  currentState: '', techMaturity: '', urgency: '',
}

// ─── DEFAULT CONFIGURATION ────────────────────────────────────────────────────
export const DEFAULT_ASSESSMENT_DATA: AssessmentConfigData = {
  intro: {
    eyebrowBadge: '• FREE · TAKES ~3 MINUTES · NO CARD REQUIRED',
    heading: 'Find out what your finance team is leaving on the table',
    description: 'Answer 6 questions about your current setup and we will give you a specific, quantified breakdown of where you are losing money — and what it would take to fix it. No generic playbooks, no sales pitch disguised as content.',
    walkawayTitle: 'What you walk away with',
    walkawayDeliverables: [
      { id: '1', number: '01', title: 'Your AI Readiness Score', body: 'A 0–100 score built from 6 dimensions of your finance operation, calibrated to your ERP and current automation stage.' },
      { id: '2', number: '02', title: 'An illustrative cost model', body: 'We model your estimated process cost exposure based on your volume and industry benchmarks — to help frame the potential opportunity. These are illustrative, not guaranteed figures.' },
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
    // P2 #16 — Removed specific benchmark figures: '$14.20/invoice', '11 days avg DSO gap', '$82K avg fine risk', '4.8% error rate' as unverifiable specific claims.
    // Replaced with 'industry-estimated' qualifiers or removed the metric display.
    painList: [
      { value: 'Manual data entry', label: 'Manual Invoice Processing', detail: 'Teams spending significant time on data entry that automation is designed to handle', metric: 'High cost', unit: 'per invoice (industry-estimated)', severity: 92, color: '#ef4444' },
      { value: 'Invoice processing delays', label: 'Cash Flow Blind Spots', detail: 'No real-time view of cash position or receivables aging', metric: 'Multi-day', unit: 'avg DSO gap (industry-estimated)', severity: 78, color: '#f59e0b' },
      { value: 'Integration Failures', label: 'Integration Failures', detail: 'Systems that don\'t talk to each other, causing manual reconciliation', metric: 'Hours', unit: 'of downtime/mo (varies)', severity: 84, color: '#f97316' },
      { value: 'Compliance risks', label: 'Compliance & Audit Risk', detail: 'Manual controls create gaps that auditors flag every cycle', metric: 'Significant', unit: 'compliance risk exposure', severity: 89, color: '#ef4444' },
      { value: 'Slow decision making', label: 'Slow Financial Close', detail: 'Month-end taking too long instead of under 3 days', metric: '5–10 days', unit: 'avg cycle (varies by org)', severity: 71, color: '#eab308' },
      { value: 'High error rates', label: 'Error Rates & Disputes', detail: 'Vendor disputes and payment errors eating into relationships', metric: '3–5%', unit: 'industry-estimated error rate', severity: 76, color: '#ef4444' },
    ]
  },
  step3Volume: {
    stepEyebrow: 'Step 3 of 6 · Volume',
    stepTitle: 'Give us a rough sense of scale',
    stepSubtitle: 'Rough numbers are completely fine. We use these to calculate your actual dollar exposure, not to judge you.',
    // P2 #16 — Removed specific unsupported benchmark rates: '$14.20 per invoice', '$3.50 per transaction', '$72K/yr per person'
    benchmarks: {
      invoiceCostRate: 13.50,
      transactionCostRate: 3.00,
      savingsMultiplier: 0.78,
      invoicesBenchText: 'Industry-estimated range: $12–15 per invoice (manual processing)',
      employeesBenchText: 'Fully-loaded cost varies by role and region',
      transactionsBenchText: 'Industry-estimated: $3–4 per transaction',
      poLinesBenchText: 'Estimated ~8 min of manual work per line',
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
    // P2 #17 — Removed: 'comparable customer outcomes' from email description
    emailCaptureHeadline: 'Get the full report in your inbox',
    emailCaptureDescription: 'We\'ll send a PDF with implementation steps, CFO talking points, and a recommended roadmap for your specific ERP and pain points. No spam.',
    emailCaptureButtonText: 'Send my complete roadmap',
    ctaRoiTitle: 'Full ROI Calculator',
    ctaRoiSubtitle: 'Build a 3-year financial model',
    ctaContactTitle: 'Talk to the team',
    ctaContactSubtitle: '30-min call with a solutions engineer',
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtK = (v: number) => v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${Math.round(v)}`

function livePainCost(vol: AssessmentAnswers['volume'], benchmarks = DEFAULT_ASSESSMENT_DATA.step3Volume.benchmarks) {
  const invRate = benchmarks?.invoiceCostRate ?? 14.20
  const txRate = benchmarks?.transactionCostRate ?? 3.50
  return (vol.invoicesPerMonth * 12 * invRate) + (vol.transactions * 12 * txRate)
}

function calcScore(answers: AssessmentAnswers, _step: number) {
  let s = 0
  if (answers.erp) s += 12
  s += Math.min(answers.painPoints.length * 8, 24)
  const vol = answers.volume.invoicesPerMonth + answers.volume.transactions + answers.volume.poLines
  if (vol > 5000) s += 20; else if (vol > 1000) s += 14; else if (vol > 0) s += 8
  if (answers.currentState === 'Manual') s += 15; else if (answers.currentState) s += 9
  if (answers.techMaturity === 'AI Pilot') s += 20; else if (answers.techMaturity) s += 12
  const ub: Record<string, number> = { 'Board Mandate': 25, 'Audit-Driven': 20, 'Budget Approved': 15, 'Exploring': 8 }
  s += ub[answers.urgency] || 0
  return Math.min(s, 100)
}

// ─── SCORE GAUGE ─────────────────────────────────────────────────────────────
function Gauge({ score }: { score: number }) {
  const sz = 110, r = 40, circ = 2 * Math.PI * r
  const arc = circ * 0.75
  const fill = arc * (score / 100)
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative flex-shrink-0" style={{ width: sz, height: sz }}>
      <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{ transform: 'rotate(135deg)' }}>
        <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={7} strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" />
        <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke={color} strokeWidth={7} strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.9s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black font-mono leading-none" style={{ color }}>{score}</span>
        <span className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5 font-bold">/ 100</span>
      </div>
    </div>
  )
}

// ─── FLOATING TOUR TOOLTIP ────────────────────────────────────────────────────
function FloatingTour({ steps, onDismiss }: { steps: Array<{ target: string; text: string }>; onDismiss: () => void }) {
  const [idx, setIdx] = useState(0)
  const tourList = steps && steps.length > 0 ? steps : DEFAULT_ASSESSMENT_DATA.tourAndResults.tourSteps
  const step = tourList[idx] || tourList[0]

  return (
    <div className="fixed bottom-28 right-6 z-50 max-w-xs animate-bounce-slow">
      <div className="bg-[#1e2a3a] border border-[#334155] rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-6 h-6 rounded-full bg-blue-500/30 border border-blue-400/50 flex items-center justify-center text-[11px] font-black text-blue-300 flex-shrink-0 mt-0.5">
            {idx + 1}
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">{step?.text}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {tourList.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors" style={{ background: i === idx ? '#60a5fa' : 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={onDismiss} className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium cursor-pointer">Skip tour</button>
            {idx < tourList.length - 1
              ? <button onClick={() => setIdx(i => i + 1)} className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg transition-colors font-bold border border-blue-500/30 cursor-pointer">Next →</button>
              : <button onClick={onDismiss} className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg transition-colors font-bold border border-blue-500/30 cursor-pointer">Got it</button>
            }
          </div>
        </div>
      </div>
      {/* Tail */}
      <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#1e2a3a] border-r border-b border-[#334155] rotate-45" />
    </div>
  )
}

// ─── STEP 0: INTRO ────────────────────────────────────────────────────────────
function StepIntro({ config, onStart }: { config: AssessmentConfigData['intro']; onStart: () => void }) {
  const introData = config || DEFAULT_ASSESSMENT_DATA.intro
  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-2">
      {/* Label */}
      <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-10">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        {introData.eyebrowBadge}
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-black leading-[1.08] tracking-tight mb-6">
        {introData.heading}
      </h1>

      <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-14 max-w-2xl">
        {introData.description}
      </p>

      {/* What you get */}
      <div className="mb-14">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-5">
          {introData.walkawayTitle || 'What you walk away with'}
        </p>
        <div className="space-y-4">
          {(introData.walkawayDeliverables || DEFAULT_ASSESSMENT_DATA.intro.walkawayDeliverables).map(item => (
            <div key={item.number} className="flex gap-5 items-start group">
              <div className="text-xs font-black font-mono text-slate-600 group-hover:text-slate-400 transition-colors pt-0.5 flex-shrink-0 w-6">
                {item.number}
              </div>
              <div>
                <div className="font-bold text-white text-base mb-1">{item.title}</div>
                <div className="text-slate-400 text-sm leading-relaxed">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button
          onClick={onStart}
          className="flex items-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-black text-lg px-10 py-4 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95 cursor-pointer"
        >
          {introData.ctaButtonText || 'Begin Assessment'} <ArrowRight className="w-5 h-5" />
        </button>
        <div className="text-sm text-slate-500">
          {introData.confidentialityNote}
        </div>
      </div>
    </div>
  )
}

// ─── EXACT BRAND LOGOS (PULLED FROM OFFICIAL SOURCES) ─────────────────────
const ERP_LOGOS: Record<string, React.ReactNode> = {
  'NetSuite': (
    <img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://netsuite.com&size=128" alt="Oracle NetSuite" className="w-full h-full object-contain rounded-md" />
  ),
  'SAP': (
    <img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://sap.com&size=128" alt="SAP S/4HANA" className="w-full h-full object-contain rounded-md" />
  ),
  'Coupa': (
    <img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://coupa.com&size=128" alt="Coupa" className="w-full h-full object-contain rounded-md" />
  ),
  'Workday': (
    <img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://workday.com&size=128" alt="Workday" className="w-full h-full object-contain rounded-md" />
  )
}

// ─── STEP 1: ERP ─────────────────────────────────────────────────────────────
function StepERP({ config, value, onChange }: { config: AssessmentConfigData['step1Erp']; value: string; onChange: (v: string) => void }) {
  const stepData = config || DEFAULT_ASSESSMENT_DATA.step1Erp
  const erpList = stepData.erpList || DEFAULT_ASSESSMENT_DATA.step1Erp.erpList

  return (
    <div id="erp-section" className="w-full">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3 flex items-center gap-3">
          <span>{stepData.stepEyebrow || 'Step 1 of 6 · ERP Platform'}</span>
        </div>
        <h2 className="text-3xl md:text-4xl text-white font-black leading-tight mb-3">
          {stepData.stepTitle}
        </h2>
        <p className="text-slate-400 text-base max-w-lg">
          {stepData.stepSubtitle}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {erpList.map((erp) => {
          const selected = value === erp.value
          return (
            <button
              key={erp.value}
              onClick={() => onChange(erp.value)}
              className="group w-full flex items-center gap-5 px-5 py-4 rounded-xl border text-left transition-all duration-150 cursor-pointer"
              style={{
                borderColor: selected ? erp.accent : 'rgba(255,255,255,0.1)',
                background: selected ? erp.accent + '18' : 'rgba(255,255,255,0.03)',
              }}
            >
              <div
                className="w-12 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-black flex-shrink-0"
                style={{ background: (erp.accent || '#3b82f6') + '20', color: erp.accent || '#3b82f6', border: `1px solid ${(erp.accent || '#3b82f6')}40` }}
              >
                {ERP_LOGOS[erp.value] ? (
                  <div className="w-10 h-6 flex items-center justify-center px-0.5">
                    {ERP_LOGOS[erp.value]}
                  </div>
                ) : (
                  erp.abbr
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-white text-base">{erp.label}</span>
                <span className="ml-3 text-xs text-slate-500 font-medium">{erp.sub}</span>
              </div>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                style={selected
                  ? { borderColor: erp.accent, background: erp.accent }
                  : { borderColor: 'rgba(255,255,255,0.2)' }}>
                {selected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── STEP 2: PAIN POINTS ──────────────────────────────────────────────────────
function StepPain({ config, value, onChange }: { config: AssessmentConfigData['step2Pain']; value: string[]; onChange: (v: string[]) => void }) {
  const stepData = config || DEFAULT_ASSESSMENT_DATA.step2Pain
  const painList = stepData.painList || DEFAULT_ASSESSMENT_DATA.step2Pain.painList
  const MAX = stepData.maxSelections || 3

  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter(x => x !== v))
    else if (value.length < MAX) onChange([...value, v])
  }

  return (
    <div id="pain-section" className="w-full">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3 flex items-center gap-3">
          <span>{stepData.stepEyebrow || 'Step 2 of 6 · Pain Points'}</span>
        </div>
        <h2 className="text-3xl md:text-4xl text-white font-black leading-tight mb-3">
          {stepData.stepTitle}
        </h2>
        <p className="text-slate-400 text-base max-w-lg">
          {stepData.stepSubtitle}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {painList.map(p => {
          const selected = value.includes(p.value)
          const disabled = !selected && value.length >= MAX
          const rank = value.indexOf(p.value)

          return (
            <button
              key={p.value}
              onClick={() => !disabled && toggle(p.value)}
              disabled={disabled}
              className="group w-full flex items-start gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-150 relative cursor-pointer"
              style={{
                borderColor: selected ? p.color : disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                background: selected ? p.color + '12' : 'rgba(255,255,255,0.03)',
                opacity: disabled ? 0.35 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {/* Left accent bar */}
              <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-all" style={{ background: selected ? p.color : 'transparent' }} />

              {/* Rank badge */}
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                style={selected
                  ? { background: p.color + '30', color: p.color, border: `1.5px solid ${p.color}` }
                  : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)', border: '1.5px solid rgba(255,255,255,0.1)' }}>
                {selected ? rank + 1 : ''}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-bold text-white text-base">{p.label}</div>
                    <div className="text-slate-500 text-sm mt-0.5 font-medium">{p.detail}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-black font-mono text-base leading-none" style={{ color: selected ? p.color : 'rgba(255,255,255,0.5)' }}>{p.metric}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">{p.unit}</div>
                  </div>
                </div>
                {/* Severity bar */}
                <div className="mt-3 h-1 bg-white/5 rounded-full max-w-[140px] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p.severity}%`, background: selected ? p.color : 'rgba(255,255,255,0.15)' }} />
                </div>
              </div>
            </button>
          )
        })}
      </div>
      <div className="mt-4 text-right text-sm font-mono font-bold text-slate-600">{value.length} / {MAX} selected</div>
    </div>
  )
}

// ─── STEP 3: VOLUME ───────────────────────────────────────────────────────────
function StepVolume({ config, value, onChange }: { config: AssessmentConfigData['step3Volume']; value: AssessmentAnswers['volume']; onChange: (v: AssessmentAnswers['volume']) => void }) {
  const stepData = config || DEFAULT_ASSESSMENT_DATA.step3Volume
  const benchmarks = stepData.benchmarks || DEFAULT_ASSESSMENT_DATA.step3Volume.benchmarks
  const cost = livePainCost(value, benchmarks)
  const savings = cost * (benchmarks.savingsMultiplier ?? 0.78)

  const fields: { id: keyof typeof value; label: string; bench: string; placeholder: string }[] = [
    { id: 'invoicesPerMonth', label: 'Invoices processed per month', bench: benchmarks.invoicesBenchText, placeholder: 'e.g. 2000' },
    { id: 'employees', label: 'Finance & AP headcount (FTE)', bench: benchmarks.employeesBenchText, placeholder: 'e.g. 8' },
    { id: 'transactions', label: 'Payment transactions per month', bench: benchmarks.transactionsBenchText, placeholder: 'e.g. 5000' },
    { id: 'poLines', label: 'Purchase order lines per month', bench: benchmarks.poLinesBenchText, placeholder: 'e.g. 1500' },
  ]

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3 flex items-center gap-3">
          <span>{stepData.stepEyebrow || 'Step 3 of 6 · Volume'}</span>
        </div>
        <h2 className="text-3xl md:text-4xl text-white font-black leading-tight mb-3">
          {stepData.stepTitle}
        </h2>
        <p className="text-slate-400 text-base max-w-lg">
          {stepData.stepSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {fields.map(f => (
          <div key={f.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 group focus-within:border-blue-500/50 transition-colors">
            <label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 block">{f.label}</label>
            <input
              type="number"
              min="0"
              value={value[f.id] || ''}
              onChange={e => onChange({ ...value, [f.id]: parseInt(e.target.value) || 0 })}
              placeholder={f.placeholder}
              className="w-full bg-transparent text-2xl font-black font-mono text-white outline-none border-b-2 border-white/15 focus:border-blue-400 pb-2 transition-colors placeholder:text-slate-700"
            />
            <div className="text-[11px] font-mono font-medium text-slate-600 mt-3">{f.bench}</div>
          </div>
        ))}
      </div>

      {cost > 0 && (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]">
          <div className="px-5 py-3 border-b border-white/10 bg-white/[0.03]">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Live estimate — based on your numbers</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/10">
            <div className="px-5 py-5">
              <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-2">Annual cost today</div>
              <div className="text-xl font-black font-mono text-red-400">{fmtK(cost)}</div>
            </div>
            <div className="px-5 py-5">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2">With Flowtaris</div>
              <div className="text-xl font-black font-mono text-emerald-400">{fmtK(cost - savings)}</div>
            </div>
            <div className="px-5 py-5 bg-white/[0.03]">
              <div className="text-[10px] text-white/60 font-bold uppercase tracking-wider mb-2">You save</div>
              <div className="text-xl font-black font-mono text-white">{fmtK(savings)}<span className="text-sm text-slate-600 font-normal ml-1">/ yr</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── STEP 4: CURRENT STATE ────────────────────────────────────────────────────
function StepState({ config, value, onChange }: { config: AssessmentConfigData['step4State']; value: string; onChange: (v: string) => void }) {
  const stepData = config || DEFAULT_ASSESSMENT_DATA.step4State
  const stateList = stepData.stateList || DEFAULT_ASSESSMENT_DATA.step4State.stateList
  const selectedLevel = stateList.find(s => s.value === value)?.level ?? -1

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3 flex items-center gap-3">
          <span>{stepData.stepEyebrow || 'Step 4 of 6 · Current State'}</span>
        </div>
        <h2 className="text-3xl md:text-4xl text-white font-black leading-tight mb-3">
          {stepData.stepTitle}
        </h2>
        <p className="text-slate-400 text-base max-w-lg">
          {stepData.stepSubtitle}
        </p>
      </div>

      {/* Maturity ladder visual */}
      <div className="flex items-end gap-1.5 mb-8 h-10">
        {[...Array(5)].map((_, i) => {
          const active = selectedLevel >= 0 && i <= selectedLevel
          return (
            <div key={i} className="flex-1 rounded-sm transition-all duration-500"
              style={{
                height: `${(i + 1) * 18 + 10}%`,
                background: active ? '#3b82f6' : 'rgba(255,255,255,0.08)',
              }} />
          )
        })}
      </div>

      <div className="flex flex-col gap-2.5">
        {stateList.map(s => {
          const selected = value === s.value
          return (
            <button key={s.value} onClick={() => onChange(s.value)}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-150 cursor-pointer"
              style={{
                borderColor: selected ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                background: selected ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
              }}>
              <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                style={selected
                  ? { borderColor: '#3b82f6', background: '#3b82f6' }
                  : { borderColor: 'rgba(255,255,255,0.2)' }}>
                {selected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <div className="font-bold text-white text-base">{s.label}</div>
                <div className="text-sm text-slate-500 mt-0.5">{s.tag}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── STEP 5: TECH MATURITY ────────────────────────────────────────────────────
function StepMaturity({ config, value, onChange }: { config: AssessmentConfigData['step5Maturity']; value: string; onChange: (v: string) => void }) {
  const stepData = config || DEFAULT_ASSESSMENT_DATA.step5Maturity
  const maturityList = stepData.maturityList || DEFAULT_ASSESSMENT_DATA.step5Maturity.maturityList

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3 flex items-center gap-3">
          <span>{stepData.stepEyebrow || 'Step 5 of 6 · Tech Maturity'}</span>
        </div>
        <h2 className="text-3xl md:text-4xl text-white font-black leading-tight mb-3">
          {stepData.stepTitle}
        </h2>
        <p className="text-slate-400 text-base max-w-lg">
          {stepData.stepSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {maturityList.map(m => {
          const selected = value === m.value
          return (
            <button key={m.value} onClick={() => onChange(m.value)}
              className="p-5 rounded-xl border text-left transition-all duration-150 relative cursor-pointer"
              style={{
                borderColor: selected ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                background: selected ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
              }}>
              <div className="text-[10px] font-mono font-bold px-2.5 py-1 bg-white/8 rounded-md inline-block mb-3 text-slate-500 border border-white/10">{m.year}</div>
              <div className="font-bold text-white text-lg mb-1">{m.label}</div>
              <div className="text-sm text-slate-500">{m.tag}</div>

              <div className="absolute top-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={selected ? { borderColor: '#3b82f6', background: '#3b82f6' } : { borderColor: 'rgba(255,255,255,0.2)' }}>
                {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── STEP 6: URGENCY ─────────────────────────────────────────────────────────
function StepUrgency({ config, value, onChange }: { config: AssessmentConfigData['step6Urgency']; value: string; onChange: (v: string) => void }) {
  const stepData = config || DEFAULT_ASSESSMENT_DATA.step6Urgency
  const urgencyList = stepData.urgencyList || DEFAULT_ASSESSMENT_DATA.step6Urgency.urgencyList

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3 flex items-center gap-3">
          <span>{stepData.stepEyebrow || 'Step 6 of 6 · Timeline'}</span>
        </div>
        <h2 className="text-3xl md:text-4xl text-white font-black leading-tight mb-3">
          {stepData.stepTitle}
        </h2>
        <p className="text-slate-400 text-base max-w-lg">
          {stepData.stepSubtitle}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {urgencyList.map(u => {
          const selected = value === u.value
          return (
            <button key={u.value} onClick={() => onChange(u.value)}
              className="w-full flex items-center gap-5 px-5 py-5 rounded-xl border text-left transition-all duration-150 cursor-pointer"
              style={{
                borderColor: selected ? u.signalColor : 'rgba(255,255,255,0.1)',
                background: selected ? u.signalColor + '12' : 'rgba(255,255,255,0.03)',
              }}>
              <div className="w-14 h-10 rounded-lg flex items-center justify-center font-black font-mono text-xs flex-shrink-0 border"
                style={selected
                  ? { background: u.signalColor + '25', color: u.signalColor, borderColor: u.signalColor + '60' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.08)' }}>
                {u.signal}
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-base">{u.label}</div>
                <div className="text-sm text-slate-500 mt-0.5">{u.tag}</div>
              </div>
              {/* Priority dots */}
              <div className="flex gap-1 flex-shrink-0">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-1.5 h-4 rounded-full transition-all"
                    style={{ background: i <= u.priority ? (selected ? u.signalColor : 'rgba(255,255,255,0.25)') : 'rgba(255,255,255,0.07)' }} />
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ answers, step, benchmarks }: { answers: AssessmentAnswers; step: number; benchmarks?: AssessmentConfigData['step3Volume']['benchmarks'] }) {
  if (step === 0) return null
  const score = calcScore(answers, step)
  const tier = score >= 70 ? 'Enterprise' : score >= 45 ? 'Mid-Market' : 'Growth'
  const tierColor = score >= 70 ? '#10b981' : score >= 45 ? '#3b82f6' : '#64748b'
  const cost = livePainCost(answers.volume, benchmarks)

  return (
    <div id="sidebar-score" className="hidden xl:flex flex-col gap-4 w-[280px] sticky top-24">
      {/* Score */}
      <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
        <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-4 font-bold">AI Readiness Score</div>
        <div className="flex items-center gap-4">
          <Gauge score={score} />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-600 mb-1 font-bold">Profile</div>
            <div className="text-base font-black" style={{ color: tierColor }}>{tier}</div>
          </div>
        </div>
      </div>

      {/* Signals */}
      <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3.5">
        <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Breakdown</div>
        {[
          { label: 'ERP Complexity', value: answers.erp ? 75 : 0, color: '#0ea5e9' },
          { label: 'Pain Severity', value: Math.min(answers.painPoints.length * 33, 100), color: '#ef4444' },
          { label: 'Volume Scale', value: answers.volume.invoicesPerMonth > 5000 ? 90 : answers.volume.invoicesPerMonth > 1000 ? 60 : answers.volume.invoicesPerMonth > 0 ? 30 : 0, color: '#f59e0b' },
          { label: 'Tech Readiness', value: ({ 'AI Pilot': 95, 'Modern': 70, 'Hybrid': 45, 'Legacy': 20 } as Record<string, number>)[answers.techMaturity] || 0, color: '#10b981' },
        ].map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1.5">
              <span>{b.label}</span>
              <span className="font-mono text-slate-300">{b.value}%</span>
            </div>
            <div className="h-1 bg-white/8 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${b.value}%`, background: b.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Live cost */}
      {cost > 0 && (
        <div className="bg-red-950/40 border border-red-900/40 rounded-2xl p-5">
          <div className="text-[10px] uppercase tracking-widest text-red-500 font-bold mb-2">Est. annual bleed</div>
          <div className="text-2xl font-black font-mono text-red-400">{fmtK(cost)}</div>
          <div className="text-[11px] text-slate-600 mt-1">Based on your volume inputs</div>
        </div>
      )}
    </div>
  )
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────
function Results({ config, result, answers, assessmentId }: { config: AssessmentConfigData['tourAndResults']; result: AssessmentResult; answers: AssessmentAnswers; assessmentId: string | null }) {
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [isSending, setIsSending] = useState(false)

  const resultsData = config || DEFAULT_ASSESSMENT_DATA.tourAndResults

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSending(true)
    setEmailError('')
    try {
      const r = await fetch('/api/leads/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: assessmentId, email, result, answers }),
      })
      if (!r.ok) throw new Error((await r.json()).error || 'Failed')
      setEmailSent(true)
      localStorage.removeItem(STORAGE_KEY)
    } catch (err: unknown) {
      setEmailError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSending(false)
    }
  }

  type Cat = 'quick-win' | 'strategic' | 'innovation'
  const catConfig: Record<Cat, { label: string; sub: string; color: string }> = {
    'quick-win': { label: resultsData.catQuickWinLabel || 'Quick Wins', sub: resultsData.catQuickWinSub || '0–3 months', color: '#10b981' },
    'strategic': { label: resultsData.catStrategicLabel || 'Strategic', sub: resultsData.catStrategicSub || '3–9 months', color: '#f59e0b' },
    'innovation': { label: resultsData.catInnovationLabel || 'Innovation', sub: resultsData.catInnovationSub || '9–18 months', color: '#a855f7' },
  }

  const scoreColor = result.leadScore >= 70 ? '#10b981' : result.leadScore >= 45 ? '#f59e0b' : '#ef4444'

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full">
      {/* Header */}
      <div className="mb-12">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-5">{resultsData.assessmentCompleteLabel || 'Assessment complete'}</div>
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-4xl text-white font-black leading-tight mb-4">
              {resultsData.resultsHeading || 'Your roadmap is ready.'}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              {resultsData.resultsSubtitle || `Based on your inputs (including ${answers.erp || 'your ERP'} and processing ${answers.volume.invoicesPerMonth * 12} invoices/yr), our engine has generated this customized, sequenced action plan.`}
            </p>
          </div>
          <div className="flex items-center gap-6 bg-[#111827]/80 border border-white/10 rounded-2xl p-6 flex-shrink-0">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-2">{resultsData.scoreLabel || 'Score'}</div>
              <div className="text-6xl font-black font-mono leading-none" style={{ color: scoreColor }}>{result.leadScore}</div>
              <div className="text-[10px] text-slate-700 mt-1">/&nbsp;100</div>
            </div>
            <div className="w-px h-16 bg-white/8" />
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-2">{resultsData.estSavingsLabel || 'Est. savings'}</div>
              <div className="text-3xl font-black font-mono text-emerald-400">{fmtK(result.totalEstimatedSavings)}</div>
              <div className="text-[10px] text-slate-700 mt-1">{resultsData.perYearLabel || 'per year'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
        {[
          { label: resultsData.kpiOpportunitiesLabel || 'Opportunities', value: String(result.recommendations.length), unit: resultsData.kpiOpportunitiesUnit || 'found' },
          { label: resultsData.kpiQuickWinsLabel || 'Quick Wins', value: String(result.recommendations.filter(r => r.category === 'quick-win').length), unit: resultsData.kpiQuickWinsUnit || 'this quarter' },
          { label: resultsData.kpiFastestPaybackLabel || 'Fastest Payback', value: result.recommendations.length ? `${Math.min(...result.recommendations.map(r => r.estimatedPaybackMonths))} mo` : '—', unit: resultsData.kpiFastestPaybackUnit || 'to value' },
          { label: resultsData.kpiProfileLabel || 'Profile', value: result.tier === 'enterprise' ? 'Enterprise' : result.tier === 'mid-market' ? 'Mid-Market' : 'SMB', unit: resultsData.kpiProfileUnit || 'tier' },
        ].map(k => (
          <div key={k.label} className="bg-[#111827]/60 border border-white/10 rounded-xl px-5 py-5">
            <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-2">{k.label}</div>
            <div className="text-2xl font-black font-mono text-white">{k.value}</div>
            <div className="text-[11px] text-slate-600 mt-0.5">{k.unit}</div>
          </div>
        ))}
      </div>

      {/* Roadmap */}
      <div className="mb-12">
        <div className="text-xs uppercase tracking-widest text-slate-600 font-bold mb-5 flex items-center gap-3">
          <span>Recommended action plan</span>
          <div className="h-px flex-1 bg-white/8" />
        </div>
        <div className="space-y-5">
          {(['quick-win', 'strategic', 'innovation'] as Cat[]).map(cat => {
            const recs = result.recommendations.filter(r => r.category === cat)
            if (!recs.length) return null
            const cfg = catConfig[cat]
            return (
              <div key={cat} className="border border-white/10 rounded-2xl overflow-hidden bg-[#111827]/50">
                <div className="flex items-center gap-4 px-6 py-4 border-b border-white/8" style={{ background: cfg.color + '10' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                  <span className="font-bold text-white text-base">{cfg.label}</span>
                  <span className="text-[11px] font-mono text-slate-500 bg-white/5 px-2.5 py-1 rounded-md">{cfg.sub}</span>
                  <span className="ml-auto font-mono text-base font-black" style={{ color: cfg.color }}>{fmtK(recs.reduce((s, r) => s + r.estimatedSavings, 0))}/yr</span>
                </div>
                {recs.map((rec: Recommendation, i: number) => (
                  <div key={rec.capabilitySlug} className={`px-6 py-5 flex items-start justify-between gap-5 ${i < recs.length - 1 ? 'border-b border-white/8' : ''}`}>
                    <div>
                      <div className="font-bold text-white text-base">{rec.capability}</div>
                      <div className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-2xl">{rec.description}</div>
                    </div>
                    <div className="text-right flex-shrink-0 bg-white/[0.04] px-4 py-3 rounded-xl border border-white/8">
                      <div className="font-black font-mono text-base" style={{ color: cfg.color }}>{fmtK(rec.estimatedSavings)}/yr</div>
                      <div className="text-[10px] text-slate-600 mt-1">{rec.estimatedPaybackMonths}mo payback</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Email capture */}
      <div className="border border-slate-700/60 bg-[#111827]/60 rounded-2xl overflow-hidden mb-8">
        <div className="px-7 py-5 border-b border-slate-700/40">
          <div className="font-bold text-white text-lg">
            {resultsData.emailCaptureHeadline || 'Get the full report in your inbox'}
          </div>
          <div className="text-slate-500 text-sm mt-1">
            {resultsData.emailCaptureDescription || 'We\'ll send a PDF with implementation steps, CFO talking points, and comparable customer outcomes. No spam.'}
          </div>
        </div>
        <div className="px-7 py-6">
          {emailSent ? (
            <div className="flex items-center gap-3 text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 p-4 rounded-xl">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
              <div>
                <div className="font-bold">Report sent — check your inbox.</div>
                <div className="text-sm text-emerald-500/70 mt-0.5">Didn't arrive? Check your spam folder.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEmail} className="flex gap-3 flex-wrap">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 min-w-[200px] bg-white/[0.05] border border-white/15 hover:border-white/25 focus:border-blue-400 rounded-xl px-5 py-3.5 text-white text-base font-medium outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-2.5 bg-white hover:bg-slate-100 text-slate-900 font-black text-base px-7 py-3.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSending ? <Activity className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {isSending ? 'Sending…' : (resultsData.emailCaptureButtonText || 'Send report')}
              </button>
            </form>
          )}
          {emailError && <div className="text-red-400 text-sm mt-3 font-medium">{emailError}</div>}
        </div>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href={`/roi-calculator?erp=${encodeURIComponent(answers.erp)}&invoices=${answers.volume.invoicesPerMonth * 12}`}
          className="flex items-center gap-4 px-5 py-5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.05] transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center font-black text-slate-400 text-base group-hover:text-white transition-colors">$</div>
          <div>
            <div className="font-bold text-white text-base">{resultsData.ctaRoiTitle || 'Full ROI Calculator'}</div>
            <div className="text-slate-500 text-sm mt-0.5">{resultsData.ctaRoiSubtitle || 'Build a 3-year financial model'}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 ml-auto group-hover:translate-x-1 group-hover:text-white transition-all" />
        </a>
        <a
          href="/contact"
          className="flex items-center gap-4 px-5 py-5 rounded-xl border border-emerald-800/50 hover:border-emerald-700 bg-emerald-950/30 hover:bg-emerald-950/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-900/40 flex items-center justify-center font-black text-emerald-400 text-base">30</div>
          <div>
            <div className="font-bold text-white text-base">{resultsData.ctaContactTitle || 'Talk to the team'}</div>
            <div className="text-slate-500 text-sm mt-0.5">{resultsData.ctaContactSubtitle || '30-min call with a solutions engineer'}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-700 ml-auto group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
        </a>
      </div>
    </div>
  )
}

// ─── MAIN WIZARD COMPONENT ────────────────────────────────────────────────────
export default function AssessmentWizardClient({ initialConfig }: { initialConfig?: any }) {
  const [config, setConfig] = useState<AssessmentConfigData>(DEFAULT_ASSESSMENT_DATA)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswers>(initialAnswers)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [transitioning, setTransitioning] = useState(false)
  const [dir, setDir] = useState<'f' | 'b'>('f')
  const [showTour, setShowTour] = useState(false)

  // Fetch dynamic configuration from /api/site-config
  useEffect(() => {
    async function loadDynamicConfig() {
      try {
        const res = await fetch('/api/site-config')
        if (res.ok) {
          const siteCfg = await res.json()
          if (siteCfg?.assessmentConfig) {
            setConfig({
              intro: { ...DEFAULT_ASSESSMENT_DATA.intro, ...siteCfg.assessmentConfig.intro },
              step1Erp: { ...DEFAULT_ASSESSMENT_DATA.step1Erp, ...siteCfg.assessmentConfig.step1Erp },
              step2Pain: { ...DEFAULT_ASSESSMENT_DATA.step2Pain, ...siteCfg.assessmentConfig.step2Pain },
              step3Volume: {
                ...DEFAULT_ASSESSMENT_DATA.step3Volume,
                ...siteCfg.assessmentConfig.step3Volume,
                benchmarks: {
                  ...DEFAULT_ASSESSMENT_DATA.step3Volume.benchmarks,
                  ...siteCfg.assessmentConfig.step3Volume?.benchmarks
                }
              },
              step4State: { ...DEFAULT_ASSESSMENT_DATA.step4State, ...siteCfg.assessmentConfig.step4State },
              step5Maturity: { ...DEFAULT_ASSESSMENT_DATA.step5Maturity, ...siteCfg.assessmentConfig.step5Maturity },
              step6Urgency: { ...DEFAULT_ASSESSMENT_DATA.step6Urgency, ...siteCfg.assessmentConfig.step6Urgency },
              tourAndResults: { ...DEFAULT_ASSESSMENT_DATA.tourAndResults, ...siteCfg.assessmentConfig.tourAndResults },
            })
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic assessment config:', err)
      }
    }
    loadDynamicConfig()
  }, [])

  // Restore saved answers only — always start from step 0 (intro)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const p = JSON.parse(saved)
        if (p.answers) setAnswers(p.answers)
      }
    } catch {}
    analytics.assessment.start({ source: 'direct' })
  }, [])

  // Show tour only on first visit after entering step 1
  useEffect(() => {
    if (step === 1) {
      const seen = localStorage.getItem('flowtaris-tour-seen')
      if (!seen) {
        setTimeout(() => setShowTour(true), 800)
        localStorage.setItem('flowtaris-tour-seen', '1')
      }
    }
  }, [step])

  // Persist progress
  useEffect(() => {
    if (!result) localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step, ts: Date.now() }))
  }, [answers, step, result])

  const canGo = useMemo(() => {
    if (step === 0) return true
    if (step === 1) return !!answers.erp
    if (step === 2) return answers.painPoints.length > 0
    if (step === 3) return answers.volume.invoicesPerMonth > 0 && answers.volume.employees >= 1
    if (step === 4) return !!answers.currentState
    if (step === 5) return !!answers.techMaturity
    if (step === 6) return !!answers.urgency
    return false
  }, [step, answers])

  const go = useCallback((d: 'f' | 'b') => {
    if (transitioning) return
    setDir(d)
    setTransitioning(true)
    setTimeout(() => {
      setStep(s => d === 'f' ? s + 1 : Math.max(s - 1, 0))
      setTransitioning(false)
    }, 180)
  }, [transitioning])

  // Auto-advance single-select steps
  const lastAns = useRef(answers)
  useEffect(() => {
    if (step !== 0 && [1, 4, 5, 6].includes(step) && canGo && step < 6 && !transitioning) {
      const changed =
        lastAns.current.erp !== answers.erp ||
        lastAns.current.currentState !== answers.currentState ||
        lastAns.current.techMaturity !== answers.techMaturity ||
        lastAns.current.urgency !== answers.urgency;
      
      if (changed) {
        const t = setTimeout(() => go('f'), 350)
        lastAns.current = answers
        return () => clearTimeout(t)
      }
    }
    lastAns.current = answers
  }, [answers.erp, answers.currentState, answers.techMaturity, answers.urgency, step, canGo, transitioning, go])

  // Keyboard nav
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (result) return
      const t = e.target as Element
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return
      if (e.key === 'Enter' && canGo) { e.preventDefault(); step < 6 ? go('f') : handleSubmit() }
      if (e.key === 'ArrowLeft' && step > 0) { e.preventDefault(); go('b') }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [step, canGo, result, go])

  const handleSubmit = async () => {
    if (!canGo) return
    setIsSubmitting(true); setError('')
    try {
      const r = runAssessment(answers)
      setResult(r); setStep(7)
      analytics.assessment.complete({ leadScore: r.leadScore, recommendations: r.recommendations.map(x => x.capability), erp: answers.erp })
      const { data, dbErr } = await insertAssessmentLead({
        answers: answers as unknown as Record<string, unknown>,
        recommendations: r.recommendations.map(x => x.capability),
        lead_score: r.leadScore,
        routed_to: r.leadScore > 70 ? 'sales' : 'nurture',
      }) as any
      if (!dbErr && data) setAssessmentId(data.id)
    } catch (e) {
      console.error(e); setError('Something went wrong — please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const STEP_LABELS = ['ERP', 'Pain Points', 'Volume', 'Current State', 'Tech Maturity', 'Timeline']

  return (
    <div className="min-h-screen" style={{ background: '#0d1117' }}>
      {/* Subtle ambient gradient */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-white/[0.07] bg-[#0d1117]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-6">
          {/* Brand — "Flowtaris" only */}
          <a href="/" className="font-black text-white text-lg tracking-tight hover:text-slate-300 transition-colors flex-shrink-0">
            Flowtaris
          </a>

          {/* Progress — only when in steps */}
          {!result && step > 0 && (
            <div className="flex items-center gap-1.5 flex-1 overflow-x-auto">
              {STEP_LABELS.map((label, i) => {
                const n = i + 1
                const done = n < step
                const cur = n === step
                return (
                  <React.Fragment key={label}>
                    <button
                      onClick={() => done ? setStep(n) : undefined}
                      className={`flex items-center gap-1.5 flex-shrink-0 transition-all ${done ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border transition-all"
                        style={
                          done
                            ? { background: '#3b82f6', borderColor: '#3b82f6', color: 'white' }
                            : cur
                            ? { background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.4)', color: 'white' }
                            : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.2)' }
                        }
                      >
                        {done ? '✓' : n}
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline"
                        style={{ color: cur ? 'rgba(255,255,255,0.9)' : done ? '#60a5fa' : 'rgba(255,255,255,0.2)' }}
                      >{label}</span>
                    </button>
                    {i < 5 && (
                      <div className="w-6 h-px flex-shrink-0" style={{ background: done ? '#3b82f6' : 'rgba(255,255,255,0.07)' }} />
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          )}

          {result && (
            <div className="flex-1 flex justify-end">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-4 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Assessment complete
              </div>
            </div>
          )}

          {!result && step > 0 && (
            <div className="text-xs font-mono font-bold text-slate-600 flex-shrink-0">{step} / 6</div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-14">
        {result ? (
          <Results config={config.tourAndResults} result={result} answers={answers} assessmentId={assessmentId} />
        ) : (
          <div className="max-w-7xl mx-auto px-6 pt-10 pb-28 flex gap-14 items-start">
            {/* Step content with fade transition */}
            <div className="flex-1 min-w-0">
              <div style={{
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? `translateY(${dir === 'f' ? '12px' : '-12px'})` : 'translateY(0)',
                transition: 'opacity 200ms ease, transform 200ms ease',
              }}>
                {step === 0 && <StepIntro config={config.intro} onStart={() => go('f')} />}
                {step === 1 && <StepERP config={config.step1Erp} value={answers.erp} onChange={v => setAnswers(p => ({ ...p, erp: v }))} />}
                {step === 2 && <StepPain config={config.step2Pain} value={answers.painPoints} onChange={v => setAnswers(p => ({ ...p, painPoints: v }))} />}
                {step === 3 && <StepVolume config={config.step3Volume} value={answers.volume} onChange={v => setAnswers(p => ({ ...p, volume: v }))} />}
                {step === 4 && <StepState config={config.step4State} value={answers.currentState} onChange={v => setAnswers(p => ({ ...p, currentState: v }))} />}
                {step === 5 && <StepMaturity config={config.step5Maturity} value={answers.techMaturity} onChange={v => setAnswers(p => ({ ...p, techMaturity: v }))} />}
                {step === 6 && <StepUrgency config={config.step6Urgency} value={answers.urgency} onChange={v => setAnswers(p => ({ ...p, urgency: v }))} />}
              </div>

              {error && (
                <div className="mt-5 text-red-400 text-sm font-medium bg-red-950/40 border border-red-900/40 px-5 py-3.5 rounded-xl">
                  {error}
                </div>
              )}
            </div>

            <Sidebar answers={answers} step={step} benchmarks={config.step3Volume.benchmarks} />
          </div>
        )}
      </div>

      {/* Floating tour tooltip */}
      {showTour && step >= 1 && step <= 3 && !result && (
        <FloatingTour steps={config.tourAndResults.tourSteps} onDismiss={() => setShowTour(false)} />
      )}

      {/* Bottom navigation bar */}
      {step > 0 && !result && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/[0.07] bg-[#0d1117]/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between gap-4">
            {/* Back */}
            <button
              onClick={() => go('b')}
              className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors bg-white/[0.04] hover:bg-white/[0.07] px-5 py-2.5 rounded-lg border border-white/[0.07] hover:border-white/15 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {/* Keyboard hint */}
            <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-700 font-medium">
              <kbd className="bg-white/[0.06] border border-white/10 text-slate-500 px-2 py-0.5 rounded text-[10px] font-mono">Enter</kbd>
              <span>to continue</span>
            </div>

            {/* Continue / Generate */}
            {step < 6 ? (
              <button
                onClick={() => go('f')}
                disabled={!canGo}
                className="flex items-center gap-2.5 text-sm font-black px-8 py-3 rounded-lg transition-all border"
                style={{
                  background: canGo ? 'white' : 'rgba(255,255,255,0.06)',
                  color: canGo ? '#0d1117' : 'rgba(255,255,255,0.25)',
                  borderColor: canGo ? 'white' : 'rgba(255,255,255,0.08)',
                  cursor: canGo ? 'pointer' : 'not-allowed',
                  boxShadow: canGo ? '0 0 20px rgba(255,255,255,0.1)' : 'none',
                }}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canGo || isSubmitting}
                className="flex items-center gap-2.5 text-sm font-black px-8 py-3 rounded-lg transition-all bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ boxShadow: canGo ? '0 0 20px rgba(59,130,246,0.3)' : 'none' }}
              >
                {isSubmitting ? <><Activity className="w-4 h-4 animate-spin" /> Analyzing…</> : <>Generate Roadmap <ArrowRight className="w-4 h-4" /></>}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
