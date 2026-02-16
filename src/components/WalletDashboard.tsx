import { useEffect, useState } from 'react';
import { Award, BookOpen, ArrowLeft, Moon, Sun, Copy, CheckCircle, Wallet, Zap, Trophy, Send, Shield, ExternalLink, Settings, LogOut, Menu, X } from 'lucide-react';
import { web3Service, baseMainnet } from '../lib/web3';
import { client } from '../lib/thirdwebClient';
import { useActiveAccount, ConnectButton } from 'thirdweb/react';
import { prepareTransaction, toWei } from 'thirdweb';
import { sendTransaction } from 'thirdweb';

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

type ActiveTab = 'stats' | 'wallet' | 'transactions';

export const WalletDashboard = ({ walletAddress, username, onBack, darkMode, onToggleDarkMode }: WalletDashboardProps) => {
  const account = useActiveAccount();
  const [blockchainStats, setBlockchainStats] = useState<BlockchainStats>({
    pagesRead: 0,
    quizzesPassed: 0,
    totalPoints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('stats');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Send ETH state
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

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

  const handleSendEth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    setIsSending(true);
    setSendError(null);
    setSendSuccess(null);

    try {
      const transaction = prepareTransaction({
        to: recipient,
        value: toWei(amount),
        chain: baseMainnet,
        client,
      });

      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      setSendSuccess(`تم الإرسال بنجاح! الهاش: ${transactionHash}`);
      setAmount('');
      setRecipient('');
    } catch (error: any) {
      console.error('Send error:', error);
      setSendError(error.message || 'فشل في إرسال المعاملة');
    } finally {
      setIsSending(false);
    }
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

  const sidebarItems = [
    { id: 'stats', label: 'الإحصائيات', icon: Trophy },
    { id: 'wallet', label: 'إرسال عملات', icon: Send },
    { id: 'transactions', label: 'المعاملات', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row shadow-inner overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2">
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">IqraArena</h1>
        <button onClick={onToggleDarkMode} className="p-2">
          {darkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
        md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full
      `} dir="rtl">
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/30 flex items-center justify-center text-white">
              <Wallet className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">IqraArena</span>
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Wallet Control</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as ActiveTab);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                ${activeTab === item.id
                  ? 'bg-gradient-to-l from-amber-500/10 to-amber-500/5 text-amber-600 dark:text-amber-400 border-r-4 border-amber-500 font-bold shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'}
              `}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${activeTab === item.id ? 'text-amber-500' : ''}`} />
              <span className="text-base">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700/50 space-y-4">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-5 py-4 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">العودة للمكتبة</span>
          </button>

          <div className="p-5 bg-gradient-to-br from-gray-50 to-amber-50/30 dark:from-gray-900/50 dark:to-amber-900/5 rounded-2xl border border-gray-100 dark:border-gray-700">
            <ConnectButton
              client={client}
              theme={darkMode ? 'dark' : 'light'}
              connectButton={{
                label: "إدارة المحفظة الأمان",
                className: "!w-full !bg-amber-600 !text-white !rounded-xl !hover:bg-amber-700 !transition-all !text-sm !py-3 !font-bold !shadow-lg !shadow-amber-500/20"
              }}
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 text-center leading-relaxed">
              استخدم هذا الزر لربط محافظ خارجية أو تصدير مفتاحك الخاص.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 relative" dir="rtl">
        <header className="hidden md:flex justify-between items-center p-8 sticky top-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-xl z-30">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">لوحة التحكم</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">مرحباً بك مجدداً، {username}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onToggleDarkMode} className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
              {darkMode ? <Sun className="w-6 h-6 text-amber-500" /> : <Moon className="w-6 h-6 text-gray-600" />}
            </button>
          </div>
        </header>

        <main className="p-4 md:px-8 md:pb-12 max-w-6xl">
          {activeTab === 'stats' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 ease-out">
              {/* Wallet Address Card */}
              <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-200 dark:border-gray-700 p-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">تفاصيل الأمان والمحفظة</h3>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-4">
                  <div className="flex-1 w-full bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 font-mono text-xs md:text-sm break-all text-gray-600 dark:text-gray-300 leading-relaxed">
                    {walletAddress}
                  </div>
                  <button
                    onClick={() => copyToClipboard(walletAddress)}
                    className="flex items-center justify-center gap-3 px-8 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all font-bold w-full lg:w-auto shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    <span>{copied ? 'تم نسخ العنوان' : 'نسخ العنوان'}</span>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'الصفحات المقروءة', value: blockchainStats.pagesRead, icon: BookOpen, color: 'blue', gradient: 'from-blue-500 to-indigo-600' },
                  { label: 'الاختبارات الناجحة', value: blockchainStats.quizzesPassed, icon: Award, color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
                  { label: 'إجمالي النقاط', value: blockchainStats.totalPoints, icon: Trophy, color: 'amber', gradient: 'from-amber-500 to-orange-600' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-200 dark:border-gray-700 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center mb-6 transition-transform group-hover:rotate-6`}>
                      <stat.icon className={`w-7 h-7 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                    <div className="text-4xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</div>
                    <div className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wide">{stat.label}</div>
                    <div className="mt-6 h-2 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 delay-300`} style={{ width: '65%' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Promotional Banner */}
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-orange-500/20">
                <div className="relative z-10 max-w-xl">
                  <h2 className="text-3xl font-black mb-4 leading-tight">القراءة هي طريقك للتميز والربح!</h2>
                  <p className="text-amber-50 text-lg leading-relaxed mb-8 opacity-90">نحن نؤمن بقوة المعرفة، لذا كل دقيقة تقضيها في القراءة تُترجم لعملات رقمية حقيقية في محفظتك المدارة بالكامل من قبلك.</p>
                  <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black hover:bg-amber-50 transition-colors shadow-xl">ابدأ رحلتك اليوم</button>
                </div>
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <Wallet className="absolute -bottom-10 -left-10 w-64 h-64 text-white/10 rotate-12" />
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="max-w-xl animate-in slide-in-from-bottom-8 duration-700 ease-out">
              <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-10 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                    <Send className="w-8 h-8 text-amber-600" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">إرسال العملات</h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">قم بتحويل الـ ETH من محفظة التطبيق إلى أي محفظة خارجية على شبكة Base بسرعة وأمان.</p>
                </div>

                <form onSubmit={handleSendEth} className="p-10 space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest px-1">عنوان المستلم</label>
                    <input
                      type="text"
                      required
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-5 outline-none dark:text-white transition-all font-mono text-sm shadow-inner"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest px-1">المبلغ المُراد إرساله</label>
                    <div className="relative group">
                      <input
                        type="number"
                        step="0.00001"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-5 outline-none dark:text-white transition-all text-xl font-black shadow-inner"
                      />
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400 group-focus-within:text-amber-500 transition-colors">ETH</span>
                    </div>
                  </div>

                  {sendError && (
                    <div className="p-5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold border border-red-100 dark:border-red-900/20 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      {sendError}
                    </div>
                  )}

                  {sendSuccess && (
                    <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-bold border border-emerald-100 dark:border-emerald-900/20 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      {sendSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSending || !amount || !recipient}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-800 dark:disabled:to-gray-900 text-white font-black py-6 rounded-2xl shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-3 text-lg group active:scale-[0.98]"
                  >
                    {isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
                    <span>{isSending ? 'جاري توثيق المعاملة...' : 'إرسال العملات الآن'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="py-20 animate-in fade-in zoom-in duration-700">
              <div className="max-w-md mx-auto text-center">
                <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl flex items-center justify-center mx-auto mb-8 border border-gray-100 dark:border-gray-700 group hover:rotate-12 transition-transform duration-500">
                  <Zap className="w-12 h-12 text-amber-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">سجل العمليات</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-10">قريباً ستتمكن من تتبع جميع مكافآتك وتحويلاتك مباشرة من هنا. حالياً، يمكنك تتبع كل شيء بشفافية عبر مستكشف كتل Base.</p>
                <a
                  href={`https://basescan.org/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-xl group"
                >
                  <span>فتح مستكشف الكتل</span>
                  <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Simple Loader component for the button
const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
