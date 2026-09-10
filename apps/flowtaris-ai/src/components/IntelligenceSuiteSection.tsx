'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ─── Tool definitions ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: 'assessment', tab: 'AI Readiness Score', href: '/assessment',
    tagline: 'AI Readiness Assessment', ctaLabel: 'Take the Assessment',
    headline: '6 questions. Your personalized AI roadmap.',
    description: 'Answer 6 questions about your ERP stack, pain points, and team — receive a scored roadmap categorising your highest-ROI opportunities into Quick Wins, Strategic plays, and Innovation bets.',
    color: 'indigo' as const,
    metrics: [{ l: 'Completion', v: '~4 min' }, { l: 'Steps', v: '6' }, { l: 'Score tiers', v: '3' }, { l: 'Cost', v: 'Free' }],
  },
  {
    id: 'roi', tab: 'ROI Calculator', href: '/roi-calculator',
    tagline: 'Enterprise ROI Calculator', ctaLabel: 'Calculate My ROI',
    headline: 'Drag a slider. Watch $4.5M appear in real-time.',
    description: 'Enter your invoice volume, team size, and error rate. Our engine outputs annual savings, payback period, FTE freed, and 3-year NPV across 15 global currencies and 5 ERP platforms.',
    color: 'amber' as const,
    metrics: [{ l: 'Currencies', v: '15' }, { l: 'ERP platforms', v: '5' }, { l: 'Avg savings', v: '$4.5M' }, { l: 'Avg payback', v: '3 mo' }],
  },
  {
    id: 'inaction', tab: 'Cost of Waiting', href: '/cost-of-inaction',
    tagline: 'Cost of Inaction Engine', ctaLabel: 'Calculate My Delay Cost',
    headline: 'Every day of delay costs money. See yours live.',
    description: 'Built for CFOs and board decks. Calculates monthly revenue leakage, compliance risk exposure, 3-year competitive gap, and the cost of a 6-month delay — in your local currency.',
    color: 'rose' as const,
    metrics: [{ l: 'Leakage calc', v: 'Live' }, { l: 'Compliance', v: 'Quantified' }, { l: '3-yr model', v: 'Included' }, { l: 'Output', v: 'Board PDF' }],
  },
  {
    id: 'lab', tab: 'Innovation Lab', href: '/innovation-lab',
    tagline: 'Flowtaris Innovation Lab', ctaLabel: 'Explore the Lab',
    headline: 'Where R&D becomes your competitive edge.',
    description: '6 active research tracks — from Conversational ERP at 92% NL-to-SQL accuracy to GenAI Document Understanding at 99.5%+ to Agentic Workflow Orchestration. Battle-tested before reaching your ERP.',
    color: 'violet' as const,
    metrics: [{ l: 'Research tracks', v: '6 active' }, { l: 'Doc AI', v: '99.5%+' }, { l: 'Languages', v: '15+' }, { l: 'Agentic', v: '78%' }],
  },
]

// ─── Color system (sophisticated, not neon) ───────────────────────────────────
const C = {
  indigo: {
    a: '#4f46e5', b: '#818cf8', dim: 'rgba(79,70,229,0.14)', glow: 'rgba(79,70,229,0.2)',
    tab: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300 ring-2 ring-indigo-500/20',
    badge: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
    bar: 'bg-indigo-500', dot: 'bg-indigo-400',
    cta: 'from-indigo-600 to-indigo-800 text-white shadow-[0_8px_30px_rgba(79,70,229,0.4)]',
    scan: '#818cf8', key: '#4f46e5',
  },
  amber: {
    a: '#d97706', b: '#fcd34d', dim: 'rgba(217,119,6,0.14)', glow: 'rgba(217,119,6,0.2)',
    tab: 'border-amber-500/40 bg-amber-500/10 text-amber-300 ring-2 ring-amber-500/20',
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    bar: 'bg-amber-500', dot: 'bg-amber-400',
    cta: 'from-amber-600 to-amber-800 text-white shadow-[0_8px_30px_rgba(217,119,6,0.35)]',
    scan: '#fcd34d', key: '#d97706',
  },
  emerald: {
    a: '#059669', b: '#34d399', dim: 'rgba(5,150,105,0.14)', glow: 'rgba(5,150,105,0.18)',
    tab: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 ring-2 ring-emerald-500/20',
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    bar: 'bg-emerald-500', dot: 'bg-emerald-400',
    cta: 'from-emerald-600 to-emerald-800 text-white shadow-[0_8px_30px_rgba(5,150,105,0.35)]',
    scan: '#34d399', key: '#059669',
  },
  rose: {
    a: '#e11d48', b: '#fb7185', dim: 'rgba(225,29,72,0.12)', glow: 'rgba(225,29,72,0.18)',
    tab: 'border-rose-500/40 bg-rose-500/10 text-rose-300 ring-2 ring-rose-500/20',
    badge: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    bar: 'bg-rose-500', dot: 'bg-rose-400',
    cta: 'from-rose-600 to-rose-900 text-white shadow-[0_8px_30px_rgba(225,29,72,0.35)]',
    scan: '#fb7185', key: '#e11d48',
  },
  violet: {
    a: '#7c3aed', b: '#c084fc', dim: 'rgba(124,58,237,0.14)', glow: 'rgba(124,58,237,0.2)',
    tab: 'border-violet-500/40 bg-violet-500/10 text-violet-300 ring-2 ring-violet-500/20',
    badge: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    bar: 'bg-violet-500', dot: 'bg-violet-400',
    cta: 'from-violet-600 to-violet-900 text-white shadow-[0_8px_30px_rgba(124,58,237,0.4)]',
    scan: '#c084fc', key: '#7c3aed',
  },
}

