'use client'
import { useState } from 'react'
import { useApp } from './AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react'

export function RegisterPage() {
  const { register, setView } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { showToast('Passwords do not match', 'error'); return }
    setLoading(true)
    await register(name, email, password, phone)
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/80">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Create Account</CardTitle>
          <p className="text-slate-500 text-sm mt-1">Register as a patient to book appointments</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label className="text-slate-700 font-medium">Full Name</Label>
              <Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required className="mt-1.5 border-blue-200 focus:border-blue-400" />
            </div>
            <div>
              <Label className="text-slate-700 font-medium">Email</Label>
              <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1.5 border-blue-200 focus:border-blue-400" />
            </div>
            <div>
              <Label className="text-slate-700 font-medium">Phone</Label>
              <Input placeholder="+880XXXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1.5 border-blue-200 focus:border-blue-400" />
            </div>
            <div>
              <Label className="text-slate-700 font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Input type={show ? 'text' : 'password'} placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} required className="border-blue-200 focus:border-blue-400 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="text-slate-700 font-medium">Confirm Password</Label>
              <Input type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="mt-1.5 border-blue-200 focus:border-blue-400" />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 font-semibold" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <button onClick={() => setView('login')} className="text-blue-600 hover:text-blue-700 font-semibold">Sign In</button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}