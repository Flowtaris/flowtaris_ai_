'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ImageIcon, Target, Plus, Trash2, Home, Link as LinkIcon, Navigation, Shield } from 'lucide-react'

// ── Shared primitives ─────────────────────────────────────────────────────────

const Label = ({ children, htmlFor, className = '' }: { children: React.ReactNode; htmlFor?: string; className?: string }) => (
  <label htmlFor={htmlFor} className={`block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ${className}`}>
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
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5
      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
      focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400
      placeholder-gray-400 disabled:opacity-50 transition-all"
  />
)

const TextArea = ({
  id, value, onChange, rows = 3, placeholder,
}: { id?: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) => (
  <textarea
    id={id}
    value={value}
    onChange={e => onChange(e.target.value)}
    rows={rows}
    placeholder={placeholder}
    className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5
      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y
      focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400
      placeholder-gray-400 transition-all"
  />
)

// ── Collapsible Section Wrapper ───────────────────────────────────────────────

function Section({
  title, description, icon: Icon, color = 'blue', defaultOpen = true, children,
}: {
  title: string; description: string; icon: React.ElementType; color?: 'amber' | 'blue' | 'emerald' | 'purple'; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const colors = {
    amber: 'border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/10',
    blue: 'border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/10',
    emerald: 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-900/10',
    purple: 'border-purple-200 dark:border-purple-800/40 bg-purple-50/50 dark:bg-purple-900/10',
  }
  const iconColors = { amber: 'text-amber-500', blue: 'text-blue-500', emerald: 'text-emerald-500', purple: 'text-purple-500' }

  return (
    <div className={`rounded-2xl border ${colors[color]} mb-5 overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color === 'amber' ? 'bg-amber-100 dark:bg-amber-800/30' : color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-800/30' : color === 'purple' ? 'bg-purple-100 dark:bg-purple-800/30' : 'bg-blue-100 dark:bg-blue-800/30'}`}>
            <Icon className={`w-4 h-4 ${iconColors[color]}`} />
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

// ── Image Upload ──────────────────────────────────────────────────────────────

function ImageUpload({
  label, value, onChange, hint,
}: { label: string; value: string; onChange: (url: string) => void; hint?: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [previewError, setPreviewError] = useState(false)

  const handleFile = async (file: File) => {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const name = `hero-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('assets').upload(name, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(name)
      onChange(publicUrl)
      setPreviewError(false)
    } catch (e) {
      alert('Upload failed. Check your Supabase storage bucket permissions.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <div className="flex gap-3 items-start">
        {/* Preview */}
        <div
          className="relative w-28 h-20 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer bg-gray-50 dark:bg-gray-800 hover:border-blue-400 transition-colors group shrink-0"
          onClick={() => fileRef.current?.click()}
        >
          <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
          {uploading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          ) : value && !previewError ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="w-full h-full object-cover" onError={() => setPreviewError(true)} />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <ImageIcon className="w-5 h-5" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Upload</span>
            </div>
          )}
        </div>
        {/* URL Input */}
        <div className="flex-1">
          <TextInput
            value={value}
            onChange={v => { onChange(v); setPreviewError(false) }}
            placeholder="/images/hero-bg.png or https://..."
          />
          <p className="text-[11px] text-gray-400 mt-1">Paste a URL or click the preview to upload a file.</p>
          {hint && <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">{hint}</p>}
        </div>
      </div>
    </div>
  )
}

// ── Default data ──────────────────────────────────────────────────────────────

const DEFAULT_DATA = {
  header_ctas: {
    assessment: { label: 'Assessment', href: '/assessment' },
    roi: { label: 'ROI', href: '/roi-calculator' },
    coi: { label: 'Cost of Inaction', href: '/cost-of-inaction', mobileLabel: 'COI' },
    corporate: { label: 'Corporate', href: 'https://www.flowtaris.com/' }
  },
  hero: {
    bg_image: '/images/hero-bg.png',
    eyebrow: 'The Future of Enterprise Finance',
    headline_1: 'The Intelligence Layer for',
    headline_2: 'Enterprise Finance.',
    body: 'Watch autonomous AI agents read, decide, and act inside your ERP in real-time. Experience zero-touch document intelligence, self-healing workflows, and predictive analytics that eliminate manual effort.',
    primary_cta: { label: 'Start Your Journey', href: '/assessment' },
    secondary_cta: { label: 'Calculate ROI', href: '/roi-calculator' }
  },
  stats: [
    { value: '200+', label: 'Enterprise Customers' },
    { value: '95%', label: 'Automation Rate' },
    { value: '$50M+', label: 'Annual Savings' },
    { value: '4', label: 'ERP Platforms' }
  ],
  trust_signals_section: {
    title: 'Enterprise-Grade Compliance & Reliability',
    bg_image: ''
  }
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function HeroConfigPage() {
  const [data, setData] = useState(DEFAULT_DATA)
  const [trustSignals, setTrustSignals] = useState<{ id: string, label: string, value: string, imageUrl?: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [signalUploading, setSignalUploading] = useState<Record<number, boolean>>({})
  const signalFileRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg?.trustSignals) {
          setTrustSignals(cfg.trustSignals)
        }
        if (cfg?.heroConfig) {
          setData(prev => ({
            ...prev,
            header_ctas: { ...prev.header_ctas, ...(cfg.heroConfig.header_ctas || {}) },
            hero: { ...prev.hero, ...(cfg.heroConfig.hero || {}) },
            stats: cfg.heroConfig.stats || prev.stats,
            trust_signals_section: cfg.heroConfig.trust_signals_section || prev.trust_signals_section
          }))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updateHeaderCTA = (key: keyof typeof DEFAULT_DATA.header_ctas, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      header_ctas: {
        ...prev.header_ctas,
        [key]: { ...prev.header_ctas[key], [field]: value }
      }
    }))
  }

  const updateHero = (field: keyof typeof DEFAULT_DATA.hero, value: string | object) => {
    setData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }))
  }

  const updateHeroCTA = (key: 'primary_cta' | 'secondary_cta', field: string, value: string) => {
    setData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [key]: { ...prev.hero[key], [field]: value }
      }
    }))
  }

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...data.stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setData(prev => ({ ...prev, stats: newStats }))
  }

  const addStat = () => setData(prev => ({ ...prev, stats: [...prev.stats, { value: 'New', label: 'Stat' }] }))
  const removeStat = (index: number) => {
    const newStats = [...data.stats]
    newStats.splice(index, 1)
    setData(prev => ({ ...prev, stats: newStats }))
  }

  const updateTrustSignalSection = (field: keyof typeof DEFAULT_DATA.trust_signals_section, value: string) => {
    setData(prev => ({
      ...prev,
      trust_signals_section: {
        ...(prev.trust_signals_section || DEFAULT_DATA.trust_signals_section),
        [field]: value
      }
    }))
  }

  const updateTrustSignal = (index: number, field: string, value: string) => {
    const newTs = [...trustSignals]
    newTs[index] = { ...newTs[index], [field]: value }
    setTrustSignals(newTs)
  }

  const addTrustSignal = () => setTrustSignals(prev => [...prev, { id: Math.random().toString(), label: 'New', value: 'Signal' }])
  const removeTrustSignal = (index: number) => {
    const newTs = [...trustSignals]
    newTs.splice(index, 1)
    setTrustSignals(newTs)
  }

  const handleTrustSignalFile = async (index: number, file: File) => {
    setSignalUploading(prev => ({ ...prev, [index]: true }))
    try {
      const ext = file.name.split('.').pop()
      const name = `trust-signal-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('assets').upload(name, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(name)
      updateTrustSignal(index, 'imageUrl', publicUrl)
    } catch {
      alert('Upload failed. Check your Supabase storage bucket permissions.')
    } finally {
      setSignalUploading(prev => ({ ...prev, [index]: false }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setStatus(null)
    try {
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          hero_config: data,
          trust_signals: trustSignals 
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setStatus({ type: 'success', msg: 'Hero & Header configuration saved! Changes go live in ~60 seconds.' })
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Save failed' })
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
          <span>Loading hero configuration…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-blue-500" />
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">Hero & Header Config</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
            Manage the content for the sticky top navigation bar and the main hero section of the homepage.
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs text-blue-500 hover:text-blue-700 underline mt-1">
          Preview on site →
        </a>
      </div>

      {/* Status */}
      {status && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-6 ${status.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400'}`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span className="text-sm">{status.msg}</span>
        </div>
      )}

      <form onSubmit={e => { e.preventDefault(); handleSave() }} className="space-y-2">

        {/* ── SECTION 1: HEADER CTAS ── */}
        <Section title="Header Navigation Buttons" description="The action buttons fixed at the top right of the site" icon={Navigation} color="purple">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30">
              <Label>Assessment Button</Label>
              <div className="space-y-2">
                <TextInput value={data.header_ctas.assessment.label} onChange={v => updateHeaderCTA('assessment', 'label', v)} placeholder="Assessment" />
                <TextInput value={data.header_ctas.assessment.href} onChange={v => updateHeaderCTA('assessment', 'href', v)} placeholder="/assessment" />
              </div>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30">
              <Label>ROI Calculator Button</Label>
              <div className="space-y-2">
                <TextInput value={data.header_ctas.roi.label} onChange={v => updateHeaderCTA('roi', 'label', v)} placeholder="ROI Calculator" />
                <TextInput value={data.header_ctas.roi.href} onChange={v => updateHeaderCTA('roi', 'href', v)} placeholder="/roi-calculator" />
              </div>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30">
              <Label>Cost of Inaction Button</Label>
              <div className="space-y-2">
                <TextInput value={data.header_ctas.coi.label} onChange={v => updateHeaderCTA('coi', 'label', v)} placeholder="Cost of Inaction" />
                <TextInput value={data.header_ctas.coi.mobileLabel} onChange={v => updateHeaderCTA('coi', 'mobileLabel', v)} placeholder="COI (Mobile Text)" />
                <TextInput value={data.header_ctas.coi.href} onChange={v => updateHeaderCTA('coi', 'href', v)} placeholder="/cost-of-inaction" />
              </div>
            </div>
            <div className="p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 bg-amber-50/30 dark:bg-amber-900/10">
              <Label>Corporate Link (Gold)</Label>
              <div className="space-y-2">
                <TextInput value={data.header_ctas.corporate.label} onChange={v => updateHeaderCTA('corporate', 'label', v)} placeholder="Corporate" />
                <TextInput value={data.header_ctas.corporate.href} onChange={v => updateHeaderCTA('corporate', 'href', v)} placeholder="https://www.flowtaris.com/" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── SECTION 2: HERO CONTENT ── */}
        <Section title="Homepage Hero Content" description="The main background, titles, and text on the first screen" icon={Target} color="blue">
          <ImageUpload
            label="Hero Background Image"
            value={data.hero.bg_image}
            onChange={v => updateHero('bg_image', v)}
            hint="The glowing UI background. Should be a large horizontal image (e.g., 1920x1080)."
          />
          
          <Field label="Eyebrow Text (Small uppercase tag)">
            <TextInput value={data.hero.eyebrow} onChange={v => updateHero('eyebrow', v)} placeholder="The Future of Enterprise Finance" />
          </Field>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Field label="Headline Line 1 (White)">
              <TextInput value={data.hero.headline_1} onChange={v => updateHero('headline_1', v)} placeholder="The Intelligence Layer for" />
            </Field>
            <Field label="Headline Line 2 (Gold Gradient + Typing Effect)">
              <TextInput value={data.hero.headline_2} onChange={v => updateHero('headline_2', v)} placeholder="Enterprise Finance." />
            </Field>
          </div>

          <Field label="Body Paragraph">
            <TextArea value={data.hero.body} onChange={v => updateHero('body', v)} rows={4} />
          </Field>
        </Section>

        {/* ── SECTION 3: HERO CTAS ── */}
        <Section title="Hero Action Buttons" description="The two big buttons under the hero text" icon={LinkIcon} color="emerald">
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/20">
              <Label>Primary CTA (Gold)</Label>
              <div className="space-y-3 mt-3">
                <Field label="Label">
                  <TextInput value={data.hero.primary_cta.label} onChange={v => updateHeroCTA('primary_cta', 'label', v)} placeholder="Start Your Journey" />
                </Field>
                <Field label="URL">
                  <TextInput value={data.hero.primary_cta.href} onChange={v => updateHeroCTA('primary_cta', 'href', v)} placeholder="/assessment" />
                </Field>
              </div>
            </div>
            
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30">
              <Label>Secondary CTA (Ghost/White)</Label>
              <div className="space-y-3 mt-3">
                <Field label="Label">
                  <TextInput value={data.hero.secondary_cta.label} onChange={v => updateHeroCTA('secondary_cta', 'label', v)} placeholder="Calculate ROI" />
                </Field>
                <Field label="URL">
                  <TextInput value={data.hero.secondary_cta.href} onChange={v => updateHeroCTA('secondary_cta', 'href', v)} placeholder="/roi-calculator" />
                </Field>
              </div>
            </div>
          </div>
        </Section>

        {/* ── SECTION 4: STATS BAR ── */}
        <Section title="Hero Stats Bar" description="The row of 4 large numbers displayed below the hero buttons" icon={Target} color="amber">
          <div className="space-y-3">
            {data.stats.map((stat, i) => (
              <div key={i} className="flex gap-3 items-start p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                <div className="flex-1">
                  <Label>Stat Value (e.g., 200+)</Label>
                  <TextInput value={stat.value} onChange={v => updateStat(i, 'value', v)} />
                </div>
                <div className="flex-1">
                  <Label>Stat Label (e.g., Enterprise Customers)</Label>
                  <TextInput value={stat.label} onChange={v => updateStat(i, 'label', v)} />
                </div>
                <button type="button" onClick={() => removeStat(i)} className="p-2 mt-6 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addStat}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Stat
            </button>
          </div>
        </Section>

        {/* 4. Trust Signals Config */}
        <Section 
          title="Trust Signals (Compliance & Reliability)" 
          description="Manage compliance boxes and section background." 
          icon={Shield} 
          color="emerald" 
          defaultOpen
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Section Title</Label>
                <TextInput value={data.trust_signals_section?.title || ''} onChange={v => updateTrustSignalSection('title', v)} />
              </div>
            </div>

            <ImageUpload
              label="Section Background Image (Optional)"
              value={data.trust_signals_section?.bg_image || ''}
              onChange={v => updateTrustSignalSection('bg_image', v)}
              hint="Use a dark image for best contrast."
            />

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <Label className="mb-4 text-base">Trust Signal Boxes</Label>
              {trustSignals.map((signal, i) => (
                <div key={i} className="flex gap-4 items-end mb-4 bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  {/* Clickable image upload box */}
                  <div
                    className="w-16 h-16 shrink-0 relative bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 transition-colors group"
                    title="Click to upload image from your computer"
                    onClick={() => signalFileRefs.current[i]?.click()}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={el => { signalFileRefs.current[i] = el }}
                      onChange={e => { if (e.target.files?.[0]) handleTrustSignalFile(i, e.target.files[0]) }}
                    />
                    {signalUploading[i] ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    ) : signal.imageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={signal.imageUrl} alt={signal.value} className="w-full h-full object-contain p-2" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ImageIcon className="w-4 h-4 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-400">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-[8px] font-semibold uppercase tracking-wider">Upload</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label>Value (e.g., GDPR, 99.99%)</Label>
                        <TextInput value={signal.value} onChange={v => updateTrustSignal(i, 'value', v)} />
                      </div>
                      <div>
                        <Label>Label (e.g., Compliant, Uptime SLA)</Label>
                        <TextInput value={signal.label} onChange={v => updateTrustSignal(i, 'label', v)} />
                      </div>
                    </div>
                    <div>
                      <Label>Icon/Logo URL (Optional)</Label>
                      <TextInput value={signal.imageUrl || ''} onChange={v => updateTrustSignal(i, 'imageUrl', v)} placeholder="/images/logo.png" />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeTrustSignal(i)} className="p-2 mb-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTrustSignal}
                className="flex items-center gap-2 text-sm font-bold px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Trust Signal
              </button>
            </div>
          </div>
        </Section>

        {/* Save Button */}
        <div className="sticky bottom-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4 mt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">Changes are saved to the database and go live within ~60 seconds after cache revalidation.</p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all disabled:opacity-60"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
