-- Run this in your Supabase SQL Editor to add the pincode fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS home_pincode TEXT,
ADD COLUMN IF NOT EXISTS current_pincode TEXT;
