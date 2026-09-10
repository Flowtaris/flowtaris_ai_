-- Migration: Add roi_calculator_config to site_config
-- This ensures the column exists in the schema and allows direct mapping without falling back to `seo` jsonb

ALTER TABLE site_config ADD COLUMN IF NOT EXISTS roi_calculator_config JSONB DEFAULT '{}'::jsonb;
