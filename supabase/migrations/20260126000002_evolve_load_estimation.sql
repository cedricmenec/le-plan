-- Add ROM and load source to missions
ALTER TABLE public.missions 
ADD COLUMN rom_size TEXT,
ADD COLUMN load_source TEXT NOT NULL DEFAULT 'rom' CHECK (load_source IN ('rom', 'tasks'));

-- Add estimation and status to subtasks
ALTER TABLE public.subtasks
ADD COLUMN estimation NUMERIC NOT NULL DEFAULT 0.5,
ADD COLUMN status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done'));

-- Migrate is_completed to status
UPDATE public.subtasks
SET status = CASE 
    WHEN is_completed = TRUE THEN 'done'
    ELSE 'todo'
END;

-- Optional: If we want to keep is_completed for backward compatibility during transition or remove it.
-- For now, let's keep it but it's redundant.
