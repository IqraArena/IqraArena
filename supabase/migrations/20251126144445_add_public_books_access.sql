/*
  # Add Public Access to Books

  1. Changes
    - Add policy for anonymous users to read books
    - Add policy for anonymous users to read book_pages
    - Add policy for anonymous users to read quizzes
    - This allows unauthenticated users to browse the library
  
  2. Security
    - Only SELECT access is granted to anonymous users
    - All other operations remain restricted
*/

-- Allow anonymous users to view books
DROP POLICY IF EXISTS "Anonymous users can view books" ON books;

CREATE POLICY "Anonymous users can view books"
  ON books FOR SELECT
  TO anon
  USING (true);

-- Also allow anonymous users to read book_pages
DROP POLICY IF EXISTS "Anonymous users can view book_pages" ON book_pages;

CREATE POLICY "Anonymous users can view book_pages"
  ON book_pages FOR SELECT
  TO anon
  USING (true);

-- Also allow anonymous users to read quizzes
DROP POLICY IF EXISTS "Anonymous users can view quizzes" ON quizzes;

CREATE POLICY "Anonymous users can view quizzes"
  ON quizzes FOR SELECT
  TO anon
  USING (true);
