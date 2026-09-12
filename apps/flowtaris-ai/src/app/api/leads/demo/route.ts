// @flowtaris/flowtaris-ai - Demo Request API
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@flowtaris/supabase-client'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, urgently, assessmentId, roiCalcId } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Missing required fields: email' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // 1. Store demo request in Supabase
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        type: 'demo',
        name: name || null,
        email,
        company: company || null,
        message: `Urgency: ${urgently || 'standard'}. Assessment ID: ${assessmentId || 'none'}. ROI Calc ID: ${roiCalcId || 'none'}`,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      // Don't hard-fail — still send the email
    }

    // 2. Send confirmation + internal alert via Resend
    if (resend) {
      const supportEmail = process.env.FLOWTARIS_SUPPORT_EMAIL || 'support@flowtaris.com'
      const adminEmail = process.env.FLOWTARIS_ADMIN_EMAIL

      // Internal notification to team
      if (adminEmail) {
        await resend.emails.send({
          from: `Flowtaris Alerts <${supportEmail}>`,
          to: adminEmail.split(',').map(e => e.trim()),
          subject: `📋 New Demo Request — ${name || email} (${company || 'Unknown Co.'})`,
          html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a2e;">
            <h2 style="margin: 0 0 8px; font-size: 22px;">New Demo Request</h2>
            <p style="color: #64748b; margin: 0 0 24px;">Someone just booked a demo on Flowtaris AI.</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 140px;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${name || '—'}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${email}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Company</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${company || '—'}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Urgency</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; text-transform: capitalize;">${urgently || 'standard'}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Source</td><td style="padding: 8px 0; font-weight: 600;">Assessment ID: ${assessmentId || 'none'} | ROI Calc: ${roiCalcId || 'none'}</td></tr>
            </table>
          </div>
        `,
        }).catch(e => console.error('Failed to send internal demo alert:', e))
      }

      // Confirmation to the requester
      await resend.emails.send({
        from: `Flowtaris AI <${supportEmail}>`,
        to: [email],
        subject: `Your demo request has been received — Flowtaris AI`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a2e;">
            <h2 style="margin: 0 0 8px;">Hi ${name || 'there'},</h2>
            <p style="color: #374151; line-height: 1.7;">Thank you for requesting a demo of <strong>Flowtaris AI</strong>. Our solutions team will be in touch within 1 business day to schedule your technical review.</p>
            <p style="color: #374151; line-height: 1.7;">In the meantime, you can explore more about how we automate finance operations at <a href="https://flowtaris.ai" style="color: #0ea5e9;">flowtaris.ai</a>.</p>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 32px;">— The Flowtaris Team</p>
          </div>
        `,
      }).catch(e => console.error('Failed to send demo confirmation to user:', e))
    } else {
      console.log('RESEND_API_KEY not set — skipping email notification')
    }

    return NextResponse.json({
      success: true,
      requestId: data?.id,
      calendarLink: '', // TODO: Provide verified Calendly URL
    })

  } catch (error) {
    console.error('Demo request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}