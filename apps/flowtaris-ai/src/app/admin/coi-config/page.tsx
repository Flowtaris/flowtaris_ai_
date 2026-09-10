'use client'

import { useEffect, useState } from 'react'
import {
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Plus, Trash2,
  Sliders, Database, TrendingUp, AlertTriangle, Shield, FileText, DollarSign, Activity, Target
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
  id, value, onChange, placeholder, disabled, type = "text"
}: { id?: string; value: string | number; onChange: (v: string) => void; placeholder?: string; disabled?: boolean; type?: string }) => (
  <input
    id={id}
    type={type}
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5
      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
      focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
      placeholder-gray-400 disabled:opacity-50 transition-all"
  />
)

const Textarea = ({
  id, value, onChange, placeholder, disabled, rows = 3
}: { id?: string; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean; rows?: number }) => (
  <textarea
    id={id}
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    rows={rows}
    className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5
      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y
      focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
      placeholder-gray-400 disabled:opacity-50 transition-all"
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

import { DEFAULT_COI_CONFIG } from '@/app/cost-of-inaction/CostOfInactionClient'

export default function AdminCOIConfigPage() {
  const [data, setData] = useState<typeof DEFAULT_COI_CONFIG>(DEFAULT_COI_CONFIG)
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
          if (cfg?.coiCalculatorConfig) {
            setData(d => ({
              ...d,
              ...cfg.coiCalculatorConfig,
              rightSide: {
                ...d.rightSide,
                ...(cfg.coiCalculatorConfig.rightSide || {})
              }
            }))
          }
        }
      } catch (err) {
        console.error('Failed to load COI config:', err)
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
        body: JSON.stringify({ coi_calculator_config: data }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save configuration')

      setSaveStatus({ type: 'success', message: 'COI configuration saved successfully! Live site is updated.' })
      setTimeout(() => setSaveStatus(null), 5000)
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: err.message || 'Failed to save configuration' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-amber-600">
        <AlertTriangle className="w-8 h-8 animate-pulse mb-3" />
        <p className="font-semibold animate-pulse text-sm">Loading Configuration...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-32 max-w-5xl mx-auto relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              Interactive Tools
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
            Cost of Inaction Configuration
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Customize the default parameters, options, and risk factors for the <a href="/cost-of-inaction" target="_blank" className="text-amber-600 underline font-medium hover:text-amber-700">/cost-of-inaction</a> page.
          </p>
        </div>
      </div>

      {/* Save Notification */}
      {saveStatus && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border transition-all ${
          saveStatus.type === 'success'
            ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300'
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800/60 dark:text-red-300'
        }`}>
          {saveStatus.type === 'success' ? (
             <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-amber-500" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          )}
          <span className="text-sm font-semibold">{saveStatus.message}</span>
        </div>
      )}

      {/* ── GLOBAL SHUTDOWN ────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 shadow-sm mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Global Shutdown
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Turn this ON to completely hide the COI calculator from the main frontend navigation and disable the public page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setData(d => ({ ...d, shutdown: !d.shutdown }))}
          className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
            data.shutdown ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={data.shutdown}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              data.shutdown ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* ── SECTION 1: DEFAULT INPUT VALUES ──────────────────────────────── */}
      <Section
        title="Default Operational Metrics"
        description="Set the default values for the slider inputs when a user lands on the page."
        icon={Sliders}
        color="amber"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Annual Invoices">
              <TextInput
                type="number"
                value={data.defaultValues.annualVolume}
                onChange={v => setData(d => ({ ...d, defaultValues: { ...d.defaultValues, annualVolume: parseInt(v) || 0 } }))}
              />
            </Field>
            <Field label="Minutes per Invoice">
              <TextInput
                type="number"
                value={data.defaultValues.avgManualHours}
                onChange={v => setData(d => ({ ...d, defaultValues: { ...d.defaultValues, avgManualHours: parseInt(v) || 0 } }))}
              />
            </Field>
            <Field label="Loaded Hourly Cost ($)">
              <TextInput
                type="number"
                value={data.defaultValues.hourlyCost}
                onChange={v => setData(d => ({ ...d, defaultValues: { ...d.defaultValues, hourlyCost: parseInt(v) || 0 } }))}
              />
            </Field>
            <Field label="Error & Rework Rate (%)">
              <TextInput
                type="number"
                value={data.defaultValues.errorRate}
                onChange={v => setData(d => ({ ...d, defaultValues: { ...d.defaultValues, errorRate: parseFloat(v) || 0 } }))}
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* ── SECTION 2: DEFAULT RISK FACTORS ──────────────────────────────── */}
      <Section
        title="Default Risk Factors"
        description="Set the default selections for market pressure and compliance requirements."
        icon={Shield}
        color="indigo"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Market Pressure">
              <select
                value={data.defaultValues.competitivePressure}
                onChange={e => setData(d => ({ ...d, defaultValues: { ...d.defaultValues, competitivePressure: e.target.value as any } }))}
                className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Field>
            <Field label="Compliance Requirements">
              <select
                value={data.defaultValues.complianceRequirements}
                onChange={e => setData(d => ({ ...d, defaultValues: { ...d.defaultValues, complianceRequirements: e.target.value as any } }))}
                className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              >
                <option value="none">None</option>
                <option value="basic">Basic</option>
                <option value="strict">Strict</option>
              </select>
            </Field>
            <Field label="Months Delay">
              <TextInput
                type="number"
                value={data.defaultValues.monthsDelay}
                onChange={v => setData(d => ({ ...d, defaultValues: { ...d.defaultValues, monthsDelay: parseInt(v) || 0 } }))}
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* ── SECTION 3: PLATFORMS ─────────────────────────────────────────── */}
      <Section
        title="Platforms"
        description="Configure the list of supported ERP platforms."
        icon={Database}
        color="slate"
      >
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between mb-3">
            <Label>Supported ERPs</Label>
            <button
              type="button"
              onClick={() => {
                setData(d => ({ ...d, platforms: [...d.platforms, { value: 'NewPlatform', label: 'New Platform' }] }))
              }}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Platform
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {data.platforms.map((platform, i) => (
              <div key={i} className="flex items-center gap-2 group relative">
                <div className="flex-1 space-y-2 border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800">
                  <TextInput
                    value={platform.label}
                    onChange={v => {
                      const newPlatforms = [...data.platforms]
                      newPlatforms[i].label = v
                      newPlatforms[i].value = v.replace(/\s+/g, '')
                      setData(d => ({ ...d, platforms: newPlatforms }))
                    }}
                    placeholder="Platform Name"
                  />
                  <div className="text-[10px] text-gray-400 font-mono px-1">val: {platform.value}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newPlatforms = [...data.platforms]
                    newPlatforms.splice(i, 1)
                    setData(d => ({ ...d, platforms: newPlatforms }))
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-50 group-hover:opacity-100"
                  aria-label="Remove platform"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SECTION 4: RIGHT PANEL - SYNTHESIS ───────────────────────────── */}
      <Section title="Executive Synthesis" description="Configure the top narrative paragraph on the right side." icon={FileText} color="blue" defaultOpen={false}>
        <div className="space-y-4 pt-2">
          <Field label="Heading">
            <TextInput value={data.rightSide.executiveSynthesis.heading} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, executiveSynthesis: { ...d.rightSide.executiveSynthesis, heading: v } } }))} />
          </Field>
          <Field label="Badge Text">
            <TextInput value={data.rightSide.executiveSynthesis.badge} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, executiveSynthesis: { ...d.rightSide.executiveSynthesis, badge: v } } }))} />
          </Field>
          <Field label="Paragraph Template" hint="Use {{annualVolume}}, {{avgManualHours}}, {{complianceRequirements}}, {{competitivePressure}}, and {{monthsDelay}} to inject dynamic user inputs.">
            <Textarea rows={6} value={data.rightSide.executiveSynthesis.template} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, executiveSynthesis: { ...d.rightSide.executiveSynthesis, template: v } } }))} />
          </Field>
        </div>
      </Section>

      {/* ── SECTION 5: RIGHT PANEL - MAIN HEADER ─────────────────────────── */}
      <Section title="Main Financial Leakage Header" description="Configure the massive number headline and disclaimers." icon={DollarSign} color="amber" defaultOpen={false}>
        <div className="space-y-4 pt-2">
          <Field label="Eyebrow Text (Above Number)">
            <TextInput value={data.rightSide.mainHeader.eyebrow} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, mainHeader: { ...d.rightSide.mainHeader, eyebrow: v } } }))} />
          </Field>
          <Field label="Subtext (Below Number)">
            <Textarea value={data.rightSide.mainHeader.subtext} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, mainHeader: { ...d.rightSide.mainHeader, subtext: v } } }))} />
          </Field>
          <Field label="Disclaimer (Bottom)">
            <TextInput value={data.rightSide.mainHeader.disclaimer} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, mainHeader: { ...d.rightSide.mainHeader, disclaimer: v } } }))} />
          </Field>
        </div>
      </Section>

      {/* ── SECTION 6: RIGHT PANEL - BREAKDOWN CARDS ─────────────────────── */}
      <Section title="Component Breakdown Cards" description="Configure the three metric cards." icon={Activity} color="indigo" defaultOpen={false}>
        <div className="space-y-8 pt-2">
          <Field label="Section Heading">
            <TextInput value={data.rightSide.breakdown.heading} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, breakdown: { ...d.rightSide.breakdown, heading: v } } }))} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
              <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300 border-b pb-2">Monthly Leakage</h4>
              <Field label="Title"><TextInput value={data.rightSide.breakdown.monthlyLeakage.title} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, breakdown: { ...d.rightSide.breakdown, monthlyLeakage: { ...d.rightSide.breakdown.monthlyLeakage, title: v } } } }))} /></Field>
              <Field label="Subtitle"><TextInput value={data.rightSide.breakdown.monthlyLeakage.subtitle} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, breakdown: { ...d.rightSide.breakdown, monthlyLeakage: { ...d.rightSide.breakdown.monthlyLeakage, subtitle: v } } } }))} /></Field>
              <Field label="Description"><Textarea rows={4} value={data.rightSide.breakdown.monthlyLeakage.description} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, breakdown: { ...d.rightSide.breakdown, monthlyLeakage: { ...d.rightSide.breakdown.monthlyLeakage, description: v } } } }))} /></Field>
            </div>
            <div className="space-y-3 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
              <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300 border-b pb-2">Annual Risk</h4>
              <Field label="Title"><TextInput value={data.rightSide.breakdown.annualRisk.title} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, breakdown: { ...d.rightSide.breakdown, annualRisk: { ...d.rightSide.breakdown.annualRisk, title: v } } } }))} /></Field>
              <Field label="Subtitle"><TextInput value={data.rightSide.breakdown.annualRisk.subtitle} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, breakdown: { ...d.rightSide.breakdown, annualRisk: { ...d.rightSide.breakdown.annualRisk, subtitle: v } } } }))} /></Field>
              <Field label="Description"><Textarea rows={4} value={data.rightSide.breakdown.annualRisk.description} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, breakdown: { ...d.rightSide.breakdown, annualRisk: { ...d.rightSide.breakdown.annualRisk, description: v } } } }))} /></Field>
            </div>
            <div className="space-y-3 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
              <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300 border-b pb-2">Competitive Gap</h4>
              <Field label="Title"><TextInput value={data.rightSide.breakdown.competitiveGap.title} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, breakdown: { ...d.rightSide.breakdown, competitiveGap: { ...d.rightSide.breakdown.competitiveGap, title: v } } } }))} /></Field>
              <Field label="Subtitle"><TextInput value={data.rightSide.breakdown.competitiveGap.subtitle} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, breakdown: { ...d.rightSide.breakdown, competitiveGap: { ...d.rightSide.breakdown.competitiveGap, subtitle: v } } } }))} /></Field>
              <Field label="Description"><Textarea rows={4} value={data.rightSide.breakdown.competitiveGap.description} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, breakdown: { ...d.rightSide.breakdown, competitiveGap: { ...d.rightSide.breakdown.competitiveGap, description: v } } } }))} /></Field>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 7: RIGHT PANEL - COST OF DELAY ───────────────────────── */}
      <Section title="Cost of Delay Scenario" description="Configure the time machine / scenario section." icon={AlertCircle} color="slate" defaultOpen={false}>
        <div className="space-y-4 pt-2">
          <Field label="Heading"><TextInput value={data.rightSide.costOfDelay.heading} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, costOfDelay: { ...d.rightSide.costOfDelay, heading: v } } }))} /></Field>
          <Field label="Subtext"><Textarea value={data.rightSide.costOfDelay.subtext} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, costOfDelay: { ...d.rightSide.costOfDelay, subtext: v } } }))} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Sunk Cost Label"><TextInput value={data.rightSide.costOfDelay.sunkCostLabel} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, costOfDelay: { ...d.rightSide.costOfDelay, sunkCostLabel: v } } }))} /></Field>
            <Field label="Sunk Cost Subtext"><TextInput value={data.rightSide.costOfDelay.sunkCostSubtext} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, costOfDelay: { ...d.rightSide.costOfDelay, sunkCostSubtext: v } } }))} /></Field>
          </div>
        </div>
      </Section>

      {/* ── SECTION 8: RIGHT PANEL - CTA ─────────────────────────────────── */}
      <Section title="Final Call to Action" description="Configure the booking request section." icon={Target} color="emerald" defaultOpen={false}>
        <div className="space-y-4 pt-2">
          <Field label="Heading"><TextInput value={data.rightSide.cta.heading} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, cta: { ...d.rightSide.cta, heading: v } } }))} /></Field>
          <Field label="Subtext"><Textarea value={data.rightSide.cta.subtext} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, cta: { ...d.rightSide.cta, subtext: v } } }))} /></Field>
          <Field label="Button Text"><TextInput value={data.rightSide.cta.buttonText} onChange={v => setData(d => ({ ...d, rightSide: { ...d.rightSide, cta: { ...d.rightSide.cta, buttonText: v } } }))} /></Field>
        </div>
      </Section>

      {/* ── Sticky Save Bar ──────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex justify-end z-40">
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
          <div className="text-sm text-gray-500 font-medium">
            Cost of Inaction Configuration
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all
              bg-amber-600 hover:bg-amber-700 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98]
              disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  )
}
