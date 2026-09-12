import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flowtaris.ai'

type ChangeFreq = 'weekly' | 'monthly' | 'always' | 'hourly' | 'daily' | 'yearly' | 'never'

// ─── Capability slugs ──────────────────────────────────────────────────────────
const CAPABILITY_SLUGS = [
  'genai-document-intelligence',
  'autonomous-workflow-engine',
  'predictive-analytics',
  'conversational-erp',
  'integration-health-monitoring',
  'ai-governance-compliance',
]

// ─── Platform slugs ───────────────────────────────────────────────────────────
const PLATFORM_SLUGS = [
  'netsuite',
  'coupa',
  'sap',
  'workday',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Core Pages ─────────────────────────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 1.0,
    },
    // High-intent conversion pages — second priority
    {
      url: `${BASE_URL}/assessment`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/roi-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.9,
    },
    // Capability hub — high organic value
    {
      url: `${BASE_URL}/capabilities`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.9,
    },
    // Content pages
    {
      url: `${BASE_URL}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/insights`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/platforms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cost-of-inaction`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/innovation-lab`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/about-flowtaris-ai`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.7,
    },
    // Legal pages
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFreq,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFreq,
      priority: 0.3,
    },
  ]

  // ── Capability Detail Pages — High organic SEO value ───────────────────────
  // Each capability targets a specific long-tail keyword cluster
  const capabilityPages: MetadataRoute.Sitemap = CAPABILITY_SLUGS.map(slug => ({
    url: `${BASE_URL}/capabilities/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as ChangeFreq,
    priority: 0.95, // Capability pages are primary organic targets
  }))

  // ── Platform Pages — ERP-specific landing pages ────────────────────────────
  const platformPages: MetadataRoute.Sitemap = PLATFORM_SLUGS.map(slug => ({
    url: `${BASE_URL}/platforms/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as ChangeFreq,
    priority: 0.85,
  }))

  return [...corePages, ...capabilityPages, ...platformPages]
}