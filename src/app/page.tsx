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
        <footer className="bg-slate-900 text-white py-12 px-4 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
            <div>
              <h3 className="text-lg font-bold">Doctors Care</h3>
              <p className="text-slate-400 text-sm mt-1">Doctor Appointment Management System</p>
              <p className="text-slate-500 text-xs mt-1">DBMS Project 2026</p>
            </div>
            <div className="text-slate-400 text-sm">
              <p className="font-semibold text-slate-300 mb-2">Contact Us</p>
              <a href="mailto:support@doctorscare.online" className="hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                support@doctorscare.online
              </a>
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