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
      
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; color: #1a1a1a; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <div style="background-color: #02050A; padding: 32px 40px; text-align: center; border-bottom: 2px solid #D4A847;">
            <img src="https://flowtaris.com/images/logo.png" alt="Flowtaris AI" style="height: 40px; margin-bottom: 16px;" />
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Your Enterprise AI Business Case</h1>
            <p style="color: #a1a1aa; margin: 8px 0 0 0; font-size: 15px;">Custom analysis for ${inputs.erp} integration</p>
          </div>

          <!-- Body -->
          <div style="padding: 40px;">
            <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.6;">Thank you for using the Flowtaris Financial X-Ray. Based on your provided parameters, we have calculated the projected financial impact of automating your <strong>${inputs.useCase}</strong> workflows using Flowtaris AI.</p>

            <!-- Metrics Grid -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 32px 0;">
              <h3 style="margin: 0 0 20px 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Projected Annual Impact</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 15px;">Net Annual Savings</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #10b981; font-size: 18px;">${fmt(outputs.res?.annualSavings || 0)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 15px;">FTE Capacity Freed</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #0f172a; font-size: 16px;">${outputs.res?.fteFreed || 0} heads</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #64748b; font-size: 15px;">Payback Period</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #0f172a; font-size: 16px;">${outputs.res?.paybackMonths || 0} months</td>
                </tr>
              </table>
            </div>

            <!-- Cost of Inaction -->
            <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 24px; margin: 32px 0;">
              <h3 style="margin: 0 0 16px 0; color: #9f1239; font-size: 16px;">The Hidden Cost of Inaction (COI)</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #881337; line-height: 1.6;">Delaying automation carries measurable risks to your organization:</p>
              <ul style="margin: 0; padding-left: 20px; color: #9f1239; font-size: 14px; line-height: 1.6;">
                <li><strong>Team Attrition Risk:</strong> ${fmt(outputs.coi?.attritionCost || 0)}/yr lost to manual burnout.</li>
                <li><strong>Compliance & Error Risk:</strong> ${fmt(outputs.coi?.complianceRisk || 0)}/yr in potential audit penalties and manual entry errors.</li>
              </ul>
            </div>

            <!-- Recommendations -->
            <h3 style="margin: 40px 0 16px 0; color: #0f172a; font-size: 18px;">Recommended Next Steps</h3>
            <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px;">To unlock these savings and mitigate your compliance risks, we recommend the following action plan:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
              <tr>
                <td style="padding: 0 16px 16px 0; vertical-align: top;"><div style="background: #02050A; color: white; width: 24px; height: 24px; border-radius: 12px; text-align: center; line-height: 24px; font-size: 12px; font-weight: bold;">1</div></td>
                <td style="padding-bottom: 16px; font-size: 15px; color: #334155; line-height: 1.5;"><strong>Technical Validation:</strong> Schedule a brief call with our engineers to validate your specific ${inputs.erp} configuration and data structures.</td>
              </tr>
              <tr>
                <td style="padding: 0 16px 0 0; vertical-align: top;"><div style="background: #02050A; color: white; width: 24px; height: 24px; border-radius: 12px; text-align: center; line-height: 24px; font-size: 12px; font-weight: bold;">2</div></td>
                <td style="font-size: 15px; color: #334155; line-height: 1.5;"><strong>Pilot Deployment:</strong> Launch a controlled pilot on your most manual ${inputs.useCase} process to prove the ROI with zero risk.</td>
              </tr>
            </table>

            <!-- CTA -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://flowtaris.ai/demo" style="display: inline-block; background-color: #02050A; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 30px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">Schedule Your Technical Review</a>
            </div>

          </div>

          <!-- Footer / Disclaimer -->
          <div style="background-color: #f8fafc; padding: 32px 40px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 12px 0; font-size: 11px; color: #64748b; line-height: 1.6; text-align: justify;">
              <strong>Disclaimer:</strong> The figures provided in this report are illustrative estimates based on publicly available industry benchmarks, aggregated client data, and the self-reported inputs provided. Actual results will vary depending on your specific internal processes, data quality, existing ${inputs.erp} configuration, and implementation scope. These projections do not constitute a guarantee of financial performance or savings and should not be solely relied upon for financial planning.
            </p>
            <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
              © ${new Date().getFullYear()} Flowtaris AI. All rights reserved.<br/>
              <a href="https://flowtaris.ai" style="color: #94a3b8; text-decoration: underline;">flowtaris.ai</a>
            </p>
          </div>
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