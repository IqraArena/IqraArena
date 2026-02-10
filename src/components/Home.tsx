import { BookOpen, Award, Users, TrendingUp, Sparkles, Heart, Brain, Star, Moon, Sun } from 'lucide-react';

type HomeProps = {
  onGetStarted: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

export const Home = ({ onGetStarted, darkMode, onToggleDarkMode }: HomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-end mb-4">
          <button
            onClick={onToggleDarkMode}
            className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg transition-colors shadow-md"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            IqraArena
          </h1>
          <p className="text-2xl md:text-3xl text-amber-700 dark:text-amber-400 font-semibold mb-8">
            اقرأ، تعلم، واربح النقاط
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg font-bold px-12 py-4 rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            سجل دخولك للبدء
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-12 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              رحلة إلى عالم المعرفة والإلهام
            </h2>
            <div className="max-w-4xl mx-auto text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 text-right" dir="rtl">
              <p className="text-xl font-medium text-amber-700 dark:text-amber-400">
                القراءة ليست مجرد كلمات على صفحات، بل نافذة على عوالم لا حدود لها من المعرفة والخيال. فهي تفتح أبواب التاريخ، تنير دروب المستقبل، وتوسع آفاق التفكير.
              </p>

              <p>
                مع القراءة، نعيش تجارب الآخرين، نسافر عبر الزمان والمكان، ونستلهم من قصص النجاح والحكمة. كل كتاب يضيف إلى شخصيتنا بُعداً جديداً ويغني عقولنا.
              </p>

              <p>
                IqraArena يقدم مكتبة مختارة من أروع الكتب العربية الكلاسيكية، ويجعل القراءة ممتعة ومجزية. نظامنا يكافئك على الفهم العميق: بعد كل عشرة صفحات، تجيب على سؤال بسيط لتحصل على نقاط وتتقدم في لوحة المتصدرين.
              </p>

              <p className="text-xl font-semibold text-gray-900 dark:text-white border-r-4 border-amber-500 pr-6">
                معاً، لنحيي ثقافة القراءة ونبني جيلًا واعيًا ومتعلمًا محبًا للمعرفة. ابدأ رحلتك اليوم، واجعل القراءة عادة يومية تثري حياتك وتنير طريقك.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 text-center border-2 border-blue-200 dark:border-blue-800 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              كتب عربية أصيلة
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              مجموعة منتقاة من روائع الأدب العربي الكلاسيكي
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8 text-center border-2 border-green-200 dark:border-green-800 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
              قراءة ذكية
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm">
              اختبارات تفاعلية تضمن الفهم والاستيعاب العميق
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl p-8 text-center border-2 border-amber-200 dark:border-amber-800 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-full mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">
              نظام المكافآت
            </h3>
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              اكسب نقاطاً مع كل صفحة تقرأها وسؤال تجيب عليه
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-8 text-center border-2 border-purple-200 dark:border-purple-800 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">
              مجتمع قارئ
            </h3>
            <p className="text-purple-700 dark:text-purple-300 text-sm">
              تنافس مع القراء وتصدر لوحة الشرف
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl shadow-2xl p-12 text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            هل أنت مستعد لبدء رحلتك؟
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            انضم إلى مجتمع القراء المتحمسين، واكتشف كنوز المعرفة، واربح النقاط مع كل صفحة تقرأها
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">قراءة بشغف</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <Star className="w-5 h-5" />
              <span className="font-semibold">تعلم مستمر</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">تقدم ملحوظ</span>
            </div>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-white hover:bg-gray-100 text-amber-600 text-xl font-bold px-16 py-5 rounded-full shadow-xl transform transition-all duration-300 hover:scale-105"
          >
            سجل دخولك الآن
          </button>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            مشروع تعليمي يهدف لتشجيع القراءة وإثراء المعرفة في العالم العربي
          </p>
        </div>

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
