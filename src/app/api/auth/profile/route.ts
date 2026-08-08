import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { hash, compare } from 'bcryptjs'

export async function PUT(req: Request) {
  try {
    const { userId, name, email, phone, currentPassword, newPassword } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If changing password, verify current password
    let hashedPassword = undefined
    if (newPassword && newPassword.trim() !== '') {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 })
      }
      const valid = await compare(currentPassword, user.password)
      if (!valid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
      }
      hashedPassword = await hash(newPassword, 10)
    }

    // If changing email, check uniqueness
    if (email && email !== user.email) {
      const existing = await db.user.findUnique({ where: { email } })
      if (existing) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
      }
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(hashedPassword && { password: hashedPassword }),
      },
      select: { id: true, name: true, email: true, phone: true, role: true },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 })
  }
}
