import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      // Don't leak whether the email exists or not
      return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' })
    }

    const resetToken = uuidv4()
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    await db.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    })

    // Simulate sending email by logging to console and returning in response for testing
    // In a production app, use an email provider like Resend or SendGrid here
    const resetLink = `/?view=reset-password&token=${resetToken}`
    console.log(`[Email Simulation] Reset password link for ${email}: ${resetLink}`)

    return NextResponse.json({ 
      success: true, 
      message: 'If an account exists, a reset link has been sent.',
      // Returning token only for testing purposes since no email provider is configured
      simulatedLink: resetLink 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to request password reset' }, { status: 500 })
  }
}
