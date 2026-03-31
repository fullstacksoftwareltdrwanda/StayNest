-- Add latitude and longitude columns to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC;
