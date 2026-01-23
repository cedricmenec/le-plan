-- Add goal and notes columns to missions table
ALTER TABLE missions
ADD COLUMN goal TEXT,
ADD COLUMN notes TEXT;
