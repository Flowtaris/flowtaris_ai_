import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevents FOIT (Flash of Invisible Text) — Core Web Vital
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://flowtaris.ai'

// ── Server-side site config fetch ─────────────────────────────────────────────
async function fetchHeaderConfig() {
  try {
    const res = await fetch(`${BASE_URL}/api/site-config`, {
      next: { revalidate: 5, tags: ['site-config'] },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch {
    return {
      logoUrl:   '/images/flowtaris.avif',
      brandName: 'Flowtaris',
      badgeText: '.ai',
      showLogo:  true,
    }
  }
}

// ── Root Viewport ───────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// ── Root Metadata ──────────────────────────────────────────────────────────────
// NOTE: For Google Search Console verification, add your verification tag here:
// verification: { google: 'YOUR_GOOGLE_VERIFICATION_CODE' }
// For Bing Webmaster Tools, add:
// other: { 'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE' }
export async function generateMetadata(): Promise<Metadata> {
  const config = await fetchHeaderConfig();
  
  const siteName = config.siteName || 'Flowtaris AI'
  const title = `${siteName} | Enterprise AI Automation for Finance & ERP Teams`
  const description = config.tagline ||
    'Flowtaris AI is the enterprise AI automation platform for finance teams — delivering GenAI document intelligence, autonomous AP/AR workflows, predictive analytics, and conversational ERP access for NetSuite, Coupa, SAP, and Workday.'

  return {
    // ── Titles ───────────────────────────────────────────────────────────────
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    applicationName: siteName,
    
    // ── Canonical & Base ──────────────────────────────────────────────────────
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: BASE_URL },

    // ── Keywords (still used by Bing and AI engines) ──────────────────────────
    keywords: [
      'enterprise AI finance automation',
      'AI accounts payable automation',
      'NetSuite AI automation',
      'Coupa AI integration',
      'SAP AI automation',
      'Workday AI automation',
      'GenAI document intelligence',
      'autonomous AP AR workflows',
      'ERP AI assistant',
      'finance AI platform',
      'invoice processing AI',
      'AI governance finance',
      'predictive cash flow analytics',
      'conversational ERP',
      'integration health monitoring',
      'Flowtaris AI',
    ],

    // ── Authors & Publisher ───────────────────────────────────────────────────
    authors: [{ name: 'Flowtaris', url: 'https://flowtaris.com' }],
    creator: 'Flowtaris',
    publisher: 'Flowtaris',
    category: 'Enterprise Software, AI Automation, Finance Technology',

    // ── Open Graph (Social Sharing) ───────────────────────────────────────────
    openGraph: {
      title,
      description,
      url: BASE_URL,
      siteName,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: `${BASE_URL}/images/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: 'Flowtaris AI — Enterprise AI Automation for Finance Teams',
          type: 'image/jpeg',
        },
      ],
    },

    // ── Twitter / X Card ──────────────────────────────────────────────────────
    twitter: {
      card: 'summary_large_image',
      site: '@flowtaris',
      creator: '@flowtaris',
      title,
      description,
      images: [`${BASE_URL}/images/og-default.jpg`],
    },

    // ── Robots ────────────────────────────────────────────────────────────────
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },

    // ── Verification Placeholders ─────────────────────────────────────────────
    // TODO: Add your Google Search Console verification tag when ready:
    // verification: { google: 'PASTE_YOUR_CODE_HERE', yandex: '', yahoo: '' },
    
    // ── Other Meta ────────────────────────────────────────────────────────────
    other: {
      // Prevent iOS from formatting phone numbers as links
      'format-detection': 'telephone=no, date=no, email=no, address=no',
      // Tell AI engines this is a product/software site
      'og:type': 'website',
      // Bing Webmaster verification placeholder
      // 'msvalidate.01': 'PASTE_YOUR_BING_CODE_HERE',
    },
  };
}

// ── Root Layout ────────────────────────────────────────────────────────────────
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerConfig = await fetchHeaderConfig()

  // ── Schema 1: Organization — Brand Entity Definition ─────────────────────
  // This is the most critical schema for GEO/AEO.
  // AI engines (ChatGPT, Perplexity, Gemini) use this to build their knowledge
  // graph entry for Flowtaris AI. Every field matters.
  // CRITICAL: parentOrganization + sameAs links flowtaris.ai authority back to
  // flowtaris.com — Google sees them as ONE brand entity, not competitors.
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Flowtaris AI',
    alternateName: ['Flowtaris', 'Flowtaris AI Platform'],
    legalName: 'Flowtaris',
    description: 'Flowtaris AI is the enterprise AI automation platform for finance teams, delivering GenAI document intelligence, autonomous accounts payable and receivable workflows, predictive cash flow analytics, conversational ERP access, integration health monitoring, and AI governance capabilities for NetSuite, Coupa, SAP S/4HANA, and Workday deployments.',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#logo`,
      url: `${BASE_URL}/images/flowtaris.avif`,
      contentUrl: `${BASE_URL}/images/flowtaris.avif`,
      width: 512,
      height: 512,
      caption: 'Flowtaris AI Logo',
    },
    image: `${BASE_URL}/images/og-default.jpg`,
    // ── flowtaris.com Authority Link ────────────────────────────────────────
    // parentOrganization tells Google/AI engines flowtaris.ai IS Flowtaris.
    // This prevents .ai from being treated as a separate, competing brand.
    parentOrganization: {
      '@type': 'Organization',
      '@id': 'https://flowtaris.com/#organization',
      name: 'Flowtaris',
      url: 'https://flowtaris.com',
    },
    // sameAs signals brand unity across all web presences
    sameAs: [
      'https://flowtaris.com',
      'https://www.linkedin.com/company/flowtaris',
      'https://twitter.com/flowtaris',
      'https://github.com/flowtaris',
    ],
    // ── What Flowtaris AI knows about / specialises in ───────────────────────
    knowsAbout: [
      'Enterprise Resource Planning Automation',
      'Accounts Payable Automation',
      'Accounts Receivable Automation',
      'GenAI Document Intelligence',
      'Autonomous Financial Workflows',
      'NetSuite ERP AI Integration',
      'Coupa Procurement AI Automation',
      'SAP S/4HANA AI Integration',
      'Workday Finance AI Automation',
      'Predictive Cash Flow Analytics',
      'Financial Anomaly Detection',
      'AI Governance in Finance',
      'SOX Compliance Automation',
      'EU AI Act Compliance for Finance',
      'Conversational ERP Interface',
      'Enterprise Integration Health Monitoring',
      'iPaaS Monitoring and Observability',
      'Financial Data Extraction',
      'Intelligent Process Automation',
      'Enterprise AI Platform',
    ],
    // ── Service Offerings ─────────────────────────────────────────────────────
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Flowtaris AI Capabilities',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GenAI Document Intelligence', url: `${BASE_URL}/capabilities/genai-document-intelligence` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Autonomous Workflow Engine', url: `${BASE_URL}/capabilities/autonomous-workflow-engine` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Predictive Analytics', url: `${BASE_URL}/capabilities/predictive-analytics` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Conversational ERP', url: `${BASE_URL}/capabilities/conversational-erp` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Integration Health Monitoring', url: `${BASE_URL}/capabilities/integration-health-monitoring` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Governance & Compliance', url: `${BASE_URL}/capabilities/ai-governance-compliance` } },
      ],
    },
    // ── Contact ───────────────────────────────────────────────────────────────
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        url: `${BASE_URL}/contact`,
        availableLanguage: ['English'],
        areaServed: 'Worldwide',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: `${BASE_URL}/contact`,
        availableLanguage: ['English'],
      },
    ],
    // ── Geography ─────────────────────────────────────────────────────────────
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'European Union' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Singapore' },
    ],
  }

  // ── Schema 2: WebSite — Enables Google Sitelinks Search Box ──────────────
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Flowtaris AI',
    description: 'Enterprise AI automation platform for finance teams',
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: 'en-US',
    // SearchAction enables the Google Sitelinks searchbox in search results
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/insights?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // ── Schema 3: SoftwareApplication — For app discovery in AI engines ───────
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${BASE_URL}/#software`,
    name: 'Flowtaris AI Platform',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Enterprise Resource Planning, Artificial Intelligence, Finance Automation',
    operatingSystem: 'Web, Cloud',
    description: 'Enterprise AI automation platform for finance teams. Automates accounts payable, accounts receivable, financial reporting, ERP queries, and compliance workflows using GenAI and autonomous agents.',
    url: BASE_URL,
    screenshot: `${BASE_URL}/images/og-default.jpg`,
    featureList: [
      'GenAI Document Intelligence',
      'Autonomous AP/AR Workflow Engine',
      'Predictive Cash Flow Analytics',
      'Conversational ERP Interface',
      'Integration Health Monitoring',
      'AI Governance & Compliance',
    ],
    publisher: { '@id': `${BASE_URL}/#organization` },
    author: { '@id': `${BASE_URL}/#organization` },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Contact for enterprise pricing',
      url: `${BASE_URL}/contact`,
    },
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* ── Structured Data: Organization ── */}
        <Script
          id="schema-org-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* ── Structured Data: WebSite (enables Sitelinks search box) ── */}
        <Script
          id="schema-org-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        {/* ── Structured Data: SoftwareApplication ── */}
        <Script
          id="schema-org-software"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        {/* ── Web App Manifest ── */}
        <link rel="manifest" href="/manifest.json" />
        {/* ── Theme Color (browser UI accent) ── */}
        <meta name="theme-color" content="#050508" />
        {/* ── Apple Touch Icon ── */}
        <link rel="apple-touch-icon" href="/images/flowtaris.avif" />
        {/* ── Preconnect to key origins for performance ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteHeader config={headerConfig} />
        {children}
        <SiteFooter config={headerConfig} />
      </body>
    </html>
  );
}
