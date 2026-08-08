'use client'
import { useEffect, useState } from 'react'
import { useApp } from './AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Star, MapPin, Clock, Banknote, ArrowRight, GraduationCap, Briefcase } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function BrowseDoctors() {
  const { doctors, departments, loadDoctors, selectDoctor, setView } = useApp()
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')

  useEffect(() => { loadDoctors(deptFilter || undefined, search || undefined) }, [deptFilter, search])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Find a Doctor</h1>
        <p className="text-slate-500 mt-1">Browse our expert doctors and book your appointment</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search doctors by name..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-400" />
        </div>
        <Select value={deptFilter} onValueChange={v => setDeptFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-48 border-blue-200">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.icon} {d.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-slate-500 mb-4">{doctors.length} doctors found</p>

      {/* Doctor Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map(doc => (
          <Card key={doc.id} className="border-0 shadow-sm hover:shadow-lg transition-all group">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {doc.user.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition truncate">{doc.user.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{doc.specialty}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">{doc.department.name}</Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-500 mb-4">
                {doc.qualification && (
                  <p className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-blue-400" /> {doc.qualification}</p>
                )}
                <p className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-emerald-400" /> {doc.experience} years experience</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sky-400" /> {doc.department.name}</p>
                <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" /> {doc.availableDays}</p>
                <p className="flex items-center gap-2"><Banknote className="w-4 h-4 text-green-500" /> ৳{doc.fee} consultation fee</p>
              </div>

              <Button className="w-full gradient-medical text-white border-0" onClick={() => { selectDoctor(doc); setView('doctor-profile') }}>
                View Profile <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}