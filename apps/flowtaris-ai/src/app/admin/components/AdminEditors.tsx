'use client'

import React, { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

export const inputCls = 'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition'
export const textareaCls = inputCls + ' resize-y'

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 italic">{hint}</p>}
      {children}
    </div>
  )
}

export function StringListEditor({ label, hint, value, onChange }: { label: string; hint?: string; value: string[]; onChange: (v: string[]) => void }) {
  const add = () => onChange([...(value || []), ''])
  const update = (i: number, v: string) => { const n = [...value]; n[i] = v; onChange(n) }
  const remove = (i: number) => onChange(value?.filter((_, idx) => idx !== i) || [])
  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {(value || []).map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={e => update(i, e.target.value)} className={inputCls + ' flex-1'} placeholder={`Item ${i + 1}`} />
            <button type="button" onClick={() => remove(i)} className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-200 transition">✕</button>
          </div>
        ))}
        <button type="button" onClick={add} className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-xl text-sm font-bold transition-colors">
          <span className="text-lg leading-none">+</span> Add item
        </button>
      </div>
    </Field>
  )
}

type FAQ = { question: string; answer: string }
export function FaqEditor({ value, onChange }: { value: FAQ[]; onChange: (v: FAQ[]) => void }) {
  const add = () => onChange([...(value || []), { question: '', answer: '' }])
  const update = (i: number, field: keyof FAQ, v: string) => {
    const n = [...value]; n[i] = { ...n[i], [field]: v }; onChange(n)
  }
  const remove = (i: number) => onChange(value?.filter((_, idx) => idx !== i) || [])
  return (
    <Field label="FAQs" hint="Populates the FAQ accordion and injects JSON-LD schema.">
      <div className="space-y-4">
        {(value || []).map((faq, i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/60 space-y-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">FAQ #{i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="text-red-500 text-xs hover:text-red-700 font-bold">Remove</button>
            </div>
            <input value={faq.question} onChange={e => update(i, 'question', e.target.value)} placeholder="Question" className={inputCls} />
            <textarea value={faq.answer} onChange={e => update(i, 'answer', e.target.value)} placeholder="Answer" rows={3} className={textareaCls} />
          </div>
        ))}
        <button type="button" onClick={add} className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-xl text-sm font-bold transition-colors">
          <span className="text-lg leading-none">+</span> Add FAQ
        </button>
      </div>
    </Field>
  )
}

