
CREATE TABLE public.changelog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent text NOT NULL,
  version text NOT NULL,
  summary text NOT NULL,
  changes text,
  affected_agents text,
  pushed_to_github boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.changelog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read changelog" ON public.changelog FOR SELECT TO public USING (true);
CREATE POLICY "Service role can manage changelog" ON public.changelog FOR ALL TO service_role USING (true) WITH CHECK (true);
