// @flowtaris/flowtaris-ai - Assessment Lead Email Capture & Sending API
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@flowtaris/supabase-client'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, email, result, answers } = body

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // 1. Update Supabase record with email (non-blocking)
    if (id) {
      try {
        const supabase = createServerClient()
        const { error: dbError } = await supabase
          .from('assessment_leads')
          .update({ email })
          .eq('id', id)
        if (dbError) console.error('Supabase error (non-blocking):', dbError)
      } catch (dbErr) {
        console.error('Supabase connection error:', dbErr)
      }
    }

    // 2. Send email via Resend
    if (resend && result) {
      const fmtK = (v: number) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${Math.round(v).toLocaleString()}`
      const score: number = result.leadScore || 0
      const totalSavings: number = result.totalEstimatedSavings || 0

      // Score tier logic
      const tier = score >= 70 ? { label: 'High Readiness', color: '#059669', bg: '#d1fae5', bar: '#10b981' }
                 : score >= 45 ? { label: 'Moderate Readiness', color: '#b45309', bg: '#fef3c7', bar: '#f59e0b' }
                 : { label: 'Early Stage', color: '#b91c1c', bg: '#fee2e2', bar: '#ef4444' }

      // Score bar width (visual indicator)
      const barWidth = Math.max(4, Math.min(100, score))

      // Top 5 recommendations
      const topRecs = (result.recommendations || []).slice(0, 5)

      const recRows = topRecs.map((rec: {
        capability: string
        category: string
        timeline: string
        estimatedSavings: number
        description: string
      }, i: number) => {
        const isQuickWin = rec.category === 'quick-win'
        return `
          <tr>
            <td style="padding: 0; vertical-align: top;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 1px solid #f3f4f6;">
                <tr>
                  <td style="padding: 14px 0 14px 16px; vertical-align: top; width: 28px; color: #9ca3af; font-size: 13px; font-weight: 600;">${i + 1}.</td>
                  <td style="padding: 14px 16px 14px 8px; vertical-align: top;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                      <span style="font-size: 14px; font-weight: 600; color: #111827;">${rec.capability}</span>
                      ${isQuickWin ? `<span style="font-size: 10px; font-weight: 700; color: #065f46; background: #d1fae5; padding: 2px 7px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">Quick Win</span>` : ''}
                    </div>
                    <div style="font-size: 13px; color: #6b7280; line-height: 1.5;">${rec.description}</div>
                    <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">Timeline: ${rec.timeline}</div>
                  </td>
                  <td style="padding: 14px 16px; vertical-align: top; text-align: right; white-space: nowrap; min-width: 80px;">
                    <div style="font-size: 15px; font-weight: 700; color: #059669;">${fmtK(rec.estimatedSavings)}</div>
                    <div style="font-size: 11px; color: #9ca3af;">per year</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `
      }).join('')

      // ─── World-class HTML email template ───────────────────────────────────
      const emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Flowtaris AI Readiness Report</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb;">
            <tr>
              <td align="center" style="padding: 32px 16px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

                  <!-- ── HEADER BAR ── -->
                  <tr>
                    <td style="background-color: #09090b; padding: 24px 32px; border-bottom: 2px solid #18181b;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Flowtaris<span style="color: #06b6d4;">.AI</span></div>
                            <div style="font-size: 11px; color: #71717a; margin-top: 2px; letter-spacing: 1.5px; text-transform: uppercase;">The Science of Business Flow</div>
                          </td>
                          <td style="text-align: right;">
                            <div style="display: inline-block; background: #18181b; border: 1px solid #27272a; border-radius: 6px; padding: 6px 12px;">
                              <div style="font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1px;">AI Readiness Report</div>
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
                        You've just completed your <strong>Flowtaris AI Readiness Assessment</strong>. Based on your ${answers?.erp || 'ERP'} environment and the workflows you flagged, here is what we found:
                      </p>
                    </td>
                  </tr>

                  <!-- ── SCORE CARD ── -->
                  <tr>
                    <td style="padding: 0 32px 24px 32px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
                        <!-- Score header -->
                        <tr>
                          <td style="background: #f9fafb; padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
                            <span style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Your AI Readiness Score</span>
                          </td>
                        </tr>
                        <!-- Score value -->
                        <tr>
                          <td style="padding: 24px 20px 8px 20px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="vertical-align: middle;">
                                  <span style="font-size: 56px; font-weight: 900; color: ${tier.color}; line-height: 1; font-variant-numeric: tabular-nums;">${score}</span>
                                  <span style="font-size: 20px; color: #9ca3af; font-weight: 400;">/100</span>
                                </td>
                                <td style="vertical-align: middle; text-align: right;">
                                  <span style="display: inline-block; background: ${tier.bg}; color: ${tier.color}; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 20px; letter-spacing: 0.3px;">${tier.label}</span>
                                </td>
                              </tr>
                            </table>
                            <!-- Progress bar -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 14px; margin-bottom: 4px;">
                              <tr>
                                <td style="background: #f3f4f6; border-radius: 999px; height: 8px; overflow: hidden;">
                                  <div style="width: ${barWidth}%; height: 8px; background: ${tier.bar}; border-radius: 999px;"></div>
                                </td>
                              </tr>
                            </table>
                            <div style="font-size: 12px; color: #9ca3af; margin-top: 8px;">Based on your ${answers?.erp || 'ERP'} configuration and ${answers?.useCase || 'selected workflows'}</div>
                          </td>
                        </tr>
                        <!-- Total savings -->
                        <tr>
                          <td style="padding: 0 20px 20px 20px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; margin-top: 8px;">
                              <tr>
                                <td style="padding: 14px 18px;">
                                  <div style="font-size: 11px; color: #065f46; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">Total Estimated Annual Savings Potential</div>
                                  <div style="font-size: 32px; font-weight: 900; color: #059669; letter-spacing: -1px;">${fmtK(totalSavings)}<span style="font-size: 16px; font-weight: 500; color: #6ee7b7;">/yr</span></div>
                                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Across ${topRecs.length} identified automation opportunities</div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- ── SUMMARY ── -->
                  <tr>
                    <td style="padding: 0 32px 24px 32px;">
                      <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.75; border-left: 3px solid #06b6d4; padding-left: 14px;">${result.summary}</p>
                    </td>
                  </tr>

                  <!-- ── RECOMMENDATIONS TABLE ── -->
                  <tr>
                    <td style="padding: 0 32px 24px 32px;">
                      <div style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 12px;">Your Personalised AI Automation Roadmap</div>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                        <tr>
                          <td style="background: #f9fafb; padding: 10px 16px; border-bottom: 1px solid #e5e7eb;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px;">Capability</td>
                                <td style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; text-align: right;">Est. Savings</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tbody>${recRows}</tbody>
                      </table>
                    </td>
                  </tr>

                  <!-- ── WHAT HAPPENS NEXT ── -->
                  <tr>
                    <td style="padding: 0 32px 24px 32px;">
                      <div style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 14px;">What Happens Next</div>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding: 0 14px 14px 0; vertical-align: top; width: 28px; color: #06b6d4; font-size: 15px; font-weight: 800;">01</td>
                          <td style="padding-bottom: 14px; font-size: 14px; color: #374151; line-height: 1.6;"><strong>Validate your numbers.</strong> Run your specific invoice volumes and team size through our full <a href="https://flowtaris.ai/roi-calculator?erp=${encodeURIComponent(answers?.erp || '')}" style="color: #06b6d4; text-decoration: underline;">ROI Calculator</a> for a 3-year financial model.</td>
                        </tr>
                        <tr>
                          <td style="padding: 0 14px 14px 0; vertical-align: top; width: 28px; color: #06b6d4; font-size: 15px; font-weight: 800;">02</td>
                          <td style="padding-bottom: 14px; font-size: 14px; color: #374151; line-height: 1.6;"><strong>See it live on your data.</strong> <a href="https://flowtaris.ai/demo" style="color: #06b6d4; text-decoration: underline;">Book a 30-minute technical session</a> — we'll demo automation on your actual ${answers?.erp || 'ERP'} workflow with no commitment.</td>
                        </tr>
                        <tr>
                          <td style="padding: 0 14px 0 0; vertical-align: top; width: 28px; color: #06b6d4; font-size: 15px; font-weight: 800;">03</td>
                          <td style="font-size: 14px; color: #374151; line-height: 1.6;"><strong>Start small, scale fast.</strong> Our pilots typically go live within 3 weeks — scoped to one process, zero infrastructure risk, with measurable ROI from week one.</td>
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
                            <a href="https://flowtaris.ai/roi-calculator?erp=${encodeURIComponent(answers?.erp || '')}" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: -0.2px;">Build Your ROI Model →</a>
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
                      Looking forward to showing you what this looks like on your data.<br><br>
                      Best,<br>
                      <strong>Flowtaris Team</strong><br>
                      <span style="font-size: 13px; color: #9ca3af; font-style: italic;">The Science of Business Flow</span><br>
                      <span style="font-size: 13px; color: #9ca3af;"><a href="https://flowtaris.ai" style="color: #9ca3af; text-decoration: underline;">flowtaris.ai</a> &nbsp;·&nbsp; <a href="https://flowtaris.ai/demo" style="color: #9ca3af; text-decoration: underline;">Book a call</a></span>
                    </td>
                  </tr>

                  <!-- ── FOOTER / DISCLAIMER ── -->
                  <tr>
                    <td style="background: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; font-size: 11px; color: #9ca3af; line-height: 1.6;">
                        <em>Savings estimates are illustrative, based on publicly available industry benchmarks for ${answers?.erp || 'ERP'} deployments. Actual results depend on your specific data quality, process configuration, and implementation scope. These are not guarantees of financial performance.</em>
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 11px; color: #d1d5db;">You received this because you completed an AI Readiness Assessment at flowtaris.ai.</p>
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
        `You've completed your Flowtaris AI Readiness Assessment. Here are your results for ${answers?.erp || 'your ERP'} environment:`,
        ``,
        `YOUR AI READINESS SCORE`,
        `Score: ${score}/100 — ${tier.label}`,
        `Total Estimated Annual Savings: ${fmtK(totalSavings)}/yr`,
        ``,
        result.summary,
        ``,
        `YOUR PERSONALISED ROADMAP`,
        ...topRecs.map((rec: { capability: string; estimatedSavings: number; timeline: string }, i: number) =>
          `${i + 1}. ${rec.capability} — ${fmtK(rec.estimatedSavings)}/yr (${rec.timeline})`
        ),
        ``,
        `WHAT HAPPENS NEXT`,
        ``,
        `01. Validate your numbers: https://flowtaris.ai/roi-calculator?erp=${encodeURIComponent(answers?.erp || '')}`,
        `02. See it live on your data — book a 30-min technical session: https://flowtaris.ai/demo`,
        `03. Start small, scale fast. Pilots go live in 3 weeks with zero infrastructure risk.`,
        ``,
        `Looking forward to showing you what this looks like on your data.`,
        ``,
        `Best,`,
        `Flowtaris Team`,
        `The Science of Business Flow`,
        `https://flowtaris.ai`,
        ``,
        `---`,
        `Estimates are illustrative, based on publicly available industry benchmarks. Not a guarantee of financial performance.`,
      ].join('\n')

      const supportEmail = process.env.FLOWTARIS_SUPPORT_EMAIL || 'support@flowtaris.com'
      const adminEmail = process.env.FLOWTARIS_ADMIN_EMAIL

      const { error: emailError } = await resend.emails.send({
        from: `Flowtaris Team <${supportEmail}>`,
        to: [email],
        subject: `Your ${answers?.erp || 'AI'} Readiness Report — ${score}/100`,
        html: emailHtml,
        text: emailText,
        headers: {
          'X-Entity-Ref-ID': `assessment-${Date.now()}`,
        },
      })

      if (emailError) {
        console.error('Resend error:', emailError)
      }

      // ─── ADMIN NOTIFICATION ───────────────────────────────────────────────
      if (adminEmail) {
        const quickWinCount = (result.recommendations || []).filter((r: { category: string }) => r.category === 'quick-win').length
        const adminHtml = `
          <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; color: #111;">
            <div style="background: #09090b; color: white; padding: 18px 24px; border-radius: 8px 8px 0 0;">
              <span style="font-size: 10px; font-weight: 700; color: #06b6d4; text-transform: uppercase; letter-spacing: 1px;">New Assessment Lead</span>
              <h2 style="margin: 6px 0 0 0; font-size: 18px;">🎯 ${score >= 70 ? 'HOT' : score >= 45 ? 'WARM' : 'COLD'} LEAD — Score ${score}/100</h2>
            </div>
            <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr><td style="padding: 8px 0; width: 130px; color: #6b7280; font-size: 14px;">Email</td><td style="font-weight: 700;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">ERP Platform</td><td style="font-weight: 700;">${answers?.erp || 'Unknown'}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">AI Score</td><td style="font-weight: 700; color: ${tier.color};">${score}/100 (${tier.label})</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Est. Savings</td><td style="font-weight: 700; color: #059669;">${fmtK(totalSavings)}/yr</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Quick Wins</td><td style="font-weight: 700;">${quickWinCount} identified</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Top Capability</td><td style="font-weight: 700;">${topRecs[0]?.capability || 'N/A'}</td></tr>
              </table>
              <div style="background: #f8fafc; padding: 14px 16px; border-radius: 6px; font-size: 13px; color: #475569; line-height: 1.5;">
                <strong>Action Required:</strong> Lead received their personalised ${answers?.erp || ''} roadmap. Recommend outreach within 24h — look up domain, then offer a targeted pilot on their top quick-win process.
              </div>
            </div>
          </div>
        `
        await resend.emails.send({
          from: `Flowtaris Alerts <${supportEmail}>`,
          to: adminEmail.split(',').map(e => e.trim()),
          subject: `${score >= 70 ? '🔥' : score >= 45 ? '⚡' : '📋'} Assessment Lead: ${email} — ${score}/100`,
          html: adminHtml,
          text: `New assessment lead: ${email}\nScore: ${score}/100 (${tier.label})\nERP: ${answers?.erp || 'Unknown'}\nEst. Savings: ${fmtK(totalSavings)}/yr\nTop capability: ${topRecs[0]?.capability || 'N/A'}`
        }).catch(err => console.error('Admin email error:', err))
      }
    } else {
      console.log('RESEND_API_KEY not set or no result data. Skipping email.')
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Assessment API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}