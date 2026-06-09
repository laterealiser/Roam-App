import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/auth') || request.nextUrl.pathname.startsWith('/signup') || request.nextUrl.pathname.startsWith('/forgot-password');
  const isPublicRoute = request.nextUrl.pathname === '/';

  // If user is NOT logged in and NOT on an auth route or public route, redirect to login
  if (!user && !isAuthRoute && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in, check if they have a profile
  if (user && !isAuthRoute && !request.nextUrl.pathname.startsWith('/onboarding')) {
    // We should ideally check the profile here, but querying the DB in middleware 
    // can be slow and run on edge. Alternatively, we can check for a profile in a server layout 
    // and redirect from there. We'll leave middleware just for auth for now.
  }

  return supabaseResponse
}
