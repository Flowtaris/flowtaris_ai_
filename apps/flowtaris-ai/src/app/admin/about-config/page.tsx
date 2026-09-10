'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import {
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ImageIcon, Plus, Trash2,
  Users, Sparkles, Shield, Cpu, ExternalLink, RefreshCw, FileText, ArrowRight, Eye
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
      const name = `about-${Date.now()}.${ext}`
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

// ── Default Data Structure ────────────────────────────────────────────────────

export const DEFAULT_ABOUT_DATA = {
  hero: {
    eyebrow: 'The Intelligence Engine',
    headline_part1: "We didn't build another",
    headline_highlight: 'AI software tool.',
    subtitle_part1: 'We built the intelligence layer',
    subtitle_part2: 'enterprise finance was missing.',
    description: 'Flowtaris AI is the advanced product division of Flowtaris. Born from over a decade inside complex ERP deployments, we automate the manual bottlenecks we used to solve by hand.',
    primary_cta: {
      label: 'Start Assessment',
      href: '/assessment'
    },
    secondary_cta: {
      label: 'Calculate ROI',
      href: '/roi-calculator'
    },
    stats: [
      { value: '99.5%+', label: 'Document Accuracy', isGold: false },
      { value: '14,000+', label: 'Hours Saved / Yr', isGold: false },
      { value: '<90 Days', label: 'Time-to-Value', isGold: false },
      { value: '$21M+', label: 'Client Savings', isGold: true }
    ]
  },
  manifesto: {
    imageSrc: '/images/about_manifesto.png',
    imageAlt: 'Flowtaris Manifesto Platform',
    statements: [
      {
        title: 'Every invoice should understand itself.',
        description: "Not just extracted — understood. Context, intent, exceptions, and nuance. That's the difference between legacy template OCR and our GenAI models. It is the difference between 70% automation and 95%."
      },
      {
        title: 'Your ERP should answer your questions.',
        description: 'Not the other way around. Ask your NetSuite, SAP, or Workday a question in plain English, and get a verified, secure answer in seconds. No complex SQL required.'
      },
      {
        title: 'Finance needs tools, not spreadsheets.',
        description: 'Predictive cash flow, anomaly detection, and real-time variance analysis are the new baseline. We built the architecture to make your data work proactively.'
      }
    ]
  },
  origin_story: {
    title: 'From Consulting to Product',
    subtitle: "The genesis of Flowtaris AI wasn't a whitepaper. It was thousands of hours spent in the ERP trenches.",
    milestones: [
      {
        year: '19',
        title: 'The Trenches',
        description: 'Flowtaris deployed 200+ ERP customizations. We saw the exact same manual bottlenecks in every single engagement.'
      },
      {
        year: '23',
        title: 'The Pattern',
        description: '"We keep solving the same problems manually. What if we automated ourselves?" Our internal R&D division was formed.'
      },
      {
        year: '24',
        title: 'The Lab',
        description: 'First models launched. GenAI Document Intelligence hits 99.5%. Our Conversational ERP passes internal infosec testing.'
      },
      {
        year: '25',
        title: 'The Platform',
        description: 'Flowtaris AI launches. Enterprise-grade. Platform-agnostic. Backed by the delivery muscle of our senior consultants.'
      }
    ]
  },
  unfair_advantage: {
    title: 'The Unfair Advantage',
    subtitle: 'Why Flowtaris AI outperforms horizontal, generic AI vendors in finance automation.',
    rows: [
      { label: 'ERP Knowledge', generic: 'Read the API docs', ours: 'Built 200+ customizations' },
      { label: 'Finance DNA', generic: 'Trained on public data', ours: 'Built by former controllers & Big 4' },
      { label: 'Accuracy', generic: '70–85% (Template OCR)', ours: '99.5%+ (GenAI Understanding)' },
      { label: 'Implementation', generic: '12–18 months', ours: '<90 days to first value' },
      { label: 'Integration', generic: 'Surface connectors', ours: 'Native to NetSuite & Coupa' },
      { label: 'Governance', generic: 'In roadmap', ours: 'EU AI Act ready, full audit trails' }
    ]
  },
  architecture: {
    title: 'Zero-Trust Architecture.',
    description: "We don't send your data to public LLMs. We don't train models on your invoices. Our architecture is designed strictly for security, auditability, and deterministic outcomes.",
    layers: [
      {
        title: 'Ingestion Layer',
        description: 'Native connectors to NetSuite, Coupa, SAP, Workday. Ingest via API, EDI, Email, or SFTP securely.'
      },
      {
        title: 'Intelligence Core',
        description: 'Ensemble models (LLMs + deterministic logic) orchestrating GenAI Document Intelligence and Conversational ERP.'
      },
      {
        title: 'Governance Layer',
        description: 'Every action is RBAC-enforced, fully logged, and explainable before it ever posts back to your ERP.'
      }
    ],
    principles_title: 'Non-Negotiable Principles',
    principles: [
      { title: 'Every Action Reversible', desc: 'No black-box changes. Every AI action has an undo, every decision has an audit trail.' },
      { title: 'Zero Trust on Data', desc: 'Row-level security, encrypted at rest/transit. No model training on client financial data.' },
      { title: 'Explainability Mandatory', desc: 'Every extraction and classification comes with a confidence score and reasoning chain.' },
      { title: 'Value in 90 Days', desc: "If you can't measure ROI in a quarter, we've failed. Quick Wins methodology built in." }
    ]
  },
  team: {
    title: 'Built by the Best',
    subtitle: 'We don\'t demo AI to CFOs. We ARE former CFO office consultants.',
    members: [
      {
        initials: 'FA',
        title: 'The Finance Architect',
        bio: '12 years in Big 4. Led 30+ NetSuite transformations. Now building the AI that automates what they used to do manually.',
        tags: 'NetSuite Cert, Big 4 Alum'
      },
      {
        initials: 'ML',
        title: 'The ML Engineer',
        bio: 'Former FAANG researcher. Published in NeurIPS. Now applying transformer architectures directly to enterprise document understanding.',
        tags: 'AI/ML Ph.D., GenAI Lead'
      },
      {
        initials: 'PE',
        title: 'The Platform Engineer',
        bio: 'Built integrations processing $2B+ in annual transaction volume. Now designing the connective tissue between our AI models and ERP systems.',
        tags: 'Coupa Expert, SAP Architect'
      }
    ]
  },
  bridge: {
    logoSrc: '/images/logo.png',
    title: 'Flowtaris AI is the intelligence engine of Flowtaris.',
    description: "Every model we ship is backed by the delivery muscle of an enterprise consulting team. Every deployment is supported by consultants who've lived inside NetSuite, Coupa, SAP, and Workday.",
    ctaLabel: 'Meet the Flowtaris Team',
    ctaHref: 'https://www.flowtaris.com/about'
  }
}

