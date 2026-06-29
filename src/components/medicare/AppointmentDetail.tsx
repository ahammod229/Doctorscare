'use client'
import { useApp } from './AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, User, FileText, HeartPulse } from 'lucide-react'

export function AppointmentDetail() {
  const { selectedAppointment: apt, setView } = useApp()
  if (!apt) return null

  const statusColor: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700', CONFIRMED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-emerald-100 text-emerald-700', CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      <Button variant="ghost" className="mb-4 text-slate-500" onClick={() => setView('patient-dashboard')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Button>

      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Appointment Details</h1>
              <p className="text-sm text-slate-400 mt-1">ID: {apt.id.slice(0, 8)}</p>
            </div>
            <Badge className={statusColor[apt.status]}>{apt.status}</Badge>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-blue-50">
                <p className="text-xs text-slate-400 mb-1">Doctor</p>
                <p className="font-semibold text-slate-700">{apt.doctor?.user?.name}</p>
                <p className="text-sm text-blue-600">{apt.doctor?.specialty}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <p className="text-xs text-slate-400 mb-1">Department</p>
                <p className="font-semibold text-slate-700">{apt.doctor?.department?.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-sky-50">
                <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</p>
                <p className="font-semibold text-slate-700">{apt.date}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50">
                <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Time</p>
                <p className="font-semibold text-slate-700">{apt.timeSlot}</p>
              </div>
            </div>

            {apt.reason && (
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400 mb-1">Reason</p>
                <p className="text-sm text-slate-700">{apt.reason}</p>
              </div>
            )}

            {/* Prescription */}
            {apt.prescription && (
              <div className="border-2 border-emerald-200 rounded-xl p-5 bg-gradient-to-br from-emerald-50/50 to-white">
                <h3 className="font-bold text-emerald-700 mb-3 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5" /> Prescription
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-600">Diagnosis</p>
                    <p className="text-slate-700 mt-0.5">{apt.prescription.diagnosis}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-600">Medications</p>
                    <div className="mt-1 p-3 bg-white rounded-lg border border-emerald-100">
                      {apt.prescription.medications.split('\n').map((m, i) => (
                        <p key={i} className="text-slate-700 py-0.5 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                          {m}
                        </p>
                      ))}
                    </div>
                  </div>
                  {apt.prescription.instructions && (
                    <div>
                      <p className="font-medium text-slate-600">Instructions</p>
                      <p className="text-slate-500 mt-0.5">{apt.prescription.instructions}</p>
                    </div>
                  )}
                  {apt.prescription.followUpDate && (
                    <p className="text-xs text-emerald-600">Follow-up: {apt.prescription.followUpDate}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}