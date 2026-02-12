import { supabase } from '../lib/supabase';
import { booksData } from '../data/booksData';

export const initializeBooks = async () => {
  try {
    // Check which books already exist
    const { data: existingBooks } = await supabase.from('books').select('title');
    const existingTitles = new Set(existingBooks?.map(b => b.title) || []);

    console.log('Checking for new books to initialize...');

    for (const bookData of booksData) {
      if (existingTitles.has(bookData.title)) {
        continue; // Skip existing books
      }

      console.log(`Initializing new book: ${bookData.title}...`);

      const { data: book, error: bookError } = await supabase
        .from('books')
        .insert({
          title: bookData.title,
          author: bookData.author,
          cover_image_url: bookData.cover_image_url,
          description: bookData.description,
          total_pages: bookData.pages.length,
        })
        .select()
        .single();

      if (bookError) {
        console.error('Error inserting book:', bookError);
        continue;
      }

      if (!book) continue;

      for (const page of bookData.pages) {
        const { error: pageError } = await supabase.from('book_pages').insert({
          book_id: book.id,
          page_number: page.page_number,
          content: page.content,
        });

        if (pageError) {
          console.error('Error inserting page:', pageError);
        }
      }

      for (const quiz of bookData.quizzes) {
        const { error: quizError } = await supabase.from('quizzes').insert({
          book_id: book.id,
          page_number: quiz.page_number,
          question: quiz.question,
          options: quiz.options,
          correct_answer: quiz.correct_answer,
        });

        if (quizError) {
          console.error('Error inserting quiz:', quizError);
        }
      }

      console.log(`Initialized book: ${bookData.title}`);
    }

    console.log('Book initialization check complete.');
  } catch (error) {
    console.error('Error initializing books:', error);
  }
};
