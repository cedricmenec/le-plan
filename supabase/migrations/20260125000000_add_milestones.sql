-- Create milestone_types table
CREATE TABLE milestone_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create milestones table
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    type_id UUID NOT NULL REFERENCES milestone_types(id),
    date DATE NOT NULL,
    title TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_milestones_mission_id ON milestones(mission_id);
CREATE INDEX idx_milestones_date ON milestones(date);

-- Enable RLS
ALTER TABLE milestone_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies for milestone_types (Public read for authenticated users)
CREATE POLICY "Allow authenticated users to read milestone types"
ON milestone_types FOR SELECT
TO authenticated
USING (true);

-- Add RLS Policies for milestones (User can only see/manage milestones for their missions)
-- Note: Missions table already has user_id and RLS. 
-- We join on missions to ensure the user owns the mission the milestone belongs to.

CREATE POLICY "Allow users to select milestones of their own missions"
ON milestones FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM missions
        WHERE missions.id = milestones.mission_id
        AND missions.user_id = auth.uid()
    )
);

CREATE POLICY "Allow users to insert milestones into their own missions"
ON milestones FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM missions
        WHERE missions.id = milestones.mission_id
        AND missions.user_id = auth.uid()
    )
);

CREATE POLICY "Allow users to update milestones of their own missions"
ON milestones FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM missions
        WHERE missions.id = milestones.mission_id
        AND missions.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM missions
        WHERE missions.id = milestones.mission_id
        AND missions.user_id = auth.uid()
    )
);

CREATE POLICY "Allow users to delete milestones of their own missions"
ON milestones FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM missions
        WHERE missions.id = milestones.mission_id
        AND missions.user_id = auth.uid()
    )
);

-- Seed initial milestone types
INSERT INTO milestone_types (name, description) VALUES
('Cadrage / Kick-off', 'Scoping or initial project meeting'),
('Réunion / Review', 'Progress review or stakeholder meeting'),
('Livraison intermédiaire', 'Partial or intermediate delivery'),
('Documentation', 'Documentation submission or completion');
