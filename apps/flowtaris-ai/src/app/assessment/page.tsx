import { Metadata } from 'next'
import AssessmentWizardClient from './AssessmentWizardClient'
import Script from 'next/script'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flowtaris.ai'

export const metadata: Metadata = {
  title: 'AI Readiness Assessment | Enterprise Finance AI | Flowtaris',
  description: 'Free 3-minute diagnostic for enterprise finance teams. Get a personalized AI automation roadmap with Quick Wins (0-3mo), Strategic initiatives (3-9mo), and Innovation opportunities (9-18mo).',
  alternates: { canonical: `${BASE_URL}/assessment` },
  keywords: [
    'AI readiness assessment finance',
    'enterprise AI diagnostic',
    'finance automation roadmap',
    'ERP AI readiness',
    'accounts payable AI assessment',
  ],
  openGraph: {
    title: 'AI Readiness Assessment | Enterprise Finance AI | Flowtaris',
    description: 'Free 3-minute diagnostic for enterprise finance teams. Get a personalized AI automation roadmap with projected ROI.',
    type: 'website',
    url: `${BASE_URL}/assessment`,
  },
}

// ── SoftwareApplication Schema ─────────────────────────────────────────────────
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${BASE_URL}/assessment#software`,
  "name": "Flowtaris AI Readiness Assessment",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "description": "An interactive diagnostic tool that evaluates enterprise finance and ERP workflows to generate a personalized AI automation roadmap, complete with projected savings and implementation timelines.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "publisher": { "@id": `${BASE_URL}/#organization` }
}

import { getAssessmentConfig } from '@flowtaris/supabase-client'

export default async function AssessmentPage() {
  let config = null;
  try {
    config = await getAssessmentConfig();
  } catch (e) {
    console.error("Failed to load Assessment config:", e);
  }
  return (
    <>
      <Script
        id="schema-assessment-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <AssessmentWizardClient initialConfig={config} />
    </>
  )
}