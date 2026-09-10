'use client'

import { useState, useEffect } from 'react'
import { Container, Badge, Button, Input } from '@repo/ui'
import { ArrowRight, BookOpen, Clock, Activity, Zap, ShieldAlert, Cpu } from 'lucide-react'

export default function InsightsClient({ insights, categories, heroConfig }: { insights: any[], categories: string[], heroConfig?: any }) {
  const [activeCategory, setActiveCategory] = useState(categories[1] || 'Research')

  // Filter out empty categories
  const validCategories = categories.filter(c => c !== 'All' && insights.some(i => i.category === c))

  // Group insights by category
  const groupedInsights = validCategories.map(category => ({
    category,
    items: insights.filter(i => i.category === category)
  }))

  useEffect(() => {
    const handleScroll = () => {
      const sections = validCategories.map(c => document.getElementById(`section-${c}`))
      const scrollPosition = window.scrollY + 300 // Offset for fixed header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(validCategories[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [validCategories])

  const scrollToSection = (e: React.MouseEvent<HTMLButtonElement>, category: string) => {
    e.preventDefault()
    const elem = document.getElementById(`section-${category}`)
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveCategory(category)
    }
  }

  const scrollToResearch = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const elem = document.getElementById(`section-${validCategories[0]}`)
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full bg-[#0B0F19]">
      
      {/* 1. HERO SECTION (Dark Neo-Brutalist) */}
      <section className="relative w-full pt-32 pb-24 overflow-hidden border-b-2 border-white/10">
        {/* Subtle background glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#c084fc] blur-[150px] opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-[#38bdf8] blur-[150px] opacity-20" />

        <Container size="xl" className="relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-6 lg:pr-8">
              <div className="mb-6 inline-flex items-center rounded-none border border-[#c084fc] bg-[#c084fc]/10 px-4 py-1.5 text-sm font-bold text-[#c084fc] shadow-[4px_4px_0px_#c084fc] transition-transform hover:-translate-y-0.5 uppercase tracking-widest">
                {heroConfig?.badgeText || 'Strategic Insights for Finance Leaders'}
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                {heroConfig?.titleLine1 || 'Empower Your'} <br />
                <span className="text-[#38bdf8] drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                  {heroConfig?.titleLine2 || 'Financial Strategy'}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-400 font-medium mb-8 max-w-lg leading-relaxed whitespace-pre-wrap">
                {heroConfig?.subtitle || 'Explore original research, benchmark data, and proven methodologies to navigate AI adoption and automation in enterprise finance.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-[#c084fc] hover:bg-[#a855f7] text-white border-2 border-white rounded-none px-8 shadow-[4px_4px_0px_#fff] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none" asChild>
                  <a href={heroConfig?.primaryBtnLink || '/assessment'} className="inline-flex items-center whitespace-nowrap">
                    {heroConfig?.primaryBtnText || 'Take the Diagnostic'}
                    <ArrowRight className="ml-2 h-5 w-5 shrink-0" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-2 border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8]/10 rounded-none px-8 shadow-[4px_4px_0px_#38bdf8] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none" onClick={heroConfig?.secondaryBtnLink?.startsWith('#') ? scrollToResearch : undefined} asChild>
                  <a href={heroConfig?.secondaryBtnLink || '#research'} className="inline-flex items-center whitespace-nowrap">
                    {heroConfig?.secondaryBtnText || 'Explore Research'}
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column: Complex Animated Dashboard UI */}
            <div className="lg:col-span-6 relative h-[450px] sm:h-[550px] w-full flex items-center justify-center">
              <div className="relative w-full max-w-[550px] aspect-square">
                
                {/* Back Layer: Grid */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 border-2 border-[#c084fc]/30 rounded-3xl" />
                
                {/* Layer 1: Processing Bar */}
                <div className="absolute top-10 right-10 w-64 bg-[#0B0F19] border-2 border-[#38bdf8] p-4 rounded-xl shadow-[6px_6px_0px_#38bdf8] z-10 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">AI Processing</span>
                    <Activity className="h-4 w-4 text-[#38bdf8]" />
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#38bdf8] animate-[pulse_2s_ease-in-out_infinite] w-[85%]" />
                  </div>
                  <p className="text-right text-[#38bdf8] text-xs font-bold mt-2">85% Automated</p>
                </div>

                {/* Layer 2: Main Widget */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white border-2 border-white p-6 rounded-2xl shadow-[8px_8px_0px_#c084fc] z-20 hover:scale-105 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#c084fc] rounded-lg flex items-center justify-center animate-pulse">
                      <Cpu className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-black font-black text-lg leading-tight">Flowtaris Engine</h4>
                      <p className="text-neutral-500 text-sm font-bold">Neural Extraction Active</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" style={{ animationDelay: `${i * 0.2}s` }} />
                        <div className="h-3 bg-neutral-200 rounded w-full overflow-hidden">
                          <div className="h-full bg-[#c084fc]" style={{ width: `${90 - i * 15}%`, transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Layer 3: Security Badge */}
                <div className="absolute bottom-12 left-8 bg-[#0B0F19] border-2 border-[#c084fc] px-5 py-3 rounded-xl shadow-[4px_4px_0px_#c084fc] z-30 flex items-center gap-3 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <ShieldAlert className="h-5 w-5 text-[#c084fc]" />
                  <span className="text-white font-bold tracking-wider text-sm">EU AI ACT COMPLIANT</span>
                </div>

                {/* Layer 4: Speed Metric */}
                <div className="absolute bottom-24 right-4 bg-[#38bdf8] border-2 border-white px-5 py-4 rounded-full shadow-[6px_6px_0px_#fff] z-30 flex flex-col items-center justify-center animate-[bounce_4s_infinite]">
                  <span className="text-black font-black text-2xl tracking-tighter">0.3s</span>
                  <span className="text-black/80 font-bold text-[10px] uppercase">Latency</span>
                </div>

              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. SCROLLSPY FEED LAYOUT */}
      <main className="flex-1 w-full relative">
        <section className="py-24 px-6">
          <Container size="xl">
            <div className="flex flex-col lg:flex-row gap-16">
              
              {/* ScrollSpy Sidebar */}
              <aside className="w-full lg:w-1/4">
                <div className="sticky top-32">
                  <h3 className="text-xl font-black text-white mb-6 border-b-2 border-white/20 pb-4 uppercase tracking-widest">Contents</h3>
                  <div className="flex flex-col gap-3 border-l border-white/10 pl-4">
                    {validCategories.map((category) => (
                      <button 
                        key={category}
                        onClick={(e) => scrollToSection(e, category)}
                        className={`text-left py-2 transition-all duration-300 font-bold border-l-2 -ml-[17px] pl-4 ${
                          activeCategory === category 
                          ? 'text-[#c084fc] border-[#c084fc]' 
                          : 'text-neutral-500 border-transparent hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Grouped Article Feed */}
              <div className="w-full lg:w-3/4 flex flex-col gap-24">
                {groupedInsights.map(({ category, items }) => (
                  <div key={category} id={`section-${category}`} className="scroll-mt-32">
                    <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                      <span className="text-[#38bdf8]">/</span> {category}
                    </h2>
                    <div className="flex flex-col gap-8">
                      {items.map((insight: any) => (
                        <article key={insight.slug} className="group relative bg-[#111827] border-2 border-white/10 rounded-2xl shadow-xl transition-all duration-300 hover:border-[#c084fc] hover:shadow-[8px_8px_0px_#c084fc] hover:-translate-y-1 overflow-hidden">
                          {/* Hero image thumbnail */}
                          {insight.image && (
                            <div className="w-full h-48 overflow-hidden border-b-2 border-white/10">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={insight.image}
                                alt={insight.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <a href={`/insights/${insight.slug}`} className="flex flex-col p-8 h-full w-full outline-none">
                            <div className="flex items-start justify-between mb-4">
                              <div className="inline-flex items-center bg-[#c084fc]/10 px-3 py-1 text-xs font-bold text-[#c084fc] uppercase tracking-wider rounded-sm">
                                {insight.category}
                              </div>
                              <span className="text-sm font-bold text-neutral-400 flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {insight.readTime}
                              </span>
                            </div>

                            <div className="block mb-4">
                              <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-[#c084fc] transition-colors leading-snug">
                                {insight.title}
                              </h3>
                            </div>

                            <p className="text-neutral-400 font-medium text-lg leading-relaxed mb-6 max-w-3xl flex-1">
                              {insight.excerpt}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                              <div className="flex items-center gap-2 text-sm font-bold text-neutral-300">
                                <BookOpen className="h-4 w-4 text-[#38bdf8]" />
                                <span>{insight.author}</span>
                                <span className="mx-2 text-neutral-600">•</span>
                                <span className="text-neutral-500">{new Date(insight.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                              
                              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#111827] border-2 border-white/20 text-white group-hover:bg-[#c084fc] group-hover:border-[#c084fc] group-hover:text-white transition-all shadow-lg group-hover:shadow-[4px_4px_0px_#38bdf8]">
                                <ArrowRight className="h-5 w-5" />
                              </div>
                            </div>
                          </a>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </Container>
        </section>

        {/* Neo-Brutalist Newsletter CTA */}
        <section className="pb-24 px-6">
          <Container size="xl">
            <div className="bg-[#c084fc] border-4 border-white rounded-none p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[12px_12px_0px_rgba(255,255,255,1)]">
              <div className="max-w-xl">
                <h3 className="text-3xl font-black text-black mb-4">Subscribe to our Research</h3>
                <p className="text-black/80 font-bold text-lg">Get the latest benchmarks and guides delivered directly to your inbox. Designed for finance leaders.</p>
              </div>
              <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
                <Input type="email" placeholder="cfo@company.com" className="bg-[#0B0F19] border-2 border-black text-white font-bold placeholder-neutral-500 focus:ring-0 focus:border-white w-full md:w-64 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-none" />
                <Button className="bg-white text-black hover:bg-neutral-200 border-2 border-black w-full sm:w-auto shadow-[4px_4px_0px_rgba(0,0,0,1)] font-black uppercase tracking-wider rounded-none transition-transform hover:-translate-y-0.5">Subscribe</Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  )
}
