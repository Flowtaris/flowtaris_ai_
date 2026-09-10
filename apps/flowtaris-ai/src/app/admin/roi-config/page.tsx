'use client'

import { useEffect, useState } from 'react'
import {
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Plus, Trash2,
  Sliders, Database, TrendingUp, DollarSign, Activity, PieChart, BarChart3
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

import { DEFAULT_ROI_CONFIG } from '@/app/roi-calculator/ROICalculatorClient'

export default function AdminROIConfigPage() {
  const [data, setData] = useState<typeof DEFAULT_ROI_CONFIG>(DEFAULT_ROI_CONFIG)
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
          if (cfg?.roiCalculatorConfig) {
            setData(d => ({
              ...d,
              ...cfg.roiCalculatorConfig
            }))
          }
        }
      } catch (err) {
        console.error('Failed to load ROI config:', err)
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
        body: JSON.stringify({ roi_calculator_config: data }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save configuration')

      setSaveStatus({ type: 'success', message: 'ROI configuration saved successfully! Live site is updated.' })
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
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading ROI Configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              Interactive Tools
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-emerald-500" />
            ROI Calculator Configuration
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Customize the live ROI projections, dropdown options, and metric labels shown on the <a href="/roi-calculator" target="_blank" className="text-emerald-600 underline font-medium hover:text-emerald-700">/roi-calculator</a> page.
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

      {/* ── GLOBAL SHUTDOWN ────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 shadow-sm mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Global Shutdown
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Turn this ON to completely hide the ROI calculator from the main frontend navigation and disable the public page.
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

      {/* ── SECTION 1: TOP CONTROLS & DROPDOWNS ──────────────────────────────── */}
      <Section
        title="Top Controls & Dropdowns"
        description="Configure the labels for the ERP and Use Case dropdowns, plus the list of supported platforms."
        icon={Sliders}
        color="emerald"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Platform Dropdown Label">
              <TextInput
                value={data.dropdownLabels.platform}
                onChange={v => setData(d => ({ ...d, dropdownLabels: { ...d.dropdownLabels, platform: v } }))}
              />
            </Field>
            <Field label="Use Case Dropdown Label">
              <TextInput
                value={data.dropdownLabels.useCase}
                onChange={v => setData(d => ({ ...d, dropdownLabels: { ...d.dropdownLabels, useCase: v } }))}
              />
            </Field>
            <Field label="Scale Slider Label">
              <TextInput
                value={data.dropdownLabels.scale}
                onChange={v => setData(d => ({ ...d, dropdownLabels: { ...d.dropdownLabels, scale: v } }))}
              />
            </Field>
          </div>

          {/* Platforms List */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Supported Platforms</Label>
              <button
                type="button"
                onClick={() => {
                  setData(d => ({ ...d, platforms: [...d.platforms, 'New Platform'] }))
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Platform
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.platforms.map((plat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <TextInput
                    value={plat}
                    onChange={v => {
                      const list = [...data.platforms]
                      list[idx] = v
                      setData(d => ({ ...d, platforms: list }))
                    }}
                  />
                  {data.platforms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const list = data.platforms.filter((_, i) => i !== idx)
                        setData(d => ({ ...d, platforms: list }))
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

          {/* Use Cases List */}
          <div className="mt-6 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Use Cases (Primary Focus)</Label>
              <button
                type="button"
                onClick={() => {
                  setData(d => ({ ...d, useCases: [...d.useCases, { id: `uc-${Date.now()}`, label: 'New Use Case' }] }))
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Use Case
              </button>
            </div>
            <div className="space-y-3">
              {data.useCases.map((uc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1 max-w-[200px]">
                     <TextInput
                      value={uc.id}
                      onChange={v => {
                        const list = [...data.useCases]
                        list[idx] = { ...list[idx], id: v }
                        setData(d => ({ ...d, useCases: list }))
                      }}
                      placeholder="Use Case ID (e.g. ap-automation)"
                    />
                  </div>
                  <div className="flex-1">
                    <TextInput
                      value={uc.label}
                      onChange={v => {
                        const list = [...data.useCases]
                        list[idx] = { ...list[idx], label: v }
                        setData(d => ({ ...d, useCases: list }))
                      }}
                      placeholder="Label (e.g. AP Automation & Invoicing)"
                    />
                  </div>
                  {data.useCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const list = data.useCases.filter((_, i) => i !== idx)
                        setData(d => ({ ...d, useCases: list }))
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

      {/* ── SECTION 2: COST OF INACTION BREAKDOWN ────────────────────────────── */}
      <Section
        title="Cost of Inaction Breakdown"
        description="Configure titles and labels for the left-side cost metrics."
        icon={PieChart}
        color="amber"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Section Title">
              <TextInput
                value={data.breakdownLabels.title}
                onChange={v => setData(d => ({ ...d, breakdownLabels: { ...d.breakdownLabels, title: v } }))}
              />
            </Field>
            <Field label="Section Subtitle">
              <TextInput
                value={data.breakdownLabels.subtitle}
                onChange={v => setData(d => ({ ...d, breakdownLabels: { ...d.breakdownLabels, subtitle: v } }))}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <Field label="Metric 1 Label">
              <TextInput
                value={data.breakdownLabels.manual}
                onChange={v => setData(d => ({ ...d, breakdownLabels: { ...d.breakdownLabels, manual: v } }))}
              />
            </Field>
            <Field label="Metric 2 Label">
              <TextInput
                value={data.breakdownLabels.error}
                onChange={v => setData(d => ({ ...d, breakdownLabels: { ...d.breakdownLabels, error: v } }))}
              />
            </Field>
            <Field label="Metric 3 Label">
              <TextInput
                value={data.breakdownLabels.attrition}
                onChange={v => setData(d => ({ ...d, breakdownLabels: { ...d.breakdownLabels, attrition: v } }))}
              />
            </Field>
            <Field label="Metric 4 Label">
              <TextInput
                value={data.breakdownLabels.compliance}
                onChange={v => setData(d => ({ ...d, breakdownLabels: { ...d.breakdownLabels, compliance: v } }))}
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* ── SECTION 3: 3-YEAR PROJECTION ─────────────────────────────────────── */}
      <Section
        title="3-Year Projection Chart"
        description="Configure the labels for the projection chart area."
        icon={BarChart3}
        color="indigo"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Section Title">
              <TextInput
                value={data.projectionLabels.title}
                onChange={v => setData(d => ({ ...d, projectionLabels: { ...d.projectionLabels, title: v } }))}
              />
            </Field>
            <Field label="Section Subtitle">
              <TextInput
                value={data.projectionLabels.subtitle}
                onChange={v => setData(d => ({ ...d, projectionLabels: { ...d.projectionLabels, subtitle: v } }))}
              />
            </Field>
            <Field label="Addressable Spend Label">
              <TextInput
                value={data.projectionLabels.tas}
                onChange={v => setData(d => ({ ...d, projectionLabels: { ...d.projectionLabels, tas: v } }))}
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* ── SECTION 4: MARKET TICKER ─────────────────────────────────────────── */}
      <Section
        title="Live Market Ticker"
        description="The animated ticker running at the top of the ROI calculator."
        icon={Activity}
        color="slate"
      >
        <div className="space-y-4 pt-2">
          <Field label="Ticker Prefix (e.g. 'Live Market Benchmarks')">
            <TextInput
              value={data.tickerPrefix}
              onChange={v => setData(d => ({ ...d, tickerPrefix: v }))}
            />
          </Field>

          <div className="border-t border-gray-100 dark:border-gray-700/60 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Ticker Items</Label>
              <button
                type="button"
                onClick={() => {
                  setData(d => ({ ...d, tickerItems: [...d.tickerItems, 'New Metric...'] }))
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Ticker Item
              </button>
            </div>
            <div className="space-y-3">
              {data.tickerItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <TextInput
                      value={item}
                      onChange={v => {
                        const list = [...data.tickerItems]
                        list[idx] = v
                        setData(d => ({ ...d, tickerItems: list }))
                      }}
                    />
                  </div>
                  {data.tickerItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const list = data.tickerItems.filter((_, i) => i !== idx)
                        setData(d => ({ ...d, tickerItems: list }))
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

      {/* ── SECTION 5: BOTTOM METRICS ────────────────────────────────────────── */}
      <Section
        title="Bottom Summary & CTA"
        description="Labels for the final metrics and the email export form."
        icon={DollarSign}
        color="purple"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Savings Label">
              <TextInput
                value={data.metricLabels.savings}
                onChange={v => setData(d => ({ ...d, metricLabels: { ...d.metricLabels, savings: v } }))}
              />
            </Field>
            <Field label="Payback Label">
              <TextInput
                value={data.metricLabels.payback}
                onChange={v => setData(d => ({ ...d, metricLabels: { ...d.metricLabels, payback: v } }))}
              />
            </Field>
            <Field label="Capacity Label">
              <TextInput
                value={data.metricLabels.capacity}
                onChange={v => setData(d => ({ ...d, metricLabels: { ...d.metricLabels, capacity: v } }))}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <Field label="Button Text (Default)">
              <TextInput
                value={data.metricLabels.ctaText}
                onChange={v => setData(d => ({ ...d, metricLabels: { ...d.metricLabels, ctaText: v } }))}
              />
            </Field>
            <Field label="Button Text (Loading)">
              <TextInput
                value={data.metricLabels.ctaLoading}
                onChange={v => setData(d => ({ ...d, metricLabels: { ...d.metricLabels, ctaLoading: v } }))}
              />
            </Field>
            <Field label="Success Message">
              <TextInput
                value={data.metricLabels.success}
                onChange={v => setData(d => ({ ...d, metricLabels: { ...d.metricLabels, success: v } }))}
              />
            </Field>
          </div>
        </div>
      </Section>
      {/* Save Button */}
      <div className="sticky bottom-0 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-50 rounded-t-xl">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Changes are saved to the database and go live immediately.
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="/roi-calculator"
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
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-2.5 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-60 transition-all cursor-pointer"
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
