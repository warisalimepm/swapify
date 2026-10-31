CREATE TABLE IF NOT EXISTS public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  owner_uid text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  title text NOT NULL,
  description text NOT NULL,
  accepts text NOT NULL,
  rating integer NOT NULL DEFAULT 3 CHECK (rating BETWEEN 1 AND 5),
  image_url text,
  closed_at timestamptz,
  summary text
);

CREATE TABLE IF NOT EXISTS public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  name text NOT NULL,
  contact text NOT NULL,
  proposal text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined'))
);

-- Demo classroom app setup:
-- disable RLS so the starter app can work without custom auth policy edge cases.
ALTER TABLE public.items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers DISABLE ROW LEVEL SECURITY;
