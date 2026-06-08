import { createProfile } from './actions'

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full min-h-screen relative overflow-hidden bg-slate-950 text-white justify-center items-center py-12">
      {/* Premium glowing background elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full px-6 sm:max-w-2xl mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800/50">
          <h1 className="text-4xl text-white font-extrabold mb-3 tracking-tight">Complete your profile</h1>
          <p className="text-slate-400 mb-10 text-lg">Tell us a bit about yourself. Don't worry, you'll be completely anonymous until you choose to reveal yourself.</p>
          
          <form className="flex flex-col w-full gap-6 text-slate-200">
          
          <div>
            <label className="text-sm font-bold text-slate-400 block mb-1">Pseudonym (Public)</label>
            <input className="w-full rounded-lg px-4 py-3 bg-slate-800 border border-slate-700 placeholder-slate-500" name="pseudonym" placeholder="e.g. TechBro in Tokyo" required />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-400 block mb-1">Real Name (Private until revealed)</label>
            <input className="w-full rounded-lg px-4 py-3 bg-slate-800 border border-slate-700 placeholder-slate-500" name="real_name" placeholder="John Doe" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-400 block mb-1">Home City / Region</label>
              <input className="w-full rounded-lg px-4 py-3 bg-slate-800 border border-slate-700 placeholder-slate-500" name="home_city" placeholder="e.g. Mumbai" required />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-400 block mb-1">Home Pincode</label>
              <input className="w-full rounded-lg px-4 py-3 bg-slate-800 border border-slate-700 placeholder-slate-500" name="home_pincode" placeholder="e.g. 400001" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-400 block mb-1">Current City, University, or Company</label>
              <input className="w-full rounded-lg px-4 py-3 bg-slate-800 border border-slate-700 placeholder-slate-500" name="current_city" placeholder="e.g. London, Oxford Uni..." required />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-400 block mb-1">Current Pincode</label>
              <input className="w-full rounded-lg px-4 py-3 bg-slate-800 border border-slate-700 placeholder-slate-500" name="current_pincode" placeholder="e.g. SW1A 1AA" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-400 block mb-1">Gender</label>
              <select className="w-full rounded-lg px-4 py-3 bg-slate-800 border border-slate-700 text-slate-200" name="gender" required defaultValue="">
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-400 block mb-1">Primary Language</label>
              <input className="w-full rounded-lg px-4 py-3 bg-slate-800 border border-slate-700 placeholder-slate-500" name="language" placeholder="e.g. Telugu" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-400 block mb-1">Status</label>
            <select className="w-full rounded-lg px-4 py-3 bg-slate-800 border border-slate-700 text-slate-200" name="status" required defaultValue="Student">
              <option value="Student">Student</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <button
            formAction={createProfile}
            className="mt-4 bg-blue-600 rounded-lg px-4 py-3 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            Join the Directory
          </button>
          
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-slate-800 text-red-400 text-center rounded-lg border border-slate-700">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
      </div>
    </div>
  )
}
