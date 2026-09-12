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

    // 1. Insert into Supabase (optional logging, do not fail if DB is unavailable)
    let lead = null
    try {
      const supabase = createServerClient()
      const { data, error: supabaseError } = await supabase
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
        console.error('Supabase error (bypassing to send email):', supabaseError)
      } else {
        lead = data
      }
    } catch (dbErr) {
      console.error('Supabase connection error:', dbErr)
    }

    // 2. Send Email via Resend
    if (resend) {
      const fmt = (v: number) => `$${Math.round(v).toLocaleString()}`
      const fmtM = (v: number) => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : `$${Math.round(v/1000)}K`

      // ─── Transactional-style email — plain text-first to avoid Gmail Promotions ───
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; background: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
                  
                  <!-- Name / Greeting -->
                  <tr>
                    <td style="padding-bottom: 24px; font-size: 15px; color: #111827; line-height: 1.7;">
                      Hi,
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 24px; font-size: 15px; color: #111827; line-height: 1.7;">
                      Following your session on the Flowtaris ROI Calculator, I wanted to send across your personalised numbers so you have them for reference. Here's a quick summary based on your ${inputs.erp} configuration:
                    </td>
                  </tr>

                  <!-- Key Numbers — simple table, no colored backgrounds -->
                  <tr>
                    <td style="padding-bottom: 32px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                        <tr style="background: #f9fafb;">
                          <td style="padding: 10px 16px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb;">Metric</td>
                          <td style="padding: 10px 16px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; text-align: right;">Your Estimate</td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 16px; font-size: 15px; color: #374151; border-bottom: 1px solid #f3f4f6;">Net Annual Savings</td>
                          <td style="padding: 14px 16px; font-size: 15px; font-weight: 700; color: #059669; border-bottom: 1px solid #f3f4f6; text-align: right;">${fmt(outputs.res?.annualSavings || 0)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 16px; font-size: 15px; color: #374151; border-bottom: 1px solid #f3f4f6;">Payback Period</td>
                          <td style="padding: 14px 16px; font-size: 15px; font-weight: 600; color: #111827; border-bottom: 1px solid #f3f4f6; text-align: right;">${outputs.res?.paybackMonths || 0} months</td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 16px; font-size: 15px; color: #374151; border-bottom: 1px solid #f3f4f6;">FTE Capacity Freed</td>
                          <td style="padding: 14px 16px; font-size: 15px; font-weight: 600; color: #111827; border-bottom: 1px solid #f3f4f6; text-align: right;">${outputs.res?.fteFreed || 0} heads</td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 16px; font-size: 15px; color: #374151;">Cost of Delay (COI)</td>
                          <td style="padding: 14px 16px; font-size: 15px; font-weight: 600; color: #dc2626; text-align: right;">${fmt((outputs.coi?.attritionCost || 0) + (outputs.coi?.complianceRisk || 0))} / yr</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Context paragraph -->
                  <tr>
                    <td style="padding-bottom: 20px; font-size: 15px; color: #374151; line-height: 1.7;">
                      These figures are based on publicly available benchmarks for <strong>${inputs.erp}</strong> deployments in the <strong>${inputs.useCase}</strong> space. They're designed to give you a directionally accurate view of potential impact — not a guarantee, but a grounded starting point for an internal conversation.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 20px; font-size: 15px; color: #374151; line-height: 1.7;">
                      Two things worth flagging:
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding: 0 12px 12px 0; vertical-align: top; color: #6b7280; font-size: 15px;">1.</td>
                          <td style="padding-bottom: 12px; font-size: 15px; color: #374151; line-height: 1.6;"><strong>Technical fit:</strong> The actual savings depend heavily on how your ${inputs.erp} data is structured. A quick technical call can validate this within 30 minutes.</td>
                        </tr>
                        <tr>
                          <td style="padding: 0 12px 0 0; vertical-align: top; color: #6b7280; font-size: 15px;">2.</td>
                          <td style="font-size: 15px; color: #374151; line-height: 1.6;"><strong>Low-risk start:</strong> We typically recommend beginning with a single high-volume process (like ${inputs.useCase}) before expanding — this lets you prove the ROI internally with minimal risk.</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 28px; font-size: 15px; color: #374151; line-height: 1.7;">
                      If you'd like to dig into whether these numbers hold for your specific setup, I'm happy to set up a 30-minute call — <a href="https://flowtaris.ai/demo" style="color: #2563eb; text-decoration: underline;">book a slot here</a>.
                    </td>
                  </tr>

                  <!-- Sign-off -->
                  <tr>
                    <td style="padding-bottom: 8px; font-size: 15px; color: #374151; line-height: 1.7;">
                      Best,<br>
                      <strong>Priya</strong> at Flowtaris<br>
                      <span style="color: #9ca3af; font-size: 13px;">Enterprise Solutions · <a href="https://flowtaris.ai" style="color: #9ca3af;">flowtaris.ai</a></span>
                    </td>
                  </tr>

                  <!-- Disclaimer -->
                  <tr>
                    <td style="padding-top: 32px; border-top: 1px solid #f3f4f6;">
                      <p style="margin: 0; font-size: 11px; color: #9ca3af; line-height: 1.6;">
                        <em>These figures are illustrative estimates based on publicly available industry research benchmarks. Actual results will vary depending on your specific processes, data quality, ${inputs.erp} configuration, and implementation scope. This is not a guarantee of financial performance and should not be solely relied upon for financial planning decisions.</em>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `

      const supportEmail = process.env.FLOWTARIS_SUPPORT_EMAIL || 'support@flowtaris.com'
      const adminEmail = process.env.FLOWTARIS_ADMIN_EMAIL

      const { data: resendData, error: resendError } = await resend.emails.send({
        from: `Priya at Flowtaris <${supportEmail}>`,
        to: [email],
        subject: `Your ${inputs.erp} ROI numbers`,
        html: emailHtml,
        headers: {
          'X-Entity-Ref-ID': `roi-${Date.now()}`,
        },
      })

      if (resendError) {
        console.error('Resend error:', resendError)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
      }

      // ─── ADMIN NOTIFICATION ───
      if (adminEmail) {
        const adminHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
            <div style="background: #0f172a; padding: 20px; color: white; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0; font-size: 20px;">🔥 HOT LEAD: High-Intent ROI Calculation</h2>
            </div>
            <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
              
              <h3 style="color: #334155; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Contact & Intent</h3>
              <table style="width: 100%; margin-bottom: 24px;">
                <tr><td style="padding: 8px 0; width: 140px; color: #64748b;">Email Address:</td><td style="font-weight: bold;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Lead Source:</td><td style="font-weight: bold;">ROI Calculator</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Target Platform:</td><td style="font-weight: bold;">${inputs.erp}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Primary Pain Point:</td><td style="font-weight: bold;">${inputs.useCase}</td></tr>
              </table>

              <h3 style="color: #334155; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Calculated Financials</h3>
              <table style="width: 100%; margin-bottom: 24px;">
                <tr><td style="padding: 8px 0; width: 140px; color: #64748b;">Total Invoices/Yr:</td><td style="font-weight: bold;">${parseInt(inputs.invoiceVolume || 0).toLocaleString()}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">FTE Team Size:</td><td style="font-weight: bold;">${inputs.fteCount} employees</td></tr>
                <tr><td style="padding: 8px 0; color: #10b981;">Projected Savings:</td><td style="font-weight: bold; color: #10b981;">$${outputs.res?.annualSavings?.toLocaleString() || 0} / year</td></tr>
                <tr><td style="padding: 8px 0; color: #9f1239;">Attrition Risk:</td><td style="font-weight: bold; color: #9f1239;">$${outputs.coi?.attritionCost?.toLocaleString() || 0}</td></tr>
              </table>
              
              <div style="background: #f8fafc; padding: 16px; border-radius: 8px; font-size: 14px; color: #475569; line-height: 1.5;">
                <strong>Action Required:</strong> The client has received their custom PDF-style ROI report via email. Recommend looking up their domain to identify their company, then reaching out via LinkedIn or email to offer a customized pilot for ${inputs.erp}.
              </div>
            </div>
          </div>
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

    return NextResponse.json({ success: true, calcId: lead?.id || 'bypass' })

  } catch (error) {
    console.error('ROI backend error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}