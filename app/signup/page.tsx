"use client"

import { useState } from 'react'
import { signup } from './actions'
import Link from 'next/link'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex-1 flex flex-col w-full min-h-[calc(100vh-5rem)] relative overflow-hidden bg-slate-950 text-white justify-center items-center py-12">
      <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full px-6 sm:max-w-md mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800/50">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">🚀</span>
            <h1 className="text-4xl text-white font-extrabold mb-3 tracking-tight">Join Roam</h1>
            <p className="text-slate-400 text-lg">Create your account and start finding your people.</p>
          </div>
          
          <form className="flex flex-col w-full gap-5 text-slate-200">
            <div>
              <label className="text-sm font-bold text-slate-400 block mb-2" htmlFor="email">Email</label>
              <input
                className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                name="email" id="email" type="email" placeholder="you@example.com" required
              />
            </div>
            
            <div>
              <label className="text-sm font-bold text-slate-400 block mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  className="w-full rounded-xl px-4 py-3 pr-12 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                  type={showPassword ? "text" : "password"} name="password" id="password" placeholder="Minimum 6 characters" required minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-sm font-bold w-8 h-8 flex items-center justify-center" tabIndex={-1}>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-400 block mb-2" htmlFor="confirm-password">Confirm Password</label>
              <input
                className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                type="password" name="confirm-password" id="confirm-password" placeholder="Re-enter your password" required minLength={6}
              />
            </div>
            
            <button formAction={signup} className="w-full bg-cyan-600 hover:bg-cyan-500 rounded-xl px-4 py-4 text-white font-bold transition-all shadow-lg hover:shadow-cyan-500/25 mt-2">
              Create Account
            </button>
            
            {searchParams?.message && (
              <div className="mt-2 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3">
                <span className="text-red-400 text-xl">⚠</span>
                <p className="text-red-400 font-medium text-sm">{searchParams.message}</p>
              </div>
            )}
          </form>

          <p className="text-center text-slate-400 text-sm mt-8">
            Already have an account? <Link href="/login" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
