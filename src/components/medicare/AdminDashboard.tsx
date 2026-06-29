'use client'
import { useEffect, useState } from 'react'
import { useApp } from './AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Users, Stethoscope, Calendar, DollarSign, Building2, CheckCircle2, XCircle, Clock, Plus, Trash2, Edit, TrendingUp, AlertCircle, FileText } from 'lucide-react'

const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700', CANCELLED: 'bg-red-100 text-red-700',
}

export function AdminDashboard() {
  const { stats, loadStats, setView } = useApp()
  useEffect(() => { loadStats() }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">System overview and management</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Doctors', value: stats?.totalDoctors || 0, icon: <Stethoscope className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50', gradient: 'from-blue-500 to-blue-600' },
          { label: 'Patients', value: stats?.totalPatients || 0, icon: <Users className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50', gradient: 'from-emerald-500 to-emerald-600' },
          { label: 'Appointments', value: stats?.totalAppointments || 0, icon: <Calendar className="w-5 h-5" />, color: 'text-sky-600 bg-sky-50', gradient: 'from-sky-500 to-sky-600' },
          { label: 'Revenue', value: `৳${stats?.totalRevenue || 0}`, icon: <DollarSign className="w-5 h-5" />, color: 'text-green-600 bg-green-50', gradient: 'from-green-500 to-green-600' },
          { label: 'Departments', value: stats?.totalDepartments || 0, icon: <Building2 className="w-5 h-5" />, color: 'text-violet-600 bg-violet-50', gradient: 'from-violet-500 to-violet-600' },
        ].map((s, i) => (
          <Card key={i} className="border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Breakdown + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-lg">Appointment Status</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Pending', value: stats?.pendingAppointments || 0, icon: <Clock className="w-5 h-5" />, color: 'bg-amber-50 border-amber-200 text-amber-600' },
                { label: 'Confirmed', value: (stats?.totalAppointments || 0) - (stats?.completedAppointments || 0) - (stats?.pendingAppointments || 0) - (stats?.cancelledAppointments || 0), icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-blue-50 border-blue-200 text-blue-600' },
                { label: 'Completed', value: stats?.completedAppointments || 0, icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
                { label: 'Cancelled', value: stats?.cancelledAppointments || 0, icon: <XCircle className="w-5 h-5" />, color: 'bg-red-50 border-red-200 text-red-600' },
              ].map((s, i) => (
                <div key={i} className={`p-4 rounded-xl border ${s.color}`}>
                  <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-sm font-medium">{s.label}</span></div>
                  <p className="text-3xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => setView('admin-doctors')}>
              <Stethoscope className="w-4 h-4 mr-2" /> Manage Doctors
            </Button>
            <Button variant="outline" className="w-full justify-start text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => setView('admin-departments')}>
              <Building2 className="w-4 h-4 mr-2" /> Manage Departments
            </Button>
            <Button variant="outline" className="w-full justify-start text-sky-600 border-sky-200 hover:bg-sky-50" onClick={() => setView('admin-appointments')}>
              <Calendar className="w-4 h-4 mr-2" /> All Appointments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Appointments</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => setView('admin-appointments')}>View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {(stats?.recentAppointments || []).map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600">
                    {apt.patient?.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{apt.patient?.name} → {apt.doctor?.user?.name}</p>
                    <p className="text-xs text-slate-400">{apt.doctor?.specialty} • {apt.date} {apt.timeSlot}</p>
                  </div>
                </div>
                <Badge className={statusColor[apt.status]}>{apt.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}