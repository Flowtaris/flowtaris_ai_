import { Metadata } from 'next'
import ContactForm from './ContactForm'
import Script from 'next/script'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flowtaris.ai'

export const metadata: Metadata = {
  title: 'Contact Flowtaris AI | Request a Demo or AI Assessment',
  description:
    'Get in touch with Flowtaris AI. Request a demo, schedule an AI readiness assessment, or ask about enterprise pricing for NetSuite, Coupa, SAP, or Workday AI automation.',
  alternates: { canonical: `${BASE_URL}/contact` },
  keywords: [
    'contact Flowtaris AI',
    'ERP AI demo request',
    'NetSuite AI demo',
    'enterprise AI assessment',
    'finance automation consultation',
  ],
  openGraph: {
    title: 'Contact Flowtaris AI | Request a Demo or AI Assessment',
    description:
      'Request a demo or AI readiness assessment. See how Flowtaris AI automates finance operations for NetSuite, Coupa, SAP, and Workday.',
    url: `${BASE_URL}/contact`,
    siteName: 'Flowtaris AI',
    type: 'website',
  },
}

// ── Contact Page Schema ────────────────────────────────────────────────────────
const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${BASE_URL}/contact#webpage`,
  url: `${BASE_URL}/contact`,
  name: 'Contact Flowtaris AI',
  description:
    'Contact page for Flowtaris AI — enterprise AI automation platform for finance teams.',
  isPartOf: { '@id': `${BASE_URL}/#website` },
  publisher: { '@id': `${BASE_URL}/#organization` },
  inLanguage: 'en-US',
  mainEntity: {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Flowtaris AI',
    url: BASE_URL,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      url: `${BASE_URL}/contact`,
      availableLanguage: 'English',
      areaServed: 'Worldwide',
    },
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: `${BASE_URL}/contact` },
    ],
  },
}

export default function ContactPage() {
  return (
    <>
      <Script
        id="schema-contact-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactForm />
    </>
  )
}