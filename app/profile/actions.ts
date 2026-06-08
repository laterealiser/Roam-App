'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const pseudonym = formData.get('pseudonym') as string
  const real_name = formData.get('real_name') as string
  const status = formData.get('status') as string
  const home_city = formData.get('home_city') as string
  const home_pincode = formData.get('home_pincode') as string
  const current_city = formData.get('current_city') as string
  const current_pincode = formData.get('current_pincode') as string
  const gender = formData.get('gender') as string
  const language = formData.get('language') as string

  // We should also check if current_pincode changed compared to existing, but it's simpler to just geocode again to be safe.
  let current_lat = null;
  let current_lng = null;

  try {
    const query = encodeURIComponent(`${current_pincode} ${current_city}`);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
      headers: {
        'User-Agent': 'RoamApp/1.0 (Testing Radius Matching)'
      }
    });
    const data = await res.json();
    if (data && data.length > 0) {
      current_lat = parseFloat(data[0].lat);
      current_lng = parseFloat(data[0].lon);
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
  }

  // We upsert since id is the primary key.
  const updateData: any = {
    id: user.id,
    pseudonym,
    real_name,
    status,
    home_city,
    home_pincode,
    current_city,
    current_pincode,
    gender,
    language
  }

  // Only update coordinates if geocoding was successful, to avoid wiping out existing if API fails.
  if (current_lat !== null && current_lng !== null) {
    updateData.current_lat = current_lat;
    updateData.current_lng = current_lng;
  }

  const { error } = await supabase.from('profiles').upsert(updateData)

  if (error) {
    redirect(`/profile?error=${encodeURIComponent(error.message)}`)
  }

  redirect(`/profile?success=${encodeURIComponent('Profile updated successfully!')}`)
}
