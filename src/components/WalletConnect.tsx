import { useState, useEffect } from 'react';
import { useConnect, useActiveAccount } from 'thirdweb/react';
import { inAppWallet, preAuthenticate } from 'thirdweb/wallets/in-app';
import { Mail, AlertCircle, CheckCircle, Loader2, Copy, ArrowLeft, Moon, Sun } from 'lucide-react';
import { client } from '../lib/thirdwebClient';
import { web3Service } from '../lib/web3';
import { supabase } from '../lib/supabase';

interface WalletConnectProps {
  onConnected: (address: string, username: string) => void;
  onBack?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function WalletConnect({ onConnected, onBack, darkMode, onToggleDarkMode }: WalletConnectProps) {
  const { connect } = useConnect();
  const activeAccount = useActiveAccount();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'email' | 'verify' | 'register'>('email');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activeAccount) {
      const address = activeAccount.address;
      setWalletAddress(address);
      web3Service.account = activeAccount;
      checkUserRegistration(address);
    }
  }, [activeAccount]);

  const checkUserRegistration = async (address: string) => {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('blockchain_username')
      .eq('wallet_address', address)
      .maybeSingle();

    if (existingProfile && existingProfile.blockchain_username) {
      onConnected(address, existingProfile.blockchain_username);
      return;
    }

    const isRegistered = await web3Service.isUserRegistered(address);
    if (isRegistered) {
      const user = await web3Service.getUser(address);
      if (user) {
        onConnected(address, user.username);
      }
    } else {
      setStep('register');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };


  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('الرجاء إدخال عنوان بريد إلكتروني صحيح');
      return;
    }

    setError('');
    setIsConnecting(true);

    try {
      await preAuthenticate({
        client,
        strategy: 'email',
        email: email.trim(),
      });
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'فشل إرسال رمز التحقق');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('الرجاء إدخال رمز التحقق');
      return;
    }

    setError('');
    setIsVerifying(true);

    try {
      const wallet = inAppWallet();
      const account = await connect(async () => {
        await wallet.connect({
          client,
          strategy: 'email',
          email: email.trim(),
          verificationCode: otp.trim(),
        });
        return wallet;
      });

      localStorage.setItem('userEmail', email.trim());
    } catch (err: any) {
      setError(err.message || 'رمز التحقق غير صحيح');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('الرجاء إدخال اسم المستخدم');
      return;
    }

    setError('');
    setIsRegistering(true);

    try {
      await web3Service.registerUser(username.trim());

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', walletAddress)
        .maybeSingle();

      if (existingProfile) {
        await supabase
          .from('profiles')
          .update({ blockchain_username: username.trim() })
          .eq('wallet_address', walletAddress);
      }

      onConnected(walletAddress, username.trim());
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل اسم المستخدم');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative">
        <div className="absolute top-4 right-0 left-0 flex justify-between items-center px-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>عودة</span>
            </button>
          )}
          <button
            onClick={onToggleDarkMode}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors ml-auto"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            IqraArena
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'email'
              ? 'سجل دخولك بالبريد الإلكتروني لبدء القراءة'
              : step === 'verify'
              ? 'أدخل الرمز المرسل إلى بريدك الإلكتروني'
              : 'اختر اسم المستخدم الخاص بك للبدء'}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                عنوان البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                disabled={isConnecting}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isConnecting || !email.trim()}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جارٍ إرسال الرمز...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  متابعة بالبريد الإلكتروني
                </>
              )}
            </button>

          </form>
        ) : step === 'verify' ? (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
              <div className="flex items-start gap-2 text-emerald-800">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">تم إرسال الرمز</p>
                  <p className="text-emerald-700 mt-1">تحقق من بريدك الإلكتروني: {email}</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                رمز التحقق
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="أدخل الرمز المكون من 6 أرقام"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center text-2xl tracking-widest"
                disabled={isVerifying}
                maxLength={6}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying || !otp.trim()}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جارٍ التحقق...
                </>
              ) : (
                'تحقق ومتابعة'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtp('');
                setError('');
              }}
              className="w-full text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium"
            >
              استخدم بريدًا إلكترونيًا مختلفًا
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
              <div className="flex items-start gap-2 text-emerald-800">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">تم توصيل المحفظة</p>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-emerald-700 break-all font-mono text-xs bg-emerald-100 p-2 rounded flex-1">{walletAddress}</p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(walletAddress)}
                      className="p-2 hover:bg-emerald-200 rounded transition-colors"
                      title="Copy address"
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
              <div className="flex items-start gap-2 text-blue-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-blue-700">
                    سيتم شحن محفظتك من خلالنا أو يمكنك إرسال عملة Celo على عنوان محفظتك بشكل مباشر
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                اسم المستخدم
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                disabled={isRegistering}
              />
            </div>

            <button
              type="submit"
              disabled={isRegistering || !username.trim()}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جارٍ التسجيل...
                </>
              ) : (
                'تسجيل والبدء في القراءة'
              )}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
