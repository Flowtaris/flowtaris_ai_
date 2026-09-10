import { Metadata } from 'next'
import InsightsClient from './InsightsClient'
import { getInsights, getSiteConfig } from '@/lib/supabase'
import { INSIGHTS } from '@/lib/insights-data'

export const metadata: Metadata = {
  title: 'Insights & Research | Flowtaris AI',
  description: 'Original research, benchmarks, compliance guides, and technology deep-dives on AI automation in enterprise finance. Written for CFOs, finance controllers, and ERP architects.',
  openGraph: {
    title: 'Insights & Research | Flowtaris AI',
    description: 'World-class AI finance research: ROI benchmarks, EU AI Act compliance, hallucination-free architectures, and month-end close automation guides.',
    type: 'website',
  },
}

export const revalidate = 60

export default async function InsightsPage() {
  const dbInsights = await getInsights()
  const siteConfig = await getSiteConfig()
  const insightsHeroConfig = (siteConfig as any)?.insights_hero_config || null

  // Format DB insights
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

  // Merge: DB insights take priority; pad with static content library where DB is empty
  const dbSlugs = new Set(dbFormatted.map((i: any) => i.slug))
  const staticFallback = INSIGHTS.filter(i => !dbSlugs.has(i.slug))

  const allInsights = [...dbFormatted, ...staticFallback]

  // Derived unique categories
  const dynamicCategories = Array.from(new Set(allInsights.map((i: any) => i.category)))
  const categories = ['All', ...dynamicCategories]

  return <InsightsClient insights={allInsights} categories={categories} heroConfig={insightsHeroConfig} />
}