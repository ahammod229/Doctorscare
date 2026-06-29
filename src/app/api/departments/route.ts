import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const departments = await db.department.findMany({ include: { _count: { select: { doctors: true } } }, orderBy: { name: 'asc' } })
  return NextResponse.json(departments)
}