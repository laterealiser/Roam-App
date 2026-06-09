import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch connections where the current user is a participant
  const { data: connections } = await supabase
    .from('connections')
    .select(`
      id,
      status,
      user_one_id,
      user_two_id,
      updated_at
    `)
    .or(`user_one_id.eq.${user.id},user_two_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  // For each connection, fetch the OTHER user's profile
  let conversations = []
  if (connections && connections.length > 0) {
    const otherUserIds = connections.map(c => c.user_one_id === user.id ? c.user_two_id : c.user_one_id)
    
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, pseudonym, real_name')
      .in('id', otherUserIds)

    const profilesMap: Record<string, any> = {}
    if (profiles) {
      profiles.forEach(p => profilesMap[p.id] = p)
    }

    conversations = connections.map(conn => {
      const otherUserId = conn.user_one_id === user.id ? conn.user_two_id : conn.user_one_id
      const otherProfile = profilesMap[otherUserId]
      
      const displayName = conn.status === 'REVEALED' 
        ? otherProfile?.real_name || 'Unknown' 
        : otherProfile?.pseudonym || 'Anonymous User'

      return {
        id: conn.id,
        status: conn.status,
        displayName,
        updatedAt: new Date(conn.updated_at).toLocaleDateString()
      }
    })
  }

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full p-6 max-w-4xl mx-auto flex flex-col min-h-[80vh]">
        <div className="mb-10 text-center sm:text-left mt-12 animate-page-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">Messages</h1>
          <p className="text-slate-400 text-lg sm:text-xl">Your active anonymous connections.</p>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/50 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-center items-center animate-page-in" style={{ animationDelay: '100ms' }}>
            <div className="text-center py-10 max-w-md mx-auto">
              <span className="text-6xl mb-6 block">💬</span>
              <h3 className="text-2xl font-bold text-white mb-4">No active chats yet</h3>
              <p className="text-slate-400 mb-8">Head over to the search dashboard to find people and send your first anonymous message.</p>
              <Link href="/" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25">
                Find Connections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {conversations.map((conv, i) => (
              <Link 
                key={conv.id} 
                href={`/chat/${conv.id}`}
                className="animate-page-in group bg-slate-900/80 backdrop-blur-lg border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-cyan-500/50 transition-all hover:bg-slate-800"
                style={{ opacity: 0, animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${conv.status === 'REVEALED' ? 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-slate-800 text-slate-300 group-hover:bg-cyan-600 group-hover:text-white'}`}>
                    {conv.status === 'REVEALED' ? 'R' : '?'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{conv.displayName}</h3>
                    <p className="text-sm text-slate-400">{conv.status === 'ANONYMOUS' ? 'Chatting Anonymously' : 'Identity Revealed'}</p>
                  </div>
                </div>
                <div className="text-slate-500 text-sm">
                  {conv.updatedAt}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
