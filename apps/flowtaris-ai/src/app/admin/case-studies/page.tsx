'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Clock, Users, Pencil, Trash2, Plus, ExternalLink, GripVertical, ChevronDown, ChevronUp, Save, Folder } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Individual sortable item component
function SortableCaseStudyItem({ cs, onDelete }: { cs: any; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cs.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  }

  const content = cs.content_data || {}
  const heroImage = content.heroImage || null
  const sector = content.sector || '—'
  const timeline = content.timeline || '—'
  const teamSize = content.teamSize || '—'

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
          {heroImage ? (
            <img src={heroImage} alt={content.client} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
              <Folder className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-md">
                  {sector}
                </span>
                {content.confidential && (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                    ⭐ Confidential
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white leading-snug truncate">{content.headline || 'Untitled Case Study'}</h2>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`/case-studies/${cs.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition"
                title="View live case study"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                href={`/admin/case-studies/${cs.id}/edit`}
                className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition"
                title="Edit case study"
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <button
                onClick={onDelete}
                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                title="Delete case study"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {content.subheadline && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{content.subheadline}</p>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {timeline}</span>
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> {teamSize}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CaseStudiesAdmin() {
  const [caseStudies, setcaseStudies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Hero config state
  const [heroConfigOpen, setHeroConfigOpen] = useState(false)
  const [heroConfig, setHeroConfig] = useState({
    badgeText: 'VERIFIED CUSTOMER RESULTS',
    titleLine1: 'Real Transformations.',
    titleLine2: 'Measured Results.',
    subtitle: 'Three enterprise deployments across NetSuite, SAP, Coupa, and Workday — with real before/after data, full technical architectures, and team testimonials. Client names anonymized per confidentiality agreements.',
    metric1Value: '$27M+', metric1Label: 'Combined Value Delivered',
    metric2Value: '5', metric2Label: 'Enterprise Deployments',
    metric3Value: '<8 wks', metric3Label: 'Average Time to Value',
    metric4Value: '99%', metric4Label: 'Avg Automation Rate Achieved',
  })
  const [savingHero, setSavingHero] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fetchcaseStudies = async () => {
    try {
      const res = await fetch('/api/case-studies')
      if (!res.ok) throw new Error('Failed to fetch case studies')
      const data = await res.json()
      setcaseStudies(data)
    } catch (err: any) {
      setError('Could not load case studies. Ensure database is connected.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    fetchcaseStudies()
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/site-config')
      if (res.ok) {
        const data = await res.json()
        setHeroConfig(data.case_studies_hero_config || {
          badgeText: 'VERIFIED CUSTOMER RESULTS',
          titleLine1: 'Real Transformations.',
          titleLine2: 'Measured Results.',
          subtitle: 'Three enterprise deployments across NetSuite, SAP, Coupa, and Workday — with real before/after data, full technical architectures, and team testimonials. Client names anonymized per confidentiality agreements.',
          metric1Value: '$27M+', metric1Label: 'Combined Value Delivered',
          metric2Value: '5', metric2Label: 'Enterprise Deployments',
          metric3Value: '<8 wks', metric3Label: 'Average Time to Value',
          metric4Value: '99%', metric4Label: 'Avg Automation Rate Achieved',
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
        body: JSON.stringify({ case_studies_hero_config: heroConfig })
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
      const res = await fetch(`/api/case-studies/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setcaseStudies(prev => prev.filter(i => i.id !== id))
    } catch (err: any) {
      setError('Failed to delete case study.')
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event
    
    if (active.id !== over.id) {
      setcaseStudies((items) => {
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
      
      const res = await fetch('/api/case-studies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      
      if (!res.ok) throw new Error('Failed to save order')
    } catch (err) {
      console.error(err)
      setError('Failed to save sort order')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div></div>
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Case Studies</h1>
          <p className="text-gray-500 dark:text-gray-400">{caseStudies.length} case {caseStudies.length === 1 ? 'study' : 'studies'} in the database — drag to reorder.</p>
        </div>
        <Link 
          href="/admin/case-studies/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Case Study
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-800">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm border border-emerald-100 dark:border-emerald-800">
          {success}
        </div>
      )}

      {/* Hero Config Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <button 
          onClick={() => setHeroConfigOpen(!heroConfigOpen)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Page Hero Section</h2>
            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 text-xs font-bold rounded-md">Live Config</span>
          </div>
          {heroConfigOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {heroConfigOpen && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Badge Text</label>
                <input type="text" value={heroConfig.badgeText} onChange={e => setHeroConfig({...heroConfig, badgeText: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline (Line 1 - White)</label>
                <input type="text" value={heroConfig.titleLine1} onChange={e => setHeroConfig({...heroConfig, titleLine1: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline (Line 2 - Blue Glow)</label>
                <input type="text" value={heroConfig.titleLine2} onChange={e => setHeroConfig({...heroConfig, titleLine2: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle Paragraph</label>
                <textarea rows={3} value={heroConfig.subtitle} onChange={e => setHeroConfig({...heroConfig, subtitle: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Metric 1 (e.g. $27M+)</label>
                <div className="flex gap-2">
                  <input type="text" value={heroConfig.metric1Value} onChange={e => setHeroConfig({...heroConfig, metric1Value: e.target.value})} placeholder="Value" className="w-1/3 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <input type="text" value={heroConfig.metric1Label} onChange={e => setHeroConfig({...heroConfig, metric1Label: e.target.value})} placeholder="Label" className="w-2/3 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Metric 2 (e.g. 5)</label>
                <div className="flex gap-2">
                  <input type="text" value={heroConfig.metric2Value} onChange={e => setHeroConfig({...heroConfig, metric2Value: e.target.value})} placeholder="Value" className="w-1/3 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <input type="text" value={heroConfig.metric2Label} onChange={e => setHeroConfig({...heroConfig, metric2Label: e.target.value})} placeholder="Label" className="w-2/3 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Metric 3 (e.g. {'<8 wks'})</label>
                <div className="flex gap-2">
                  <input type="text" value={heroConfig.metric3Value} onChange={e => setHeroConfig({...heroConfig, metric3Value: e.target.value})} placeholder="Value" className="w-1/3 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <input type="text" value={heroConfig.metric3Label} onChange={e => setHeroConfig({...heroConfig, metric3Label: e.target.value})} placeholder="Label" className="w-2/3 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Metric 4 (e.g. 99%)</label>
                <div className="flex gap-2">
                  <input type="text" value={heroConfig.metric4Value} onChange={e => setHeroConfig({...heroConfig, metric4Value: e.target.value})} placeholder="Value" className="w-1/3 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <input type="text" value={heroConfig.metric4Label} onChange={e => setHeroConfig({...heroConfig, metric4Label: e.target.value})} placeholder="Label" className="w-2/3 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>

            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                onClick={saveHeroConfig} 
                disabled={savingHero}
                className="inline-flex items-center px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl font-medium transition"
              >
                {savingHero ? <span className="animate-spin mr-2 border-2 border-white/20 border-t-white rounded-full w-4 h-4" /> : <Save className="w-4 h-4 mr-2" />}
                Save Configuration
              </button>
            </div>
          </div>
        )}
      </div>

      {/* List of Case Studies */}
      {caseStudies.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No case studies yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first case study to get started.</p>
          <Link href="/admin/case-studies/new" className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition">
            <Plus className="w-5 h-5 mr-2" /> Create Case Study
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={caseStudies.map(cs => cs.id)} strategy={verticalListSortingStrategy}>
              {caseStudies.map(cs => (
                <div key={cs.id} className="relative">
                  <SortableCaseStudyItem 
                    cs={cs} 
                    onDelete={() => setConfirmDelete(cs.id)}
                  />
                  
                  {/* Inline Delete Confirmation */}
                  {confirmDelete === cs.id && (
                    <div className="absolute inset-0 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-between px-6 border border-red-200 dark:border-red-900/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">Delete Case Study?</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">This cannot be undone.</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setConfirmDelete(null)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleDelete(cs.id)}
                          disabled={deletingId === cs.id}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition"
                        >
                          {deletingId === cs.id ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
