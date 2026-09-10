import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@repo/ui'
import { ArrowRight, ChevronRight, Clock, BookOpen, FileText, Lightbulb, Brain, Search, ExternalLink, Calendar, Twitter, Linkedin, HelpCircle } from 'lucide-react'
import { createAdminClient, getInsights } from '@/lib/supabase'
import { INSIGHTS, getInsightBySlug } from '@/lib/insights-data'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateStaticParams() {
  // Generate params for all static insights
  const staticParams = INSIGHTS.map((i) => ({ slug: i.slug }))
  
  // Also generate params for DB insights if available
  try {
    const dbInsights = await getInsights()
    const dbParams = dbInsights.map((i: any) => ({ slug: i.slug }))
    // Merge, deduplicating
    const allSlugs = new Set([...staticParams.map(p => p.slug), ...dbParams.map((p: any) => p.slug)])
    return Array.from(allSlugs).map(slug => ({ slug }))
  } catch {
    return staticParams
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  // Try DB first
  try {
    const client = createAdminClient()
    const { data: dbData } = await client.from('insights').select('*').eq('slug', slug).single()
    if (dbData) {
      return {
        title: `${dbData.title} | Flowtaris AI Insights`,
        description: dbData.excerpt,
        openGraph: { title: dbData.title, description: dbData.excerpt, type: 'article' },
      }
    }
  } catch {}

  // Fall back to static
  const staticData = getInsightBySlug(slug)
  if (staticData) {
    return {
      title: `${staticData.title} | Flowtaris AI Insights`,
      description: staticData.excerpt,
      openGraph: { title: staticData.title, description: staticData.excerpt, type: 'article' },
      keywords: staticData.tags.join(', '),
    }
  }

  return { title: 'Insight Not Found' }
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params

  let data: any = null

  // Try DB first
  try {
    const client = createAdminClient()
    const { data: dbData } = await client.from('insights').select('*').eq('slug', slug).single()
    if (dbData) {
      data = {
        title: dbData.title,
        category: dbData.rich_text?.category || 'Research',
        author: dbData.author || 'Flowtaris AI',
        authorRole: dbData.rich_text?.authorRole || '',
        authorBio: dbData.rich_text?.authorBio || '',
        publishDate: dbData.published_at || dbData.created_at,
        readTime: dbData.rich_text?.readTime || '10 min',
        excerpt: dbData.excerpt || '',
        image: dbData.rich_text?.image || null,
        featured: dbData.rich_text?.featured || false,
        keyClaims: dbData.rich_text?.keyClaims || [],
        faqs: dbData.faq_items || [],
        citations: dbData.citations || [],
        sections: dbData.rich_text?.sections || [],
        tags: dbData.topic_clusters || [],
      }
    }
  } catch {}

  // Fall back to static data
  if (!data) {
    const staticInsight = getInsightBySlug(slug)
    if (!staticInsight) return notFound()
    data = {
      ...staticInsight,
      citations: [],
    }
  }

  const formattedDate = new Date(data.publishDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // Generate AEO / FAQ Schema
  const schemaOrgJSONLD = data.faqs && data.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': data.faqs.map((faq: any) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  } : null

  const articleSchemaJSONLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': data.title,
    'description': data.excerpt,
    'author': {
      '@type': 'Person',
      'name': data.author,
      'jobTitle': data.authorRole,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Flowtaris AI',
      'url': 'https://flowtaris-ecosystem-flowtaris-ai.vercel.app',
    },
    'datePublished': data.publishDate,
    'keywords': data.tags?.join(', '),
  }

  return (
    <div className="flex flex-col flex-1 w-full bg-[#0B0F19] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchemaJSONLD) }}
      />
      {schemaOrgJSONLD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }}
        />
      )}

      {/* ── HERO SECTION ─────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 border-b-2 border-white/10 relative overflow-hidden" aria-labelledby="article-header">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#c084fc] blur-[150px] opacity-10" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[50%] rounded-full bg-[#38bdf8] blur-[150px] opacity-5" />
        <Container size="xl" className="relative z-10">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-neutral-400 font-medium mb-8">
            <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
            <ChevronRight className="h-4 w-4 text-neutral-600" />
            <span className="text-[#c084fc]">{data.category}</span>
          </nav>

          {/* Two-column hero layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT: Text content */}
            <div className="flex flex-col gap-6">

              {/* Tags / Meta */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center rounded-none border border-[#c084fc] bg-[#c084fc]/10 px-3 py-1 text-sm font-bold text-[#c084fc] shadow-[4px_4px_0px_#c084fc] uppercase tracking-wider">
                  {data.category}
                </div>
                {data.featured && (
                  <div className="inline-flex items-center rounded-none border border-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 text-sm font-bold text-[#38bdf8] shadow-[4px_4px_0px_#38bdf8] uppercase tracking-wider">
                    Featured
                  </div>
                )}
                <span className="flex items-center gap-2 text-sm font-bold text-neutral-400">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-2 text-sm font-bold text-neutral-400">
                  <Clock className="h-4 w-4" />
                  {data.readTime} read
                </span>
              </div>

              {/* Title */}
              <h1 id="article-header" className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
                {data.title}
              </h1>

              {/* Lede / Excerpt */}
              <p className="text-lg md:text-xl font-semibold text-neutral-300 leading-relaxed border-l-4 border-[#38bdf8] pl-5">
                {data.excerpt}
              </p>

              {/* Divider */}
              <hr className="border-white/10" />

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#c084fc]/20 flex items-center justify-center border border-[#c084fc]/50 shrink-0 text-lg font-black text-[#c084fc]">
                  {data.author?.charAt(0) ?? 'F'}
                </div>
                <div>
                  <p className="font-black text-base text-white">{data.author}</p>
                  <p className="text-sm font-medium text-neutral-400">{data.authorRole}</p>
                </div>
              </div>

              {/* Tags */}
              {data.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 text-xs font-bold text-neutral-400 border border-white/10 rounded-full uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Hero image */}
            {data.image ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl bg-white/5">
                <img
                  src={data.image}
                  alt={data.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            ) : (
              /* Placeholder when no image */
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-[#111827] aspect-[4/3] flex items-center justify-center">
                <div className="text-center p-8">
                  <Brain className="h-16 w-16 text-[#c084fc]/40 mx-auto mb-4" />
                  <p className="text-neutral-600 font-bold uppercase tracking-widest text-sm">Flowtaris AI Research</p>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full py-16 px-6">
        <Container size="xl">
          <div className="grid lg:grid-cols-12 gap-16 items-start">

            {/* Sidebar (TOC & Share) */}
            <aside className="lg:col-span-4 lg:sticky top-32 space-y-8">
              <div className="bg-[#111827] border-2 border-white/10 rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 border-b-2 border-white/10 pb-4 uppercase tracking-widest">
                  <BookOpen className="h-5 w-5 text-[#c084fc]" />
                  Contents
                </h3>
                <nav aria-label="Article contents">
                  <ul className="space-y-4 font-bold">
                    {data.sections.map((section: any) => (
                      <li key={section.id}>
                        <a href={`#${section.id}`} className="text-neutral-400 hover:text-white transition-colors flex items-center gap-3 group">
                          <span className="text-[#38bdf8] text-lg font-black group-hover:text-[#c084fc] transition-colors">/</span>
                          <span className="text-sm">{section.title}</span>
                        </a>
                      </li>
                    ))}
                    {data.keyClaims?.length > 0 && (
                      <li>
                        <a href="#key-claims" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-3 group">
                          <span className="text-[#38bdf8] text-lg font-black group-hover:text-[#c084fc] transition-colors">/</span>
                          <span className="text-sm">Key Claims</span>
                        </a>
                      </li>
                    )}
                    {data.faqs?.length > 0 && (
                      <li>
                        <a href="#faq" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-3 group">
                          <span className="text-[#38bdf8] text-lg font-black group-hover:text-[#c084fc] transition-colors">/</span>
                          <span className="text-sm">FAQ</span>
                        </a>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>

              {/* Share */}
              <div className="bg-transparent border-2 border-[#c084fc] rounded-2xl p-8 shadow-[6px_6px_0px_#c084fc]">
                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Share Report</h3>
                <div className="flex gap-4">
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent('https://flowtaris-ecosystem-flowtaris-ai.vercel.app/insights/' + slug)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-[#111827] border border-[#c084fc]/50 text-white rounded-lg hover:bg-[#c084fc] transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://flowtaris-ecosystem-flowtaris-ai.vercel.app/insights/' + slug)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-[#111827] border border-[#c084fc]/50 text-white rounded-lg hover:bg-[#c084fc] transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Calendly CTA */}
              <div className="bg-gradient-to-br from-[#E8A020]/20 to-[#E8A020]/5 border-2 border-[#E8A020]/40 rounded-2xl p-8">
                <h3 className="text-lg font-black text-white mb-3">Discuss This Research</h3>
                <p className="text-sm text-neutral-400 mb-6 font-medium leading-relaxed">Book a 30-min call with our enterprise architects to explore how these findings apply to your finance stack.</p>
                <a href="https://calendly.com/flowtaris-info" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#E8A020] text-[#0A1628] rounded-lg font-black text-sm uppercase tracking-wider hover:bg-[#f5d98c] transition-colors gap-2">
                  Schedule Free Call
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </aside>

            {/* Article Content */}
            <div className="lg:col-span-8">



              {data.sections.map((section: any) => (
                <article key={section.id} id={section.id} className="mb-16 scroll-mt-32">
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-8 pb-4 border-b-2 border-white/10 flex items-center gap-4">
                    <span className="text-[#c084fc]">#</span> {section.title}
                  </h2>
                  <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-neutral-300 prose-p:leading-relaxed prose-strong:font-black prose-strong:text-white prose-ul:font-medium prose-ul:text-neutral-300">
                    {section.content.split('\n\n').map((paragraph: string, i: number) => {
                      if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                        return (
                          <ul key={i} className="list-disc pl-6 mb-8 space-y-3">
                            {paragraph.split('\n').filter(Boolean).map((item, j) => (
                              <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/^[-*]\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                            ))}
                          </ul>
                        )
                      }
                      if (/^\d+\.\s/.test(paragraph)) {
                        return (
                          <ol key={i} className="list-decimal pl-6 mb-8 space-y-3 font-medium text-lg">
                            {paragraph.split('\n').filter(Boolean).map((item, j) => (
                              <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                            ))}
                          </ol>
                        )
                      }
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return <h3 key={i} className="text-xl font-black text-white mt-10 mb-4" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '$1') }} />
                      }
                      return (
                        <p key={i} className="mb-6 text-lg text-neutral-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                      )
                    })}
                  </div>
                  {/* Section Image */}
                  {section.image && (
                    <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={section.image} alt={section.title} className="w-full h-auto" />
                    </div>
                  )}
                </article>
              ))}

              {/* Key Claims */}
              {data.keyClaims?.length > 0 && (
                <article id="key-claims" className="mb-16 scroll-mt-32">
                  <h2 className="text-3xl font-black text-white mb-8 pb-4 border-b-2 border-white/10 flex items-center gap-4">
                    <Lightbulb className="h-8 w-8 text-[#e8ff7d]" />
                    Key Claims &amp; Data Points
                  </h2>
                  <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 space-y-4 shadow-xl">
                    {data.keyClaims.map((claim: any, i: number) => {
                      // Support both legacy string format and new {text, image} object format
                      const claimText = typeof claim === 'string' ? claim : claim.text
                      const claimImage = typeof claim === 'string' ? null : claim.image
                      return (
                        <div key={i} className="p-5 bg-black/40 border border-[#e8ff7d]/20 rounded-xl hover:border-[#e8ff7d]/40 transition-colors">
                          <div className="flex items-start gap-4">
                            <span className="flex-shrink-0 text-xl font-black text-[#e8ff7d] w-6">{i + 1}.</span>
                            <p className="text-lg font-bold text-white flex-1 leading-relaxed">{claimText}</p>
                          </div>
                          {claimImage && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-[#e8ff7d]/20">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={claimImage} alt={`Claim ${i + 1} visual`} className="w-full h-auto" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </article>
              )}

              {/* FAQs */}
              {data.faqs?.length > 0 && (
                <article id="faq" className="mb-16 scroll-mt-32">
                  <h2 className="text-3xl font-black text-white mb-8 pb-4 border-b-2 border-white/10 flex items-center gap-4">
                    <HelpCircle className="h-8 w-8 text-[#38bdf8]" />
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {data.faqs.map((faq: any, i: number) => (
                      <details key={i} className="group bg-[#111827] border border-white/10 rounded-2xl p-6 open:bg-[#1a2234] transition-all cursor-pointer">
                        <summary className="text-xl font-black text-white flex justify-between items-center outline-none gap-4">
                          <span className="leading-snug">{faq.question}</span>
                          <ChevronRight className="h-6 w-6 text-[#c084fc] group-open:rotate-90 transition-transform shrink-0" />
                        </summary>
                        <p className="mt-6 text-lg font-medium text-neutral-300 leading-relaxed pl-2 border-l-2 border-[#38bdf8]">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </article>
              )}

              {/* Related Articles */}
              <section className="mb-16">
                <h2 className="text-2xl font-black text-white mb-8 pb-4 border-b-2 border-white/10">Related Research</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {INSIGHTS.filter(i => i.slug !== data.slug).slice(0, 2).map(related => (
                    <Link key={related.slug} href={`/insights/${related.slug}`} className="group bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-[#c084fc] hover:shadow-[4px_4px_0px_#c084fc] transition-all">
                      <div className="inline-flex items-center bg-[#c084fc]/10 px-2 py-0.5 text-xs font-bold text-[#c084fc] uppercase tracking-wider rounded-sm mb-4">
                        {related.category}
                      </div>
                      <h3 className="text-white font-black text-lg leading-snug mb-2 group-hover:text-[#c084fc] transition-colors">{related.title}</h3>
                      <p className="text-neutral-400 text-sm font-medium leading-relaxed line-clamp-2">{related.excerpt}</p>
                      <div className="mt-4 flex items-center gap-2 text-[#38bdf8] text-sm font-bold">
                        Read More <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* CTA */}
              <div className="mt-8 bg-[#0B0F19] border-2 border-[#38bdf8] p-12 shadow-[12px_12px_0px_#38bdf8] text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c084fc] blur-[80px] opacity-20" />
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Ready to Apply These Insights?
                </h2>
                <p className="text-xl font-bold text-neutral-400 mb-10 max-w-2xl mx-auto">
                  Take our 3-minute diagnostic to get a personalised AI automation roadmap for your finance team.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                  <a href="/assessment" className="inline-flex items-center justify-center px-10 h-16 bg-[#38bdf8] border-2 border-white rounded-none font-black text-xl text-black shadow-[6px_6px_0px_#fff] hover:translate-x-1 hover:-translate-y-1 transition-transform uppercase tracking-wider">
                    Start Free Assessment
                  </a>
                  <a href="https://calendly.com/flowtaris-info" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 h-16 bg-transparent border-2 border-[#E8A020] rounded-none font-black text-xl text-[#E8A020] shadow-[6px_6px_0px_#E8A020] hover:translate-x-1 hover:-translate-y-1 transition-transform uppercase tracking-wider">
                    Book a Call
                  </a>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}