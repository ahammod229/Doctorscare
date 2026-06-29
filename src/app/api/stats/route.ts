import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      completedAppointments,
      pendingAppointments,
      cancelledAppointments,
      totalDepartments,
      recentAppointments,
    ] = await Promise.all([
      db.user.count({ where: { role: 'PATIENT' } }),
      db.doctor.count(),
      db.appointment.count(),
      db.appointment.count({ where: { date: today } }),
      db.appointment.count({ where: { status: 'COMPLETED' } }),
      db.appointment.count({ where: { status: 'PENDING' } }),
      db.appointment.count({ where: { status: 'CANCELLED' } }),
      db.department.count(),
      db.appointment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          patient: { select: { id: true, name: true, phone: true } },
          doctor: {
            include: {
              user: { select: { name: true } },
              department: { select: { name: true } },
            },
          },
        },
      }),
    ])

    // Calculate total revenue from completed appointments
    const completedWithFee = await db.appointment.findMany({
      where: { status: 'COMPLETED' },
      include: { doctor: { select: { fee: true } } },
    })

    const totalRevenue = completedWithFee.reduce((sum, apt) => sum + apt.doctor.fee, 0)

    return NextResponse.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      completedAppointments,
      pendingAppointments,
      cancelledAppointments,
      totalDepartments,
      totalRevenue,
      recentAppointments,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch stats' }, { status: 500 })
  }
}