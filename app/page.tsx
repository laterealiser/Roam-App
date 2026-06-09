"use client"
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import createGlobe from "cobe"
import Link from 'next/link'

// Sleek rotating 3D globe
function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)

  useEffect(() => {
    if (!canvasRef.current) return
    const width = canvasRef.current.offsetWidth
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.15], 
      markerColor: [0.2, 1, 0.8],
      glowColor: [0.1, 0.2, 0.4], 
      markers: [
        { location: [37.7595, -122.4367], size: 0.02 },
        { location: [40.7128, -74.0060], size: 0.025 },
        { location: [51.5072, -0.1276], size: 0.02 },
        { location: [35.6762, 139.6503], size: 0.03 },
        { location: [19.0760, 72.8777], size: 0.025 },
        { location: [1.3521, 103.8198], size: 0.02 },
        { location: [-33.8688, 151.2093], size: 0.02 },
        { location: [-23.5505, -46.6333], size: 0.025 },
        { location: [25.2048, 55.2708], size: 0.02 },
        { location: [48.8566, 2.3522], size: 0.02 },
        { location: [52.5200, 13.4050], size: 0.015 },
        { location: [31.2304, 121.4737], size: 0.025 },
        { location: [28.6139, 77.2090], size: 0.02 },
        { location: [6.5244, 3.3792], size: 0.02 },
      ],
      // @ts-expect-error - cobe types
      onRender: (state: any) => {
        state.phi = phiRef.current
        phiRef.current += 0.005
        state.width = width * 2
        state.height = width * 2
      },
    })
    
    return () => { globe.destroy() }
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-60 mix-blend-screen w-full h-full max-w-3xl mx-auto">
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', aspectRatio: '1' }} 
      />
    </div>
  )
}

