import { useEffect, useState } from 'react';
import { Book } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { BookOpen, TrendingUp } from 'lucide-react';

type LibraryProps = {
  onSelectBook: (bookId: string) => void;
  onViewDashboard: () => void;
};

export const Library = ({ onSelectBook, onViewDashboard }: LibraryProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading books:', error);
    } else {
      setBooks(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مكتبة الكتب العربية</h1>
          <button
            onClick={onViewDashboard}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            <span>لوحة القيادة</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
              onClick={() => onSelectBook(book.id)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 right-4 left-4">
                  <h3 className="text-xl font-bold text-white mb-1 text-right">{book.title}</h3>
                  <p className="text-amber-200 text-sm text-right">{book.author}</p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-right leading-relaxed">
                  {book.description}
                </p>
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm font-medium">ابدأ القراءة</span>
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {book.total_pages} صفحة
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">لا توجد كتب متاحة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};
