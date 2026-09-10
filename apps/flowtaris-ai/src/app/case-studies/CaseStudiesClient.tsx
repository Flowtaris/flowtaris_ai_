'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Users, TrendingUp, DollarSign, CheckCircle, ChevronRight, BarChart2, Zap, ShieldCheck, Search, Filter } from 'lucide-react'

export default function CaseStudiesClient({
  caseStudies,
  heroConfig
}: {
  caseStudies: any[]
  heroConfig?: any
}) {
  const [activeTag, setActiveTag] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const formattedCaseStudies = caseStudies.map(cs => ({
    slug: cs.slug,
    ...(cs.content_data || {})
  }))

  const ALL_TAGS = ['All', ...Array.from(new Set(formattedCaseStudies.flatMap(cs => cs.tags || []))).sort()]

  const filtered = formattedCaseStudies.filter(cs => {
    const matchTag = activeTag === 'All' || cs.tags.includes(activeTag)
    const matchSearch = !searchQuery ||
      cs.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.sector.toLowerCase().includes(searchQuery.toLowerCase())
    return matchTag && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#050608] text-white">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#c084fc] opacity-[0.06] blur-[160px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#c084fc] bg-[#c084fc]/10 border border-[#c084fc]/30 px-5 py-2 rounded-full mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse" />
            {heroConfig?.badgeText || 'Verified Customer Results'}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.02] tracking-tight mb-8">
            {heroConfig?.titleLine1 || 'Real Transformations.'}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#38bdf8]">{heroConfig?.titleLine2 || 'Measured Results.'}</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-3xl mb-12">
            {heroConfig?.subtitle || 'Three enterprise deployments across NetSuite, SAP, Coupa, and Workday — with real before/after data, full technical architectures, and team testimonials. Client names anonymized per confidentiality agreements.'}
          </p>

          {/* Aggregate numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
            {[
              { number: heroConfig?.metric1Value || '$27M+', label: heroConfig?.metric1Label || 'Combined Value Delivered', accent: '#c084fc' },
              { number: heroConfig?.metric2Value || '5', label: heroConfig?.metric2Label || 'Enterprise Deployments', accent: '#38bdf8' },
              { number: heroConfig?.metric3Value || '<8 wks', label: heroConfig?.metric3Label || 'Average Time to Value', accent: '#34d399' },
              { number: heroConfig?.metric4Value || '99%', label: heroConfig?.metric4Label || 'Avg Automation Rate Achieved', accent: '#fb923c' },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm">
                <div className="text-3xl font-black mb-1" style={{ color: stat.accent }}>{stat.number}</div>
                <div className="text-xs text-gray-500 font-medium leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/assessment" className="inline-flex items-center justify-center gap-2 bg-[#c084fc] hover:bg-[#a855f7] text-white font-bold text-base px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
              Get Your Custom Analysis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/roi-calculator" className="inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/10 text-white font-semibold text-base px-8 py-4 rounded-2xl border border-white/10 transition-all duration-300">
              <BarChart2 className="w-5 h-5 text-[#38bdf8]" /> Calculate Your ROI
            </Link>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ────────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-30 bg-[#050608]/90 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search case studies..."
              className="w-full pl-9 pr-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#c084fc]/50 focus:bg-white/[0.07] transition"
            />
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
            <Filter className="w-4 h-4 text-gray-600 shrink-0" />
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 ${activeTag === tag
                    ? 'bg-[#c084fc] text-white shadow-lg'
                    : 'bg-white/[0.05] text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDY CARDS ──────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">No case studies match your filters.</p>
            <button onClick={() => { setActiveTag('All'); setSearchQuery('') }} className="mt-4 text-sm text-[#c084fc] hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map((cs, idx) => (
              <article key={cs.slug} className="group relative rounded-3xl border border-white/[0.07] bg-white/[0.02] overflow-hidden hover:border-[#c084fc]/30 hover:bg-white/[0.04] transition-all duration-500">
                <div className="grid lg:grid-cols-[2fr_3fr] min-h-[420px]">

                  {/* Left: Image */}
                  <div className="relative overflow-hidden bg-[#0c0c14]">
                    <img
                      src={cs.heroImage}
                      alt={`${cs.client} Flowtaris AI case study`}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-[1.02] transition-all duration-700"
                      style={{ minHeight: '300px' }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050608]/60 lg:block hidden" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/70 to-transparent lg:hidden" />

                    {/* Label badge */}
                    <div className="absolute top-5 left-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 bg-[#050608]/80 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full">
                        {cs.label}
                      </span>
                    </div>

                    {/* Index number */}
                    <div className="absolute bottom-5 right-5 text-6xl font-black text-white/10 select-none">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#c084fc]">{cs.sector}</span>
                        <span className="text-gray-700">·</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" /> {cs.timeline} deployment
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" /> {cs.teamSize}-person team
                        </div>
                      </div>

                      {/* Headline */}
                      <h2 className="text-2xl md:text-3xl font-black text-white leading-snug mb-3 group-hover:text-[#c084fc] transition-colors duration-300">
                        {cs.headline}
                      </h2>
                      <p className="text-gray-400 text-base font-light leading-relaxed mb-6 max-w-lg">
                        {cs.subheadline}
                      </p>

                      {/* Key Numbers */}
                      {(cs.keyMetrics || cs.keyNumbers || []).length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                          {(cs.keyMetrics || cs.keyNumbers).slice(0, 4).map((kn: any) => {
                            // Support both old and new data structures
                            const displayMetric = kn.direction === 'value' ? kn.value : (kn.improvement ? `${kn.improvement}%` : kn.metric)
                            
                            return (
                              <div key={kn.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-center">
                                <div className="text-xl font-black mb-0.5" style={{ color: kn.color || '#38bdf8' }}>{displayMetric}</div>
                                <div className="text-[10px] text-gray-500 font-medium leading-tight">{kn.label}</div>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Platform & Capability Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(cs.platforms || []).map((p: string) => (
                          <span key={p} className="text-xs font-bold px-3 py-1 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">{p}</span>
                        ))}
                        {(cs.capabilityTags || []).map((c: string) => (
                          <span key={c} className="text-xs font-medium px-3 py-1 rounded-full bg-white/[0.05] text-gray-400 border border-white/10">{c}</span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-white/[0.06]">
                      <span className="text-xs text-gray-600">Full technical architecture + team quotes inside</span>
                      <Link
                        href={`/case-studies/${cs.slug}`}
                        className="inline-flex items-center gap-2 bg-[#c084fc] hover:bg-[#a855f7] text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        Full Case Study <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ── TRUST SECTION ──────────────────────────────────────────────────── */}
        <div className="mt-24 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#34d399] mb-5">About Our Methodology</div>
              <h3 className="text-3xl font-black text-white mb-4">How We Measure & Report Results</h3>
              <p className="text-gray-400 font-light leading-relaxed mb-6">
                Every metric in our case studies is pulled from verified customer data — ERP system logs, financial reports, and formal audit outputs. We don't extrapolate or project; we report actuals from the first 12 months post-deployment.
              </p>
              <ul className="space-y-3">
                {[
                  'Metrics sourced from ERP transaction logs, not surveys',
                  'Before/After comparison from same calendar periods',
                  'Finance team verified and legally reviewed disclosures',
                  'Client names anonymized under standard NDA terms',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-[#34d399] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {[
                { icon: Zap, title: 'Speed to Value', desc: 'Average 3–5 month deployment to measurable results, not 18-month "transformations"', color: '#38bdf8' },
                { icon: DollarSign, title: 'Hard ROI Only', desc: 'We track actual dollar savings from labor reduction, error elimination, and risk mitigation', color: '#c084fc' },
                { icon: ShieldCheck, title: 'Audit-Ready Compliance', desc: 'Every deployment includes SOC2-ready logging, explainability, and regulatory documentation', color: '#34d399' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-0.5">{item.title}</div>
                    <div className="text-xs text-gray-500 font-light leading-snug">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────────────── */}
        <div className="mt-12 rounded-3xl bg-gradient-to-br from-[#c084fc]/10 via-transparent to-[#38bdf8]/10 border border-[#c084fc]/20 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Which result could you replicate?
            </h2>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto mb-10">
              Take our 3-minute AI Readiness Assessment. We'll analyze your ERP setup, volume, and pain points — then show you the specific capability and expected ROI that matches your situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment" className="inline-flex items-center justify-center gap-2 bg-white text-black font-black text-base px-10 py-4 rounded-2xl hover:bg-gray-100 hover:scale-[1.02] transition-all duration-300">
                Start Free Assessment <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/roi-calculator" className="inline-flex items-center justify-center gap-2 bg-white/[0.06] text-white font-semibold text-base px-10 py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <BarChart2 className="w-5 h-5 text-[#c084fc]" /> Calculate My ROI
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 mt-8 max-w-2xl mx-auto">
          * All metrics sourced from verified production deployments. Outcomes depend on implementation scope, data quality, and baseline performance. Client identities are anonymized under standard confidentiality agreements.
        </p>
      </main>
    </div>
  )
}
