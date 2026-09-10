import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

interface Props {
  params: Promise<{ id: string }>
}

/**
 * PUT /api/insights/[id]
 * Updates an existing insight article by ID.
 */
export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await request.json()

    const client = createAdminClient()
    const { data, error } = await client
      .from('insights')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[PUT /api/insights/[id]]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error('[PUT /api/insights/[id]] Unexpected:', err)
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}

/**
 * DELETE /api/insights/[id]
 * Deletes an insight article by ID.
 */
export async function DELETE(_request: Request, { params }: Props) {
  try {
    const { id } = await params

    const client = createAdminClient()
    const { error } = await client
      .from('insights')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[DELETE /api/insights/[id]]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error('[DELETE /api/insights/[id]] Unexpected:', err)
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}

/**
 * GET /api/insights/[id]
 * Fetches a single insight article by ID.
 */
export async function GET(_request: Request, { params }: Props) {
  try {
    const { id } = await params

    const client = createAdminClient()
    const { data, error } = await client
      .from('insights')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('[GET /api/insights/[id]]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error('[GET /api/insights/[id]] Unexpected:', err)
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
