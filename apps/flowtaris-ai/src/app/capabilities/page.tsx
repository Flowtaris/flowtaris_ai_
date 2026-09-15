import { getSiteConfig } from '@/lib/supabase'
import { Metadata } from 'next'
import { CapabilityCardList, CtaButtonGroup } from './CapabilityInteractives'

// ─── CAPABILITY REGISTRY ─────────────────────────────────────────────────────
const CAPABILITIES = [
  {
    slug: 'genai-document-intelligence',
    title: 'GenAI Document Intelligence',
    category: 'DOCUMENT PROCESSING',
    maturity: 'production',
    metric: '99.4% extraction accuracy',
    headline: 'Eliminate manual invoice processing at enterprise scale.',
    description: 'AI that reads every invoice, PO, and contract — validates against ERP data — and posts directly to NetSuite, Coupa, or SAP without a human touching it.',
    accent: '#f59e0b',
    accentMuted: 'rgba(245,158,11,0.06)',
    accentBorder: 'rgba(245,158,11,0.2)',
    platforms: ['NetSuite', 'Coupa', 'SAP', 'Workday'],
    keyResult: '$4.5M average annual savings',
  },
  {
    slug: 'autonomous-workflow-engine',
    title: 'Autonomous Workflow Engine',
    category: 'PROCESS AUTOMATION',
    maturity: 'production',
    metric: '92% straight-through rate',
    headline: 'Approval workflows that run themselves.',
    description: 'AI-driven orchestration that routes, escalates, and resolves AP exceptions — across Slack, Teams, and your ERP — without manual intervention.',
    accent: '#10b981',
    accentMuted: 'rgba(16,185,129,0.06)',
    accentBorder: 'rgba(16,185,129,0.2)',
    platforms: ['NetSuite', 'Coupa', 'SAP', 'Workday', 'Slack'],
    keyResult: '4.2 days → 0.3 days approval cycle',
  },
  {
    slug: 'predictive-analytics',
    title: 'Predictive Analytics',
    category: 'FINANCE INTELLIGENCE',
    maturity: 'production',
    metric: '94% forecast accuracy',
    headline: 'From lagging reports to leading signals.',
    description: 'Real-time cash flow forecasting, vendor risk scoring, and spend anomaly detection — updated hourly, not monthly. Your CFO stops flying blind.',
    accent: '#8b5cf6',
    accentMuted: 'rgba(139,92,246,0.06)',
    accentBorder: 'rgba(139,92,246,0.2)',
    platforms: ['NetSuite', 'SAP', 'Workday', 'Coupa', 'Tableau', 'Power BI'],
    keyResult: '12 days early warning lead time',
  },
  {
    slug: 'conversational-erp',
    title: 'Conversational ERP Interface',
    category: 'HUMAN COMPUTER INTERACTION',
    maturity: 'production',
    metric: '80% queries resolved without ERP',
    headline: 'Talk to your ERP. In Slack. In plain English.',
    description: 'Any finance team member can query data, run reports, and execute approved actions against NetSuite, SAP, or Coupa — without opening the ERP UI.',
    accent: '#06b6d4',
    accentMuted: 'rgba(6,182,212,0.06)',
    accentBorder: 'rgba(6,182,212,0.2)',
    platforms: ['NetSuite', 'SAP', 'Coupa', 'Workday', 'Slack', 'Teams'],
    keyResult: '4 min vs 45 min report delivery',
  },
  {
    slug: 'integration-health-monitoring',
    title: 'Integration Health Monitoring',
    category: 'OBSERVABILITY',
    maturity: 'production',
    metric: '8 min mean time to detect',
    headline: 'Know when integrations break — before your finance team does.',
    description: 'Real-time monitoring, anomaly detection, and auto-remediation for every data flow between your ERP and connected systems. 73% of failures fixed automatically.',
    accent: '#ef4444',
    accentMuted: 'rgba(239,68,68,0.06)',
    accentBorder: 'rgba(239,68,68,0.2)',
    platforms: ['MuleSoft', 'NetSuite', 'Coupa', 'SAP', 'Workday', 'Datadog'],
    keyResult: '73% issues auto-remediated',
  },
  {
    slug: 'ai-governance-compliance',
    title: 'AI Governance & Compliance',
    category: 'RISK AND COMPLIANCE',
    maturity: 'production',
    metric: '100% AI decision audit coverage',
    headline: 'AI your auditors can actually audit.',
    description: 'Immutable audit trails, model explainability, SOX-compliant controls, and GDPR/EU AI Act documentation — built in, not bolted on.',
    accent: '#eab308',
    accentMuted: 'rgba(234,179,8,0.06)',
    accentBorder: 'rgba(234,179,8,0.2)',
    platforms: ['NetSuite', 'Coupa', 'SAP', 'Workday', 'ServiceNow', 'Vanta'],
    keyResult: '<24 hr audit pack generation',
  },
]

