'use client'
import { AppProvider, useApp } from '@/components/medicare/AppContext'
import { Navbar } from '@/components/medicare/Navbar'
import { Toast } from '@/components/medicare/Toast'
import { LandingPage } from '@/components/medicare/LandingPage'
import { LoginPage } from '@/components/medicare/LoginPage'
import { RegisterPage } from '@/components/medicare/RegisterPage'
import { PatientDashboard } from '@/components/medicare/PatientDashboard'
import { BrowseDoctors } from '@/components/medicare/BrowseDoctors'
import { DoctorProfile } from '@/components/medicare/DoctorProfile'
import { AppointmentDetail } from '@/components/medicare/AppointmentDetail'
import { DoctorDashboard } from '@/components/medicare/DoctorDashboard'
import { AdminDashboard } from '@/components/medicare/AdminDashboard'
import { AdminDoctors } from '@/components/medicare/AdminDoctors'
import { AdminDepartments } from '@/components/medicare/AdminDepartments'
import { AdminAppointments } from '@/components/medicare/AdminAppointments'
import { PatientProfile } from '@/components/medicare/PatientProfile'
import { ForgotPasswordPage } from '@/components/medicare/ForgotPasswordPage'
import { ResetPasswordPage } from '@/components/medicare/ResetPasswordPage'

function AppRouter() {
  const { view } = useApp()

  const pages: Record<string, React.ReactNode> = {
    'landing': <LandingPage />,
    'login': <LoginPage />,
    'register': <RegisterPage />,
    'forgot-password': <ForgotPasswordPage />,
    'reset-password': <ResetPasswordPage />,
    'patient-dashboard': <PatientDashboard />,
    'patient-profile': <PatientProfile />,
    'browse-doctors': <BrowseDoctors />,
    'doctor-profile': <DoctorProfile />,
    'appointment-detail': <AppointmentDetail />,
    'doctor-dashboard': <DoctorDashboard />,
    'admin-dashboard': <AdminDashboard />,
    'admin-doctors': <AdminDoctors />,
    'admin-departments': <AdminDepartments />,
    'admin-appointments': <AdminAppointments />,
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Toast />
      <main className="flex-1">
        {pages[view] || <LandingPage />}
      </main>
      {view === 'landing' && (
        <footer className="bg-slate-900 text-white py-12 px-4 mt-auto border-t border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 border-b border-slate-800 pb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-lg">
                    +
                  </div>
                  <h3 className="text-xl font-bold">Doctors Care</h3>
                </div>
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                  Empowering better healthcare through seamless scheduling and patient management.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="text-slate-400 text-sm">
                  <p className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-xs">Emergency</p>
                  <div className="flex items-center gap-2 text-rose-400 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    999
                  </div>
                </div>
                <div className="text-slate-400 text-sm">
                  <p className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-xs">Support</p>
                  <a href="mailto:support@doctorscare.online" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    support@doctorscare.online
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
              <p>&copy; {new Date().getFullYear()} Doctors Care. All rights reserved.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}