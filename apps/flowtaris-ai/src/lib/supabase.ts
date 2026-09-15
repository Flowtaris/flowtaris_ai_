import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Environment variables for admin panel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Mock client for build time when env vars are not available
function createMockClient(): SupabaseClient {
  return {
    from: () => {
      const chain: any = {
        select: () => chain,
        insert: () => chain,
        update: () => chain,
        delete: () => chain,
        eq: () => chain,
        order: () => chain,
        single: async () => ({ data: null, error: null }),
        then: (resolve: any) => resolve({ data: [], error: null })
      }
      return chain
    },
  } as unknown as SupabaseClient
}

// Client for public operations (read-only for now)
export const supabase: SupabaseClient = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, { global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) } })
  : createMockClient()

// Server-side client with service role (for admin operations)
export function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) return createMockClient()
  return createClient(supabaseUrl, supabaseServiceRoleKey, { global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Type definitions for our content tables
export interface SiteConfig {
  id: string
  site_name: string
  site_url: string | null
  tagline: string | null
  logo_url: string | null
  favicon_url: string | null
  navigation: any // JSONB
  social_links: any // JSONB
  contact_email: string | null
  support_email: string | null
  privacy_policy_url: string | null
  terms_of_service_url: string | null
  cookie_policy_url: string | null
  analytics: any // JSONB
  seo: any // JSONB
  created_at: string
  updated_at: string
}

export interface PlatformPage {
  id: string
  slug: string
  name: string
  tagline: string | null
  category: string | null
  maturity: string | null
  logo_emoji: string | null
  short_description: string | null
  description: string | null
  capabilities: any // JSONB
  integrations: any // JSONB
  certifications: any // JSONB
  case_study_ids: string[] // UUID array
  demo_url: string | null
  docs_url: string | null
  metrics: any // JSONB
  faq: any // JSONB
  architecture: any // JSONB
  seo: any // JSONB
  created_at: string
  updated_at: string
}

export interface AICapability {
  id: string
  slug: string
  name: string
  category: string | null
  maturity: string | null
  short_description: string | null
  description: string | null
  icon: string | null
  key_metrics: any // JSONB
  features: any // JSONB
  use_cases: any // JSONB
  supported_platform_ids: string[] // UUID array
  timeline: string | null
  prerequisites: any // JSONB
  demo_url: string | null
  docs_url: string | null
  related_capability_ids: string[] // UUID array
  case_study_ids: string[] // UUID array
  seo: any // JSONB
  created_at: string
  updated_at: string
}

export interface CaseStudy {
  id: string
  slug: string
  title: string
  client: string
  industry: string | null
  platforms: any // JSONB
  challenge: string | null
  solution: string | null
  results: any // JSONB
  timeline: string | null
  testimonial: string | null
  hero_image_url: string | null
  seo: any // JSONB
  geo_signals: any // JSONB
  related_capability_ids: string[] // UUID array
  created_at: string
  updated_at: string
}

export interface AssessmentConfig {
  id: string
  questions: any // JSONB
  recommendation_rules: any // JSONB
  capability_mapping: any // JSONB
  created_at: string
  updated_at: string
}

export interface Insight {
  id: string
  slug: string
  title: string
  author: string | null
  excerpt: string | null
  rich_text: any // JSONB (Portable text)
  topic_clusters: any // JSONB
  faq_items: any // JSONB
  citations: any // JSONB
  related_capability_ids: string[] // UUID array
  published_at: string | null
  seo: any // JSONB
  geo_signals: any // JSONB
  created_at: string
  updated_at: string
}


export interface ROICConfig {
  id: string
  assumptions: any // JSONB
  formulas: any // JSONB
  benchmarks: any // JSONB
  platform_multipliers: any // JSONB
  created_at: string
  updated_at: string
}

// Helper functions for CRUD operations
export async function getSiteConfig() {
  const client = createAdminClient()
  const { data, error } = await client.from('site_config').select('*').single()
  if (error) throw error
  return data
}

export async function updateSiteConfig(data: Partial<SiteConfig>) {
  const { data: updatedData, error } = await supabase
    .from('site_config')
    .update(data)
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .select()
    .single()
  if (error) throw error
  return updatedData
}

// Platform pages
export async function getPlatformPages() {
  const client = createAdminClient()
  const { data, error } = await client.from('platform_pages').select('*').order('name')
  if (error) throw error
  return data
}

export async function getPlatformPageById(id: string) {
  const client = createAdminClient()
  const { data, error } = await client.from('platform_pages').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createPlatformPage(data: Omit<PlatformPage, 'id' | 'created_at' | 'updated_at'>) {
  const client = createAdminClient()
  const { data: newData, error } = await client
    .from('platform_pages')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return newData
}

export async function updatePlatformPage(id: string, data: Partial<PlatformPage>) {
  const client = createAdminClient()
  const { data: updatedData, error } = await client
    .from('platform_pages')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return updatedData
}

export async function deletePlatformPage(id: string) {
  const client = createAdminClient()
  const { error } = await client.from('platform_pages').delete().eq('id', id)
  if (error) throw error
}

// AI capabilities
export async function getAICapabilities() {
  const client = createAdminClient()
  const { data, error } = await client.from('ai_capabilities').select('*').order('name')
  if (error) throw error
  return data
}

export async function getAICapabilityById(id: string) {
  const client = createAdminClient()
  const { data, error } = await client.from('ai_capabilities').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createAICapability(data: Omit<AICapability, 'id' | 'created_at' | 'updated_at'>) {
  const client = createAdminClient()
  const { data: newData, error } = await client
    .from('ai_capabilities')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return newData
}

export async function updateAICapability(id: string, data: Partial<AICapability>) {
  const client = createAdminClient()
  const { data: updatedData, error } = await client
    .from('ai_capabilities')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return updatedData
}

export async function deleteAICapability(id: string) {
  const client = createAdminClient()
  const { error } = await client.from('ai_capabilities').delete().eq('id', id)
  if (error) throw error
}

// Case studies
export async function getCaseStudies() {
  const client = createAdminClient()
  const { data, error } = await client.from('case_studies').select('*').order('title')
  if (error) throw error
  return data
}

export async function getCaseStudyById(id: string) {
  const client = createAdminClient()
  const { data, error } = await client.from('case_studies').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function getCaseStudyBySlug(slug: string) {
  const client = createAdminClient()
  const { data, error } = await client
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
}

export async function createCaseStudy(data: Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>) {
  const client = createAdminClient()
  const { data: newData, error } = await client
    .from('case_studies')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return newData
}

export async function updateCaseStudy(id: string, data: Partial<CaseStudy>) {
  const client = createAdminClient()
  const { data: updatedData, error } = await client
    .from('case_studies')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return updatedData
}

export async function deleteCaseStudy(id: string) {
  const client = createAdminClient()
  const { error } = await client.from('case_studies').delete().eq('id', id)
  if (error) throw error
}

// Insights
export async function getInsights() {
  const client = createAdminClient()
  const { data, error } = await client
    .from('insights')
    .select('*')
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('published_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getInsightById(id: string) {
  const client = createAdminClient()
  const { data, error } = await client.from('insights').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createInsight(data: Omit<Insight, 'id' | 'created_at' | 'updated_at'>) {
  const client = createAdminClient()
  const { data: newData, error } = await client
    .from('insights')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return newData
}

export async function updateInsight(id: string, data: Partial<Insight>) {
  const client = createAdminClient()
  const { data: updatedData, error } = await client
    .from('insights')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return updatedData
}

export async function deleteInsight(id: string) {
  const client = createAdminClient()
  const { error } = await client.from('insights').delete().eq('id', id)
  if (error) throw error
}

// Assessment config
export async function getAssessmentConfig() {
  const client = createAdminClient()
  const { data, error } = await client.from('assessment_config').select('*').single()
  if (error) throw error
  return data
}

export async function updateAssessmentConfig(data: Partial<AssessmentConfig>) {
  const client = createAdminClient()
  const { data: updatedData, error } = await client
    .from('assessment_config')
    .update(data)
    .eq('id', '00000000-0000-0000-0000-000000000002')
    .select()
    .single()
  if (error) throw error
  return updatedData
}

export async function createAssessmentConfig(data: Omit<AssessmentConfig, 'id' | 'created_at' | 'updated_at'>) {
  const client = createAdminClient()
  const { data: newData, error } = await client
    .from('assessment_config')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return newData
}

export const getAssessmentConfigs = async () => {
  const client = createAdminClient()
  const { data, error } = await client.from('assessment_config').select('*')
  if (error) throw error
  return data
}

export const getRoiConfigs = async () => {
  const client = createAdminClient()
  const { data, error } = await client.from('roi_config').select('*')
  if (error) throw error
  return data
}

export async function createRoiConfig(data: Omit<ROICConfig, 'id' | 'created_at' | 'updated_at'>) {
  const client = createAdminClient()
  const { data: newData, error } = await client
    .from('roi_config')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return newData
}

// ROI config
export async function getROICConfig() {
  const client = createAdminClient()
  const { data, error } = await client.from('roi_config').select('*').single()
  if (error) throw error
  return data
}

export async function updateROICConfig(data: Partial<ROICConfig>) {
  const client = createAdminClient()
  const { data: updatedData, error } = await client
    .from('roi_config')
    .update(data)
    .eq('id', '00000000-0000-0000-0000-000000000003')
    .select()
    .single()
  if (error) throw error
  return updatedData
}
