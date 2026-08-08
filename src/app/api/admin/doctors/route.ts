import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const doctors = await db.doctor.findMany({
      include: { user: true, department: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(doctors)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch doctors' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, specialty, qualification, experience, fee, departmentId, availableDays, startTime, endTime } = await req.json()

    if (!name || !email || !password || !specialty || !departmentId) {
      return NextResponse.json({ error: 'name, email, password, specialty, and departmentId are required' }, { status: 400 })
    }

    // Check if department exists
    const department = await db.department.findUnique({ where: { id: departmentId } })
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 })
    }

    // Check if email already exists
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10)

    const doctor = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, password: hashedPassword, phone, role: 'DOCTOR' },
      })

      return tx.doctor.create({
        data: {
          userId: user.id,
          specialty,
          qualification,
          experience: experience || 0,
          bio: '',
          fee: fee || 0,
          departmentId,
          availableDays: availableDays || 'Mon,Tue,Wed,Thu,Fri',
          startTime: startTime || '09:00',
          endTime: endTime || '17:00',
        },
        include: { user: true, department: true },
      })
    })

    return NextResponse.json(doctor, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create doctor' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { doctorId, name, email, password, phone, specialty, qualification, experience, fee, departmentId, availableDays, startTime, endTime } = await req.json()

    if (!doctorId) {
      return NextResponse.json({ error: 'doctorId is required' }, { status: 400 })
    }

    const doctor = await db.doctor.findUnique({ where: { id: doctorId }, include: { user: true } })
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    let hashedPassword = undefined
    if (password && password.trim() !== '') {
      hashedPassword = await hash(password, 10)
    }

    const updated = await db.$transaction(async (tx) => {
      // Update user fields
      await tx.user.update({
        where: { id: doctor.userId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(hashedPassword && { password: hashedPassword }),
          ...(phone !== undefined && { phone }),
        },
      })

      // Update doctor fields
      return tx.doctor.update({
        where: { id: doctorId },
        data: {
          ...(specialty && { specialty }),
          ...(qualification !== undefined && { qualification }),
          ...(experience !== undefined && { experience }),
          ...(fee !== undefined && { fee }),
          ...(departmentId && { departmentId }),
          ...(availableDays && { availableDays }),
          ...(startTime && { startTime }),
          ...(endTime && { endTime }),
        },
        include: { user: true, department: true },
      })
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update doctor' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { doctorId } = await req.json()

    if (!doctorId) {
      return NextResponse.json({ error: 'doctorId is required' }, { status: 400 })
    }

    const doctor = await db.doctor.findUnique({ where: { id: doctorId } })
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    await db.$transaction(async (tx) => {
      await tx.doctor.delete({ where: { id: doctorId } })
      await tx.user.delete({ where: { id: doctor.userId } })
    })

    return NextResponse.json({ message: 'Doctor deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete doctor' }, { status: 500 })
  }
}