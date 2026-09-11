'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, Plus, Trash2, Shield, Eye, RefreshCw } from 'lucide-react'

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

const TextInput = ({ id, value, onChange, placeholder }: { id?: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input
    id={id}
    type="text"
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 placeholder-gray-400 transition-all"
  />
)

const TextArea = ({ id, value, onChange, rows = 4, placeholder }: { id?: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) => (
  <textarea
    id={id}
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    rows={rows}
    placeholder={placeholder}
    className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 placeholder-gray-400 transition-all"
  />
)

export const DEFAULT_PRIVACY_DATA = {
  page_title: 'Privacy Policy',
  effective_date: 'September 1, 2026',
  eyebrow: 'Legal & Compliance',
  sections: [
    { heading: '1. Introduction', content: 'Flowtaris AI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our enterprise AI automation services.' },
    { heading: '2. Information We Collect', content: 'We may collect information about you in a variety of ways, including:\n\n• Personal Data: Name, email address, phone number, and company details provided via contact forms or assessment wizards.\n• Usage Data: Information automatically collected when accessing the site, such as IP addresses, browser types, and interaction metrics.' },
    { heading: '3. How We Use Your Information', content: 'Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:\n\n• Respond to your inquiries and offer customer support.\n• Deliver our enterprise AI automation solutions and platform updates.\n• Improve website performance and user experience.' },
    { heading: '4. Disclosure of Your Information', content: 'We do not sell, trade, or rent your Personal Data to third parties. We may share information with trusted third-party service providers (Processors) who assist us in operating our website and conducting our business, so long as those parties agree to keep this information confidential and secure.' },
    { heading: '5. Security of Your Information', content: 'We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.' },
    { heading: '6. Contact Us', content: 'If you have questions or comments about this Privacy Policy, please contact us at:\n\nFlowtaris AI Legal Department\nEmail: privacy@flowtaris.com' },
  ],
}

export type PrivacyConfigData = typeof DEFAULT_PRIVACY_DATA

export default function PrivacyConfigPage() {
  const [data, setData] = useState<PrivacyConfigData>(DEFAULT_PRIVACY_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg?.privacyConfig) {
          const pc = cfg.privacyConfig
          setData({ ...DEFAULT_PRIVACY_DATA, ...pc, sections: pc.sections || DEFAULT_PRIVACY_DATA.sections })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const update = (key: keyof PrivacyConfigData, value: any) =>
    setData(prev => ({ ...prev, [key]: value }))

  const updateSection = (idx: number, field: 'heading' | 'content', value: string) => {
    const s = [...data.sections]
    s[idx] = { ...s[idx], [field]: value }
    update('sections', s)
  }

  const addSection = () =>
    update('sections', [...data.sections, { heading: `${data.sections.length + 1}. New Section`, content: 'Enter content here...' }])

  const removeSection = (idx: number) => {
    const s = [...data.sections]
    s.splice(idx, 1)
    update('sections', s)
  }

  const handleSave = async () => {
    setSaving(true); setStatus(null)
    try {
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privacy_config: data }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setStatus({ type: 'success', msg: 'Privacy Policy saved successfully! Changes are live.' })
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Save failed' })
    } finally {
      setSaving(false)
      setTimeout(() => setStatus(null), 5000)
    }
  }

  if (loading) return (
    <div className="p-12 flex items-center justify-center min-h-64">
      <div className="flex items-center gap-3 text-gray-500">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin" />
        <span>Loading Privacy Policy configuration…</span>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <Shield className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">Privacy Policy Configuration</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
            Edit the content of the public <strong>/privacy</strong> page. Add, remove, or reorder sections. Changes save instantly.
          </p>
        </div>
        <a href="/privacy" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 transition-colors shrink-0">
          <Eye className="w-3.5 h-3.5" /> View Live Page ↗
        </a>
      </div>

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

        {/* Page Meta */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/40 dark:bg-amber-900/10 mb-6 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-amber-200/60 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-100 dark:bg-amber-800/30">
                <Shield className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-800 dark:text-gray-100">Page Header</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Title, effective date, and eyebrow badge</p>
              </div>
            </div>
          </div>
          <div className="px-5 pb-6 pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Page Title">
                <TextInput value={data.page_title} onChange={v => update('page_title', v)} placeholder="Privacy Policy" />
              </Field>
              <Field label="Effective Date">
                <TextInput value={data.effective_date} onChange={v => update('effective_date', v)} placeholder="September 1, 2026" />
              </Field>
            </div>
            <Field label="Eyebrow Badge Text" hint='Small text above the title e.g. "Legal & Compliance"'>
              <TextInput value={data.eyebrow} onChange={v => update('eyebrow', v)} placeholder="Legal & Compliance" />
            </Field>
          </div>
        </div>

        {/* Sections */}
        <div className="rounded-2xl border border-blue-200 dark:border-blue-800/40 bg-blue-50/40 dark:bg-blue-900/10 mb-6 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-blue-200/60 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-800/30">
                <Shield className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-800 dark:text-gray-100">Policy Sections</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{data.sections.length} section(s) — each is a heading + body text</p>
              </div>
            </div>
            <button type="button" onClick={addSection}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Section
            </button>
          </div>
          <div className="px-5 pb-6 pt-5 space-y-4">
            {data.sections.map((section, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-gray-800/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Section {idx + 1}</span>
                  {data.sections.length > 1 && (
                    <button type="button" onClick={() => removeSection(idx)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <Field label="Section Heading">
                  <TextInput value={section.heading} onChange={v => updateSection(idx, 'heading', v)} placeholder="1. Introduction" />
                </Field>
                <Field label="Section Content" hint="Plain text. Use • for bullets, blank lines for paragraphs.">
                  <TextArea value={section.content} onChange={v => updateSection(idx, 'content', v)} rows={5} placeholder="Enter section content..." />
                </Field>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Changes go live immediately on <strong>/privacy</strong>.</p>
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-500/20">
            {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</> : <><CheckCircle2 className="w-4 h-4" /> Save Privacy Policy</>}
          </button>
        </div>
      </form>
    </div>
  )
}
