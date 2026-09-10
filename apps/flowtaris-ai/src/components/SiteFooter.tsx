'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Github, Linkedin, Twitter, ArrowRight, Youtube, Instagram, Facebook, Mail, MapPin } from 'lucide-react'

export default function SiteFooter({ config }: { config?: any } = {}) {
  const logoUrl = config?.logoUrl || "/images/logo.png"
  const tagline = config?.tagline || "The intelligence layer enterprise finance was missing. Built by the best, deployed in weeks."

  // Newsletter CTA — dynamic from admin
  const newsletter = config?.newsletterConfig ?? {}
  const newsletterTitle = newsletter.title || 'Stay ahead in Enterprise AI'
  const newsletterDescription = newsletter.description || 'Join 10,000+ finance leaders receiving our weekly insights on autonomous workflows, GenAI document intelligence, and predictive analytics.'
  const newsletterButtonText = newsletter.buttonText || 'Subscribe'

  // Social links — dynamic from admin (JSON object: {linkedin, twitter, github})
  const socialLinks = config?.socialLinks ?? {}
  const phone = socialLinks.phone || '+91 9391274394'
  const emailUrl = socialLinks.email || 'mailto:hello@flowtaris.com'
  const linkedinUrl = socialLinks.linkedin || 'https://www.linkedin.com/company/flowtaris-private-limited/'
  const twitterUrl = socialLinks.twitter || 'https://x.com/flowtaris'
  const facebookUrl = socialLinks.facebook || 'https://www.facebook.com/people/Flowtaris/61588772333370/#'
  const youtubeUrl = socialLinks.youtube || 'https://www.youtube.com/@Flowtaris'
  const mapUrl = socialLinks.map || 'https://www.google.com/search?sca_esv=96d5796968b1433c&rlz=1CDGOYI_enIN1181IN1181&hl=en-US&sxsrf=APpeQns0i6Wv56arcLK29N7ke_P-BipzBA:1782895358308&kgmid=/g/11d_z6tqlf&q=Swarna+Residency+Apartment&shem=epsd1,ltae,rimspwouoe&shndl=30&source=sh/x/loc/tile/m1/3&kgs=6e6b2f36f5c65751&utm_source=epsd1,ltae,rimspwouoe,sh/x/loc/tile/m1/3'
  const whatsappUrl = socialLinks.whatsapp || 'https://api.whatsapp.com/send/?phone=919391274394&text=Hi+Flowtaris%2C+I+would+like+to+inquire+about+your+services.&type=phone_number&app_absent=0'
  const instagramUrl = socialLinks.instagram || 'https://www.instagram.com/flowtaris_official?igsh=d2N5a2FzZDlqZ2F5&utm_source=qr'

  // Legal links — dynamic from admin
  const privacyUrl = config?.privacyPolicyUrl || '/privacy'
  const termsUrl = config?.termsOfServiceUrl || '/terms'
  
  // Use navigation json if provided, otherwise fallback to defaults
  const resources = (config?.navigation?.footer?.resources || [
    { label: 'Insights', href: '/insights' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'ROI Calculator', href: '/roi-calculator' },
    { label: 'Assessment', href: '/assessment' },
    { label: 'Cost of Inaction', href: '/cost-of-inaction' },
  ]).filter((link: any) => {
    if (link.href === '/roi-calculator' && config?.roiCalculatorConfig?.shutdown) return false
    if (link.href === '/cost-of-inaction' && config?.coiCalculatorConfig?.shutdown) return false
    return true
  })
  
  const company = config?.navigation?.footer?.company || [
    { label: 'About Us', href: '/about-flowtaris-ai' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="relative bg-[#02050A] overflow-hidden pt-24 mt-20">
      {/* Premium Gradient Top Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4A847]/50 to-transparent shadow-[0_0_20px_rgba(212,168,71,0.5)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-[#f0c97a] to-transparent shadow-[0_0_15px_rgba(240,201,122,0.8)]" />

      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E8A020]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* New Newsletter / CTA Block to fill empty space */}
        <div className="mb-24 p-8 md:p-12 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#D4A847]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">{newsletterTitle}</h3>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                {newsletterDescription}
              </p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your work email" 
                className="w-full sm:w-72 bg-black/50 border border-white/10 rounded-full px-6 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4A847]/50 focus:ring-1 focus:ring-[#D4A847]/50 transition-all"
              />
              <button className="whitespace-nowrap bg-white text-black font-semibold rounded-full px-8 py-3.5 text-sm hover:bg-[#f0c97a] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                {newsletterButtonText}
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
          <div className="col-span-2 md:col-span-4 lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block mb-6 relative w-[200px] h-[200px]">
                <Image src={logoUrl} alt="Flowtaris AI" fill className="object-contain object-left" />
              </Link>
              <p className="text-neutral-500 font-light text-sm max-w-xs leading-relaxed mb-8">
                {tagline}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {phone && (
                <div className="flex items-center gap-3 mr-2">
                  <span className="text-white/80 font-bold tracking-widest">{phone}</span>
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                </div>
              )}
              {[
                { icon: <Mail className="w-5 h-5" />, href: emailUrl },
                { icon: <Linkedin className="w-5 h-5" />, href: linkedinUrl },
                { icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                ), href: twitterUrl },
                { icon: <Facebook className="w-5 h-5" />, href: facebookUrl },
                { icon: <Youtube className="w-5 h-5" />, href: youtubeUrl },
                { icon: <MapPin className="w-5 h-5" />, href: mapUrl },
                { icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.127 1.532 5.862L0 24l6.272-1.506A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.805 9.805 0 01-5.032-1.388l-.36-.214-3.726.895.928-3.625-.235-.372A9.808 9.808 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                  </svg>
                ), href: whatsappUrl },
                { icon: <Instagram className="w-5 h-5" />, href: instagramUrl },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#E8A020] hover:border-[#E8A020]/30 hover:bg-[#E8A020]/10 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        {/* Removed Platform section per user request */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 lg:col-start-7">
            <h4 className="text-white font-semibold mb-6 text-sm tracking-wide uppercase">Resources</h4>
            <ul className="space-y-4">
              {resources.map((link: any, i: number) => (
                <li key={i}>
                  <Link href={link.href} className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out">
                      <ArrowRight className="w-3 h-3 text-[#E8A020]" />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h4 className="text-white font-semibold mb-6 text-sm tracking-wide uppercase">Company</h4>
            <ul className="space-y-4 mb-8">
              {company.map((link: any, i: number) => (
                <li key={i}>
                  <Link href={link.href} className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out">
                      <ArrowRight className="w-3 h-3 text-[#E8A020]" />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://flowtaris.com" target="_blank" rel="noopener noreferrer" className="text-[#E8A020] hover:text-[#f5d98c] text-sm transition-colors flex items-center gap-2 group font-medium">
                  Corporate Site
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 pb-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-xs font-light">
            © {new Date().getFullYear()} Flowtaris AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-neutral-500 font-light">
            <Link href={privacyUrl} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href={termsUrl} className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* Huge Background Text at very bottom */}
        <div className="pointer-events-none select-none overflow-hidden flex justify-center opacity-10 mix-blend-overlay pb-0 mb-[-2%]">
          <span className="text-[16vw] font-bold leading-[0.8] tracking-tighter text-white whitespace-nowrap" style={{ fontFamily: 'var(--font-sora)' }}>
            FLOWTARIS
          </span>
        </div>
      </div>
    </footer>
  )
}
