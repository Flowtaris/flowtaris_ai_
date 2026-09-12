import { Metadata } from 'next'
import { HomeHero } from './HomeHero'
import TrustSignalsSection from '../components/TrustSignalsSection'
import DualVisionSection from '../components/DualVisionSection'
import IntelligenceSuiteSection from '../components/IntelligenceSuiteSection'
import CapabilitiesSection from '../components/CapabilitiesSection'
import CtaCostSection from '../components/CtaCostSection'
import Script from 'next/script'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flowtaris.ai'

// ── Homepage Metadata ──────────────────────────────────────────────────────────
// This overrides the layout.tsx default for the homepage specifically.
// Homepage targets broad + branded terms. Capability pages target long-tail.
export const metadata: Metadata = {
  title: 'Flowtaris AI | Enterprise AI Automation for Finance & ERP Teams',
  description:
    'Transform your finance operations with AI. Flowtaris AI automates accounts payable, invoice processing, ERP queries, and financial reporting for NetSuite, Coupa, SAP, and Workday — without replacing your existing systems.',
  alternates: { canonical: BASE_URL },
  keywords: [
    'enterprise AI finance automation',
    'AI accounts payable',
    'NetSuite automation',
    'Coupa AI',
    'SAP AI automation',
    'Workday AI',
    'invoice processing automation',
    'finance AI platform',
    'ERP AI integration',
    'autonomous finance workflows',
  ],
  openGraph: {
    title: 'Flowtaris AI | Enterprise AI Automation for Finance & ERP Teams',
    description:
      'AI that works inside your ERP. Automate AP, AR, reporting and compliance workflows without replacing NetSuite, Coupa, SAP, or Workday.',
    url: BASE_URL,
    siteName: 'Flowtaris AI',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'Flowtaris AI — Enterprise AI Automation Platform for Finance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flowtaris AI | Enterprise AI for Finance & ERP',
    description:
      'AI that works inside your ERP. Automate AP, AR, reporting and compliance without replacing NetSuite, Coupa, SAP, or Workday.',
    images: [`${BASE_URL}/images/og-default.jpg`],
  },
}

// ── Capability Item List — tells AI engines the full product surface ───────────
// This is an ItemList schema — one of the most effective AEO patterns.
// When ChatGPT / Gemini / Perplexity asks "what does Flowtaris AI do?",
// this schema directly feeds the answer.
const capabilityListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${BASE_URL}/#capability-list`,
  name: 'Flowtaris AI Capabilities',
  description: 'Enterprise AI automation capabilities for finance teams',
  numberOfItems: 6,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'GenAI Document Intelligence',
      description: 'AI-powered extraction, understanding, and processing of invoices, purchase orders, and financial documents — designed for enterprise accuracy across diverse document types and formats.',
      url: `${BASE_URL}/capabilities/genai-document-intelligence`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Autonomous Workflow Engine',
      description: 'Configurable AI agents that handle accounts payable and receivable workflows end-to-end, including approvals, exception routing, and ERP posting — without human intervention for straight-through transactions.',
      url: `${BASE_URL}/capabilities/autonomous-workflow-engine`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Predictive Analytics',
      description: 'AI-driven cash flow forecasting, financial anomaly detection, and spend analytics that surface risk and opportunity before they appear in your month-end report.',
      url: `${BASE_URL}/capabilities/predictive-analytics`,
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Conversational ERP Interface',
      description: 'Natural language interface for querying NetSuite, SAP, Coupa, and Workday — enabling finance teams to access ERP data and execute controlled actions via Slack or web without opening the ERP UI.',
      url: `${BASE_URL}/capabilities/conversational-erp`,
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Integration Health Monitoring',
      description: 'Real-time observability across ERP integrations — designed to detect failures and surface remediation signals before they create downstream financial impact.',
      url: `${BASE_URL}/capabilities/integration-health-monitoring`,
    },
    {
      '@type': 'ListItem',
      position: 6,
      name: 'AI Governance & Compliance',
      description: 'Immutable audit trails, model explainability, and structured control documentation designed to support enterprise governance, auditability, and access control requirements for AI in finance.',
      url: `${BASE_URL}/capabilities/ai-governance-compliance`,
    },
  ],
}

// ── WebPage schema for homepage ────────────────────────────────────────────────
const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/#webpage`,
  url: BASE_URL,
  name: 'Flowtaris AI — Enterprise AI Automation for Finance & ERP Teams',
  description:
    'Flowtaris AI automates finance operations using GenAI — processing invoices, managing AP/AR workflows, querying ERPs in natural language, and providing governance for AI-driven decisions.',
  isPartOf: { '@id': `${BASE_URL}/#website` },
  about: { '@id': `${BASE_URL}/#organization` },
  publisher: { '@id': `${BASE_URL}/#organization` },
  inLanguage: 'en-US',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Flowtaris AI',
        item: BASE_URL,
      },
    ],
  },
}

export default function Home() {
  return (
    <>
      {/* ── Structured Data: Homepage Capability List (AEO critical) ── */}
      <Script
        id="schema-capability-list"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(capabilityListSchema) }}
      />
      <Script
        id="schema-homepage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />

      <div className="flex flex-col flex-1 w-full">
        {/* ── Animated Hero ── */}
        <HomeHero />

        {/* ── Dynamic Trust Signals ── */}
        <TrustSignalsSection />

        {/* ── Dual Vision: Flowtaris × Flowtaris AI ── */}
        <DualVisionSection />

        {/* ── Intelligence Suite: 4 Real Interactive Tools ── */}
        <IntelligenceSuiteSection />

        {/* ── Capabilities: Proof Wall Accordion ── */}
        <CapabilitiesSection />

        {/* ── CTA: Cost of Inaction Counter ── */}
        <CtaCostSection />
      </div>
    </>
  )
}