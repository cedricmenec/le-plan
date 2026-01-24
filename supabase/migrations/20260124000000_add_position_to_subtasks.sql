-- Add position column to subtasks table
ALTER TABLE public.subtasks ADD COLUMN position INTEGER NOT NULL DEFAULT 0;

-- Update existing subtasks to have sequential positions based on created_at per mission
WITH ranked_subtasks AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY mission_id ORDER BY created_at ASC) - 1 as new_position
    FROM public.subtasks
)
UPDATE public.subtasks
SET position = ranked_subtasks.new_position
FROM ranked_subtasks
WHERE public.subtasks.id = ranked_subtasks.id;
