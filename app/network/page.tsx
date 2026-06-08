import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NetworkPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get current user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  // Fetch nearby users using the RPC function we created
  let nearbyMatches: any[] = []
  
  if (profile.current_lat && profile.current_lng) {
    const { data, error } = await supabase.rpc('nearby_users', {
      p_home_city: profile.home_city,
      p_lat: profile.current_lat,
      p_lng: profile.current_lng,
      p_radius_miles: 5 // 5 mile radius
    })
    
    if (!error && data) {
      nearbyMatches = data
    } else {
      console.error("RPC Error:", error)
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen bg-slate-950 text-white p-6 pt-12 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">The Local Network</h1>
        <p className="text-slate-400 text-lg">
          You are currently in <span className="text-cyan-400 font-semibold">{profile.current_city}</span> holding the flag for <span className="text-blue-400 font-semibold">{profile.home_city}</span>.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <div className="w-32 h-32 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="text-3xl">📍</span> Hyper-Local Matches
        </h2>
        
        {(!profile.current_lat) ? (
          <p className="text-slate-400">We don't have your exact coordinates yet. Please update your profile to enable radius matching.</p>
        ) : nearbyMatches.length === 0 ? (
          <div className="py-8">
            <p className="text-xl text-slate-300 font-medium mb-2">You're the first pioneer here!</p>
            <p className="text-slate-400">There is no one else from {profile.home_city} within a 5-mile radius of you yet. We'll notify you when someone arrives.</p>
          </div>
        ) : (
          <div>
            <p className="text-slate-300 font-medium mb-6 text-lg">
              There {nearbyMatches.length === 1 ? 'is' : 'are'} <span className="text-cyan-400 font-bold text-xl">{nearbyMatches.length}</span> {nearbyMatches.length === 1 ? 'person' : 'people'} from {profile.home_city} within 5 miles of you!
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              {nearbyMatches.map((match) => (
                <div key={match.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{match.pseudonym}</h3>
                      <p className="text-sm text-slate-400">{match.status} • {Math.round(match.distance * 10) / 10} miles away</p>
                    </div>
                    <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                      {match.home_city}
                    </div>
                  </div>
                  <button className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 text-sm font-bold transition-colors">
                    Send Message
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto py-8">
        <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors">
          ← Back to Globe
        </Link>
      </div>
    </div>
  )
}
