"use client"

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-3xl">🌐</span>
          <span className="text-2xl font-extrabold text-white tracking-tight group-hover:text-cyan-400 transition-colors">Roam</span>
        </Link>

        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <Link href="/login" className="text-slate-300 font-bold hover:text-white transition-colors">Sign In</Link>
              <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow-lg hover:shadow-blue-500/25">Sign Up</Link>
            </>
          ) : (
            <>
              <Link href="/network" className={`text-sm font-bold transition-colors ${isActive('/network') ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`}>Network</Link>
              <Link href="/messages" className={`text-sm font-bold transition-colors ${isActive('/messages') ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`}>Messages</Link>
              <Link href="/profile" className={`text-sm font-bold transition-colors ${isActive('/profile') ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`}>Profile</Link>
              <button onClick={handleSignOut} className="ml-4 text-sm font-bold text-slate-400 hover:text-red-400 transition-colors border-l border-slate-700 pl-4">Sign Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