// ─── Hint bubble (no emoji, clean design) ─────────────────────────────────────
function HintBubble({ text, visible, style, accent }: {
  text: string; visible: boolean; style?: React.CSSProperties; accent: string
}) {
  return (
    <div className="absolute z-30 pointer-events-none transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(4px)',
        ...style,
      }}>
      {/* Arrow */}
      <div className="flex items-center gap-2 backdrop-blur-md rounded-lg border px-3 py-1.5"
        style={{ background: 'rgba(10,8,20,0.85)', borderColor: `${accent}55` }}>
        <div className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: accent }} />
        <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color: accent }}>{text}</span>
      </div>
    </div>
  )
}

// ─── ASSESSMENT: Full 6-step wizard demo ──────────────────────────────────────
const WIZARD_STEPS = [
  { title: 'ERP Platform', q: 'Which ERP do you use?', opts: ['NetSuite', 'SAP', 'Workday', 'Coupa'], sel: 0 },
  { title: 'Pain Points', q: 'Select top pain points', opts: ['Manual Invoice Processing', 'Cash Flow Visibility', 'Integration Failures', 'Compliance Risk'], sel: [0, 1, 3] },
  { title: 'Volume Metrics', q: 'Your monthly volumes', fields: [{ l: 'Invoices/Month', v: '12,500' }, { l: 'Finance Team FTEs', v: '18' }, { l: 'Transactions/Mo', v: '45,000' }] },
  { title: 'Current State', q: 'How do you handle this now?', opts: ['Fully Manual', 'Partial Automation', 'iPaaS Integration', 'Custom Dev'], sel: 1 },
  { title: 'Tech Maturity', q: 'Tech maturity of your org?', opts: ['Legacy Systems', 'Modern Cloud', 'Hybrid', 'AI Pilot Active'], sel: 1 },
  { title: 'Urgency', q: "What's driving your timeline?", opts: ['Exploring Options', 'Budget Approved', 'Board Mandate', 'Audit-Driven'], sel: 2 },
]