export default function HomePage() {
  const [hasSearched, setHasSearched] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [sessionUser, setSessionUser] = useState<any>(null)
  
  const [currentCitySearch, setCurrentCitySearch] = useState('')
  const [homeCityFilter, setHomeCityFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authError, setAuthError] = useState('')

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSessionUser(data.user))
  }, [])

  useEffect(() => {
    if (hasSearched) fetchUsers()
  }, [hasSearched, homeCityFilter, genderFilter, languageFilter])

  async function handleMainSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!currentCitySearch.trim()) return
    setHasSearched(true)
  }

  async function fetchUsers() {
    setLoading(true)
    let query = supabase
      .from('profiles')
      .select('*')
      .or(`current_city.ilike.%${currentCitySearch}%,current_pincode.ilike.%${currentCitySearch}%`)
      .limit(100)
    
    if (homeCityFilter) query = query.or(`home_city.ilike.%${homeCityFilter}%,home_pincode.ilike.%${homeCityFilter}%`)
    if (genderFilter) query = query.eq('gender', genderFilter)
    if (languageFilter) query = query.ilike('language', `%${languageFilter}%`)
    
    const { data } = await query
    if (data) setUsers(data)
    setLoading(false)
  }

  async function handleAuthAction(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword })
      if (error) { setAuthError(error.message) } 
      else { setShowAuthModal(false); router.refresh(); const { data } = await supabase.auth.getUser(); setSessionUser(data.user) }
    } else {
      const { data, error } = await supabase.auth.signUp({ email: authEmail, password: authPassword })
      if (error) { setAuthError(error.message) } 
      else if (data.session) { setShowAuthModal(false); router.push('/onboarding') } 
      else { setAuthError("Account created! Check your email to confirm, or disable email confirmations in Supabase.") }
    }
  }

  async function startChat(receiverId: string) {
    if (!sessionUser) { setShowAuthModal(true); return }
    if (sessionUser.id === receiverId) { alert("You cannot chat with yourself."); return }

    const { data: existing } = await supabase
      .from('connections').select('id')
      .or(`and(user_one_id.eq.${sessionUser.id},user_two_id.eq.${receiverId}),and(user_one_id.eq.${receiverId},user_two_id.eq.${sessionUser.id})`)
      .limit(1)

    if (existing && existing.length > 0) { router.push(`/chat/${existing[0].id}`); return }

    const { data, error } = await supabase
      .from('connections').insert([{ user_one_id: sessionUser.id, user_two_id: receiverId, status: 'ANONYMOUS' }]).select()
    if (data && data.length > 0) { router.push(`/chat/${data[0].id}`) }
    else { console.error(error); alert("Failed to start chat. Please try again.") }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-50 relative overflow-hidden">
      
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h2 className="text-2xl font-bold text-white mb-2">{authMode === 'login' ? 'Sign in to chat' : 'Join Roam to chat'}</h2>
            <p className="text-slate-400 text-sm mb-6">You need an account to connect with others anonymously.</p>
            <form onSubmit={handleAuthAction} className="flex flex-col gap-4">
              <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" type="email" placeholder="Email address" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required />
              <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required minLength={6} />
              {authError && <div className="text-red-400 text-sm p-3 bg-red-900/20 rounded-lg">{authError}</div>}
              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-colors mt-2">{authMode === 'login' ? 'Sign In' : 'Create Account'}</button>
            </form>
            <div className="mt-6 text-center text-sm text-slate-400">
              {authMode === 'login' ? (
                <>Don't have an account? <button onClick={() => setAuthMode('signup')} className="text-cyan-400 font-bold hover:underline">Sign up</button></>
              ) : (
                <>Already have an account? <button onClick={() => setAuthMode('login')} className="text-cyan-400 font-bold hover:underline">Sign in</button></>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ LANDING STATE ═══ */}
      {!hasSearched ? (
        <div className="relative min-h-[calc(100vh-5rem)] flex flex-col">

          {/* HERO — Search front and center */}
          <section className="relative flex-1 flex flex-col items-center justify-center px-6">
            <Globe />
            <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-3xl text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-bold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                Connecting people across 50+ cities
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-white leading-[1.1]">
                Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">network</span>
              </h1>
              <p className="text-md text-slate-400 mb-10 max-w-xl mx-auto">
                Moved to a new city? Search for your university, workplace, or area and discover people from your hometown living nearby.
              </p>
              
              <form onSubmit={handleMainSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto relative z-20">
                <input 
                  value={currentCitySearch}
                  onChange={(e) => setCurrentCitySearch(e.target.value)}
                  className="flex-1 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl px-6 py-5 text-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400 shadow-2xl transition-all" 
                  placeholder="University, Area, Office, or Pincode" 
                  autoFocus
                />
                <button 
                  type="submit"
                  disabled={!currentCitySearch.trim()}
                  className="bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 hover:bg-cyan-500 text-white font-bold py-5 px-10 rounded-2xl transition-colors shadow-lg"
                >
                  Search
                </button>
              </form>
            </div>
          </section>

          {/* COMPACT FEATURES — 3 cards in a single row */}
          <section className="relative z-10 px-6 pb-16">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "📍", title: "Hyper-Local Matching", desc: "Find people from your hometown within 100 miles of your current pincode." },
                { icon: "🎭", title: "Anonymous First", desc: "Chat behind a pseudonym. Reveal your identity only when you're comfortable." },
                { icon: "🔒", title: "Privacy Built In", desc: "Messages auto-delete after 24h. Your real name stays hidden until you choose." },
              ].map((f, i) => (
                <div key={i} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 text-center hover:border-cyan-500/30 transition-all duration-300">
                  <span className="text-3xl mb-3 block">{f.icon}</span>
                  <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* ═══ SEARCH RESULTS STATE ═══ */
        <div className="p-6 sm:p-12 max-w-7xl mx-auto relative z-10">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-2 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => setHasSearched(false)}>
                &larr; New Search
              </h1>
              <p className="text-xl text-slate-400">
                People at <strong className="text-white">{currentCitySearch}</strong>
              </p>
            </div>
            <div className="flex gap-4 items-center">
               <button onClick={() => setHasSearched(false)} className="text-sm font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-900/20 px-4 py-2 rounded-lg border border-cyan-900/50">
                 Change Location
               </button>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-6">Filter Results</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Hometown / Pincode</label>
                    <input value={homeCityFilter} onChange={(e) => setHomeCityFilter(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-500 text-sm" placeholder="Where are they from?" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Language</label>
                    <input value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-500 text-sm" placeholder="e.g. Spanish, Hindi" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Gender</label>
                    <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm">
                      <option value="">Any Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button onClick={() => { setHomeCityFilter(''); setGenderFilter(''); setLanguageFilter(''); }} className="w-full mt-4 text-xs font-bold text-slate-400 hover:text-white py-2">Clear Filters</button>
                </div>
              </div>
            </aside>

            {/* Results Grid */}
            <main className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 animate-pulse h-48"></div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-20 px-6 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-emerald-900/20 pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-6 animate-pulse">🌱</div>
                    <h3 className="text-3xl font-extrabold mb-4 text-white tracking-tight">You're the first one here!</h3>
                    <p className="text-lg text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed">
                      No one in your network has moved to <strong className="text-white">{currentCitySearch}</strong> yet. 
                      Register to plant your flag!
                    </p>
                    {!sessionUser ? (
                      <button onClick={() => setShowAuthModal(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1">
                        Sign Up & Be the First
                      </button>
                    ) : (
                      <p className="text-cyan-400 font-bold bg-cyan-900/20 p-4 rounded-xl inline-block border border-cyan-800/50">
                        You're on the list! We'll notify you when someone joins.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {users.map(user => (
                    <div key={user.id} className="group bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 hover:border-slate-700 transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{user.pseudonym}</h2>
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-800 text-slate-300">{user.status}</span>
                        </div>
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center text-sm text-slate-400">
                            <span className="mr-2">🏠</span> From <strong className="text-slate-200 ml-1">{user.home_city}</strong> {user.home_pincode && `(${user.home_pincode})`}
                          </div>
                          {user.language && (
                            <div className="flex items-center text-sm text-slate-400">
                              <span className="mr-2">🗣️</span> Speaks <strong className="text-slate-200 ml-1">{user.language}</strong>
                            </div>
                          )}
                          {user.gender && user.gender !== 'Prefer not to say' && (
                            <div className="flex items-center text-sm text-slate-400">
                              <span className="mr-2">👤</span> <span className="text-slate-200">{user.gender}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => startChat(user.id)}
                        className="w-full bg-slate-800 group-hover:bg-cyan-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                      >
                        Start Anonymous Chat
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  )
}