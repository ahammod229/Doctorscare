import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const departments = await db.department.findMany({
      include: { _count: { select: { doctors: true } } },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(departments)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch departments' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, icon } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    const existing = await db.department.findUnique({ where: { name } })
    if (existing) {
      return NextResponse.json({ error: 'Department with this name already exists' }, { status: 409 })
    }

    const department = await db.department.create({
      data: { name, description, icon },
    })

    return NextResponse.json(department, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create department' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, description, icon } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const department = await db.department.findUnique({ where: { id } })
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 })
    }

    // If name is being changed, check uniqueness
    if (name && name !== department.name) {
      const existing = await db.department.findUnique({ where: { name } })
      if (existing) {
        return NextResponse.json({ error: 'Department with this name already exists' }, { status: 409 })
      }
    }

    const updated = await db.department.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update department' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const department = await db.department.findUnique({
      where: { id },
      include: { _count: { select: { doctors: true } } },
    })

    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 })
    }

    if (department._count.doctors > 0) {
      return NextResponse.json({ error: 'Cannot delete department with associated doctors' }, { status: 400 })
    }

    await db.department.delete({ where: { id } })

    return NextResponse.json({ message: 'Department deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete department' }, { status: 500 })
  }
}