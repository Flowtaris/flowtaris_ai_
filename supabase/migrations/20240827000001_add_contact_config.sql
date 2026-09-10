-- Migration: 20240827000001
-- Description: Add contact_config column to site_config to support dynamic Contact page management in the Admin Panel.

ALTER TABLE site_config 
ADD COLUMN IF NOT EXISTS contact_config JSONB DEFAULT '{}'::jsonb;
