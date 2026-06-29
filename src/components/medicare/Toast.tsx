'use client'
import { useApp } from './AppContext'

export function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  const colors = {
    success: 'bg-emerald-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  }
  return (
    <div className="fixed top-20 right-4 z-[100] animate-fadeIn">
      <div className={`px-4 py-3 rounded-lg shadow-lg ${colors[toast.type]} text-sm font-medium`}>
        {toast.message}
      </div>
    </div>
  )
}