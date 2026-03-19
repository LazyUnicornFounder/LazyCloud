
-- Allow public to read approved submissions
CREATE POLICY "Anyone can read approved submissions"
ON public.submissions
FOR SELECT
USING (status = 'approved');

-- Add an admin_password setting in a config table
CREATE TABLE public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- No public access to config
-- Admin operations go through edge function with service role
