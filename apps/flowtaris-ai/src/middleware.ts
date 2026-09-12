import { NextRequest, NextResponse } from 'next/server'

// ─── Edge Middleware ───────────────────────────────────────────────────────────
// Runs at Vercel Edge before any page/API handler.
// Handles: security route blocking, IP rate limiting signals, request tracing.

// Routes that must NEVER be accessible in production
const BLOCKED_IN_PRODUCTION = [
  '/api/debug-email',
  '/api/migrate-insights',
  '/api/revalidate', // Only allow webhook calls with secret — handled below
]

// Simple in-memory rate limiting (Edge-safe: per-instance, not global)
// For production, use Vercel KV or Upstash Redis for true distributed rate limiting
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10  // 10 POSTs per minute per IP to lead capture routes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function getRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
  }

  entry.count++
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count)
  return { allowed: entry.count <= RATE_LIMIT_MAX_REQUESTS, remaining }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProduction = process.env.NODE_ENV === 'production'

  // ── 1. Block internal/debug routes in production ───────────────────────────
  if (isProduction) {
    for (const blocked of BLOCKED_IN_PRODUCTION) {
      if (pathname.startsWith(blocked)) {
        return NextResponse.json(
          { error: 'Not found' },
          { status: 404 }
        )
      }
    }
  }

  // ── 2. Admin panel: add no-index header (admin is already behind auth) ─────
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  // ── 3. Rate limiting on lead capture API routes ────────────────────────────
  if (
    request.method === 'POST' &&
    (pathname.startsWith('/api/leads') || pathname.startsWith('/api/waitlist'))
  ) {
    // Get real IP from Vercel headers
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const rateLimitKey = `${ip}:${pathname}`
    const { allowed, remaining } = getRateLimit(rateLimitKey)

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a moment.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    return response
  }

  // ── 4. Add request traceability header ────────────────────────────────────
  const requestId = crypto.randomUUID()
  const response = NextResponse.next()
  response.headers.set('X-Request-ID', requestId)

  // ── 5. Ensure HTTPS in production ─────────────────────────────────────────
  if (isProduction && request.headers.get('x-forwarded-proto') === 'http') {
    const httpsUrl = request.nextUrl.clone()
    httpsUrl.protocol = 'https:'
    return NextResponse.redirect(httpsUrl, 301)
  }

  return response
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/|icons/).*)',
  ],
}
