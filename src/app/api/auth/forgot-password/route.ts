import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { Resend } from 'resend'

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email } })

    // We shouldn't reveal if a user exists or not for security reasons
    if (!user) {
      return NextResponse.json({ success: true }) 
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save token to database
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Create the reset link using the actual host domain
    const origin = req.headers.get('origin') || 'https://doctorscare-dbms.vercel.app'
    const resetLink = `${origin}/?view=reset-password&token=${resetToken}`

    // Send the email via Resend
    await resend.emails.send({
      from: 'Doctors Care <support@doctorscare.online>',
      to: email,
      subject: 'Reset your Doctors Care password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #0d9488;">Doctors Care</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your password. Click the button below to choose a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">Doctors Care Application</p>
        </div>
      `
    })

    return NextResponse.json({ 
      success: true 
    })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
