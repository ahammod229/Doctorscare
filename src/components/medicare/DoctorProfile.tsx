'use client'
import { useEffect, useState } from 'react'
import { useApp } from './AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, DollarSign, Briefcase, GraduationCap, MapPin, Star } from 'lucide-react'

export function DoctorProfile() {
  const { selectedDoctor: doc, timeSlots, loadTimeSlots, bookAppointment, user, setView } = useApp()
  const [date, setDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [reason, setReason] = useState('')
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    if (date && doc) loadTimeSlots(doc.id, date)
  }, [date, doc?.id])

  if (!doc) return null

  const available = timeSlots.filter(s => !s.isBooked)

  const handleBook = async () => {
    if (!user || !selectedSlot || !date) return
    setBooking(true)
    const ok = await bookAppointment({ patientId: user.id, doctorId: doc.id, date, timeSlot: selectedSlot, reason })
    setBooking(false)
    if (ok) setView('patient-dashboard')
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <Button variant="ghost" className="mb-4 text-slate-500" onClick={() => setView('browse-doctors')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Doctors
      </Button>

      {/* Doctor Info */}
      <Card className="border-0 shadow-md mb-6 overflow-hidden">
        <div className="gradient-hero p-6 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
              {doc.user.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">{doc.user.name}</h1>
              <p className="text-blue-200 mt-1">{doc.specialty}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <Badge className="bg-white/20 text-white border-0">{doc.department.name}</Badge>
                {doc.qualification && <Badge className="bg-white/20 text-white border-0">{doc.qualification}</Badge>}
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <div><p className="text-slate-400 text-xs">Experience</p><p className="font-semibold text-slate-700">{doc.experience} years</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <div><p className="text-slate-400 text-xs">Consultation Fee</p><p className="font-semibold text-slate-700">৳{doc.fee}</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-sky-50">
              <MapPin className="w-5 h-5 text-sky-500" />
              <div><p className="text-slate-400 text-xs">Department</p><p className="font-semibold text-slate-700">{doc.department.name}</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50">
              <Clock className="w-5 h-5 text-amber-500" />
              <div><p className="text-slate-400 text-xs">Available Days</p><p className="font-semibold text-slate-700">{doc.availableDays}</p></div>
            </div>
          </div>
          {doc.bio && <p className="mt-4 text-sm text-slate-500 leading-relaxed">{doc.bio}</p>}
        </CardContent>
      </Card>

      {/* Booking */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Book Appointment</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-700 font-medium">Select Date</Label>
              <Input type="date" min={minDate} value={date} onChange={e => { setDate(e.target.value); setSelectedSlot('') }}
                className="mt-1.5 border-blue-200 focus:border-blue-400" />
            </div>

            {date && (
              <div>
                <Label className="text-slate-700 font-medium">Available Time Slots</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                  {available.length === 0 && <p className="col-span-full text-sm text-slate-400 py-4 text-center">No available slots for this date</p>}
                  {available.map(slot => (
                    <button key={slot.id} onClick={() => setSelectedSlot(slot.startTime)}
                      className={`p-2.5 rounded-lg border text-sm font-medium transition ${selectedSlot === slot.startTime ? 'gradient-medical text-white border-transparent' : 'border-blue-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50'}`}>
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="text-slate-700 font-medium">Reason for Visit</Label>
              <Textarea placeholder="Briefly describe your symptoms or reason..." value={reason} onChange={e => setReason(e.target.value)}
                className="mt-1.5 border-blue-200 focus:border-blue-400 min-h-[80px]" />
            </div>

            <Button className="w-full gradient-medical text-white border-0 font-semibold" disabled={!date || !selectedSlot || booking}
              onClick={handleBook}>
              {booking ? 'Booking...' : `Book Appointment — ৳${doc.fee}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}