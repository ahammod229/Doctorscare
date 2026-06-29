import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get('patientId')
  const doctorId = searchParams.get('doctorId')
  const status = searchParams.get('status')
  const where: any = {}
  if (patientId) where.patientId = patientId
  if (doctorId) where.doctorId = doctorId
  if (status) where.status = status
  const appointments = await db.appointment.findMany({
    where,
    include: { patient: { select: { id: true, name: true, phone: true } }, doctor: { include: { user: { select: { name: true } }, department: { select: { name: true } } } }, prescription: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(appointments)
}