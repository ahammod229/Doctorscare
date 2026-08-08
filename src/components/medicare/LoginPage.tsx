'use client'
import { useState } from 'react'
import { useApp } from './AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Stethoscope, ArrowLeft, Eye, EyeOff } from 'lucide-react'

export function LoginPage() {
  const { login, setView } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await login(email, password)
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50/80 via-white to-emerald-50/80 relative">
      <Button variant="ghost" className="absolute left-4 top-4 text-slate-500" onClick={() => setView('landing')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <Card className="w-full max-w-md border-0 shadow-xl mt-8">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-2xl gradient-medical flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Welcome Back</CardTitle>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage your appointments</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                className="mt-1.5 border-blue-200 focus:border-blue-400" />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={show ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="border-blue-200 focus:border-blue-400 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <button type="button" onClick={() => setView('forgot-password')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot Password?
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-medical text-white border-0 font-semibold" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <button onClick={() => setView('register')} className="text-blue-600 hover:text-blue-700 font-semibold">Register</button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}