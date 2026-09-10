'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const CAPABILITIES = [
  { slug: 'genai-document-intelligence', category: 'Document Processing', name: 'GenAI Document Intelligence', accent: '#6366f1', accentDim: 'rgba(99,102,241,0.08)', accentBorder: 'rgba(99,102,241,0.2)', problem: 'Finance teams lose 23 hours per week manually keying invoices, POs, and receipts into the ERP.', how: 'Our GenAI model extracts, classifies and validates every field across 140+ document types — at human-level context, machine-level speed.', metric: '99.4%', metricLabel: 'extraction accuracy across 2.1M documents processed' },
  { slug: 'autonomous-workflow-engine', category: 'Process Automation', name: 'Autonomous Workflow Engine', accent: '#f59e0b', accentDim: 'rgba(245,158,11,0.08)', accentBorder: 'rgba(245,158,11,0.2)', problem: 'Exception queues grow faster than your team can clear them, stalling approvals for days.', how: 'Flowtaris maps every approval path, learns from past decisions, and auto-resolves exceptions using configurable rule trees and AI judgement.', metric: '91%', metricLabel: 'of exceptions auto-resolved without human touch' },
  { slug: 'predictive-analytics', category: 'Finance Intelligence', name: 'Predictive Analytics', accent: '#10b981', accentDim: 'rgba(16,185,129,0.08)', accentBorder: 'rgba(16,185,129,0.2)', problem: 'Cash flow surprises kill quarter-ends. By the time the ERP shows the gap, it is already too late.', how: 'We train rolling forecast models on your historical transactions, GL patterns, and external signals — surfacing gaps 45 days before they materialise.', metric: '88%', metricLabel: 'forecast accuracy with 45-day early warning window' },
  { slug: 'conversational-erp', category: 'Human-Computer Interaction', name: 'Conversational ERP Interface', accent: '#8b5cf6', accentDim: 'rgba(139,92,246,0.08)', accentBorder: 'rgba(139,92,246,0.2)', problem: 'Your ERP system requires a certification to run a simple vendor aging report.', how: 'Ask in plain English. Flowtaris translates natural language into ERP queries, runs them, and returns structured answers — no training required.', metric: '74%', metricLabel: 'reduction in ERP-related support tickets in 60 days' },
  { slug: 'integration-health-monitoring', category: 'Observability', name: 'Integration Health Monitoring', accent: '#f43f5e', accentDim: 'rgba(244,63,94,0.08)', accentBorder: 'rgba(244,63,94,0.2)', problem: 'Data sync failures between NetSuite and Coupa go undetected for hours, corrupting downstream reports.', how: 'We instrument every API call, data pipeline, and sync job with real-time health probes — alerting your team and auto-healing common failure patterns.', metric: '52m to 4m', metricLabel: 'mean time to detect across 340+ monitored integrations' },
  { slug: 'ai-governance-compliance', category: 'Risk and Compliance', name: 'AI Governance and Compliance', accent: '#06b6d4', accentDim: 'rgba(6,182,212,0.08)', accentBorder: 'rgba(6,182,212,0.2)', problem: 'Auditors ask how the AI made a decision. Most enterprise AI platforms have no answer.', how: 'Every AI action in Flowtaris produces an immutable, human-readable audit record — decision path, confidence score, data inputs, and user override log.', metric: '100%', metricLabel: 'decision traceability. SOC 2 Type II architecture.' },
]

