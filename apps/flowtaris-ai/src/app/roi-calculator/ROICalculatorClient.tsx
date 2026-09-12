'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { calculateROI } from '@flowtaris/roi-engine'
import { analytics } from '@flowtaris/analytics'
import { ChevronDown, BarChart3, PieChart, Zap, FileText, CheckCircle2, Activity } from 'lucide-react'

export const DEFAULT_ROI_CONFIG = {
  // P2 #14 — Removed: '99.4% confidence (Based on 2.1M verified documents)', renamed ticker from 'Live Market Benchmarks' to 'Industry Benchmarks (Illustrative)'
  shutdown: false,
  tickerPrefix: 'Industry Benchmarks (Illustrative)',
  tickerItems: [
    'Est. Manual AP Cost: $12–15/invoice (source: industry research)',
    'Automation Target: Significant cost reduction potential',
    'Industry Error Rate: 3–5% (industry estimates)',
    'Flowtaris AI: GenAI models designed for enterprise document understanding'
  ],
  platforms: ['NetSuite', 'SAP', 'Coupa', 'Workday', 'Salesforce'],
  useCases: [
    { id: 'ap-automation', label: 'AP Automation & Invoicing' },
    { id: 'po-matching', label: 'PO Reconciliation' },
    { id: 'expense-audit', label: 'Expense & Audit' },
  ],
  dropdownLabels: {
    platform: 'Enterprise Platform',
    useCase: 'Primary Focus',
    scale: 'Scale (Volume & Headcount)'
  },
  breakdownLabels: {
    title: 'Cost of Inaction Breakdown',
    subtitle: 'Your current annual bleed rate.',
    manual: 'Manual Labor',
    error: 'Error Rework',
    attrition: 'Team Attrition',
    compliance: 'Compliance Risk'
  },
  projectionLabels: {
    title: '3-Year Projection',
    subtitle: 'Status Quo vs Flowtaris Agentic AI',
    tas: 'Total Addressable Spend',
    y1: 'Year 1',
    y2: 'Year 2',
    y3: 'Year 3'
  },
  metricLabels: {
    savings: 'Net Annual Savings',
    payback: 'Payback Period',
    capacity: 'FTE Capacity Freed',
    ctaText: 'Export Business Case',
    ctaLoading: 'Generating Report...',
    success: 'Report Sent to Inbox!'
  }
}


function deriveMetrics(sizeIndex: number) {
  const vol = 10000 + Math.pow(sizeIndex / 100, 2) * 490000
  const mins = 15 - (sizeIndex / 100) * 10
  const rate = 45 + (sizeIndex / 100) * 40
  const err = 0.05 - (sizeIndex / 100) * 0.03
  
  const attritionCost = (vol * (mins / 60) / 1920) * 0.15 * 0.3 * (25000 + sizeIndex * 300)
  const complianceCost = 25000 + Math.pow(sizeIndex / 100, 2) * 475000

  return {
    vol: Math.round(vol),
    hrs: mins / 60,
    rate: Math.round(rate),
    err,
    attritionCost: Math.round(attritionCost),
    complianceCost: Math.round(complianceCost)
  }
}

const fmt = (v: number) => `$${Math.round(v).toLocaleString()}`
const fmtM = (v: number) => `$${(v / 1000000).toFixed(2)}M`

// ─── Ticker Component ───────────────────────────────────────────────────────
function MarketTicker({ config }: { config: typeof DEFAULT_ROI_CONFIG }) {
  const date = new Date().toLocaleString('default', { month: 'short', year: 'numeric' })
  return (
    <div className="w-full bg-brand-emerald-500/10 border-b border-brand-emerald-500/20 text-[10px] text-brand-emerald-400 font-mono py-1.5 flex justify-start md:justify-center items-center gap-4 uppercase tracking-widest overflow-x-auto whitespace-nowrap z-40 relative px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <Activity className="w-3 h-3 animate-pulse shrink-0" />
      <span>{config.tickerPrefix} ({date}):</span>
      {config.tickerItems.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="opacity-50">•</span>
          <span>{item}</span>
        </React.Fragment>
      ))}
    </div>
  )
}

