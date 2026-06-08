-- Run this in your Supabase SQL Editor to add the new fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS language TEXT;
