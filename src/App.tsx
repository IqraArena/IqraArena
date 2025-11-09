import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Home } from './components/Home';
import { Auth } from './components/Auth';
import { Library } from './components/Library';
import { Reader } from './components/Reader';
import { Dashboard } from './components/Dashboard';
import { useDarkMode } from './hooks/useDarkMode';

type View = 'home' | 'auth' | 'library' | 'reader' | 'dashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>('home');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useDarkMode();

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

  if (!user) {
    if (view === 'auth') {
      return <Auth />;
    }
    return <Home onGetStarted={() => setView('auth')} />;
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

  const handleBackToLibrary = () => {
    setView('library');
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (view === 'dashboard') {
    return (
      <Dashboard
        onBack={handleBackToLibrary}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
    );
  }

  if (view === 'reader' && selectedBookId) {
    return <Reader bookId={selectedBookId} onClose={handleCloseReader} />;
  }

  return <Library onSelectBook={handleSelectBook} onViewDashboard={handleViewDashboard} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
