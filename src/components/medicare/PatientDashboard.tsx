'use client'
import { useEffect, useState } from 'react'
import { useApp } from './AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Search, XCircle, FileText, ArrowRight, CheckCircle2, AlertCircle, Hourglass } from 'lucide-react'

const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export function PatientDashboard() {
  const { user, appointments, loadAppointments, loadStats, stats, cancelAppointment, setView, selectAppointment } = useApp()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    if (user?.id) { loadAppointments(user.id); loadStats() }
  }, [user?.id])

  const today = new Date().toISOString().split('T')[0]
  const upcoming = appointments.filter(a => a.date >= today && a.status !== 'CANCELLED' && a.status !== 'COMPLETED')
  const past = appointments.filter(a => a.date < today || a.status === 'COMPLETED' || a.status === 'CANCELLED')
  const list = tab === 'upcoming' ? upcoming : past

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name} 👋</h1>
          <p className="text-slate-500 mt-1">Manage your appointments and health records</p>
        </div>
        <Button className="gradient-medical text-white border-0" onClick={() => setView('browse-doctors')}>
          <Search className="w-4 h-4 mr-2" /> Find Doctors
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Appointments', value: appointments.length, icon: <Calendar className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pending', value: appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length, icon: <Hourglass className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50' },
          { label: 'Completed', value: appointments.filter(a => a.status === 'COMPLETED').length, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Cancelled', value: appointments.filter(a => a.status === 'CANCELLED').length, icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-600 bg-red-50' },
        ].map((s, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <Button variant={tab === 'upcoming' ? 'default' : 'outline'} size="sm"
          className={tab === 'upcoming' ? 'gradient-medical text-white border-0' : ''}
          onClick={() => setTab('upcoming')}>Upcoming ({upcoming.length})</Button>
        <Button variant={tab === 'past' ? 'default' : 'outline'} size="sm"
          className={tab === 'past' ? 'gradient-medical text-white border-0' : ''}
          onClick={() => setTab('past')}>Past ({past.length})</Button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {list.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No {tab} appointments found</p>
            </CardContent>
          </Card>
        )}
        {list.map(apt => (
          <Card key={apt.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {apt.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                   apt.status === 'CANCELLED' ? <XCircle className="w-5 h-5 text-red-400" /> :
                   <Clock className="w-5 h-5 text-blue-500" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{apt.doctor?.user?.name}</p>
                  <p className="text-sm text-slate-500">{apt.doctor?.specialty} — {apt.doctor?.department?.name}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {apt.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.timeSlot}</span>
                    {apt.reason && <span>Reason: {apt.reason}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:flex-shrink-0">
                <Badge className={statusColor[apt.status]}>{apt.status}</Badge>
                {apt.prescription && (
                  <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    onClick={() => { selectAppointment(apt); setView('appointment-detail') }}>
                    <FileText className="w-3.5 h-3.5 mr-1" /> Rx
                  </Button>
                )}
                {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                  <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50"
                    onClick={() => cancelAppointment(apt.id).then(() => loadAppointments(user?.id))}>
                    <XCircle className="w-3.5 h-3.5" />
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => { selectAppointment(apt); setView('appointment-detail') }}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}