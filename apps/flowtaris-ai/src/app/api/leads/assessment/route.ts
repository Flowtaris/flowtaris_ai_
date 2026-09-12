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

    // 1. Update Supabase record with email
    if (id) {
      const supabase = createServerClient()
      const { error: dbError } = await supabase
        .from('assessment_leads')
        .update({ email })
        .eq('id', id)

      if (dbError) {
        console.error('Supabase error:', dbError)
        // Don't block email from sending
      }
    }

    // 2. Send email via Resend
    if (resend && result) {
      const fmtK = (v: number) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${Math.round(v).toLocaleString()}`
      const quickWins = (result.recommendations || []).filter((r: { category: string }) => r.category === 'quick-win')
      const strategic = (result.recommendations || []).filter((r: { category: string }) => r.category === 'strategic')

      const recHtml = (result.recommendations || []).slice(0, 5).map((rec: {
        capability: string
        category: string
        timeline: string
        estimatedSavings: number
        description: string
      }) => `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #1f2937;">
            <div style="font-weight: 600; color: #f9fafb; font-size: 14px;">${rec.capability}</div>
            <div style="color: #6b7280; font-size: 12px; margin-top: 2px;">${rec.description}</div>
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #1f2937; text-align: right; white-space: nowrap;">
            <div style="font-family: monospace; font-weight: 700; color: #10b981; font-size: 14px;">${fmtK(rec.estimatedSavings)}/yr</div>
            <div style="color: #6b7280; font-size: 11px; margin-top: 1px;">${rec.timeline}</div>
          </td>
        </tr>
      `).join('')

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">FLOWTARIS AI</div>
              <div style="color: #6b7280; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px;">Strategic Intelligence Report</div>
            </div>

            <!-- Hero Score Card -->
            <div style="background: linear-gradient(135deg, #0c4a6e22, #064e3b22); border: 1px solid #0891b244; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
              <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">YOUR AI READINESS SCORE</div>
              <div style="font-size: 72px; font-weight: 900; font-family: monospace; color: ${result.leadScore >= 70 ? '#10b981' : result.leadScore >= 45 ? '#f59e0b' : '#ef4444'}; line-height: 1;">${result.leadScore}</div>
              <div style="font-size: 12px; color: #6b7280; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px;">out of 100</div>
              <div style="margin-top: 24px; background: #0f172a; border-radius: 12px; padding: 20px; display: inline-block; min-width: 280px;">
                <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">Total Estimated Annual Savings</div>
                <div style="font-size: 40px; font-weight: 900; font-family: monospace; color: #10b981;">${fmtK(result.totalEstimatedSavings)}</div>
              </div>
            </div>

            <!-- Summary -->
            <div style="background: #0f172a; border: 1px solid #1f2937; border-radius: 12px; padding: 20px; margin-bottom: 24px; color: #94a3b8; font-size: 14px; line-height: 1.6;">
              ${result.summary}
            </div>

            <!-- Recommendations Table -->
            <div style="margin-bottom: 24px;">
              <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Your AI Automation Roadmap</div>
              <table style="width: 100%; border-collapse: collapse; background: #0f172a; border-radius: 12px; overflow: hidden; border: 1px solid #1f2937;">
                <thead>
                  <tr style="background: #1f2937;">
                    <th style="padding: 10px 16px; text-align: left; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Capability</th>
                    <th style="padding: 10px 16px; text-align: right; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Savings</th>
                  </tr>
                </thead>
                <tbody>
                  ${recHtml}
                </tbody>
              </table>
            </div>

            <!-- CTA Buttons -->
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="https://flowtaris.ai/roi-calculator?erp=${encodeURIComponent(answers?.erp || '')}" style="display: inline-block; background: #06b6d4; color: #000; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; margin: 0 8px 12px;">Calculate Full ROI</a>
              <a href="https://flowtaris.ai/demo" style="display: inline-block; background: #0f172a; color: #f9fafb; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; border: 1px solid #374151; margin: 0 8px 12px;">Book a Live Demo</a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #4b5563; font-size: 12px; border-top: 1px solid #1f2937; padding-top: 24px;">
              <div style="margin-bottom: 8px; font-weight: 600; color: #6b7280;">Flowtaris AI — Intelligent Finance Operations</div>
              <div>You received this because you completed an AI Readiness Assessment on flowtaris.ai</div>
            </div>
          </div>
        </body>
        </html>
      `

      const supportEmail = process.env.FLOWTARIS_SUPPORT_EMAIL || 'support@flowtaris.com'
      const adminEmail = process.env.FLOWTARIS_ADMIN_EMAIL

      const { error: emailError } = await resend.emails.send({
        from: `Flowtaris AI <${supportEmail}>`,
        to: [email],
        subject: `Your Flowtaris AI Readiness Report — Score: ${result.leadScore}/100`,
        html: emailHtml,
      })

      if (emailError) {
        console.error('Resend error:', emailError)
        // Still return success if DB save worked — don't fail the whole request
      }

      // ─── ADMIN NOTIFICATION ───
      if (adminEmail) {
        const adminHtml = `
          <h2>New Assessment Lead</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Score:</strong> ${result.leadScore}/100</p>
          <p><strong>Top Recommendation:</strong> ${result.matches[0]?.title || 'N/A'}</p>
        `
        await resend.emails.send({
          from: `Flowtaris Alerts <${supportEmail}>`,
          to: adminEmail.split(',').map(e => e.trim()),
          subject: `🔥 New Assessment Lead: ${email}`,
          html: adminHtml,
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