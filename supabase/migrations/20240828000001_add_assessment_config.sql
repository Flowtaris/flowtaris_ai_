-- Migration to add assessment_config column to site_config table
ALTER TABLE IF EXISTS site_config
ADD COLUMN IF NOT EXISTS assessment_config JSONB DEFAULT '{}'::jsonb;
