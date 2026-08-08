'use client'
import { useState } from 'react'
import { useApp } from './AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, KeyRound } from 'lucide-react'

export function ForgotPasswordPage() {
  const { setView, showToast } = useApp()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const [simulatedLink, setSimulatedLink] = useState<string | null>(null)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to request reset')
      
      setSent(true)
      showToast('Reset instructions sent to your email.', 'success')
      
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50/80 via-white to-emerald-50/80 relative">
      <Button variant="ghost" className="absolute left-4 top-4 text-slate-500" onClick={() => setView('login')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
      </Button>
      
      <Card className="w-full max-w-md border-0 shadow-xl mt-8 animate-fadeIn">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Reset Password</CardTitle>
          <p className="text-slate-500 text-sm mt-1">
            {sent ? 'Check your email for the reset link.' : 'Enter your email to receive a reset link.'}
          </p>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                  className="mt-1.5 border-blue-200 focus:border-blue-400" 
                />
              </div>
              
              <Button type="submit" className="w-full gradient-medical text-white border-0 font-semibold" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6 pt-4">
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg text-sm border border-emerald-100">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
              </div>

              <Button variant="outline" className="w-full border-slate-200" onClick={() => setView('login')}>
                Return to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
