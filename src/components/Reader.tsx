import { useEffect, useState } from 'react';
import { supabase, Book, BookPage, Quiz, ReadingProgress } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft, ChevronRight, X, Award } from 'lucide-react';
import { saveReadingProgress, getBookProgress, hasCompletedQuiz, markQuizCompleted } from '../utils/cookies';

type ReaderProps = {
  bookId: string;
  onClose: () => void;
};

export const Reader = ({ bookId, onClose }: ReaderProps) => {
  const { user, refreshProfile } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [pages, setPages] = useState<BookPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<{ correct: boolean; points: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookData();
  }, [bookId]);

  useEffect(() => {
    checkForQuiz();
  }, [currentPageIndex]);

  const loadBookData = async () => {
    const [bookResult, pagesResult, progressResult] = await Promise.all([
      supabase.from('books').select('*').eq('id', bookId).single(),
      supabase.from('book_pages').select('*').eq('book_id', bookId).order('page_number'),
      supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', user?.id)
        .eq('book_id', bookId)
        .maybeSingle(),
    ]);

    if (bookResult.data) setBook(bookResult.data);
    if (pagesResult.data) setPages(pagesResult.data);
    if (progressResult.data) {
      setProgress(progressResult.data);
      const pageIndex = pagesResult.data?.findIndex(
        (p) => p.page_number === progressResult.data.current_page
      );
      if (pageIndex !== undefined && pageIndex !== -1) setCurrentPageIndex(pageIndex);
    } else {
      const cookieProgress = getBookProgress(bookId);
      if (cookieProgress && pagesResult.data) {
        const pageIndex = pagesResult.data.findIndex(
          (p) => p.page_number === cookieProgress.currentPage
        );
        if (pageIndex !== -1) setCurrentPageIndex(pageIndex);
      }
      if (user) {
        await createProgress();
      }
    }

    setLoading(false);
  };

  const createProgress = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('reading_progress')
      .insert({
        user_id: user.id,
        book_id: bookId,
        current_page: 1,
        pages_read: 0,
        completed: false,
      })
      .select()
      .single();

    if (data) setProgress(data);
  };

  const checkForQuiz = async () => {
    if (!pages[currentPageIndex]) return;

    const currentPage = pages[currentPageIndex].page_number;

    if (currentPage % 3 === 0 && currentPage > 0) {
      const { data: quiz } = await supabase
        .from('quizzes')
        .select('*')
        .eq('book_id', bookId)
        .eq('page_number', currentPage)
        .maybeSingle();

      if (quiz) {
        const alreadyAnsweredInCookie = hasCompletedQuiz(bookId, quiz.id);

        let alreadyAnsweredInDB = false;
        if (user) {
          const { data: response } = await supabase
            .from('quiz_responses')
            .select('*')
            .eq('user_id', user.id)
            .eq('quiz_id', quiz.id)
            .maybeSingle();
          alreadyAnsweredInDB = !!response;
        }

        if (!alreadyAnsweredInCookie && !alreadyAnsweredInDB) {
          setCurrentQuiz(quiz);
          setShowQuiz(true);
        }
      }
    }
  };

  const handleNextPage = async () => {
    if (currentPageIndex < pages.length - 1) {
      const newIndex = currentPageIndex + 1;
      setCurrentPageIndex(newIndex);
      await updateProgress(newIndex);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const updateProgress = async (pageIndex: number) => {
    const currentPage = pages[pageIndex].page_number;
    const isCompleted = pageIndex === pages.length - 1;

    const cookieProgress = getBookProgress(bookId);
    saveReadingProgress({
      bookId,
      currentPage,
      pagesRead: Math.max(cookieProgress?.pagesRead || 0, pageIndex + 1),
      completedQuizzes: cookieProgress?.completedQuizzes || [],
      lastReadAt: new Date().toISOString(),
    });

    if (user && progress) {
      try {
        await supabase.from('page_reads').insert({
          user_id: user.id,
          book_id: bookId,
          page_number: currentPage,
        });
      } catch (error) {
        console.log('Page already recorded or error:', error);
      }

      await supabase
        .from('reading_progress')
        .update({
          current_page: currentPage,
          pages_read: Math.max(progress.pages_read, pageIndex + 1),
          completed: isCompleted,
          last_read_at: new Date().toISOString(),
        })
        .eq('id', progress.id);
    }

    await checkForQuiz();
  };

  const handleQuizSubmit = async () => {
    if (selectedAnswer === null || !currentQuiz) return;

    const isCorrect = selectedAnswer === currentQuiz.correct_answer;
    let pointsToShow = 0;
    let alreadyAnswered = false;

    if (user) {
      const { data: existingResponse } = await supabase
        .from('quiz_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('quiz_id', currentQuiz.id)
        .maybeSingle();

      if (existingResponse) {
        alreadyAnswered = true;
        pointsToShow = 0;
      } else {
        const pointsEarned = isCorrect ? 3 : 0;
        try {
          await supabase.from('quiz_responses').insert({
            user_id: user.id,
            quiz_id: currentQuiz.id,
            user_answer: selectedAnswer,
            is_correct: isCorrect,
            points_earned: pointsEarned,
          });
          pointsToShow = pointsEarned;
          markQuizCompleted(bookId, currentQuiz.id);
          await refreshProfile();
        } catch (error) {
          console.error('Error submitting quiz:', error);
          pointsToShow = 0;
          alreadyAnswered = true;
        }
      }
    } else {
      const alreadyCompletedInCookie = hasCompletedQuiz(bookId, currentQuiz.id);
      if (alreadyCompletedInCookie) {
        alreadyAnswered = true;
        pointsToShow = 0;
      } else {
        pointsToShow = isCorrect ? 3 : 0;
        markQuizCompleted(bookId, currentQuiz.id);
      }
    }

    setQuizResult({ correct: isCorrect, points: pointsToShow });
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    setCurrentQuiz(null);
    setSelectedAnswer(null);
    setQuizResult(null);
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

  if (!book || pages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">الكتاب غير متوفر</p>
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
            <span>إغلاق</span>
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white" dir="rtl">{book.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400" dir="rtl">{book.author}</p>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400" dir="rtl">
            {currentPage.page_number} / {book.total_pages}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 mb-8 min-h-[500px]">
          <div
            className="prose prose-lg dark:prose-invert max-w-none text-right leading-loose"
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
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
            <span>السابق</span>
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              صفحة {currentPage.page_number} من {book.total_pages}
            </div>
            {progress && (
              <div className="mt-2">
                <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full transition-all"
                    style={{ width: `${(progress.pages_read / book.total_pages) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === pages.length - 1}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>التالي</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showQuiz && currentQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
            {quizResult ? (
              <div className="text-center">
                <Award
                  className={`w-20 h-20 mx-auto mb-4 ${
                    quizResult.correct ? 'text-green-500' : 'text-red-500'
                  }`}
                />
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white" dir="rtl">
                  {quizResult.correct ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
                </h3>
                {quizResult.correct && quizResult.points > 0 && (
                  <p className="text-lg text-amber-600 dark:text-amber-400 mb-6" dir="rtl">
                    لقد حصلت على {quizResult.points} نقاط!
                  </p>
                )}
                {quizResult.correct && quizResult.points === 0 && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6" dir="rtl">
                    لقد أجبت على هذا السؤال من قبل
                  </p>
                )}
                {!quizResult.correct && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6" dir="rtl">
                    الإجابة الصحيحة: {currentQuiz.options[currentQuiz.correct_answer]}
                  </p>
                )}
                <button
                  onClick={closeQuiz}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg transition-colors"
                  dir="rtl"
                >
                  متابعة القراءة
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white" dir="rtl">
                  سؤال الفهم
                </h3>
                <p className="text-lg mb-6 text-gray-800 dark:text-gray-200 leading-relaxed text-right" style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }} dir="rtl">
                  {currentQuiz.question}
                </p>
                <div className="space-y-3 mb-8">
                  {currentQuiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(index)}
                      className={`w-full p-4 rounded-lg border-2 transition-colors text-right ${
                        selectedAnswer === index
                          ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-amber-400'
                      }`}
                      style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}
                      dir="rtl"
                    >
                      <span className="text-gray-900 dark:text-white">{option}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={closeQuiz}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg transition-colors"
                    dir="rtl"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedAnswer === null}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    dir="rtl"
                  >
                    إرسال الإجابة
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
