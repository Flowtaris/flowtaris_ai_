import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Clock, Users, CheckCircle, ChevronRight, TrendingDown, TrendingUp, DollarSign, Zap, ShieldCheck, BarChart2, Quote, ExternalLink, ArrowUpRight, AlertTriangle, Calendar, Building2, Layers } from 'lucide-react'

interface Props { params: Promise<{ slug: string }> }

import { getCaseStudyBySlug } from '@/lib/supabase'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const dbRecord = await getCaseStudyBySlug(slug);
  const data = dbRecord?.content_data;
  if (!data) return { title: 'Case Study Not Found' }
  return {
    title: `${data.client} — ${data.headline} | Flowtaris AI Case Studies`,
    description: data.subheadline,
    alternates: { canonical: `https://flowtaris.ai/case-studies/${slug}` },
    openGraph: {
      title: `${data.client} Case Study | Flowtaris AI`,
      description: data.subheadline,
      images: [{ url: `https://flowtaris.ai${data.heroImage}`, width: 1200, height: 630 }],
    },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const dbRecord = await getCaseStudyBySlug(slug);
  const data = dbRecord?.content_data;
  if (!data) return notFound()

  const relatedRecords = await Promise.all((data.relatedSlugs || []).map((s: string) => getCaseStudyBySlug(s)));
  const relatedStudies = relatedRecords.filter(Boolean).map(r => ({ slug: r!.slug, ...(r!.content_data as Record<string, any>) }));

  return (
    <div className="min-h-screen bg-[#050608] text-white">

      {/* ── JSON-LD Schema ──────────────────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.headline,
          description: data.subheadline,
          author: { '@type': 'Organization', name: 'Flowtaris AI' },
          publisher: { '@type': 'Organization', name: 'Flowtaris AI', url: 'https://flowtaris.ai' },
          image: `https://flowtaris.ai${data.heroImage}`,
          datePublished: data.deploymentDate,
          about: {
            '@type': 'Thing',
            name: `${data.sector} AI Automation`,
            description: data.challenge.title,
          }
        })
      }} />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <img src={data.heroImage} alt={`${data.client} Flowtaris AI deployment`} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/60 to-[#050608]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/80 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-12">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-300 transition">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/case-studies" className="hover:text-gray-300 transition">Case Studies</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-400">{data.client}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c084fc] bg-[#c084fc]/10 border border-[#c084fc]/20 px-4 py-1.5 rounded-full">
                {data.confidential ? 'Confidential — Anonymized' : data.client}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                {data.sector}
              </span>
              {data.platforms.map((p: string) => (
                <span key={p} className="text-[10px] font-bold uppercase tracking-widest text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/20 px-3 py-1.5 rounded-full">{p}</span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.08] tracking-tight mb-4 text-white">
              {data.headline}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-light max-w-3xl leading-relaxed">
              {data.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* ── STICKY META BAR ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#050608]/95 backdrop-blur-xl border-b border-white/[0.06] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {data.deploymentDate}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {data.timeline} deployment</span>
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {data.teamSize}-person team</span>
            <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {data.sector}</span>
          </div>
          <Link href="/assessment" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#c084fc] hover:text-[#a855f7] transition">
            Get Similar Results <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-14">

          {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
          <div className="space-y-20">

            {/* Key Metrics */}
            <section>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#c084fc] mb-4">Verified Outcomes</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.keyMetrics.map((m: any, i: number) => (
                  <div key={i} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: m.color }} />
                    {m.direction === 'value' ? (
                      <>
                        <div className="text-2xl font-black mb-1" style={{ color: m.color }}>{m.value}</div>
                        <div className="text-xs text-gray-500 font-medium">{m.label}</div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-2xl font-black" style={{ color: m.color }}>{m.after}</span>
                          <span className="text-xs text-gray-600 line-through">{m.before}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-medium">{m.label}</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-green-400 bg-green-400/10">
                            {m.direction === 'down' ? '↓' : '↑'}{m.improvement}%
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Challenge */}
            <section>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#38bdf8] mb-4">The Challenge</div>
              <h2 className="text-3xl font-black text-white mb-6">{data.challenge.title}</h2>
              <div className="text-gray-400 font-light leading-relaxed space-y-4 text-base mb-8">
                {data.challenge.body.split('\n\n').map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="rounded-2xl border border-[#38bdf8]/20 bg-[#38bdf8]/5 p-6">
                <div className="text-xs font-black uppercase tracking-widest text-[#38bdf8] mb-4">Pain Points at a Glance</div>
                <ul className="space-y-3">
                  {data.challenge.painPoints.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="text-red-500 mt-0.5 shrink-0">▸</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Image 1 */}
            {data.images?.[0] && (
              <figure className="rounded-2xl overflow-hidden border border-white/[0.07]">
                <img src={data.images[0].src} alt={data.images[0].alt} className="w-full h-72 md:h-96 object-cover" />
                <figcaption className="bg-[#0a0a10] border-t border-white/[0.06] px-5 py-3 text-xs text-gray-500 italic">
                  {data.images[0].caption}
                </figcaption>
              </figure>
            )}

            {/* Approach */}
            <section>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#c084fc] mb-4">Implementation Approach</div>
              <h2 className="text-3xl font-black text-white mb-8">{data.approach.title}</h2>
              <div className="space-y-6">
                {data.approach.phases.map((phase: any, i: number) => (
                  <div key={i} className="relative pl-8 border-l-2 border-[#c084fc]/30">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#c084fc] border-4 border-[#050608]" />
                    <div className="text-xs font-black uppercase tracking-widest text-[#c084fc] mb-2">{phase.phase}</div>
                    <p className="text-gray-400 font-light leading-relaxed text-base mb-4">{phase.description}</p>
                    <ul className="space-y-1.5">
                      {phase.outcomes.map((o: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-[#34d399] mt-0.5 shrink-0" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Image 2 */}
            {data.images?.[1] && (
              <figure className="rounded-2xl overflow-hidden border border-white/[0.07]">
                <img src={data.images[1].src} alt={data.images[1].alt} className="w-full h-72 md:h-80 object-cover" />
                <figcaption className="bg-[#0a0a10] border-t border-white/[0.06] px-5 py-3 text-xs text-gray-500 italic">
                  {data.images[1].caption}
                </figcaption>
              </figure>
            )}

            {/* Technical Specs */}
            <section>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#34d399] mb-4">Technical Architecture</div>
              <h2 className="text-3xl font-black text-white mb-8">{data.technicalSpecs.title}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.technicalSpecs.points.map((point: any, i: number) => (
                  <div key={i} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-[#c084fc]/10 flex items-center justify-center">
                        <point.icon className="w-5 h-5 text-[#c084fc]" />
                      </div>
                      <span className="text-sm font-bold text-white">{point.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{point.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Image 3 */}
            {data.images?.[2] && (
              <figure className="rounded-2xl overflow-hidden border border-white/[0.07]">
                <img src={data.images[2].src} alt={data.images[2].alt} className="w-full h-64 md:h-72 object-cover" />
                <figcaption className="bg-[#0a0a10] border-t border-white/[0.06] px-5 py-3 text-xs text-gray-500 italic">
                  {data.images[2].caption}
                </figcaption>
              </figure>
            )}

            {/* Results */}
            <section>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#fb923c] mb-4">Verified Results</div>
              <h2 className="text-3xl font-black text-white mb-6">{data.results.title}</h2>
              <div className="text-gray-400 font-light leading-relaxed text-base mb-8 space-y-4">
                {data.results.body.split('\n\n').map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="rounded-2xl border border-[#34d399]/20 bg-[#34d399]/5 p-6">
                <div className="text-xs font-black uppercase tracking-widest text-[#34d399] mb-4">Results Summary</div>
                <ul className="space-y-3">
                  {data.results.bullets.map((bullet: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-200">
                      <CheckCircle className="w-4 h-4 text-[#34d399] mt-0.5 shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Testimonial */}
            <section className="rounded-3xl border border-[#c084fc]/20 bg-gradient-to-br from-[#c084fc]/5 to-transparent p-8 md:p-10 relative">
              <Quote className="absolute top-6 right-6 w-12 h-12 text-[#c084fc]/20" />
              <p className="text-xl md:text-2xl font-light text-white leading-relaxed mb-6 italic">
                "{data.testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c084fc]/20 flex items-center justify-center text-[#c084fc] font-black text-sm">
                  {data.testimonial.author.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{data.testimonial.author}</div>
                  <div className="text-xs text-gray-500">{data.testimonial.company}</div>
                </div>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
          <aside className="space-y-6">

            {/* Quick Facts */}
            <div className="sticky top-20 space-y-4">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-5">Deployment Details</div>
                <dl className="space-y-4">
                  {[
                    { label: 'Industry', value: data.sector },
                    { label: 'Timeline', value: data.timeline },
                    { label: 'Team Size', value: `${data.teamSize} specialists` },
                    { label: 'Deployment', value: data.deploymentDate },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <dt className="text-gray-500">{item.label}</dt>
                      <dd className="text-white font-semibold text-right max-w-[55%]">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Platforms */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Platforms</div>
                <div className="flex flex-wrap gap-2">
                  {data.platforms.map((p: string) => (
                    <span key={p} className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">{p}</span>
                  ))}
                </div>
              </div>

              {/* Capabilities */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Capabilities Deployed</div>
                <div className="space-y-2">
                  {data.capabilityTags.map((c: string) => (
                    <div key={c} className="flex items-center gap-2 text-sm">
                      <Zap className="w-3.5 h-3.5 text-[#c084fc] shrink-0" />
                      <span className="text-gray-300 font-medium">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-2xl border border-[#c084fc]/30 bg-gradient-to-br from-[#c084fc]/10 to-transparent p-6">
                <h3 className="text-base font-black text-white mb-2">Get a Similar Result</h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                  See which Flowtaris AI capability matches your ERP environment and delivers the fastest ROI.
                </p>
                <Link href="/assessment" className="flex items-center justify-center gap-2 bg-[#c084fc] hover:bg-[#a855f7] text-white font-bold text-sm px-5 py-3 rounded-xl transition-all duration-300 w-full">
                  Start Assessment <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/roi-calculator" className="flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/10 text-white font-semibold text-sm px-5 py-3 rounded-xl border border-white/10 transition-all duration-300 w-full mt-2">
                  <BarChart2 className="w-4 h-4 text-[#38bdf8]" /> Calculate My ROI
                </Link>
                <a href="https://calendly.com/flowtaris-info" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#E8A020]/10 hover:bg-[#E8A020]/20 text-[#E8A020] font-bold text-sm px-5 py-3 rounded-xl border border-[#E8A020]/30 transition-all duration-300 w-full mt-2">
                  <Calendar className="w-4 h-4" /> Book a Strategy Call
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* ── RELATED CASE STUDIES ─────────────────────────────────────────────── */}
        {relatedStudies.length > 0 && (
          <section className="mt-24 pt-12 border-t border-white/[0.06]">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#c084fc] mb-4">More Case Studies</div>
            <h2 className="text-2xl font-black text-white mb-8">See More Flowtaris AI Deployments</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedStudies.map((rs: any) => {
                const rsSlug = rs.slug
                return (
                  <Link key={rsSlug} href={`/case-studies/${rsSlug}`} className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-[#c084fc]/30 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      <img src={rs.heroImage} alt={rs.client} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#c084fc] mb-2">{rs.sector}</div>
                      <h3 className="text-base font-black text-white group-hover:text-[#c084fc] transition-colors mb-1 leading-snug">{rs.headline}</h3>
                      <div className="flex items-center gap-1 text-xs text-[#38bdf8] font-semibold mt-3">
                        Read Case Study <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}