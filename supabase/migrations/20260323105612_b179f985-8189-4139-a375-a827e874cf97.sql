CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_data jsonb DEFAULT '{}',
  page text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "No public read of analytics events"
ON public.analytics_events FOR SELECT
TO public
USING (false);