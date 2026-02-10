import { useEffect, useState } from 'react';
import { Trophy, Medal, Coins, Users, ArrowLeft, Loader2, Moon, Sun } from 'lucide-react';
import { web3Service } from '../lib/web3';

interface LeaderboardProps {
  onBack: () => void;
  currentAddress?: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

interface LeaderboardEntry {
  address: string;
  username: string;
  points: number;
  rank: number;
}

export default function Leaderboard({ onBack, currentAddress, darkMode, onToggleDarkMode }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await web3Service.getLeaderboard();

      const entries: LeaderboardEntry[] = data.addresses.map((address, index) => ({
        address,
        username: data.usernames[index],
        points: data.points[index],
        rank: index + 1,
      }));

      setLeaderboard(entries);
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Medal className="w-8 h-8 text-amber-600" />;
      default:
        return <span className="text-2xl font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-700';
      default:
        return 'bg-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 dark:text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">جارٍ تحميل لوحة المتصدرين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>عودة إلى المكتبة</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleDarkMode}
              className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
              <Users className="w-5 h-5" />
              <span className="font-medium">{leaderboard.length} قارئ</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4 shadow-lg">
            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">لوحة المتصدرين</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">أفضل القراء على بلوكشين Base</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-800">
            {error}
          </div>
        )}

        {leaderboard.length === 0 && !error && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">لا يوجد قراء بعد. كن أول من يبدأ القراءة!</p>
          </div>
        )}

        <div className="space-y-4">
          {leaderboard.map((entry) => {
            const isCurrentUser = currentAddress && entry.address.toLowerCase() === currentAddress.toLowerCase();

            return (
              <div
                key={entry.address}
                className={`${entry.rank <= 3 ? getRankColor(entry.rank) + ' text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  } ${isCurrentUser ? 'ring-4 ring-emerald-500' : ''
                  } rounded-xl shadow-lg p-4 md:p-6 transition-all hover:shadow-xl`}
              >
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex-shrink-0 w-10 md:w-16 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base md:text-xl font-bold truncate">{entry.username}</h3>
                      {isCurrentUser && (
                        <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs md:text-sm ${entry.rank <= 3 ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                        } truncate`}
                    >
                      {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 md:gap-2 bg-white/20 dark:bg-black/20 px-2 md:px-4 py-1 md:py-2 rounded-lg">
                    <Coins className={`w-4 h-4 md:w-5 md:h-5 ${entry.rank <= 3 ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                    <span className={`text-lg md:text-2xl font-bold ${entry.rank <= 3 ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {entry.points}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">كيفية كسب النقاط:</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">قراءة صفحة واحدة</p>
                <p className="text-sm text-gray-600">اكسب نقطة واحدة عن كل صفحة تقرأها</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-bold">10</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">اجتياز اختبار</p>
                <p className="text-sm text-gray-600">أجب على الاختبار بشكل صحيح كل 10 صفحات لكسب 10 نقاط</p>
              </div>
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
}
