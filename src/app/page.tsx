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
        <footer className="bg-slate-900 text-white py-8 px-4 mt-auto">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-slate-400 text-sm">Doctors Care Doctor Appointment Management System</p>
            <p className="text-slate-500 text-xs mt-1">DBMS Project 2026</p>
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