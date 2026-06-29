import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const departmentId = searchParams.get('departmentId')
  const search = searchParams.get('search')
  const where: any = {}
  if (departmentId) where.departmentId = departmentId
  if (search) where.user = { name: { contains: search } }
  const doctors = await db.doctor.findMany({
    where,
    include: { user: true, department: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(doctors)
}