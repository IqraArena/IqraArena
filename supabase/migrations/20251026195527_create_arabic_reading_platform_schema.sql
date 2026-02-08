/*
  # Arabic Reading Platform - Database Schema

  ## Overview
  Creates the complete database schema for an Arabic reading rewards platform where users read books,
  answer quizzes, and earn points.

  ## New Tables

  ### 1. profiles
  Stores user profile information linked to auth.users
  - `id` (uuid, primary key) - References auth.users(id)
  - `email` (text) - User's email
  - `full_name` (text) - User's display name
  - `total_points` (integer) - Accumulated reward points
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. books
  Stores Arabic book information
  - `id` (uuid, primary key)
  - `title` (text) - Book title in Arabic
  - `author` (text) - Author name in Arabic
  - `cover_image_url` (text) - URL to book cover image
  - `description` (text) - Book description
  - `total_pages` (integer) - Total number of pages
  - `created_at` (timestamptz)

  ### 3. book_pages
  Stores individual pages of each book
  - `id` (uuid, primary key)
  - `book_id` (uuid, foreign key) - References books(id)
  - `page_number` (integer) - Sequential page number
  - `content` (text) - Page text content in Arabic
  - `created_at` (timestamptz)

  ### 4. quizzes
  Stores quiz questions for books
  - `id` (uuid, primary key)
  - `book_id` (uuid, foreign key) - References books(id)
  - `page_number` (integer) - Page number after which quiz appears
  - `question` (text) - Quiz question in Arabic
  - `options` (jsonb) - Array of answer options
  - `correct_answer` (integer) - Index of correct answer (0-3)
  - `created_at` (timestamptz)

  ### 5. reading_progress
  Tracks user's reading progress for each book
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References auth.users(id)
  - `book_id` (uuid, foreign key) - References books(id)
  - `current_page` (integer) - Last page read
  - `pages_read` (integer) - Total pages read in this book
  - `completed` (boolean) - Whether book is finished
  - `last_read_at` (timestamptz) - Last reading session
  - `created_at` (timestamptz)

  ### 6. quiz_responses
  Records user answers to quizzes
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References auth.users(id)
  - `quiz_id` (uuid, foreign key) - References quizzes(id)
  - `user_answer` (integer) - User's selected answer index
  - `is_correct` (boolean) - Whether answer was correct
  - `points_earned` (integer) - Points awarded
  - `answered_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only read/update their own profile
  - Books and quizzes are publicly readable
  - Users can only manage their own reading progress and quiz responses

  ## Indexes
  - Optimized indexes for common queries (user progress, leaderboard, book pages)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  total_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  cover_image_url text NOT NULL,
  description text NOT NULL,
  total_pages integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create book_pages table
CREATE TABLE IF NOT EXISTS book_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(book_id, page_number)
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create reading_progress table
CREATE TABLE IF NOT EXISTS reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  current_page integer DEFAULT 1,
  pages_read integer DEFAULT 0,
  completed boolean DEFAULT false,
  last_read_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Create quiz_responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_answer integer NOT NULL,
  is_correct boolean NOT NULL,
  points_earned integer DEFAULT 0,
  answered_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_book_pages_book_id ON book_pages(book_id, page_number);
CREATE INDEX IF NOT EXISTS idx_quizzes_book_page ON quizzes(book_id, page_number);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON reading_progress(user_id, last_read_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_progress_book ON reading_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user ON quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON profiles(total_points DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Books policies (public read access)
CREATE POLICY "Anyone can view books"
  ON books FOR SELECT
  TO authenticated
  USING (true);

-- Book pages policies (public read access)
CREATE POLICY "Anyone can view book pages"
  ON book_pages FOR SELECT
  TO authenticated
  USING (true);

-- Quizzes policies (public read access)
CREATE POLICY "Anyone can view quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (true);

-- Reading progress policies
CREATE POLICY "Users can view own reading progress"
  ON reading_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading progress"
  ON reading_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading progress"
  ON reading_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Quiz responses policies
CREATE POLICY "Users can view own quiz responses"
  ON quiz_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz responses"
  ON quiz_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to update profile points
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET total_points = total_points + NEW.points_earned,
      updated_at = now()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update points when quiz response is added
DROP TRIGGER IF EXISTS trigger_update_points ON quiz_responses;
CREATE TRIGGER trigger_update_points
  AFTER INSERT ON quiz_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points();