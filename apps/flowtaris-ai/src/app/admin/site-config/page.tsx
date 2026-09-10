'use client';
import { useEffect, useState, useRef } from 'react'
import { getSiteConfig, supabase } from '@/lib/supabase'
import { Upload, X, Eye, EyeOff, RefreshCw, CheckCircle2, AlertCircle, ImageIcon, Type, Tag } from 'lucide-react'

// ── Shared UI primitives ─────────────────────────────────────────────────────

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
    {children}
  </label>
)

const Hint = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-gray-400 mt-1">{children}</p>
)

const Input = ({
  id, label, value, onChange, placeholder, hint, type = 'text', disabled = false
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string; type?: string; disabled?: boolean
}) => (
  <div className="mb-5">
    <Label htmlFor={id}>{label}</Label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5 text-sm
        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500
        focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    />
    {hint && <Hint>{hint}</Hint>}
  </div>
)

const Textarea = ({
  id, label, value, onChange, rows = 4, placeholder, hint
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  rows?: number; placeholder?: string; hint?: string
}) => (
  <div className="mb-5">
    <Label htmlFor={id}>{label}</Label>
    <textarea
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5 text-sm
        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500 font-mono
        focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
        transition-all resize-y"
    />
    {hint && <Hint>{hint}</Hint>}
  </div>
)

// ── Section Wrapper ───────────────────────────────────────────────────────────

const Section = ({ title, icon: Icon, children, accent = 'blue' }: {
  title: string; icon: React.ElementType; children: React.ReactNode; accent?: string
}) => {
  const accentClasses: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/40',
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/40',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/40',
  }
  const iconClasses: Record<string, string> = {
    blue: 'text-blue-500',
    amber: 'text-amber-500',
    purple: 'text-purple-500',
  }
  return (
    <div className={`rounded-xl border p-6 ${accentClasses[accent] ?? accentClasses.blue} mb-6`}>
      <div className="flex items-center gap-2.5 mb-5">
        <Icon className={`w-5 h-5 ${iconClasses[accent] ?? iconClasses.blue}`} />
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      </div>
      {children}
    </div>
  )
}

// ── Types ─────────────────────────────────────────────────────────────────────

type SiteConfigFormData = {
  site_name: string
  site_url: string
  tagline: string
  logo_url: string
  favicon_url: string
  header_brand_name: string
  header_badge_text: string
  header_show_logo: boolean
  navigation: string
  footer_resources: string
  footer_company: string
  social_links: string
  contact_email: string
  support_email: string
  privacy_policy_url: string
  terms_of_service_url: string
  cookie_policy_url: string
  analytics: string
  seo: string
  trust_signals: any[]
  newsletter_title: string
  newsletter_description: string
  newsletter_button_text: string
}

const DEFAULT_LOGO = '/images/flowtaris.avif'
const DEFAULTS: SiteConfigFormData = {
  site_name: 'Flowtaris AI',
  site_url: 'https://flowtaris.ai',
  tagline: 'Enterprise AI Automation for Finance',
  logo_url: DEFAULT_LOGO,
  favicon_url: '/favicon.ico',
  header_brand_name: 'Flowtaris',
  header_badge_text: '.ai',
  header_show_logo: true,
  navigation: '[]',
  footer_resources: '[\n  { "label": "Insights", "href": "/insights" },\n  { "label": "Case Studies", "href": "/case-studies" },\n  { "label": "ROI Calculator", "href": "/roi-calculator" },\n  { "label": "Assessment", "href": "/assessment" },\n  { "label": "Cost of Inaction", "href": "/cost-of-inaction" }\n]',
  footer_company: '[\n  { "label": "About Us", "href": "/about-flowtaris-ai" },\n  { "label": "Contact", "href": "/contact" }\n]',
  social_links: '{}',
  contact_email: '',
  support_email: '',
  privacy_policy_url: '',
  terms_of_service_url: '',
  cookie_policy_url: '',
  analytics: '{}',
  seo: '{}',
  trust_signals: [
    { id: '1', label: 'Certified', value: 'SOC 2' },
    { id: '2', label: 'Compliant', value: 'GDPR' },
    { id: '3', label: 'Certified', value: 'ISO 27001' },
    { id: '4', label: 'Uptime SLA', value: '99.99%' },
    { id: '5', label: 'API Calls/Day', value: '50M+' },
    { id: '6', label: 'Trusted By', value: 'Fortune 500' },
  ],
  newsletter_title: 'Stay ahead in Enterprise AI',
  newsletter_description: 'Join 10,000+ finance leaders receiving our weekly insights on autonomous workflows, GenAI document intelligence, and predictive analytics.',
  newsletter_button_text: 'Subscribe',
}

