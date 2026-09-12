import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flowtaris.ai'

// ─── Precise Robots Directives ─────────────────────────────────────────────────
// AI crawlers (GPTBot, PerplexityBot, ClaudeBot) are explicitly welcomed.
// They index flowtaris.ai for AI-generated answers — this is GEO (Generative Engine Optimization).
// Admin, internal APIs, and debug routes are blocked from all crawlers.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Default: Allow all well-behaved crawlers ──────────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/api/',
          '/_next/',
          '/preview/',
          '/static/',
          '/api/debug-email',
          '/api/migrate-insights',
          '/api/revalidate',
        ],
      },

      // ── Googlebot: Full access + crawl budget hints ───────────────────────
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },

      // ── Bingbot: Full access ──────────────────────────────────────────────
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },

      // ── OpenAI GPTBot: Welcome — flowtaris.ai wants to appear in ChatGPT ─
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },

      // ── OpenAI ChatGPT-User: For ChatGPT browsing plugin ─────────────────
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },

      // ── Perplexity AI ─────────────────────────────────────────────────────
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },

      // ── Anthropic Claude ──────────────────────────────────────────────────
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },

      // ── Google Gemini / Bard ──────────────────────────────────────────────
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },

      // ── Meta AI ───────────────────────────────────────────────────────────
      {
        userAgent: 'meta-externalagent',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },

      // ── Cohere AI ─────────────────────────────────────────────────────────
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}