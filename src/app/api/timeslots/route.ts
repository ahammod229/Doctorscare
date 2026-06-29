import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

const DAY_MAP: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
}

function generateTimeSlots(startTime: string, endTime: string): { startTime: string; endTime: string }[] {
  const slots: { startTime: string; endTime: string }[] = []
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)

  let currentMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  const slotDuration = 30 // 30-minute slots

  while (currentMinutes + slotDuration <= endMinutes) {
    const sh = Math.floor(currentMinutes / 60)
    const sm = currentMinutes % 60
    const eh = Math.floor((currentMinutes + slotDuration) / 60)
    const em = (currentMinutes + slotDuration) % 60
    slots.push({
      startTime: `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`,
      endTime: `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`,
    })
    currentMinutes += slotDuration
  }

  return slots
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const doctorId = searchParams.get('doctorId')
    const date = searchParams.get('date')

    if (!doctorId || !date) {
      return NextResponse.json({ error: 'doctorId and date query parameters are required' }, { status: 400 })
    }

    // Check if the doctor is available on this day of the week
    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    const dateObj = new Date(date + 'T00:00:00')
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayName = dayNames[dateObj.getDay()]

    const availableDays = doctor.availableDays.split(',').map((d: string) => d.trim())
    if (!availableDays.includes(dayName)) {
      return NextResponse.json({ slots: [], message: `Doctor is not available on ${dayName}` })
    }

    // Check if time slots already exist for this doctor/date
    let slots = await db.doctorTimeSlot.findMany({
      where: { doctorId, date },
      orderBy: { startTime: 'asc' },
    })

    // If no slots exist, generate them from the doctor's schedule
    if (slots.length === 0) {
      const generatedSlots = generateTimeSlots(doctor.startTime, doctor.endTime)

      if (generatedSlots.length > 0) {
        await db.doctorTimeSlot.createMany({
          data: generatedSlots.map((slot) => ({
            doctorId,
            date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false,
          })),
        })

        slots = await db.doctorTimeSlot.findMany({
          where: { doctorId, date },
          orderBy: { startTime: 'asc' },
        })
      }
    }

    // Return only available (non-booked) slots
    const availableSlots = slots.filter((s) => !s.isBooked)

    return NextResponse.json({ slots: availableSlots })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch time slots' }, { status: 500 })
  }
}