import { useEffect, useState } from 'react';
import { Award, BookOpen, ArrowLeft, Moon, Sun, Copy, CheckCircle, Wallet, Zap, Trophy } from 'lucide-react';
import { web3Service } from '../lib/web3';

type WalletDashboardProps = {
  walletAddress: string;
  username: string;
  onBack: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

type BlockchainStats = {
  pagesRead: number;
  quizzesPassed: number;
  totalPoints: number;
};

export const WalletDashboard = ({ walletAddress, username, onBack, darkMode, onToggleDarkMode }: WalletDashboardProps) => {
  const [blockchainStats, setBlockchainStats] = useState<BlockchainStats>({
    pagesRead: 0,
    quizzesPassed: 0,
    totalPoints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [walletAddress]);

  const loadDashboardData = async () => {
    if (walletAddress) {
      try {
        const userData = await web3Service.getUser(walletAddress);
        if (userData) {
          setBlockchainStats({
            pagesRead: userData.pagesRead,
            quizzesPassed: userData.quizzesPassed,
            totalPoints: userData.totalPoints,
          });
        }
      } catch (error) {
        console.error('Failed to fetch blockchain data:', error);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm md:text-base order-1 md:order-none"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>عودة إلى المكتبة</span>
          </button>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white text-center order-2 md:order-none">IqraArena لوحة التحكم</h1>
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg bg-amber-200 dark:bg-amber-700 hover:bg-amber-300 dark:hover:bg-amber-600 transition-colors order-3 md:order-none"
            title={darkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 md:p-8 mb-8">
          <div className="flex items-center gap-3 md:gap-4 mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="text-right flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{username}</h2>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start gap-3">
              <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1">عنوان محفظتك</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono text-emerald-700 dark:text-emerald-300 break-all bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded flex-1">
                    {walletAddress}
                  </p>
                  <button
                    onClick={() => copyToClipboard(walletAddress)}
                    className="p-2 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded transition-colors flex-shrink-0"
                    title="نسخ العنوان"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">إحصائيات البلوكشين</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {blockchainStats.pagesRead}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">الصفحات المقروءة</div>
              </div>
              <div className="text-center border-x border-blue-200 dark:border-blue-700">
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {blockchainStats.quizzesPassed}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">الاختبارات الناجحة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {blockchainStats.totalPoints}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">النقاط</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 text-center border border-blue-200 dark:border-blue-800">
              <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                {blockchainStats.pagesRead}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">إجمالي الصفحات المقروءة</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 text-center border border-green-200 dark:border-green-800">
              <Trophy className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
                {blockchainStats.quizzesPassed}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">الاختبارات المكتملة</div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 text-center border border-amber-200 dark:border-amber-800">
              <Award className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-1">
                {blockchainStats.totalPoints}
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-300">إجمالي النقاط</div>
            </div>
          </div>
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
