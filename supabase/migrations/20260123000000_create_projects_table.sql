-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    label TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    color TEXT NOT NULL
);

-- Enable RLS for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can manage their own projects" 
ON projects FOR ALL 
USING (auth.uid() = user_id);

-- Add project_id foreign key to missions
ALTER TABLE missions ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- Update RLS for missions if needed (already covers own missions, but linking to projects might need checks? 
-- The existing policy "Users can manage their own missions" checks user_id on missions, which is sufficient)
