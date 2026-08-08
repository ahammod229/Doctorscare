'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN' | null
export type ViewType = 'landing' | 'login' | 'register' | 'patient-dashboard' | 'patient-profile' | 'browse-doctors' | 'doctor-profile' | 'book-appointment' | 'appointment-detail' | 'doctor-dashboard' | 'admin-dashboard' | 'admin-doctors' | 'admin-departments' | 'admin-appointments'

export interface AppUser {
  id: string; name: string; email: string; role: UserRole; phone?: string;
  doctor?: { id: string; specialty: string; qualification?: string; experience: number; fee: number; department: { id: string; name: string }; availableDays: string; startTime: string; endTime: string }
}

export interface Department { id: string; name: string; description?: string; icon?: string; _count?: { doctors: number } }
export interface Doctor { id: string; userId: string; specialty: string; qualification?: string; experience: number; bio?: string; fee: number; departmentId: string; availableDays: string; startTime: string; endTime: string; user: { id: string; name: string; email: string; phone?: string; avatar?: string }; department: Department }
export interface Appointment { id: string; patientId: string; doctorId: string; date: string; timeSlot: string; status: string; reason?: string; notes?: string; createdAt: string; patient?: { id: string; name: string; phone?: string }; doctor?: { id: string; specialty: string; user: { name: string }; department: { name: string } }; prescription?: Prescription | null }
export interface Prescription { id: string; appointmentId: string; doctorId: string; patientId: string; diagnosis: string; medications: string; instructions?: string; followUpDate?: string; createdAt: string }
export interface TimeSlot { id: string; doctorId: string; date: string; startTime: string; endTime: string; isBooked: boolean }
export interface Stats { totalPatients: number; totalDoctors: number; totalAppointments: number; todayAppointments: number; completedAppointments: number; pendingAppointments: number; cancelledAppointments: number; totalDepartments: number; totalRevenue: number; recentAppointments: Appointment[] }

interface AppState {
  user: AppUser | null
  view: ViewType
  departments: Department[]
  doctors: Doctor[]
  appointments: Appointment[]
  selectedDoctor: Doctor | null
  selectedAppointment: Appointment | null
  stats: Stats | null
  timeSlots: TimeSlot[]
  loading: boolean
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
}

