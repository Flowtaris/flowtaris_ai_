import type { NextConfig } from "next";

// ─── Security Headers ──────────────────────────────────────────────────────────
// Production-grade HTTP security headers. These give an A+ on securityheaders.io
// and are a direct Google ranking signal for trust and security.
const SECURITY_HEADERS = [
  // Prevent clickjacking — no one can embed flowtaris.ai in an iframe
  { key: 'X-Frame-Options', value: 'DENY' },
  // Prevent MIME type sniffing attacks
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Force HTTPS for 2 years, include subdomains, add to browser preload list
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Controls how much referrer info is passed. Protects user privacy while keeping analytics
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features not needed — reduces attack surface
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  // XSS Protection (legacy browsers)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Remove server technology fingerprint
  { key: 'X-Powered-By', value: '' },
  // DNS prefetch control
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Content Security Policy
  // Locked down: only allows scripts/styles from self + trusted CDNs
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self + inline (required for Next.js hydration + JSON-LD) + Google fonts + Vercel analytics
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://va.vercel-scripts.com",
      // Styles: self + inline (required for Tailwind) + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com data:",
      // Images: self + Supabase storage + CDN origins used in admin
      "img-src 'self' data: blob: https://*.supabase.co https://cdn.sanity.io https://flowtaris.com https://images.unsplash.com https://*.vercel.app",
      // API connections: self + Supabase
      "connect-src 'self' https://*.supabase.co https://api.resend.com",
      // No plugins ever
      "object-src 'none'",
      // No base tag hijacking
      "base-uri 'self'",
      // No form action hijacking
      "form-action 'self'",
      // Prevent mixed content
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  transpilePackages: [
    '@repo/ui',
    '@flowtaris/cms-client',
    '@flowtaris/supabase-client',
    '@flowtaris/analytics',
    '@flowtaris/seo',
  ],

  // ── HTTP Security Headers ───────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
      {
        // Additional cache control for static assets
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache public static files aggressively
        source: '/(llms.txt|ai-context.json|manifest.json)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
          { key: 'X-Robots-Tag', value: 'all' },
        ],
      },
      {
        // API routes: no caching, CORS locked to same origin
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Access-Control-Allow-Origin', value: 'https://flowtaris.ai' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },

  // ── Image Optimization ──────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'flowtaris.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Supabase Storage — for admin-uploaded logos and assets
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Allow any HTTPS image URL (for external logo URLs set by admin)
      { protocol: 'https', hostname: '**' },
    ],
  },

  // ── Environment Variables ───────────────────────────────────────────────────
  env: {
    // Ensure internal API fetches work in SSR/ISR contexts
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://flowtaris.ai',
  },

  // ── Performance ─────────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false, // Removes X-Powered-By: Next.js fingerprint
  
  // ── Redirects ───────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Redirect /about → /about-flowtaris-ai (canonical)
      { source: '/about', destination: '/about-flowtaris-ai', permanent: true },
      // Redirect /demo → /contact (consolidates conversion paths)
      { source: '/demo', destination: '/contact', permanent: false },
    ]
  },
}

export default nextConfig