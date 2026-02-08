/*
  # Add unique constraint to quiz_responses
  
  1. Changes
    - Add unique constraint on (user_id, quiz_id) to prevent duplicate quiz responses
    - This ensures users cannot earn points multiple times for the same quiz
  
  2. Security
    - Prevents exploitation by submitting the same quiz multiple times
    - Database-level enforcement ensures data integrity
*/

-- Add unique constraint to prevent duplicate quiz responses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'quiz_responses_user_quiz_unique'
  ) THEN
    ALTER TABLE quiz_responses 
    ADD CONSTRAINT quiz_responses_user_quiz_unique 
    UNIQUE (user_id, quiz_id);
  END IF;
END $$;
