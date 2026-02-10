import { useState } from 'react';
import { Award, X } from 'lucide-react';

interface QuizProps {
  onComplete: (isCorrect: boolean) => void;
}

const arabicQuizzes = [
  {
    question: 'ما هو أكبر كوكب في المجموعة الشمسية؟',
    options: ['الأرض', 'المشتري', 'زحل', 'المريخ'],
    correctAnswer: 1,
  },
  {
    question: 'كم عدد أحرف اللغة العربية؟',
    options: ['26', '28', '30', '32'],
    correctAnswer: 1,
  },
  {
    question: 'ما هي عاصمة مصر؟',
    options: ['الإسكندرية', 'القاهرة', 'الجيزة', 'أسوان'],
    correctAnswer: 1,
  },
  {
    question: 'كم عدد أيام السنة؟',
    options: ['360', '365', '370', '355'],
    correctAnswer: 1,
  },
  {
    question: 'ما هو لون السماء؟',
    options: ['أحمر', 'أخضر', 'أزرق', 'أصفر'],
    correctAnswer: 2,
  },
  {
    question: 'كم عدد فصول السنة؟',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
  },
  {
    question: 'ما هو أكبر محيط في العالم؟',
    options: ['المحيط الأطلسي', 'المحيط الهندي', 'المحيط الهادئ', 'المحيط المتجمد'],
    correctAnswer: 2,
  },
  {
    question: 'كم ساعة في اليوم؟',
    options: ['12', '20', '24', '30'],
    correctAnswer: 2,
  },
];

export default function Quiz({ onComplete }: QuizProps) {
  const [currentQuiz] = useState(() => arabicQuizzes[Math.floor(Math.random() * arabicQuizzes.length)]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuiz.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleContinue = () => {
    onComplete(isCorrect);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {showResult ? (
          <div className="text-center">
            <Award
              className={`w-20 h-20 mx-auto mb-4 ${
                isCorrect ? 'text-green-500' : 'text-red-500'
              }`}
            />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              {isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
            </h3>
            {isCorrect && (
              <p className="text-lg text-emerald-600 mb-6">
                لقد حصلت على 10 نقاط!
              </p>
            )}
            {!isCorrect && (
              <p className="text-lg text-gray-600 mb-6">
                الإجابة الصحيحة: {currentQuiz.options[currentQuiz.correctAnswer]}
              </p>
            )}
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-lg transition-colors"
            >
              متابعة القراءة
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                سؤال المراجعة
              </h3>
              <button
                onClick={() => onComplete(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p
              className="text-lg mb-6 text-gray-800 leading-relaxed text-right"
              style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}
              dir="rtl"
            >
              {currentQuiz.question}
            </p>
            <div className="space-y-3 mb-8">
              {currentQuiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full p-4 rounded-lg border-2 transition-colors text-right ${
                    selectedAnswer === index
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-300 hover:border-emerald-400'
                  }`}
                  style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}
                  dir="rtl"
                >
                  <span className="text-gray-900">{option}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => onComplete(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إرسال الإجابة
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
