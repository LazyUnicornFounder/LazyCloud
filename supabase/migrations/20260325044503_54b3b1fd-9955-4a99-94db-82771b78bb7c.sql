
CREATE TABLE public.prompt_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engine_name text NOT NULL,
  version text NOT NULL,
  release_date date NOT NULL,
  change_type text NOT NULL,
  summary text NOT NULL,
  changes text,
  upgrade_complexity text NOT NULL DEFAULT 'drop-in',
  upgrade_instructions text,
  download_url text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.prompt_releases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published prompt_releases"
  ON public.prompt_releases FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Anyone can insert prompt_releases"
  ON public.prompt_releases FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update prompt_releases"
  ON public.prompt_releases FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
