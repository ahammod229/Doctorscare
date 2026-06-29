import { compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    const user = await db.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    const valid = await compare(password, user.password)
    if (!valid) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    const doctor = user.role === 'DOCTOR' ? await db.doctor.findUnique({ where: { userId: user.id }, include: { department: true } }) : null
    return NextResponse.json({
      id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone,
      doctor: doctor ? { id: doctor.id, specialty: doctor.specialty, qualification: doctor.qualification, experience: doctor.experience, fee: doctor.fee, department: doctor.department, availableDays: doctor.availableDays, startTime: doctor.startTime, endTime: doctor.endTime } : null,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 })
  }
}