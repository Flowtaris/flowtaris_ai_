import { Metadata } from 'next'
import CaseStudiesClient from './CaseStudiesClient'

import { getCaseStudies, getSiteConfig } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Case Studies — Real Enterprise AI Results | Flowtaris AI',
  description: 'Three verified enterprise AI automation deployments. $21M+ in combined savings and risk reduction across NetSuite, SAP, Coupa, and Workday. Full technical details and before/after metrics.',
  alternates: { canonical: 'https://flowtaris.ai/case-studies' },
  openGraph: {
    title: 'Case Studies — Real Enterprise AI Results | Flowtaris AI',
    description: 'Three verified enterprise deployments. $21M+ savings across NetSuite, SAP, Coupa, and Workday.',
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