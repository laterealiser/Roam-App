export default function PrivacyPage() {
  return (
    <div className="flex-1 flex flex-col w-full min-h-[calc(100vh-5rem)] bg-slate-950 text-white relative overflow-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full px-6 py-16 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-400 text-lg mb-12">Last updated: June 9, 2026</p>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/50 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-slate-300 leading-relaxed">When you create an account on Roam, we collect the following information:</p>
            <ul className="list-disc list-inside text-slate-400 mt-3 space-y-2">
              <li>Email address (for authentication)</li>
              <li>Pseudonym and real name (real name is private until you choose to reveal it)</li>
              <li>Home city and pincode</li>
              <li>Current city and pincode (used for location-based matching)</li>
              <li>Gender and primary language (optional filters)</li>
              <li>Approximate geographic coordinates derived from your pincode (never your precise GPS location)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>To match you with people from your home city within a 100-mile radius of your current location</li>
              <li>To display your pseudonym to other users on the platform</li>
              <li>To enable anonymous and revealed messaging between connected users</li>
              <li>To improve and personalize your experience on Roam</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
            <p className="text-slate-300 leading-relaxed">We use industry-standard security measures including encrypted connections (HTTPS/TLS), secure authentication via Supabase Auth, and Row-Level Security (RLS) policies on our database. Your real name is never exposed to other users unless you explicitly choose to reveal your identity in a chat.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Retention</h2>
            <p className="text-slate-300 leading-relaxed">Chat messages are automatically deleted after 24 hours. Your profile data is retained for as long as your account is active. You may request deletion of your account and all associated data at any time.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Third-Party Services</h2>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li><strong>Supabase</strong> — Authentication and database hosting</li>
              <li><strong>OpenStreetMap Nominatim</strong> — Geocoding your pincode to approximate coordinates (no personal data is sent)</li>
              <li><strong>Vercel</strong> — Application hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="text-slate-300 leading-relaxed">You have the right to access, update, or delete your personal data at any time through the Profile Settings page. You can also contact us at <a href="mailto:hello@roamapp.com" className="text-cyan-400 hover:underline">hello@roamapp.com</a> for any privacy-related requests.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Contact</h2>
            <p className="text-slate-300 leading-relaxed">If you have questions about this privacy policy, please contact us at <a href="mailto:hello@roamapp.com" className="text-cyan-400 hover:underline">hello@roamapp.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
