'use client'
import { useEffect, useState } from 'react'
import { useApp } from './AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Calendar, Clock, User, Stethoscope, FileText, Filter } from 'lucide-react'

const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700', CANCELLED: 'bg-red-100 text-red-700',
}

export function AdminAppointments() {
  const { appointments, refreshAdminAppointments, confirmAppointment, completeAppointment, cancelAppointment, showToast } = useApp()
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => { refreshAdminAppointments(statusFilter || undefined, dateFilter || undefined) }, [statusFilter, dateFilter])

  const filtered = appointments.filter(a => {
    if (search) {
      const s = search.toLowerCase()
      const match = a.patient?.name?.toLowerCase().includes(s) || a.doctor?.user?.name?.toLowerCase().includes(s) || a.doctor?.specialty?.toLowerCase().includes(s)
      if (!match) return false
    }
    return true
  })

  const handleAction = async (id: string, action: () => Promise<boolean>) => {
    await action(id)
    refreshAdminAppointments(statusFilter || undefined, dateFilter || undefined)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">All Appointments</h1>
        <p className="text-slate-500 mt-1">{filtered.length} appointments</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search patient or doctor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 border-blue-200" />
        </div>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-44 border-blue-200"><Filter className="w-4 h-4 mr-2 text-slate-400" /><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full sm:w-44 border-blue-200" />
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left p-3 font-semibold text-slate-600">Patient</th>
                <th className="text-left p-3 font-semibold text-slate-600">Doctor</th>
                <th className="text-left p-3 font-semibold text-slate-600">Date</th>
                <th className="text-left p-3 font-semibold text-slate-600">Time</th>
                <th className="text-left p-3 font-semibold text-slate-600">Status</th>
                <th className="text-left p-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">No appointments found</td></tr>
              )}
              {filtered.map(apt => (
                <tr key={apt.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                        {apt.patient?.name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">{apt.patient?.name}</p>
                        <p className="text-xs text-slate-400">{apt.patient?.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-slate-700">{apt.doctor?.user?.name}</p>
                    <p className="text-xs text-blue-500">{apt.doctor?.specialty}</p>
                  </td>
                  <td className="p-3 text-slate-600"><Calendar className="w-3 h-3 inline mr-1" />{apt.date}</td>
                  <td className="p-3 text-slate-600"><Clock className="w-3 h-3 inline mr-1" />{apt.timeSlot}</td>
                  <td className="p-3"><Badge className={statusColor[apt.status]}>{apt.status}</Badge></td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {apt.status === 'PENDING' && (
                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs h-7"
                          onClick={() => handleAction(apt.id, confirmAppointment)}>Confirm</Button>
                      )}
                      {apt.status === 'CONFIRMED' && (
                        <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs h-7"
                          onClick={() => handleAction(apt.id, completeAppointment)}>Complete</Button>
                      )}
                      {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                        <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 text-xs h-7"
                          onClick={() => handleAction(apt.id, cancelAppointment)}>Cancel</Button>
                      )}
                      {apt.prescription && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs"><FileText className="w-3 h-3" /> Rx</Badge>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}