"use client"

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/profile`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="flex-1 flex flex-col w-full min-h-[calc(100vh-5rem)] relative overflow-hidden bg-slate-950 text-white justify-center items-center py-12">
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full px-6 sm:max-w-md mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800/50">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">🔑</span>
            <h1 className="text-3xl text-white font-extrabold mb-3 tracking-tight">Reset your password</h1>
            <p className="text-slate-400">Enter your email and we'll send you a link to reset your password.</p>
          </div>
          
          {sent ? (
            <div className="text-center space-y-6">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl">
                <span className="text-emerald-400 text-xl block mb-2">✓</span>
                <p className="text-emerald-400 font-medium">Check your email! We sent a password reset link to <strong>{email}</strong>.</p>
              </div>
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold text-sm transition-colors">
                ← Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-bold text-slate-400 block mb-2" htmlFor="reset-email">Email</label>
                <input
                  className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3">
                  <span className="text-red-400 text-xl">⚠</span>
                  <p className="text-red-400 font-medium text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-400 rounded-xl px-4 py-4 text-white font-bold transition-all shadow-lg hover:shadow-cyan-500/25"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <Link href="/login" className="text-center text-cyan-400 hover:text-cyan-300 font-bold text-sm transition-colors mt-2">
                ← Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
