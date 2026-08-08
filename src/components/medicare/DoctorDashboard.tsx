'use client'
import { useEffect, useState } from 'react'
import { useApp } from './AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, CheckCircle2, Clock, Users, FileText, XCircle, HeartPulse, AlertCircle, ClipboardList, ZoomIn, ZoomOut, Printer } from 'lucide-react'

const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700', CANCELLED: 'bg-red-100 text-red-700',
}

export function DoctorDashboard() {
  const { user, appointments, loadAppointments, loadStats, stats, confirmAppointment, completeAppointment, createPrescription, showToast } = useApp()
  const [tab, setTab] = useState<'today' | 'all' | 'completed'>('today')
  const [rxOpen, setRxOpen] = useState(false)
  const [rxApt, setRxApt] = useState<any>(null)
  const [rxForm, setRxForm] = useState({ diagnosis: '', medications: '', instructions: '', followUpDate: '' })

  const doctorId = user?.doctor?.id
  useEffect(() => {
    if (doctorId) { loadAppointments(undefined, doctorId); loadStats() }
  }, [doctorId])

  const today = new Date().toISOString().split('T')[0]
  const todayAppts = appointments.filter(a => a.date === today && a.status !== 'CANCELLED')
  const completedAppts = appointments.filter(a => a.status === 'COMPLETED')

  const list = tab === 'today' ? todayAppts : tab === 'completed' ? completedAppts : appointments.filter(a => a.status !== 'CANCELLED')

  const handleComplete = async (apt: any) => {
    await completeAppointment(apt.id)
    loadAppointments(undefined, doctorId)
  }

  const handleRxSubmit = async () => {
    if (!rxApt || !rxForm.diagnosis || !rxForm.medications) { showToast('Fill diagnosis and medications', 'error'); return }
    await createPrescription({
      appointmentId: rxApt.id, doctorId: user!.id, patientId: rxApt.patientId,
      diagnosis: rxForm.diagnosis, medications: rxForm.medications,
      instructions: rxForm.instructions, followUpDate: rxForm.followUpDate,
    })
    setRxOpen(false); setRxForm({ diagnosis: '', medications: '', instructions: '', followUpDate: '' })
    loadAppointments(undefined, doctorId)
  }

  const uniquePatients = new Set(appointments.map(a => a.patientId)).size
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dr. {user?.name?.replace(/^Dr\.\s*/i, '')} Dashboard</h1>
        <p className="text-slate-500 mt-1">{user?.doctor?.specialty} — {user?.doctor?.department?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Schedule", value: todayAppts.length, icon: <Calendar className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Total Patients', value: uniquePatients, icon: <Users className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Pending', value: pendingCount, icon: <Clock className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50' },
          { label: 'Completed', value: completedAppts.length, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-sky-600 bg-sky-50' },
        ].map((s, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}>{s.icon}</div>
              <div><p className="text-2xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <Button variant={tab === 'today' ? 'default' : 'outline'} size="sm"
          className={tab === 'today' ? 'gradient-medical text-white border-0' : ''}
          onClick={() => setTab('today')}>Today ({todayAppts.length})</Button>
        <Button variant={tab === 'all' ? 'default' : 'outline'} size="sm"
          className={tab === 'all' ? 'gradient-medical text-white border-0' : ''}
          onClick={() => setTab('all')}>All</Button>
        <Button variant={tab === 'completed' ? 'default' : 'outline'} size="sm"
          className={tab === 'completed' ? 'gradient-medical text-white border-0' : ''}
          onClick={() => setTab('completed')}>Completed ({completedAppts.length})</Button>
      </div>

      {/* Appointments */}
      <div className="space-y-3">
        {list.length === 0 && (
          <Card className="border-0 shadow-sm"><CardContent className="p-8 text-center text-slate-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-50" /><p>No appointments found</p>
          </CardContent></Card>
        )}
        {list.map(apt => (
          <Card key={apt.id} className="border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-blue-600">{apt.patient?.name?.[0] || '?'}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{apt.patient?.name}</p>
                  <p className="text-sm text-slate-500">{apt.reason || 'No reason provided'}</p>
                  <div className="flex gap-3 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {apt.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.timeSlot}</span>
                    {apt.patient?.phone && <span>{apt.patient.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge className={statusColor[apt.status]}>{apt.status}</Badge>
                {apt.prescription && <Badge className="bg-emerald-100 text-emerald-700"><FileText className="w-3 h-3 mr-1" /> Rx</Badge>}
                <ViewRecordsDialog patientId={apt.patientId} patientName={apt.patient?.name} />
                {apt.status === 'PENDING' && (
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { confirmAppointment(apt.id).then(() => loadAppointments(undefined, doctorId)) }}>
                    Confirm
                  </Button>
                )}
                {apt.status === 'CONFIRMED' && (
                  <>
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleComplete(apt)}>
                      Complete
                    </Button>
                    <Dialog open={rxOpen && rxApt?.id === apt.id} onOpenChange={open => { setRxOpen(open); if (open) setRxApt(apt) }}>
                      <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white" onClick={() => { setRxApt(apt); setRxOpen(true) }}>
                        <HeartPulse className="w-3.5 h-3.5 mr-1" /> Rx
                      </Button>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prescription Dialog */}
      <Dialog open={rxOpen} onOpenChange={setRxOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><HeartPulse className="w-5 h-5 text-emerald-600" /> Write Prescription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient: <span className="font-semibold text-slate-700">{rxApt?.patient?.name}</span></Label>
            </div>
            <div>
              <Label className="text-slate-700 font-medium">Diagnosis *</Label>
              <Input value={rxForm.diagnosis} onChange={e => setRxForm(f => ({ ...f, diagnosis: e.target.value }))}
                placeholder="e.g. Acute bronchitis" className="mt-1 border-blue-200" />
            </div>
            <div>
              <Label className="text-slate-700 font-medium">Medications * <span className="text-xs font-normal text-slate-400">(one per line)</span></Label>
              <Textarea value={rxForm.medications} onChange={e => setRxForm(f => ({ ...f, medications: e.target.value }))}
                placeholder={"Paracetamol 500mg - 3 times daily\nAmoxicillin 250mg - 3 times daily"} className="mt-1 border-blue-200 min-h-[100px]" />
            </div>
            <div>
              <Label className="text-slate-700 font-medium">Instructions</Label>
              <Textarea value={rxForm.instructions} onChange={e => setRxForm(f => ({ ...f, instructions: e.target.value }))}
                placeholder="Take with food. Complete the full course." className="mt-1 border-blue-200" />
            </div>
            <div>
              <Label className="text-slate-700 font-medium">Follow-up Date</Label>
              <Input type="date" value={rxForm.followUpDate} onChange={e => setRxForm(f => ({ ...f, followUpDate: e.target.value }))}
                className="mt-1 border-blue-200" />
            </div>
            <Button className="w-full gradient-medical text-white border-0" onClick={handleRxSubmit}>Save Prescription</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ViewRecordsDialog({ patientId, patientName }: { patientId: string, patientName: string }) {
  const { api } = useApp()
  const [open, setOpen] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [viewDocument, setViewDocument] = useState<any | null>(null)
  const [zoom, setZoom] = useState(1)

  const fetchDocs = async () => {
    setLoading(true)
    try {
      const data = await api(`/api/patient/documents?patientId=${patientId}`)
      setDocuments(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    if (!viewDocument) return
    const win = window.open('')
    if (win) {
      if (viewDocument.fileType?.startsWith('image/')) {
        win.document.write(`<html><head><title>${viewDocument.title}</title></head><body style="margin:0;display:flex;justify-content:center;align-items:flex-start;"><img src="${viewDocument.fileData}" style="max-width:100%;" onload="setTimeout(() => { window.print(); window.close(); }, 500)" /></body></html>`)
      } else {
        win.document.write(`<html><head><title>${viewDocument.title}</title></head><body style="margin:0;"><iframe src="${viewDocument.fileData}" style="width:100%;height:100vh;border:none;" onload="setTimeout(() => { window.print(); window.close(); }, 500)"></iframe></body></html>`)
      }
      win.document.close()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => {
      setOpen(o)
      if (o) fetchDocs()
    }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50">
          <FileText className="w-3.5 h-3.5 mr-1" /> Records
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Medical Records - {patientName}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {loading ? (
            <p className="text-slate-500 text-sm">Loading records...</p>
          ) : documents.length === 0 ? (
            <p className="text-slate-500 text-sm italic bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200 text-center">
              This patient has not uploaded any medical records.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {documents.map(doc => (
                <div key={doc.id} className="p-3 border border-slate-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-slate-800 text-sm line-clamp-2" title={doc.title}>{doc.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{new Date(doc.createdAt).toLocaleDateString()}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs h-8 text-blue-600 border-blue-200"
                    onClick={() => setViewDocument(doc)}
                  >
                    Open Document
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>

      {/* Document Viewer Modal */}
      <Dialog open={!!viewDocument} onOpenChange={(open) => {
        if (!open) {
          setViewDocument(null)
          setZoom(1)
        }
      }}>
        <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col z-[100]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>{viewDocument?.title}</DialogTitle>
            <div className="flex items-center gap-2 pr-8">
              {viewDocument?.fileType?.startsWith('image/') && (
                <>
                  <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} title="Zoom Out">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.min(3, z + 0.25))} title="Zoom In">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button variant="outline" size="icon" onClick={handlePrint} title="Print">
                <Printer className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 w-full bg-slate-100 rounded-md overflow-auto flex items-center justify-center relative">
            {viewDocument?.fileType?.startsWith('image/') ? (
              <img 
                src={viewDocument.fileData} 
                alt={viewDocument.title} 
                className="max-w-full max-h-full object-contain transition-transform duration-200" 
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
              />
            ) : viewDocument?.fileData ? (
              <iframe src={viewDocument.fileData} className="w-full h-full border-0" title={viewDocument.title} />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}