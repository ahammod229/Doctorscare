import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { appointmentId, doctorId, patientId, diagnosis, medications, instructions, followUpDate } = await req.json()

    if (!appointmentId || !doctorId || !patientId || !diagnosis || !medications) {
      return NextResponse.json({ error: 'appointmentId, doctorId, patientId, diagnosis, and medications are required' }, { status: 400 })
    }

    // Check if prescription already exists for this appointment
    const existing = await db.prescription.findUnique({ where: { appointmentId } })
    if (existing) {
      return NextResponse.json({ error: 'Prescription already exists for this appointment' }, { status: 409 })
    }

    const prescription = await db.prescription.create({
      data: {
        appointmentId,
        doctorId,
        patientId,
        diagnosis,
        medications: typeof medications === 'string' ? medications : JSON.stringify(medications),
        instructions,
        followUpDate,
      },
    })

    return NextResponse.json(prescription, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create prescription' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const appointmentId = searchParams.get('appointmentId')

    if (!appointmentId) {
      return NextResponse.json({ error: 'appointmentId query parameter is required' }, { status: 400 })
    }

    const prescription = await db.prescription.findUnique({
      where: { appointmentId },
      include: {
        doctor: { select: { id: true, name: true, email: true, phone: true, role: true } },
      },
    })

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 })
    }

    return NextResponse.json(prescription)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch prescription' }, { status: 500 })
  }
}