import { useState, useEffect } from 'react';
import type { Page, Theme } from './types';
import HeaderNav, { accounts, type UserAccount } from './components/layout/HeaderNav';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import CatalogPage from './pages/CatalogPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LessonPage from './pages/LessonPage';
import GlobalAiWidget from './components/common/GlobalAiWidget';

import { checkServerHealth } from './services/api';
import { AlertTriangle, RefreshCw } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('admin-dashboard');
  const [currentUser, setCurrentUser] = useState<UserAccount>(accounts[0]); // Default Admin (sadirov@admin.dev)
  const [backendOffline, setBackendOffline] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(true);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('sp-theme') as Theme) || 'dark';
  });

  const verifyBackend = async () => {
    setCheckingBackend(true);
    const health = await checkServerHealth();
    if (!health.success) {
      setBackendOffline(true);
    } else {
      setBackendOffline(false);
    }
    setCheckingBackend(false);
  };

  useEffect(() => {
    verifyBackend();
  }, []);

  useEffect(() => {
    localStorage.setItem('sp-theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(p => (p === 'dark' ? 'light' : 'dark'));

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSwitchUser = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentPage(user.defaultPage);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const pageProps = { theme, onNavigate: handleNavigate, currentUser };

  const renderPage = () => {
    // Isolated rendering by role
    if (currentPage === 'auth') {
      return <AuthPage {...pageProps} onSwitchUser={handleSwitchUser} />;
    }

    if (currentUser.role === 'teacher') {
      return <TeacherDashboard {...pageProps} />;
    }

    if (currentUser.role === 'admin') {
      return <AdminDashboard {...pageProps} />;
    }

    // Student Role Portal
    switch (currentPage) {
      case 'landing':            return <LandingPage {...pageProps} />;
      case 'catalog':            return <CatalogPage {...pageProps} />;
      case 'student-dashboard':  return <StudentDashboard {...pageProps} />;
      case 'lesson':             return <LessonPage {...pageProps} />;
      default:                   return <StudentDashboard {...pageProps} />;
    }
  };

  if (backendOffline) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#fff', padding: 24, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <AlertTriangle size={32} color="#ef4444" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.02em' }}>Сайт заблокирован: нет подключения к Node.js бэкенду</h1>
        <p style={{ fontSize: 14, color: '#a1a1aa', maxWidth: 480, marginBottom: 24, lineHeight: 1.6 }}>
          Сайт не работает без активного подключения к бэкенд серверу. Пожалуйста, убедитесь, что сервер запущен командой <code style={{ background: '#18181b', padding: '3px 8px', borderRadius: 6, color: '#60a5fa' }}>npm run server</code> на порту 5000.
        </p>
        <button className="btn btn-primary" onClick={verifyBackend} style={{ padding: '12px 24px', fontSize: 14 }}>
          <RefreshCw size={16} className={checkingBackend ? 'spin' : ''} />
          {checkingBackend ? 'Проверка...' : 'Повторить попытку подключения'}
        </button>
      </div>
    );
  }

  return (
    <>
      {currentPage !== 'auth' && (
        <HeaderNav
          currentPage={currentPage}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onSwitchUser={handleSwitchUser}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
      )}

      {renderPage()}

      {/* Global AI Assistant Widget across all pages */}
      <GlobalAiWidget theme={theme} />
    </>
  );
}

export default App;
