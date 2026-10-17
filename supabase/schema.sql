-- ==============================================================================
-- HireFlow ATS - Supabase PostgreSQL Schema
-- ==============================================================================

-- 1. Create candidate stages enum validation check
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    position TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}'::TEXT[],
    experience_years NUMERIC DEFAULT 0 CHECK (experience_years >= 0),
    resume_url TEXT,
    stage TEXT NOT NULL DEFAULT 'Applied' CHECK (stage IN ('Applied', 'Screening', 'Interview', 'Offer', 'Hired')),
    notes TEXT,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for high-performance searches, filtering and sorting
CREATE INDEX IF NOT EXISTS idx_candidates_stage ON public.candidates(stage);
CREATE INDEX IF NOT EXISTS idx_candidates_position ON public.candidates(position);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON public.candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_applied_at ON public.candidates(applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON public.candidates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_experience ON public.candidates(experience_years);

-- Full-text / Trigram search index support (GIN on skills)
CREATE INDEX IF NOT EXISTS idx_candidates_skills ON public.candidates USING GIN(skills);

-- 3. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_candidates_updated_at ON public.candidates;
CREATE TRIGGER set_candidates_updated_at
    BEFORE UPDATE ON public.candidates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Row Level Security (RLS) Configuration
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Allow read access for application queries
CREATE POLICY "Allow public read access to candidates"
    ON public.candidates
    FOR SELECT
    USING (true);

-- Allow insert operations
CREATE POLICY "Allow public insert access to candidates"
    ON public.candidates
    FOR INSERT
    WITH CHECK (true);

-- Allow update operations
CREATE POLICY "Allow public update access to candidates"
    ON public.candidates
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow delete operations
CREATE POLICY "Allow public delete access to candidates"
    ON public.candidates
    FOR DELETE
    USING (true);
