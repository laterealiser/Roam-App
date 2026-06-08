import { login, signup } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 min-h-screen mx-auto">
      <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800">
        <h1 className="text-3xl text-white font-bold mb-2">Welcome to Roam</h1>
        <p className="text-slate-400 mb-8">Sign in with your email and password to find your people.</p>
        
        <form className="flex flex-col w-full justify-center gap-4 text-slate-200">
          <label className="text-sm font-bold text-slate-400" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-lg px-4 py-3 bg-slate-800 border border-slate-700 placeholder-slate-500"
            name="email"
            placeholder="you@example.com"
            required
          />
          
          <label className="text-sm font-bold text-slate-400 mt-2" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-lg px-4 py-3 bg-slate-800 border border-slate-700 placeholder-slate-500 mb-4"
            type="password"
            name="password"
            placeholder="••••••••"
            required
            minLength={6}
          />
          
          <button
            formAction={login}
            className="bg-blue-600 rounded-lg px-4 py-3 text-white font-bold mb-2 hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>

          <button
            formAction={signup}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-bold mb-2 hover:bg-slate-700 transition-colors"
          >
            Create Account
          </button>
          
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-slate-800 text-red-400 text-center rounded-lg border border-slate-700">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
