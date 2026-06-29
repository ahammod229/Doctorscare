import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { patientId, doctorId, date, timeSlot, reason } = await req.json()

    if (!patientId || !doctorId || !date || !timeSlot) {
      return NextResponse.json({ error: 'patientId, doctorId, date, and timeSlot are required' }, { status: 400 })
    }

    // Check if the time slot is already booked
    const existingSlot = await db.doctorTimeSlot.findFirst({
      where: { doctorId, date, startTime: timeSlot, isBooked: true },
    })

    if (existingSlot) {
      return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 })
    }

    // Create appointment and mark timeslot as booked in a transaction
    const appointment = await db.$transaction(async (tx) => {
      // Find the timeslot entry
      const slot = await tx.doctorTimeSlot.findFirst({
        where: { doctorId, date, startTime: timeSlot },
      })

      if (slot) {
        await tx.doctorTimeSlot.update({
          where: { id: slot.id },
          data: { isBooked: true },
        })
      }

      return tx.appointment.create({
        data: { patientId, doctorId, date, timeSlot, reason, status: 'PENDING' },
        include: {
          patient: { select: { id: true, name: true, phone: true } },
          doctor: { include: { user: { select: { name: true } }, department: { select: { name: true } } } },
        },
      })
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to book appointment' }, { status: 500 })
  }
}