// ── Inline Image Uploader (compact, for embedding inside list items) ──────────
function InlineImageUploader({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    setUploadSuccess(false)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `admin-upload-${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('assets').upload(fileName, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName)
      onChange(publicUrl)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (err: any) {
      console.error(err)
      setUploadError(err?.message || 'Upload failed. Try pasting a URL instead.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="mt-3">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block">{label || '📷 Image (optional)'}</label>
      <div className="flex items-start gap-3">
        {/* Upload square */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
          className="relative w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:border-violet-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition group"
        >
          <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleUpload} />
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span className="text-white text-[9px] font-bold">Change</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-violet-500 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <span className="text-[9px] font-semibold">Upload</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        {/* URL input */}
        <div className="flex flex-col gap-1.5 flex-1">
          <input
            type="text"
            value={value || ''}
            onChange={e => { onChange(e.target.value); setUploadError(null); setUploadSuccess(false) }}
            placeholder="Or paste image URL..."
            className={inputCls + ' text-xs'}
          />
          {value && (
            <button type="button" onClick={() => onChange('')} className="text-[10px] text-red-500 hover:text-red-700 font-semibold self-start">
              ✕ Remove image
            </button>
          )}
          {uploadSuccess && <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold">✓ Uploaded!</p>}
          {uploadError && <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold">{uploadError}</p>}
        </div>
      </div>
    </div>
  )
}

// ── Key Claims Editor (with per-item images) ──────────────────────────────────
export type KeyClaimItem = { text: string; image?: string }
export function KeyClaimsEditor({ value, onChange }: { value: KeyClaimItem[]; onChange: (v: KeyClaimItem[]) => void }) {
  const add = () => onChange([...(value || []), { text: '', image: '' }])
  const updateText = (i: number, v: string) => { const n = [...value]; n[i] = { ...n[i], text: v }; onChange(n) }
  const updateImage = (i: number, v: string) => { const n = [...value]; n[i] = { ...n[i], image: v }; onChange(n) }
  const remove = (i: number) => onChange(value?.filter((_, idx) => idx !== i) || [])
  return (
    <Field label="Key Claims / Data Points" hint="Numbered bullets shown in the 'Key Takeaways' box. Each can optionally include an image (chart, graph, stat visual, etc).">
      <div className="space-y-4">
        {(value || []).map((item, i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/60 space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Claim #{i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="text-red-500 text-xs hover:text-red-700 font-bold">Remove</button>
            </div>
            <input value={item.text} onChange={e => updateText(i, e.target.value)} className={inputCls} placeholder={`Key claim or data point ${i + 1}...`} />
            <InlineImageUploader value={item.image || ''} onChange={v => updateImage(i, v)} label="📊 Claim Image (optional — chart, stat visual, etc.)" />
          </div>
        ))}
        <button type="button" onClick={add} className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-xl text-sm font-bold transition-colors">
          <span className="text-lg leading-none">+</span> Add Claim
        </button>
      </div>
    </Field>
  )
}

// ── Sections Editor (with per-section images) ─────────────────────────────────
type Section = { id: string; title: string; content: string; image?: string }
export function SectionsEditor({ value, onChange }: { value: Section[]; onChange: (v: Section[]) => void }) {
  const add = () => onChange([...(value || []), { id: `section-${(value || []).length + 1}`, title: '', content: '', image: '' }])
  const update = (i: number, field: keyof Section, v: string) => {
    const n = [...value]; n[i] = { ...n[i], [field]: v }; onChange(n)
  }
  const remove = (i: number) => onChange(value?.filter((_, idx) => idx !== i) || [])
  return (
    <Field label="Article Sections" hint="Each section becomes a heading + content block. Use markdown formatting. Each section can optionally include an image.">
      <div className="space-y-4">
        {(value || []).map((section, i) => (
          <div key={i} className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Section #{i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="text-red-500 text-xs hover:text-red-700 font-bold">Remove</button>
            </div>
            <input value={section.title} onChange={e => update(i, 'title', e.target.value)} placeholder="Section Heading" className={inputCls} />
            <textarea value={section.content} onChange={e => update(i, 'content', e.target.value)} placeholder="Section content..." rows={6} className={textareaCls} />
            <InlineImageUploader value={section.image || ''} onChange={v => update(i, 'image', v)} label="🖼️ Section Image (optional — illustration, diagram, etc.)" />
          </div>
        ))}
        <button type="button" onClick={add} className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-xl text-sm font-bold transition-colors">
          <span className="text-lg leading-none">+</span> Add Section
        </button>
      </div>
    </Field>
  )
}

type ResultItem = { metric: string; label: string }
export function ResultsEditor({ value, onChange }: { value: ResultItem[]; onChange: (v: ResultItem[]) => void }) {
  const add = () => onChange([...(value || []), { metric: '', label: '' }])
  const update = (i: number, field: keyof ResultItem, v: string) => {
    const n = [...value]; n[i] = { ...n[i], [field]: v }; onChange(n)
  }
  const remove = (i: number) => onChange(value?.filter((_, idx) => idx !== i) || [])
  return (
    <Field label="Key Results" hint="Highlight metrics achieved in the case study.">
      <div className="space-y-2">
        {(value || []).map((res, i) => (
          <div key={i} className="flex gap-2">
            <input value={res.metric} onChange={e => update(i, 'metric', e.target.value)} className={inputCls + ' flex-1'} placeholder="Metric (e.g. 50%)" />
            <input value={res.label} onChange={e => update(i, 'label', e.target.value)} className={inputCls + ' flex-[2]'} placeholder="Label (e.g. Reduction in manual processing)" />
            <button type="button" onClick={() => remove(i)} className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-200 transition">✕</button>
          </div>
        ))}
        <button type="button" onClick={add} className="flex items-center gap-1 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 font-semibold transition mt-2">
          <span className="text-lg leading-none">+</span> Add Result Metric
        </button>
      </div>
    </Field>
  )
}

export function SeoEditor({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const seo = value || {}
  const update = (field: string, v: string) => onChange({ ...seo, [field]: v })
  return (
    <Field label="SEO Configuration" hint="Meta tags and search engine overrides for this page.">
      <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Meta Title</label>
          <input value={seo.metaTitle || ''} onChange={e => update('metaTitle', e.target.value)} className={inputCls} placeholder="Custom SEO title..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Meta Description</label>
          <textarea value={seo.metaDescription || ''} onChange={e => update('metaDescription', e.target.value)} className={textareaCls} placeholder="Custom SEO description..." rows={2} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Keywords</label>
          <input value={seo.keywords || ''} onChange={e => update('keywords', e.target.value)} className={inputCls} placeholder="keyword1, keyword2..." />
        </div>
      </div>
    </Field>
  )
}

export function GeoEditor({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const geo = value || { targetRegions: [], localSearchTerms: [] }
  const updateRegions = (v: string[]) => onChange({ ...geo, targetRegions: v })
  const updateTerms = (v: string[]) => onChange({ ...geo, localSearchTerms: v })
  return (
    <Field label="Geo-Targeting Signals" hint="Regions and local terms for AEO and Local SEO.">
      <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-4">
        <StringListEditor label="Target Regions" value={geo.targetRegions || []} onChange={updateRegions} hint="e.g. North America, EMEA" />
        <StringListEditor label="Local Search Terms" value={geo.localSearchTerms || []} onChange={updateTerms} hint="e.g. enterprise ai automation near me" />
      </div>
    </Field>
  )
}

export function ImageUploader({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    setUploadSuccess(false)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `admin-upload-${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('assets').upload(fileName, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName)
      onChange(publicUrl)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (err: any) {
      console.error(err)
      setUploadError(err?.message || 'Upload failed. Try pasting a URL instead.')
    } finally {
      setUploading(false)
      // Reset file input so same file can be re-selected
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex items-start gap-4">
        {/* Clickable square — Upload button lives inside here */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
          className="relative w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:border-violet-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition group"
        >
          <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleUpload} />

          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="w-full h-full object-cover" onError={() => setUploadError('Image failed to load — check the URL is correct.')} />
              {/* Re-upload overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span className="text-white text-[10px] font-bold">Change</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-gray-400 group-hover:text-violet-500 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <span className="text-[11px] font-semibold text-center leading-tight px-1">Upload Image</span>
            </div>
          )}

          {/* Uploading spinner overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* URL input + feedback */}
        <div className="flex flex-col gap-2 flex-1">
          <input type="text" value={value || ''} onChange={e => { onChange(e.target.value); setUploadError(null); setUploadSuccess(false) }} placeholder="Or paste image URL..." className={inputCls} />
          {uploadSuccess && (
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold">✓ Image uploaded successfully! Click Save Changes to keep it.</p>
          )}
          {uploadError && (
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{uploadError}</p>
          )}
        </div>
      </div>
    </Field>
  )
}
