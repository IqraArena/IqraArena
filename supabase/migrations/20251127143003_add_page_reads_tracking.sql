/*
  # Add page reads tracking
  
  1. New Tables
    - `page_reads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `book_id` (uuid, references books)
      - `page_number` (integer)
      - `read_at` (timestamp)
      - UNIQUE constraint on (user_id, book_id, page_number)
  
  2. Purpose
    - Track which specific pages each user has read
    - Prevent duplicate points for re-reading the same page
    - Each page can only be recorded once per user per book
  
  3. Security
    - Enable RLS on page_reads table
    - Users can only insert their own page reads
    - Users can only view their own page reads
*/

-- Create page_reads table
CREATE TABLE IF NOT EXISTS page_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  page_number integer NOT NULL,
  read_at timestamptz DEFAULT now(),
  CONSTRAINT page_reads_user_book_page_unique UNIQUE (user_id, book_id, page_number)
);

-- Enable RLS
ALTER TABLE page_reads ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own page reads
CREATE POLICY "Users can insert own page reads"
  ON page_reads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own page reads
CREATE POLICY "Users can view own page reads"
  ON page_reads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_page_reads_user_book 
  ON page_reads(user_id, book_id);
