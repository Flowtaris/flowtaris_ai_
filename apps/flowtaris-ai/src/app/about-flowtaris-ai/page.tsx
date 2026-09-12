import AboutClient from './AboutClient'
import Script from 'next/script'
import { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flowtaris.ai'

export const metadata: Metadata = {
  title: 'About Flowtaris AI | Enterprise AI & ERP Automation Platform',
  description:
    'Flowtaris AI is built by practitioners with deep enterprise ERP implementation experience. We combine that domain expertise with AI to automate finance operations for NetSuite, Coupa, SAP, and Workday customers.',
  alternates: { canonical: `${BASE_URL}/about-flowtaris-ai` },
  keywords: [
    'Flowtaris AI about',
    'enterprise AI finance company',
    'ERP AI automation team',
    'NetSuite AI company',
    'finance automation startup',
  ],
  openGraph: {
    title: 'About Flowtaris AI | Enterprise AI & ERP Automation Platform',
    description:
      'Flowtaris AI is built by practitioners with deep enterprise ERP implementation experience. We combine domain expertise with AI to automate finance operations.',
    url: `${BASE_URL}/about-flowtaris-ai`,
    siteName: 'Flowtaris AI',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-about-flowtaris-ai.png`,
        width: 1200,
        height: 630,
        alt: 'Flowtaris AI — Enterprise AI and ERP Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Flowtaris AI | Enterprise AI & ERP Automation',
    description:
      'Built by ERP practitioners. Powered by GenAI. Flowtaris AI automates finance operations for enterprise teams.',
    images: [`${BASE_URL}/images/og-about-flowtaris-ai.png`],
  },
}

// ── About Page Schemas ─────────────────────────────────────────────────────────
const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${BASE_URL}/about-flowtaris-ai#webpage`,
  url: `${BASE_URL}/about-flowtaris-ai`,
  name: 'About Flowtaris AI',
  description:
    'Flowtaris AI is the enterprise AI automation platform from Flowtaris, built by ERP practitioners to automate finance operations using GenAI.',
  isPartOf: { '@id': `${BASE_URL}/#website` },
  about: { '@id': `${BASE_URL}/#organization` },
  publisher: { '@id': `${BASE_URL}/#organization` },
  inLanguage: 'en-US',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'About Flowtaris AI', item: `${BASE_URL}/about-flowtaris-ai` },
    ],
  },
}

export default function AboutFlowtarisAIPage() {
  return (
    <>
      <Script
        id="schema-about-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <div>
        <main className="min-h-[calc(100vh-4rem)] bg-[#0B0F19] text-white">
          <AboutClient />
        </main>
      </div>
    </>
  )
}