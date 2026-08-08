'use client'
import { useApp } from './AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, ArrowRight, Shield, Clock, Users, Star, Phone } from 'lucide-react'

export function LandingPage() {
  const { departments, loadDoctors, setView } = useApp()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero text-white py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/15 text-white border-white/20 mb-6 px-4 py-1.5 text-sm">
              <Shield className="w-3.5 h-3.5 mr-1.5" /> Trusted Healthcare Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Health, <br />
              <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Book appointments with top doctors, manage your health records, and get prescriptions — all from one trusted platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 font-semibold px-8 shadow-xl shadow-black/10" onClick={() => setView('register')}>
                Book Appointment <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white hover:text-blue-900 px-8" onClick={() => setView('browse-doctors')}>
                Find Doctors <Search className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Clock className="w-6 h-6" />, title: 'Easy Scheduling', desc: 'Book appointments in seconds with real-time availability checking and instant confirmation.', color: 'text-blue-600 bg-blue-50' },
              { icon: <Shield className="w-6 h-6" />, title: 'Trusted Doctors', desc: 'All our doctors are verified professionals with years of experience across 10+ specialties.', color: 'text-emerald-600 bg-emerald-50' },
              { icon: <Users className="w-6 h-6" />, title: 'Complete Care', desc: 'From booking to prescriptions, manage your entire healthcare journey in one place.', color: 'text-sky-600 bg-sky-50' },
            ].map((f, i) => (
              <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>{f.icon}</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-blue-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Our Departments</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Specialized care across a wide range of medical fields</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {departments.slice(0, 10).map((dept, i) => (
              <button key={dept.id} onClick={async () => { await loadDoctors(dept.id); setView('browse-doctors') }}
                className="group p-4 rounded-xl bg-white border border-blue-100 hover:border-emerald-300 hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-2">{dept.icon}</div>
                <p className="font-semibold text-slate-700 text-sm group-hover:text-blue-600 transition">{dept.name}</p>
                <p className="text-xs text-slate-400 mt-1">{dept._count?.doctors || 0} Doctors</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 to-emerald-50/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" /> Demo Accounts</h3>
              <p className="text-sm text-slate-500 mb-4">Use these credentials to explore the system</p>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-white border border-blue-100">
                  <p className="font-bold text-blue-600 mb-1">Patient</p>
                  <p className="text-slate-600">rahim@gmail.com</p>
                  <p className="text-slate-400">patient123</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-emerald-100">
                  <p className="font-bold text-emerald-600 mb-1">Doctor</p>
                  <p className="text-slate-600">ayesha@doctorscare.com</p>
                  <p className="text-slate-400">doctor123</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-sky-100">
                  <p className="font-bold text-sky-600 mb-1">Admin</p>
                  <p className="text-slate-600">admin@doctorscare.com</p>
                  <p className="text-slate-400">admin123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  )
}