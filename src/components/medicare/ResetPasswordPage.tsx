'use client'
import { useState, useEffect } from 'react'
import { useApp } from './AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, ShieldCheck } from 'lucide-react'

export function ResetPasswordPage() {
  const { setView, showToast } = useApp()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const t = urlParams.get('token')
      if (t) setToken(t)
    }
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }
    
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error')
      return
    }

    setLoading(true)
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to reset password')
      
      setSuccess(true)
      showToast('Password reset successfully!', 'success')
      
      // Clean up URL
      window.history.replaceState({}, '', '/')
      
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!token && !success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Invalid Link</h2>
          <p className="text-slate-500 mt-2">This password reset link is invalid or has expired.</p>
          <Button className="mt-4" onClick={() => setView('login')}>Return to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50/80 via-white to-emerald-50/80 relative">
      <Card className="w-full max-w-md border-0 shadow-xl mt-8 animate-fadeIn">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            {success ? <CheckCircle2 className="w-8 h-8 text-emerald-600" /> : <ShieldCheck className="w-8 h-8 text-emerald-600" />}
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            {success ? 'Password Reset!' : 'Set New Password'}
          </CardTitle>
          <p className="text-slate-500 text-sm mt-1">
            {success ? 'Your password has been changed successfully.' : 'Please enter your new password below.'}
          </p>
        </CardHeader>
        <CardContent>
          {!success ? (
            <form onSubmit={handleReset} className="space-y-4 pt-2">
              <div>
                <Label htmlFor="password" className="text-slate-700 font-medium">New Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="At least 6 characters" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  className="mt-1.5 border-blue-200 focus:border-blue-400" 
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Re-enter password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required
                  className="mt-1.5 border-blue-200 focus:border-blue-400" 
                />
              </div>
              
              <Button type="submit" className="w-full gradient-medical text-white border-0 font-semibold" disabled={loading}>
                {loading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>
          ) : (
            <div className="text-center pt-4">
              <Button className="w-full gradient-medical text-white border-0 font-semibold" onClick={() => setView('login')}>
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
