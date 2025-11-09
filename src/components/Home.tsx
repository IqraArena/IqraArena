import { BookOpen, Award, Users, TrendingUp, Sparkles, Heart, Brain, Star } from 'lucide-react';

type HomeProps = {
  onGetStarted: () => void;
};

export const Home = ({ onGetStarted }: HomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            مكتبة القراءة
          </h1>
          <p className="text-2xl md:text-3xl text-amber-700 dark:text-amber-400 font-semibold mb-8">
            اقرأ، تعلم، واربح النقاط
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg font-bold px-12 py-4 rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            ابدأ رحلتك الآن
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              رحلة إلى عالم المعرفة والإلهام
            </h2>
            <div className="max-w-4xl mx-auto text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 text-right" dir="rtl">
              <p className="text-xl font-medium text-amber-700 dark:text-amber-400">
                القراءة ليست مجرد كلمات على صفحات، بل هي نافذة نطل منها على عوالم لا حدود لها من المعرفة والحكمة والخيال.
              </p>

              <p>
                في عصر تتسارع فيه وتيرة الحياة وتتنوع فيه مصادر المعلومات، يبقى الكتاب رفيق الإنسان الأوفى ومعلمه الأعظم.
                فالقراءة تفتح أمامنا أبواب التاريخ، وتنير لنا دروب المستقبل، وتصقل عقولنا، وتهذب نفوسنا، وتوسع آفاق تفكيرنا.
              </p>

              <p>
                من خلال القراءة، نعيش حيوات متعددة ونكتسب خبرات الآخرين دون أن نخوض تجاربهم. نسافر عبر الزمان والمكان،
                نحاور العظماء والحكماء، ونستلهم من قصص النجاح والصمود. كل كتاب نقرأه يضيف إلى شخصيتنا بُعداً جديداً،
                ويثري عقولنا بفكرة نيرة، ويمنحنا القدرة على رؤية العالم من زوايا مختلفة.
              </p>

              <p className="text-xl font-medium text-amber-700 dark:text-amber-400">
                لهذا أنشأنا هذا المشروع الفريد، لنجعل القراءة تجربة ممتعة ومحفزة ومجزية في آن واحد.
              </p>

              <p>
                نقدم لك مكتبة غنية بأروع الكتب العربية الكلاسيكية، من روائع الأدب والفلسفة والرحلات.
                كل كتاب اخترناه بعناية ليكون مصدر إلهام وعلم وإمتاع. ولأننا نؤمن بقيمة القراءة الحقيقية والفهم العميق،
                ابتكرنا نظاماً يكافئك على قراءتك المتأنية واستيعابك الواعي للمحتوى.
              </p>

              <p>
                بعد كل ثلاث صفحات، ستجيب على سؤال بسيط يختبر فهمك لما قرأت. وعندما تجيب بشكل صحيح،
                تحصل على نقاط تعكس تقدمك ومثابرتك. تنافس مع القراء الآخرين، اصعد في لوحة المتصدرين،
                واحتفل بإنجازاتك في رحلة القراءة.
              </p>

              <p className="text-xl font-semibold text-gray-900 dark:text-white border-r-4 border-amber-500 pr-6">
                معاً، لنحيي ثقافة القراءة في مجتمعنا. معاً، لنبني جيلاً واعياً متعلماً محباً للمعرفة.
                معاً، لنصنع مستقبلاً أكثر إشراقاً من خلال صفحات الكتب العظيمة.
              </p>

              <p className="text-center text-2xl font-bold text-amber-700 dark:text-amber-400 pt-6">
                ابدأ رحلتك اليوم، واجعل القراءة عادة يومية تثري حياتك وتنير طريقك.
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
            انضم الآن مجاناً
          </button>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            مشروع تعليمي يهدف لتشجيع القراءة وإثراء المعرفة في العالم العربي
          </p>
        </div>
      </div>
    </div>
  );
};
