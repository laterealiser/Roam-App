import { login, signup } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full min-h-screen relative overflow-hidden bg-slate-950 text-white justify-center items-center py-12">
      {/* Premium glowing background elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full px-6 sm:max-w-md mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800/50">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">🌐</span>
            <h1 className="text-4xl text-white font-extrabold mb-3 tracking-tight">Welcome to Roam</h1>
            <p className="text-slate-400 text-lg">Sign in to find your people, wherever you are.</p>
          </div>
          
          <form className="flex flex-col w-full gap-5 text-slate-200">
            <div>
              <label className="text-sm font-bold text-slate-400 block mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-bold text-slate-400 block mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            <button
              formAction={login}
              className="w-full bg-cyan-600 hover:bg-cyan-500 rounded-xl px-4 py-4 text-white font-bold transition-all shadow-lg hover:shadow-cyan-500/25 mt-2"
            >
              Sign In
            </button>

            <button
              formAction={signup}
              className="w-full bg-slate-800/80 border border-slate-700 hover:bg-slate-700 rounded-xl px-4 py-4 text-white font-bold transition-all"
            >
              Create Account
            </button>
            
            {searchParams?.message && (
              <div className="mt-2 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3">
                <span className="text-red-400 text-xl">⚠</span>
                <p className="text-red-400 font-medium text-sm">{searchParams.message}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
