'use client'
import { useEffect, useState } from 'react'
import { useApp, Department } from './AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Building2, Plus, Trash2, Edit, Stethoscope } from 'lucide-react'

export function AdminDepartments() {
  const { departments, loadDepartments, showToast } = useApp()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Department | null>(null)
  const [form, setForm] = useState({ name: '', description: '', icon: '' })

  useEffect(() => { loadDepartments() }, [])

  const api = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed')
    return data
  }

  const handleSave = async () => {
    try {
      if (editing) {
        await api('/api/admin/departments', { method: 'PUT', body: JSON.stringify({ id: editing.id, ...form }) })
        showToast('Department updated', 'success')
      } else {
        await api('/api/admin/departments', { method: 'POST', body: JSON.stringify(form) })
        showToast('Department created', 'success')
      }
      setOpen(false); setEditing(null); loadDepartments()
    } catch (e: any) { showToast(e.message, 'error') }
  }

  const handleDelete = async (id: string) => {
    try { await api('/api/admin/departments', { method: 'DELETE', body: JSON.stringify({ id }) }); showToast('Department deleted', 'info'); loadDepartments() }
    catch (e: any) { showToast(e.message, 'error') }
  }

  const icons = ['🏥', '❤️', '🧠', '🦴', '👶', '🩹', '👁️', '👂', '🧘', '🩺', '🦷', '🫀', '🫁', '🧬', '💊', '🔬']

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Departments</h1>
          <p className="text-slate-500 mt-1">{departments.length} departments</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0" onClick={() => { setEditing(null); setForm({ name: '', description: '', icon: '' }); setOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" /> Add Department
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {departments.map(dept => (
          <Card key={dept.id} className="border-0 shadow-sm hover:shadow-md transition group">
            <CardContent className="p-5 text-center">
              <div className="text-4xl mb-3">{dept.icon}</div>
              <h3 className="font-bold text-slate-800">{dept.name}</h3>
              {dept.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{dept.description}</p>}
              <Badge variant="secondary" className="mt-3">
                <Stethoscope className="w-3 h-3 mr-1" /> {dept._count?.doctors || 0} Doctors
              </Badge>
              <div className="flex justify-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                  onClick={() => { setEditing(dept); setForm({ name: dept.name, description: dept.description || '', icon: dept.icon || '' }); setOpen(true) }}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(dept.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Department' : 'Add Department'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Icon</Label>
              <div className="flex flex-wrap gap-2 mt-1">{icons.map(ic => (
                <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, icon: ic }))}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition ${form.icon === ic ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-slate-50'}`}>
                  {ic}
                </button>
              ))}</div>
            </div>
            <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="mt-1 border-blue-200" /></div>
            <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="mt-1 border-blue-200" /></div>
            <Button className="w-full gradient-medical text-white border-0" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}