'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Clock, Calendar, Tag, Pencil, Trash2, Plus, ExternalLink, GripVertical, ChevronDown, ChevronUp, Save } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Individual sortable item component
function SortableInsightItem({ insight, onDelete }: { insight: any; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: insight.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  }

  const richText = insight.rich_text || {}
  const image = richText.image || null
  const category = richText.category || '—'
  const readTime = richText.readTime || '—'
  const faqCount = (insight.faq_items || []).length
  const sectionCount = (richText.sections || []).length

  return (
    <div ref={setNodeRef} style={style} className={`bg-white dark:bg-gray-800 rounded-2xl border ${isDragging ? 'border-violet-500 shadow-xl opacity-80' : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'} transition overflow-hidden`}>
      <div className="flex gap-0 relative">
        
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners} 
          className="w-10 shrink-0 bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center cursor-grab hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-400 dark:text-gray-500 border-r border-gray-200 dark:border-gray-700"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Thumbnail */}
        <div className="w-32 shrink-0 bg-gray-100 dark:bg-gray-700 overflow-hidden">
          {image ? (
            <img src={image} alt={insight.title} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
              <BookOpen className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-md">
                  {category}
                </span>
                {richText.featured && (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                    ⭐ Featured
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white leading-snug truncate">{insight.title}</h2>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`/insights/${insight.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition"
                title="View live article"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                href={`/admin/insights/${insight.id}/edit`}
                className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition"
                title="Edit article"
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <button
                onClick={onDelete}
                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                title="Delete article"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {insight.excerpt && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{insight.excerpt}</p>
          )}

          {/* Metadata Row */}
          <div className="flex items-center gap-4 flex-wrap text-xs text-gray-400 dark:text-gray-500">
            {insight.author && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {insight.author}
              </span>
            )}
            {insight.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {new Date(insight.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            {readTime !== '—' && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {readTime}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" /> {sectionCount} sections · {faqCount} FAQs
            </span>
          </div>

          {/* Slug */}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <code className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded">
              /insights/{insight.slug}
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InsightsAdminPage() {
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null)

  const [heroConfig, setHeroConfig] = useState<any>(null)
  const [showHeroConfig, setShowHeroConfig] = useState(false)
  const [savingHero, setSavingHero] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fetchInsights = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/insights')
      if (!res.ok) throw new Error('Failed to fetch insights')
      const data = await res.json()
      setInsights(data || [])
    } catch (err: any) {
      setError('Failed to load insights. Check your Supabase connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    fetchInsights()
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/site-config')
      if (res.ok) {
        const data = await res.json()
        setHeroConfig(data.insightsHeroConfig || {
          badgeText: 'Strategic Insights for Finance Leaders',
          titleLine1: 'Empower Your',
          titleLine2: 'Financial Strategy',
          subtitle: 'Explore original research, benchmark data, and proven methodologies to navigate AI adoption and automation in enterprise finance.',
          primaryBtnText: 'Take the Diagnostic',
          primaryBtnLink: '/assessment',
          secondaryBtnText: 'Explore Research',
          secondaryBtnLink: '#research'
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const saveHeroConfig = async () => {
    setSavingHero(true)
    try {
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ insights_hero_config: heroConfig })
      })
      if (!res.ok) throw new Error('Failed to save')
      setSuccess('Hero config saved successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to save hero config.')
    } finally {
      setSavingHero(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/insights/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setInsights(prev => prev.filter(i => i.id !== id))
    } catch (err: any) {
      setError('Failed to delete insight.')
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event
    
    if (active.id !== over.id) {
      setInsights((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        
        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Immediately save the new sort order
        saveSortOrder(newItems)
        
        return newItems
      })
    }
  }

  const saveSortOrder = async (items: any[]) => {
    setSuccess(null)
    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        sort_order: index,
      }))
      
      const res = await fetch('/api/insights', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      
      if (!res.ok) throw new Error('Failed to save order')
      setSuccess('Sort order saved!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError('Failed to save new order. Please refresh and try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading insights from database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 pb-20 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights & Blog</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {insights.length} article{insights.length !== 1 ? 's' : ''} in the database — drag to reorder.
          </p>
        </div>
        <Link
          href="/admin/insights/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition shadow-md"
        >
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      {/* Floating Success Toast */}
      {success && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm z-50 animate-in fade-in slide-in-from-bottom-4">
          ✓ {success}
        </div>
      )}

      {/* Hero Config Editor */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8 overflow-hidden">
        <button 
          onClick={() => setShowHeroConfig(!showHeroConfig)}
          className="w-full flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-white">Edit Page Hero Section</span>
            <span className="text-xs bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 px-2 py-0.5 rounded-full font-semibold">Live Config</span>
          </div>
          {showHeroConfig ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>

        {showHeroConfig && heroConfig && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Badge Text</label>
              <input type="text" className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" 
                value={heroConfig.badgeText || ''} onChange={e => setHeroConfig({...heroConfig, badgeText: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Headline (Line 1 - White)</label>
                <input type="text" className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" 
                  value={heroConfig.titleLine1 || ''} onChange={e => setHeroConfig({...heroConfig, titleLine1: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Headline (Line 2 - Blue Glow)</label>
                <input type="text" className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" 
                  value={heroConfig.titleLine2 || ''} onChange={e => setHeroConfig({...heroConfig, titleLine2: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Subtitle Paragraph</label>
              <textarea rows={2} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" 
                value={heroConfig.subtitle || ''} onChange={e => setHeroConfig({...heroConfig, subtitle: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Primary Button (Purple)</h4>
                <input type="text" placeholder="Text" className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" 
                  value={heroConfig.primaryBtnText || ''} onChange={e => setHeroConfig({...heroConfig, primaryBtnText: e.target.value})} />
                <input type="text" placeholder="URL (e.g., /assessment)" className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" 
                  value={heroConfig.primaryBtnLink || ''} onChange={e => setHeroConfig({...heroConfig, primaryBtnLink: e.target.value})} />
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Secondary Button (Blue Outline)</h4>
                <input type="text" placeholder="Text" className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" 
                  value={heroConfig.secondaryBtnText || ''} onChange={e => setHeroConfig({...heroConfig, secondaryBtnText: e.target.value})} />
                <input type="text" placeholder="URL (e.g., #research)" className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" 
                  value={heroConfig.secondaryBtnLink || ''} onChange={e => setHeroConfig({...heroConfig, secondaryBtnLink: e.target.value})} />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={saveHeroConfig}
                disabled={savingHero}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition"
              >
                <Save className="w-4 h-4" /> {savingHero ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/40 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Legend / Field Map */}
      <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 rounded-2xl p-5 mb-8">
        <h3 className="text-sm font-bold text-violet-700 dark:text-violet-300 mb-3">📍 Where each field appears on the live site</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-gray-600 dark:text-gray-400">
          <div><strong className="text-gray-800 dark:text-gray-200">Title →</strong> Article page H1 heading + browser tab + article card</div>
          <div><strong className="text-gray-800 dark:text-gray-200">Image →</strong> Article card thumbnail + article hero banner</div>
          <div><strong className="text-gray-800 dark:text-gray-200">Category →</strong> Purple tag on card + sidebar filter group</div>
          <div><strong className="text-gray-800 dark:text-gray-200">Excerpt →</strong> Preview text on article card (main insights page)</div>
          <div><strong className="text-gray-800 dark:text-gray-200">Author →</strong> Card footer + article title area + author bio box</div>
          <div><strong className="text-gray-800 dark:text-gray-200">Key Claims →</strong> "Key Takeaways" box at top of article</div>
          <div><strong className="text-gray-800 dark:text-gray-200">Sections →</strong> Main article body blocks (heading + content)</div>
          <div><strong className="text-gray-800 dark:text-gray-200">FAQs →</strong> FAQ accordion at bottom of article + Google Schema</div>
          <div><strong className="text-gray-800 dark:text-gray-200">Topic Clusters →</strong> Sidebar category filter on insights page</div>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
          <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">No insights in the database yet.</p>
          <Link href="/admin/insights/new" className="inline-flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 hover:underline font-semibold">
            <Plus className="w-4 h-4" /> Create your first article
          </Link>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={insights} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {insights.map((insight) => (
                <SortableInsightItem 
                  key={insight.id} 
                  insight={insight} 
                  onDelete={() => setConfirmDelete({ id: insight.id, title: insight.title })} 
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete this article?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              You are about to permanently delete <strong className="text-gray-800 dark:text-gray-200">"{confirmDelete.title}"</strong>. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={deletingId === confirmDelete.id}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold disabled:opacity-60 transition"
              >
                {deletingId === confirmDelete.id ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
