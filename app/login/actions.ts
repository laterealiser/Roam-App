'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  // Check if the user already has a profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', (await supabase.auth.getUser()).data.user?.id)
    .single()

  if (profile) {
    redirect('/network')
  } else {
    redirect('/onboarding')
  }
}
