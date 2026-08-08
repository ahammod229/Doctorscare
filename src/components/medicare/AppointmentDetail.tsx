'use client'
import { useApp } from './AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, User, FileText, HeartPulse } from 'lucide-react'

export function AppointmentDetail() {
  const { user, selectedAppointment: apt, setView } = useApp()
  if (!apt) return null

  const statusColor: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700', CONFIRMED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-emerald-100 text-emerald-700', CANCELLED: 'bg-red-100 text-red-700',
  }

  const handlePrintRx = () => {
    if (!apt || !apt.prescription) return
    const win = window.open('', '_blank')
    if (win) {
      const html = `
        <html>
          <head>
            <title>Prescription - ${apt.patient?.name || 'Patient'}</title>
            <style>
              body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 30px; }
              .clinic-name { font-size: 24px; font-weight: bold; color: #0ea5e9; }
              .doc-info { text-align: right; }
              .doc-name { font-weight: bold; font-size: 18px; }
              .doc-spec { color: #64748b; font-size: 14px; }
              .patient-info { display: flex; justify-content: space-between; background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
              .rx-symbol { font-size: 40px; font-family: serif; color: #334155; margin-bottom: 20px; font-style: italic; }
              .section { margin-bottom: 25px; }
              .section-title { font-weight: 600; color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
              .meds { margin-left: 20px; }
              .meds li { margin-bottom: 8px; font-size: 16px; }
              .footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
              .signature { margin-top: 50px; text-align: right; }
              .signature-line { border-top: 1px solid #1e293b; width: 200px; display: inline-block; margin-bottom: 5px; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="background: linear-gradient(135deg, #1d4ed8, #0284c7, #059669); width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/></svg>
                </div>
                <div>
                  <div class="clinic-name">Doctors Care</div>
                  <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Emergency: 999</div>
                </div>
              </div>
              <div class="doc-info">
                <div class="doc-name">${apt.doctor?.user?.name || 'Doctor'}</div>
                <div class="doc-spec">${apt.doctor?.specialty || ''}</div>
                <div class="doc-spec">${apt.doctor?.department?.name || ''}</div>
              </div>
            </div>
            
            <div class="patient-info">
              <div>
                <strong>Patient:</strong> ${apt.patient?.name || 'N/A'}<br>
                <span style="color: #64748b; font-size: 14px;">Phone: ${apt.patient?.phone || 'N/A'}</span>
              </div>
              <div style="text-align: right;">
                <strong>Date:</strong> ${apt.date}<br>
                <span style="color: #64748b; font-size: 14px;">Appt ID: ${apt.id.slice(0, 8)}</span>
              </div>
            </div>

            <div class="rx-symbol">Rx</div>

            <div class="section">
              <div class="section-title">Diagnosis</div>
              <div style="font-size: 16px;">${apt.prescription.diagnosis}</div>
            </div>

            <div class="section">
              <div class="section-title">Medications</div>
              <ul class="meds">
                ${apt.prescription.medications.split('\n').map(m => `<li>${m}</li>`).join('')}
              </ul>
            </div>

            ${apt.prescription.instructions ? `
            <div class="section">
              <div class="section-title">Instructions</div>
              <div>${apt.prescription.instructions}</div>
            </div>` : ''}

            ${apt.prescription.followUpDate ? `
            <div class="section">
              <div class="section-title">Follow-up</div>
              <div style="font-weight: bold; color: #0ea5e9;">${apt.prescription.followUpDate}</div>
            </div>` : ''}

            <div class="signature">
              <div class="signature-line"></div>
              <div>Doctor's Signature</div>
            </div>

            <div class="footer">
              This is a computer generated prescription from Doctors Care. No signature is required if sent digitally.
            </div>
          </body>
        </html>
      `
      win.document.write(html)
      win.document.close()
      // Use setTimeout to ensure CSS loads before printing
      setTimeout(() => {
        win.print()
        win.close()
      }, 500)
    }
  }

  const handleBack = () => {
    if (user?.role === 'DOCTOR') setView('doctor')
    else if (user?.role === 'ADMIN') setView('admin')
    else setView('patient')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      <Button variant="ghost" className="mb-4 text-slate-500" onClick={handleBack}>
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

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 mb-1">Doctor</p>
              <p className="font-semibold text-slate-800">{apt.doctor?.user?.name}</p>
              <p className="text-xs text-blue-600">{apt.doctor?.specialty}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 mb-1">Department</p>
              <p className="font-semibold text-slate-800">{apt.doctor?.department?.name}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 mb-1">Date</p>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {apt.date}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 mb-1">Time</p>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.timeSlot}</p>
            </div>
          </div>

          <div className="space-y-6">
            {apt.reason && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 mb-1">Reason</p>
                <p className="text-sm text-slate-700">{apt.reason}</p>
              </div>
            )}

            {/* Prescription */}
            {apt.prescription && (
              <div className="border-2 border-emerald-200 rounded-xl p-5 bg-gradient-to-br from-emerald-50/50 to-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-emerald-700 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5" /> Prescription
                  </h3>
                  <Button size="sm" variant="outline" className="h-8 text-xs bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={handlePrintRx}>
                    Print Prescription
                  </Button>
                </div>
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