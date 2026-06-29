import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { appointmentId } = await req.json()

    if (!appointmentId) {
      return NextResponse.json({ error: 'appointmentId is required' }, { status: 400 })
    }

    const appointment = await db.appointment.findUnique({ where: { id: appointmentId } })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    if (appointment.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Cannot confirm a cancelled appointment' }, { status: 400 })
    }

    if (appointment.status === 'CONFIRMED') {
      return NextResponse.json({ error: 'Appointment is already confirmed' }, { status: 400 })
    }

    const updated = await db.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CONFIRMED' },
      include: {
        patient: { select: { id: true, name: true, phone: true } },
        doctor: { include: { user: { select: { name: true } }, department: { select: { name: true } } } },
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to confirm appointment' }, { status: 500 })
  }
}