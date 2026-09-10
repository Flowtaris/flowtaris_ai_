import { Metadata } from 'next'
import CostOfInactionClient from './CostOfInactionClient'

export const metadata: Metadata = {
  title: 'Cost of Inaction Calculator | Flowtaris AI',
  description: 'Calculate the cost of waiting. Monthly revenue leakage, annual compliance risk, 3-year competitive gap, and cost of 6-month delay.',
  openGraph: {
    title: 'Cost of Inaction Calculator | Flowtaris AI',
    description: 'Calculate the cost of waiting. Monthly revenue leakage, annual compliance risk, 3-year competitive gap.',
    type: 'website',
  },
}

import { getSiteConfig } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export default async function CostOfInactionPage() {
  let coiConfig = null;
  try {
    const siteConfig = await getSiteConfig();
    coiConfig = siteConfig?.coi_calculator_config ?? siteConfig?.seo?.coi_calculator_config ?? null;
  } catch (e) {
    console.error("Failed to load COI config:", e);
  }

  if (coiConfig?.shutdown) {
    notFound();
  }

  return <CostOfInactionClient initialConfig={coiConfig} />
}