import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full p-6 max-w-5xl mx-auto flex flex-col min-h-[80vh]">
        <div className="mb-10 text-center sm:text-left mt-12">
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight">Your Profile</h1>
          <p className="text-slate-400 text-xl">Manage your anonymous identity and location.</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/50 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-center items-center">
          <div className="text-center py-10 max-w-md mx-auto">
            <span className="text-6xl mb-6 block">⚙️</span>
            <h3 className="text-2xl font-bold text-white mb-4">Profile Settings Coming Soon</h3>
            <p className="text-slate-400">Soon you'll be able to update your home city, current location, and matching preferences right here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