// ── Logo Upload Component ─────────────────────────────────────────────────────

function LogoManager({
  logoUrl,
  showLogo,
  onLogoChange,
  onShowLogoChange,
}: {
  logoUrl: string
  showLogo: boolean
  onLogoChange: (url: string) => void
  onShowLogoChange: (show: boolean) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = useState(logoUrl)
  const [previewError, setPreviewError] = useState(false)
  const [inputMode, setInputMode] = useState<'preview' | 'url'>('preview')
  const [uploading, setUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const currentLogo = logoUrl || DEFAULT_LOGO
  const isDefault = !logoUrl || logoUrl === DEFAULT_LOGO

  const handleFileUpload = async (file: File) => {
    if (!file) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `logo-${Date.now()}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('assets')
        .upload(fileName, file)
      
      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName)
        
      onLogoChange(publicUrl)
      setUrlInput(publicUrl)
      setInputMode('preview')
    } catch (err) {
      console.error(err)
      alert('Failed to upload image. Make sure it is a valid image file.')
    } finally {
      setUploading(false)
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }
  const onDragLeave = () => setIsDragOver(false)
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleUrlCommit = () => {
    onLogoChange(urlInput.trim())
    setPreviewError(false)
    setInputMode('preview')
  }

  const handleRemove = () => {
    onLogoChange('')
    setUrlInput(DEFAULT_LOGO)
    setPreviewError(false)
  }

  const handleReset = () => {
    onLogoChange(DEFAULT_LOGO)
    setUrlInput(DEFAULT_LOGO)
    setPreviewError(false)
  }

  return (
    <div className="space-y-4">
      {/* Preview card */}
      <div className="flex items-start gap-5">
        {/* Logo preview box */}
        <div className="relative flex-shrink-0 group/upload cursor-pointer"
             onDragOver={onDragOver}
             onDragLeave={onDragLeave}
             onDrop={onDrop}
             onClick={() => fileRef.current?.click()}
        >
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0])
              }
            }}
          />
          <div className={`w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden shadow-inner transition-colors
            ${isDragOver ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'}`}>
            
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-[10px] text-gray-500 font-medium">Uploading</span>
              </div>
            ) : showLogo && !previewError ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentLogo}
                  alt="Current logo preview"
                  className={`object-contain w-16 h-16 transition-opacity ${isDragOver ? 'opacity-30' : 'opacity-100 group-hover/upload:opacity-30'}`}
                  onError={() => setPreviewError(true)}
                />
                <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity
                  ${isDragOver ? 'opacity-100' : 'opacity-0 group-hover/upload:opacity-100'}`}>
                  <Upload className="w-6 h-6 text-blue-500 mb-1 drop-shadow-md" />
                  <span className="text-[10px] font-bold text-blue-600 bg-white/80 px-2 py-0.5 rounded shadow-sm">Upload</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-300">
                <ImageIcon className="w-8 h-8" />
                <span className="text-[10px]">{showLogo ? 'Error' : 'Hidden'}</span>
              </div>
            )}
          </div>
          {/* Status badge */}
          <span className={`absolute -bottom-1.5 -right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full border
            ${isDefault
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 border-gray-200 dark:border-gray-600'
              : 'bg-green-50 dark:bg-green-900/30 text-green-600 border-green-200 dark:border-green-700'
            }`}>
            {isDefault ? 'Default' : 'Custom'}
          </span>
        </div>

        {/* Logo info + actions */}
        <div className="flex-1 min-w-0">
          {/* Header preview */}
          <div className="mb-3 px-3 py-2.5 bg-[#05050a] rounded-lg flex items-center gap-2 w-fit">
            {showLogo && !previewError && (
              <div className="w-6 h-6 rounded-full overflow-hidden bg-white ring-1 ring-white/20 flex-shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentLogo}
                  alt="Logo in header"
                  className="object-contain w-5 h-5"
                  onError={() => setPreviewError(true)}
                />
              </div>
            )}
            <span className="text-white text-xs font-bold">Flowtaris</span>
            <span className="inline-flex items-center gap-[3px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#D4A847]/20 to-[#D4A847]/20 border border-[#D4A847]/40 text-[#f0c97a] text-[9px] font-bold tracking-widest uppercase">
              <span className="w-[3px] h-[3px] rounded-full bg-[#f0c97a] flex-shrink-0" />
              .ai
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate max-w-xs">
            {isDefault ? 'Using default Flowtaris logo' : (logoUrl || 'No logo set')}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setInputMode(inputMode === 'url' ? 'preview' : 'url')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                border border-blue-200 dark:border-blue-700/50
                hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Type className="w-3 h-3" />
              {inputMode === 'url' ? 'Cancel' : 'Set URL'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400
                border border-gray-200 dark:border-gray-600
                hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-3 h-3" />
              Reset to default
            </button>
            <button
              type="button"
              onClick={() => onShowLogoChange(!showLogo)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                border transition-colors
                ${showLogo
                  ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 border-amber-200 dark:border-amber-700/50 hover:bg-amber-100'
                  : 'bg-green-50 dark:bg-green-900/30 text-green-600 border-green-200 dark:border-green-700/50 hover:bg-green-100'
                }`}
            >
              {showLogo ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showLogo ? 'Hide logo' : 'Show logo'}
            </button>
          </div>
        </div>
      </div>

      {/* URL input mode */}
      {inputMode === 'url' && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 space-y-3">
          <Label>Logo image URL</Label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://... or /images/logo.png"
              className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              onKeyDown={e => e.key === 'Enter' && handleUrlCommit()}
            />
            <button
              type="button"
              onClick={handleUrlCommit}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Apply
            </button>
          </div>
          <div className="flex items-center justify-between">
            <Hint>Paste an external URL or a path relative to /public</Hint>
            {logoUrl && !isDefault && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                <X className="w-3 h-3" /> Remove custom logo
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Favicon Upload Component ──────────────────────────────────────────────────

function FaviconUpload({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileUpload = async (file: File) => {
    if (!file) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `favicon-${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('assets').upload(fileName, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName)
      onChange(publicUrl)
      setPreviewError(false)
    } catch (err) {
      console.error(err)
      alert('Failed to upload favicon. Make sure it is a valid image file.')
    } finally {
      setUploading(false)
    }
  }

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true) }
  const onDragLeave = () => setIsDragOver(false)
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0])
  }

  return (
    <div className="mb-5">
      <Label>Favicon</Label>
      <div className="flex items-start gap-4">
        {/* Preview / Upload Box */}
        <div
          className={`relative w-16 h-16 flex-shrink-0 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-colors group
            ${isDragOver ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-blue-400'}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          title="Click or drag to upload favicon"
        >
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept="image/*,.ico"
            onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]) }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-[9px] text-gray-500 font-medium">Uploading</span>
            </div>
          ) : value && !previewError ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Favicon preview"
                className="w-10 h-10 object-contain group-hover:opacity-40 transition-opacity"
                onError={() => setPreviewError(true)}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Upload className="w-5 h-5 text-blue-500 mb-0.5" />
                <span className="text-[9px] font-bold text-blue-600">Change</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <ImageIcon className="w-6 h-6" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Upload</span>
            </div>
          )}
        </div>

        {/* URL Input */}
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={e => { onChange(e.target.value); setPreviewError(false) }}
            placeholder="/favicon.ico or https://..."
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5 text-sm
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
          />
          <p className="text-xs text-gray-400 mt-1">Path or URL to the site favicon (ICO, PNG, or SVG). Click the box or drag a file to upload.</p>
        </div>
      </div>
    </div>
  )
}

