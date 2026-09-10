'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// Average enterprise loses ~$280,000/year to manual finance ops
// That's ~$8.87/second. We start at a random offset so it feels "live" not "fresh"
const RATE_PER_SECOND = 8.87
const RANDOM_START_OFFSET = Math.floor(Math.random() * 4800) + 600 // 600–5400 already "lost"

function formatMoney(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const DEFAULT_COST_CONFIG = {
  eyebrow: 'Cost of Manual Finance Operations Since You Opened This Page',
  ratePerSecond: 8.87,
  industryAverageLabel: 'based on industry average of $280K/year',
  headline: 'Every quarter you delay costs more than our annual contract.',
  subheadline: 'Flowtaris customers stop the bleed in under 60 days.',
  primaryCtaLabel: 'Calculate my actual loss',
  primaryCtaUrl: '/roi-calculator',
  secondaryCtaLabel: 'Start eliminating it',
  secondaryCtaUrl: '/assessment',
}

export default function CtaCostSection() {
  const [seconds, setSeconds] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [config, setConfig] = useState(DEFAULT_COST_CONFIG)
  const sectionRef = useRef<HTMLElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetch('/api/site-config')
      .then(res => res.json())
      .then(data => {
        if (data.costSectionConfig) {
          setConfig(prev => ({ ...prev, ...data.costSectionConfig }))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
          setVisible(true)
        }
      },
      { threshold: 0.4 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [hasStarted])

  const rateToUse = Number(config.ratePerSecond) || 8.87
  const totalLost = RANDOM_START_OFFSET + Math.floor(seconds * rateToUse)

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '120px 24px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
      aria-labelledby="cta-heading"
    >
      {/* Subtle ambient glow — deep amber for "cost/urgency" */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(245,158,11,0.06) 0%, transparent 70%)',
      }} />

      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>

        {/* Eyebrow */}
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(245,158,11,0.7)',
          fontFamily: "'Inter', sans-serif",
          marginBottom: 40,
        }}>
          {config.eyebrow}
        </p>

        {/* The Counter — the hero of this section */}
        <div
          aria-label={`$${formatMoney(totalLost)} lost`}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(64px, 10vw, 120px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: '#f59e0b',
            marginBottom: 24,
            tabularNums: 'tabular-nums',
            fontVariantNumeric: 'tabular-nums',
          } as React.CSSProperties}
        >
          ${formatMoney(totalLost)}
        </div>

        {/* Sub-counter: per-second rate */}
        <p style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.25)',
          fontFamily: 'monospace',
          marginBottom: 56,
          letterSpacing: '0.02em'
        }}>
          +${rateToUse.toFixed(2)} every second · {config.industryAverageLabel}
        </p>

        {/* Main statement */}
        <h2 id="cta-heading" style={{
          fontSize: 'clamp(24px, 3.5vw, 38px)',
          fontWeight: 800,
          color: '#ffffff',
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          marginBottom: 16,
          maxWidth: 680,
          margin: '0 auto 16px',
        }}>
          {config.headline}
        </h2>

        <p style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.38)',
          fontFamily: "'Inter', sans-serif",
          marginBottom: 56,
          lineHeight: 1.6,
        }}>
          {config.subheadline}
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={config.primaryCtaUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '18px 40px',
              borderRadius: 99,
              background: '#f59e0b',
              color: '#0a0a0f',
              fontWeight: 800,
              fontSize: 15,
              textDecoration: 'none',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.01em',
              boxShadow: '0 8px 32px rgba(245, 158, 11, 0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(245, 158, 11, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(245, 158, 11, 0.35)'
            }}
          >
            {config.primaryCtaLabel}
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <Link
            href={config.secondaryCtaUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '18px 40px',
              borderRadius: 99,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.75)',
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
            }}
          >
            {config.secondaryCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}