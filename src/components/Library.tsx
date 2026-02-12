import { useEffect, useState } from 'react';
import { Book } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { BookOpen, TrendingUp, LogOut, Trophy, Moon, Sun } from 'lucide-react';
import { web3Service } from '../lib/web3';
import { initializeBooks } from '../utils/initializeBooks';

type LibraryProps = {
  onSelectBook: (bookId: string) => void;
  onViewDashboard: () => void;
  onViewLeaderboard: () => void;
  onSignOut?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

export const Library = ({ onSelectBook, onViewDashboard, onViewLeaderboard, onSignOut, darkMode, onToggleDarkMode }: LibraryProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      let { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading books:', error);
      } else if (!data || data.length === 0) {
        // If no books found, try to initialize them
        console.log('No books found, initializing...');
        await initializeBooks();

        // Fetch again after initialization
        const result = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: true });

        if (result.error) {
          console.error('Error loading books after initialization:', result.error);
        } else {
          setBooks(result.data || []);
        }
      } else {
        setBooks(data);
      }
    } catch (err) {
      console.error('Unexpected error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await web3Service.disconnect();
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('username');
    if (onSignOut) {
      onSignOut();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">مكتبة الكتب العربية</h1>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={onToggleDarkMode}
              className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors shadow-md text-sm md:text-base"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
            <button
              onClick={onViewDashboard}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors shadow-md text-sm md:text-base"
            >
              <TrendingUp className="w-5 h-5" />
              <span>لوحة القيادة</span>
            </button>
            <button
              onClick={onViewLeaderboard}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors shadow-md text-sm md:text-base"
            >
              <Trophy className="w-5 h-5" />
              <span>لوحة المتصدرين</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors shadow-md text-sm md:text-base"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group relative"
              onClick={() => onSelectBook(book.id)}
            >
              <div className={`relative h-64 overflow-hidden ${book.cover_color || 'bg-gradient-to-br from-amber-400 to-orange-600'}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-white/30" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 right-4 left-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 text-right leading-tight">{book.title}</h3>
                  <p className="text-amber-200 text-xs md:text-sm text-right font-medium">{book.category}</p>
                </div>
                {/* Author name on hover */}
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center px-4">
                    <p className="text-white/70 text-sm mb-2">المؤلف</p>
                    <p className="text-white text-xl md:text-2xl font-bold">{book.author}</p>
                  </div>
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

        <footer className="mt-16 pt-8 border-t border-gray-300 dark:border-gray-700">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="text-center text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-2" dir="rtl">
              <p className="font-semibold text-amber-900 dark:text-amber-100">إشعار حقوق الملكية</p>
              <p>جميع الكتب الواردة في هذا الموقع هي ملك لأصحابها الأصليين أو ناشريها، وقد تكون محمية بحقوق الطبع والنشر.</p>
              <p>نُقدِّم هذه المواد لأغراض القراءة والدراسة أو الاطلاع التاريخي فقط.</p>
              <p>يتحمل القارئ مسؤولية التحقق من دقة المعلومات وصحتها قبل أي استخدام تجاري أو أكاديمي أو نشر لاحق.</p>
              <p>نحن لا نتحمل أي مسؤولية عن أي خطأ أو معلومات غير دقيقة قد تحتويها هذه الكتب.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
