"use client"

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative z-10 bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🌐</span>
              <span className="text-2xl font-extrabold text-white tracking-tight">Roam</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Find the people who feel like home, wherever you roam. Connect anonymously with people from your hometown living near you.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Home</Link></li>
              <li><Link href="/network" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Network</Link></li>
              <li><Link href="/messages" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Messages</Link></li>
              <li><Link href="/profile" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Profile</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-3">
              <li><a href="mailto:hello@roamapp.com" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Twitter / X</a></li>
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Instagram</a></li>
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2026 Roam. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
