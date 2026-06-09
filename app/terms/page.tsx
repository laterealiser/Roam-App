export default function TermsPage() {
  return (
    <div className="flex-1 flex flex-col w-full min-h-[calc(100vh-5rem)] bg-slate-950 text-white relative overflow-hidden">
      <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full px-6 py-16 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Terms of Service</h1>
        <p className="text-slate-400 text-lg mb-12">Last updated: June 9, 2026</p>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/50 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">By accessing or using Roam ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-slate-300 leading-relaxed">Roam is a platform that helps people who have moved away from their home city discover and connect with others from the same hometown who are living nearby. Users can communicate anonymously and choose to reveal their identity at their own discretion.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>You must provide accurate and complete information when creating your account</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must be at least 18 years old to use Roam</li>
              <li>One person may only maintain one account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
            <p className="text-slate-300 leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Use Roam for any illegal or unauthorized purpose</li>
              <li>Harass, bully, or threaten other users</li>
              <li>Impersonate another person or provide false information</li>
              <li>Send spam, unsolicited messages, or advertisements</li>
              <li>Attempt to access other users' accounts or private data</li>
              <li>Use automated scripts or bots to interact with the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Content & Messages</h2>
            <p className="text-slate-300 leading-relaxed">All chat messages on Roam are automatically deleted after 24 hours. You are solely responsible for the content of your messages. Roam reserves the right to remove content or suspend accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Privacy</h2>
            <p className="text-slate-300 leading-relaxed">Your use of Roam is also governed by our <a href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</a>. By using the Service, you consent to the collection and use of information as described in that policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-slate-300 leading-relaxed">Roam is provided "as is" without any warranties of any kind, express or implied. We do not guarantee the accuracy of user-provided information or the availability of the Service at all times.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-slate-300 leading-relaxed">To the maximum extent permitted by law, Roam shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Changes to These Terms</h2>
            <p className="text-slate-300 leading-relaxed">We reserve the right to modify these terms at any time. We will notify users of significant changes through the Service. Continued use of Roam after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contact</h2>
            <p className="text-slate-300 leading-relaxed">For questions about these Terms, please reach out at <a href="mailto:hello@roamapp.com" className="text-cyan-400 hover:underline">hello@roamapp.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