// ── Header Live Preview ───────────────────────────────────────────────────────

function HeaderPreview({ brandName, badgeText, showLogo, logoUrl }: {
  brandName: string; badgeText: string; showLogo: boolean; logoUrl: string
}) {
  const [imgError, setImgError] = useState(false)
  const logo = logoUrl || DEFAULT_LOGO

  return (
    <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
      <p className="text-xs text-gray-500 mb-3 uppercase tracking-widest font-semibold">Live Header Preview</p>
      <div className="flex justify-end">
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#05050a] border border-white/10 shadow-xl">
          {/* Brand */}
          <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5">
            {showLogo && !imgError && (
              <div className="w-7 h-7 rounded-full overflow-hidden bg-white ring-1 ring-white/15 flex-shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt="Logo preview"
                  className="object-contain w-6 h-6"
                  onError={() => setImgError(true)}
                />
              </div>
            )}
            <span className="flex items-center gap-2 ml-1">
              <span className="text-white font-semibold text-[13px] tracking-wide">{brandName || 'Flowtaris'}</span>
              {/* Premium gold badge — matches live header */}
              <span className="inline-flex items-center gap-[3px] px-2 py-[3px] rounded-full bg-gradient-to-r from-[#D4A847]/20 via-[#f0c97a]/10 to-[#D4A847]/20 border border-[#D4A847]/40 text-[#f0c97a] text-[10px] font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(212,168,71,0.2)]">
                <span className="w-[4px] h-[4px] rounded-full bg-[#f0c97a] animate-pulse flex-shrink-0" />
                {badgeText || '.ai'}
              </span>
            </span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-0.5">
            <div className="px-3 py-1.5 rounded-full text-[12px] text-neutral-400">Assessment</div>
            <div className="px-3 py-1.5 rounded-full text-[12px] text-neutral-400">ROI</div>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-[#D4A847]/20 bg-[#D4A847]/10">
            <span className="text-[#D4A847] text-[12px] font-semibold">Corporate</span>
            <span className="text-[#D4A847]/50 text-[10px]">↗</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Trust Signals Manager ──────────────────────────────────────────────────────

function TrustSignalsManager({
  signals,
  onChange
}: {
  signals: any[]
  onChange: (signals: any[]) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  const handleAdd = () => {
    onChange([...(signals || []), { id: Date.now().toString(), label: 'New Label', value: 'New Value', imageUrl: null }])
  }

  const handleRemove = (index: number) => {
    const newSignals = [...(signals || [])]
    newSignals.splice(index, 1)
    onChange(newSignals)
  }

  const handleUpdate = (index: number, key: string, value: any) => {
    const newSignals = [...(signals || [])]
    newSignals[index] = { ...newSignals[index], [key]: value }
    onChange(newSignals)
  }

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return
    setUploadingIndex(index)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `trust-badge-${Date.now()}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('assets')
        .upload(fileName, file)
      
      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName)
        
      handleUpdate(index, 'imageUrl', publicUrl)
    } catch (err) {
      console.error(err)
      alert('Failed to upload image. Make sure it is a valid image file.')
    } finally {
      setUploadingIndex(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <Hint>Manage the trust badges displayed on the homepage. You can upload custom icons or just use text.</Hint>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          + Add Signal
        </button>
      </div>

      <div className="space-y-3">
        {(signals || []).map((signal, index) => (
          <div key={signal.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            {/* Image Uploader */}
            <div className="flex-shrink-0 relative group">
              <input
                type="file"
                id={`trust-file-${signal.id}`}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(index, e.target.files[0])
                  }
                }}
              />
              <div 
                className="w-16 h-16 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-700/50"
                onClick={() => document.getElementById(`trust-file-${signal.id}`)?.click()}
              >
                {uploadingIndex === index ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                ) : signal.imageUrl ? (
                  <img src={signal.imageUrl} alt="Badge" className="w-full h-full object-contain p-1" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
              {signal.imageUrl && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleUpdate(index, 'imageUrl', null) }}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Text Inputs */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Value / Title</label>
                <input
                  type="text"
                  value={signal.value}
                  onChange={e => handleUpdate(index, 'value', e.target.value)}
                  placeholder="e.g. SOC 2 or 99.99%"
                  className="w-full text-sm border-b border-gray-200 dark:border-gray-600 bg-transparent py-1 focus:outline-none focus:border-blue-500 transition-colors dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Label / Subtitle</label>
                <input
                  type="text"
                  value={signal.label}
                  onChange={e => handleUpdate(index, 'label', e.target.value)}
                  placeholder="e.g. Certified or Uptime SLA"
                  className="w-full text-sm border-b border-gray-200 dark:border-gray-600 bg-transparent py-1 focus:outline-none focus:border-blue-500 transition-colors dark:text-white"
                />
              </div>
            </div>

            {/* Remove Action */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {(!signals || signals.length === 0) && (
          <div className="text-center py-6 text-sm text-gray-500 border border-dashed rounded-xl dark:border-gray-700">
            No trust signals added yet. Add one to build trust!
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SiteConfigPage() {
  const [config, setConfig] = useState<SiteConfigFormData>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const update = <K extends keyof SiteConfigFormData>(key: K, value: SiteConfigFormData[K]) =>
    setConfig(prev => ({ ...prev, [key]: value }))

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true)
        const data = await getSiteConfig()
        if (data) {
          const newConfig = {
            site_name: data.site_name || DEFAULTS.site_name,
            site_url: data.site_url || DEFAULTS.site_url,
            tagline: data.tagline || DEFAULTS.tagline,
            logo_url: data.logo_url || DEFAULTS.logo_url,
            favicon_url: data.favicon_url || DEFAULTS.favicon_url,
            header_brand_name: (data as any).header_brand_name || DEFAULTS.header_brand_name,
            header_badge_text: (data as any).header_badge_text || DEFAULTS.header_badge_text,
            header_show_logo: (data as any).header_show_logo !== undefined
              ? (data as any).header_show_logo
              : DEFAULTS.header_show_logo,
            navigation: JSON.stringify(data.navigation?.header ?? data.navigation ?? [], null, 2),
            footer_resources: JSON.stringify(data.navigation?.footer?.resources ?? [
              { label: 'Insights', href: '/insights' },
              { label: 'Case Studies', href: '/case-studies' },
              { label: 'ROI Calculator', href: '/roi-calculator' },
              { label: 'Assessment', href: '/assessment' },
              { label: 'Cost of Inaction', href: '/cost-of-inaction' },
            ], null, 2),
            footer_company: JSON.stringify(data.navigation?.footer?.company ?? [
              { label: 'About Us', href: '/about-flowtaris-ai' },
              { label: 'Contact', href: '/contact' },
            ], null, 2),
            social_links: JSON.stringify(data.social_links ?? {}, null, 2),
            contact_email: data.contact_email || '',
            support_email: data.support_email || '',
            privacy_policy_url: data.privacy_policy_url || '',
            terms_of_service_url: data.terms_of_service_url || '',
            cookie_policy_url: data.cookie_policy_url || '',
            analytics: JSON.stringify(data.analytics ?? {}, null, 2),
            seo: JSON.stringify(data.seo ?? {}, null, 2),
            trust_signals: (data as any).trust_signals ?? DEFAULTS.trust_signals,
            newsletter_title: (data as any).newsletter_config?.title || DEFAULTS.newsletter_title,
            newsletter_description: (data as any).newsletter_config?.description || DEFAULTS.newsletter_description,
            newsletter_button_text: (data as any).newsletter_config?.buttonText || DEFAULTS.newsletter_button_text,
          }
          
          if ((data as any).trust_signals) {
            const ts = typeof (data as any).trust_signals === 'string' 
              ? JSON.parse((data as any).trust_signals) 
              : (data as any).trust_signals;
            newConfig.trust_signals = Array.isArray(ts) ? ts : DEFAULTS.trust_signals;
          }

          setConfig(newConfig)
        }
      } catch (err) {
        setError('Failed to load site configuration. Using defaults.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      let nav = [], f_res = [], f_comp = [], social = {}, analytics = {}, seo = {}
      try { nav = JSON.parse(config.navigation) } catch { throw new Error('Header Navigation JSON is invalid') }
      try { f_res = JSON.parse(config.footer_resources) } catch { throw new Error('Footer Resources JSON is invalid') }
      try { f_comp = JSON.parse(config.footer_company) } catch { throw new Error('Footer Company JSON is invalid') }
      try { social = JSON.parse(config.social_links) } catch { throw new Error('Social Links JSON is invalid') }
      try { analytics = JSON.parse(config.analytics) } catch { throw new Error('Analytics JSON is invalid') }
      try { seo = JSON.parse(config.seo) } catch { throw new Error('SEO JSON is invalid') }

      const fullNavigation = {
        header: nav,
        footer: { resources: f_res, company: f_comp }
      }

      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_name: config.site_name,
          site_url: config.site_url,
          tagline: config.tagline,
          logo_url: config.logo_url,
          favicon_url: config.favicon_url,
          header_brand_name: config.header_brand_name,
          header_badge_text: config.header_badge_text,
          header_show_logo: config.header_show_logo,
          navigation: fullNavigation,
          social_links: social,
          contact_email: config.contact_email,
          support_email: config.support_email,
          privacy_policy_url: config.privacy_policy_url,
          terms_of_service_url: config.terms_of_service_url,
          cookie_policy_url: config.cookie_policy_url,
          analytics: analytics,
          seo: seo,
          trust_signals: config.trust_signals,
          newsletter_config: {
            title: config.newsletter_title,
            description: config.newsletter_description,
            buttonText: config.newsletter_button_text,
          },
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save configuration')

      setSuccess('Site configuration saved successfully!')
      setTimeout(() => setSuccess(null), 4000)
    } catch (err: any) {
      setError(err.message || 'Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <span>Loading site configuration…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Site Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your brand identity, header appearance, and global settings.</p>
      </div>

      {/* Status messages */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl mb-6">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">

        {/* ── SECTION 1: LOGO & HEADER APPEARANCE ── */}
        <Section title="Logo & Header Appearance" icon={ImageIcon} accent="amber">
          <LogoManager
            logoUrl={config.logo_url}
            showLogo={config.header_show_logo}
            onLogoChange={v => update('logo_url', v)}
            onShowLogoChange={v => update('header_show_logo', v)}
          />

          <div className="border-t border-amber-200/50 dark:border-amber-700/30 my-5 pt-5 grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="header_brand_name">Brand name in header</Label>
              <input
                id="header_brand_name"
                type="text"
                value={config.header_brand_name}
                onChange={e => update('header_brand_name', e.target.value)}
                maxLength={30}
                placeholder="Flowtaris"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5 text-sm
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
              />
              <Hint>The main brand word shown next to the logo (e.g. "Flowtaris")</Hint>
            </div>
            <div>
              <Label htmlFor="header_badge_text">Platform badge text</Label>
              <input
                id="header_badge_text"
                type="text"
                value={config.header_badge_text}
                onChange={e => update('header_badge_text', e.target.value)}
                maxLength={10}
                placeholder=".ai"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5 text-sm
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
              />
              <Hint>Qualifier shown as a badge next to brand name (e.g. ".ai", "Beta", "Pro")</Hint>
            </div>
          </div>

          {/* Live header preview */}
          <HeaderPreview
            brandName={config.header_brand_name}
            badgeText={config.header_badge_text}
            showLogo={config.header_show_logo}
            logoUrl={config.logo_url}
          />
        </Section>

        {/* ── SECTION 2: BASIC INFO ── */}
        <Section title="Site Identity & SEO Basics" icon={Tag} accent="blue">
          <Input
            id="site_name"
            label="Site name"
            value={config.site_name}
            onChange={v => update('site_name', v)}
            placeholder="Flowtaris AI"
            hint="Used in meta titles, OG tags, and schema.org Organization name"
          />
          <Input
            id="site_url"
            label="Site URL"
            value={config.site_url}
            onChange={v => update('site_url', v)}
            placeholder="https://flowtaris.ai"
            type="url"
            hint="Canonical base URL — used for all absolute links and sitemaps"
          />
          <Input
            id="tagline"
            label="Tagline"
            value={config.tagline}
            onChange={v => update('tagline', v)}
            placeholder="Enterprise AI Automation for Finance"
            hint="Short value proposition — used in meta descriptions and hero text"
          />
          <FaviconUpload
            value={config.favicon_url}
            onChange={v => update('favicon_url', v)}
          />
        </Section>

        {/* ── SECTION 3: CONTACT ── */}
        <Section title="Contact & Legal" icon={Type} accent="purple">
          <div className="grid grid-cols-2 gap-4">
            <Input id="contact_email" label="Contact email" value={config.contact_email}
              onChange={v => update('contact_email', v)} placeholder="hello@flowtaris.ai" type="email" />
            <Input id="support_email" label="Support email" value={config.support_email}
              onChange={v => update('support_email', v)} placeholder="support@flowtaris.ai" type="email" />
          </div>
          <Input id="privacy_policy_url" label="Privacy policy URL" value={config.privacy_policy_url}
            onChange={v => update('privacy_policy_url', v)} placeholder="https://flowtaris.com/privacy" />
          <Input id="terms_url" label="Terms of service URL" value={config.terms_of_service_url}
            onChange={v => update('terms_of_service_url', v)} placeholder="https://flowtaris.com/terms" />
          <Input id="cookie_url" label="Cookie policy URL" value={config.cookie_policy_url}
            onChange={v => update('cookie_policy_url', v)} placeholder="https://flowtaris.com/cookies" />
        </Section>

        {/* ── SECTION 4: JSON CONFIGS ── */}
        <Section title="Navigation & Footer Config" icon={Tag} accent="purple">
          <Textarea id="navigation" label="Header Navigation (JSON)" value={config.navigation}
            onChange={v => update('navigation', v)} rows={4}
            hint="Array of nav link objects for the top header"
            placeholder='[{"label":"Capabilities","href":"/capabilities"}]' />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Textarea id="footer_resources" label="Footer: Resources Links (JSON)" value={config.footer_resources}
              onChange={v => update('footer_resources', v)} rows={8}
              hint="Links under the Resources column in the footer" />
            <Textarea id="footer_company" label="Footer: Company Links (JSON)" value={config.footer_company}
              onChange={v => update('footer_company', v)} rows={8}
              hint="Links under the Company column in the footer" />
          </div>
        </Section>

        {/* ── SECTION: NEWSLETTER CTA ── */}
        <Section title="Footer Newsletter CTA" icon={Tag} accent="amber">
          <Input id="newsletter_title" label="Newsletter Title"
            value={config.newsletter_title}
            onChange={v => update('newsletter_title', v)}
            placeholder="Stay ahead in Enterprise AI"
            hint="The headline of the newsletter CTA section in the footer" />
          <Textarea id="newsletter_description" label="Newsletter Description"
            value={config.newsletter_description}
            onChange={v => update('newsletter_description', v)} rows={3}
            hint="Supporting text below the newsletter title" />
          <Input id="newsletter_button_text" label="Subscribe Button Text"
            value={config.newsletter_button_text}
            onChange={v => update('newsletter_button_text', v)}
            placeholder="Subscribe"
            hint="Text for the newsletter subscribe button" />
        </Section>

        <Section title="Advanced Configuration (JSON)" icon={Tag} accent="blue">
          <Textarea id="social_links" label="Social links (JSON)" value={config.social_links}
            onChange={v => update('social_links', v)} rows={5}
            hint='Object with social media URLs: {"linkedin":"https://...","twitter":"https://..."}'
            placeholder='{"linkedin":"","twitter":""}' />
          <Textarea id="analytics" label="Analytics config (JSON)" value={config.analytics}
            onChange={v => update('analytics', v)} rows={4}
            hint="GA4 measurement ID, GTM container, etc."
            placeholder='{"ga4_id":"G-XXXXXXXXXX"}' />
          <Textarea id="seo" label="SEO overrides (JSON)" value={config.seo}
            onChange={v => update('seo', v)} rows={6}
            hint="Global SEO settings — default OG image, robots directives, etc."
            placeholder='{"og_image":"/images/og-default.jpg"}' />
        </Section>

        {/* ── SUBMIT ── */}
        <div className="sticky bottom-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4 mt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">Changes take effect on next page load after saving.</p>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl
              bg-gradient-to-r from-blue-600 to-blue-700
              hover:from-blue-500 hover:to-blue-600
              text-white text-sm font-bold shadow-lg shadow-blue-500/20
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
