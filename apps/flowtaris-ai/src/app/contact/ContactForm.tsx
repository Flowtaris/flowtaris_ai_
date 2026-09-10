'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronDown, Send, Loader2, Globe, BarChart3, Clock, Shield, Zap, Building2 } from 'lucide-react'

// ── Default Contact Configuration ─────────────────────────────────────────────

export const DEFAULT_CONTACT_DATA = {
  hero: {
    badge: 'Response within 4 hours',
    headline_part1: "Let's start",
    headline_highlight: 'something',
    headline_part2: 'real.',
    description: "Every enterprise transformation begins with one conversation. Tell us where your finance ops hurt most — we'll show you exactly how AI removes it.",
    stats: [
      { value: '< 4 hrs', label: 'Avg Response' },
      { value: '3', label: 'Global Offices' },
      { value: '98%', label: 'CSAT Score' },
      { value: '50+', label: 'Team Members' },
    ],
    imageSrc: '/images/contact-hero.png',
    imageAlt: 'Flowtaris global AI finance reach — connecting Palo Alto, London, Singapore',
    floating_card_1: { label: 'Avg Time to Value', value: '21 Days' },
    floating_card_2: { label: 'ROI Achieved By', value: 'Day 47' },
  },
  meeting: {
    calendly_url: 'https://calendly.com/flowtaris-info',
    intent_options: [
      { value: 'calendly', label: 'Auto-Schedule a Meeting', sub: 'Instantly book a time with our enterprise architects via Calendly.', icon: '▶' },
      { value: 'message', label: 'Send a Message', sub: 'Fill out our secure inquiry form and our team will get back to you within 4 hours.', icon: '◈' }
    ]
  },
  form_options: {
    erp_platforms: 'NetSuite, Coupa, SAP S/4HANA, Workday, Oracle Fusion, Microsoft Dynamics, Multi-Platform, Not Sure',
    invoice_volumes: 'Under 10,000 / year, 10,000 – 50,000 / year, 50,000 – 100,000 / year, 100,000 – 500,000 / year, 500,000+ / year, Not Sure'
  },
  global_presence: {
    eyebrow: 'Global Presence',
    headline: 'We work all over the world.\nOne standard of service.',
    offices: [
      { region: 'North America', scope: 'HQ & AMER Operations', timezone: 'PT / ET', email: 'amer@flowtaris.com', hours: 'Follow-the-sun Support' },
      { region: 'Europe & UK', scope: 'EMEA Operations', timezone: 'GMT / CET', email: 'emea@flowtaris.com', hours: 'Follow-the-sun Support' },
      { region: 'Asia Pacific', scope: 'APAC Operations', timezone: 'SGT / AEST', email: 'apac@flowtaris.com', hours: 'Follow-the-sun Support' },
    ]
  },
  trust_signals: [
    { title: 'Data Never Leaves Your Control', body: 'SOC 2 Type II in progress. AES-256 at rest, TLS 1.3 in transit. Your data is never used to train models.' },
    { title: 'Live Production in 21 Days', body: 'Our fastest deployment was 11 days. The median is 21. No 12-month IT projects.' },
    { title: 'Built for Enterprise Scale', body: 'From 10,000 to 2M+ invoices per year. Multi-entity, multi-currency, 28 languages.' },
  ],
  faq: {
    eyebrow: 'Quick Answers',
    headline: 'Questions we get before the first call.',
    items: [
      { q: 'How quickly can I get a live demo?', a: 'Within 1–2 business days. We customise every demo to your ERP and use case — no generic slide decks.' },
      { q: 'What does implementation look like?', a: 'GenAI Document Intelligence: 3–4 weeks. Full platform: 8–12 weeks. We provide a dedicated engineer from day one.' },
      { q: 'Do you offer a proof of concept?', a: 'Yes. Qualified enterprises can run a 4-week POC on their own live data with full platform access — no synthetic demos.' },
      { q: 'How is pricing structured?', a: 'Platform subscription + usage-based processing fees. Volume discounts at 50K, 100K, and 500K+ invoices/year.' },
      { q: 'What is your security posture?', a: 'SOC 2 Type II (in progress), ISO 27001 (in progress), GDPR & CCPA compliant. AES-256 at rest, TLS 1.3 in transit. Your data is never used for model training.' },
    ]
  },
  bottom_cta: {
    headline: 'Prefer to start self-serve?',
    description: 'Take our 3-minute AI Readiness Assessment and get a personalised automation roadmap — no sales call required.',
    primary_cta: { label: 'Start Free Assessment', href: '/assessment' },
    secondary_cta: { label: 'Calculate ROI', href: '/roi-calculator' }
  }
}

