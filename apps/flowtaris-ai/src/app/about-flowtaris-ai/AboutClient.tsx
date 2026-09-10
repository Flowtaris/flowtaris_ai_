'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container, Button } from '@repo/ui'
import { ArrowRight, Brain, Shield, CheckCircle2, XCircle, Database, Lock } from 'lucide-react'

// ── Default Fallback Data ─────────────────────────────────────────────────────

export const DEFAULT_ABOUT_DATA = {
  hero: {
    eyebrow: 'The Intelligence Engine',
    headline_part1: "We didn't build another",
    headline_highlight: 'AI software tool.',
    subtitle_part1: 'We built the intelligence layer',
    subtitle_part2: 'enterprise finance was missing.',
    description: 'Flowtaris AI is the advanced product division of Flowtaris. Born from over a decade inside complex ERP deployments, we automate the manual bottlenecks we used to solve by hand.',
    primary_cta: {
      label: 'Start Assessment',
      href: '/assessment'
    },
    secondary_cta: {
      label: 'Calculate ROI',
      href: '/roi-calculator'
    },
    stats: [
      { value: '99.5%+', label: 'Document Accuracy', isGold: false },
      { value: '14,000+', label: 'Hours Saved / Yr', isGold: false },
      { value: '<90 Days', label: 'Time-to-Value', isGold: false },
      { value: '$21M+', label: 'Client Savings', isGold: true }
    ]
  },
  manifesto: {
    imageSrc: '/images/about_manifesto.png',
    imageAlt: 'Flowtaris Manifesto Platform',
    statements: [
      {
        title: 'Every invoice should understand itself.',
        description: "Not just extracted — understood. Context, intent, exceptions, and nuance. That's the difference between legacy template OCR and our GenAI models. It is the difference between 70% automation and 95%."
      },
      {
        title: 'Your ERP should answer your questions.',
        description: 'Not the other way around. Ask your NetSuite, SAP, or Workday a question in plain English, and get a verified, secure answer in seconds. No complex SQL required.'
      },
      {
        title: 'Finance needs tools, not spreadsheets.',
        description: 'Predictive cash flow, anomaly detection, and real-time variance analysis are the new baseline. We built the architecture to make your data work proactively.'
      }
    ]
  },
  origin_story: {
    title: 'From Consulting to Product',
    subtitle: "The genesis of Flowtaris AI wasn't a whitepaper. It was thousands of hours spent in the ERP trenches.",
    milestones: [
      {
        year: '19',
        title: 'The Trenches',
        description: 'Flowtaris deployed 200+ ERP customizations. We saw the exact same manual bottlenecks in every single engagement.'
      },
      {
        year: '23',
        title: 'The Pattern',
        description: '"We keep solving the same problems manually. What if we automated ourselves?" Our internal R&D division was formed.'
      },
      {
        year: '24',
        title: 'The Lab',
        description: 'First models launched. GenAI Document Intelligence hits 99.5%. Our Conversational ERP passes internal infosec testing.'
      },
      {
        year: '25',
        title: 'The Platform',
        description: 'Flowtaris AI launches. Enterprise-grade. Platform-agnostic. Backed by the delivery muscle of our senior consultants.'
      }
    ]
  },
  unfair_advantage: {
    title: 'The Unfair Advantage',
    subtitle: 'Why Flowtaris AI outperforms horizontal, generic AI vendors in finance automation.',
    rows: [
      { label: 'ERP Knowledge', generic: 'Read the API docs', ours: 'Built 200+ customizations' },
      { label: 'Finance DNA', generic: 'Trained on public data', ours: 'Built by former controllers & Big 4' },
      { label: 'Accuracy', generic: '70–85% (Template OCR)', ours: '99.5%+ (GenAI Understanding)' },
      { label: 'Implementation', generic: '12–18 months', ours: '<90 days to first value' },
      { label: 'Integration', generic: 'Surface connectors', ours: 'Native to NetSuite & Coupa' },
      { label: 'Governance', generic: 'In roadmap', ours: 'EU AI Act ready, full audit trails' }
    ]
  },
  architecture: {
    title: 'Zero-Trust Architecture.',
    description: "We don't send your data to public LLMs. We don't train models on your invoices. Our architecture is designed strictly for security, auditability, and deterministic outcomes.",
    layers: [
      {
        title: 'Ingestion Layer',
        description: 'Native connectors to NetSuite, Coupa, SAP, Workday. Ingest via API, EDI, Email, or SFTP securely.'
      },
      {
        title: 'Intelligence Core',
        description: 'Ensemble models (LLMs + deterministic logic) orchestrating GenAI Document Intelligence and Conversational ERP.'
      },
      {
        title: 'Governance Layer',
        description: 'Every action is RBAC-enforced, fully logged, and explainable before it ever posts back to your ERP.'
      }
    ],
    principles_title: 'Non-Negotiable Principles',
    principles: [
      { title: 'Every Action Reversible', desc: 'No black-box changes. Every AI action has an undo, every decision has an audit trail.' },
      { title: 'Zero Trust on Data', desc: 'Row-level security, encrypted at rest/transit. No model training on client financial data.' },
      { title: 'Explainability Mandatory', desc: 'Every extraction and classification comes with a confidence score and reasoning chain.' },
      { title: 'Value in 90 Days', desc: "If you can't measure ROI in a quarter, we've failed. Quick Wins methodology built in." }
    ]
  },
  team: {
    title: 'Built by the Best',
    subtitle: 'We don\'t demo AI to CFOs. We ARE former CFO office consultants.',
    members: [
      {
        initials: 'FA',
        title: 'The Finance Architect',
        bio: '12 years in Big 4. Led 30+ NetSuite transformations. Now building the AI that automates what they used to do manually.',
        tags: 'NetSuite Cert, Big 4 Alum'
      },
      {
        initials: 'ML',
        title: 'The ML Engineer',
        bio: 'Former FAANG researcher. Published in NeurIPS. Now applying transformer architectures directly to enterprise document understanding.',
        tags: 'AI/ML Ph.D., GenAI Lead'
      },
      {
        initials: 'PE',
        title: 'The Platform Engineer',
        bio: 'Built integrations processing $2B+ in annual transaction volume. Now designing the connective tissue between our AI models and ERP systems.',
        tags: 'Coupa Expert, SAP Architect'
      }
    ]
  },
  bridge: {
    logoSrc: '/images/logo.png',
    title: 'Flowtaris AI is the intelligence engine of Flowtaris.',
    description: "Every model we ship is backed by the delivery muscle of an enterprise consulting team. Every deployment is supported by consultants who've lived inside NetSuite, Coupa, SAP, and Workday.",
    ctaLabel: 'Meet the Flowtaris Team',
    ctaHref: 'https://www.flowtaris.com/about'
  }
}

