"use client"
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import createGlobe from "cobe"
import Link from 'next/link'

// Sleek rotating 3D globe
function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)

  useEffect(() => {
    if (!canvasRef.current) return
    const width = canvasRef.current.offsetWidth
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.15], 
      markerColor: [0.2, 1, 0.8],
      glowColor: [0.1, 0.2, 0.4], 
      markers: [
        { location: [37.7595, -122.4367], size: 0.02 },
        { location: [40.7128, -74.0060], size: 0.025 },
        { location: [51.5072, -0.1276], size: 0.02 },
        { location: [35.6762, 139.6503], size: 0.03 },
        { location: [19.0760, 72.8777], size: 0.025 },
        { location: [1.3521, 103.8198], size: 0.02 },
        { location: [-33.8688, 151.2093], size: 0.02 },
        { location: [-23.5505, -46.6333], size: 0.025 },
        { location: [25.2048, 55.2708], size: 0.02 },
        { location: [48.8566, 2.3522], size: 0.02 },
        { location: [52.5200, 13.4050], size: 0.015 },
        { location: [31.2304, 121.4737], size: 0.025 },
        { location: [28.6139, 77.2090], size: 0.02 },
        { location: [6.5244, 3.3792], size: 0.02 },
      ],
      // @ts-expect-error - cobe types
      onRender: (state: any) => {
        state.phi = phiRef.current
        phiRef.current += 0.005
        state.width = width * 2
        state.height = width * 2
      },
    })
    
    return () => { globe.destroy() }
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-50 mix-blend-screen w-full h-full max-w-3xl mx-auto">
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', aspectRatio: '1' }} 
      />
    </div>
  )
}

// Feature card component
function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="group bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(34,211,238,0.08)] transition-all duration-500">
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}

// Step component
function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-extrabold text-white mb-5 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
        {number}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-xs leading-relaxed">{description}</p>
    </div>
  )
}

// Stat counter
function Stat({ value, label }: { value: string, label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">{value}</div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">

      {/* ═══════════════════════════════════════════ */}
      {/*  HERO SECTION                               */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6">
        <Globe />
        
        {/* Glow orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Now connecting people across 50+ cities
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">people</span>,<br />
            wherever you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">roam</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Moved to a new city for work or study? Roam connects you with people from your hometown who are living nearby — completely anonymously, until you're ready to say hello.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5 text-lg"
            >
              Get Started Free
            </Link>
            <a
              href="#how-it-works"
              className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-bold py-4 px-10 rounded-2xl transition-all hover:-translate-y-0.5 text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/*  SOCIAL PROOF STATS                         */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-6 border-y border-slate-800/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <Stat value="500+" label="Active Users" />
          <Stat value="50+" label="Cities Connected" />
          <Stat value="100mi" label="Matching Radius" />
          <Stat value="24h" label="Message Privacy" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/*  FEATURE HIGHLIGHTS                         */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Why people love <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Roam</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Built for anyone who has ever felt like a stranger in a new city. We make the world feel smaller.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📍"
              title="Hyper-Local Discovery"
              description="We don't just say 'There are 50 people in London.' We tell you there are 3 people from your home city within 2 miles of your pincode right now."
            />
            <FeatureCard
              icon="🎭"
              title="Anonymous Until You're Ready"
              description="Chat behind a pseudonym first. When you're comfortable, reveal your real identity with one click. No pressure, no awkwardness."
            />
            <FeatureCard
              icon="🔒"
              title="Privacy by Design"
              description="Messages auto-delete after 24 hours. Your real name is hidden until you choose to share it. Your GPS is never tracked — only your pincode."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/*  HOW IT WORKS                               */}
      {/* ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 py-24 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">How it works</h2>
            <p className="text-slate-400 text-lg">Three steps to finding your people.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Step
              number="1"
              title="Create Your Account"
              description="Sign up in 30 seconds. Set your pseudonym, home city, and current location. Your real name stays private."
            />
            <Step
              number="2"
              title="Set Your Location"
              description="Tell us your current pincode. Our system uses it to find people from your hometown within a 100-mile radius."
            />
            <Step
              number="3"
              title="Connect & Chat"
              description="Browse your local network, start anonymous chats, and reveal your identity when you're ready. It's that simple."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/*  TESTIMONIALS                               */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">What our users say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "I moved to London for my Master's and felt completely alone. Roam helped me find 4 people from Hyderabad living within walking distance. We're best friends now.",
                name: "Priya K.",
                detail: "Student, London"
              },
              {
                quote: "The anonymous chat feature is genius. I could have a real conversation before deciding to meet in person. It felt safe and natural.",
                name: "Marcus T.",
                detail: "Professional, Berlin"
              },
              {
                quote: "Within my first week, Roam connected me with someone from my hometown who works at the same company. We now commute together every day!",
                name: "Ananya R.",
                detail: "Engineer, San Francisco"
              }
            ].map((t, i) => (
              <div key={i} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8">
                <div className="text-cyan-400 text-3xl mb-4">"</div>
                <p className="text-slate-300 leading-relaxed mb-6 italic">{t.quote}</p>
                <div>
                  <p className="text-white font-bold">{t.name}</p>
                  <p className="text-slate-400 text-sm">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/*  FINAL CTA                                  */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/20 rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Ready to find your people?</h2>
              <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">Join hundreds of travelers, students, and professionals who are building their local network on Roam.</p>
              <Link
                href="/login"
                className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-12 rounded-2xl transition-all shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5 text-lg"
              >
                Start Your Journey — It's Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}