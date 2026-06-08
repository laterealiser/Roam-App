-- Supabase SQL Editor Script: Enable RLS and setup policies
-- Paste this script into your Supabase Dashboard SQL Editor and hit "Run"

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 2. Profile Policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- 3. Connection Policies
DROP POLICY IF EXISTS "Users can view their own connections" ON public.connections;
CREATE POLICY "Users can view their own connections" ON public.connections
FOR SELECT USING (auth.uid() = user_one_id OR auth.uid() = user_two_id);

DROP POLICY IF EXISTS "Users can insert their own connections" ON public.connections;
CREATE POLICY "Users can insert their own connections" ON public.connections
FOR INSERT WITH CHECK (auth.uid() = user_one_id OR auth.uid() = user_two_id);

DROP POLICY IF EXISTS "Users can update their own connections" ON public.connections;
CREATE POLICY "Users can update their own connections" ON public.connections
FOR UPDATE USING (auth.uid() = user_one_id OR auth.uid() = user_two_id);

-- 4. Message Policies
DROP POLICY IF EXISTS "Users can view messages of their connections" ON public.messages;
CREATE POLICY "Users can view messages of their connections" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.connections c
    WHERE c.id = messages.connection_id
    AND (c.user_one_id = auth.uid() OR c.user_two_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;
CREATE POLICY "Users can insert messages" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.connections c
    WHERE c.id = messages.connection_id
    AND (c.user_one_id = auth.uid() OR c.user_two_id = auth.uid())
  )
);

-- 5. Set up 24-Hour Message Auto-deletion (using pg_cron)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Unschedule first just in case we are running this multiple times
SELECT cron.unschedule('delete-old-messages');

-- Schedule a cron job to run every hour and delete messages older than 24 hours
SELECT cron.schedule(
  'delete-old-messages',
  '0 * * * *', -- Every hour
  $$ DELETE FROM public.messages WHERE created_at < NOW() - INTERVAL '24 hours' $$
);