// ── Intersection Observer Hook for scroll animations ─────────────────────────

function useInView(options = {}) {
  const [isIntersecting, setIntersecting] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref) return
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting)
    }, { threshold: 0.1, ...options })
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, options])

  return [setRef, isIntersecting] as const
}

function FadeInUp({ children, delay = '0ms', className = '' }: { children: React.ReactNode, delay?: string, className?: string }) {
  const [ref, inView] = useInView({ threshold: 0.15 })
  return (
    <div
      ref={ref as any}
      className={`transition-all duration-1000 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  )
}

// ── Main About Component ──────────────────────────────────────────────────────

export default function AboutClient() {
  const [data, setData] = useState(DEFAULT_ABOUT_DATA)

  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg?.aboutConfig) {
          const ac = cfg.aboutConfig
          setData({
            hero: {
              ...DEFAULT_ABOUT_DATA.hero,
              ...(ac.hero || {}),
              primary_cta: { ...DEFAULT_ABOUT_DATA.hero.primary_cta, ...(ac.hero?.primary_cta || {}) },
              secondary_cta: { ...DEFAULT_ABOUT_DATA.hero.secondary_cta, ...(ac.hero?.secondary_cta || {}) },
              stats: ac.hero?.stats || DEFAULT_ABOUT_DATA.hero.stats
            },
            manifesto: {
              ...DEFAULT_ABOUT_DATA.manifesto,
              ...(ac.manifesto || {}),
              statements: ac.manifesto?.statements || DEFAULT_ABOUT_DATA.manifesto.statements
            },
            origin_story: {
              ...DEFAULT_ABOUT_DATA.origin_story,
              ...(ac.origin_story || {}),
              milestones: ac.origin_story?.milestones || DEFAULT_ABOUT_DATA.origin_story.milestones
            },
            unfair_advantage: {
              ...DEFAULT_ABOUT_DATA.unfair_advantage,
              ...(ac.unfair_advantage || {}),
              rows: ac.unfair_advantage?.rows || DEFAULT_ABOUT_DATA.unfair_advantage.rows
            },
            architecture: {
              ...DEFAULT_ABOUT_DATA.architecture,
              ...(ac.architecture || {}),
              layers: ac.architecture?.layers || DEFAULT_ABOUT_DATA.architecture.layers,
              principles: ac.architecture?.principles || DEFAULT_ABOUT_DATA.architecture.principles
            },
            team: {
              ...DEFAULT_ABOUT_DATA.team,
              ...(ac.team || {}),
              members: ac.team?.members || DEFAULT_ABOUT_DATA.team.members
            },
            bridge: {
              ...DEFAULT_ABOUT_DATA.bridge,
              ...(ac.bridge || {})
            }
          })
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="flex flex-col flex-1 w-full bg-[#0A1628] text-white font-sans selection:bg-[#E8A020] selection:text-white">
      
      {/* ── Section 1: Hero ("The Conviction") ── */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-16 px-6 lg:px-12 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0A1628]" />
          <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle_at_center,#E8A020_0%,transparent_60%)] opacity-[0.05] pointer-events-none blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle_at_center,#ffffff_0%,transparent_60%)] opacity-[0.03] pointer-events-none blur-3xl" />
        </div>

        <Container size="xl" className="relative z-10 w-full max-w-[1400px] mx-auto">
          <div className="max-w-4xl flex flex-col items-start gap-8">
            <FadeInUp>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#E8A020]" />
                <span className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#E8A020]">
                  {data.hero.eyebrow}
                </span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#E8A020]" />
              </div>
            </FadeInUp>
            
            <FadeInUp delay="100ms">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white mb-2" style={{ fontFamily: 'var(--font-sora)' }}>
                {data.hero.headline_part1} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8A020] to-[#f5d98c]">
                  {data.hero.headline_highlight}
                </span>
              </h1>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-neutral-400 mt-4 leading-tight">
                {data.hero.subtitle_part1} <br className="hidden md:block" />{data.hero.subtitle_part2}
              </h2>
            </FadeInUp>
            
            <FadeInUp delay="200ms">
              <p className="text-lg md:text-xl text-neutral-300 max-w-2xl leading-relaxed mt-4 font-light">
                {data.hero.description}
              </p>
            </FadeInUp>

            <FadeInUp delay="300ms" className="flex flex-col sm:flex-row gap-5 mt-8 w-full sm:w-auto">
              <Link href={data.hero.primary_cta.href} className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-[#E8A020] hover:bg-[#d4901b] text-[#0A1628] h-14 px-8 text-[15px] font-bold uppercase tracking-wide rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(232,160,32,0.3)] hover:shadow-[0_0_30px_rgba(232,160,32,0.5)] hover:-translate-y-1">
                  {data.hero.primary_cta.label}
                </Button>
              </Link>
              <Link href={data.hero.secondary_cta.href} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full border-white/20 hover:bg-white/5 h-14 px-8 text-[15px] font-bold uppercase tracking-wide text-white rounded-sm transition-all duration-300 hover:-translate-y-1">
                  {data.hero.secondary_cta.label}
                </Button>
              </Link>
            </FadeInUp>
          </div>

          <FadeInUp delay="400ms" className="mt-20 md:mt-32 border-t border-white/10 pt-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full max-w-5xl">
              {data.hero.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <span className={`text-3xl md:text-4xl font-bold ${stat.isGold ? 'text-[#E8A020]' : 'text-white'}`}>
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </FadeInUp>
        </Container>
      </section>

      {/* ── Section 2: The Manifesto ── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-white text-[#0A1628]">
        <Container size="xl" className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 md:order-1 relative h-[400px] md:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl border border-[#0A1628]/10 flex items-center justify-center">
              <Image
                src={data.manifesto.imageSrc || '/images/about_manifesto.png'}
                alt={data.manifesto.imageAlt || 'Flowtaris Manifesto Platform'}
                fill
                className="object-cover"
              />
            </div>

            <div className="order-1 md:order-2 flex flex-col gap-12">
              {data.manifesto.statements.map((stmt, idx) => (
                <FadeInUp key={idx} delay={`${idx * 100}ms`}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-sora)' }}>
                    {stmt.title}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed font-light">
                    {stmt.description}
                  </p>
                </FadeInUp>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Section 3: The Origin Story ── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#050B14]">
        <Container size="xl" className="max-w-[1400px] mx-auto">
          <FadeInUp className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-sora)' }}>
              {data.origin_story.title}
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
              {data.origin_story.subtitle}
            </p>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
            <div className="hidden lg:block absolute top-[45px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
            
            {data.origin_story.milestones.map((m, idx) => {
              const isLast = idx === data.origin_story.milestones.length - 1
              return (
                <FadeInUp key={idx} delay={`${idx * 100}ms`} className="relative z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 font-bold text-xl ${
                      isLast
                        ? 'bg-[#E8A020] border-2 border-[#E8A020] text-[#0A1628] shadow-[0_0_40px_rgba(232,160,32,0.4)]'
                        : 'bg-[#0A1628] border-2 border-white/10 text-[#E8A020] shadow-[0_0_20px_rgba(232,160,32,0.1)]'
                    }`}>
                      {m.year}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-sora)' }}>
                      {m.title}
                    </h3>
                    <p className="text-neutral-400 leading-relaxed font-light text-sm md:text-base">
                      {m.description}
                    </p>
                  </div>
                </FadeInUp>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── Section 4: The Unfair Advantage ── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0A1628] border-t border-white/5">
        <Container size="xl" className="max-w-[1400px] mx-auto">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-sora)' }}>
              {data.unfair_advantage.title}
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
              {data.unfair_advantage.subtitle}
            </p>
          </FadeInUp>

          <FadeInUp className="w-full max-w-5xl mx-auto bg-[#050B14] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-3 bg-white/5 border-b border-white/10 p-6 text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400">
              <div className="hidden md:block">Dimension</div>
              <div>Generic AI Vendor</div>
              <div className="text-white flex items-center gap-2">
                Flowtaris AI
              </div>
            </div>
            
            {data.unfair_advantage.rows.map((row, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-3 p-6 border-b border-white/5 hover:bg-white/5 transition-colors items-center text-sm md:text-base font-light">
                <div className="hidden md:block font-medium text-white">{row.label}</div>
                <div className="text-neutral-500 flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-neutral-600 shrink-0" /> 
                  <span>{row.generic}</span>
                </div>
                <div className="text-white font-medium flex items-center gap-3">
                  <div className="relative w-5 h-5 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full animate-[pulse_2s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#E8A020" strokeWidth="2" strokeDasharray="60" strokeDashoffset="0" className="animate-[spin_4s_linear_infinite]" />
                      <path d="M8 12L11 15L16 9" stroke="#E8A020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {row.ours}
                </div>
              </div>
            ))}
          </FadeInUp>
        </Container>
      </section>

      {/* ── Section 5: The Intelligence Architecture & Principles ── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-white text-[#0A1628]">
        <Container size="xl" className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeInUp>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-sora)' }}>
                {data.architecture.title}
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mb-12 font-light leading-relaxed">
                {data.architecture.description}
              </p>
              
              <div className="space-y-8">
                {data.architecture.layers.map((layer, idx) => {
                  const icons = [Database, Brain, Lock]
                  const LayerIcon = icons[idx % icons.length]
                  return (
                    <div key={idx} className="flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <LayerIcon className="w-6 h-6 text-[#0A1628]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{layer.title}</h3>
                        <p className="text-slate-600 font-light leading-relaxed">{layer.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </FadeInUp>

            <FadeInUp delay="200ms">
              <div className="bg-[#f8f9fa] rounded-3xl p-10 border border-slate-200">
                <h3 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-sora)' }}>
                  {data.architecture.principles_title || 'Non-Negotiable Principles'}
                </h3>
                <div className="space-y-6">
                  {data.architecture.principles.map((p, i) => (
                    <div key={i} className="pb-6 border-b border-slate-200 last:border-0 last:pb-0">
                      <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#E8A020] rounded-full" />
                        {p.title}
                      </h4>
                      <p className="text-slate-600 font-light pl-4">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInUp>
          </div>
        </Container>
      </section>

      {/* ── Section 6: The People ── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0A1628]">
        <Container size="xl" className="max-w-[1400px] mx-auto">
          <FadeInUp className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-sora)' }}>
              {data.team.title}
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
              {data.team.subtitle}
            </p>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {data.team.members.map((member, idx) => {
              const tagsArray = Array.isArray(member.tags)
                ? member.tags
                : (typeof member.tags === 'string' ? member.tags.split(',').map(t => t.trim()).filter(Boolean) : [])

              return (
                <FadeInUp key={idx} delay={`${idx * 100}ms`}>
                  <div className="p-10 rounded-2xl bg-[#050B14] border border-white/5 h-full hover:-translate-y-2 transition-transform duration-300 group">
                    <div className="w-14 h-14 rounded-xl mb-8 flex items-center justify-center relative overflow-hidden transition-transform duration-500 shadow-[0_0_20px_rgba(232,160,32,0.15)]" style={{ background: 'linear-gradient(135deg, rgba(232,160,32,0.2) 0%, rgba(232,160,32,0.05) 100%)', border: '1px solid rgba(232,160,32,0.3)' }}>
                      <div className="absolute inset-0 bg-[#E8A020]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="text-xl font-bold text-[#E8A020] relative z-10" style={{ fontFamily: 'var(--font-sora)' }}>
                        {member.initials}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{member.title}</h3>
                    <p className="text-neutral-400 font-light leading-relaxed mb-8">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tagsArray.map((tag, tIdx) => (
                        <span key={tIdx} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-medium text-neutral-300 uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeInUp>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── Section 7: The Bridge to .com ── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-white text-[#0A1628] border-t border-slate-100">
        <Container size="md" className="max-w-3xl mx-auto text-center">
          <FadeInUp>
            <div className="w-20 h-20 mx-auto mb-10 relative">
              <Image src={data.bridge.logoSrc || '/images/logo.png'} alt="Flowtaris" fill className="object-contain" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-balance" style={{ fontFamily: 'var(--font-sora)' }}>
              {data.bridge.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-600 mb-12 font-light leading-relaxed">
              {data.bridge.description}
            </p>
            <a
              href={data.bridge.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#0A1628] text-white rounded-sm font-bold text-[13px] uppercase tracking-widest hover:bg-[#1a2b4a] transition-colors group"
            >
              {data.bridge.ctaLabel}
              <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </FadeInUp>
        </Container>
      </section>

    </div>
  )
}