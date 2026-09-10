'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import {
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ImageIcon, X, Layers, Plus, Trash2
} from 'lucide-react'

// ── Shared primitives ─────────────────────────────────────────────────────────

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
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
      focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400
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
      focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400
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
      const name = `vision-${Date.now()}.${ext}`
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
          className="relative w-28 h-20 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer bg-gray-50 dark:bg-gray-800 hover:border-amber-400 transition-colors group shrink-0"
          onClick={() => fileRef.current?.click()}
        >
          <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
          {uploading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin" />
          ) : value && !previewError ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value.startsWith('http') || value.startsWith('/') ? value : `/${value}`} alt="Preview" className="w-full h-full object-cover" onError={() => setPreviewError(true)} />
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
            placeholder="/images/my-image.png or https://..."
          />
          <p className="text-[11px] text-gray-400 mt-1">Paste a URL or click the preview to upload a file.</p>
          {hint && <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">{hint}</p>}
        </div>
      </div>
    </div>
  )
}

// ── Pillar Editor ─────────────────────────────────────────────────────────────

function PillarEditor({
  pillars, onChange, color,
}: { pillars: any[]; onChange: (p: any[]) => void; color: 'blue' | 'amber' }) {
  const addPillar = () => onChange([...pillars, { number: String(pillars.length + 1).padStart(2, '0'), title: 'New Pillar', subtitle: 'Subtitle here', body: 'Description of this pillar...', tag: 'Tag' }])
  const removePillar = (i: number) => { const n = [...pillars]; n.splice(i, 1); onChange(n) }
  const updatePillar = (i: number, k: string, v: string) => { const n = [...pillars]; n[i] = { ...n[i], [k]: v }; onChange(n) }

  const accent = color === 'amber' ? 'border-amber-200 dark:border-amber-800/30 bg-amber-50/30 dark:bg-amber-900/10' : 'border-blue-100 dark:border-blue-800/30 bg-blue-50/30 dark:bg-blue-900/10'
  const btnAccent = color === 'amber' ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'

  return (
    <div className="space-y-3">
      {pillars.map((p, i) => (
        <div key={i} className={`rounded-xl border ${accent} p-4`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pillar {i + 1}</span>
            <button type="button" onClick={() => removePillar(i)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label>Title</Label>
              <TextInput value={p.title} onChange={v => updatePillar(i, 'title', v)} placeholder="Pillar Title" />
            </div>
            <div>
              <Label>Tag (pill label)</Label>
              <TextInput value={p.tag} onChange={v => updatePillar(i, 'tag', v)} placeholder="e.g. Agentic AI" />
            </div>
          </div>
          <div className="mb-3">
            <Label>Subtitle</Label>
            <TextInput value={p.subtitle} onChange={v => updatePillar(i, 'subtitle', v)} placeholder="Short tagline..." />
          </div>
          <div>
            <Label>Body text</Label>
            <TextArea value={p.body} onChange={v => updatePillar(i, 'body', v)} rows={2} placeholder="Detailed description..." />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addPillar}
        className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition-colors ${btnAccent}`}
      >
        <Plus className="w-3.5 h-3.5" /> Add Pillar
      </button>
    </div>
  )
}

// ── Stat Editor ───────────────────────────────────────────────────────────────

function StatEditor({ stats, onChange }: { stats: any[]; onChange: (s: any[]) => void }) {
  const add = () => onChange([...stats, { label: 'New', sub: 'Stat' }])
  const remove = (i: number) => { const n = [...stats]; n.splice(i, 1); onChange(n) }
  const update = (i: number, k: string, v: string) => { const n = [...stats]; n[i] = { ...n[i], [k]: v }; onChange(n) }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div>
              <input
                type="text"
                value={s.label}
                onChange={e => update(i, 'label', e.target.value)}
                className="w-16 text-sm font-bold text-center bg-transparent border-b border-gray-200 dark:border-gray-600 focus:outline-none focus:border-amber-400 text-gray-900 dark:text-gray-100"
                placeholder="40+"
              />
              <input
                type="text"
                value={s.sub}
                onChange={e => update(i, 'sub', e.target.value)}
                className="w-16 text-[10px] text-center text-gray-500 bg-transparent border-b border-gray-200 dark:border-gray-600 focus:outline-none focus:border-amber-400 mt-1"
                placeholder="Countries"
              />
            </div>
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button type="button" onClick={add} className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl border border-dashed border-blue-300 dark:border-blue-700 transition-colors">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
    </div>
  )
}

// ── Default data (mirrors DualVisionSection defaults) ─────────────────────────

const DEFAULT_DATA = {
  eyebrow: 'One Brand · Two Disciplines',
  heading1: 'Enterprise Mastery Meets',
  heading2: 'AI Intelligence',
  intro: 'Flowtaris.ai was built to amplify Flowtaris.com — not compete with it. Two disciplines. One brand. The trust of decades of enterprise work, now accelerated by AI that actually works inside your ERP.',
  unifyingText: 'Flowtaris AI does not replace what Flowtaris.com has built — it deepens it. Our AI products inherit the same governance controls, implementation expertise, and enterprise trust model that our clients across 40+ countries depend on. This is AI with accountability, not a proof-of-concept.',
  stats: [
    { label: '40+', sub: 'Countries' },
    { label: '200+', sub: 'Enterprises' },
    { label: '99.8%', sub: 'AI Accuracy' },
    { label: '10+', sub: 'Yrs Experience' },
  ],
  left: {
    domain: 'flowtaris.com',
    domainHref: 'https://flowtaris.com',
    headline1: 'The Enterprise',
    headline2: 'Operations Backbone',
    intro: 'The foundation every enterprise finance team can stake their ERP on. Decade-deep implementations, partner-grade governance, and a 40+ country delivery network built for when execution cannot fail.',
    imageSrc: '/images/com-vision.png',
    imageAlt: 'Flowtaris enterprise ERP operations center',
    ctaLabel: 'Explore Flowtaris.com',
    ctaHref: 'https://flowtaris.com',
    pillars: [
      { number: '01', title: 'Global ERP Implementation', subtitle: 'The world trusts our hands-on expertise', body: 'Flowtaris.com delivers decade-deep ERP implementations across NetSuite, SAP, Workday, and Coupa — in 40+ countries. We are the partner enterprises call when execution cannot fail.', tag: 'Enterprise Operations' },
      { number: '02', title: 'Governance by Design', subtitle: 'SOC 2 · GDPR · ISO 27001 baked in', body: 'Compliance is structural at Flowtaris — not bolted on. Every process, integration, and workflow ships with enterprise-grade controls, audit trails, and regulatory documentation.', tag: 'Risk & Compliance' },
      { number: '03', title: 'Long-Term Strategic Partnership', subtitle: 'Compounding value, not one-time projects', body: 'We build lasting finance operations foundations — continuous optimization roadmaps that compound ROI year over year, turning your finance function into a strategic business asset.', tag: 'Advisory & Growth' },
    ],
  },
  right: {
    domain: 'flowtaris.ai',
    domainHref: '/assessment',
    headline1: 'The AI Intelligence',
    headline2: 'Layer Unlocked',
    intro: 'Built on the same enterprise trust foundation as Flowtaris.com — Flowtaris AI adds autonomous agents, predictive intelligence, and GenAI document processing to the ERP systems your team already runs.',
    imageSrc: '/images/ai-vision.png',
    imageAlt: 'Flowtaris AI intelligence layer with golden neural network',
    ctaLabel: 'Assess Your AI Readiness',
    ctaHref: '/assessment',
    pillars: [
      { number: '01', title: 'Autonomous Finance Agents', subtitle: 'AI that acts — not just advises', body: 'AI agents embedded in your existing ERP handle AP, AR, invoice matching, and close cycles end-to-end. The same systems your team uses — now running themselves, backed by Flowtaris governance.', tag: 'Agentic Automation' },
      { number: '02', title: 'Predictive Intelligence', subtitle: 'From lagging reports to leading signals', body: 'Real-time cash flow forecasting, vendor risk scoring, and spend anomaly detection — surfacing what matters before it becomes a problem. Built on the same trusted data layer as flowtaris.com.', tag: 'Finance Intelligence' },
      { number: '03', title: 'GenAI Document Processing', subtitle: '99.8% accuracy · zero templates', body: 'Classify, extract, and route any financial document at enterprise scale. The same rigorous accuracy our implementation teams demand — now automated with large-language-model intelligence.', tag: 'Document AI' },
    ],
  },
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DualVisionAdminPage() {
  const [data, setData] = useState(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg?.dualVision) {
          const dv = cfg.dualVision
          setData({
            eyebrow: dv.eyebrow ?? DEFAULT_DATA.eyebrow,
            heading1: dv.heading1 ?? DEFAULT_DATA.heading1,
            heading2: dv.heading2 ?? DEFAULT_DATA.heading2,
            intro: dv.intro ?? DEFAULT_DATA.intro,
            unifyingText: dv.unifyingText ?? DEFAULT_DATA.unifyingText,
            stats: dv.stats ?? DEFAULT_DATA.stats,
            left: { ...DEFAULT_DATA.left, ...(dv.left ?? {}), pillars: dv.left?.pillars ?? DEFAULT_DATA.left.pillars },
            right: { ...DEFAULT_DATA.right, ...(dv.right ?? {}), pillars: dv.right?.pillars ?? DEFAULT_DATA.right.pillars },
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const update = (path: string, value: any) => {
    setData(prev => {
      const next = { ...prev }
      const keys = path.split('.')
      let cur: any = next
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] }
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
        body: JSON.stringify({ dual_vision: data }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setStatus({ type: 'success', msg: 'Dual Vision section saved! Changes are live within 60 seconds.' })
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
          <div className="w-5 h-5 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin" />
          <span>Loading dual vision configuration…</span>
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
            <Layers className="w-5 h-5 text-amber-500" />
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">Dual Vision Section</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
            This controls the <strong>"Enterprise Mastery Meets AI Intelligence"</strong> section on the homepage.
            It shows two panels side-by-side: the <strong>flowtaris.com</strong> operations story on the left,
            and the <strong>flowtaris.ai</strong> intelligence story on the right.
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

      {/* Visual reference hint */}
      <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-start gap-3">
        <div className="text-2xl shrink-0">🗺️</div>
        <div>
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">How this section looks on the homepage</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            <strong>Top:</strong> Eyebrow badge → Main headline → Intro paragraph.<br />
            <strong>Middle:</strong> Two columns. LEFT = flowtaris.com (white/blue tones). RIGHT = flowtaris.ai (gold tones). Each has: a header image, headline, body text, 3 pillar cards, and a CTA button.<br />
            <strong>Bottom:</strong> Unifying statement + stats strip.
          </p>
        </div>
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSave() }} className="space-y-2">

        {/* ── SECTION 1: Top Header ── */}
        <Section title="Section Header" description="The eyebrow badge, main headline, and intro paragraph at the top center" icon={Layers} color="blue">
          <Field label="Eyebrow badge text" id="eyebrow" hint="Short label shown inside the gold pill badge at the very top">
            <TextInput id="eyebrow" value={data.eyebrow} onChange={v => update('eyebrow', v)} placeholder="One Brand · Two Disciplines" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Headline — Line 1 (white)" id="heading1">
              <TextInput id="heading1" value={data.heading1} onChange={v => update('heading1', v)} placeholder="Enterprise Mastery Meets" />
            </Field>
            <Field label="Headline — Line 2 (gold gradient)" id="heading2">
              <TextInput id="heading2" value={data.heading2} onChange={v => update('heading2', v)} placeholder="AI Intelligence" />
            </Field>
          </div>
          <Field label="Intro paragraph" id="intro" hint="Appears below the headline. Keep this 2–3 sentences.">
            <TextArea id="intro" value={data.intro} onChange={v => update('intro', v)} rows={3} />
          </Field>
        </Section>

        {/* ── SECTION 2: LEFT PANEL ── */}
        <Section title="Left Panel — flowtaris.com" description="The white/blue side representing the enterprise ERP operations story" icon={Layers} color="blue">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Field label="Domain label" hint="Text shown on the badge over the image">
              <TextInput value={data.left.domain} onChange={v => update('left.domain', v)} placeholder="flowtaris.com" />
            </Field>
            <Field label="Domain link URL" hint="Where clicking the badge goes">
              <TextInput value={data.left.domainHref} onChange={v => update('left.domainHref', v)} placeholder="https://flowtaris.com" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Field label="Headline — Line 1 (white bold)">
              <TextInput value={data.left.headline1} onChange={v => update('left.headline1', v)} placeholder="The Enterprise" />
            </Field>
            <Field label="Headline — Line 2 (muted)">
              <TextInput value={data.left.headline2} onChange={v => update('left.headline2', v)} placeholder="Operations Backbone" />
            </Field>
          </div>
          <Field label="Intro paragraph" hint="2–3 sentences below the headline">
            <TextArea value={data.left.intro} onChange={v => update('left.intro', v)} rows={3} />
          </Field>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Field label="CTA Button text">
              <TextInput value={data.left.ctaLabel} onChange={v => update('left.ctaLabel', v)} placeholder="Explore Flowtaris.com" />
            </Field>
            <Field label="CTA Button URL">
              <TextInput value={data.left.ctaHref} onChange={v => update('left.ctaHref', v)} placeholder="https://flowtaris.com" />
            </Field>
          </div>
          <ImageUpload
            label="Header Image"
            value={data.left.imageSrc}
            onChange={v => update('left.imageSrc', v)}
            hint="Ideal size: 1200×600px. Shows at top of the left panel."
          />
          <Field label="Image Alt Text (SEO)" hint="Describe the image for search engines and screen readers">
            <TextInput value={data.left.imageAlt} onChange={v => update('left.imageAlt', v)} placeholder="Flowtaris enterprise ERP operations..." />
          </Field>

          <div className="mt-5">
            <Label>Pillar Cards (max 3 recommended)</Label>
            <p className="text-xs text-gray-400 mb-3">These are the 3 feature rows shown below the paragraph. Each has a tag, title, subtitle, and description.</p>
            <PillarEditor pillars={data.left.pillars} onChange={v => update('left.pillars', v)} color="blue" />
          </div>
        </Section>

        {/* ── SECTION 3: RIGHT PANEL ── */}
        <Section title="Right Panel — flowtaris.ai" description="The gold side representing the AI intelligence story" icon={Layers} color="amber">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Field label="Domain label" hint="Text shown on the gold badge over the image">
              <TextInput value={data.right.domain} onChange={v => update('right.domain', v)} placeholder="flowtaris.ai" />
            </Field>
            <Field label="Domain link URL">
              <TextInput value={data.right.domainHref} onChange={v => update('right.domainHref', v)} placeholder="/assessment" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Field label="Headline — Line 1 (gold gradient)">
              <TextInput value={data.right.headline1} onChange={v => update('right.headline1', v)} placeholder="The AI Intelligence" />
            </Field>
            <Field label="Headline — Line 2 (white bold)">
              <TextInput value={data.right.headline2} onChange={v => update('right.headline2', v)} placeholder="Layer Unlocked" />
            </Field>
          </div>
          <Field label="Intro paragraph">
            <TextArea value={data.right.intro} onChange={v => update('right.intro', v)} rows={3} />
          </Field>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Field label="CTA Button text">
              <TextInput value={data.right.ctaLabel} onChange={v => update('right.ctaLabel', v)} placeholder="Assess Your AI Readiness" />
            </Field>
            <Field label="CTA Button URL">
              <TextInput value={data.right.ctaHref} onChange={v => update('right.ctaHref', v)} placeholder="/assessment" />
            </Field>
          </div>
          <ImageUpload
            label="Header Image"
            value={data.right.imageSrc}
            onChange={v => update('right.imageSrc', v)}
            hint="Ideal size: 1200×600px. Shows at top of the right (gold) panel."
          />
          <Field label="Image Alt Text (SEO)">
            <TextInput value={data.right.imageAlt} onChange={v => update('right.imageAlt', v)} placeholder="Flowtaris AI intelligence layer..." />
          </Field>

          <div className="mt-5">
            <Label>Pillar Cards (max 3 recommended)</Label>
            <p className="text-xs text-gray-400 mb-3">Same as the left side — tag, title, subtitle, description rows shown in gold styling.</p>
            <PillarEditor pillars={data.right.pillars} onChange={v => update('right.pillars', v)} color="amber" />
          </div>
        </Section>

        {/* ── SECTION 4: BOTTOM STRIP ── */}
        <Section title="Bottom Unifying Strip" description="The text and stats bar shown below both panels" icon={Layers} color="emerald">
          <Field label="Unifying statement" hint="This ties both sides together. Appears bottom-left. 2–3 sentences.">
            <TextArea value={data.unifyingText} onChange={v => update('unifyingText', v)} rows={3} />
          </Field>
          <div className="mt-2">
            <Label>Stats (shown bottom-right)</Label>
            <p className="text-xs text-gray-400 mb-3">Each stat has a large number/value (e.g. "40+") and a small label below it (e.g. "Countries"). Edit both fields inline.</p>
            <StatEditor stats={data.stats} onChange={v => update('stats', v)} />
          </div>
        </Section>

        {/* Save Button */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4 mt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">Changes are saved to the database and go live within ~60 seconds after cache revalidation.</p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 hover:brightness-105 transition-all disabled:opacity-60"
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