const COMPARISON = [
  { feature: 'Invoice / Document Extraction', caps: [true, false, false, false, false, false] },
  { feature: 'Approval Workflow Automation', caps: [true, true, false, true, false, false] },
  { feature: 'Cash Flow Forecasting', caps: [false, false, true, false, false, false] },
  { feature: 'Spend Anomaly Detection', caps: [false, false, true, false, true, false] },
  { feature: 'ERP Natural Language Query', caps: [false, false, false, true, false, false] },
  { feature: 'Integration Monitoring', caps: [false, false, false, false, true, false] },
  { feature: 'AI Audit Trail', caps: [true, true, true, true, true, true] },
  { feature: 'SOX / GDPR / EU AI Act', caps: [false, false, false, false, false, true] },
  { feature: 'Slack & Teams Native', caps: [false, true, false, true, true, false] },
  { feature: 'ERP Bidirectional Sync', caps: [true, true, false, false, true, false] },
]

export const metadata: Metadata = {
  title: 'AI Capabilities for Enterprise Finance — NetSuite, Coupa, SAP, Workday | Flowtaris AI',
  description: 'Six production-ready AI capabilities for enterprise finance teams. From GenAI document processing to AI governance. Connects to NetSuite, Coupa, SAP, and Workday.',
  keywords: 'enterprise AI capabilities, finance automation, NetSuite AI, Coupa AI, SAP AI, Workday AI, AP automation, ERP AI',
  alternates: { canonical: 'https://flowtaris.ai/capabilities' },
  openGraph: {
    title: 'AI Capabilities for Enterprise Finance | Flowtaris AI',
    description: 'Six production-ready AI capabilities for NetSuite, Coupa, SAP, and Workday finance teams.',
    url: 'https://flowtaris.ai/capabilities',
    siteName: 'Flowtaris AI',
    type: 'website',
  },
}

export const dynamic = 'force-dynamic';

export default async function CapabilitiesPage() {
  let siteConfig = null;
  try {
    siteConfig = await getSiteConfig();
  } catch (err) {
    console.error("Failed to fetch site config:", err);
  }
  
  let dynamicCapabilities = CAPABILITIES;
  if (siteConfig?.capabilities_section_config?.capabilities) {
    dynamicCapabilities = siteConfig.capabilities_section_config.capabilities;
  }
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Subtle grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(255,255,255,0.04), transparent 70%)' }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-10">
            6 Production-Ready AI Capabilities
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[1.02] tracking-tight text-white mb-8 max-w-4xl mx-auto">
            Enterprise AI. No Pilot Theater.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto mb-16">
            Six capabilities your finance team can deploy in weeks — not quarters. Each one connected to your existing ERP, each one with a measurable ROI.
          </p>
          <CtaButtonGroup 
            primaryText="Find Your Starting Point"
            primaryHref="/assessment"
            secondaryText="Calculate ROI First"
            secondaryHref="/roi-calculator"
          />
        </div>
      </section>

      {/* ── CAPABILITY CARDS ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6" aria-labelledby="capabilities-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="capabilities-heading" className="sr-only">All 6 AI Capabilities</h2>

          <div className="space-y-6">
            <CapabilityCardList capabilities={dynamicCapabilities} />
          </div>
        </div>
      </section>

      {/* ── FEATURE COMPARISON MATRIX ──────────────────────────────────────── */}
      <section className="py-32 px-6 bg-[#0a0a0a] border-t border-white/5" aria-labelledby="compare-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 id="compare-heading" className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-6">
              Which capabilities do you need?
            </h2>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
              Most finance teams start with one capability and expand. This matrix helps you find where Flowtaris AI delivers the most impact for your specific situation.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-6 py-5 text-xs font-bold uppercase tracking-widest text-gray-500 w-[28%]">Capability</th>
                  {dynamicCapabilities.map((cap) => (
                    <th key={cap.slug} className="px-4 py-5 text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cap.accent }}>
                        {cap.title.split(' ').slice(0, 2).join(' ')}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5 text-gray-300 font-medium">{row.feature}</td>
                    {row.caps.map((has, i) => (
                      <td key={i} className="px-4 py-5 text-center">
                        {has
                          ? <span className="inline-block w-5 h-5 rounded-full" style={{ backgroundColor: dynamicCapabilities[i].accentMuted, border: `1.5px solid ${dynamicCapabilities[i].accent}`, color: dynamicCapabilities[i].accent }}>
                              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 p-[3px]"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </span>
                          : <span className="text-gray-700">—</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.02), transparent 70%)' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
            Not sure where to start?
          </h2>
          <p className="text-gray-400 text-xl font-light leading-relaxed mb-14 max-w-2xl mx-auto">
            Take our 3-minute AI Readiness Assessment and get a personalized recommendation of which capability will deliver the fastest ROI for your ERP environment and team size.
          </p>
          <CtaButtonGroup 
            primaryText="Start Free Assessment"
            primaryHref="/assessment"
            secondaryText="Calculate ROI First"
            secondaryHref="/roi-calculator"
          />
        </div>
      </section>
    </div>
  )
}


