import Link from 'next/link'
import { Metadata } from 'next'
import { Home, Search, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: '404 — Page Not Found | Flowtaris AI',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  const links = [
    { label: 'Assessment', href: '/assessment', desc: 'Get your AI readiness score' },
    { label: 'Case Studies', href: '/case-studies', desc: 'See customer outcomes' },
    { label: 'Contact', href: '/contact', desc: 'Talk to our team' },
  ]

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-24"
      style={{ background: 'linear-gradient(180deg, #050508 0%, #0a0b12 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(99,102,241,0.07), transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] mb-8">
          <Search className="h-3.5 w-3.5 text-white/40" />
          <span className="text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">Page Not Found</span>
        </div>

        {/* 404 number */}
        <p
          className="text-[120px] sm:text-[180px] font-black leading-none mb-4 select-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'var(--font-geist-mono)',
          }}
          aria-hidden="true"
        >
          404
        </p>

        <h1 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
          This page doesn't exist
        </h1>
        <p className="text-[15px] text-white/40 leading-relaxed mb-12 max-w-md mx-auto">
          The page you're looking for may have moved, been renamed, or no longer exists.
        </p>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-4 px-5 py-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all text-left group"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white group-hover:text-white/90">{l.label}</div>
                <div className="text-[12px] text-white/35 mt-0.5">{l.desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>

        {/* Back home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm text-white/80 border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-all"
        >
          <Home className="h-4 w-4" />
          Back to Homepage
        </Link>
      </div>
    </div>
  )
}