export type AboutConfigData = typeof DEFAULT_ABOUT_DATA

// ── Main Page Component ───────────────────────────────────────────────────────

export default function AboutConfigPage() {
  const [data, setData] = useState<AboutConfigData>(DEFAULT_ABOUT_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg?.aboutConfig) {
          const ac = cfg.aboutConfig
          setData({
            hero: {
              ...DEFAULT_ABOUT_DATA.hero,
              ...(ac.hero || {}),
              primary_cta: { ...DEFAULT_ABOUT_DATA.hero.primary_cta, ...(ac.hero?.primary_cta || {}) },
              secondary_cta: { ...DEFAULT_ABOUT_DATA.hero.secondary_cta, ...(ac.hero?.secondary_cta || {}) },
              stats: ac.hero?.stats || DEFAULT_ABOUT_DATA.hero.stats
            },
            manifesto: {
              ...DEFAULT_ABOUT_DATA.manifesto,
              ...(ac.manifesto || {}),
              statements: ac.manifesto?.statements || DEFAULT_ABOUT_DATA.manifesto.statements
            },
            origin_story: {
              ...DEFAULT_ABOUT_DATA.origin_story,
              ...(ac.origin_story || {}),
              milestones: ac.origin_story?.milestones || DEFAULT_ABOUT_DATA.origin_story.milestones
            },
            unfair_advantage: {
              ...DEFAULT_ABOUT_DATA.unfair_advantage,
              ...(ac.unfair_advantage || {}),
              rows: ac.unfair_advantage?.rows || DEFAULT_ABOUT_DATA.unfair_advantage.rows
            },
            architecture: {
              ...DEFAULT_ABOUT_DATA.architecture,
              ...(ac.architecture || {}),
              layers: ac.architecture?.layers || DEFAULT_ABOUT_DATA.architecture.layers,
              principles: ac.architecture?.principles || DEFAULT_ABOUT_DATA.architecture.principles
            },
            team: {
              ...DEFAULT_ABOUT_DATA.team,
              ...(ac.team || {}),
              members: ac.team?.members || DEFAULT_ABOUT_DATA.team.members
            },
            bridge: {
              ...DEFAULT_ABOUT_DATA.bridge,
              ...(ac.bridge || {})
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
        body: JSON.stringify({ about_config: data }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setStatus({ type: 'success', msg: 'About Us page configuration saved successfully! Changes are live.' })
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
          <span>Loading About page configuration…</span>
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
            <Users className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">About Us Page Configuration</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
            Manage the content, metrics, manifesto, origin timeline, comparison matrix, principles, and team personas on the public <strong>/about-flowtaris-ai</strong> page.
          </p>
        </div>
        <a
          href="/about-flowtaris-ai"
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
        <Section title="Section 1: Hero & Key Metrics" description="Top banner with conviction statement, CTAs, and 4 high-impact metric counters" icon={Sparkles} color="amber">
          <Field label="Eyebrow Badge Text" hint="Shown in gold caps at the top of the hero">
            <TextInput value={data.hero.eyebrow} onChange={v => update('hero.eyebrow', v)} placeholder="The Intelligence Engine" />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Main Headline (White Text)">
              <TextInput value={data.hero.headline_part1} onChange={v => update('hero.headline_part1', v)} placeholder="We didn't build another" />
            </Field>
            <Field label="Headline Highlight (Gold Gradient)">
              <TextInput value={data.hero.headline_highlight} onChange={v => update('hero.headline_highlight', v)} placeholder="AI software tool." />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Subtitle Line 1">
              <TextInput value={data.hero.subtitle_part1} onChange={v => update('hero.subtitle_part1', v)} placeholder="We built the intelligence layer" />
            </Field>
            <Field label="Subtitle Line 2">
              <TextInput value={data.hero.subtitle_part2} onChange={v => update('hero.subtitle_part2', v)} placeholder="enterprise finance was missing." />
            </Field>
          </div>

          <Field label="Description Paragraph" hint="Main introductory explanation">
            <TextArea value={data.hero.description} onChange={v => update('hero.description', v)} rows={3} />
          </Field>

          {/* CTA Buttons */}
          <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 mb-5">
            <Label>Action Buttons</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Primary Button (Gold)</span>
                <TextInput value={data.hero.primary_cta.label} onChange={v => update('hero.primary_cta.label', v)} placeholder="Start Assessment" />
                <TextInput value={data.hero.primary_cta.href} onChange={v => update('hero.primary_cta.href', v)} placeholder="/assessment" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Secondary Button (Outline)</span>
                <TextInput value={data.hero.secondary_cta.label} onChange={v => update('hero.secondary_cta.label', v)} placeholder="Calculate ROI" />
                <TextInput value={data.hero.secondary_cta.href} onChange={v => update('hero.secondary_cta.href', v)} placeholder="/roi-calculator" />
              </div>
            </div>
          </div>

          {/* 4 Stat Counters */}
          <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
            <Label>Hero Metrics Strip (4 Counters)</Label>
            <p className="text-xs text-gray-400 mb-3">Edit the 4 numbers and labels shown across the bottom of the hero.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
                    placeholder="99.5%+"
                    className="w-full text-base font-bold bg-transparent border-b border-gray-200 dark:border-gray-600 py-1 focus:outline-none focus:border-amber-500 mb-1"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={e => {
                      const newStats = [...data.hero.stats]
                      newStats[idx] = { ...newStats[idx], label: e.target.value }
                      update('hero.stats', newStats)
                    }}
                    placeholder="Document Accuracy"
                    className="w-full text-xs text-gray-500 bg-transparent border-b border-gray-200 dark:border-gray-600 py-1 focus:outline-none focus:border-amber-500"
                  />
                  <label className="flex items-center gap-1.5 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stat.isGold}
                      onChange={e => {
                        const newStats = [...data.hero.stats]
                        newStats[idx] = { ...newStats[idx], isGold: e.target.checked }
                        update('hero.stats', newStats)
                      }}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-[10px] text-gray-500">Gold Color</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── SECTION 2: THE MANIFESTO ── */}
        <Section title="Section 2: The Manifesto" description="3 core enterprise tenets paired with platform screenshot" icon={FileText} color="blue">
          <ImageUpload
            label="Manifesto Graphic Image"
            value={data.manifesto.imageSrc}
            onChange={v => update('manifesto.imageSrc', v)}
            hint="Displays on the left column in the Manifesto section."
          />
          <Field label="Image Alt Text (SEO)">
            <TextInput value={data.manifesto.imageAlt} onChange={v => update('manifesto.imageAlt', v)} placeholder="Flowtaris Manifesto Platform" />
          </Field>

          <div className="mt-4 space-y-4">
            <Label>Manifesto Statements (3 Pillars)</Label>
            {data.manifesto.statements.map((stmt, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Statement {idx + 1}</span>
                </div>
                <Field label="Headline">
                  <TextInput
                    value={stmt.title}
                    onChange={v => {
                      const newStmts = [...data.manifesto.statements]
                      newStmts[idx] = { ...newStmts[idx], title: v }
                      update('manifesto.statements', newStmts)
                    }}
                    placeholder="Every invoice should understand itself."
                  />
                </Field>
                <Field label="Description">
                  <TextArea
                    value={stmt.description}
                    onChange={v => {
                      const newStmts = [...data.manifesto.statements]
                      newStmts[idx] = { ...newStmts[idx], description: v }
                      update('manifesto.statements', newStmts)
                    }}
                    rows={2}
                  />
                </Field>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 3: THE ORIGIN STORY ── */}
        <Section title="Section 3: The Origin Story" description="From Consulting to Product timeline steps ('19, '23, '24, '25)" icon={Sparkles} color="emerald">
          <Field label="Section Title">
            <TextInput value={data.origin_story.title} onChange={v => update('origin_story.title', v)} placeholder="From Consulting to Product" />
          </Field>
          <Field label="Section Subtitle / Intro">
            <TextArea value={data.origin_story.subtitle} onChange={v => update('origin_story.subtitle', v)} rows={2} />
          </Field>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Milestone Timeline Steps</Label>
              <button
                type="button"
                onClick={() => {
                  const newM = [...data.origin_story.milestones, { year: '26', title: 'New Era', description: 'Description here...' }]
                  update('origin_story.milestones', newM)
                }}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
              >
                <Plus className="w-3 h-3" /> Add Milestone
              </button>
            </div>

            {data.origin_story.milestones.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/20 dark:bg-emerald-900/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Step {idx + 1}</span>
                  {data.origin_story.milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newM = [...data.origin_story.milestones]
                        newM.splice(idx, 1)
                        update('origin_story.milestones', newM)
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3 mb-2">
                  <div>
                    <Label>Year / Badge</Label>
                    <TextInput
                      value={m.year}
                      onChange={v => {
                        const newM = [...data.origin_story.milestones]
                        newM[idx] = { ...newM[idx], year: v }
                        update('origin_story.milestones', newM)
                      }}
                      placeholder="19"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Milestone Title</Label>
                    <TextInput
                      value={m.title}
                      onChange={v => {
                        const newM = [...data.origin_story.milestones]
                        newM[idx] = { ...newM[idx], title: v }
                        update('origin_story.milestones', newM)
                      }}
                      placeholder="The Trenches"
                    />
                  </div>
                </div>
                <Label>Description</Label>
                <TextArea
                  value={m.description}
                  onChange={v => {
                    const newM = [...data.origin_story.milestones]
                    newM[idx] = { ...newM[idx], description: v }
                    update('origin_story.milestones', newM)
                  }}
                  rows={2}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 4: THE UNFAIR ADVANTAGE ── */}
        <Section title="Section 4: The Unfair Advantage (Comparison Matrix)" description="Direct comparison table vs generic horizontal AI vendors" icon={Shield} color="purple">
          <Field label="Section Title">
            <TextInput value={data.unfair_advantage.title} onChange={v => update('unfair_advantage.title', v)} placeholder="The Unfair Advantage" />
          </Field>
          <Field label="Subtitle">
            <TextInput value={data.unfair_advantage.subtitle} onChange={v => update('unfair_advantage.subtitle', v)} placeholder="Why Flowtaris AI outperforms horizontal vendors..." />
          </Field>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Comparison Rows</Label>
              <button
                type="button"
                onClick={() => {
                  const newRows = [...data.unfair_advantage.rows, { label: 'New Feature', generic: 'Generic method', ours: 'Flowtaris method' }]
                  update('unfair_advantage.rows', newRows)
                }}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200"
              >
                <Plus className="w-3 h-3" /> Add Row
              </button>
            </div>

            {data.unfair_advantage.rows.map((row, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-purple-100 dark:border-purple-900/30 bg-purple-50/20 dark:bg-purple-900/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Row {idx + 1}</span>
                  {data.unfair_advantage.rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newRows = [...data.unfair_advantage.rows]
                        newRows.splice(idx, 1)
                        update('unfair_advantage.rows', newRows)
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Dimension</Label>
                    <TextInput
                      value={row.label}
                      onChange={v => {
                        const newRows = [...data.unfair_advantage.rows]
                        newRows[idx] = { ...newRows[idx], label: v }
                        update('unfair_advantage.rows', newRows)
                      }}
                      placeholder="ERP Knowledge"
                    />
                  </div>
                  <div>
                    <Label>Generic AI Vendor (Crossed)</Label>
                    <TextInput
                      value={row.generic}
                      onChange={v => {
                        const newRows = [...data.unfair_advantage.rows]
                        newRows[idx] = { ...newRows[idx], generic: v }
                        update('unfair_advantage.rows', newRows)
                      }}
                      placeholder="Read the API docs"
                    />
                  </div>
                  <div>
                    <Label>Flowtaris AI (Checkmark)</Label>
                    <TextInput
                      value={row.ours}
                      onChange={v => {
                        const newRows = [...data.unfair_advantage.rows]
                        newRows[idx] = { ...newRows[idx], ours: v }
                        update('unfair_advantage.rows', newRows)
                      }}
                      placeholder="Built 200+ customizations"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 5: ZERO-TRUST ARCHITECTURE & PRINCIPLES ── */}
        <Section title="Section 5: Zero-Trust Architecture & Principles" description="3-layer architecture cards & 4 non-negotiable principles" icon={Cpu} color="blue">
          <Field label="Architecture Title">
            <TextInput value={data.architecture.title} onChange={v => update('architecture.title', v)} placeholder="Zero-Trust Architecture." />
          </Field>
          <Field label="Intro Description">
            <TextArea value={data.architecture.description} onChange={v => update('architecture.description', v)} rows={2} />
          </Field>

          {/* 3 Layers */}
          <div className="my-5 space-y-3">
            <Label>Architecture Layers (3 Layers)</Label>
            {data.architecture.layers.map((layer, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/40">
                <span className="text-xs font-bold text-gray-500 uppercase">Layer {idx + 1}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <div>
                    <Label>Layer Name</Label>
                    <TextInput
                      value={layer.title}
                      onChange={v => {
                        const newL = [...data.architecture.layers]
                        newL[idx] = { ...newL[idx], title: v }
                        update('architecture.layers', newL)
                      }}
                      placeholder="Ingestion Layer"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <TextInput
                      value={layer.description}
                      onChange={v => {
                        const newL = [...data.architecture.layers]
                        newL[idx] = { ...newL[idx], description: v }
                        update('architecture.layers', newL)
                      }}
                      placeholder="Native connectors to NetSuite..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Principles */}
          <div className="mt-5 space-y-3">
            <Field label="Principles Box Title">
              <TextInput value={data.architecture.principles_title} onChange={v => update('architecture.principles_title', v)} placeholder="Non-Negotiable Principles" />
            </Field>

            <Label>Principles List</Label>
            {data.architecture.principles.map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Principle Title</Label>
                    <TextInput
                      value={p.title}
                      onChange={v => {
                        const newP = [...data.architecture.principles]
                        newP[idx] = { ...newP[idx], title: v }
                        update('architecture.principles', newP)
                      }}
                      placeholder="Every Action Reversible"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Principle Description</Label>
                    <TextInput
                      value={p.desc}
                      onChange={v => {
                        const newP = [...data.architecture.principles]
                        newP[idx] = { ...newP[idx], desc: v }
                        update('architecture.principles', newP)
                      }}
                      placeholder="No black-box changes..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 6: THE PEOPLE ── */}
        <Section title="Section 6: The People ('Built by the Best')" description="Team persona cards highlighting finance, ML, and platform experts" icon={Users} color="amber">
          <Field label="Section Title">
            <TextInput value={data.team.title} onChange={v => update('team.title', v)} placeholder="Built by the Best" />
          </Field>
          <Field label="Subtitle">
            <TextInput value={data.team.subtitle} onChange={v => update('team.subtitle', v)} placeholder="We don't demo AI to CFOs. We ARE former CFO office consultants." />
          </Field>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Team Persona Cards</Label>
              <button
                type="button"
                onClick={() => {
                  const newM = [...data.team.members, { initials: 'EX', title: 'New Expert', bio: 'Expert bio here...', tags: 'Specialist, Lead' }]
                  update('team.members', newM)
                }}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200"
              >
                <Plus className="w-3 h-3" /> Add Persona
              </button>
            </div>

            {data.team.members.map((member, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-900/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Persona {idx + 1}</span>
                  {data.team.members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newM = [...data.team.members]
                        newM.splice(idx, 1)
                        update('team.members', newM)
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <Label>Avatar Initials</Label>
                    <TextInput
                      value={member.initials}
                      onChange={v => {
                        const newM = [...data.team.members]
                        newM[idx] = { ...newM[idx], initials: v }
                        update('team.members', newM)
                      }}
                      placeholder="FA"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Role / Persona Title</Label>
                    <TextInput
                      value={member.title}
                      onChange={v => {
                        const newM = [...data.team.members]
                        newM[idx] = { ...newM[idx], title: v }
                        update('team.members', newM)
                      }}
                      placeholder="The Finance Architect"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <Label>Bio / Experience</Label>
                  <TextArea
                    value={member.bio}
                    onChange={v => {
                      const newM = [...data.team.members]
                      newM[idx] = { ...newM[idx], bio: v }
                      update('team.members', newM)
                    }}
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Tags (Comma separated)</Label>
                  <TextInput
                    value={Array.isArray(member.tags) ? member.tags.join(', ') : member.tags}
                    onChange={v => {
                      const newM = [...data.team.members]
                      newM[idx] = { ...newM[idx], tags: v }
                      update('team.members', newM)
                    }}
                    placeholder="NetSuite Cert, Big 4 Alum"
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 7: THE BRIDGE TO .COM ── */}
        <Section title="Section 7: The Bridge to .com" description="Bottom banner linking back to Flowtaris parent organization" icon={ArrowRight} color="slate">
          <ImageUpload
            label="Flowtaris Logo Image"
            value={data.bridge.logoSrc}
            onChange={v => update('bridge.logoSrc', v)}
            hint="Displayed above the closing bridge headline"
          />
          <Field label="Closing Headline">
            <TextInput value={data.bridge.title} onChange={v => update('bridge.title', v)} placeholder="Flowtaris AI is the intelligence engine of Flowtaris." />
          </Field>
          <Field label="Closing Paragraph">
            <TextArea value={data.bridge.description} onChange={v => update('bridge.description', v)} rows={3} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Button Label">
              <TextInput value={data.bridge.ctaLabel} onChange={v => update('bridge.ctaLabel', v)} placeholder="Meet the Flowtaris Team" />
            </Field>
            <Field label="Button Link URL">
              <TextInput value={data.bridge.ctaHref} onChange={v => update('bridge.ctaHref', v)} placeholder="https://www.flowtaris.com/about" />
            </Field>
          </div>
        </Section>

        {/* Sticky Save Bar */}
        <div className="sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4 mt-8 flex items-center justify-between z-30 shadow-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Changes will update <strong>/about-flowtaris-ai</strong> immediately after saving.
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
                Save About Us Config
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
