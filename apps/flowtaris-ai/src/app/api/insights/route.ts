import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

/**
 * GET /api/insights
 * Returns all insights ordered by published_at desc.
 * Uses the service-role client so it works from both server and browser.
 */
export async function GET() {
  try {
    const client = createAdminClient()
    const { data, error } = await client
      .from('insights')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('published_at', { ascending: false })

    if (error) {
      console.error('[GET /api/insights]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data ?? [], { status: 200 })
  } catch (err: any) {
    console.error('[GET /api/insights] Unexpected:', err)
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}

/**
 * POST /api/insights
 * Creates a new insight article.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const client = createAdminClient()
    const { data, error } = await client
      .from('insights')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('[POST /api/insights]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/insights] Unexpected:', err)
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}

/**
 * PATCH /api/insights
 * Bulk-updates sort_order for articles.
 */
export async function PATCH(request: Request) {
  try {
    const updates = await request.json()
    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: 'Expected an array of updates' }, { status: 400 })
    }

    const client = createAdminClient()
    
    // Use Promise.all with updates instead of upsert to avoid NOT NULL constraint errors
    // since we are only updating sort_order and not providing full records.
    const results = await Promise.all(
      updates.map((u) => 
        client.from('insights').update({ sort_order: u.sort_order }).eq('id', u.id)
      )
    )

    const errors = results.filter(r => r.error).map(r => r.error)
    if (errors.length > 0) {
      console.error('[PATCH /api/insights] Errors:', errors)
      return NextResponse.json({ error: 'Failed to update some records' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error('[PATCH /api/insights] Unexpected:', err)
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