interface AppContextType extends AppState {
  setView: (v: ViewType) => void
  setUser: (u: AppUser | null) => void
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>
  logout: () => void
  loadDoctors: (departmentId?: string, search?: string) => Promise<void>
  loadDepartments: () => Promise<void>
  loadAppointments: (patientId?: string, doctorId?: string, status?: string) => Promise<void>
  loadStats: () => Promise<void>
  loadTimeSlots: (doctorId: string, date: string) => Promise<void>
  bookAppointment: (data: { patientId: string; doctorId: string; date: string; timeSlot: string; reason: string }) => Promise<boolean>
  cancelAppointment: (id: string) => Promise<boolean>
  confirmAppointment: (id: string) => Promise<boolean>
  completeAppointment: (id: string) => Promise<boolean>
  createPrescription: (data: { appointmentId: string; doctorId: string; patientId: string; diagnosis: string; medications: string; instructions: string; followUpDate: string }) => Promise<boolean>
  selectDoctor: (d: Doctor) => void
  selectAppointment: (a: Appointment) => void
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
  refreshAdminAppointments: (status?: string, date?: string) => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null, view: 'landing', departments: [], doctors: [], appointments: [],
    selectedDoctor: null, selectedAppointment: null, stats: null, timeSlots: [], loading: false, toast: null,
  })

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dc_user')
      const savedView = localStorage.getItem('dc_view')
      if (savedUser) {
        setState(s => ({ ...s, user: JSON.parse(savedUser), view: savedView as ViewType || 'landing' }))
      } else if (savedView) {
        setState(s => ({ ...s, view: savedView as ViewType }))
      }
    } catch (e) {
      console.error("Failed to parse saved user", e)
    }
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setState(s => ({ ...s, toast: { message, type } }))
    setTimeout(() => setState(s => ({ ...s, toast: null })), 3000)
  }, [])

  const api = useCallback(async (url: string, options?: RequestInit) => {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const user = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      const defaultView = user.role === 'ADMIN' ? 'admin-dashboard' : user.role === 'DOCTOR' ? 'doctor-dashboard' : 'patient-dashboard'
      setState(s => ({ ...s, user, view: defaultView }))
      localStorage.setItem('dc_user', JSON.stringify(user))
      localStorage.setItem('dc_view', defaultView)
      showToast('Welcome back, ' + user.name + '!', 'success')
      return true
    } catch { showToast('Invalid credentials', 'error'); return false }
  }, [api, showToast])

  const register = useCallback(async (name: string, email: string, password: string, phone: string) => {
    try {
      await api('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, phone, role: 'PATIENT' }) })
      showToast('Registration successful! Please login.', 'success')
      return true
    } catch (e: any) { showToast(e.message || 'Registration failed', 'error'); return false }
  }, [api, showToast])

  const logout = useCallback(() => {
    setState(s => ({ ...s, user: null, view: 'landing', appointments: [], selectedDoctor: null, selectedAppointment: null, timeSlots: [] }))
    localStorage.removeItem('dc_user')
    localStorage.removeItem('dc_view')
    showToast('Logged out successfully', 'info')
  }, [showToast])

  const loadDepartments = useCallback(async () => {
    try { const d = await api('/api/departments'); setState(s => ({ ...s, departments: d })) } catch {}
  }, [api])

  const loadDoctors = useCallback(async (departmentId?: string, search?: string) => {
    try {
      const params = new URLSearchParams()
      if (departmentId) params.set('departmentId', departmentId)
      if (search) params.set('search', search)
      const d = await api('/api/doctors?' + params.toString())
      setState(s => ({ ...s, doctors: d }))
    } catch {}
  }, [api])

  const loadAppointments = useCallback(async (patientId?: string, doctorId?: string, status?: string) => {
    try {
      const params = new URLSearchParams()
      if (patientId) params.set('patientId', patientId)
      if (doctorId) params.set('doctorId', doctorId)
      if (status) params.set('status', status)
      const a = await api('/api/appointments?' + params.toString())
      setState(s => ({ ...s, appointments: a }))
    } catch {}
  }, [api])

  const loadStats = useCallback(async () => {
    try { const data = await api('/api/stats'); setState(s => ({ ...s, stats: data })) } catch {}
  }, [api])

  const loadTimeSlots = useCallback(async (doctorId: string, date: string) => {
    try {
      const ts = await api(`/api/timeslots?doctorId=${doctorId}&date=${date}`)
      setState(s => ({ ...s, timeSlots: ts }))
    } catch {}
  }, [api])

  const bookAppointment = useCallback(async (data: { patientId: string; doctorId: string; date: string; timeSlot: string; reason: string }) => {
    try {
      await api('/api/appointments/book', { method: 'POST', body: JSON.stringify(data) })
      showToast('Appointment booked successfully!', 'success')
      return true
    } catch (e: any) { showToast(e.message || 'Booking failed', 'error'); return false }
  }, [api, showToast])

  const cancelAppointment = useCallback(async (id: string) => {
    try { await api('/api/appointments/cancel', { method: 'POST', body: JSON.stringify({ appointmentId: id }) }); showToast('Appointment cancelled', 'info'); return true }
    catch (e: any) { showToast(e.message, 'error'); return false }
  }, [api, showToast])

  const confirmAppointment = useCallback(async (id: string) => {
    try { await api('/api/appointments/confirm', { method: 'POST', body: JSON.stringify({ appointmentId: id }) }); showToast('Appointment confirmed', 'success'); return true }
    catch (e: any) { showToast(e.message, 'error'); return false }
  }, [api, showToast])

  const completeAppointment = useCallback(async (id: string) => {
    try { await api('/api/appointments/complete', { method: 'POST', body: JSON.stringify({ appointmentId: id }) }); showToast('Appointment completed', 'success'); return true }
    catch (e: any) { showToast(e.message, 'error'); return false }
  }, [api, showToast])

  const createPrescription = useCallback(async (data: { appointmentId: string; doctorId: string; patientId: string; diagnosis: string; medications: string; instructions: string; followUpDate: string }) => {
    try { await api('/api/prescriptions', { method: 'POST', body: JSON.stringify(data) }); showToast('Prescription created', 'success'); return true }
    catch (e: any) { showToast(e.message, 'error'); return false }
  }, [api, showToast])

  const refreshAdminAppointments = useCallback(async (status?: string, date?: string) => {
    try {
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      if (date) params.set('date', date)
      const a = await api('/api/admin/appointments?' + params.toString())
      const list = Array.isArray(a) ? a : a.appointments || []
      setState(s => ({ ...s, appointments: list }))
    } catch {}
  }, [api])

  const setView = useCallback((v: ViewType) => {
    setState(s => ({ ...s, view: v }))
    localStorage.setItem('dc_view', v)
  }, [])
  const setUser = useCallback((u: AppUser | null) => {
    setState(s => ({ ...s, user: u }))
    if (u) localStorage.setItem('dc_user', JSON.stringify(u))
    else localStorage.removeItem('dc_user')
  }, [])
  const selectDoctor = useCallback((d: Doctor) => setState(s => ({ ...s, selectedDoctor: d })), [])
  const selectAppointment = useCallback((a: Appointment) => setState(s => ({ ...s, selectedAppointment: a })), [])

  // Load departments on mount
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => { if (!controller.signal.aborted) setState(s => ({ ...s, departments: data })) })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const ctx: AppContextType = {
    ...state, setView, setUser, login, register, logout, loadDoctors, loadDepartments, loadAppointments,
    loadStats, loadTimeSlots, bookAppointment, cancelAppointment, confirmAppointment, completeAppointment,
    createPrescription, selectDoctor, selectAppointment, showToast, refreshAdminAppointments,
  }
  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>
}

export function useApp() { const c = useContext(AppContext); if (!c) throw new Error('useApp must be inside AppProvider'); return c }