// @flowtaris/flowtaris-ai - ROI Calculation Email Capture & Sending API
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@flowtaris/supabase-client'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { inputs, outputs, email, assessment_id } = body

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // 1. Insert into Supabase
    const supabase = createServerClient()
    const { data: lead, error: supabaseError } = await supabase
      .from('roi_calculations')
      .insert({
        inputs,
        outputs,
        email,
        assessment_id: assessment_id || null,
      })
      .select()
      .single()

    if (supabaseError) {
      console.error('Supabase error:', supabaseError)
      return NextResponse.json({ error: 'Failed to save ROI calculation' }, { status: 500 })
    }

    // 2. Send Email via Resend
    if (resend) {
      const fmt = (v: number) => `$${Math.round(v).toLocaleString()}`
      
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h2 style="color: #10b981;">Your Flowtaris ROI Business Case</h2>
          <p>Thank you for using the Flowtaris Financial X-Ray. Based on your inputs, here is your executive summary:</p>
          
          <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #18181b;">Financial Impact</h3>
            <p><strong>Net Annual Savings:</strong> ${fmt(outputs.res?.annualSavings || 0)}</p>
            <p><strong>Payback Period:</strong> ${outputs.res?.paybackMonths || 0} months</p>
            <p><strong>FTE Capacity Freed:</strong> ${outputs.res?.fteFreed || 0} heads</p>
          </div>

          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #991b1b;">Current Cost of Inaction</h3>
            <p><strong>Platform:</strong> ${inputs.erp}</p>
            <p><strong>Use Case:</strong> ${inputs.useCase}</p>
          </div>
          
          <p>Ready to deploy AI to your finance workflows? <a href="https://flowtaris.ai/demo" style="color: #10b981; font-weight: bold;">Schedule a live demo with an engineer.</a></p>
          <hr style="border: 1px solid #e4e4e7; margin: 30px 0;" />
          <p style="font-size: 12px; color: #71717a;">Flowtaris AI - Intelligent Finance Operations</p>
        </div>
      `

      const supportEmail = process.env.FLOWTARIS_SUPPORT_EMAIL || 'support@flowtaris.com'
      const adminEmail = process.env.FLOWTARIS_ADMIN_EMAIL

      const { data: resendData, error: resendError } = await resend.emails.send({
        from: `Flowtaris AI <${supportEmail}>`,
        to: [email],
        subject: 'Your Flowtaris ROI Projections',
        html: emailHtml,
      })

      if (resendError) {
        console.error('Resend error:', resendError)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
      }

      // ─── ADMIN NOTIFICATION ───
      if (adminEmail) {
        const adminHtml = `
          <h2>New ROI Lead</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Platform:</strong> ${inputs.erp}</p>
          <p><strong>Use Case:</strong> ${inputs.useCase}</p>
          <p><strong>Net Annual Savings:</strong> $${outputs.res?.annualSavings?.toLocaleString() || 0}</p>
          <p><strong>FTE Freed:</strong> ${outputs.res?.fteFreed || 0}</p>
        `
        await resend.emails.send({
          from: `Flowtaris Alerts <${supportEmail}>`,
          to: adminEmail.split(',').map(e => e.trim()),
          subject: `💰 New ROI Lead: ${email}`,
          html: adminHtml,
        }).catch(err => console.error('Admin email error:', err))
      }
    } else {
       console.log('RESEND_API_KEY not found. Skipping email send.')
    }

    return NextResponse.json({ success: true, calcId: lead.id })

  } catch (error) {
    console.error('ROI backend error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}