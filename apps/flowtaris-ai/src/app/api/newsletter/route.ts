import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (resend) {
      const supportEmail = process.env.FLOWTARIS_SUPPORT_EMAIL || 'support@flowtaris.com'
      const adminEmail = process.env.FLOWTARIS_ADMIN_EMAIL

      // ─── ADMIN NOTIFICATION ───
      if (adminEmail) {
        await resend.emails.send({
          from: `Flowtaris Alerts <${supportEmail}>`,
          to: adminEmail.split(',').map(e => e.trim()),
          subject: `🔔 New Newsletter Subscriber: ${email}`,
          html: `
            <h2>New Newsletter Subscriber</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Source:</strong> Footer Subscription</p>
          `,
        }).catch(err => console.error('Admin email error:', err))
      }

      // ─── CLIENT CONFIRMATION ───
      await resend.emails.send({
        from: `Flowtaris AI <${supportEmail}>`,
        to: [email],
        subject: `Welcome to Flowtaris AI Insights`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a2e;">
            <h2 style="margin: 0 0 8px;">Welcome,</h2>
            <p style="color: #374151; line-height: 1.7;">You're on the list! Thank you for subscribing to Flowtaris AI insights.</p>
            <p style="color: #374151; line-height: 1.7;">We'll periodically send you our latest research, ERP automation strategies, and platform updates.</p>
            <p style="color: #374151; line-height: 1.7;">In the meantime, you can explore how we automate finance operations at <a href="https://flowtaris.ai" style="color: #0ea5e9;">flowtaris.ai</a>.</p>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 32px;">— The Flowtaris Team</p>
          </div>
        `,
      }).catch(err => console.error('Client email error:', err))
    } else {
      console.log('RESEND_API_KEY not set. Skipping newsletter email send.')
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Newsletter API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
