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

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full p-6 max-w-5xl mx-auto flex flex-col min-h-[80vh]">
        <div className="mb-10 text-center sm:text-left mt-12">
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight">Messages</h1>
          <p className="text-slate-400 text-xl">Your active anonymous connections.</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/50 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-center items-center">
          <div className="text-center py-10 max-w-md mx-auto">
            <span className="text-6xl mb-6 block">💬</span>
            <h3 className="text-2xl font-bold text-white mb-4">No active chats yet</h3>
            <p className="text-slate-400 mb-8">Head over to the Network dashboard to find people and send your first anonymous message.</p>
            <Link href="/network" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25">
              Find Connections
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
