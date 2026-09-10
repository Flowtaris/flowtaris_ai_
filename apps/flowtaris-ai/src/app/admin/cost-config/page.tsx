'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, DollarSign, Settings, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from 'lucide-react'

// UI Components
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
    {children}
  </label>
)

const TextInput = ({ value, onChange, placeholder, type = 'text' }: { value: string | number; onChange: (v: string) => void; placeholder?: string, type?: string }) => (
  <input
    type={type}
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

function Section({
  title, description, icon: Icon, color = 'blue', defaultOpen = true, children,
}: {
  title: string; description: string; icon: React.ElementType; color?: string; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const borderMap: Record<string, string> = {
    blue: 'border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/10',
    amber: 'border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/10',
  }
  const iconMap: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-100 dark:bg-blue-900/50',
    amber: 'text-amber-500 bg-amber-100 dark:bg-amber-900/50',
  }

  return (
    <div className={`mb-8 rounded-2xl border transition-colors overflow-hidden ${borderMap[color] || borderMap.blue}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl ${iconMap[color] || iconMap.blue}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
        <div className="shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      <div className={`px-6 pb-6 pt-2 transition-all duration-300 ${open ? 'block' : 'hidden'}`}>
        <div className="space-y-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          {children}
        </div>
      </div>
    </div>
  )
}

const DEFAULT_COST_CONFIG = {
  eyebrow: 'Cost of Manual Finance Operations Since You Opened This Page',
  ratePerSecond: 8.87,
  industryAverageLabel: 'based on industry average of $280K/year',
  headline: 'Every quarter you delay costs more than our annual contract.',
  subheadline: 'Flowtaris customers stop the bleed in under 60 days.',
  primaryCtaLabel: 'Calculate my actual loss',
  primaryCtaUrl: '/roi-calculator',
  secondaryCtaLabel: 'Start eliminating it',
  secondaryCtaUrl: '/assessment',
}

export default function CostConfigAdminPage() {
  const [config, setConfig] = useState(DEFAULT_COST_CONFIG)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/site-config')
      .then(res => res.json())
      .then(data => {
        if (data.costSectionConfig) {
          setConfig(prev => ({ ...prev, ...data.costSectionConfig }))
        }
      })
      .catch(err => console.error('Failed to load cost config', err))
      .finally(() => setIsLoading(false))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setStatus(null)
    try {
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cost_section_config: config })
      })

      const json = await res.json()
      if (res.ok) {
        setStatus({ type: 'success', msg: 'Cost configuration saved successfully!' })
        setTimeout(() => setStatus(null), 3000)
      } else {
        setStatus({ type: 'error', msg: json.error || 'Failed to save configuration.' })
      }
    } catch (err) {
      console.error(err)
      setStatus({ type: 'error', msg: 'Failed to save configuration.' })
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (field: keyof typeof DEFAULT_COST_CONFIG, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: field === 'ratePerSecond' ? Number(value) : value
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium">Loading configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Cost of Waiting Config</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg mb-6">
          Manage the live ticker, messaging, and CTAs for the bottom "Cost of Waiting" section.
        </p>
        
        {status && (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {status.msg}
          </div>
        )}
      </div>

      <Section title="Header & Counter Configuration" description="Manage the live counter math and messaging" icon={DollarSign} color="amber">
        <div className="space-y-6">
          <div>
            <Label>Eyebrow Label</Label>
            <TextInput value={config.eyebrow} onChange={v => updateField('eyebrow', v)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Loss Rate Per Second ($)</Label>
              <TextInput type="number" value={config.ratePerSecond} onChange={v => updateField('ratePerSecond', v)} />
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">This directly updates the live math on the page.</p>
            </div>
            <div>
              <Label>Disclaimer / Label for Rate</Label>
              <TextInput value={config.industryAverageLabel} onChange={v => updateField('industryAverageLabel', v)} />
            </div>
          </div>

          <div>
            <Label>Main Headline</Label>
            <TextInput value={config.headline} onChange={v => updateField('headline', v)} />
          </div>

          <div>
            <Label>Sub Headline</Label>
            <Textarea value={config.subheadline} onChange={v => updateField('subheadline', v)} rows={2} />
          </div>
        </div>
      </Section>

      <Section title="Call to Actions" description="Manage the buttons below the text" icon={Settings}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3">Primary CTA (Yellow Button)</h3>
            <div>
              <Label>Label</Label>
              <TextInput value={config.primaryCtaLabel} onChange={v => updateField('primaryCtaLabel', v)} />
            </div>
            <div>
              <Label>URL</Label>
              <TextInput value={config.primaryCtaUrl} onChange={v => updateField('primaryCtaUrl', v)} />
            </div>
          </div>

          <div className="space-y-6 p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3">Secondary CTA (Ghost Button)</h3>
            <div>
              <Label>Label</Label>
              <TextInput value={config.secondaryCtaLabel} onChange={v => updateField('secondaryCtaLabel', v)} />
            </div>
            <div>
              <Label>URL</Label>
              <TextInput value={config.secondaryCtaUrl} onChange={v => updateField('secondaryCtaUrl', v)} />
            </div>
          </div>
        </div>
      </Section>

      {/* Floating Save Bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex justify-end z-40">
        <div className="max-w-5xl w-full mx-auto flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  )
}
