'use client'
import { useState } from 'react'
import { useApp } from './AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, Lock, Save, Shield, Calendar, CheckCircle2 } from 'lucide-react'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { app } from '@/lib/firebase'

export function PatientProfile() {
  const { user, setUser, showToast, appointments } = useApp()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [saving, setSaving] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  const totalAppointments = appointments.length
  const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length
  const memberSince = user?.id ? 'Member' : ''

  const handleSave = async () => {
    if (!user) return

    if (changePassword) {
      if (!form.currentPassword) {
        showToast('Please enter your current password', 'error')
        return
      }
      if (form.newPassword.length < 6) {
        showToast('New password must be at least 6 characters', 'error')
        return
      }
      if (form.newPassword !== form.confirmPassword) {
        showToast('New passwords do not match', 'error')
        return
      }
    }

    setSaving(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          ...(changePassword && {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')

      // Update local state
      setUser({ ...user, name: data.name, email: data.email, phone: data.phone })
      showToast('Profile updated successfully!', 'success')
      setChangePassword(false)
      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }))
    } catch (e: any) {
      showToast(e.message || 'Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account settings</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="border-0 shadow-sm lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
            </div>
            <h2 className="text-lg font-bold text-slate-800">{user?.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{user?.email}</p>
            <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
              <Shield className="w-3 h-3" /> Patient
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Appointments</span>
                <span className="font-semibold text-slate-700">{totalAppointments}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>
                <span className="font-semibold text-emerald-600">{completedAppointments}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</span>
                  <span className="font-semibold text-slate-700">{user.phone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-700 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Full Name
              </Label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="mt-1 border-blue-200 focus:border-blue-400"
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label className="text-slate-700 font-medium flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="mt-1 border-blue-200 focus:border-blue-400"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label className="text-slate-700 font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Phone Number
              </Label>
              <Input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="mt-1 border-blue-200 focus:border-blue-400"
                placeholder="+880 1XXXXXXXXX"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                className={`text-sm ${changePassword ? 'text-red-500 border-red-200' : 'text-blue-600 border-blue-200'}`}
                onClick={() => {
                  setChangePassword(!changePassword)
                  setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }))
                }}
              >
                <Lock className="w-3.5 h-3.5 mr-1" />
                {changePassword ? 'Cancel Password Change' : 'Change Password'}
              </Button>
            </div>

            {changePassword && (
              <div className="space-y-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <Label className="text-slate-700 font-medium">Current Password</Label>
                  <Input
                    type="password"
                    value={form.currentPassword}
                    onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                    className="mt-1 border-blue-200"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-medium">New Password</Label>
                  <Input
                    type="password"
                    value={form.newPassword}
                    onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                    className="mt-1 border-blue-200"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-medium">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    className="mt-1 border-blue-200"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>
            )}

            <Button
              className="w-full gradient-medical text-white border-0"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
        
        {/* Medical Records Card */}
        <Card className="border-0 shadow-sm lg:col-span-3 mt-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" /> My Medical Records
            </CardTitle>
            <p className="text-sm text-slate-500">Upload your past prescriptions, lab reports, or documents so your doctor can review them before your appointment.</p>
          </CardHeader>
          <CardContent>
            <PatientDocuments patientId={user?.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PatientDocuments({ patientId }: { patientId?: string }) {
  const { showToast, api } = useApp()
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const fetchDocuments = async () => {
    if (!patientId) return;
    try {
      const data = await api(`/api/patient/documents?patientId=${patientId}`)
      setDocuments(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount
  useState(() => {
    fetchDocuments()
  })

  const handleUpload = async () => {
    if (!title || !file) {
      showToast('Please provide a title and select a file', 'error')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      showToast('File size must be less than 3MB', 'error')
      return
    }

    setUploading(true)
    try {
      // Read file as Base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      
      reader.onload = async () => {
        const base64String = reader.result as string
        
        try {
          const res = await api('/api/patient/documents', {
            method: 'POST',
            body: JSON.stringify({
              patientId,
              fileName: title,
              fileType: file.type,
              fileUrl: base64String, // We pass base64 into the fileUrl field
            })
          })
          
          showToast('Document uploaded successfully!', 'success')
          setTitle('')
          setFile(null)
          fetchDocuments()
        } catch (e: any) {
          console.error("Upload error:", e)
          showToast(e.message || 'Upload failed. Please try again.', 'error')
        } finally {
          setUploading(false)
        }
      }

      reader.onerror = () => {
        showToast('Failed to read file on your device', 'error')
        setUploading(false)
      }
      
    } catch (e: any) {
      console.error("Upload error:", e)
      showToast(e.message || 'Upload failed. Please check console.', 'error')
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    try {
      await api(`/api/patient/documents?id=${id}`, { method: 'DELETE' })
      showToast('Document deleted', 'success')
      fetchDocuments()
    } catch (e: any) {
      showToast(e.message, 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100">
        <div className="flex-1 w-full">
          <Label className="text-slate-700 font-medium">Document Title</Label>
          <Input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g. Blood Test Report 2026" 
            className="mt-1"
          />
        </div>
        <div className="flex-1 w-full">
          <Label className="text-slate-700 font-medium">File (PDF, PNG, JPG)</Label>
          <Input 
            type="file" 
            accept=".pdf,image/*" 
            onChange={e => setFile(e.target.files?.[0] || null)} 
            className="mt-1"
          />
        </div>
        <Button 
          onClick={handleUpload} 
          disabled={uploading || !title || !file}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </div>

      {/* Document List */}
      <div>
        <h3 className="font-semibold text-slate-800 mb-3">Uploaded Documents</h3>
        {loading ? (
          <p className="text-slate-500 text-sm">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-slate-500 text-sm italic bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200">No medical records uploaded yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {documents.map(doc => (
              <div key={doc.id} className="p-3 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-slate-800 text-sm line-clamp-1" title={doc.title}>{doc.title}</h4>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8 text-blue-600 border-blue-200"
                    onClick={() => {
                      // Open URL in new tab
                      if (doc.fileData.startsWith('http')) {
                        window.open(doc.fileData, '_blank');
                      } else {
                        // Fallback for old base64 docs (if any)
                        const win = window.open();
                        if (win) {
                          win.document.write(`<iframe src="${doc.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                        }
                      }
                    }}
                  >
                    View File
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