// ── Animated Counter ──────────────────────────────────────────────────────────

function AnimatedStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-light text-white tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>{value}</div>
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] mt-1" style={{ color: '#E8A020' }}>{label}</div>
    </div>
  )
}

// ── Custom Select ─────────────────────────────────────────────────────────────

function CustomSelect({ options, value, onChange, placeholder }: {
  options: string[]
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(10,22,40,0.6)',
          borderColor: open ? '#E8A020' : 'rgba(255,255,255,0.1)',
          color: value ? '#fff' : 'rgba(255,255,255,0.35)',
          boxShadow: open ? '0 0 0 3px rgba(232,160,32,0.1)' : 'none',
        }}
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{ color: '#E8A020', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-xl border overflow-hidden"
          style={{ backgroundColor: '#0D1F38', borderColor: 'rgba(232,160,32,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
        >
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className="w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-150 hover:bg-white/5"
              style={{ color: value === opt ? '#E8A020' : 'rgba(255,255,255,0.8)' }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── FAQ Item ──────────────────────────────────────────────────────────────────

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border-b transition-all duration-200"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left py-6 flex items-center justify-between gap-6 group"
      >
        <span className="flex items-center gap-4">
          <span
            className="text-xs font-bold tabular-nums w-6 shrink-0"
            style={{ color: '#E8A020', fontFamily: 'Sora, sans-serif' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-white font-medium text-base leading-snug group-hover:text-white/90 transition-colors">{q}</span>
        </span>
        <ChevronDown
          className="w-5 h-5 shrink-0 transition-transform duration-300"
          style={{
            color: '#E8A020',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? '200px' : '0px', opacity: open ? 1 : 0 }}
      >
        <p className="pb-6 pl-10 text-gray-400 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

// ── Main Contact Form Component ───────────────────────────────────────────────

export default function ContactForm() {
  const [data, setData] = useState(DEFAULT_CONTACT_DATA)
  const [step, setStep] = useState<'intent' | 'details' | 'success'>('intent')
  const [selectedIntent, setSelectedIntent] = useState('')
  const [erp, setErp] = useState('')
  const [volume, setVolume] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submissionPhase, setSubmissionPhase] = useState<'idle' | 'sending' | 'on-the-way' | 'received'>('idle')
  const [fields, setFields] = useState({ firstName: '', lastName: '', email: '', company: '', message: '' })
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg?.contactConfig) {
          const cc = cfg.contactConfig
          setData({
            hero: {
              ...DEFAULT_CONTACT_DATA.hero,
              ...(cc.hero || {}),
              stats: cc.hero?.stats || DEFAULT_CONTACT_DATA.hero.stats,
              floating_card_1: { ...DEFAULT_CONTACT_DATA.hero.floating_card_1, ...(cc.hero?.floating_card_1 || {}) },
              floating_card_2: { ...DEFAULT_CONTACT_DATA.hero.floating_card_2, ...(cc.hero?.floating_card_2 || {}) },
            },
            meeting: {
              ...DEFAULT_CONTACT_DATA.meeting,
              ...(cc.meeting || {}),
              intent_options: cc.meeting?.intent_options || DEFAULT_CONTACT_DATA.meeting.intent_options
            },
            form_options: {
              ...DEFAULT_CONTACT_DATA.form_options,
              ...(cc.form_options || {})
            },
            global_presence: {
              ...DEFAULT_CONTACT_DATA.global_presence,
              ...(cc.global_presence || {}),
              offices: cc.global_presence?.offices || DEFAULT_CONTACT_DATA.global_presence.offices
            },
            trust_signals: cc.trust_signals || DEFAULT_CONTACT_DATA.trust_signals,
            faq: {
              ...DEFAULT_CONTACT_DATA.faq,
              ...(cc.faq || {}),
              items: cc.faq?.items || DEFAULT_CONTACT_DATA.faq.items
            },
            bottom_cta: {
              ...DEFAULT_CONTACT_DATA.bottom_cta,
              ...(cc.bottom_cta || {}),
              primary_cta: { ...DEFAULT_CONTACT_DATA.bottom_cta.primary_cta, ...(cc.bottom_cta?.primary_cta || {}) },
              secondary_cta: { ...DEFAULT_CONTACT_DATA.bottom_cta.secondary_cta, ...(cc.bottom_cta?.secondary_cta || {}) }
            }
          })
        }
      })
      .catch(() => {})
  }, [])

  const erpOptions = Array.isArray(data.form_options.erp_platforms)
    ? data.form_options.erp_platforms
    : (typeof data.form_options.erp_platforms === 'string'
        ? data.form_options.erp_platforms.split(',').map(s => s.trim()).filter(Boolean)
        : ['NetSuite', 'Coupa', 'SAP S/4HANA', 'Workday', 'Multi-Platform', 'Not Sure'])

  const volumeOptions = Array.isArray(data.form_options.invoice_volumes)
    ? data.form_options.invoice_volumes
    : (typeof data.form_options.invoice_volumes === 'string'
        ? data.form_options.invoice_volumes.split(',').map(s => s.trim()).filter(Boolean)
        : ['Under 10,000 / year', '10,000 – 50,000 / year', '50,000 – 100,000 / year', '100,000 – 500,000 / year', '500,000+ / year', 'Not Sure'])

  const handleIntentSelect = (value: string) => {
    setSelectedIntent(value)
    if (value === 'calendly') {
      window.open(data.meeting.calendly_url || 'https://calendly.com/flowtaris-info', '_blank')
    } else {
      setTimeout(() => {
        setStep('details')
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmissionPhase('sending')
    await new Promise(r => setTimeout(r, 600))
    setSubmissionPhase('on-the-way')
    await new Promise(r => setTimeout(r, 800))
    setSubmissionPhase('received')
    await new Promise(r => setTimeout(r, 400))
    setSubmitting(false)
    setSubmissionPhase('idle')
    setStep('success')
  }

  const handleReset = () => {
    setStep('intent')
    setSelectedIntent('')
    setErp('')
    setVolume('')
    setFields({ firstName: '', lastName: '', email: '', company: '', message: '' })
  }

  return (
    <div style={{ backgroundColor: '#080F1C', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '92vh' }}>
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[70%] h-full"
            style={{ background: 'radial-gradient(ellipse 80% 70% at 80% 20%, rgba(232,160,32,0.07) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-[50%] h-[60%]"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 20% 90%, rgba(75,159,225,0.06) 0%, transparent 70%)' }} />
        </div>

        {/* Thin grid lines */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20 grid lg:grid-cols-2 gap-16 items-center min-h-[92vh]">
          {/* Left — Text */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-[0.2em]"
              style={{ borderColor: 'rgba(232,160,32,0.25)', backgroundColor: 'rgba(232,160,32,0.06)', color: '#E8A020' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {data.hero.badge}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.04] tracking-tight mb-8"
              style={{ fontFamily: 'Sora, sans-serif' }}>
              {data.hero.headline_part1}<br />
              <span style={{ color: '#E8A020' }}>{data.hero.headline_highlight}</span><br />
              {data.hero.headline_part2}
            </h1>

            <p className="text-lg text-gray-400 font-light leading-relaxed mb-14 max-w-lg">
              {data.hero.description}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-10 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {data.hero.stats.map((st, idx) => (
                <div key={idx} className="flex items-center gap-10">
                  <AnimatedStat value={st.value} label={st.label} />
                  {idx < data.hero.stats.length - 1 && <div className="w-px h-10 bg-white/10" />}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Hero Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[540px] aspect-square rounded-3xl overflow-hidden"
              style={{ border: '1px solid rgba(232,160,32,0.12)', boxShadow: '0 0 80px rgba(232,160,32,0.06), inset 0 0 40px rgba(10,22,40,0.4)' }}>
              <Image
                src={data.hero.imageSrc || '/images/contact-hero.png'}
                alt={data.hero.imageAlt || 'Flowtaris global AI finance reach'}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(8,15,28,0.1) 0%, transparent 60%, rgba(8,15,28,0.3) 100%)' }} />
            </div>

            {/* Floating accent cards */}
            <div className="absolute -left-6 top-[20%] px-4 py-3 rounded-xl border backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(8,15,28,0.9)', borderColor: 'rgba(232,160,32,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#E8A020' }}>
                {data.hero.floating_card_1.label}
              </div>
              <div className="text-white font-semibold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>
                {data.hero.floating_card_1.value}
              </div>
            </div>
            <div className="absolute -right-4 bottom-[25%] px-4 py-3 rounded-xl border backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(8,15,28,0.9)', borderColor: 'rgba(75,159,225,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#4B9FE1' }}>
                {data.hero.floating_card_2.label}
              </div>
              <div className="text-white font-semibold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>
                {data.hero.floating_card_2.value}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-white to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
        </div>
      </section>

      {/* ── INTENT SELECTOR ──────────────────────────────────────────────────── */}
      <section className="py-28 px-6" id="contact-form" ref={formRef}>
        <div className="max-w-5xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-6">
            {['intent', 'details', 'success'].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                  style={{
                    backgroundColor: step === s ? '#E8A020' : (
                      (step === 'details' && i === 0) || step === 'success' ? 'rgba(232,160,32,0.15)' : 'rgba(255,255,255,0.05)'
                    ),
                    color: step === s ? '#080F1C' : (
                      (step === 'details' && i === 0) || step === 'success' ? '#E8A020' : 'rgba(255,255,255,0.3)'
                    ),
                    border: '1px solid ' + (step === s ? '#E8A020' : 'rgba(255,255,255,0.1)'),
                  }}
                >
                  {((step === 'details' && i === 0) || step === 'success') ? '✓' : i + 1}
                </div>
                <span className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: step === s ? '#E8A020' : 'rgba(255,255,255,0.25)' }}>
                  {s === 'intent' ? 'Purpose' : s === 'details' ? 'Details' : 'Done'}
                </span>
                {i < 2 && <div className="w-8 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />}
              </div>
            ))}
          </div>

          {/* STEP 1 — Intent */}
          {step === 'intent' && (
            <div
              style={{
                animation: 'fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
              }}
            >
              <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                What brings you here?
              </h2>
              <p className="text-gray-400 text-lg font-light mb-14 max-w-xl">
                Choose the closest match and we&apos;ll route you to the right team immediately.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {data.meeting.intent_options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleIntentSelect(opt.value)}
                    className="group text-left p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                    style={{
                      backgroundColor: selectedIntent === opt.value ? 'rgba(232,160,32,0.08)' : 'rgba(13,31,56,0.5)',
                      borderColor: selectedIntent === opt.value ? '#E8A020' : 'rgba(255,255,255,0.07)',
                      boxShadow: selectedIntent === opt.value ? '0 0 30px rgba(232,160,32,0.1)' : 'none',
                    }}
                  >
                    <div
                      className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ backgroundColor: 'rgba(232,160,32,0.08)' }}
                    />
                    <div className="text-2xl mb-4" style={{ color: '#E8A020' }}>{opt.icon}</div>
                    <div className="text-white font-semibold mb-1.5">{opt.label}</div>
                    <div className="text-xs text-gray-500 font-light leading-relaxed">{opt.sub}</div>
                    <div
                      className="mt-5 text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-all duration-200 group-hover:gap-2"
                      style={{ color: '#E8A020' }}
                    >
                      Select <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Details form */}
          {step === 'details' && (
            <div style={{ animation: 'fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
              <div className="flex items-center gap-4 mb-10">
                <button
                  onClick={() => setStep('intent')}
                  className="text-sm font-medium flex items-center gap-2 transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  ← Back
                </button>
                <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{ backgroundColor: 'rgba(232,160,32,0.1)', color: '#E8A020' }}>
                  {data.meeting.intent_options.find(o => o.value === selectedIntent)?.label}
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-semibold text-white mb-3 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                Tell us about yourself.
              </h2>
              <p className="text-gray-400 text-lg font-light mb-12">
                We need just a few details to personalise your experience.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name row */}
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    { id: 'firstName', label: 'First Name', placeholder: 'Alex', key: 'firstName' as const },
                    { id: 'lastName', label: 'Last Name', placeholder: 'Smith', key: 'lastName' as const },
                  ].map(({ id, label, placeholder, key }) => (
                    <div key={id}>
                      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest mb-2.5"
                        style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {label} <span style={{ color: '#E8A020' }}>*</span>
                      </label>
                      <input
                        id={id}
                        name={id}
                        type="text"
                        placeholder={placeholder}
                        required
                        value={fields[key]}
                        onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-4 py-3.5 rounded-xl text-sm font-medium text-white placeholder-white/20 outline-none transition-all duration-200 border"
                        style={{
                          backgroundColor: 'rgba(10,22,40,0.6)',
                          borderColor: 'rgba(255,255,255,0.1)',
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = '#E8A020'
                          e.target.style.boxShadow = '0 0 0 3px rgba(232,160,32,0.1)'
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                          e.target.style.boxShadow = 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Email + Company */}
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    { id: 'email', label: 'Work Email', placeholder: 'alex@flowtaris.com', type: 'email', key: 'email' as const },
                    { id: 'company', label: 'Company', placeholder: 'Flowtaris', type: 'text', key: 'company' as const },
                  ].map(({ id, label, placeholder, type, key }) => (
                    <div key={id}>
                      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest mb-2.5"
                        style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {label} <span style={{ color: '#E8A020' }}>*</span>
                      </label>
                      <input
                        id={id}
                        name={id}
                        type={type}
                        placeholder={placeholder}
                        required
                        value={fields[key]}
                        onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-4 py-3.5 rounded-xl text-sm font-medium text-white placeholder-white/20 outline-none transition-all duration-200 border"
                        style={{ backgroundColor: 'rgba(10,22,40,0.6)', borderColor: 'rgba(255,255,255,0.1)' }}
                        onFocus={e => {
                          e.target.style.borderColor = '#E8A020'
                          e.target.style.boxShadow = '0 0 0 3px rgba(232,160,32,0.1)'
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                          e.target.style.boxShadow = 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* ERP + Volume */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2.5"
                      style={{ color: 'rgba(255,255,255,0.4)' }}>Primary ERP Platform</label>
                    <CustomSelect
                      options={erpOptions}
                      value={erp}
                      onChange={setErp}
                      placeholder="Select your ERP…"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2.5"
                      style={{ color: 'rgba(255,255,255,0.4)' }}>Annual Invoice Volume</label>
                    <CustomSelect
                      options={volumeOptions}
                      value={volume}
                      onChange={setVolume}
                      placeholder="Select volume…"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest mb-2.5"
                    style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Message <span style={{ color: '#E8A020' }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Describe your biggest finance ops challenge — where the bottleneck is, your ERP environment, and what success looks like for your team…"
                    value={fields.message}
                    onChange={e => setFields(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl text-sm font-medium text-white placeholder-white/20 outline-none transition-all duration-200 resize-y border"
                    style={{ backgroundColor: 'rgba(10,22,40,0.6)', borderColor: 'rgba(255,255,255,0.1)', minHeight: '130px' }}
                    onFocus={e => {
                      e.target.style.borderColor = '#E8A020'
                      e.target.style.boxShadow = '0 0 0 3px rgba(232,160,32,0.1)'
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Privacy */}
                <div className="flex items-start gap-3 p-4 rounded-xl border"
                  style={{ backgroundColor: 'rgba(232,160,32,0.04)', borderColor: 'rgba(232,160,32,0.15)' }}>
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#E8A020' }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    By submitting you agree to our{' '}
                    <Link href="/privacy" className="underline transition-colors hover:text-white/80">Privacy Policy</Link>.
                    {' '}Your data is encrypted, never shared, never used for model training.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-semibold text-base transition-all duration-300 overflow-hidden disabled:opacity-70"
                  style={{
                    backgroundColor: '#E8A020',
                    color: '#080F1C',
                    boxShadow: submitting ? 'none' : '0 0 40px rgba(232,160,32,0.3)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {submitting ? (
                      <>
                        {submissionPhase !== 'received' ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        {submissionPhase === 'sending' ? 'Sending...' :
                         submissionPhase === 'on-the-way' ? 'On the way...' : 'Received!'}
                      </>
                    ) : (
                      <><Send className="w-5 h-5" /> Send Message</>
                    )}
                  </span>
                  {!submitting && (
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3 — Success */}
          {step === 'success' && (
            <div
              className="text-center py-20"
              style={{ animation: 'fadeSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10"
                style={{ backgroundColor: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.3)' }}
              >
                <CheckCircle2 className="w-12 h-12" style={{ color: '#E8A020' }} />
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold text-white mb-5 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                Message received.
              </h2>
              <p className="text-gray-400 text-lg font-light mb-3 max-w-md mx-auto">
                Our team typically responds within <span className="text-white font-medium">{data.hero.badge || '4 business hours'}</span>.
                {fields.email && (
                  <> Expect a reply at <span className="text-white font-medium">{fields.email}</span>.</>
                )}
              </p>
              <p className="text-gray-600 text-sm mb-14">
                While you wait — explore how other enterprises achieved ROI in 47 days.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/case-studies"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
                  style={{ backgroundColor: '#E8A020', color: '#080F1C' }}
                >
                  Read Case Studies <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm border transition-all duration-200 hover:bg-white/5"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                >
                  Send Another Message
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── GLOBAL PRESENCE ─────────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: '#E8A020' }}>
            {data.global_presence.eyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-16 leading-tight whitespace-pre-line" style={{ fontFamily: 'Sora, sans-serif' }}>
            {data.global_presence.headline}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {data.global_presence.offices.map(office => (
              <div
                key={office.region}
                className="group p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                style={{
                  backgroundColor: 'rgba(13,31,56,0.4)',
                  borderColor: 'rgba(255,255,255,0.07)',
                }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: 'rgba(232,160,32,0.06)' }}
                />
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-5 h-5" style={{ color: '#E8A020' }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#E8A020' }}>
                    {office.timezone}
                  </span>
                </div>
                <div className="text-2xl font-semibold text-white mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {office.region}
                </div>
                <div className="text-sm text-gray-500 mb-6">{office.scope}</div>
                <div className="space-y-2 text-sm">
                  <a
                    href={`mailto:${office.email}`}
                    className="flex items-center gap-2 font-medium transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {office.email}
                  </a>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-3.5 h-3.5" />
                    {office.hours}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {data.trust_signals.map((card, idx) => {
              const icons = [Shield, Zap, Building2]
              const IconComp = icons[idx % icons.length]
              return (
                <div
                  key={card.title}
                  className="p-8 rounded-2xl border"
                  style={{ backgroundColor: 'rgba(13,31,56,0.3)', borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <div className="mb-5" style={{ color: '#E8A020' }}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="text-white font-semibold mb-2 text-lg leading-snug">{card.title}</div>
                  <div className="text-gray-500 text-sm leading-relaxed font-light">{card.body}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: '#E8A020' }}>
            {data.faq.eyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-16 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
            {data.faq.headline}
          </h2>
          <div>
            {data.faq.items.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,160,32,0.05) 0%, transparent 70%)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
            {data.bottom_cta.headline}
          </h2>
          <p className="text-gray-400 text-lg font-light mb-14 max-w-xl mx-auto">
            {data.bottom_cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href={data.bottom_cta.primary_cta.href}
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02]"
              style={{ backgroundColor: '#E8A020', color: '#080F1C', boxShadow: '0 0 40px rgba(232,160,32,0.25)' }}
            >
              {data.bottom_cta.primary_cta.label} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href={data.bottom_cta.secondary_cta.href}
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl font-semibold text-lg border transition-all duration-300 hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
            >
              <BarChart3 className="w-5 h-5" /> {data.bottom_cta.secondary_cta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}