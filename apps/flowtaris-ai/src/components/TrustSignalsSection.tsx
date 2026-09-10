'use client'

import { useEffect, useState } from 'react'

type TrustSignal = {
  id: string
  label: string
  value: string
  imageUrl?: string | null
}

export default function TrustSignalsSection() {
  const [signals, setSignals] = useState<TrustSignal[]>([])
  const [sectionConfig, setSectionConfig] = useState({ title: 'Enterprise-Grade Compliance & Reliability', bg_image: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSignals() {
      try {
        const res = await fetch('/api/site-config')
        const data = await res.json()
        if (data.trustSignals && Array.isArray(data.trustSignals)) {
          setSignals(data.trustSignals)
        }
        if (data.heroConfig?.trust_signals_section) {
          setSectionConfig({ ...sectionConfig, ...data.heroConfig.trust_signals_section })
        }
      } catch (err) {
        console.error('Failed to fetch trust signals', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSignals()
  }, [])

  if (loading || signals.length === 0) return null

  // Duplicate for seamless infinite scroll
  const duplicatedSignals = [...signals, ...signals, ...signals]

  return (
    <section 
      className="relative w-full overflow-hidden border-t border-b border-white/[0.05] bg-[#030308] py-16"
      style={sectionConfig.bg_image ? {
        backgroundImage: `url('${sectionConfig.bg_image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
      aria-label="Trust and Compliance Signals"
    >
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .animate-scroll {
          display: flex;
          width: fit-content;
          animation: scroll-left 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(212, 168, 71, 0.25);
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(212, 168, 71, 0.6);
          transform: translateY(-4px);
          box-shadow: 0 10px 30px -10px rgba(212, 168, 71, 0.3);
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {sectionConfig.bg_image && <div className="absolute inset-0 bg-black/60" />}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#D4A847]/[0.03] blur-[80px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-10 text-center relative z-10">
        <p className="text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase font-['Inter']">
          {sectionConfig.title}
        </p>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-scroll flex gap-6 px-4">
          {duplicatedSignals.map((signal, i) => (
            <div 
              key={`${signal.id}-${i}`} 
              className="glass-card flex items-center gap-5 px-7 py-5 rounded-2xl min-w-[240px] shrink-0 cursor-default"
            >
              {signal.imageUrl ? (
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center p-2.5 shrink-0 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={signal.imageUrl} alt={signal.value} className="w-full h-full object-contain filter drop-shadow-lg" />
                </div>
              ) : (
                <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#f5d98c] to-[#b3852b] shrink-0" />
              )}
              
              <div className="flex flex-col justify-center">
                <span className="text-[22px] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 font-['Space_Grotesk'] leading-tight">
                  {signal.value}
                </span>
                <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#D4A847] mt-0.5 font-['Inter']">
                  {signal.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
