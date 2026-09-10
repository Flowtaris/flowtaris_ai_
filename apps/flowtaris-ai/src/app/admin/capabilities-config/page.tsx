'use client'

import { useEffect, useState } from 'react'
import {
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  Settings, CheckSquare, Activity, FileText, Share2, Shield, Layout
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
    emerald: 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-900/10',
    rose: 'border-rose-200 dark:border-rose-800/40 bg-rose-50/50 dark:bg-rose-900/10',
    violet: 'border-violet-200 dark:border-violet-800/40 bg-violet-50/50 dark:bg-violet-900/10',
    indigo: 'border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/50 dark:bg-indigo-900/10',
    cyan: 'border-cyan-200 dark:border-cyan-800/40 bg-cyan-50/50 dark:bg-cyan-900/10',
  }
  const iconMap: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-100 dark:bg-blue-800/30',
    amber: 'text-amber-500 bg-amber-100 dark:bg-amber-800/30',
    emerald: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-800/30',
    rose: 'text-rose-500 bg-rose-100 dark:bg-rose-800/30',
    violet: 'text-violet-500 bg-violet-100 dark:bg-violet-800/30',
    indigo: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-800/30',
    cyan: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-800/30',
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

const DEFAULT_HEADER = {
  eyebrow: 'Platform Capabilities',
  headline_1: 'Here is exactly',
  headline_2: 'how we do it.',
  description: 'Six production-grade AI modules covering the complete finance automation lifecycle. Each one solves a specific, expensive problem.',
  disclaimer: '* Performance metrics are based on aggregate historical data from production implementations. Individual results may vary.',
}

const DEFAULT_CAPABILITIES = [
  { slug: 'genai-document-intelligence', category: 'Document Processing', name: 'GenAI Document Intelligence', accent: '#6366f1', problem: 'Finance teams lose 23 hours per week manually keying invoices, POs, and receipts into the ERP.', how: 'Our GenAI model extracts, classifies and validates every field across 140+ document types — at human-level context, machine-level speed.', metric: '99.4%', metricLabel: 'extraction accuracy across 2.1M documents processed', ctaLabel: 'See how it works', ctaUrl: '/capabilities/genai-document-intelligence' },
  { slug: 'autonomous-workflow-engine', category: 'Process Automation', name: 'Autonomous Workflow Engine', accent: '#f59e0b', problem: 'Exception queues grow faster than your team can clear them, stalling approvals for days.', how: 'Flowtaris maps every approval path, learns from past decisions, and auto-resolves exceptions using configurable rule trees and AI judgement.', metric: '91%', metricLabel: 'of exceptions auto-resolved without human touch', ctaLabel: 'See how it works', ctaUrl: '/capabilities/autonomous-workflow-engine' },
  { slug: 'predictive-analytics', category: 'Finance Intelligence', name: 'Predictive Analytics', accent: '#10b981', problem: 'Cash flow surprises kill quarter-ends. By the time the ERP shows the gap, it is already too late.', how: 'We train rolling forecast models on your historical transactions, GL patterns, and external signals — surfacing gaps 45 days before they materialise.', metric: '88%', metricLabel: 'forecast accuracy with 45-day early warning window', ctaLabel: 'See how it works', ctaUrl: '/capabilities/predictive-analytics' },
  { slug: 'conversational-erp', category: 'Human-Computer Interaction', name: 'Conversational ERP Interface', accent: '#8b5cf6', problem: 'Your ERP system requires a certification to run a simple vendor aging report.', how: 'Ask in plain English. Flowtaris translates natural language into ERP queries, runs them, and returns structured answers — no training required.', metric: '74%', metricLabel: 'reduction in ERP-related support tickets in 60 days', ctaLabel: 'See how it works', ctaUrl: '/capabilities/conversational-erp' },
  { slug: 'integration-health-monitoring', category: 'Observability', name: 'Integration Health Monitoring', accent: '#f43f5e', problem: 'Data sync failures between NetSuite and Coupa go undetected for hours, corrupting downstream reports.', how: 'We instrument every API call, data pipeline, and sync job with real-time health probes — alerting your team and auto-healing common failure patterns.', metric: '52m to 4m', metricLabel: 'mean time to detect across 340+ monitored integrations', ctaLabel: 'See how it works', ctaUrl: '/capabilities/integration-health-monitoring' },
  { slug: 'ai-governance-compliance', category: 'Risk and Compliance', name: 'AI Governance and Compliance', accent: '#06b6d4', problem: 'Auditors ask how the AI made a decision. Most enterprise AI platforms have no answer.', how: 'Every AI action in Flowtaris produces an immutable, human-readable audit record — decision path, confidence score, data inputs, and user override log.', metric: '100%', metricLabel: 'decision traceability. SOC 2 Type II architecture.', ctaLabel: 'See how it works', ctaUrl: '/capabilities/ai-governance-compliance' },
]

