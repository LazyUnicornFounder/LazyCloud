
-- Drop the overly permissive update policy
DROP POLICY IF EXISTS "Submissions can be updated by matching polar_customer_id" ON public.submissions;

-- Add RLS policies for app_config (read-only public)
CREATE POLICY "Anyone can read app_config" ON public.app_config FOR SELECT USING (true);

-- Add RLS policy for visitors (insert only, no reads from client)
CREATE POLICY "Edge functions can insert visitors" ON public.visitors FOR INSERT WITH CHECK (true);