// ─── Custom SVG Area Chart ──────────────────────────────────────────────────
function ProjectionChart({ baseCost, newCost, config, sizeIndex }: { baseCost: number, newCost: number, config: typeof DEFAULT_ROI_CONFIG, sizeIndex: number }) {
  const b1 = baseCost, b2 = baseCost * 1.1, b3 = baseCost * 1.21
  const n1 = newCost, n2 = newCost * 0.8, n3 = newCost * 0.82
  const maxVal = Math.max(b3) * 1.1
  // SVG coordinate system: left pad for Y labels, right pad for endpoint labels
  const h = 220, w = 500, padL = 48, padR = 8
  const cw = w - padL - padR  // chart width
  const getY = (val: number) => h - (val / maxVal) * h
  // Points in chart-space, then offset by padL
  const pB = `${padL},${getY(b1)} ${padL + cw/2},${getY(b2)} ${padL + cw},${getY(b3)}`
  const pN = `${padL},${getY(n1)} ${padL + cw/2},${getY(n2)} ${padL + cw},${getY(n3)}`
  const scanX = padL + (sizeIndex / 100) * cw

  return (
    <div className="relative w-full mt-4">
      <svg
        width="100%"
        viewBox={`0 0 ${w} ${h + 28}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
        style={{ display: 'block' }}
      >
        {/* Y-axis labels — inside SVG, no absolute div needed */}
        <text x={padL - 6} y={getY(maxVal) + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.3)" fontFamily="monospace">{fmtM(maxVal)}</text>
        <text x={padL - 6} y={getY(maxVal/2) + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.3)" fontFamily="monospace">{fmtM(maxVal/2)}</text>
        <text x={padL - 6} y={h} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.3)" fontFamily="monospace">$0</text>

        {/* Grid lines */}
        <line x1={padL} y1={getY(maxVal)} x2={padL + cw} y2={getY(maxVal)} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
        <line x1={padL} y1={getY(maxVal/2)} x2={padL + cw} y2={getY(maxVal/2)} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
        <line x1={padL} y1={h} x2={padL + cw} y2={h} stroke="rgba(255,255,255,0.1)" />

        {/* Status quo area + line */}
        <path d={`M ${padL},${h} L ${pB} L ${padL + cw},${h} Z`} fill="url(#gradRed)" opacity={0.3}>
          <animate attributeName="opacity" values="0;0.3" dur="0.7s" fill="freeze" />
        </path>
        <polyline points={pB} fill="none" stroke="#ef4444" strokeWidth={2} />

        {/* Flowtaris area + line */}
        <path d={`M ${padL},${h} L ${pN} L ${padL + cw},${h} Z`} fill="url(#gradGreen)" opacity={0.5}>
          <animate attributeName="opacity" values="0;0.5" dur="0.7s" fill="freeze" />
        </path>
        <polyline points={pN} fill="none" stroke="#10b981" strokeWidth={2.5} />

        {/* End-point dots */}
        <circle cx={padL + cw} cy={getY(b3)} r={4} fill="#ef4444" />
        <circle cx={padL + cw} cy={getY(n3)} r={4} fill="#10b981" />
        <line x1={padL + cw} y1={getY(b3)} x2={padL + cw} y2={getY(n3)} stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" />

        {/* Laser scanner */}
        <g style={{ transform: `translateX(${scanX}px)`, transition: 'transform 0.1s linear' }}>
          <line x1={0} y1={0} x2={0} y2={h} stroke="url(#scannerGlow)" strokeWidth={1.5} />
          <polygon points="-4,0 4,0 0,6" fill="#06b6d4" />
          <polygon points={`-4,${h} 4,${h} 0,${h - 6}`} fill="#06b6d4" />
        </g>

        {/* X-axis labels */}
        <text x={padL} y={h + 18} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">{config.projectionLabels.y1}</text>
        <text x={padL + cw/2} y={h + 18} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">{config.projectionLabels.y2}</text>
        <text x={padL + cw} y={h + 18} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">{config.projectionLabels.y3}</text>

        <defs>
          <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" /><stop offset="100%" stopColor="#ef4444" stopOpacity="0" /></linearGradient>
          <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.8" /><stop offset="100%" stopColor="#10b981" stopOpacity="0" /></linearGradient>
          <linearGradient id="scannerGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0" /><stop offset="50%" stopColor="#06b6d4" stopOpacity="1" /><stop offset="100%" stopColor="#06b6d4" stopOpacity="0" /></linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default function ROICalculatorClient({ initialConfig }: { initialConfig: any }) {
  const config = { ...DEFAULT_ROI_CONFIG, ...initialConfig }
  const [erp, setErp] = useState(config.platforms[0])
  const [useCase, setUseCase] = useState(config.useCases[0].id)
  const [sizeIndex, setSizeIndex] = useState(50)
  const [showTooltip, setShowTooltip] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [showPressEnter, setShowPressEnter] = useState(false)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Please enter valid email')
  const [sent, setSent] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  const m = useMemo(() => deriveMetrics(sizeIndex), [sizeIndex])
  const manCost = m.vol * m.hrs * m.rate
  const errCost = m.vol * m.err * m.hrs * m.rate * 3
  const currentTotal = manCost + errCost + m.attritionCost + m.complianceCost

  const res = useMemo(() => calculateROI({
    annualVolume: m.vol, avgManualHoursPerUnit: m.hrs, hourlyCost: m.rate, errorRate: m.err,
    platform: erp, useCase: useCase, attritionRate: 0.15, avgRecruitmentCost: 25000 + sizeIndex * 300,
    complianceFinesPerYear: m.complianceCost
  }), [m, erp, useCase, sizeIndex])

  const pMan = (manCost / currentTotal) * 100
  const pErr = (errCost / currentTotal) * 100
  const pAttr = (m.attritionCost / currentTotal) * 100
  const pComp = (m.complianceCost / currentTotal) * 100

  useEffect(() => { 
    analytics.roi.open({ source: 'executive-dashboard' }) 
    
    // Auto-scroll animation to draw attention to the slider
    let step = 0
    const interval = setInterval(() => {
      step += 1
      setSizeIndex(50 + Math.sin(step * 0.4) * 20)
      if (step > 15) {
        clearInterval(interval)
        setSizeIndex(50)
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 5000)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [])

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      setShowPressEnter(false)
      setErrorMessage('Please enter valid email')
      setShowErrorPopup(true)
      // Auto-hide error popup after 3 seconds
      setTimeout(() => setShowErrorPopup(false), 3000)
      return
    }

    setShowPressEnter(false)
    setShowErrorPopup(false)

    setIsSimulating(true)
    
    try {
      const resp = await fetch('/api/leads/roi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { 
            erp, 
            useCase, 
            sizeIndex,
            invoiceVolume: m.vol,
            fteCount: Math.ceil((m.vol * m.hrs) / 2000)
          },
          outputs: { 
            res,
            coi: {
              attritionCost: m.attritionCost,
              complianceRisk: m.complianceCost
            }
          },
          email,
          assessment_id: null
        })
      })
      if (!resp.ok) {
        setErrorMessage('Failed to connect to server')
        setShowErrorPopup(true)
        setTimeout(() => setShowErrorPopup(false), 3000)
        throw new Error('Failed to send')
      }
      setSent(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] relative overflow-hidden flex flex-col pt-[80px]">
      <MarketTicker config={config} />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* ── TOP CONTROL BAR ── */}
      <div className="w-full max-w-7xl mx-auto px-6 py-6 z-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col lg:flex-row gap-6 items-center backdrop-blur-xl">
          <div className="flex-1 w-full">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2 block">{config.dropdownLabels.platform}</label>
            <div className="relative">
              <select value={erp} onChange={e => setErp(e.target.value)} className="w-full appearance-none bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-brand-cyan-500 outline-none transition-colors">
                {config.platforms.map((p: string) => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2 block">{config.dropdownLabels.useCase}</label>
            <div className="relative">
              <select value={useCase} onChange={e => setUseCase(e.target.value)} className="w-full appearance-none bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-brand-cyan-500 outline-none transition-colors">
                {config.useCases.map((u: any) => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>
          <div className="flex-[2] w-full px-4 relative">
            <div className="flex justify-between items-end mb-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold flex gap-2 items-center">
                {/* P2 #14 — Removed: 'LIVE DATA SYNC' badge which implies live market connectivity */}
                {config.dropdownLabels.scale}
              </label>
              <span className="text-brand-cyan-400 font-mono text-sm font-bold">{m.vol.toLocaleString()} docs/yr</span>
            </div>
            
            <div className="relative">
              {showTooltip && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.8)] whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-300 z-20">
                  Slide to adjust volume
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                </div>
              )}
              <input type="range" min="0" max="100" value={sizeIndex} onChange={e => { setSizeIndex(parseInt(e.target.value)); setShowTooltip(false); }} 
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-cyan-500 relative z-10" 
              />
            </div>
            
            <div className="flex justify-between mt-2 text-[10px] text-white/30 uppercase tracking-wider">
              <span>SMB</span><span>Mid-Market</span><span>Global Enterprise</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN STAGE ── */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pb-12 z-10 flex flex-col">
        <div className="bg-black/60 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex-1 flex flex-col shadow-2xl shadow-black/50">
          <div className="flex flex-col lg:flex-row gap-12 flex-1">
            <div className="w-full lg:w-1/3 flex flex-col">
              <h2 className="text-xl text-white font-bold mb-1 flex items-center gap-2"><PieChart className="w-5 h-5 text-brand-amber-500" /> {config.breakdownLabels.title}</h2>
              <p className="text-sm text-white/40 mb-8">{config.breakdownLabels.subtitle}</p>
              <div className="flex-1 flex flex-col gap-4 justify-center">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3"><div className="w-1 h-8 bg-brand-cyan-500 rounded-full" /><div><div className="text-xs text-white/50 uppercase tracking-wider font-semibold">{config.breakdownLabels.manual}</div><div className="text-lg font-bold text-white">{fmt(manCost)}</div></div></div>
                  <div className="text-sm font-mono text-brand-cyan-400 bg-brand-cyan-500/10 px-2 py-1 rounded">{pMan.toFixed(1)}%</div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3"><div className="w-1 h-8 bg-brand-amber-500 rounded-full" /><div><div className="text-xs text-white/50 uppercase tracking-wider font-semibold">{config.breakdownLabels.error}</div><div className="text-lg font-bold text-white">{fmt(errCost)}</div></div></div>
                  <div className="text-sm font-mono text-brand-amber-400 bg-brand-amber-500/10 px-2 py-1 rounded">{pErr.toFixed(1)}%</div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3"><div className="w-1 h-8 bg-brand-purple-500 rounded-full" /><div><div className="text-xs text-white/50 uppercase tracking-wider font-semibold">{config.breakdownLabels.attrition}</div><div className="text-lg font-bold text-white">{fmt(m.attritionCost)}</div></div></div>
                  <div className="text-sm font-mono text-brand-purple-400 bg-brand-purple-500/10 px-2 py-1 rounded">{pAttr.toFixed(1)}%</div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3"><div className="w-1 h-8 bg-brand-red-500 rounded-full" /><div><div className="text-xs text-white/50 uppercase tracking-wider font-semibold">{config.breakdownLabels.compliance}</div><div className="text-lg font-bold text-white">{fmt(m.complianceCost)}</div></div></div>
                  <div className="text-sm font-mono text-brand-red-400 bg-brand-red-500/10 px-2 py-1 rounded">{pComp.toFixed(1)}%</div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-2/3 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-3">
                <div>
                  <h2 className="text-xl text-white font-bold mb-1 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-brand-emerald-500" /> {config.projectionLabels.title}</h2>
                  <p className="text-sm text-white/40">{config.projectionLabels.subtitle}</p>
                </div>
                <div className="sm:text-right">
                  <div className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">{config.projectionLabels.tas}</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-brand-red-400">{fmt(currentTotal)} / yr</div>
                </div>
              </div>
              <div className="flex-1 w-full min-w-0">
                <ProjectionChart baseCost={currentTotal} newCost={currentTotal - res.annualSavings} config={config} sizeIndex={sizeIndex} />
              </div>
            </div>
          </div>

          {/* ── BOTTOM METRICS PANEL ── */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 xl:grid-cols-4 gap-6 items-center">
            <div className="col-span-1 xl:border-r border-white/10">
              <div className="text-[11px] text-brand-emerald-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1"><Zap className="w-3 h-3" /> {config.metricLabels.savings}</div>
              <div className="text-4xl lg:text-5xl font-black font-mono text-white tracking-tighter">{fmt(res.annualSavings)}</div>
            </div>
            <div className="col-span-1 xl:border-r border-white/10 xl:pl-6">
              <div className="text-[11px] text-white/40 uppercase tracking-widest font-bold mb-2">{config.metricLabels.payback}</div>
              <div className="text-3xl font-bold text-white">{res.paybackMonths.toFixed(1)} <span className="text-lg text-white/40">mo</span></div>
            </div>
            <div className="col-span-1 xl:pl-6">
              <div className="text-[11px] text-white/40 uppercase tracking-widest font-bold mb-2">{config.metricLabels.capacity}</div>
              <div className="text-3xl font-bold text-white">{res.fteFreed.toFixed(1)} <span className="text-lg text-white/40">heads</span></div>
            </div>
            <div className="col-span-1 flex justify-end">
              {!sent ? (
                <form onSubmit={handleExport} className="w-full max-w-sm flex flex-col gap-2">
                  {/* Email input with live popup feedback */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="CFO@company.com"
                      value={email}
                      onChange={e => {
                        const val = e.target.value
                        setEmail(val)
                        setEmailError('')
                        setShowErrorPopup(false)
                        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/
                        setShowPressEnter(val.length > 0 && emailRegex.test(val))
                      }}
                      className={`w-full bg-white/5 border-2 rounded-lg px-4 py-3 text-sm text-white outline-none transition-all duration-200 ${
                        email.length === 0
                          ? 'border-white/10 focus:border-white/30'
                          : showPressEnter
                          ? 'border-green-500 focus:border-green-400'
                          : 'border-red-500 focus:border-red-400'
                      }`}
                    />
                    {/* Green "Press Enter" popup — below the input */}
                    {showPressEnter && !showErrorPopup && (
                      <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-green-500/30 whitespace-nowrap pointer-events-none z-10">
                        Press Enter
                      </div>
                    )}
                    {/* Red "please enter valid email" popup — below the input */}
                    {showErrorPopup && (
                      <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-red-500/30 whitespace-nowrap pointer-events-none z-10">
                        {errorMessage}
                      </div>
                    )}
                  </div>
                  <button type="submit" disabled={isSimulating} className="w-full bg-brand-emerald-500 hover:bg-brand-emerald-400 text-black font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50 mt-1">
                    {isSimulating ? <Activity className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    {isSimulating ? config.metricLabels.ctaLoading : config.metricLabels.ctaText}
                  </button>
                </form>
              ) : (
                <div className="w-full max-w-sm bg-brand-emerald-500/10 border border-brand-emerald-500/20 p-4 rounded-lg flex flex-col gap-2">
                  <div className="text-brand-emerald-400 text-sm font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> {config.metricLabels.success}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* P2 #15 — ROI Disclaimer: outputs are illustrative estimates based on industry benchmarks, not guaranteed results */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/25 leading-relaxed max-w-3xl mx-auto">
            <span className="font-semibold text-white/35">Illustrative estimates only.</span>{' '}
            Results shown are based on publicly available industry research benchmarks and are designed to illustrate potential value.
            Actual results depend on your specific processes, data quality, ERP configuration, and implementation scope.
            These figures are not a guarantee of performance or savings and should not be relied upon as such.
          </p>
        </div>
      </div>
    </div>
  )
}