function AssessmentPreview({ active }: { active: boolean }) {
  const [step, setStep] = useState(-1) // -1 = not started
  const [selectedOpts, setSelectedOpts] = useState<number | number[]>(-1)
  const [typedFields, setTypedFields] = useState<string[]>([])
  const [showScore, setShowScore] = useState(false)
  const [score, setScore] = useState(0)
  const [hint, setHint] = useState('')
  const [loopCycle, setLoopCycle] = useState(0)

  useEffect(() => {
    if (!active) {
      setStep(-1); setSelectedOpts(-1); setTypedFields([]); setShowScore(false); setScore(0); setHint(''); return
    }
    setStep(-1); setSelectedOpts(-1); setTypedFields([]); setShowScore(false); setScore(0); setHint('')

    const T: NodeJS.Timeout[] = []
    const go = (s: number, delay: number) => {
      T.push(setTimeout(() => {
        setStep(s)
        setSelectedOpts(-1)
        setTypedFields([])
        setShowScore(false)
        setHint(s === 0 ? 'Select to continue' : s === 1 ? 'Pick up to 3' : s === 2 ? 'Enter your volumes' : 'One answer per step')
      }, delay))
    }

    const select = (val: number | number[], delay: number) => {
      T.push(setTimeout(() => setSelectedOpts(val), delay))
    }

    const typeFields = (vals: string[], delay: number) => {
      T.push(setTimeout(() => setTypedFields(vals), delay))
    }

    // Step 0 — ERP Platform
    go(0, 200)
    select(0, 1400) // NetSuite selected
    // Step 1 — Pain Points
    go(1, 2600)
    select([0, 1, 3], 3600)
    // Step 2 — Volume Metrics
    go(2, 4600)
    typeFields(['12,500', '18', '45,000'], 5400)
    // Step 3 — Current State (fast)
    go(3, 6400)
    select(1, 7000)
    // Step 4 — Tech Maturity (fast)
    go(4, 7600)
    select(1, 8100)
    // Step 5 — Urgency (fast)
    go(5, 8600)
    select(2, 9000)
    // Submit
    T.push(setTimeout(() => { setStep(6); setHint('') }, 9600))
    // Score reveal
    T.push(setTimeout(() => {
      setShowScore(true)
      let s = 0
      const iv = setInterval(() => { s += 3; setScore(Math.min(s, 82)); if (s >= 82) clearInterval(iv) }, 20)
      T.push(iv)
    }, 10400))
    // Loop reset
    T.push(setTimeout(() => {
      setStep(-1); setSelectedOpts(-1); setTypedFields([]); setShowScore(false); setScore(0); setHint('')
      T.push(setTimeout(() => setLoopCycle(c => c + 1), 300))
    }, 14700))

    return () => T.forEach(t => clearTimeout(t))
  }, [active, loopCycle])

  const progPct = step < 0 ? 0 : step >= 6 ? 100 : ((step) / 6) * 100
  const ws = step >= 0 && step < 6 ? WIZARD_STEPS[step] : null

  return (
    <div className="h-full flex flex-col gap-2.5 font-['Inter',sans-serif] select-none">
      {/* Progress strip */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-500"
            style={{ width: `${progPct}%` }} />
        </div>
        <span className="text-[9px] text-white/25 font-mono whitespace-nowrap">
          {step < 0 ? 'Ready' : step >= 6 ? 'Complete' : `${step + 1} / 6`}
        </span>
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-1.5 justify-center">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`rounded-full transition-all duration-400 ${
            step > i ? 'w-4 h-1 bg-indigo-500' : step === i ? 'w-5 h-1.5 bg-indigo-400' : 'w-1 h-1 bg-white/[0.12]'
          }`} />
        ))}
      </div>

      {/* Current step card */}
      {ws && (
        <div className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 flex flex-col gap-3 transition-all duration-300 relative overflow-hidden">
          {/* Step label */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-indigo-400/70 uppercase tracking-widest">
              STEP {step + 1}/6 — {ws.title}
            </span>
            {hint && (
              <span className="flex items-center gap-1 text-[9px] text-white/30">
                <div className="w-1 h-1 rounded-full bg-indigo-400/60 animate-pulse" />
                {hint}
              </span>
            )}
          </div>
          <p className="text-white/70 text-[12px] font-semibold">{ws.q}</p>

          {/* Radio options */}
          {'opts' in ws && ws.opts && !Array.isArray(selectedOpts) && (
            <div className="grid grid-cols-2 gap-1.5">
              {ws.opts.map((o, i) => (
                <div key={o} className={`rounded-lg border px-2.5 py-2 text-[11px] font-medium transition-all duration-300 ${
                  selectedOpts === i
                    ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300'
                    : 'border-white/[0.06] text-white/40'
                }`}>{o}</div>
              ))}
            </div>
          )}

          {/* Checkbox options */}
          {'opts' in ws && ws.opts && Array.isArray(selectedOpts) && (
            <div className="space-y-1.5">
              {ws.opts.map((o, i) => {
                const checked = (selectedOpts as number[]).includes(i)
                return (
                  <div key={o} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all duration-300 ${
                    checked ? 'border border-indigo-500/40 bg-indigo-500/10 text-indigo-300' : 'text-white/35'
                  }`}>
                    <div className={`w-3 h-3 rounded border flex items-center justify-center text-[8px] shrink-0 transition-all ${
                      checked ? 'border-indigo-400 bg-indigo-500' : 'border-white/20'
                    }`}>
                      {checked && <span className="text-white font-bold">✓</span>}
                    </div>
                    {o}
                  </div>
                )
              })}
            </div>
          )}

          {/* Number fields */}
          {'fields' in ws && ws.fields && (
            <div className="space-y-2">
              {ws.fields.map((f, i) => (
                <div key={f.l} className="flex items-center gap-2">
                  <span className="text-[9px] text-white/30 w-24 shrink-0">{f.l}</span>
                  <div className={`flex-1 rounded border bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-mono transition-all duration-300 ${
                    typedFields[i] ? 'border-indigo-500/30 text-indigo-300' : 'border-white/[0.08] text-white/20'
                  }`}>
                    {typedFields[i] || '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submitting state */}
      {step === 6 && !showScore && (
        <div className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.02] flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
          <p className="text-[11px] text-white/35">Generating your roadmap…</p>
        </div>
      )}

      {/* Score result */}
      {showScore && (
        <div className="flex-1 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.05] p-4 flex flex-col gap-3">
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black text-indigo-300 tabular-nums leading-none">{score}</span>
            <span className="text-lg text-white/20 mb-1">/100</span>
            <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-[9px] font-bold text-indigo-300">High Potential</span>
            </div>
          </div>
          <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000"
              style={{ width: `${score}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[{ l: 'Quick Wins', v: '3', c: 'text-emerald-400' }, { l: 'Strategic', v: '5', c: 'text-indigo-300' }, { l: 'Innovation', v: '2', c: 'text-violet-300' }].map(k => (
              <div key={k.l} className="text-center rounded-lg border border-white/[0.05] bg-white/[0.02] py-2">
                <p className={`text-base font-black ${k.c}`}>{k.v}</p>
                <p className="text-[8px] text-white/25 uppercase tracking-wide mt-0.5">{k.l}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 h-px bg-white/[0.05]" />
            <span className="text-[9px] text-indigo-400">Get your roadmap emailed</span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ROI CALCULATOR preview ───────────────────────────────────────────────────
function ROIPreview({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0)
  const [volume, setVolume] = useState(0)
  const [savings, setSavings] = useState(0)
  const [showReport, setShowReport] = useState(false)
  const [hint, setHint] = useState('')
  const [loopCycle, setLoopCycle] = useState(0)

  useEffect(() => {
    if (!active) { setPhase(0); setVolume(0); setSavings(0); setShowReport(false); setHint(''); return }
    setPhase(0); setVolume(0); setSavings(0); setShowReport(false); setHint('')
    const T: NodeJS.Timeout[] = []
    T.push(setTimeout(() => { setPhase(1); setHint('Select your ERP platform') }, 300))
    T.push(setTimeout(() => { setPhase(2); setHint('Drag to enter invoice volume') }, 1800))
    const roll = setTimeout(() => {
      setHint('')
      let s = 0
      const iv = setInterval(() => {
        s++; const p = 1 - Math.pow(1 - s / 65, 3)
        setVolume(Math.round(50000 * p)); setSavings(Math.round(4500000 * p))
        if (s >= 65) { clearInterval(iv); setPhase(3); setHint('Your savings projected') }
      }, 22)
      T.push(iv)
    }, 2800)
    T.push(roll)
    T.push(setTimeout(() => { setShowReport(true); setHint('Send full report to CFO') }, 6200))
    T.push(setTimeout(() => {
      setPhase(0); setVolume(0); setSavings(0); setShowReport(false); setHint('')
      T.push(setTimeout(() => setLoopCycle(c => c + 1), 300))
    }, 12000))
    return () => T.forEach(t => clearTimeout(t))
  }, [active, loopCycle])

  return (
    <div className="h-full flex flex-col gap-2.5 font-['Inter',sans-serif] select-none">
      {/* Config */}
      <div className="grid grid-cols-2 gap-2 transition-all duration-500" style={{ opacity: phase >= 1 ? 1 : 0 }}>
        {[{ l: 'ERP Platform', v: 'NetSuite' }, { l: 'Use Case', v: 'AP Automation' }].map(f => (
          <div key={f.l} className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
            <p className="text-[8px] text-white/28 uppercase tracking-widest mb-0.5">{f.l}</p>
            <p className="text-[11px] font-bold text-white">{f.v}</p>
          </div>
        ))}
      </div>

      {/* Slider */}
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition-all duration-500"
        style={{ opacity: phase >= 2 ? 1 : 0 }}>
        <div className="flex justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-amber-400/60 animate-pulse" />
            <p className="text-[9px] text-white/30">Annual Invoice Volume</p>
          </div>
          <p className="text-[11px] font-mono font-black text-amber-300">{volume.toLocaleString()}</p>
        </div>
        <div className="relative h-2 bg-white/[0.06] rounded-full">
          <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-700 to-amber-400 rounded-full"
            style={{ width: `${(volume / 50000) * 100}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#0c0c14] shadow-lg"
            style={{ left: `calc(${(volume / 50000) * 100}% - 8px)` }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[8px] text-white/15">0</span>
          <span className="text-[8px] text-white/15">500K invoices</span>
        </div>
      </div>

      {/* Before / After */}
      <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] p-4 transition-all duration-500"
        style={{ opacity: phase >= 2 ? 1 : 0 }}>
        <p className="text-[8px] text-white/25 uppercase tracking-widest mb-2.5">Annual Cost — Before vs After</p>
        {[
          { l: 'Manual Process', val: '$6.0M', w: 100, c: 'bg-rose-600/60' },
          { l: 'With Flowtaris AI', val: `$${((6000000 - savings) / 1000000).toFixed(1)}M`, w: Math.max(8, 100 - (savings / 4500000) * 62), c: 'bg-gradient-to-r from-amber-700 to-amber-500' },
        ].map(row => (
          <div key={row.l} className="mb-2">
            <div className="flex justify-between text-[9px] mb-1">
              <span className="text-white/30">{row.l}</span>
              <span className={`font-mono font-bold ${row.c.includes('rose') ? 'text-rose-400' : 'text-amber-300'}`}>{row.val}</span>
            </div>
            <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
              <div className={`h-full ${row.c} rounded-full`} style={{ width: `${row.w}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-2 transition-all duration-600"
        style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)' }}>
        {[
          { l: 'Annual Savings', v: `$${(savings / 1000000).toFixed(1)}M`, c: 'text-amber-300' },
          { l: 'Payback Period', v: phase >= 3 ? '3.0 mo' : '—', c: 'text-white/70' },
          { l: 'FTE Freed', v: phase >= 3 ? '12.4' : '—', c: 'text-indigo-300' },
        ].map(k => (
          <div key={k.l} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-2.5 text-center">
            <p className={`text-sm font-black tabular-nums ${k.c}`}>{k.v}</p>
            <p className="text-[7px] text-white/22 uppercase tracking-wider mt-0.5">{k.l}</p>
          </div>
        ))}
      </div>

      {/* Report row */}
      {showReport && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.04] px-3 py-2.5 transition-all duration-500">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <p className="text-[10px] text-white/55 font-medium flex-1">Full ROI report ready</p>
          <span className="text-[9px] text-amber-400 font-semibold">Send to CFO</span>
        </div>
      )}
    </div>
  )
}

// ─── COST OF INACTION preview ─────────────────────────────────────────────────
function InactionPreview({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0)
  const [leakage, setLeakage] = useState(0)
  const [compRisk, setCompRisk] = useState(0)
  const [gap, setGap] = useState(0)
  const [tick, setTick] = useState(0)
  const [showExport, setShowExport] = useState(false)
  const [loopCycle, setLoopCycle] = useState(0)

  useEffect(() => {
    if (!active) { setPhase(0); setLeakage(0); setCompRisk(0); setGap(0); setTick(0); setShowExport(false); return }
    setPhase(0); setLeakage(0); setCompRisk(0); setGap(0); setTick(0); setShowExport(false)
    const T: NodeJS.Timeout[] = []
    T.push(setTimeout(() => setPhase(1), 300))
    const roll = setTimeout(() => {
      let s = 0
      const iv = setInterval(() => {
        s++; const p = 1 - Math.pow(1 - s / 55, 3)
        setLeakage(Math.round(142500 * p)); setCompRisk(Math.round(280000 * p)); setGap(Math.round(3700000 * p))
        if (s >= 55) { clearInterval(iv); setPhase(2) }
      }, 25)
      T.push(iv)
    }, 600)
    T.push(roll)
    const tickIv = setInterval(() => setTick(t => t + 1), 1000)
    T.push(tickIv)
    T.push(setTimeout(() => setPhase(3), 4500))
    T.push(setTimeout(() => { setShowExport(true) }, 7000))
    T.push(setTimeout(() => {
      setPhase(0); setLeakage(0); setCompRisk(0); setGap(0); setTick(0); setShowExport(false)
      T.push(setTimeout(() => setLoopCycle(c => c + 1), 300))
    }, 13000))
    return () => T.forEach(t => clearTimeout(t))
  }, [active, loopCycle])

  return (
    <div className="h-full flex flex-col gap-2.5 font-['Inter',sans-serif] select-none">
      {/* Live bleed */}
      <div className="rounded-2xl border border-rose-500/25 bg-rose-500/[0.06] p-4 relative overflow-hidden transition-all duration-500"
        style={{ opacity: phase >= 1 ? 1 : 0 }}>
        <div className="absolute right-0 top-0 w-24 h-24 rounded-bl-full bg-rose-500/8 pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] text-rose-400/65 uppercase tracking-widest font-bold">Monthly Revenue Leakage</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-[9px] text-rose-400 font-bold">Live</span>
          </div>
        </div>
        <p className="text-[38px] font-black text-rose-200 tabular-nums leading-none">
          ${Math.round(leakage + tick * 4.75).toLocaleString()}
        </p>
        <p className="text-[8px] text-rose-400/35 mt-1.5">Accumulated since page load</p>
      </div>

      {/* 2-col */}
      <div className="grid grid-cols-2 gap-2 transition-all duration-600"
        style={{ opacity: phase >= 2 ? 1 : 0 }}>
        <div className="rounded-xl border border-orange-500/18 bg-orange-500/[0.04] p-3">
          <p className="text-[8px] text-orange-400/55 uppercase tracking-widest mb-1">Annual Compliance Risk</p>
          <p className="text-lg font-black text-orange-200 tabular-nums">${(compRisk / 1000).toFixed(0)}K</p>
        </div>
        <div className="rounded-xl border border-amber-500/18 bg-amber-500/[0.04] p-3">
          <p className="text-[8px] text-amber-400/55 uppercase tracking-widest mb-1">3-Year Competitive Gap</p>
          <p className="text-lg font-black text-amber-100 tabular-nums">${(gap / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Delay bars */}
      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-all duration-600"
        style={{ opacity: phase >= 3 ? 1 : 0 }}>
        <p className="text-[8px] text-white/25 uppercase tracking-widest mb-3">Impact of 6-Month Delay</p>
        {[
          { l: 'Revenue Leakage', pct: 72, c: 'bg-rose-600' },
          { l: 'Compliance Exposure', pct: 55, c: 'bg-orange-600' },
          { l: 'Competitive Erosion', pct: 88, c: 'bg-amber-500' },
        ].map((row, i) => (
          <div key={row.l} className="mb-2">
            <div className="flex justify-between text-[8px] mb-1">
              <span className="text-white/30">{row.l}</span>
              <span className="text-white/35 font-mono">{row.pct}%</span>
            </div>
            <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
              <div className={`h-full ${row.c} rounded-full transition-all duration-1000`}
                style={{ width: phase >= 3 ? `${row.pct}%` : '0%', transitionDelay: `${i * 100}ms` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Export CTA */}
      {showExport && (
        <div className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/[0.04] px-3 py-2.5">
          <div>
            <p className="text-[10px] text-white/55 font-semibold">Board-ready PDF ready</p>
            <p className="text-[8px] text-white/22 mt-0.5">3-year model + benchmarks</p>
          </div>
          <span className="text-[9px] text-rose-300 font-bold">Export</span>
        </div>
      )}
    </div>
  )
}

// ─── INNOVATION LAB preview ───────────────────────────────────────────────────
const LAB_TRACKS = [
  { t: 'GenAI Document Understanding', s: 'production', m: '99.5% accuracy', c: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
  { t: 'Conversational ERP Interface', s: 'beta', m: 'NL→SQL 92%', c: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/25' },
  { t: 'Predictive Finance Models', s: 'pilot', m: '30-day fcst 92%', c: 'text-amber-300 bg-amber-500/10 border-amber-500/25' },
  { t: 'AI Governance & Compliance', s: 'pilot', m: 'EU AI Act ready', c: 'text-amber-300 bg-amber-500/10 border-amber-500/25' },
  { t: 'Agentic Workflow Orchestration', s: 'research', m: '78% success', c: 'text-violet-300 bg-violet-500/10 border-violet-500/25' },
  { t: 'Multimodal Finance Understanding', s: 'research', m: 'Chart ext. 89%', c: 'text-violet-300 bg-violet-500/10 border-violet-500/25' },
]

function LabPreview({ active }: { active: boolean }) {
  const [revealed, setRevealed] = useState(0)
  const [expandedIdx, setExpandedIdx] = useState(-1)
  const [showJoin, setShowJoin] = useState(false)
  const [loopCycle, setLoopCycle] = useState(0)

  useEffect(() => {
    if (!active) { setRevealed(0); setExpandedIdx(-1); setShowJoin(false); return }
    setRevealed(0); setExpandedIdx(-1); setShowJoin(false)
    const T: NodeJS.Timeout[] = []
    let i = 0
    const iv = setInterval(() => { i++; setRevealed(i); if (i >= LAB_TRACKS.length) clearInterval(iv) }, 240)
    T.push(iv)
    T.push(setTimeout(() => setExpandedIdx(1), 2200))
    T.push(setTimeout(() => setExpandedIdx(0), 4500))
    T.push(setTimeout(() => setShowJoin(true), 6000))
    T.push(setTimeout(() => {
      setRevealed(0); setExpandedIdx(-1); setShowJoin(false)
      T.push(setTimeout(() => setLoopCycle(c => c + 1), 300))
    }, 12000))
    return () => T.forEach(t => clearTimeout(t))
  }, [active, loopCycle])

  return (
    <div className="h-full flex flex-col gap-2 font-['Inter',sans-serif] select-none">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[8px] text-white/22 uppercase tracking-widest">Active Research Tracks</p>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-[8px] font-mono text-violet-400">{Math.min(revealed, 6)} / 6</span>
        </div>
      </div>

      {LAB_TRACKS.map((tr, i) => (
        <div key={tr.t}
          className="rounded-xl border border-white/[0.05] bg-white/[0.02] overflow-hidden transition-all duration-500"
          style={{ opacity: i < revealed ? 1 : 0, transform: i < revealed ? 'translateX(0)' : 'translateX(-8px)', transitionDelay: `${i * 30}ms` }}>
          <div className="flex items-center gap-2.5 px-3 py-2.5">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-white/75 truncate">{tr.t}</p>
              {expandedIdx === i && (
                <div className="mt-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-800 delay-200"
                        style={{ width: expandedIdx === i ? '92%' : '0%' }} />
                    </div>
                    <span className="text-[8px] text-violet-400 font-mono">{tr.m}</span>
                  </div>
                </div>
              )}
            </div>
            <span className={`text-[7px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border shrink-0 ${tr.c}`}>
              {tr.s}
            </span>
          </div>
        </div>
      ))}

      {showJoin && (
        <div className="mt-1 flex items-center justify-between rounded-lg border border-violet-500/20 bg-violet-500/[0.04] px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <p className="text-[9px] text-white/50 font-medium">Beta program open</p>
          </div>
          <span className="text-[9px] text-violet-400 font-semibold">Request access</span>
        </div>
      )}
    </div>
  )
}


// ─── Intersection observer ────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Bottom stats ─────────────────────────────────────────────────────────────
const STATS = [
  { v: '$4.5M', l: 'Avg Annual Savings' }, { v: '3 mo', l: 'Avg Payback Period' },
  { v: '99.5%', l: 'Document AI Accuracy' }, { v: '6', l: 'Live R&D Tracks' },
  { v: '15+', l: 'Languages Supported' }, { v: 'Free', l: 'All Tools, No Signup' },
]

// ─── Section header defaults ──────────────────────────────────────────────────
const DEFAULT_SUITE_HEADER = {
  eyebrow: 'The Flowtaris Intelligence Suite',
  headline_1: 'Stop guessing.',
  headline_2: 'Start calculating.',
  description: "Four enterprise-grade tools — built on real benchmarks — that prove AI's financial impact before you sign a contract.",
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function IntelligenceSuiteSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [suiteTools, setSuiteTools] = useState(TOOLS)
  const [suiteHeader, setSuiteHeader] = useState(DEFAULT_SUITE_HEADER)
  const [suiteStats, setSuiteStats] = useState(STATS)
  const { ref: sectionRef, visible: sectionVisible } = useReveal(0.1)
  const router = useRouter()

  // Fetch dynamic config from admin
  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg?.intelligenceSuiteConfig) {
          const saved = cfg.intelligenceSuiteConfig
          if (saved.header) setSuiteHeader(prev => ({ ...prev, ...saved.header }))
          if (saved.tools && Array.isArray(saved.tools)) {
            setSuiteTools(prev => prev.map((t, i) => ({
              ...t,
              ...(saved.tools[i] || {}),
              metrics: saved.tools[i]?.metrics || t.metrics,
            })))
          }
          if (saved.stats && Array.isArray(saved.stats)) {
            setSuiteStats(saved.stats)
          }
        }
      })
      .catch(() => {})
  }, [])

  const tool = suiteTools[activeTab]
  const c = C[tool.color]

  const PREVIEWS = [
    <AssessmentPreview key={`a-${activeTab}`} active={activeTab === 0 && sectionVisible} />,
    <ROIPreview key={`r-${activeTab}`} active={activeTab === 1 && sectionVisible} />,
    <InactionPreview key={`i-${activeTab}`} active={activeTab === 2 && sectionVisible} />,
    <LabPreview key={`l-${activeTab}`} active={activeTab === 3 && sectionVisible} />,
  ]

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative w-full overflow-hidden py-24 lg:py-36"
      aria-labelledby="suite-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.018]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] rounded-full blur-[140px] transition-all duration-1000"
          style={{ background: c.glow, opacity: 0.4 }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="text-center mb-14" style={{
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.035] mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.16em] text-white/40 uppercase">{suiteHeader.eyebrow}</span>
          </div>
          <h2 id="suite-heading" className="text-3xl sm:text-4xl lg:text-[2.8rem] font-black tracking-tight text-white leading-tight mb-5">
            {suiteHeader.headline_1}{' '}
            <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #34d399 50%, #fb7185 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {suiteHeader.headline_2}
            </span>
          </h2>
          <p className="text-[15px] text-white/35 max-w-xl mx-auto leading-relaxed">
            {suiteHeader.description}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" style={{
          opacity: sectionVisible ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s',
        }} role="tablist">
          {suiteTools.map((t, i) => {
            const tc = C[t.color]; const isActive = activeTab === i
            return (
              <button key={t.id} role="tab" aria-selected={isActive}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-full border text-[13px] font-semibold transition-all duration-300 ${
                  isActive ? `${tc.tab} scale-[1.03]` : 'border-white/[0.07] text-white/35 hover:border-white/18 hover:text-white/55 hover:bg-white/[0.03]'
                }`}>
                {t.tab}
              </button>
            )
          })}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center" style={{
          opacity: sectionVisible ? 1 : 0, transition: 'opacity 0.5s ease',
        }}>
          {/* LEFT — description */}
          <div className="flex flex-col gap-6">
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-widest ${c.badge}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
                {tool.tagline}
              </span>
            </div>
            <h3 className="text-2xl lg:text-[1.75rem] font-black text-white leading-tight tracking-tight">{tool.headline}</h3>
            <p className="text-[15px] text-white/38 leading-[1.9]">{tool.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {tool.metrics.map(m => (
                <div key={m.l} className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3.5">
                  <p className="text-lg font-black tabular-nums" style={{ color: c.b }}>{m.v}</p>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider mt-0.5">{m.l}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-1">
              <Link href={(tool as any).ctaHref || tool.href}
                className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-[14px] bg-gradient-to-r ${c.cta} hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group`}>
                {tool.ctaLabel}
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 16 16">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <span className="text-[11px] text-white/20">No signup required</span>
            </div>
          </div>

          {/* RIGHT — Realistic MacBook */}
          <div className="relative flex flex-col items-center">
            {/* Ambient glow */}
            <div className="absolute -inset-8 rounded-[3rem] blur-3xl opacity-20 pointer-events-none transition-all duration-700"
              style={{ background: c.glow }} aria-hidden="true" />

            {/* Laptop wrapper — clickable */}
            <div
              className="relative w-full max-w-[560px] cursor-pointer group"
              onClick={() => router.push(tool.href)}
              title={`Open ${tool.tagline}`}
              role="link"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && router.push(tool.href)}
            >
              {/* ── SCREEN LID ── */}
              <div
                className="relative rounded-[14px] overflow-hidden"
                style={{
                  background: 'linear-gradient(160deg, #2a2a2e 0%, #1c1c1f 40%, #111113 100%)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 50px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
                  padding: '8px 8px 4px',
                }}>
                {/* Camera */}
                <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full"
                  style={{ background: '#111', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.06)' }} />
                {/* Logo notch area */}
                <div className="absolute top-[3px] left-1/2 -translate-x-1/2 translate-x-[-40px] w-1 h-1 rounded-full bg-white/[0.06]" />

                {/* Screen inner glass */}
                <div
                  className="relative rounded-[8px] overflow-hidden"
                  style={{
                    background: '#0a0a10',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
                  }}>
                  {/* Subtle screen reflection */}
                  <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-20"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)' }} />

                  {/* macOS Window chrome */}
                  <div className="flex items-center gap-0 px-3 py-2.5 border-b"
                    style={{ background: '#111117', borderColor: 'rgba(255,255,255,0.05)' }}>
                    {/* Traffic lights */}
                    <div className="flex items-center gap-[5px] mr-4">
                      {['#ff5f57', '#ffbd2e', '#28c840'].map((col, i) => (
                        <div key={i} className="w-[11px] h-[11px] rounded-full" style={{
                          background: col,
                          boxShadow: `0 0 4px ${col}55`,
                          opacity: 0.85,
                        }} />
                      ))}
                    </div>
                    {/* Address bar */}
                    <div className="flex-1 flex items-center bg-white/[0.05] rounded-md px-3 py-1 gap-2">
                      <svg className="w-3 h-3 text-white/20 shrink-0" fill="none" viewBox="0 0 12 12">
                        <path d="M5 9a4 4 0 100-8 4 4 0 000 8zM11 11l-3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      <span className="text-[10px] text-white/25 font-mono flex-1 text-center tracking-wide">
                        flowtaris.ai{tool.href}
                      </span>
                    </div>
                    {/* Live indicator */}
                    <div className="flex items-center gap-1.5 ml-3">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: c.a }} />
                      <span className="text-[9px] font-semibold" style={{ color: c.b }}>Live</span>
                    </div>
                  </div>

                  {/* Tab bar */}
                  <div className="flex gap-0 border-b" style={{ background: '#0d0d14', borderColor: 'rgba(255,255,255,0.04)' }}>
                    {['Page', 'Elements', 'Console'].map((tab, i) => (
                      <div key={tab} className={`px-4 py-1.5 text-[9px] border-b-2 ${
                        i === 0 ? 'text-white/60 border-white/30' : 'text-white/20 border-transparent'
                      }`}>{tab}</div>
                    ))}
                  </div>

                  {/* Screen content */}
                  <div className="p-4 min-h-[400px]" key={`${activeTab}`}>
                    {PREVIEWS[activeTab]}
                  </div>

                  {/* Color scan line */}
                  <div className="h-[1px] w-full opacity-30"
                    style={{ background: `linear-gradient(90deg, transparent 0%, ${c.a} 30%, ${c.b} 70%, transparent 100%)` }} />
                </div>
              </div>



            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-20 pt-10 border-t border-white/[0.04]" style={{
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s',
        }}>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-6">
            {suiteStats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black text-white tabular-nums">{s.v}</p>
                <p className="text-[10px] text-white/22 uppercase tracking-widest mt-0.5 max-w-[110px] mx-auto leading-snug">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