const CAP_ICONS = [FileText, CheckSquare, Activity, Share2, Settings, Shield]
const CAP_COLORS = ['indigo', 'amber', 'emerald', 'violet', 'rose', 'cyan']

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CapabilitiesConfigPage() {
  const [header, setHeader] = useState(DEFAULT_HEADER)
  const [capabilities, setCapabilities] = useState(DEFAULT_CAPABILITIES)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg?.capabilitiesSectionConfig) {
          const saved = cfg.capabilitiesSectionConfig
          if (saved.header) setHeader(prev => ({ ...prev, ...saved.header }))
          if (saved.capabilities && Array.isArray(saved.capabilities)) {
            setCapabilities(prev => prev.map((t, i) => ({
              ...t,
              ...(saved.capabilities[i] || {}),
            })))
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updateCapability = (index: number, field: string, value: string) => {
    setCapabilities(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
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
        body: JSON.stringify({ capabilities_section_config: { header, capabilities } }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setStatus({ type: 'success', msg: 'Capabilities Section configuration saved! Changes go live in ~60 seconds.' })
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
          <span>Loading Capabilities Section configuration…</span>
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
            <Layout className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-50">Capabilities Config</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 pl-13">
          Manage the &ldquo;Here is exactly how we do it.&rdquo; section — section headline and all 6 capability cards.
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
        <Section title="Section Header" description="The headline displayed above the capabilities." icon={Layout} color="indigo" defaultOpen>
          <div className="space-y-4">
            <div>
              <Label>Eyebrow Label (small pill text above headline)</Label>
              <TextInput value={header.eyebrow} onChange={v => setHeader(p => ({ ...p, eyebrow: v }))} placeholder="Platform Capabilities" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Headline — Line 1 (white text)</Label>
                <TextInput value={header.headline_1} onChange={v => setHeader(p => ({ ...p, headline_1: v }))} placeholder="Here is exactly" />
              </div>
              <div>
                <Label>Headline — Line 2 (gradient colour)</Label>
                <TextInput value={header.headline_2} onChange={v => setHeader(p => ({ ...p, headline_2: v }))} placeholder="how we do it." />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={header.description} onChange={v => setHeader(p => ({ ...p, description: v }))} rows={2} />
            </div>
            <div>
              <Label>Footer Disclaimer</Label>
              <Textarea value={header.disclaimer} onChange={v => setHeader(p => ({ ...p, disclaimer: v }))} rows={2} />
            </div>
          </div>
        </Section>

        {/* 2–7. One collapsible per capability */}
        {capabilities.map((cap, i) => {
          const Icon = CAP_ICONS[i]
          const color = CAP_COLORS[i]
          return (
            <Section
              key={cap.slug}
              title={`Card ${i + 1}: ${cap.name}`}
              description={`Content shown for the "${cap.name}" capability.`}
              icon={Icon}
              color={color}
              defaultOpen={i === 0}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Category / Badge</Label>
                    <TextInput value={cap.category} onChange={v => updateCapability(i, 'category', v)} />
                  </div>
                  <div>
                    <Label>Name / Title</Label>
                    <TextInput value={cap.name} onChange={v => updateCapability(i, 'name', v)} />
                  </div>
                </div>

                <div>
                  <Label>The Problem</Label>
                  <Textarea value={cap.problem} onChange={v => updateCapability(i, 'problem', v)} rows={2} />
                </div>

                <div>
                  <Label>How Flowtaris Solves It</Label>
                  <Textarea value={cap.how} onChange={v => updateCapability(i, 'how', v)} rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Metric Value</Label>
                    <TextInput value={cap.metric} onChange={v => updateCapability(i, 'metric', v)} />
                  </div>
                  <div>
                    <Label>Metric Label</Label>
                    <TextInput value={cap.metricLabel} onChange={v => updateCapability(i, 'metricLabel', v)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>CTA Label</Label>
                    <TextInput value={cap.ctaLabel || ''} onChange={v => updateCapability(i, 'ctaLabel', v)} placeholder="See how it works" />
                  </div>
                  <div>
                    <Label>CTA URL</Label>
                    <TextInput value={cap.ctaUrl || ''} onChange={v => updateCapability(i, 'ctaUrl', v)} placeholder={`/capabilities/${cap.slug}`} />
                  </div>
                </div>

                <div>
                  <Label>Accent Color (Hex)</Label>
                  <TextInput value={cap.accent} onChange={v => updateCapability(i, 'accent', v)} />
                </div>
              </div>
            </Section>
          )
        })}

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
