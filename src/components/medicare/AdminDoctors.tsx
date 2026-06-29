'use client'
import { useEffect, useState } from 'react'
import { useApp, Department } from './AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stethoscope, Plus, Trash2, Edit, Search, GraduationCap, Briefcase, DollarSign } from 'lucide-react'

export function AdminDoctors() {
  const { doctors, loadDoctors, departments, loadDepartments, showToast } = useApp()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', specialty: '', qualification: '', experience: '0', fee: '0', departmentId: '', availableDays: 'Mon,Tue,Wed,Thu,Fri', startTime: '09:00', endTime: '17:00' })

  useEffect(() => { loadDoctors(); loadDepartments() }, [])

  const filtered = doctors.filter(d => d.user.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()))

  const api = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed')
    return data
  }

  const handleSave = async () => {
    try {
      if (editing) {
        await api('/api/admin/doctors', { method: 'PUT', body: JSON.stringify({ doctorId: editing.id, ...form, experience: parseInt(form.experience), fee: parseInt(form.fee) }) })
        showToast('Doctor updated', 'success')
      } else {
        await api('/api/admin/doctors', { method: 'POST', body: JSON.stringify({ ...form, experience: parseInt(form.experience), fee: parseInt(form.fee) }) })
        showToast('Doctor added', 'success')
      }
      setOpen(false); setEditing(null); loadDoctors()
    } catch (e: any) { showToast(e.message, 'error') }
  }

  const handleDelete = async (id: string) => {
    try { await api('/api/admin/doctors', { method: 'DELETE', body: JSON.stringify({ doctorId: id }) }); showToast('Doctor removed', 'info'); loadDoctors() }
    catch (e: any) { showToast(e.message, 'error') }
  }

  const openEdit = (d: any) => {
    setEditing(d)
    setForm({ name: d.user.name, email: d.user.email, password: '', phone: d.user.phone || '', specialty: d.specialty, qualification: d.qualification || '', experience: String(d.experience), fee: String(d.fee), departmentId: d.departmentId, availableDays: d.availableDays, startTime: d.startTime, endTime: d.endTime })
    setOpen(true)
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', email: '', password: '', phone: '', specialty: '', qualification: '', experience: '0', fee: '0', departmentId: departments[0]?.id || '', availableDays: 'Mon,Tue,Wed,Thu,Fri', startTime: '09:00', endTime: '17:00' })
    setOpen(true)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Doctors</h1>
          <p className="text-slate-500 mt-1">{doctors.length} doctors registered</p>
        </div>
        <Button className="gradient-medical text-white border-0" onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Add Doctor</Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 border-blue-200" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(doc => (
          <Card key={doc.id} className="border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {doc.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{doc.user.name}</p>
                    <p className="text-sm text-blue-600">{doc.specialty}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">{doc.department.name}</Badge>
                      <Badge variant="outline" className="text-xs">{doc.experience}yr</Badge>
                      <Badge variant="outline" className="text-xs">৳{doc.fee}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:bg-blue-50" onClick={() => openEdit(doc)}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(doc.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="mt-1 border-blue-200" /></div>
            <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="mt-1 border-blue-200" /></div>
            {!editing && <div><Label>Password *</Label><Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="mt-1 border-blue-200" /></div>}
            <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="mt-1 border-blue-200" /></div>
            <div><Label>Specialty *</Label><Input value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} className="mt-1 border-blue-200" /></div>
            <div><Label>Qualification</Label><Input value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} className="mt-1 border-blue-200" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Experience (yrs)</Label><Input type="number" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} className="mt-1 border-blue-200" /></div>
              <div><Label>Fee (৳)</Label><Input type="number" value={form.fee} onChange={e => setForm(f => ({ ...f, fee: e.target.value }))} className="mt-1 border-blue-200" /></div>
            </div>
            <div><Label>Department *</Label>
              <Select value={form.departmentId} onValueChange={v => setForm(f => ({ ...f, departmentId: v }))}>
                <SelectTrigger className="mt-1 border-blue-200"><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.icon} {d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Available Days</Label><Input value={form.availableDays} onChange={e => setForm(f => ({ ...f, availableDays: e.target.value }))} placeholder="Mon,Tue,Wed" className="mt-1 border-blue-200" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start Time</Label><Input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} className="mt-1 border-blue-200" /></div>
              <div><Label>End Time</Label><Input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className="mt-1 border-blue-200" /></div>
            </div>
            <Button className="w-full gradient-medical text-white border-0" onClick={handleSave}>{editing ? 'Update Doctor' : 'Add Doctor'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}