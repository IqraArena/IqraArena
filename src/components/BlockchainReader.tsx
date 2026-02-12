import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { supabase, Book, BookPage } from '../lib/supabase';
import { web3Service } from '../lib/web3';
import { fundingService } from '../services/fundingService';
import { ChevronLeft, ChevronRight, X, Award, Coins, Loader2, Moon, Sun, Link2 } from 'lucide-react';
import Quiz from './Quiz';
import { booksData } from '../data/booksData';

type BlockchainReaderProps = {
  bookId: string;
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

export default function BlockchainReader({ bookId, onClose, darkMode, onToggleDarkMode }: BlockchainReaderProps) {
  const activeAccount = useActiveAccount();
  const [book, setBook] = useState<Book | null>(null);
  const [pages, setPages] = useState<BookPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pagesReadInSession, setPagesReadInSession] = useState(0);
  const [readPageNumbers, setReadPageNumbers] = useState<Set<number>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (activeAccount) {
      web3Service.account = activeAccount;
    }
  }, [activeAccount]);

  useEffect(() => {
    loadBookData();
  }, [bookId]);

  const loadBookData = async () => {
    try {
      console.log('Loading book data for ID:', bookId);

      // Check for local book ID
      if (bookId.startsWith('local-')) {
        const index = parseInt(bookId.split('-')[1]);
        const localBookData = booksData[index];

        if (localBookData) {
          console.log('Loading local book:', localBookData.title);
          setBook({
            id: bookId,
            title: localBookData.title,
            author: localBookData.author,
            cover_image_url: localBookData.cover_image_url,
            description: localBookData.description,
            total_pages: localBookData.pages.length,
            created_at: new Date().toISOString(),
            category: 'عام',
            cover_color: 'bg-gradient-to-br from-amber-400 to-orange-600'
          });

          setPages(localBookData.pages.map((p, i) => ({
            id: `page-${i}`,
            book_id: bookId,
            page_number: p.page_number,
            content: p.content,
            created_at: new Date().toISOString()
          })));

          setLoading(false);
          return;
        }
      }

      const [bookResult, pagesResult] = await Promise.all([
        supabase.from('books').select('*').eq('id', bookId).maybeSingle(),
        supabase.from('book_pages').select('*').eq('book_id', bookId).order('page_number'),
      ]);

      console.log('Book result:', bookResult);
      console.log('Pages result:', pagesResult);

      if (bookResult.error) {
        console.error('Error loading book:', bookResult.error);
      }
      if (pagesResult.error) {
        console.error('Error loading pages:', pagesResult.error);
      }

      if (bookResult.data) {
        console.log('Setting book:', bookResult.data);
        setBook(bookResult.data);
      } else {
        console.log('No book data found');
      }

      if (pagesResult.data) {
        console.log('Setting pages, count:', pagesResult.data.length);
        setPages(pagesResult.data);
      } else {
        console.log('No pages data found');
      }
    } catch (error) {
      console.error('Failed to load book data:', error);
    } finally {
      if (!bookId.startsWith('local-')) {
        setLoading(false);
      }
    }
  };

  const handleNextPage = async () => {
    if (currentPageIndex < pages.length - 1) {
      const newIndex = currentPageIndex + 1;
      setCurrentPageIndex(newIndex);

      const pageNumber = pages[newIndex].page_number;

      if (!readPageNumbers.has(pageNumber)) {
        setReadPageNumbers(prev => new Set([...prev, pageNumber]));

        const newPagesRead = pagesReadInSession + 1;
        setPagesReadInSession(newPagesRead);

        // Save to blockchain silently after every page
        saveProgressToBlockchainSilently();

        // Show reward every 5 pages
        if (newPagesRead % 5 === 0) {
          setRewardMessage(`${newPagesRead} صفحة مقروءة! لقد ربحت ${newPagesRead} نقطة!`);
          setShowReward(true);
          setTimeout(() => setShowReward(false), 3000);
        }

        // Show quiz every 10 pages
        if (newPagesRead % 10 === 0) {
          setShowQuiz(true);
        }
      } else {
        console.log('Page already read in this session, no points awarded');
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const saveProgressToBlockchainSilently = async () => {
    try {
      setTxStatus('pending');

      // Check balance first, auto-fund if needed
      const balanceCheck = await web3Service.checkBalance();
      if (!balanceCheck.hasEnoughForGas) {
        console.log('Low gas, attempting auto-fund...');
        const address = await web3Service.getConnectedAddress();
        if (address) {
          await fundingService.fundNewUser(address);
          // Wait for funding tx to be indexed
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Execute transaction
      await web3Service.recordPagesRead();
      setTxStatus('success');
      console.log('✅ +1 point recorded on-chain');

      // Auto-hide success after 3 seconds
      setTimeout(() => setTxStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Failed to save progress:', error);
      setTxStatus('error');
      setTimeout(() => setTxStatus('idle'), 5000);
    }
  };

  const handleQuizComplete = async (isCorrect: boolean) => {
    if (isCorrect) {
      setIsSavingProgress(true);
      try {
        await web3Service.recordQuizPassed();
        setRewardMessage('اجتزت الاختبار! لقد ربحت 10 نقاط!');
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3000);
      } catch (error: any) {
        console.error('Failed to record quiz:', error);
        alert(`Failed to record quiz: ${error.message}`);
      } finally {
        setIsSavingProgress(false);
      }
    }
    setShowQuiz(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!book || pages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">الكتاب غير متوفر</p>
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg"
          >
            العودة إلى المكتبة
          </button>
        </div>
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
              <span>إغلاق</span>
            </button>
            <button
              onClick={onToggleDarkMode}
              className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{book.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg">
              <Coins className="w-4 h-4" />
              <span className="font-semibold">{pagesReadInSession} نقطة</span>
            </div>
            {txStatus === 'pending' && (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>تسجيل...</span>
              </div>
            )}
            {txStatus === 'success' && (
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs">
                <Link2 className="w-3 h-3" />
                <span>+1 on-chain ✓</span>
              </div>
            )}
            {txStatus === 'error' && (
              <div className="flex items-center gap-1 text-red-500 text-xs">
                <span>فشل التسجيل</span>
              </div>
            )}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentPage.page_number} / {book.total_pages}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 mb-8 min-h-[500px] relative">
          {isSavingProgress && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">جارٍ الحفظ على البلوكشين...</p>
              </div>
            </div>
          )}

          <div
            className="prose prose-lg max-w-none text-right leading-loose"
            style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}
            dir="rtl"
          >
            <p className="text-xl text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {currentPage.content}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
            <span>السابق</span>
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              صفحة {currentPage.page_number} من {book.total_pages}
            </div>
            <div className="mt-2 flex gap-4 items-center justify-center text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Link2 className="w-3 h-3" />
                <span>1 نقطة + 1 معاملة on-chain لكل صفحة</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === pages.length - 1}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>التالي</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showReward && (
        <div className="fixed top-24 right-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-bounce z-50">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6" />
            <span className="font-semibold">{rewardMessage}</span>
          </div>
        </div>
      )}

      {showQuiz && (
        <Quiz onComplete={handleQuizComplete} />
      )}
    </div>
  );
}