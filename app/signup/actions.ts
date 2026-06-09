'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm-password') as string

  if (password !== confirmPassword) {
    redirect(`/signup?message=${encodeURIComponent('Passwords do not match.')}`)
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(error.message)}`)
  }

  if (data.session) {
    redirect('/onboarding')
  } else {
    redirect('/login?message=Account created! Check your email to confirm, or disable email confirmations in Supabase.')
  }
}
