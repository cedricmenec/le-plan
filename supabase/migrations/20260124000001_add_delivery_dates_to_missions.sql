-- Add delivery dates to missions table
ALTER TABLE public.missions
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE,
ADD COLUMN IF NOT EXISTS desired_delivery_date DATE;

-- Comment on columns for clarity
COMMENT ON COLUMN public.missions.estimated_delivery_date IS 'Estimated delivery date by the user';
COMMENT ON COLUMN public.missions.desired_delivery_date IS 'Delivery date requested by stakeholders';
