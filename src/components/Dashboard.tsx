import { useEffect, useState } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Award, BookOpen, TrendingUp, Trophy, ArrowLeft, Moon, Sun } from 'lucide-react';

type DashboardProps = {
  onBack: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

type UserStats = {
  totalPagesRead: number;
  booksCompleted: number;
  totalPoints: number;
};

export const Dashboard = ({ onBack, darkMode, onToggleDarkMode }: DashboardProps) => {
  const { profile, signOut } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalPagesRead: 0,
    booksCompleted: 0,
    totalPoints: 0,
  });
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!profile) return;

    const [progressResult, leaderboardResult] = await Promise.all([
      supabase
        .from('reading_progress')
        .select('pages_read, completed')
        .eq('user_id', profile.id),
      supabase
        .from('profiles')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(10),
    ]);

    if (progressResult.data) {
      const totalPages = progressResult.data.reduce((sum, p) => sum + p.pages_read, 0);
      const completed = progressResult.data.filter((p) => p.completed).length;
      setStats({
        totalPagesRead: totalPages,
        booksCompleted: completed,
        totalPoints: profile.total_points,
      });
    }

    if (leaderboardResult.data) {
      setLeaderboard(leaderboardResult.data);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
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

  const userRank = leaderboard.findIndex((p) => p.id === profile?.id) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للمكتبة</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">لوحة القيادة</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile?.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="text-right flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.full_name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{profile?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 text-center border border-blue-200 dark:border-blue-800">
              <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                {stats.totalPagesRead}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">إجمالي الصفحات المقروءة</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 text-center border border-green-200 dark:border-green-800">
              <Trophy className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
                {stats.booksCompleted}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">كتب مكتملة</div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 text-center border border-amber-200 dark:border-amber-800">
              <Award className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-1">
                {stats.totalPoints}
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-300">إجمالي النقاط</div>
            </div>
          </div>

          {userRank > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-900 dark:text-purple-100 font-medium">
                  ترتيبك الحالي: <span className="font-bold">#{userRank}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">لوحة المتصدرين</h2>
          </div>

          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  user.id === profile?.id
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 dark:border-amber-600'
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                    index === 0
                      ? 'bg-yellow-400 text-yellow-900'
                      : index === 1
                      ? 'bg-gray-300 text-gray-900'
                      : index === 2
                      ? 'bg-orange-400 text-orange-900'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {index + 1}
                </div>

                <div className="flex-1 text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {user.full_name}
                    {user.id === profile?.id && (
                      <span className="text-amber-600 dark:text-amber-400 text-sm mr-2">(أنت)</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {user.total_points}
                  </span>
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">لا يوجد متصدرون بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
