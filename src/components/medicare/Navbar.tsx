'use client'
import { useApp } from './AppContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Stethoscope, LogOut, LayoutDashboard, UserPlus, Search, Menu, Home } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export function Navbar() {
  const { user, view, setView, logout } = useApp()
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'

  const patientLinks = [
    { label: 'Dashboard', view: 'patient-dashboard' as const, icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Find Doctors', view: 'browse-doctors' as const, icon: <Search className="w-4 h-4" /> },
  ]
  const doctorLinks = [
    { label: 'Dashboard', view: 'doctor-dashboard' as const, icon: <LayoutDashboard className="w-4 h-4" /> },
  ]
  const adminLinks = [
    { label: 'Dashboard', view: 'admin-dashboard' as const, icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Doctors', view: 'admin-doctors' as const, icon: <Stethoscope className="w-4 h-4" /> },
    { label: 'Departments', view: 'admin-departments' as const, icon: <Home className="w-4 h-4" /> },
    { label: 'Appointments', view: 'admin-appointments' as const, icon: <UserPlus className="w-4 h-4" /> },
  ]

  const links = user?.role === 'ADMIN' ? adminLinks : user?.role === 'DOCTOR' ? doctorLinks : patientLinks

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => setView('landing')} className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-9 h-9 rounded-lg gradient-medical flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
              Binimoy
            </span>
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-1">
              {links.map(l => (
                <Button key={l.view} variant={view === l.view ? 'default' : 'ghost'} size="sm"
                  className={view === l.view ? 'gradient-medical text-white border-0' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'}
                  onClick={() => setView(l.view)}>
                  {l.icon} {l.label}
                </Button>
              ))}
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <Avatar className="w-8 h-8 border-2 border-emerald-200">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-700 leading-tight">{user.name}</p>
                    <p className="text-xs text-emerald-600 font-medium">{user.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                </Button>
                <Sheet>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64 pt-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                      <Avatar className="w-10 h-10 border-2 border-emerald-200">
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-emerald-600">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {links.map(l => (
                        <Button key={l.view} variant={view === l.view ? 'secondary' : 'ghost'} className="justify-start"
                          onClick={() => setView(l.view)}>
                          {l.icon} {l.label}
                        </Button>
                      ))}
                      <Button variant="ghost" className="justify-start text-red-500" onClick={logout}>
                        <LogOut className="w-4 h-4" /> Logout
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setView('login')} className="text-slate-600">Login</Button>
                <Button size="sm" className="gradient-medical text-white border-0" onClick={() => setView('register')}>Register</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}