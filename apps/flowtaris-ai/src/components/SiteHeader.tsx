'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ArrowUpRight, CheckCircle2, TrendingUp, AlertTriangle, Menu, X } from 'lucide-react'

interface HeaderConfig {
  logoUrl?: string
  brandName?: string
  badgeText?: string
  showLogo?: boolean
  heroConfig?: any
  roiCalculatorConfig?: any
  coiCalculatorConfig?: any
}

interface SiteHeaderProps {
  config?: HeaderConfig
}

export default function SiteHeader({ config }: SiteHeaderProps = {}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const logoUrl   = config?.logoUrl   ?? '/images/flowtaris-logo.png'
  const brandName = config?.brandName ?? 'Flowtaris'
  const badgeText = config?.badgeText ?? '.ai'
  const showLogo  = config?.showLogo  !== false

  // Fallback default CTA configuration in case the database is missing it
  const ctas = config?.heroConfig?.header_ctas || {
    assessment: { label: 'Assessment', href: '/assessment' },
    roi: { label: 'ROI', href: '/roi-calculator' },
    coi: { label: 'Cost of Inaction', href: '/cost-of-inaction', mobileLabel: 'COI' },
    corporate: { label: 'Corporate', href: 'https://www.flowtaris.com/' }
  }

  const isActive = (path: string) =>
    pathname === path || (pathname?.startsWith(path + '/') && path !== '/')

  const navItem = (href: string, active: boolean) => `
    relative flex items-center gap-2 px-4 py-2.5 rounded-full
    text-[13px] tracking-wide transition-all duration-300
    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20
    group
    ${active
      ? 'text-white bg-white/[0.12] font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
      : 'text-white/85 hover:text-white hover:bg-white/[0.06] font-normal'
    }
  `

  return (
    <header
      className="fixed top-6 right-6 z-50 pointer-events-auto"
      role="banner"
      aria-label="Flowtaris AI — primary site navigation"
    >
      {/* ── Ultra-Premium Glassmorphism Container ── */}
      <div
        className="
          relative flex items-center gap-1.5 p-[5px] rounded-full
          bg-[#000000]/40 backdrop-blur-[40px]
          border border-white/[0.08]
          shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.08)]
          animate-header-enter group/header
          overflow-hidden
        "
      >
        {/* Subtle shimmer sweep animation */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent group-hover/header:animate-shimmer pointer-events-none" />

        {/* ── BRAND: Logo + Name + .ai Badge ── */}
        <Link
          href="/"
          className="
            relative flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full
            hover:bg-white/[0.04] active:bg-white/[0.06]
            transition-all duration-300 ease-out group
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20
          "
          aria-label="Flowtaris AI — go to homepage"
          title="Flowtaris AI — Enterprise AI Automation for Finance Teams"
        >
          {showLogo && (
            <div
              className="
                relative w-8 h-8 flex-shrink-0 rounded-full
                bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.2)]
                group-hover:shadow-[0_0_15px_rgba(212,168,71,0.3)]
                transition-all duration-500 ease-out
                flex items-center justify-center
              "
              aria-hidden="true"
            >
              <Image
                src={logoUrl}
                alt="Flowtaris logo"
                width={32}
                height={32}
                className="object-contain w-full h-full p-1 group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          )}

          <span className="flex items-center gap-2 select-none leading-none">
            <span className="text-white font-semibold text-[14px] tracking-wide font-sans">
              {brandName}
            </span>

            {/* Premium animated .ai badge */}
            <span
              className="
                relative inline-flex items-center gap-[3px] px-2 py-[3px] rounded-full
                bg-gradient-to-r from-[#D4A847]/20 via-[#f0c97a]/10 to-[#D4A847]/20
                border border-[#D4A847]/40
                text-[#f0c97a] text-[10px] font-bold tracking-widest uppercase
                shadow-[0_0_12px_rgba(212,168,71,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]
                group-hover:shadow-[0_0_18px_rgba(212,168,71,0.4),inset_0_1px_0_rgba(255,255,255,0.12)]
                group-hover:border-[#D4A847]/70 group-hover:text-[#fde68a]
                transition-all duration-500
              "
            >
              {/* Animated AI spark */}
              <span className="w-[5px] h-[5px] rounded-full bg-gradient-to-b from-[#fde68a] to-[#D4A847] animate-badge-pulse shadow-[0_0_6px_rgba(212,168,71,0.8)] flex-shrink-0" />
              {badgeText}
            </span>
          </span>
        </Link>

        {/* ── Separator ── */}
        <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-white/[0.15] to-transparent mx-1 flex-shrink-0" aria-hidden="true" />

        {/* ── PRIMARY NAV ── */}
        <nav
          className="flex items-center gap-1"
          role="navigation"
          aria-label="Main navigation links"
        >
          {/* Assessment */}
          <Link href={ctas.assessment.href} className={navItem(ctas.assessment.href, isActive(ctas.assessment.href))}>
            <CheckCircle2
              strokeWidth={isActive(ctas.assessment.href) ? 2.5 : 2}
              className={`w-4 h-4 flex-shrink-0 transition-colors duration-300
                ${isActive(ctas.assessment.href) ? 'text-white' : 'text-white/70 group-hover:text-white'}`}
            />
            <span className="hidden sm:inline">{ctas.assessment.label}</span>
          </Link>

          {/* ROI Calculator */}
          {(!config?.roiCalculatorConfig?.shutdown) && (
            <Link href={ctas.roi.href} className={navItem(ctas.roi.href, isActive(ctas.roi.href))}>
              <TrendingUp
                strokeWidth={isActive(ctas.roi.href) ? 2.5 : 2}
                className={`w-4 h-4 flex-shrink-0 transition-colors duration-300
                  ${isActive(ctas.roi.href) ? 'text-white' : 'text-white/70 group-hover:text-white'}`}
              />
              <span className="hidden sm:inline">{ctas.roi.label}</span>
            </Link>
          )}

          {/* Cost of Inaction */}
          {(!config?.coiCalculatorConfig?.shutdown) && (
            <Link href={ctas.coi.href} className={navItem(ctas.coi.href, isActive(ctas.coi.href))}>
              <AlertTriangle
                strokeWidth={isActive(ctas.coi.href) ? 2.5 : 2}
                className={`w-4 h-4 flex-shrink-0 transition-colors duration-300
                  ${isActive(ctas.coi.href) ? 'text-amber-400' : 'text-amber-400/60 group-hover:text-amber-400'}`}
              />
              <span className="hidden md:inline">{ctas.coi.label}</span>
              <span className="hidden sm:inline md:hidden">{ctas.coi.mobileLabel || ctas.coi.label}</span>
            </Link>
          )}
        </nav>

        {/* ── Separator ── */}
        <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-white/[0.15] to-transparent mx-1 flex-shrink-0" aria-hidden="true" />

        {/* ── CORPORATE LINK ── */}
        <a
          href={ctas.corporate.href}
          target="_blank"
          rel="noopener noreferrer"
          className="
            relative flex items-center gap-1.5 pl-4 pr-5 py-2.5 rounded-full
            bg-transparent border border-transparent
            hover:bg-white/[0.04]
            text-[13px] font-medium tracking-wide
            transition-all duration-300 ease-out group overflow-hidden
          "
        >
          {/* Subtle gold gradient text */}
          <span className="bg-gradient-to-br from-[#f0c97a] via-[#D4A847] to-[#b3852b] bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300 whitespace-nowrap">
            {ctas.corporate.label}
          </span>
          <ArrowUpRight
            strokeWidth={2.5}
            className="w-3.5 h-3.5 text-[#D4A847]/70 group-hover:text-[#f0c97a] group-hover:translate-x-[2px] group-hover:-translate-y-[2px] transition-all duration-300 flex-shrink-0"
          />
        </a>
        {/* ── MOBILE MENU BUTTON ── */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="sm:hidden relative flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-200 flex-shrink-0"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <nav
            className="absolute top-0 right-0 w-[75vw] max-w-[300px] h-screen bg-[#0a0b12] border-l border-white/[0.08] shadow-2xl flex flex-col pt-20 pb-8 px-6 overflow-y-auto"
            aria-label="Mobile navigation links"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              {[
                { href: ctas.assessment.href, label: ctas.assessment.label },
                (!config?.roiCalculatorConfig?.shutdown) ? { href: ctas.roi.href, label: ctas.roi.label } : null,
                (!config?.coiCalculatorConfig?.shutdown) ? { href: ctas.coi.href, label: ctas.coi.label } : null,
                { href: '/capabilities', label: 'Capabilities' },
                { href: '/case-studies', label: 'Case Studies' },
                { href: '/insights', label: 'Insights' },
                { href: '/about-flowtaris-ai', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].filter(Boolean).map((item) => {
                const href = item!.href
                const label = item!.label
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      pathname === href || pathname?.startsWith(href + '/')
                        ? 'bg-white/[0.10] text-white font-semibold'
                        : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>

            <div className="mt-auto pt-8 border-t border-white/[0.08]">
              <a
                href={ctas.corporate.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-[#D4A847] font-medium hover:bg-white/[0.04] transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {ctas.corporate.label}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
