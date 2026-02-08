import { useState, useEffect } from 'react';
import { useActiveAccount, useAutoConnect } from 'thirdweb/react';
import { client } from './lib/thirdwebClient';
import { web3Service } from './lib/web3';
import { Home } from './components/Home';
import WalletConnect from './components/WalletConnect';
import { Library } from './components/Library';
import BlockchainReader from './components/BlockchainReader';
import Leaderboard from './components/Leaderboard';
import { WalletDashboard } from './components/WalletDashboard';
import { useDarkMode } from './hooks/useDarkMode';

type View = 'home' | 'wallet' | 'library' | 'reader' | 'leaderboard' | 'dashboard';

function AppContent() {
  const [view, setView] = useState<View>('home');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [darkMode, setDarkMode] = useDarkMode();

  const { isLoading: isAutoConnecting } = useAutoConnect({
    client,
    timeout: 10000,
  });

  const activeAccount = useActiveAccount();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    if (activeAccount) {
      console.log('Active account detected:', activeAccount.address);
      web3Service.account = activeAccount;

      const address = activeAccount.address;
      setWalletAddress(address);
      localStorage.setItem('walletAddress', address);

      const savedUsername = localStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername);
        if (view === 'home' || view === 'wallet') {
          setView('library');
        }
      } else if (view === 'home') {
        setView('wallet');
      }
    } else {
      console.log('No active account, checking localStorage');
      const savedAddress = localStorage.getItem('walletAddress');
      const savedUsername = localStorage.getItem('username');
      if (savedAddress && savedUsername && !isAutoConnecting) {
        console.log('Found saved credentials, restoring session');
        setWalletAddress(savedAddress);
        setUsername(savedUsername);
        setView('library');
      }
    }
  }, [activeAccount, isAutoConnecting]);

  const handleGetStarted = () => {
    setView('wallet');
  };

  const handleWalletConnected = (address: string, user: string) => {
    setWalletAddress(address);
    setUsername(user);
    localStorage.setItem('walletAddress', address);
    localStorage.setItem('username', user);
    setView('library');
  };

  if (view === 'home') {
    return <Home onGetStarted={handleGetStarted} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />;
  }

  if (view === 'wallet') {
    return <WalletConnect onConnected={handleWalletConnected} onBack={() => setView('home')} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />;
  }

  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setView('reader');
  };

  const handleCloseReader = () => {
    setSelectedBookId(null);
    setView('library');
  };

  const handleViewDashboard = () => {
    setView('dashboard');
  };

  const handleViewLeaderboard = () => {
    setView('leaderboard');
  };

  const handleBackToLibrary = () => {
    setView('library');
  };

  const handleSignOut = () => {
    setWalletAddress('');
    setUsername('');
    setView('wallet');
  };

  if (view === 'dashboard') {
    return <WalletDashboard walletAddress={walletAddress} username={username} onBack={handleBackToLibrary} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />;
  }

  if (view === 'leaderboard') {
    return <Leaderboard onBack={handleBackToLibrary} currentAddress={walletAddress} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />;
  }

  if (view === 'reader' && selectedBookId) {
    return <BlockchainReader bookId={selectedBookId} onClose={handleCloseReader} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />;
  }

  return <Library onSelectBook={handleSelectBook} onViewDashboard={handleViewDashboard} onViewLeaderboard={handleViewLeaderboard} onSignOut={handleSignOut} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />;
}

function App() {
  return <AppContent />;
}

export default App;
