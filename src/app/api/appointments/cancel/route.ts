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
      return NextResponse.json({ error: 'Appointment is already cancelled' }, { status: 400 })
    }

    const updated = await db.$transaction(async (tx) => {
      // Free the timeslot
      const slot = await tx.doctorTimeSlot.findFirst({
        where: { doctorId: appointment.doctorId, date: appointment.date, startTime: appointment.timeSlot, isBooked: true },
      })

      if (slot) {
        await tx.doctorTimeSlot.update({
          where: { id: slot.id },
          data: { isBooked: false },
        })
      }

      return tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CANCELLED' },
        include: {
          patient: { select: { id: true, name: true, phone: true } },
          doctor: { include: { user: { select: { name: true } }, department: { select: { name: true } } } },
        },
      })
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to cancel appointment' }, { status: 500 })
  }
}