function useIntersection(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function DocIntelVisual({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 260 200" fill="none" className="w-full h-full">
      <rect x="40" y="16" width="140" height="168" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <rect x="40" y="16" width="140" height="24" rx="6" fill="rgba(255,255,255,0.04)"/>
      {[56,70,84,98,112,126,140,154].map((y,i) => (
        <rect key={y} x="56" y={y} width={i%3===2?60:108} height="5" rx="2.5" fill="rgba(255,255,255,0.07)"/>
      ))}
      <rect x="56" y="56" width="108" height="5" rx="2.5" fill={accent} fillOpacity="0.25"/>
      <rect x="56" y="70" width="80" height="5" rx="2.5" fill={accent} fillOpacity="0.18"/>
      <rect x="56" y="98" width="108" height="5" rx="2.5" fill={accent} fillOpacity="0.22"/>
      <line x1="164" y1="58" x2="194" y2="48" stroke={accent} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.6"/>
      <line x1="164" y1="72" x2="194" y2="80" stroke={accent} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.6"/>
      <line x1="164" y1="100" x2="194" y2="110" stroke={accent} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.6"/>
      {[{x:195,y:40,label:'Vendor'},{x:195,y:72,label:'Amount'},{x:195,y:102,label:'PO Ref'}].map(({x,y,label}) => (
        <g key={label}>
          <rect x={x} y={y} width="44" height="16" rx="4" fill={accent} fillOpacity="0.15" stroke={accent} strokeOpacity="0.4" strokeWidth="0.8"/>
          <text x={x+22} y={y+11} textAnchor="middle" fill={accent} fontSize="8" fontFamily="monospace">{label}</text>
        </g>
      ))}
      <rect x="56" y="170" width="64" height="8" rx="4" fill={accent} fillOpacity="0.15"/>
      <text x="88" y="177" textAnchor="middle" fill={accent} fontSize="7" fontFamily="monospace" fontWeight="700">99.4% accurate</text>
    </svg>
  )
}

function WorkflowVisual({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 260 200" fill="none" className="w-full h-full">
      <defs>
        <marker id="wfarr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill={accent} fillOpacity="0.7"/>
        </marker>
      </defs>
      {[{x:16,y:32,label:'Invoice',sub:'Received'},{x:96,y:32,label:'AI',sub:'Validation'},{x:176,y:32,label:'Auto',sub:'Approval'}].map(({x,y,label,sub},i) => (
        <g key={i}>
          <rect x={x} y={y} width="64" height="40" rx="8" fill={i===1?accent:'rgba(255,255,255,0.04)'} fillOpacity={i===1?0.15:1} stroke={i===1?accent:'rgba(255,255,255,0.1)'} strokeOpacity={i===1?0.7:1} strokeWidth="1"/>
          <text x={x+32} y={y+17} textAnchor="middle" fill={i===1?accent:'rgba(255,255,255,0.5)'} fontSize="8" fontFamily="Inter,sans-serif" fontWeight="600">{label}</text>
          <text x={x+32} y={y+30} textAnchor="middle" fill={i===1?accent:'rgba(255,255,255,0.4)'} fontSize="8" fontFamily="Inter,sans-serif">{sub}</text>
        </g>
      ))}
      <path d="M81 52 L95 52" stroke={accent} strokeWidth="1.5" strokeOpacity="0.7" markerEnd="url(#wfarr)"/>
      <path d="M161 52 L175 52" stroke={accent} strokeWidth="1.5" strokeOpacity="0.7" markerEnd="url(#wfarr)"/>
      <path d="M158 72 L158 98 L80 98 L80 118" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 2"/>
      <rect x="50" y="118" width="60" height="30" rx="8" fill={accent} fillOpacity="0.1" stroke={accent} strokeOpacity="0.4" strokeWidth="1"/>
      <text x="80" y="131" textAnchor="middle" fill={accent} fontSize="8" fontFamily="Inter,sans-serif">AI Resolves</text>
      <text x="80" y="142" textAnchor="middle" fill={accent} fontSize="7" fontFamily="monospace" fontWeight="700">Auto</text>
      <rect x="28" y="170" width="88" height="18" rx="5" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
      <text x="72" y="182" textAnchor="middle" fill={accent} fontSize="8" fontFamily="monospace">91% auto-resolved</text>
    </svg>
  )
}

function AnalyticsVisual({ accent }: { accent: string }) {
  const bars = [45,60,52,70,58,80,65,90,72,85,95,78]
  return (
    <svg viewBox="0 0 260 200" fill="none" className="w-full h-full">
      {[40,80,120,160].map(y => (
        <line key={y} x1="26" y1={y} x2="244" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
      ))}
      {bars.map((h,i) => {
        const x=30+i*18; const isAnomaly=i===9
        return <rect key={i} x={x} y={165-h} width="12" height={h} rx="2" fill={isAnomaly?'#f43f5e':accent} fillOpacity={isAnomaly?0.9:0.35}/>
      })}
      <polyline points={bars.map((h,i) => `${35+i*18},${165-h}`).join(' ')} stroke={accent} strokeWidth="1.5" strokeOpacity="0.8" fill="none" strokeLinejoin="round"/>
      <line x1="196" y1="75" x2="210" y2="55" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.8"/>
      <rect x="210" y="42" width="44" height="20" rx="4" fill="rgba(244,63,94,0.12)" stroke="rgba(244,63,94,0.4)" strokeWidth="0.8"/>
      <text x="232" y="52" textAnchor="middle" fill="#f43f5e" fontSize="7" fontFamily="monospace">Anomaly</text>
      <text x="232" y="60" textAnchor="middle" fill="#f43f5e" fontSize="7" fontFamily="monospace">+38% spike</text>
      <rect x="198" y="40" width="1.5" height="125" fill="rgba(255,255,255,0.1)"/>
      <text x="202" y="37" fill="rgba(255,255,255,0.2)" fontSize="6.5" fontFamily="monospace">45-day forecast</text>
      <text x="130" y="192" textAnchor="middle" fill={accent} fontSize="8" fontFamily="monospace">88% forecast accuracy</text>
    </svg>
  )
}

function ConversationalVisual({ accent }: { accent: string }) {
  const lines = [
    {role:'user',text:'Show vendor aging over 60 days',highlight:false},
    {role:'ai',text:'Querying NetSuite...',highlight:false},
    {role:'ai',text:'14 vendors · 2.3M overdue',highlight:true},
    {role:'user',text:'Flag top 3 for escalation',highlight:false},
    {role:'ai',text:'Done. Alerts sent to AP team.',highlight:false},
  ]
  return (
    <svg viewBox="0 0 260 200" fill="none" className="w-full h-full">
      <rect x="16" y="14" width="228" height="170" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
      <rect x="16" y="14" width="228" height="22" rx="10" fill="rgba(255,255,255,0.04)"/>
      <rect x="16" y="26" width="228" height="10" fill="rgba(255,255,255,0.04)"/>
      {['#ff5f57','#ffbd2e','#28c840'].map((c,i) => <circle key={i} cx={30+i*14} cy={25} r="4" fill={c} fillOpacity="0.7"/>)}
      <text x="130" y="29" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="monospace">Flowtaris ERP Chat</text>
      {lines.map(({role,text,highlight},i) => {
        const y=52+i*24; const isUser=role==='user'
        return (
          <g key={i}>
            <rect x={isUser?110:24} y={y-10} width={isUser?120:text.length*5.4+14} height="16" rx="5"
              fill={highlight?accent:(isUser?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.03)')}
              fillOpacity={highlight?0.2:1}
              stroke={highlight?accent:'rgba(255,255,255,0.07)'}
              strokeOpacity={highlight?0.5:1}
              strokeWidth="0.8"/>
            <text x={isUser?170:30} y={y+2} textAnchor={isUser?'middle':'start'}
              fill={highlight?accent:(isUser?'rgba(255,255,255,0.55)':'rgba(255,255,255,0.35)')}
              fontSize="7.5" fontFamily="monospace">{text}</text>
          </g>
        )
      })}
      <rect x="24" y="174" width="4" height="8" rx="1" fill={accent} fillOpacity="0.8"/>
    </svg>
  )
}

function MonitoringVisual({ accent }: { accent: string }) {
  const nodes = [
    {x:130,y:50,label:'Flowtaris',ok:true,central:true},
    {x:40,y:110,label:'NetSuite',ok:true,central:false},
    {x:88,y:152,label:'Coupa',ok:true,central:false},
    {x:172,y:152,label:'SAP',ok:false,central:false},
    {x:220,y:110,label:'Workday',ok:true,central:false},
  ]
  const edges = [[0,1],[0,2],[0,3],[0,4]] as const
  return (
    <svg viewBox="0 0 260 200" fill="none" className="w-full h-full">
      {edges.map(([a,b],i) => {
        const fr=nodes[a],to=nodes[b]; const bad=!to.ok
        return <line key={i} x1={fr.x} y1={fr.y} x2={to.x} y2={to.y} stroke={bad?'#f43f5e':accent} strokeWidth={bad?1.5:1} strokeOpacity={bad?0.8:0.3} strokeDasharray={bad?'4 3':undefined}/>
      })}
      {nodes.map(({x,y,label,ok,central},i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={central?22:16} fill={!ok?'rgba(244,63,94,0.1)':central?`${accent}18`:'rgba(255,255,255,0.03)'} stroke={!ok?'rgba(244,63,94,0.5)':central?accent:'rgba(255,255,255,0.1)'} strokeWidth={central?1.5:1} strokeOpacity={central?0.8:1}/>
          <circle cx={x+(central?13:9)} cy={y-(central?13:9)} r={central?5:4} fill={!ok?'#f43f5e':'#10b981'} fillOpacity="0.9"/>
          <text x={x} y={y+4} textAnchor="middle" fill={!ok?'#f43f5e':central?accent:'rgba(255,255,255,0.4)'} fontSize={central?7:6.5} fontFamily="monospace" fontWeight={central?'700':'400'}>{label}</text>
        </g>
      ))}
      <rect x="156" y="167" width="82" height="22" rx="5" fill="rgba(244,63,94,0.1)" stroke="rgba(244,63,94,0.4)" strokeWidth="0.8"/>
      <text x="197" y="177" textAnchor="middle" fill="#f43f5e" fontSize="7" fontFamily="monospace">SAP sync failure</text>
      <text x="197" y="185" textAnchor="middle" fill="#f43f5e" fontSize="6.5" fontFamily="monospace">Auto-heal triggered</text>
    </svg>
  )
}

function GovernanceVisual({ accent }: { accent: string }) {
  const rows = [
    {action:'Invoice Approved',model:'DocAI v2.4',conf:'98.2%',flag:false},
    {action:'Vendor Created',model:'WorkflowAI',conf:'94.7%',flag:false},
    {action:'PO Matched',model:'MatchAI v1.9',conf:'71.3%',flag:true},
    {action:'Payment Released',model:'GovernAI',conf:'99.1%',flag:false},
  ]
  return (
    <svg viewBox="0 0 260 200" fill="none" className="w-full h-full">
      <rect x="14" y="18" width="232" height="162" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8"/>
      <rect x="14" y="18" width="232" height="22" rx="8" fill="rgba(255,255,255,0.04)"/>
      <rect x="14" y="30" width="232" height="10" fill="rgba(255,255,255,0.04)"/>
      {['Action','Model','Confidence',''].map((h,i) => (
        <text key={i} x={[26,92,160,218][i]} y="33" fill="rgba(255,255,255,0.28)" fontSize="6.5" fontFamily="monospace" fontWeight="700">{h}</text>
      ))}
      {rows.map(({action,model,conf,flag},i) => {
        const y=52+i*32
        return (
          <g key={i}>
            <rect x="14" y={y-10} width="232" height="28" fill={flag?'rgba(244,63,94,0.05)':(i%2===0?'rgba(255,255,255,0.01)':'transparent')} stroke={flag?'rgba(244,63,94,0.12)':'none'}/>
            <text x="26" y={y+6} fill={flag?'#f43f5e':'rgba(255,255,255,0.55)'} fontSize="7" fontFamily="monospace">{action}</text>
            <text x="92" y={y+6} fill="rgba(255,255,255,0.3)" fontSize="6.5" fontFamily="monospace">{model}</text>
            <text x="160" y={y+6} fill={parseFloat(conf)<80?'#f59e0b':accent} fontSize="7" fontFamily="monospace" fontWeight="700">{conf}</text>
            {flag?(
              <g>
                <rect x="210" y={y-5} width="28" height="14" rx="3" fill="rgba(244,63,94,0.2)" stroke="rgba(244,63,94,0.5)" strokeWidth="0.7"/>
                <text x="224" y={y+5} textAnchor="middle" fill="#f43f5e" fontSize="6" fontFamily="monospace">Review</text>
              </g>
            ):(
              <g>
                <circle cx="224" cy={y+2} r="5" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.5)" strokeWidth="0.7"/>
                <text x="224" y={y+5} textAnchor="middle" fill="#10b981" fontSize="8">✓</text>
              </g>
            )}
          </g>
        )
      })}
      <text x="130" y="193" textAnchor="middle" fill={accent} fontSize="7.5" fontFamily="monospace">Full audit trail · SOC 2 Type II</text>
    </svg>
  )
}

type VisualComponent = React.FC<{ accent: string }>
const VISUALS: VisualComponent[] = [DocIntelVisual, WorkflowVisual, AnalyticsVisual, ConversationalVisual, MonitoringVisual, GovernanceVisual]

type Cap = typeof CAPABILITIES[0]

function CapabilityRow({ cap, index, isOpen, onToggle }: { cap: Cap; index: number; isOpen: boolean; onToggle: () => void }) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  useEffect(() => { if (bodyRef.current) setHeight(bodyRef.current.scrollHeight) })
  const Visual = VISUALS[index]
  return (
    <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 text-left transition-all duration-200" style={{ padding: '20px 0' }} aria-expanded={isOpen}>
        <div className="flex items-center gap-3 lg:gap-5 flex-wrap">
          <span className="shrink-0 w-7 text-right font-mono text-sm" style={{ color: isOpen ? cap.accent : 'rgba(255,255,255,0.2)', transition: 'color 0.25s' }}>0{index + 1}</span>
          <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all" style={{ color: isOpen ? cap.accent : 'rgba(255,255,255,0.3)', borderColor: isOpen ? cap.accentBorder : 'rgba(255,255,255,0.06)', background: isOpen ? cap.accentDim : 'transparent' }}>{cap.category}</span>
          <h3 className="font-bold text-base lg:text-lg transition-colors" style={{ color: isOpen ? '#ffffff' : 'rgba(255,255,255,0.55)' }}>{cap.name}</h3>
        </div>
        <svg className="shrink-0 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', color: isOpen ? cap.accent : 'rgba(255,255,255,0.2)' }} width="18" height="18" fill="none" viewBox="0 0 18 18">
          <path d="M7 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{ maxHeight: isOpen ? `${height}px` : '0px', opacity: isOpen ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease' }}>
        <div ref={bodyRef}>
          <div className="flex flex-col lg:flex-row gap-8 pb-10 pl-10">
            <div className="shrink-0 rounded-2xl overflow-hidden" style={{ width: '280px', height: '200px', background: cap.accentDim, border: `1px solid ${cap.accentBorder}` }}>
              <Visual accent={cap.accent} />
            </div>
            <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>The Problem</p>
                  <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif' }}>{cap.problem}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>How Flowtaris Solves It</p>
                  <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif' }}>{cap.how}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                <div>
                  <p className="text-4xl font-black tabular-nums leading-none" style={{ color: cap.accent, fontFamily: 'Inter, sans-serif' }}>{cap.metric}</p>
                  <p className="text-[11px] mt-1 max-w-xs leading-snug" style={{ color: 'rgba(255,255,255,0.35)' }}>{cap.metricLabel}</p>
                </div>
                <Link href={(cap as any).ctaUrl || `/capabilities/${cap.slug}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-[13px] transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5" style={{ background: cap.accentDim, border: `1px solid ${cap.accentBorder}`, color: cap.accent }}>
                  {(cap as any).ctaLabel || 'See how it works'}
                  <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const DEFAULT_CAP_HEADER = {
  eyebrow: 'Platform Capabilities',
  headline_1: 'Here is exactly',
  headline_2: 'how we do it.',
  description: 'Six production-grade AI modules covering the complete finance automation lifecycle. Each one solves a specific, expensive problem.',
  disclaimer: '* Performance metrics are based on aggregate historical data from production implementations. Individual results may vary.',
}

export default function CapabilitiesSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const [capData, setCapData] = useState(CAPABILITIES)
  const [capHeader, setCapHeader] = useState(DEFAULT_CAP_HEADER)
  const { ref, visible } = useIntersection()

  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg?.capabilitiesSectionConfig) {
          const saved = cfg.capabilitiesSectionConfig
          if (saved.header) setCapHeader(prev => ({ ...prev, ...saved.header }))
          if (saved.capabilities && Array.isArray(saved.capabilities)) {
            setCapData(prev => prev.map((t, i) => ({
              ...t,
              ...(saved.capabilities[i] || {}),
            })))
          }
        }
      })
      .catch(() => {})
  }, [])
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative w-full overflow-hidden py-24 lg:py-32" aria-labelledby="capabilities-heading">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.014]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }}/>
        <div className="absolute top-0 right-0 w-1/3 h-1/2 rounded-full blur-[140px] opacity-[0.07] transition-all duration-700" style={{ background: `radial-gradient(ellipse, ${capData[openIndex].accent}, transparent 70%)` }}/>
      </div>
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)' }}>
        <div className="mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-white/25 animate-pulse"/>
            <span className="text-[10px] font-bold tracking-[0.16em] text-white/35 uppercase">{capHeader.eyebrow}</span>
          </div>
          <h2 id="capabilities-heading" className="text-3xl sm:text-4xl lg:text-[2.7rem] font-black tracking-tight text-white leading-tight mb-4">
            {capHeader.headline_1}{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 50%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{capHeader.headline_2}</span>
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)', fontFamily: 'Inter, sans-serif' }}>{capHeader.description}</p>
        </div>
        <div>
          {capData.map((cap, i) => (
            <CapabilityRow key={cap.slug} cap={cap} index={i} isOpen={openIndex === i} onToggle={() => setOpenIndex(i)} />
          ))}
        </div>
        <div className="mt-8 text-right">
          <p className="text-[11px] text-white/30 font-sans">{capHeader.disclaimer}</p>
        </div>
      </div>
    </section>
  )
}