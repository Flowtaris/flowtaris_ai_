'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const DEFAULT_HERO = {
  bg_image: '/images/hero-bg.png',
  eyebrow: 'The Future of Enterprise Finance',
  headline_1: 'The Intelligence Layer for',
  headline_2: 'Enterprise Finance.',
  body: 'Watch autonomous AI agents read, decide, and act inside your ERP in real-time. Experience zero-touch document intelligence, self-healing workflows, and predictive analytics that eliminate manual effort.',
  primary_cta: { label: 'Start Your Journey', href: '/assessment' },
  secondary_cta: { label: 'Calculate ROI', href: '/roi-calculator' }
}

// P1 #1 — Removed unsupported corporate-scale figures (200+ customers, 95% automation, $50M+ savings).
// Replaced with capability-led, evidence-safe language per the Required Changes Report.
const DEFAULT_STATS = [
  { value: 'Enterprise', label: 'Grade Platform' },
  { value: 'Finance',    label: 'Focused AI' },
  { value: 'ERP-Native', label: 'Architecture' },
  { value: '4',          label: 'ERP Platforms' },
]

function TypingText({ text, delay = 0, speed = 40 }: { text: string, delay?: number, speed?: number }) {
  const [displayedText, setDisplayedText] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(intervalId)
    }, speed)
    return () => clearInterval(intervalId)
  }, [text, speed, started])

  return (
    <>
      {displayedText}
      <span className={`inline-block w-[3px] h-[1em] ml-1 bg-[#D4A847] align-middle ${displayedText.length === text.length ? 'animate-pulse' : ''}`} style={{ animationDuration: '1s' }} />
    </>
  )
}

export function HomeHero() {
  const [hero, setHero] = useState(DEFAULT_HERO)
  const [stats, setStats] = useState(DEFAULT_STATS)

  useEffect(() => {
    fetch('/api/site-config')
      .then(res => res.json())
      .then(data => {
        if (data?.heroConfig) {
          if (data.heroConfig.hero) setHero({ ...DEFAULT_HERO, ...data.heroConfig.hero })
          if (data.heroConfig.stats) setStats(data.heroConfig.stats)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <>
      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
        
        .hh-fade { opacity: 0; animation: hero-fade-up 1s cubic-bezier(0.22,1,0.36,1) forwards; }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 2.5s; } /* Waits for typing to finish */
        .delay-3 { animation-delay: 2.7s; }
        .delay-4 { animation-delay: 2.9s; }

        .hh-cta-primary:hover  { transform: translateY(-2px); box-shadow: 0 0 50px rgba(212,168,71,0.55), 0 8px 30px rgba(0,0,0,0.5) !important; }
        .hh-cta-secondary:hover { transform: translateY(-2px); background: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.35) !important; }
        .hh-cta-primary, .hh-cta-secondary { transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease; }
      `}</style>

      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '120px 24px 80px',
          background: 'transparent',
        }}
        aria-label="Flowtaris AI Hero"
      >
        {/* ── Background: Floating UI mockup image ── */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {/* High opacity background image for maximum visibility - using Next.js Image for LCP optimization */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <Image 
              src={hero.bg_image} 
              alt="Hero Background" 
              fill 
              priority
              quality={85}
              sizes="100vw"
              className="object-cover object-center opacity-90"
              style={{ filter: 'contrast(1.1) brightness(1.3)' }}
            />
          </div>

          {/* Minimal dark overlay mainly at top/bottom for text/nav contrast */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(13,11,20,0.9) 0%, rgba(13,11,20,0.1) 30%, rgba(13,11,20,0.1) 70%, rgba(13,11,20,0.95) 100%)',
          }} />

          {/* Center radial glow behind the main text */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%', height: '80%',
            background: 'radial-gradient(circle, rgba(13,11,20,0.5) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
        </div>

        {/* ── Main Content: Unified single column ── */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 900, margin: '0 auto',
          textAlign: 'center',
        }}>

          {/* Label */}
          <div className="hh-fade delay-1" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 32,
            fontSize: 13, fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            <span style={{ 
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', 
              height: 1, width: 40 
            }} />
            <span>{hero.eyebrow}</span>
            <span style={{ 
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', 
              height: 1, width: 40 
            }} />
          </div>

          {/* Headline with Typing Effect */}
          <h1 style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em',
            margin: '0 0 28px',
            textShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}>
            <div className="hh-fade delay-1" style={{ color: 'white' }}>
              {hero.headline_1}
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #f5d98c 0%, #D4A847 50%, #b3852b 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              minHeight: '1.1em', // prevents layout shift while typing
            }}>
              <TypingText text={hero.headline_2} delay={800} speed={60} />
            </div>
          </h1>

          <p className="hh-fade delay-2" style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.7, fontWeight: 400,
            maxWidth: 680, margin: '0 auto 48px',
            fontFamily: "'Inter', system-ui, sans-serif",
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}>
            {hero.body}
          </p>

          {/* CTAs */}
          <div className="hh-fade delay-3" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href={hero.primary_cta.href}
              className="hh-cta-primary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '16px 36px', borderRadius: 99,
                background: 'linear-gradient(135deg, #D4A847 0%, #b3852b 100%)',
                color: '#05050a',
                fontWeight: 700, fontSize: 16, textDecoration: 'none',
                boxShadow: '0 0 30px rgba(212,168,71,0.35), 0 4px 20px rgba(0,0,0,0.4)',
                letterSpacing: '-0.01em',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {hero.primary_cta.label}
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href={hero.secondary_cta.href}
              className="hh-cta-secondary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '16px 36px', borderRadius: 99,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#ffffff',
                fontWeight: 600, fontSize: 16, textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                letterSpacing: '-0.01em',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {hero.secondary_cta.label}
            </a>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="hh-fade delay-4" style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 1000, margin: '64px auto 0',
        }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '1px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, overflow: 'hidden',
            backdropFilter: 'blur(16px)',
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                flex: '1 1 120px', textAlign: 'center',
                padding: '24px',
                background: 'rgba(5,5,10,0.4)',
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800,
                  background: 'linear-gradient(135deg, #ffffff, #D4A847)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  letterSpacing: '-0.03em', lineHeight: 1.1,
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}>{s.value}</div>
                <div style={{
                  fontSize: 10, color: 'rgba(255,255,255,0.5)',
                  fontWeight: 600, marginTop: 6,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scroll indicator ── */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 32, left: '50%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.14em',
          fontFamily: "'Inter', system-ui, sans-serif",
          animation: 'hero-bounce 2.2s ease-in-out infinite',
        }}>
          <span>SCROLL</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v14M4 11l6 6 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>
    </>
  )
}
