"use client"

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setMobileOpen(false)
    router.push('/')
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  const navLinkClass = (path: string) =>
    `text-sm font-bold transition-colors ${isActive(path) ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`

  const mobileNavLinkClass = (path: string) =>
    `block text-lg font-bold py-3 transition-colors ${isActive(path) ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-3xl">🌐</span>
          <span className="text-2xl font-extrabold text-white tracking-tight group-hover:text-cyan-400 transition-colors">Roam</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {!user ? (
            <>
              <Link href="/login" className="text-slate-300 font-bold hover:text-white transition-colors">Sign In</Link>
              <Link href="/signup" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow-lg hover:shadow-cyan-500/25">Sign Up</Link>
            </>
          ) : (
            <>
              <Link href="/network" className={navLinkClass('/network')}>Network</Link>
              <Link href="/messages" className={navLinkClass('/messages')}>Messages</Link>
              <Link href="/profile" className={navLinkClass('/profile')}>Profile</Link>
              <button onClick={handleSignOut} className="ml-4 text-sm font-bold text-slate-400 hover:text-red-400 transition-colors border-l border-slate-700 pl-4">Sign Out</button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-slate-300 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-slate-300 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-slate-300 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 pt-2 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50">
          {!user ? (
            <div className="flex flex-col gap-3">
              <Link href="/login" className={mobileNavLinkClass('/login')}>Sign In</Link>
              <Link href="/signup" className="text-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-all">Sign Up</Link>
            </div>
          ) : (
            <div className="flex flex-col">
              <Link href="/network" className={mobileNavLinkClass('/network')}>Network</Link>
              <Link href="/messages" className={mobileNavLinkClass('/messages')}>Messages</Link>
              <Link href="/profile" className={mobileNavLinkClass('/profile')}>Profile</Link>
              <button onClick={handleSignOut} className="text-left text-lg font-bold py-3 text-slate-400 hover:text-red-400 transition-colors border-t border-slate-800 mt-3 pt-4">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
