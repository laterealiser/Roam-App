import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import NetworkClient from './NetworkClient'

export default async function NetworkPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get current user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  // Fetch nearby users using the RPC function we created
  let nearbyMatches: any[] = []
  
  if (profile.current_lat && profile.current_lng) {
    const { data, error } = await supabase.rpc('nearby_users', {
      p_home_city: profile.home_city,
      p_lat: profile.current_lat,
      p_lng: profile.current_lng,
      p_radius_miles: 100
    })
    
    if (!error && data) {
      nearbyMatches = data
    } else {
      console.error("RPC Error:", error)
    }
  }

  return (
    <NetworkClient 
      profile={profile} 
      nearbyMatches={nearbyMatches} 
      userId={user.id} 
    />
  )
}
