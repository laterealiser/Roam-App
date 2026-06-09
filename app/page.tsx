"use client"
import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import createGlobe from "cobe"

// Vivid rotating 3D globe with network markers
function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const phiRef = useRef(0)
  const globeRef = useRef<any>(null)

  const initGlobe = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return
    
    if (globeRef.current) globeRef.current.destroy()

    const containerWidth = containerRef.current.offsetWidth
    const containerHeight = containerRef.current.offsetHeight
    const size = Math.min(containerWidth, containerHeight, 600)
    
    canvasRef.current.style.width = `${size}px`
    canvasRef.current.style.height = `${size}px`
    
    // Marker locations — major world cities
    const markers: { location: [number, number], size: number }[] = [
      { location: [37.7595, -122.4367], size: 0.06 },  // San Francisco
      { location: [40.7128, -74.0060], size: 0.07 },   // New York
      { location: [51.5072, -0.1276], size: 0.07 },    // London
      { location: [35.6762, 139.6503], size: 0.06 },   // Tokyo
      { location: [19.0760, 72.8777], size: 0.07 },    // Mumbai
      { location: [1.3521, 103.8198], size: 0.05 },    // Singapore
      { location: [-33.8688, 151.2093], size: 0.05 },  // Sydney
      { location: [-23.5505, -46.6333], size: 0.06 },  // São Paulo
      { location: [25.2048, 55.2708], size: 0.06 },    // Dubai
      { location: [48.8566, 2.3522], size: 0.06 },     // Paris
      { location: [28.6139, 77.2090], size: 0.06 },    // Delhi
      { location: [55.7558, 37.6173], size: 0.05 },    // Moscow
      { location: [13.7563, 100.5018], size: 0.05 },   // Bangkok
      { location: [52.5200, 13.4050], size: 0.05 },    // Berlin
      { location: [39.9042, 116.4074], size: 0.06 },   // Beijing
      { location: [-1.2921, 36.8219], size: 0.04 },    // Nairobi
      { location: [43.6532, -79.3832], size: 0.05 },   // Toronto
    ]

    let frameCount = 0
    
    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 24000,
      mapBrightness: 8,
      baseColor: [0.15, 0.2, 0.35],
      markerColor: [0.1, 0.9, 0.7],
      glowColor: [0.05, 0.15, 0.35],
      markers: markers,
      // @ts-expect-error - cobe types
      onRender: (state: any) => {
        state.phi = phiRef.current
        phiRef.current += 0.003
        frameCount++
        
        // Animate marker sizes to create a pulsing network effect
        state.markers = markers.map((m, i) => ({
          ...m,
          size: m.size + Math.sin(frameCount * 0.03 + i * 1.5) * 0.02
        }))
      },
    })
  }, [])

  useEffect(() => {
    initGlobe()
    const handleResize = () => { initGlobe() }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (globeRef.current) globeRef.current.destroy()
    }
  }, [initGlobe])

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      {/* Pulse rings behind the globe */}
      <div className="absolute w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] rounded-full border border-cyan-500/10 animate-ping" style={{ animationDuration: '4s' }} />
      <div className="absolute w-[350px] h-[350px] sm:w-[480px] sm:h-[480px] md:w-[580px] md:h-[580px] rounded-full border border-blue-500/5 animate-ping" style={{ animationDuration: '6s' }} />
      <canvas ref={canvasRef} className="opacity-80" />
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
  
  // Mobile filter panel toggle
  const [showFilters, setShowFilters] = useState(false)

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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative mx-4">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">✕</button>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{authMode === 'login' ? 'Sign in to chat' : 'Join Roam to chat'}</h2>
            <p className="text-slate-400 text-sm mb-6">You need an account to connect with others anonymously.</p>
            <form onSubmit={handleAuthAction} className="flex flex-col gap-4">
              <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none text-base" type="email" placeholder="Email address" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required />
              <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none text-base" type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required minLength={6} />
              {authError && <div className="text-red-400 text-sm p-3 bg-red-900/20 rounded-lg">{authError}</div>}
              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-colors mt-2 text-base">{authMode === 'login' ? 'Sign In' : 'Create Account'}</button>
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

          {/* HERO */}
          <section className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
            <Globe />
            <div className="absolute top-[-10%] left-[-5%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-3xl text-center mb-2 sm:mb-8">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-5 sm:mb-6">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                Connecting people across 50+ cities
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-3 sm:mb-4 text-white leading-[1.1]">
                Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">network</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-10 max-w-xl mx-auto px-2">
                Moved to a new city? Search for your university, workplace, or area and discover people from your hometown living nearby.
              </p>
              
              <form onSubmit={handleMainSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto relative z-20 px-2">
                <input 
                  value={currentCitySearch}
                  onChange={(e) => setCurrentCitySearch(e.target.value)}
                  className="flex-1 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 text-base sm:text-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400 shadow-2xl transition-all" 
                  placeholder="University, Area, or Pincode" 
                  autoFocus
                />
                <button 
                  type="submit"
                  disabled={!currentCitySearch.trim()}
                  className="bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 hover:bg-cyan-500 text-white font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-xl sm:rounded-2xl transition-colors shadow-lg text-base"
                >
                  Search
                </button>
              </form>
            </div>
          </section>

          {/* COMPACT FEATURES — hidden on mobile to keep it tight */}
          <section className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-16">
            <div className="max-w-5xl mx-auto grid grid-cols-3 gap-3 sm:gap-6">
              {[
                { icon: "📍", title: "Hyper-Local", desc: "100-mile radius matching from your pincode" },
                { icon: "🎭", title: "Anonymous", desc: "Chat with a pseudonym, reveal when ready" },
                { icon: "🔒", title: "Private", desc: "Messages auto-delete after 24 hours" },
              ].map((f, i) => (
                <div key={i} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center hover:border-cyan-500/30 transition-all duration-300">
                  <span className="text-xl sm:text-3xl mb-1 sm:mb-3 block">{f.icon}</span>
                  <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 sm:mb-1">{f.title}</h3>
                  <p className="text-slate-400 text-[10px] sm:text-xs leading-relaxed hidden sm:block">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* ═══ SEARCH RESULTS STATE ═══ */
        <div className="p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto relative z-10">
          <header className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 border-b border-slate-800 pb-6 sm:pb-8">
            <div>
              <button className="text-xl sm:text-3xl font-extrabold text-white mb-2 hover:text-cyan-400 transition-colors flex items-center gap-2" onClick={() => setHasSearched(false)}>
                ← <span className="text-lg sm:text-3xl">New Search</span>
              </button>
              <p className="text-base sm:text-xl text-slate-400">
                People at <strong className="text-white">{currentCitySearch}</strong>
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <button onClick={() => setHasSearched(false)} className="text-sm font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-900/20 px-4 py-2 rounded-lg border border-cyan-900/50">
                Change Location
              </button>
              {/* Mobile filter toggle */}
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="lg:hidden text-sm font-bold text-slate-300 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700"
              >
                {showFilters ? 'Hide Filters' : 'Filters'}
              </button>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Sidebar Filters — collapsible on mobile */}
            <aside className={`w-full lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-800 lg:sticky lg:top-24">
                <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Filter Results</h3>
                <div className="space-y-4 sm:space-y-6">
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
                  <button onClick={() => { setHomeCityFilter(''); setGenderFilter(''); setLanguageFilter(''); }} className="w-full mt-2 text-xs font-bold text-slate-400 hover:text-white py-2">Clear Filters</button>
                </div>
              </div>
            </aside>

            {/* Results Grid */}
            <main className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 animate-pulse h-48"></div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 sm:py-20 px-4 sm:px-6 bg-slate-900/80 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-emerald-900/20 pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 animate-pulse">🌱</div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-white tracking-tight">You're the first one here!</h3>
                    <p className="text-base sm:text-lg text-slate-300 mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed">
                      No one from your network has moved to <strong className="text-white">{currentCitySearch}</strong> yet. 
                      Register to plant your flag!
                    </p>
                    {!sessionUser ? (
                      <button onClick={() => setShowAuthModal(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-cyan-500/25 text-base">
                        Sign Up & Be the First
                      </button>
                    ) : (
                      <p className="text-cyan-400 font-bold bg-cyan-900/20 p-4 rounded-xl inline-block border border-cyan-800/50 text-sm sm:text-base">
                        You're on the list! We'll notify you when someone joins.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {users.map(user => (
                    <div key={user.id} className="group bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-800 hover:border-slate-700 transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                          <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{user.pseudonym}</h2>
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-800 text-slate-300">{user.status}</span>
                        </div>
                        <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
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