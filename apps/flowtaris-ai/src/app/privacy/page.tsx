import type { Metadata } from 'next'
import { Container, Card, CardContent } from '@repo/ui'
import { Shield } from 'lucide-react'
import { getSiteConfig } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Privacy Policy | Flowtaris AI',
  description: 'Flowtaris AI Privacy Policy - how we collect, use and protect your personal information.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic';

export default async function PrivacyPolicyPage() {
  let siteConfig = null
  let renderError = null

  try {
    try {
      siteConfig = await getSiteConfig()
    } catch (err: any) {
      console.error("Failed to fetch site config:", err)
      renderError = err.message
    }
    
    const privacyConfig = siteConfig ? (siteConfig as any).privacy_config : null

    // Fallback to static text if not configured
    const title = privacyConfig?.title || 'Privacy Policy'
    const badgeText = privacyConfig?.badgeText || 'Legal & Compliance'
    const rawSections = privacyConfig?.sections || []
    const effectiveDate = privacyConfig?.effectiveDate

    // Pre-render HTML on the server before passing to Client Component
    const { marked } = await import('marked')
    
    const sections = await Promise.all(
      rawSections.map(async (section: any) => ({
        ...section,
        html: await marked(section.content || '', { gfm: true, breaks: true })
      }))
    )

    return (
      <div className="flex flex-col flex-1 w-full pt-32 pb-24">
        <Container size="lg">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] mb-6">
              <Shield className="h-4 w-4 text-brand-cyan-400" />
              <span className="text-[10px] font-bold tracking-[0.16em] text-white/50 uppercase">{badgeText}</span>
            </div>
            <h1 className="text-display-lg text-white mb-6">{title}</h1>
            {effectiveDate && (
              <p className="text-headline-sm text-neutral-400">
                Effective Date: {effectiveDate}
              </p>
            )}
            {renderError && (
              <div className="bg-red-500/20 text-red-500 p-4 rounded-md mb-6 font-mono text-sm">
                Error Fetching DB: {renderError}
              </div>
            )}
          </div>

          <Card className="glass-card">
            <CardContent className="p-8 md:p-12 prose prose-invert max-w-none prose-p:text-neutral-300 prose-headings:text-white prose-a:text-[#E8A020]">
              {sections.length > 0 ? (
                sections.map((section: any, index: number) => (
                  <div key={index} className="mb-10">
                    <h2>{section.heading}</h2>
                    <div
                      className="prose-flowtaris text-neutral-300"
                      dangerouslySetInnerHTML={{ __html: section.html }}
                    />
                  </div>
                ))
              ) : (
                <>
                  <p className="text-slate-500 text-sm mb-8">Last updated: {new Date().getFullYear()}</p>
                </>
              )}
            </CardContent>
          </Card>
        </Container>
      </div>
    )
  } catch (criticalErr: any) {
    return (
      <div className="flex flex-col flex-1 w-full pt-32 pb-24 text-white p-12">
        <h1 className="text-red-500 text-2xl font-bold mb-4">Critical Render Error</h1>
        <pre className="bg-black/50 p-6 rounded-lg text-red-400 font-mono whitespace-pre-wrap">
          {criticalErr.stack || criticalErr.message || String(criticalErr)}
        </pre>
      </div>
    )
  }
}

