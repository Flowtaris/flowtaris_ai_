import { Metadata } from 'next'
import InsightsClient from './InsightsClient'
import Script from 'next/script'
import { getInsights, getSiteConfig } from '@/lib/supabase'
import { INSIGHTS } from '@/lib/insights-data'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flowtaris.ai'

export const metadata: Metadata = {
  title: 'Insights & Research | Enterprise AI Finance Automation | Flowtaris AI',
  description:
    'Original research, compliance guides, and technical deep-dives on AI automation in enterprise finance. Covering accounts payable AI, ERP integration, SOX compliance, EU AI Act, and cash flow forecasting — written for CFOs, finance controllers, and ERP architects.',
  alternates: { canonical: `${BASE_URL}/insights` },
  keywords: [
    'enterprise AI finance research',
    'accounts payable AI insights',
    'SOX AI compliance guide',
    'EU AI Act finance',
    'ERP AI integration guide',
    'cash flow forecasting AI',
    'NetSuite automation guide',
    'finance automation benchmarks',
  ],
  openGraph: {
    title: 'Insights & Research | Enterprise AI Finance Automation | Flowtaris AI',
    description:
      'Original research on AI automation in enterprise finance: accounts payable, ERP integration, SOX compliance, EU AI Act, and predictive analytics.',
    url: `${BASE_URL}/insights`,
    siteName: 'Flowtaris AI',
    type: 'website',
  },
}

export const revalidate = 60

// ── CollectionPage Schema ─────────────────────────────────────────────────────
function buildInsightsSchema(insights: any[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BASE_URL}/insights#webpage`,
    url: `${BASE_URL}/insights`,
    name: 'Flowtaris AI Insights & Research',
    description:
      'Original research, compliance guides, and technical deep-dives on AI automation in enterprise finance.',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: 'en-US',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Insights', item: `${BASE_URL}/insights` },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Flowtaris AI Insights',
      numberOfItems: insights.length,
      itemListElement: insights.slice(0, 10).map((insight: any, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE_URL}/insights/${insight.slug}`,
        name: insight.title,
      })),
    },
  }
}

export default async function InsightsPage() {
  const dbInsights = await getInsights()
  const siteConfig = await getSiteConfig()
  const insightsHeroConfig = (siteConfig as any)?.insights_hero_config || null

  const dbFormatted = dbInsights.map((i: any) => ({
    slug: i.slug,
    title: i.title,
    category: i.rich_text?.category || 'Research',
    author: i.author || 'Flowtaris AI',
    publishDate: i.published_at || i.created_at,
    readTime: i.rich_text?.readTime || '10 min',
    excerpt: i.excerpt || '',
    tags: i.topic_clusters || [],
    featured: i.rich_text?.featured || false,
    image: i.rich_text?.image || null,
  }))

  const dbSlugs = new Set(dbFormatted.map((i: any) => i.slug))
  const staticFallback = INSIGHTS.filter(i => !dbSlugs.has(i.slug))
  const allInsights = [...dbFormatted, ...staticFallback]

  const dynamicCategories = Array.from(new Set(allInsights.map((i: any) => i.category)))
  const categories = ['All', ...dynamicCategories]

  return (
    <>
      <Script
        id="schema-insights-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildInsightsSchema(allInsights)) }}
      />
      <InsightsClient
        insights={allInsights}
        categories={categories}
        heroConfig={insightsHeroConfig}
      />
    </>
  )
}