"use client"

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function NetworkClient({ 
  profile, 
  nearbyMatches, 
  userId 
}: { 
  profile: any, 
  nearbyMatches: any[], 
  userId: string 
}) {
  const router = useRouter()
  const supabase = createClient()

  async function startChat(receiverId: string) {
    if (userId === receiverId) {
      alert("You cannot start a chat with yourself.")
      return
    }

    // Check if connection already exists
    const { data: existing } = await supabase
      .from('connections')
      .select('id')
      .or(`and(user_one_id.eq.${userId},user_two_id.eq.${receiverId}),and(user_one_id.eq.${receiverId},user_two_id.eq.${userId})`)
      .limit(1)

    if (existing && existing.length > 0) {
      router.push(`/chat/${existing[0].id}`)
      return
    }

    const { data, error } = await supabase
      .from('connections')
      .insert([{ user_one_id: userId, user_two_id: receiverId, status: 'ANONYMOUS' }])
      .select()

    if (data && data.length > 0) {
      router.push(`/chat/${data[0].id}`)
    } else {
      console.error(error)
      alert("Failed to start chat. Please try again.")
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full min-h-[calc(100vh-5rem)] bg-slate-950 text-white relative overflow-hidden">
      {/* Premium glowing background elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full p-6 pt-12 max-w-5xl mx-auto flex flex-col">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight">The Local Network</h1>
          <p className="text-slate-400 text-xl">
            You are currently in <span className="text-cyan-400 font-bold">{profile.current_city}</span> holding the flag for <span className="text-blue-400 font-bold">{profile.home_city}</span>.
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/50 rounded-3xl p-8 sm:p-12 mb-8 shadow-2xl relative overflow-hidden flex-1">
          <div className="absolute top-0 right-0 p-8 opacity-30">
            <div className="w-48 h-48 bg-cyan-500 rounded-full blur-[100px]"></div>
          </div>
          
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 relative z-10">
            <span className="text-4xl">📍</span> Hyper-Local Matches
          </h2>
          
          <div className="relative z-10">
            {(!profile.current_lat) ? (
              <p className="text-slate-400 text-lg">We don't have your exact coordinates yet. Please update your profile to enable radius matching.</p>
            ) : nearbyMatches.length === 0 ? (
              <div className="py-12 text-center sm:text-left">
                <p className="text-2xl text-slate-200 font-bold mb-3">You're the first pioneer here!</p>
                <p className="text-slate-400 text-lg">There is no one else from {profile.home_city} within a 100-mile radius of you yet. We'll notify you when someone arrives.</p>
              </div>
            ) : (
              <div>
                <p className="text-slate-300 font-medium mb-8 text-xl">
                  There {nearbyMatches.length === 1 ? 'is' : 'are'} <span className="text-cyan-400 font-black text-2xl px-1">{nearbyMatches.length}</span> {nearbyMatches.length === 1 ? 'person' : 'people'} from {profile.home_city} within 100 miles of you!
                </p>
                
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {nearbyMatches.map((match) => (
                    <div key={match.id} className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all duration-300 group">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="font-extrabold text-xl mb-1 text-white group-hover:text-cyan-400 transition-colors">{match.pseudonym}</h3>
                          <p className="text-sm text-slate-400 font-medium">{match.status} • {Math.round(match.distance * 10) / 10} miles away</p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                          {match.home_city}
                        </div>
                      </div>
                      <button 
                        onClick={() => startChat(match.id)}
                        className="w-full bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 rounded-xl py-3 text-sm font-bold transition-all duration-300"
                      >
                        Send Message
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
