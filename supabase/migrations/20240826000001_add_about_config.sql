-- Migration: 20240826000001
-- Description: Add about_config column to site_config to support dynamic About Us page management in the Admin Panel.

ALTER TABLE site_config 
ADD COLUMN IF NOT EXISTS about_config JSONB DEFAULT '{}'::jsonb;
