import { Metadata } from 'next'
import ROICalculatorClient from './ROICalculatorClient'
import Script from 'next/script'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Enterprise AI Automation ROI Calculator | Flowtaris',
  description: 'Calculate your true AI automation ROI for Finance ERPs (NetSuite, SAP, Workday). Real-time projections for annual savings, compliance risk reduction, and FTE freed.',
  keywords: ['AI ROI calculator', 'Finance automation ROI', 'ERP AI ROI', 'NetSuite automation savings', 'SAP automation ROI', 'Cost of employee attrition'],
  openGraph: {
    title: 'Enterprise AI Automation ROI Calculator | Flowtaris',
    description: 'Calculate the exact ROI, payback period, and compliance savings of automating your financial processes with AI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise AI Automation ROI Calculator | Flowtaris',
    description: 'Calculate the exact ROI of automating your financial processes with AI.',
  }
}

import { getSiteConfig } from '@/lib/supabase'

export default async function ROICalculatorPage() {
  let roiConfig = null;
  try {
    const siteConfig = await getSiteConfig();
    roiConfig = siteConfig?.roi_calculator_config ?? siteConfig?.seo?.roi_calculator_config ?? null;
  } catch (e) {
    console.error("Failed to load ROI config:", e);
  }

  if (roiConfig?.shutdown) {
    notFound();
  }

  // SoftwareApplication Schema for the Calculator
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Flowtaris AI ROI Calculator",
    "operatingSystem": "Web Browser",
    "applicationCategory": "BusinessApplication",
    "description": "An interactive calculator to project ROI, payback period, and cost savings from implementing Enterprise AI automation in finance and ERP workflows.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }

  // FAQPage Schema for AEO/SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How is AI ROI calculated for finance teams?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI ROI for finance teams is calculated by projecting the reduction in manual processing hours, the decrease in error-related costs (such as compliance fines), and the savings from reduced employee attrition, divided by the total implementation cost of the AI platform."
        }
      },
      {
        "@type": "Question",
        "name": "What is the average payback period for ERP AI automation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The average payback period for implementing AI automation in ERPs like NetSuite, SAP, or Workday typically ranges between 3 to 8 months, depending on invoice volume and existing manual overhead."
        }
      },
      {
        "@type": "Question",
        "name": "Does this calculator include compliance and attrition costs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Unlike generic calculators, the Flowtaris AI ROI Calculator factors in advanced domain pain points including the compounding costs of manual errors, annual compliance fines, and employee attrition driven by manual burnout."
        }
      }
    ]
  }

  return (
    <>
      <Script id="software-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <h1 className="sr-only">Enterprise AI Automation ROI Calculator</h1>
      <ROICalculatorClient initialConfig={roiConfig} />

      {/* AEO / Semantic HTML Section for Web Crawlers */}
      <section className="sr-only">
        <h2>Frequently Asked Questions about Enterprise AI Automation ROI</h2>
        <article>
          <h3>How is AI ROI calculated for finance teams?</h3>
          <p>AI ROI for finance teams is calculated by projecting the reduction in manual processing hours, the decrease in error-related costs (such as compliance fines), and the savings from reduced employee attrition, divided by the total implementation cost of the AI platform.</p>
        </article>
        <article>
          <h3>What is the average payback period for ERP AI automation?</h3>
          <p>The average payback period for implementing AI automation in ERPs like NetSuite, SAP, or Workday typically ranges between 3 to 8 months, depending on invoice volume and existing manual overhead.</p>
        </article>
        <article>
          <h3>Does this calculator include compliance and attrition costs?</h3>
          <p>Yes. Unlike generic calculators, the Flowtaris AI ROI Calculator factors in advanced domain pain points including the compounding costs of manual errors, annual compliance fines, and employee attrition driven by manual burnout.</p>
        </article>
      </section>
    </>
  )
}