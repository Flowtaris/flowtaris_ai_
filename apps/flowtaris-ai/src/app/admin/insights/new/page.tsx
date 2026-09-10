'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { 
  Field, inputCls, textareaCls, StringListEditor, FaqEditor, SectionsEditor, ImageUploader, KeyClaimsEditor, KeyClaimItem 
} from '../../components/AdminEditors'

type FAQ = { question: string; answer: string }
type Section = { id: string; title: string; content: string; image?: string }


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewInsightPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Core fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [author, setAuthor] = useState('')
  const [authorRole, setAuthorRole] = useState('')
  const [authorBio, setAuthorBio] = useState('')
  const [category, setCategory] = useState('Research')
  const [readTime, setReadTime] = useState('10 min')
  const [publishDate, setPublishDate] = useState(new Date().toISOString().slice(0, 10))
  const [featured, setFeatured] = useState(false)
  const [excerpt, setExcerpt] = useState('')

  // Image
  const [image, setImage] = useState('')

  // Dynamic arrays
  const [keyClaims, setKeyClaims] = useState<KeyClaimItem[]>([{ text: '', image: '' }])
  const [topicClusters, setTopicClusters] = useState<string[]>([''])
  const [sections, setSections] = useState<Section[]>([{ id: 'section-1', title: '', content: '', image: '' }])
  const [faqs, setFaqs] = useState<FAQ[]>([{ question: '', answer: '' }])

  // Auto-generate slug from title
  useEffect(() => {
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, -1)) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))
    }
  }, [title])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null); setSuccess(null)
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title,
          author,
          excerpt,
          published_at: publishDate ? new Date(publishDate).toISOString() : null,
          rich_text: {
            category,
            authorRole,
            authorBio,
            readTime,
            featured,
            image,
            keyClaims: keyClaims.filter(c => c.text),
            sections: sections.filter(s => s.title || s.content),
          },
          topic_clusters: topicClusters.filter(Boolean),
          faq_items: faqs.filter(f => f.question || f.answer),
          citations: [],
          related_capability_ids: [],
          seo: {},
          geo_signals: {},
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to create insight.')
      setSuccess('Insight created! Redirecting...')
      setTimeout(() => router.push('/admin/insights'), 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to create insight.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Insight Article</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in all fields — every section reflects in the live article page.</p>
        </div>
        <a href="/admin/insights" className="text-sm text-violet-600 hover:underline">← Back to Insights</a>
      </div>

      {error && <div className="bg-red-50 dark:bg-red-900/40 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
      {success && <div className="bg-green-50 dark:bg-green-900/40 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── SECTION: CORE IDENTITY ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-5">📋 Core Identity</h2>

          <Field label="Article Title *" hint="Appears as the large H1 heading on the article page and as the browser tab title.">
            <input value={title} onChange={e => setTitle(e.target.value)} required className={inputCls} placeholder="e.g. State of AI Automation in Enterprise Finance 2025" />
          </Field>

          <Field label="URL Slug *" hint="The last part of the URL: flowtaris.ai/insights/[slug]. Auto-generated from title. Use lowercase letters and hyphens only.">
            <input value={slug} onChange={e => setSlug(e.target.value)} required className={inputCls} placeholder="e.g. state-of-ai-automation-2025" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" hint="Appears as the purple tag on the article card and used to group articles in the scrollable sidebar menu.">
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
                {['Research', 'Benchmarks', 'Analysis', 'Guides', 'Compliance', 'Technology', 'Case Studies'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field label="Read Time" hint="Shown on the article card next to the clock icon (e.g. '15 min').">
              <input value={readTime} onChange={e => setReadTime(e.target.value)} className={inputCls} placeholder="15 min" />
            </Field>
          </div>

          <Field label="Publish Date" hint="Sets the publication date shown below the author name on the article.">
            <input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} className={inputCls} />
          </Field>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
            <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 rounded accent-violet-600" />
            <div>
              <label htmlFor="featured" className="text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer">Featured Article</label>
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">Featured articles may be highlighted at the top of the insights page.</p>
            </div>
          </div>
        </div>

        {/* ── SECTION: VISUALS ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-5">🖼️ Hero Image</h2>

          <ImageUploader 
            label="Image URL" 
            hint="The article card image AND the article hero banner image. Can be an absolute URL or a path like /insights/my-article-image.png." 
            value={image} 
            onChange={setImage} 
          />
        </div>

        {/* ── SECTION: AUTHOR ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-5">👤 Author Details</h2>

          <Field label="Author Name" hint="Shown below the article title and on the article card (e.g. 'Dr. Sarah Chen').">
            <input value={author} onChange={e => setAuthor(e.target.value)} className={inputCls} placeholder="e.g. Dr. Sarah Chen" />
          </Field>

          <Field label="Author Role / Title" hint="Shown in small text under the author name in the article sidebar (e.g. 'Head of Automation Strategy').">
            <input value={authorRole} onChange={e => setAuthorRole(e.target.value)} className={inputCls} placeholder="e.g. Head of Automation Strategy" />
          </Field>

          <Field label="Author Bio" hint="A 1-2 sentence biography shown in the author box at the bottom of the article.">
            <textarea value={authorBio} onChange={e => setAuthorBio(e.target.value)} rows={2} className={textareaCls} placeholder="Former AP Director turned automation architect. Has overseen 50+ enterprise AP transformations." />
          </Field>
        </div>

        {/* ── SECTION: CONTENT ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-5">📝 Article Content</h2>

          <Field label="Excerpt / Summary *" hint="The preview text shown on the article card on the main Insights page. Keep it to 2-3 compelling sentences (max 300 chars).">
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} required rows={3} className={textareaCls} placeholder="A compelling 2-3 sentence summary that appears on the insight card..." />
          </Field>

          <KeyClaimsEditor value={keyClaims} onChange={setKeyClaims} />

          <SectionsEditor value={sections} onChange={setSections} />
        </div>

        {/* ── SECTION: SEO & AEO ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-5">🔍 SEO & Answer Engine Optimization (AEO)</h2>

          <FaqEditor value={faqs} onChange={setFaqs} />

          <StringListEditor
            label="Topic Clusters / Tags"
            hint="Keywords used to group this article by topic. Also used in the sidebar filter. Examples: 'AI Automation', 'AP Benchmarks', 'EU AI Act'."
            value={topicClusters}
            onChange={setTopicClusters}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <a href="/admin/insights" className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            Cancel
          </a>
          <button type="submit" disabled={loading} className="px-8 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold disabled:opacity-60 transition shadow-md">
            {loading ? 'Creating...' : 'Create Insight Article'}
          </button>
        </div>
      </form>
    </div>
  )
}
