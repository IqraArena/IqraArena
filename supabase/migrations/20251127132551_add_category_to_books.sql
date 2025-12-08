/*
  # Add category column and update books schema

  1. Changes
    - Add `category` column to books table
    - Add `cover_color` column to books table for gradient styling
    - Remove `cover_image_url` column as we'll use colors instead
    
  2. Notes
    - Categories: إسلامية, تاريخ, برمجة, متنوع
*/

-- Add category column
ALTER TABLE books ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'متنوع';

-- Add cover_color column for gradient backgrounds
ALTER TABLE books ADD COLUMN IF NOT EXISTS cover_color text NOT NULL DEFAULT 'bg-gradient-to-br from-amber-400 to-orange-600';

-- Drop cover_image_url if it exists
ALTER TABLE books DROP COLUMN IF EXISTS cover_image_url;