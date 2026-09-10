'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import {
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ImageIcon, Plus, Trash2,
  Mail, Calendar, Globe, HelpCircle, Shield, ArrowRight, Eye, Sparkles, Building2
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
      focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
      placeholder-gray-400 disabled:opacity-50 transition-all"
  />
)

const TextArea = ({
  id, value, onChange, rows = 3, placeholder,
}: { id?: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) => (
  <textarea
    id={id}
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    rows={rows}
    placeholder={placeholder}
    className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5
      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y
      focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
      placeholder-gray-400 transition-all"
  />
)

// ── Collapsible Section Wrapper ───────────────────────────────────────────────

function Section({
  title, description, icon: Icon, color = 'amber', defaultOpen = true, children,
}: {
  title: string; description: string; icon: React.ElementType; color?: 'amber' | 'blue' | 'emerald' | 'purple' | 'slate'; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const colors = {
    amber: 'border-amber-200 dark:border-amber-800/40 bg-amber-50/40 dark:bg-amber-900/10',
    blue: 'border-blue-200 dark:border-blue-800/40 bg-blue-50/40 dark:bg-blue-900/10',
    emerald: 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-900/10',
    purple: 'border-purple-200 dark:border-purple-800/40 bg-purple-50/40 dark:bg-purple-900/10',
    slate: 'border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30',
  }
  const iconColors = {
    amber: 'text-amber-500',
    blue: 'text-blue-500',
    emerald: 'text-emerald-500',
    purple: 'text-purple-500',
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
            color === 'amber' ? 'bg-amber-100 dark:bg-amber-800/30' :
            color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-800/30' :
            color === 'purple' ? 'bg-purple-100 dark:bg-purple-800/30' :
            color === 'blue' ? 'bg-blue-100 dark:bg-blue-800/30' :
            'bg-gray-200 dark:bg-gray-700'
          }`}>
            <Icon className={`w-4 h-4 ${iconColors[color]}`} />
          </div>
          <div>
            <p className="text-base font-bold text-gray-800 dark:text-gray-100">{title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-6 border-t border-gray-200/60 dark:border-white/5 pt-5">{children}</div>}
    </div>
  )
}

// ── Image Upload Component ────────────────────────────────────────────────────

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
      const name = `contact-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('assets').upload(name, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(name)
      onChange(publicUrl)
      setPreviewError(false)
    } catch (e) {
      alert('Upload failed. You can paste an image URL directly instead.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <div className="flex gap-3 items-start">
        <div
          className="relative w-28 h-20 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer bg-gray-50 dark:bg-gray-800 hover:border-amber-500 transition-colors group shrink-0"
          onClick={() => fileRef.current?.click()}
        >
          <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
          {uploading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin" />
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
        <div className="flex-1">
          <TextInput
            value={value}
            onChange={v => { onChange(v); setPreviewError(false) }}
            placeholder="/images/... or https://..."
          />
          <p className="text-[11px] text-gray-400 mt-1">Paste a URL or click the box to upload.</p>
          {hint && <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5 font-medium">{hint}</p>}
        </div>
      </div>
    </div>
  )
}

// ── Default Contact Configuration ─────────────────────────────────────────────

export const DEFAULT_CONTACT_DATA = {
  hero: {
    badge: 'Response within 4 hours',
    headline_part1: "Let's start",
    headline_highlight: 'something',
    headline_part2: 'real.',
    description: "Every enterprise transformation begins with one conversation. Tell us where your finance ops hurt most — we'll show you exactly how AI removes it.",
    stats: [
      { value: '< 4 hrs', label: 'Avg Response' },
      { value: '3', label: 'Global Offices' },
      { value: '98%', label: 'CSAT Score' },
      { value: '50+', label: 'Team Members' },
    ],
    imageSrc: '/images/contact-hero.png',
    imageAlt: 'Flowtaris global AI finance reach — connecting Palo Alto, London, Singapore',
    floating_card_1: { label: 'Avg Time to Value', value: '21 Days' },
    floating_card_2: { label: 'ROI Achieved By', value: 'Day 47' },
  },
  meeting: {
    calendly_url: 'https://calendly.com/flowtaris-info',
    intent_options: [
      { value: 'calendly', label: 'Auto-Schedule a Meeting', sub: 'Instantly book a time with our enterprise architects via Calendly.', icon: '▶' },
      { value: 'message', label: 'Send a Message', sub: 'Fill out our secure inquiry form and our team will get back to you within 4 hours.', icon: '◈' }
    ]
  },
  form_options: {
    erp_platforms: 'NetSuite, Coupa, SAP S/4HANA, Workday, Oracle Fusion, Microsoft Dynamics, Multi-Platform, Not Sure',
    invoice_volumes: 'Under 10,000 / year, 10,000 – 50,000 / year, 50,000 – 100,000 / year, 100,000 – 500,000 / year, 500,000+ / year, Not Sure'
  },
  global_presence: {
    eyebrow: 'Global Presence',
    headline: 'We work all over the world. One standard of service.',
    offices: [
      { region: 'North America', scope: 'HQ & AMER Operations', timezone: 'PT / ET', email: 'amer@flowtaris.com', hours: 'Follow-the-sun Support' },
      { region: 'Europe & UK', scope: 'EMEA Operations', timezone: 'GMT / CET', email: 'emea@flowtaris.com', hours: 'Follow-the-sun Support' },
      { region: 'Asia Pacific', scope: 'APAC Operations', timezone: 'SGT / AEST', email: 'apac@flowtaris.com', hours: 'Follow-the-sun Support' },
    ]
  },
  trust_signals: [
    { title: 'Data Never Leaves Your Control', body: 'SOC 2 Type II in progress. AES-256 at rest, TLS 1.3 in transit. Your data is never used to train models.' },
    { title: 'Live Production in 21 Days', body: 'Our fastest deployment was 11 days. The median is 21. No 12-month IT projects.' },
    { title: 'Built for Enterprise Scale', body: 'From 10,000 to 2M+ invoices per year. Multi-entity, multi-currency, 28 languages.' },
  ],
  faq: {
    eyebrow: 'Quick Answers',
    headline: 'Questions we get before the first call.',
    items: [
      { q: 'How quickly can I get a live demo?', a: 'Within 1–2 business days. We customise every demo to your ERP and use case — no generic slide decks.' },
      { q: 'What does implementation look like?', a: 'GenAI Document Intelligence: 3–4 weeks. Full platform: 8–12 weeks. We provide a dedicated engineer from day one.' },
      { q: 'Do you offer a proof of concept?', a: 'Yes. Qualified enterprises can run a 4-week POC on their own live data with full platform access — no synthetic demos.' },
      { q: 'How is pricing structured?', a: 'Platform subscription + usage-based processing fees. Volume discounts at 50K, 100K, and 500K+ invoices/year.' },
      { q: 'What is your security posture?', a: 'SOC 2 Type II (in progress), ISO 27001 (in progress), GDPR & CCPA compliant. AES-256 at rest, TLS 1.3 in transit. Your data is never used for model training.' },
    ]
  },
  bottom_cta: {
    headline: 'Prefer to start self-serve?',
    description: 'Take our 3-minute AI Readiness Assessment and get a personalised automation roadmap — no sales call required.',
    primary_cta: { label: 'Start Free Assessment', href: '/assessment' },
    secondary_cta: { label: 'Calculate ROI', href: '/roi-calculator' }
  }
}

export type ContactConfigData = typeof DEFAULT_CONTACT_DATA

// ── Main Page Component ───────────────────────────────────────────────────────

export default function ContactConfigAdminPage() {
  const [data, setData] = useState<ContactConfigData>(DEFAULT_CONTACT_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg?.contactConfig) {
          const cc = cfg.contactConfig
          setData({
            hero: {
              ...DEFAULT_CONTACT_DATA.hero,
              ...(cc.hero || {}),
              stats: cc.hero?.stats || DEFAULT_CONTACT_DATA.hero.stats,
              floating_card_1: { ...DEFAULT_CONTACT_DATA.hero.floating_card_1, ...(cc.hero?.floating_card_1 || {}) },
              floating_card_2: { ...DEFAULT_CONTACT_DATA.hero.floating_card_2, ...(cc.hero?.floating_card_2 || {}) },
            },
            meeting: {
              ...DEFAULT_CONTACT_DATA.meeting,
              ...(cc.meeting || {}),
              intent_options: cc.meeting?.intent_options || DEFAULT_CONTACT_DATA.meeting.intent_options
            },
            form_options: {
              ...DEFAULT_CONTACT_DATA.form_options,
              ...(cc.form_options || {})
            },
            global_presence: {
              ...DEFAULT_CONTACT_DATA.global_presence,
              ...(cc.global_presence || {}),
              offices: cc.global_presence?.offices || DEFAULT_CONTACT_DATA.global_presence.offices
            },
            trust_signals: cc.trust_signals || DEFAULT_CONTACT_DATA.trust_signals,
            faq: {
              ...DEFAULT_CONTACT_DATA.faq,
              ...(cc.faq || {}),
              items: cc.faq?.items || DEFAULT_CONTACT_DATA.faq.items
            },
            bottom_cta: {
              ...DEFAULT_CONTACT_DATA.bottom_cta,
              ...(cc.bottom_cta || {}),
              primary_cta: { ...DEFAULT_CONTACT_DATA.bottom_cta.primary_cta, ...(cc.bottom_cta?.primary_cta || {}) },
              secondary_cta: { ...DEFAULT_CONTACT_DATA.bottom_cta.secondary_cta, ...(cc.bottom_cta?.secondary_cta || {}) }
            }
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const update = (path: string, value: any) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]]) cur[keys[i]] = {}
        cur = cur[keys[i]]
      }
      cur[keys[keys.length - 1]] = value
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
        body: JSON.stringify({ contact_config: data }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setStatus({ type: 'success', msg: 'Contact page configuration saved successfully! Changes are live.' })
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Save failed' })
    } finally {
      setSaving(false)
      setTimeout(() => setStatus(null), 5000)
    }
  }

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin" />
          <span>Loading Contact page configuration…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <Mail className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">Contact Page Configuration</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
            Manage the hero banner, meeting links, regional offices, ERP options, trust badges, and FAQs on the public <strong>/contact</strong> page.
          </p>
        </div>
        <a
          href="/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 transition-colors shrink-0"
        >
          <Eye className="w-3.5 h-3.5" />
          View Live Page ↗
        </a>
      </div>

      {/* Status Feedback */}
      {status && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-6 shadow-sm ${
          status.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span className="text-sm font-medium">{status.msg}</span>
        </div>
      )}

      <form onSubmit={e => { e.preventDefault(); handleSave() }}>

        {/* ── SECTION 1: HERO & METRICS ── */}
        <Section title="Section 1: Hero & Metrics" description="Header banner with response guarantee, headline, stats, and graphic" icon={Sparkles} color="amber">
          <Field label="Response Guarantee Badge" hint="Appears at the top of the hero">
            <TextInput value={data.hero.badge} onChange={v => update('hero.badge', v)} placeholder="Response within 4 hours" />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Headline Part 1">
              <TextInput value={data.hero.headline_part1} onChange={v => update('hero.headline_part1', v)} placeholder="Let's start" />
            </Field>
            <Field label="Headline Highlight (Gold)">
              <TextInput value={data.hero.headline_highlight} onChange={v => update('hero.headline_highlight', v)} placeholder="something" />
            </Field>
            <Field label="Headline Part 2">
              <TextInput value={data.hero.headline_part2} onChange={v => update('hero.headline_part2', v)} placeholder="real." />
            </Field>
          </div>

          <Field label="Intro Description Paragraph">
            <TextArea value={data.hero.description} onChange={v => update('hero.description', v)} rows={3} />
          </Field>

          {/* 4 Stats */}
          <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 mb-5">
            <Label>Hero Metrics Strip (4 Counters)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {data.hero.stats.map((stat, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Stat {idx + 1}</span>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={e => {
                      const newStats = [...data.hero.stats]
                      newStats[idx] = { ...newStats[idx], value: e.target.value }
                      update('hero.stats', newStats)
                    }}
                    placeholder="< 4 hrs"
                    className="w-full text-base font-bold bg-transparent border-b border-gray-200 dark:border-gray-600 py-1 focus:outline-none focus:border-amber-500 mb-1 text-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={e => {
                      const newStats = [...data.hero.stats]
                      newStats[idx] = { ...newStats[idx], label: e.target.value }
                      update('hero.stats', newStats)
                    }}
                    placeholder="Avg Response"
                    className="w-full text-xs text-gray-500 bg-transparent border-b border-gray-200 dark:border-gray-600 py-1 focus:outline-none focus:border-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image & Floating Cards */}
          <ImageUpload
            label="Hero Graphic Image"
            value={data.hero.imageSrc}
            onChange={v => update('hero.imageSrc', v)}
            hint="Global circuit connectivity image on the right column"
          />
          <Field label="Hero Image Alt Text (SEO)">
            <TextInput value={data.hero.imageAlt} onChange={v => update('hero.imageAlt', v)} placeholder="Flowtaris global AI finance reach..." />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Label>Floating Accent Card 1 (Left)</Label>
              <TextInput value={data.hero.floating_card_1.label} onChange={v => update('hero.floating_card_1.label', v)} placeholder="Avg Time to Value" />
              <div className="mt-2">
                <TextInput value={data.hero.floating_card_1.value} onChange={v => update('hero.floating_card_1.value', v)} placeholder="21 Days" />
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Label>Floating Accent Card 2 (Right)</Label>
              <TextInput value={data.hero.floating_card_2.label} onChange={v => update('hero.floating_card_2.label', v)} placeholder="ROI Achieved By" />
              <div className="mt-2">
                <TextInput value={data.hero.floating_card_2.value} onChange={v => update('hero.floating_card_2.value', v)} placeholder="Day 47" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── SECTION 2: MEETING & INTENT ── */}
        <Section title="Section 2: Meeting Booking & Purpose Options" description="Calendly scheduling URL and inquiry intent options" icon={Calendar} color="blue">
          <Field label="Direct Calendly / Scheduler Booking URL" hint="Opens when users click 'Auto-Schedule a Meeting'">
            <TextInput value={data.meeting.calendly_url} onChange={v => update('meeting.calendly_url', v)} placeholder="https://calendly.com/flowtaris-info" />
          </Field>

          <div className="mt-4 space-y-3">
            <Label>Intent Choice Cards (Step 1 Options)</Label>
            {data.meeting.intent_options.map((opt, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Title</Label>
                    <TextInput
                      value={opt.label}
                      onChange={v => {
                        const newOpts = [...data.meeting.intent_options]
                        newOpts[idx] = { ...newOpts[idx], label: v }
                        update('meeting.intent_options', newOpts)
                      }}
                      placeholder="Auto-Schedule a Meeting"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <TextInput
                      value={opt.sub}
                      onChange={v => {
                        const newOpts = [...data.meeting.intent_options]
                        newOpts[idx] = { ...newOpts[idx], sub: v }
                        update('meeting.intent_options', newOpts)
                      }}
                      placeholder="Instantly book a time..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 3: FORM DROPDOWN OPTIONS ── */}
        <Section title="Section 3: Form Dropdown Options" description="ERP platforms and invoice volume tiers available in the contact form" icon={Building2} color="emerald">
          <Field label="Supported ERP Platforms (Comma-separated)" hint="Options in the 'Primary ERP Platform' dropdown">
            <TextArea
              value={Array.isArray(data.form_options.erp_platforms) ? data.form_options.erp_platforms.join(', ') : data.form_options.erp_platforms}
              onChange={v => update('form_options.erp_platforms', v)}
              rows={2}
              placeholder="NetSuite, Coupa, SAP S/4HANA, Workday, Oracle Fusion, Microsoft Dynamics, Multi-Platform, Not Sure"
            />
          </Field>

          <Field label="Invoice Volume Tiers (Comma-separated)" hint="Options in the 'Annual Invoice Volume' dropdown">
            <TextArea
              value={Array.isArray(data.form_options.invoice_volumes) ? data.form_options.invoice_volumes.join(', ') : data.form_options.invoice_volumes}
              onChange={v => update('form_options.invoice_volumes', v)}
              rows={2}
              placeholder="Under 10,000 / year, 10,000 – 50,000 / year, 50,000 – 100,000 / year, 100,000 – 500,000 / year, 500,000+ / year, Not Sure"
            />
          </Field>
        </Section>

        {/* ── SECTION 4: GLOBAL PRESENCE ── */}
        <Section title="Section 4: Global Presence & Regional Offices" description="Regional operations cards (AMER, EMEA, APAC)" icon={Globe} color="purple">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Field label="Section Eyebrow">
              <TextInput value={data.global_presence.eyebrow} onChange={v => update('global_presence.eyebrow', v)} placeholder="Global Presence" />
            </Field>
            <Field label="Section Headline">
              <TextInput value={data.global_presence.headline} onChange={v => update('global_presence.headline', v)} placeholder="We work all over the world..." />
            </Field>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Regional Offices</Label>
              <button
                type="button"
                onClick={() => {
                  const newOffices = [...data.global_presence.offices, { region: 'Latin America', scope: 'LATAM Operations', timezone: 'BRT / CST', email: 'latam@flowtaris.com', hours: 'Follow-the-sun Support' }]
                  update('global_presence.offices', newOffices)
                }}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200"
              >
                <Plus className="w-3 h-3" /> Add Office
              </button>
            </div>

            {data.global_presence.offices.map((office, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-purple-100 dark:border-purple-900/30 bg-purple-50/20 dark:bg-purple-900/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Office {idx + 1}</span>
                  {data.global_presence.offices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newOffices = [...data.global_presence.offices]
                        newOffices.splice(idx, 1)
                        update('global_presence.offices', newOffices)
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label>Region Name</Label>
                    <TextInput
                      value={office.region}
                      onChange={v => {
                        const newO = [...data.global_presence.offices]
                        newO[idx] = { ...newO[idx], region: v }
                        update('global_presence.offices', newO)
                      }}
                      placeholder="North America"
                    />
                  </div>
                  <div>
                    <Label>Timezone Label</Label>
                    <TextInput
                      value={office.timezone}
                      onChange={v => {
                        const newO = [...data.global_presence.offices]
                        newO[idx] = { ...newO[idx], timezone: v }
                        update('global_presence.offices', newO)
                      }}
                      placeholder="PT / ET"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Scope / Subtitle</Label>
                    <TextInput
                      value={office.scope}
                      onChange={v => {
                        const newO = [...data.global_presence.offices]
                        newO[idx] = { ...newO[idx], scope: v }
                        update('global_presence.offices', newO)
                      }}
                      placeholder="HQ & AMER Operations"
                    />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <TextInput
                      value={office.email}
                      onChange={v => {
                        const newO = [...data.global_presence.offices]
                        newO[idx] = { ...newO[idx], email: v }
                        update('global_presence.offices', newO)
                      }}
                      placeholder="amer@flowtaris.com"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 5: TRUST SIGNALS ── */}
        <Section title="Section 5: Trust Signals" description="3 security, speed, and scale guarantee cards" icon={Shield} color="blue">
          <div className="space-y-4">
            {data.trust_signals.map((signal, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 block">Card {idx + 1}</span>
                <Field label="Card Headline">
                  <TextInput
                    value={signal.title}
                    onChange={v => {
                      const newS = [...data.trust_signals]
                      newS[idx] = { ...newS[idx], title: v }
                      update('trust_signals', newS)
                    }}
                    placeholder="Data Never Leaves Your Control"
                  />
                </Field>
                <Field label="Card Body Text">
                  <TextArea
                    value={signal.body}
                    onChange={v => {
                      const newS = [...data.trust_signals]
                      newS[idx] = { ...newS[idx], body: v }
                      update('trust_signals', newS)
                    }}
                    rows={2}
                  />
                </Field>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 6: FAQ ACCORDION ── */}
        <Section title="Section 6: FAQ Accordion" description="Common pre-call questions and answers" icon={HelpCircle} color="amber">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Field label="Section Eyebrow">
              <TextInput value={data.faq.eyebrow} onChange={v => update('faq.eyebrow', v)} placeholder="Quick Answers" />
            </Field>
            <Field label="Section Headline">
              <TextInput value={data.faq.headline} onChange={v => update('faq.headline', v)} placeholder="Questions we get before the first call." />
            </Field>
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label>Questions & Answers</Label>
              <button
                type="button"
                onClick={() => {
                  const newFaqs = [...data.faq.items, { q: 'New question?', a: 'Answer here...' }]
                  update('faq.items', newFaqs)
                }}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200"
              >
                <Plus className="w-3 h-3" /> Add FAQ
              </button>
            </div>

            {data.faq.items.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-900/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">FAQ #{idx + 1}</span>
                  {data.faq.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newFaqs = [...data.faq.items]
                        newFaqs.splice(idx, 1)
                        update('faq.items', newFaqs)
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <Field label="Question">
                  <TextInput
                    value={faq.q}
                    onChange={v => {
                      const newF = [...data.faq.items]
                      newF[idx] = { ...newF[idx], q: v }
                      update('faq.items', newF)
                    }}
                    placeholder="How quickly can I get a live demo?"
                  />
                </Field>
                <Field label="Answer">
                  <TextArea
                    value={faq.a}
                    onChange={v => {
                      const newF = [...data.faq.items]
                      newF[idx] = { ...newF[idx], a: v }
                      update('faq.items', newF)
                    }}
                    rows={2}
                  />
                </Field>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 7: BOTTOM CTA ── */}
        <Section title="Section 7: Bottom Self-Serve CTA" description="Bottom banner leading to self-serve assessment and calculator" icon={ArrowRight} color="slate">
          <Field label="Headline">
            <TextInput value={data.bottom_cta.headline} onChange={v => update('bottom_cta.headline', v)} placeholder="Prefer to start self-serve?" />
          </Field>
          <Field label="Description Paragraph">
            <TextArea value={data.bottom_cta.description} onChange={v => update('bottom_cta.description', v)} rows={2} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Label>Primary CTA (Gold)</Label>
              <TextInput value={data.bottom_cta.primary_cta.label} onChange={v => update('bottom_cta.primary_cta.label', v)} placeholder="Start Free Assessment" />
              <div className="mt-2">
                <TextInput value={data.bottom_cta.primary_cta.href} onChange={v => update('bottom_cta.primary_cta.href', v)} placeholder="/assessment" />
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Label>Secondary CTA (Outline)</Label>
              <TextInput value={data.bottom_cta.secondary_cta.label} onChange={v => update('bottom_cta.secondary_cta.label', v)} placeholder="Calculate ROI" />
              <div className="mt-2">
                <TextInput value={data.bottom_cta.secondary_cta.href} onChange={v => update('bottom_cta.secondary_cta.href', v)} placeholder="/roi-calculator" />
              </div>
            </div>
          </div>
        </Section>

        {/* Sticky Save Bar */}
        <div className="sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4 mt-8 flex items-center justify-between z-30 shadow-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Changes will update <strong>/contact</strong> immediately after saving.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving Changes…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Save Contact Config
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
