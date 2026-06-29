import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    if (status) where.status = status
    if (date) where.date = date

    const [appointments, total] = await Promise.all([
      db.appointment.findMany({
        where,
        include: {
          patient: { select: { id: true, name: true, email: true, phone: true, role: true } },
          doctor: {
            include: {
              user: { select: { id: true, name: true, email: true, phone: true } },
              department: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.appointment.count({ where }),
    ])

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch appointments' }, { status: 500 })
  }
}