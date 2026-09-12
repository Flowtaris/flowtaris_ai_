// @flowtaris/flowtaris-ai - Cost of Inaction Email API
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@flowtaris/supabase-client'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, email, outputs, state } = body

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // 1. Update Supabase record (non-blocking)
    if (id && id !== 'direct') {
      try {
        const supabase = createServerClient()
        const { error: dbError } = await supabase
          .from('inaction_calculations')
          .update({ email })
          .eq('id', id)
        if (dbError) console.error('Supabase error (non-blocking):', dbError)
      } catch (dbErr) {
        console.error('Supabase connection error:', dbErr)
      }
    }

    // 2. Send email via Resend
    if (resend) {
      const fmtK = (v: number) => v >= 1000000 ? `$${(v / 1000000).toFixed(2)}M` : v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${Math.round(v).toLocaleString()}`
      const monthlyLeak: number = outputs?.monthlyLeakage || 0
      const annualLeak: number = outputs?.totalAnnualCost || 0
      const manualLaborCost: number = outputs?.laborCost || 0
      const errorCost: number = outputs?.errorCost || 0
      const platform: string = state?.platform || 'Your ERP'
      const monthsDelay: number = state?.monthsDelay || 12
      const sunkCost: number = (monthlyLeak * monthsDelay)

      // ─── World-class HTML email template ───────────────────────────────────
      const emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Cost of Inaction Analysis</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb;">
            <tr>
              <td align="center" style="padding: 32px 16px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

                  <!-- ── HEADER ── -->
                  <tr>
                    <td style="background-color: #09090b; padding: 24px 32px; border-bottom: 2px solid #18181b;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Flowtaris<span style="color: #06b6d4;">.AI</span></div>
                            <div style="font-size: 11px; color: #71717a; margin-top: 2px; letter-spacing: 1.5px; text-transform: uppercase;">The Science of Business Flow</div>
                          </td>
                          <td style="text-align: right;">
                            <div style="display: inline-block; background: #18181b; border: 1px solid #ef444440; border-radius: 6px; padding: 6px 12px;">
                              <div style="font-size: 10px; color: #ef4444; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">⚠ Cost of Inaction Report</div>
                              <div style="font-size: 11px; color: #a1a1aa; margin-top: 1px;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- ── GREETING ── -->
                  <tr>
                    <td style="padding: 32px 32px 0 32px;">
                      <p style="margin: 0 0 12px 0; font-size: 15px; color: #374151; line-height: 1.7;">Hi,</p>
                      <p style="margin: 0 0 24px 0; font-size: 15px; color: #374151; line-height: 1.7;">
                        Here is the financial summary from your <strong>Flowtaris Cost of Inaction Analysis</strong> on your <strong>${platform}</strong> environment. These figures represent what is actively leaving your business every month you delay automation.
                      </p>
                    </td>
                  </tr>

                  <!-- ── CRITICAL WARNING BANNER ── -->
                  <tr>
                    <td style="padding: 0 32px 24px 32px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; overflow: hidden;">
                        <tr>
                          <td style="padding: 20px 24px;">
                            <div style="font-size: 11px; font-weight: 700; color: #b91c1c; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">⚠ Active Financial Leakage</div>
                            <div style="font-size: 40px; font-weight: 900; color: #991b1b; letter-spacing: -1px; line-height: 1;">${fmtK(monthlyLeak)}<span style="font-size: 18px; font-weight: 500; color: #dc2626; margin-left: 4px;">/ month</span></div>
                            <div style="font-size: 13px; color: #b91c1c; margin-top: 8px;">This capital is irrecoverable. It is not being held — it is being consumed by manual processes.</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- ── BREAKDOWN TABLE ── -->
                  <tr>
                    <td style="padding: 0 32px 24px 32px;">
                      <div style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 12px;">Full Cost Breakdown</div>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                        <tr style="background: #f9fafb;">
                          <td style="padding: 10px 16px; font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #e5e7eb;">Cost Category</td>
                          <td style="padding: 10px 16px; font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #e5e7eb; text-align: right;">Per Month</td>
                          <td style="padding: 10px 16px; font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #e5e7eb; text-align: right;">Per Year</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; font-size: 14px; color: #374151; border-bottom: 1px solid #f3f4f6;">Manual Labor Cost</td>
                          <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #111827; border-bottom: 1px solid #f3f4f6; text-align: right;">${fmtK(manualLaborCost / 12)}</td>
                          <td style="padding: 12px 16px; font-size: 14px; font-weight: 700; color: #ef4444; border-bottom: 1px solid #f3f4f6; text-align: right;">${fmtK(manualLaborCost)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; font-size: 14px; color: #374151; border-bottom: 1px solid #f3f4f6;">Error & Rework Cost</td>
                          <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #111827; border-bottom: 1px solid #f3f4f6; text-align: right;">${fmtK(errorCost / 12)}</td>
                          <td style="padding: 12px 16px; font-size: 14px; font-weight: 700; color: #ef4444; border-bottom: 1px solid #f3f4f6; text-align: right;">${fmtK(errorCost)}</td>
                        </tr>
                        <tr style="background: #fef2f2;">
                          <td style="padding: 14px 16px; font-size: 14px; font-weight: 700; color: #111827;">Total Annual Exposure</td>
                          <td style="padding: 14px 16px; font-size: 14px; font-weight: 700; color: #dc2626; text-align: right;">${fmtK(monthlyLeak)}</td>
                          <td style="padding: 14px 16px; font-size: 16px; font-weight: 900; color: #dc2626; text-align: right;">${fmtK(annualLeak)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- ── SUNK COST CALLOUT ── -->
                  <tr>
                    <td style="padding: 0 32px 24px 32px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <tr>
                          <td style="padding: 16px 20px;">
                            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">If You Delay ${monthsDelay} Months</div>
                            <div style="display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;">
                              <span style="font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px;">${fmtK(sunkCost)}</span>
                              <span style="font-size: 14px; color: #64748b;">in sunk costs — capital that cannot be recovered.</span>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- ── WHAT THIS MEANS ── -->
                  <tr>
                    <td style="padding: 0 32px 24px 32px;">
                      <p style="margin: 0 0 12px 0; font-size: 14px; color: #374151; line-height: 1.75; border-left: 3px solid #ef4444; padding-left: 14px;">
                        These are not projections — they reflect costs your organisation is <strong>already incurring today</strong> on ${platform}. Every month without automation compounds both the financial loss and the competitive gap to peers who have already deployed.
                      </p>
                    </td>
                  </tr>

                  <!-- ── WHAT TO DO NEXT ── -->
                  <tr>
                    <td style="padding: 0 32px 24px 32px;">
                      <div style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 14px;">The Path Forward</div>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding: 0 14px 14px 0; vertical-align: top; width: 28px; color: #06b6d4; font-size: 15px; font-weight: 800;">01</td>
                          <td style="padding-bottom: 14px; font-size: 14px; color: #374151; line-height: 1.6;"><strong>Quantify the full ROI.</strong> Run your precise invoice volumes and FTE costs through our <a href="https://flowtaris.ai/roi-calculator" style="color: #06b6d4; text-decoration: underline;">3-year ROI model</a> — takes under 2 minutes.</td>
                        </tr>
                        <tr>
                          <td style="padding: 0 14px 14px 0; vertical-align: top; width: 28px; color: #06b6d4; font-size: 15px; font-weight: 800;">02</td>
                          <td style="padding-bottom: 14px; font-size: 14px; color: #374151; line-height: 1.6;"><strong>See automation on your actual data.</strong> <a href="https://flowtaris.ai/demo" style="color: #06b6d4; text-decoration: underline;">Book a 30-minute technical session</a> — we'll run a live demo on a real ${platform} workflow with your data structure.</td>
                        </tr>
                        <tr>
                          <td style="padding: 0 14px 0 0; vertical-align: top; width: 28px; color: #06b6d4; font-size: 15px; font-weight: 800;">03</td>
                          <td style="font-size: 14px; color: #374151; line-height: 1.6;"><strong>Start with zero risk.</strong> Our implementation pilots go live in 3 weeks, scoped to one process. You prove the ROI before any broad rollout.</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- ── CTA BUTTONS ── -->
                  <tr>
                    <td style="padding: 0 32px 32px 32px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding-right: 12px;">
                            <a href="https://flowtaris.ai/roi-calculator" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: -0.2px;">Build Your ROI Model →</a>
                          </td>
                          <td>
                            <a href="https://flowtaris.ai/demo" style="display: inline-block; background-color: #ffffff; color: #09090b; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-size: 14px; font-weight: 600; border: 1.5px solid #d1d5db; letter-spacing: -0.2px;">Book a Live Demo</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- ── SIGN-OFF ── -->
                  <tr>
                    <td style="padding: 0 32px 24px 32px; font-size: 15px; color: #374151; line-height: 1.7;">
                      The numbers speak for themselves — happy to help you act on them.<br><br>
                      Best,<br>
                      <strong>Flowtaris Team</strong><br>
                      <span style="font-size: 13px; color: #9ca3af; font-style: italic;">The Science of Business Flow</span><br>
                      <span style="font-size: 13px; color: #9ca3af;"><a href="https://flowtaris.ai" style="color: #9ca3af; text-decoration: underline;">flowtaris.ai</a> &nbsp;·&nbsp; <a href="https://flowtaris.ai/demo" style="color: #9ca3af; text-decoration: underline;">Book a call</a></span>
                    </td>
                  </tr>

                  <!-- ── FOOTER ── -->
                  <tr>
                    <td style="background: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; font-size: 11px; color: #9ca3af; line-height: 1.6;">
                        <em>These figures are illustrative estimates generated from the inputs you provided, calibrated against publicly available industry benchmarks for ${platform} deployments. Actual costs will vary based on your specific process configuration, team structure, and data quality. This report is not a guarantee of financial outcomes.</em>
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 11px; color: #d1d5db;">You received this because you ran a Cost of Inaction Analysis at flowtaris.ai.</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `

      // ─── Plain-text mirror (critical for Gmail Primary routing) ───────────
      const emailText = [
        `Hi,`,
        ``,
        `Here is your Cost of Inaction Analysis for ${platform}:`,
        ``,
        `ACTIVE FINANCIAL LEAKAGE`,
        `Monthly:  ${fmtK(monthlyLeak)}`,
        `Annual:   ${fmtK(annualLeak)}`,
        ``,
        `BREAKDOWN`,
        `Manual Labor:  ${fmtK(manualLaborCost)}/yr`,
        `Error & Rework: ${fmtK(errorCost)}/yr`,
        ``,
        `If you delay ${monthsDelay} months: ${fmtK(sunkCost)} in unrecoverable sunk costs.`,
        ``,
        `These are not projections. These costs are being incurred today on ${platform}.`,
        ``,
        `THE PATH FORWARD`,
        ``,
        `01. Quantify full ROI: https://flowtaris.ai/roi-calculator`,
        `02. See automation on your data — book a 30-min session: https://flowtaris.ai/demo`,
        `03. Start with zero risk. Pilots go live in 3 weeks, one process at a time.`,
        ``,
        `The numbers speak for themselves — happy to help you act on them.`,
        ``,
        `Best,`,
        `Flowtaris Team`,
        `The Science of Business Flow`,
        `https://flowtaris.ai`,
        ``,
        `---`,
        `Estimates based on publicly available industry benchmarks. Not a guarantee of financial outcomes.`,
      ].join('\n')

      const supportEmail = process.env.FLOWTARIS_SUPPORT_EMAIL || 'support@flowtaris.com'
      const adminEmail = process.env.FLOWTARIS_ADMIN_EMAIL

      const { error: emailError } = await resend.emails.send({
        from: `Flowtaris Team <${supportEmail}>`,
        to: [email],
        subject: `Your ${platform} cost of inaction analysis`,
        html: emailHtml,
        text: emailText,
        headers: {
          'X-Entity-Ref-ID': `coi-${Date.now()}`,
        },
      })

      if (emailError) console.error('Resend error:', emailError)

      // ─── ADMIN NOTIFICATION ───────────────────────────────────────────────
      if (adminEmail) {
        const urgency = monthlyLeak > 100000 ? '🔥 HIGH' : monthlyLeak > 50000 ? '⚡ WARM' : '📋 STD'
        await resend.emails.send({
          from: `Flowtaris Alerts <${supportEmail}>`,
          to: adminEmail.split(',').map(e => e.trim()),
          subject: `${urgency} COI Lead: ${email} — ${fmtK(annualLeak)}/yr exposure`,
          html: `
            <div style="font-family: sans-serif; max-width: 560px; color: #111;">
              <div style="background: #09090b; color: white; padding: 18px 24px; border-radius: 8px 8px 0 0;">
                <span style="font-size: 10px; font-weight: 700; color: #06b6d4; text-transform: uppercase; letter-spacing: 1px;">Cost of Inaction Lead</span>
                <h2 style="margin: 6px 0 0 0; font-size: 18px;">${urgency} — ${fmtK(annualLeak)}/yr Exposure</h2>
              </div>
              <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                  <tr><td style="padding: 8px 0; width: 130px; color: #6b7280; font-size: 14px;">Email</td><td style="font-weight: 700;"><a href="mailto:${email}">${email}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">ERP Platform</td><td style="font-weight: 700;">${platform}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Monthly Leakage</td><td style="font-weight: 700; color: #dc2626;">${fmtK(monthlyLeak)}/mo</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Annual Exposure</td><td style="font-weight: 700; color: #dc2626;">${fmtK(annualLeak)}/yr</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Delay Duration</td><td style="font-weight: 700;">${monthsDelay} months modelled</td></tr>
                </table>
                <div style="background: #f8fafc; padding: 14px 16px; border-radius: 6px; font-size: 13px; color: #475569;">
                  <strong>Action:</strong> Client received a detailed COI report. High-intent — already engaged with financials. Recommend outreach within 12h.
                </div>
              </div>
            </div>
          `,
          text: `COI Lead: ${email}\nPlatform: ${platform}\nMonthly: ${fmtK(monthlyLeak)}\nAnnual: ${fmtK(annualLeak)}\nDelay: ${monthsDelay} months`
        }).catch(err => console.error('Admin email error:', err))
      }
    } else {
      console.log('RESEND_API_KEY not set. Skipping email.')
    }

    return NextResponse.json({ success: true, monthlyLeakage: outputs?.monthlyLeakage })

  } catch (error) {
    console.error('Inaction email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}