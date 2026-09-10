'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, Plus, GripVertical, Image as ImageIcon, Copy } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableItem({ id, item, renderItem, onRemove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1, position: 'relative' as const }

  return (
    <div ref={setNodeRef} style={style} className={`flex items-start gap-2 ${isDragging ? 'opacity-50' : ''}`}>
      <div {...attributes} {...listeners} className="mt-2 text-gray-400 hover:text-gray-600 cursor-grab">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        {renderItem(item)}
      </div>
      <button onClick={onRemove} className="mt-2 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}

function SortableList({ items, setItems, renderItem, onAdd, defaultNewItem }: any) {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))
  
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i: any) => i._id === active.id)
      const newIndex = items.findIndex((i: any) => i._id === over.id)
      setItems(arrayMove(items, oldIndex, newIndex))
    }
  }

  // Ensure all items have a unique _id for dnd-kit
  const itemsWithIds = items.map((i: any, idx: number) => ({ ...i, _id: i._id || `id-${Date.now()}-${idx}` }))

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={itemsWithIds.map((i: any) => i._id)} strategy={verticalListSortingStrategy}>
          {itemsWithIds.map((item: any, index: number) => (
            <SortableItem
              key={item._id}
              id={item._id}
              item={item}
              renderItem={(itm: any) => renderItem(itm, (updated: any) => {
                const newItems = [...itemsWithIds]
                newItems[index] = { ...updated, _id: itm._id }
                setItems(newItems.map((i: any) => { const { _id, ...rest } = i; return rest }))
              })}
              onRemove={() => {
                const newItems = [...itemsWithIds]
                newItems.splice(index, 1)
                setItems(newItems.map((i: any) => { const { _id, ...rest } = i; return rest }))
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button onClick={() => setItems([...items, defaultNewItem])} className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center">
        <Plus className="w-4 h-4 mr-1" /> Add Item
      </button>
    </div>
  )
}

export default function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const isNew = resolvedParams.id === 'new'
  const router = useRouter()

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Basic Fields
  const [slug, setSlug] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [client, setClient] = useState('')
  const [confidential, setConfidential] = useState(false)
  const [sector, setSector] = useState('')
  const [label, setLabel] = useState('CONFIDENTIAL — ANONYMIZED')
  const [headline, setHeadline] = useState('')
  const [subheadline, setSubheadline] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [timeline, setTimeline] = useState('')
  const [teamSize, setTeamSize] = useState<number | ''>('')
  const [deploymentDate, setDeploymentDate] = useState('')

  // Arrays
  const [platforms, setPlatforms] = useState<string[]>([])
  const [capabilityTags, setCapabilityTags] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [relatedSlugs, setRelatedSlugs] = useState<string[]>([])

  // Complex Objects
  const [keyMetrics, setKeyMetrics] = useState<any[]>([])
  const [challenge, setChallenge] = useState({ title: '', body: '', painPoints: [] as string[] })
  const [images, setImages] = useState<any[]>([])
  const [approach, setApproach] = useState({ title: '', phases: [] as any[] })
  const [technicalSpecs, setTechnicalSpecs] = useState({ title: '', points: [] as any[] })
  const [results, setResults] = useState({ title: '', body: '', bullets: [] as string[] })
  const [testimonial, setTestimonial] = useState({ quote: '', author: '', company: '' })

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/case-studies/${resolvedParams.id}`)
        .then(res => res.json())
        .then(data => {
          setSlug(data.slug || '')
          setIsPublished(data.is_published || false)
          
          const content = data.content_data || {}
          setClient(content.client || '')
          setConfidential(content.confidential || false)
          setSector(content.sector || '')
          setLabel(content.label || '')
          setHeadline(content.headline || '')
          setSubheadline(content.subheadline || '')
          setHeroImage(content.heroImage || '')
          setTimeline(content.timeline || '')
          setTeamSize(content.teamSize || '')
          setDeploymentDate(content.deploymentDate || '')
          
          setPlatforms(content.platforms || [])
          setCapabilityTags(content.capabilityTags || [])
          setTags(content.tags || [])
          setRelatedSlugs(content.relatedSlugs || [])
          
          setKeyMetrics(content.keyMetrics || [])
          setChallenge(content.challenge || { title: '', body: '', painPoints: [] })
          setImages(content.images || [])
          setApproach(content.approach || { title: '', phases: [] })
          setTechnicalSpecs(content.technicalSpecs || { title: '', points: [] })
          setResults(content.results || { title: '', body: '', bullets: [] })
          setTestimonial(content.testimonial || { quote: '', author: '', company: '' })
          
          setLoading(false)
        })
        .catch(() => {
          setError('Failed to load case study')
          setLoading(false)
        })
    }
  }, [resolvedParams.id, isNew])

  const handleSave = async () => {
    if (!slug || !headline) {
      setError('Slug and Headline are required.')
      return
    }
    
    setSaving(true)
    setError(null)
    
    const content_data = {
      client, confidential, sector, label, headline, subheadline, heroImage, 
      timeline, teamSize, deploymentDate, platforms, capabilityTags, tags, 
      relatedSlugs, keyMetrics, challenge, images, approach, technicalSpecs, 
      results, testimonial
    }
    
    const payload = {
      slug,
      title: headline,
      subtitle: subheadline,
      client_name: client,
      is_confidential: confidential,
      category: sector,
      is_published: isPublished,
      content_data
    }

    try {
      const url = isNew ? '/api/case-studies' : `/api/case-studies/${resolvedParams.id}`
      const method = isNew ? 'POST' : 'PUT'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to save')
      }
      
      router.push('/admin/case-studies')
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>

  // Helper for simple array string inputs
  const ArrayInput = ({ label, values, setValues, placeholder }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((val: string, idx: number) => (
          <span key={idx} className="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 text-xs px-2 py-1 rounded-md flex items-center gap-1">
            {val}
            <button onClick={() => setValues(values.filter((_:any, i:number) => i !== idx))} className="hover:text-red-500">&times;</button>
          </span>
        ))}
      </div>
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.currentTarget.value.trim();
            if (val && !values.includes(val)) {
              setValues([...values, val]);
              e.currentTarget.value = '';
            }
          }
        }}
      />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-40 bg-gray-50/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <Link href="/admin/case-studies" className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? 'New Case Study' : 'Edit Case Study'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">
            <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="rounded border-gray-300 text-violet-600 focus:ring-violet-600" />
            Published
          </label>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Basic Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Slug</label>
                <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="e.g., global-saas-decacorn" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
                <input type="text" value={client} onChange={e => setClient(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={confidential} onChange={e => setConfidential(e.target.checked)} className="rounded" />
                Anonymized / Confidential
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Badge Label</label>
                <input type="text" value={label} onChange={e => setLabel(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sector</label>
                <input type="text" value={sector} onChange={e => setSector(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timeline (e.g. "90 days")</label>
                <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Size</label>
                <input type="number" value={teamSize} onChange={e => setTeamSize(parseInt(e.target.value)||'')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deployment Date</label>
                <input type="text" value={deploymentDate} onChange={e => setDeploymentDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Image URL</label>
                <input type="text" value={heroImage} onChange={e => setHeroImage(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="/case-studies/cs_..." />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tags & Categories</h2>
            <ArrayInput label="Platforms (e.g. NetSuite)" values={platforms} setValues={setPlatforms} placeholder="Press Enter to add" />
            <ArrayInput label="Capability Tags" values={capabilityTags} setValues={setCapabilityTags} placeholder="Press Enter to add" />
            <ArrayInput label="Search/Filter Tags" values={tags} setValues={setTags} placeholder="Press Enter to add" />
            <ArrayInput label="Related Slugs" values={relatedSlugs} setValues={setRelatedSlugs} placeholder="Press Enter to add" />
          </div>
        </div>

        {/* Right Column: Content Sections */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hero Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline</label>
                <textarea rows={2} value={headline} onChange={e => setHeadline(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subheadline</label>
                <textarea rows={3} value={subheadline} onChange={e => setSubheadline(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Metrics</h2>
            <SortableList 
              items={keyMetrics} 
              setItems={setKeyMetrics} 
              defaultNewItem={{ label: 'New Metric', value: '', direction: 'value', color: '#38bdf8' }}
              renderItem={(item: any, update: any) => (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500">Label</label>
                    <input type="text" value={item.label} onChange={e => update({...item, label: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Direction type</label>
                    <select value={item.direction} onChange={e => update({...item, direction: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600">
                      <option value="value">Static Value</option>
                      <option value="up">Before/After (Up)</option>
                      <option value="down">Before/After (Down)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Color</label>
                    <input type="text" value={item.color} onChange={e => update({...item, color: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  {item.direction === 'value' ? (
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500">Static Value</label>
                      <input type="text" value={item.value || ''} onChange={e => update({...item, value: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                  ) : (
                    <>
                      <div><label className="text-xs text-gray-500">Before</label><input type="text" value={item.before || ''} onChange={e => update({...item, before: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                      <div><label className="text-xs text-gray-500">After</label><input type="text" value={item.after || ''} onChange={e => update({...item, after: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                      <div><label className="text-xs text-gray-500">% Improvement Number</label><input type="number" value={item.improvement || ''} onChange={e => update({...item, improvement: parseInt(e.target.value)||0})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                      <div>
                        <label className="text-xs text-gray-500">Unit Label</label>
                        <select value={item.unit || ''} onChange={e => update({...item, unit: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600">
                          <option value="reduction">Reduction</option>
                          <option value="improvement">Improvement</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">The Challenge</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium">Title</label><input type="text" value={challenge.title} onChange={e => setChallenge({...challenge, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
              <div><label className="block text-sm font-medium">Body Markdown</label><textarea rows={5} value={challenge.body} onChange={e => setChallenge({...challenge, body: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
              <ArrayInput label="Pain Points" values={challenge.painPoints} setValues={(v:any) => setChallenge({...challenge, painPoints: v})} placeholder="Press Enter to add" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Inline Images</h2>
            <SortableList 
              items={images} 
              setItems={setImages} 
              defaultNewItem={{ src: '', alt: '', caption: '' }}
              renderItem={(item: any, update: any) => (
                <div className="space-y-2 text-sm">
                  <div><label className="text-xs text-gray-500">Image Source (URL or /path)</label><input type="text" value={item.src} onChange={e => update({...item, src: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                  <div><label className="text-xs text-gray-500">Alt Text</label><input type="text" value={item.alt} onChange={e => update({...item, alt: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                  <div><label className="text-xs text-gray-500">Caption</label><textarea rows={2} value={item.caption} onChange={e => update({...item, caption: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                </div>
              )}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">The Solution (Approach)</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium">Title</label><input type="text" value={approach.title} onChange={e => setApproach({...approach, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
              <SortableList 
                items={approach.phases} 
                setItems={(v:any) => setApproach({...approach, phases: v})} 
                defaultNewItem={{ phase: 'Phase X', description: '', outcomes: [] }}
                renderItem={(item: any, update: any) => (
                  <div className="space-y-2 text-sm">
                    <div><label className="text-xs text-gray-500">Phase Name</label><input type="text" value={item.phase} onChange={e => update({...item, phase: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    <div><label className="text-xs text-gray-500">Description</label><textarea rows={3} value={item.description} onChange={e => update({...item, description: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    <ArrayInput label="Outcomes" values={item.outcomes || []} setValues={(v:any) => update({...item, outcomes: v})} placeholder="Press Enter to add" />
                  </div>
                )}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technical Specs</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium">Title</label><input type="text" value={technicalSpecs.title} onChange={e => setTechnicalSpecs({...technicalSpecs, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
              <SortableList 
                items={technicalSpecs.points} 
                setItems={(v:any) => setTechnicalSpecs({...technicalSpecs, points: v})} 
                defaultNewItem={{ icon: 'Layers', title: 'New Spec', desc: '' }}
                renderItem={(item: any, update: any) => (
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs text-gray-500">Icon Name (Lucide string)</label><input type="text" value={item.icon} onChange={e => update({...item, icon: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                      <div><label className="text-xs text-gray-500">Title</label><input type="text" value={item.title} onChange={e => update({...item, title: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    </div>
                    <div><label className="text-xs text-gray-500">Description</label><textarea rows={2} value={item.desc} onChange={e => update({...item, desc: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Results</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium">Title</label><input type="text" value={results.title} onChange={e => setResults({...results, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
              <div><label className="block text-sm font-medium">Body Markdown</label><textarea rows={5} value={results.body} onChange={e => setResults({...results, body: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
              <ArrayInput label="Result Bullets" values={results.bullets} setValues={(v:any) => setResults({...results, bullets: v})} placeholder="Press Enter to add" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Testimonial</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium">Quote</label><textarea rows={3} value={testimonial.quote} onChange={e => setTestimonial({...testimonial, quote: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Author</label><input type="text" value={testimonial.author} onChange={e => setTestimonial({...testimonial, author: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
                <div><label className="block text-sm font-medium">Company</label><input type="text" value={testimonial.company} onChange={e => setTestimonial({...testimonial, company: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
