import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  total_points: number;
  created_at: string;
  updated_at: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  cover_color: string;
  description: string;
  total_pages: number;
  created_at: string;
};

export type BookPage = {
  id: string;
  book_id: string;
  page_number: number;
  content: string;
  created_at: string;
};

export type Quiz = {
  id: string;
  book_id: string;
  page_number: number;
  question: string;
  options: string[];
  correct_answer: number;
  created_at: string;
};

export type ReadingProgress = {
  id: string;
  user_id: string;
  book_id: string;
  current_page: number;
  pages_read: number;
  completed: boolean;
  last_read_at: string;
  created_at: string;
};

export type QuizResponse = {
  id: string;
  user_id: string;
  quiz_id: string;
  user_answer: number;
  is_correct: boolean;
  points_earned: number;
  answered_at: string;
};
