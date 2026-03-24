
CREATE TABLE public.prompt_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product text NOT NULL,
  version text NOT NULL,
  prompt_text text NOT NULL,
  is_current boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.prompt_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read prompt_versions"
  ON public.prompt_versions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert prompt_versions"
  ON public.prompt_versions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update prompt_versions"
  ON public.prompt_versions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
