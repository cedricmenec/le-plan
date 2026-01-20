-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    estimation NUMERIC NOT NULL DEFAULT 0,
    confidence NUMERIC DEFAULT 100,
    project_parent TEXT,
    status TEXT NOT NULL DEFAULT 'todo'
);

-- Enable RLS
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Create subtasks table
CREATE TABLE IF NOT EXISTS subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL
);

-- Enable RLS
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own missions" 
ON missions FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage subtasks of their missions" 
ON subtasks FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM missions 
        WHERE missions.id = subtasks.mission_id 
        AND missions.user_id = auth.uid()
    )
);
