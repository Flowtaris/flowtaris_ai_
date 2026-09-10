import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── Server-side site config fetch ─────────────────────────────────────────────
// Fetches admin-controlled header config (logo, brand name, badge text).
// Falls back gracefully to defaults if DB is unreachable.
// Cache: next.js fetch cache with 60s revalidation.
async function fetchHeaderConfig() {
  try {
    // Use the internal API route for consistency + CDN caching
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://flowtaris.ai'
    const res = await fetch(`${baseUrl}/api/site-config`, {
      next: { revalidate: 60, tags: ['site-config'] }, // ISR: revalidate every 60 seconds or on-demand
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch {
    // Safe defaults — header always renders even if DB is down
    return {
      logoUrl:   '/images/flowtaris.avif',
      brandName: 'Flowtaris',
      badgeText: '.ai',
      showLogo:  true,
    }
  }
}

// ── Schema.org Organization structured data ───────────────────────────────────
// flowtaris.ai is the AI product arm of flowtaris.com.
// sameAs + parentOrganization signal brand unity to Google/AI engines
// so both domains share authority under one Flowtaris brand entity.
export async function generateMetadata(): Promise<Metadata> {
  const config = await fetchHeaderConfig();
  
  const title = `${config.siteName || 'Flowtaris AI'} | ${config.tagline || 'Enterprise AI Automation for Finance Teams'}`;
  const description = config.tagline || 'Flowtaris AI builds enterprise-grade AI automation for finance teams.';

  return {
    title: {
      default: title,
      template: `%s | ${config.siteName || 'Flowtaris AI'}`,
    },
    description,
    metadataBase: new URL('https://flowtaris.ai'),
    alternates: {
      canonical: 'https://flowtaris.ai',
    },
    openGraph: {
      title,
      description,
      url: 'https://flowtaris.ai',
      siteName: config.siteName || 'Flowtaris AI',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: 'https://flowtaris.ai/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://flowtaris.ai/images/og-default.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    authors: [{ name: 'Flowtaris', url: 'https://flowtaris.com' }],
    creator: 'Flowtaris',
    publisher: 'Flowtaris',
    category: 'technology',
  };
}

// ── Root Layout ───────────────────────────────────────────────────────────────
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch header config server-side (ISR cached, 60s revalidation)
  const headerConfig = await fetchHeaderConfig()

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: headerConfig.siteName || 'Flowtaris',
    alternateName: 'Flowtaris AI',
    url: 'https://flowtaris.ai',
    logo: {
      '@type': 'ImageObject',
      url: headerConfig.logoUrl ? `https://flowtaris.ai${headerConfig.logoUrl}` : 'https://flowtaris.ai/images/flowtaris_logo.png',
      width: 512,
      height: 512,
    },
    // Link back to parent — prevents Google from treating .ai as a separate brand
    parentOrganization: {
      '@type': 'Organization',
      name: 'Flowtaris',
      url: 'https://flowtaris.com',
    },
    sameAs: [
      'https://flowtaris.com',
      'https://www.linkedin.com/company/flowtaris',
      'https://twitter.com/flowtaris',
    ],
    knowsAbout: [
      'NetSuite ERP Automation',
      'Coupa Procurement AI',
      'SAP AI Integration',
      'Workday Finance Automation',
      'Enterprise AI for Finance',
      'Agentic ERP Workflows',
      'Predictive Finance Analytics',
      'AI Governance in Finance',
      'GenAI Document Intelligence',
      'Autonomous AP/AR Workflows',
    ],
    description: 'Flowtaris AI is the enterprise AI automation platform by Flowtaris, delivering GenAI Document Intelligence, Autonomous Workflows, Predictive Analytics, and Conversational ERP for NetSuite, Coupa, SAP, and Workday.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      availableLanguage: ['English'],
      areaServed: 'Worldwide',
    },
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Organization schema — signals brand unity between flowtaris.ai and flowtaris.com */}
        <Script
          id="schema-org-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Header receives server-fetched config — admin changes propagate within 60s */}
        <SiteHeader config={headerConfig} />
        {children}
        <SiteFooter config={headerConfig} />
      </body>
    </html>
  );
}