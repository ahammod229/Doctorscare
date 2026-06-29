import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, role } = await req.json()
    if (!name || !email || !password || !role) return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    if (role !== 'PATIENT') return NextResponse.json({ error: 'Only patient registration allowed' }, { status: 400 })
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    const hashed = await hash(password, 10)
    const user = await db.user.create({ data: { name, email, password: hashed, phone, role } })
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 })
  }
}