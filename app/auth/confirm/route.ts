import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if "next" is in param, use it as the redirect URL
  // Defaulting to /onboarding so new users are forced to fill out their profile
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const nextUrl = new URL(next, request.url)
      return NextResponse.redirect(nextUrl)
    } else {
      console.error("Auth confirmation error:", error.message)
    }
  }

  // return the user to an error page with some instructions
  const errorUrl = new URL('/login?message=Could not verify OTP', request.url)
  return NextResponse.redirect(errorUrl)
}
