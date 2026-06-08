import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile } from './actions'

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { error?: string, success?: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the existing profile data to prepopulate the form
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full p-6 max-w-4xl mx-auto flex flex-col min-h-[80vh]">
        <div className="mb-10 text-center sm:text-left mt-12">
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight">Your Profile</h1>
          <p className="text-slate-400 text-xl">Manage your anonymous identity and location settings.</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/50 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {searchParams?.success && (
            <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-center gap-3">
              <span className="text-emerald-400 text-xl">✓</span>
              <p className="text-emerald-400 font-medium">{searchParams.success}</p>
            </div>
          )}

          {searchParams?.error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3">
              <span className="text-red-400 text-xl">⚠</span>
              <p className="text-red-400 font-medium">{searchParams.error}</p>
            </div>
          )}

          <form action={updateProfile} className="flex flex-col w-full gap-8 text-slate-200">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Identity Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-slate-800 pb-2">Identity</h2>
                
                <div>
                  <label className="text-sm font-bold text-slate-400 block mb-2">Pseudonym (Public)</label>
                  <input className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all" name="pseudonym" defaultValue={profile.pseudonym} required />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-400 block mb-2">Real Name (Private)</label>
                  <input className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all" name="real_name" defaultValue={profile.real_name} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-400 block mb-2">Gender</label>
                    <select className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all" name="gender" defaultValue={profile.gender} required>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-400 block mb-2">Status</label>
                    <select className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all" name="status" defaultValue={profile.status} required>
                      <option value="Student">Student</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-400 block mb-2">Primary Language</label>
                  <input className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all" name="language" defaultValue={profile.language} required />
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-slate-800 pb-2">Location Data</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-400 block mb-2">Home City</label>
                    <input className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all" name="home_city" defaultValue={profile.home_city} required />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-400 block mb-2">Home Pincode</label>
                    <input className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all" name="home_pincode" defaultValue={profile.home_pincode} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-400 block mb-2">Current City</label>
                    <input className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all" name="current_city" defaultValue={profile.current_city} required />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-400 block mb-2">Current Pincode</label>
                    <input className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all" name="current_pincode" defaultValue={profile.current_pincode} required />
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong>Note:</strong> When you update your Current City or Pincode, our system will automatically re-calculate your coordinates so your network matches stay perfectly accurate!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-800 pt-8 flex justify-end">
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 w-full sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
