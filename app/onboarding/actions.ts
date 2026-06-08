'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createProfile(formData: FormData) {
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

  const { error } = await supabase.from('profiles').upsert({
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
  })

  if (error) {
    redirect(`/onboarding?message=${encodeURIComponent(error.message)}`)
  }

  redirect('/')
}
