import { Metadata } from 'next'
import CaseStudiesClient from './CaseStudiesClient'

import { getCaseStudies, getSiteConfig } from '@/lib/supabase'

// P1 #5 & #6 — Removed 'verified' and '$21M+' claims from metadata. Using evidence-safe language.
export const metadata: Metadata = {
  title: 'Use Cases | Flowtaris AI',
  description: 'Illustrative enterprise AI automation use cases showing how Flowtaris AI capabilities can address common finance, ERP and integration challenges across NetSuite, SAP, Coupa, and Workday.',
  alternates: { canonical: 'https://flowtaris.ai/case-studies' },
  openGraph: {
    title: 'Illustrative Use Cases | Flowtaris AI',
    description: 'See how Flowtaris AI capabilities can address common enterprise finance, ERP and integration challenges.',
    url: 'https://flowtaris.ai/case-studies',
    siteName: 'Flowtaris AI',
    type: 'website',
  },
}

export const revalidate = 60 // Revalidate every minute

export default async function CaseStudiesPage() {
  const [caseStudies, siteConfig] = await Promise.all([
    getCaseStudies(),
    getSiteConfig()
  ])

  // Filter only published case studies
  const publishedCaseStudies = caseStudies.filter(cs => cs.is_published)

  return <CaseStudiesClient caseStudies={publishedCaseStudies} heroConfig={siteConfig?.case_studies_hero_config} />
}