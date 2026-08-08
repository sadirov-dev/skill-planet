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

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('admin-dashboard');
  const [currentUser, setCurrentUser] = useState<UserAccount>(accounts[0]); // Default Admin (sadirov@admin.dev)
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('sp-theme') as Theme) || 'dark';
  });

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

    // Unconfirmed Teacher Status Screen
    if (currentUser.teacherPending) {
      return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 24, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 36 }}>⏳</span>
          </div>
          <span className="badge badge-amber" style={{ fontSize: 12, padding: '6px 14px', marginBottom: 12 }}>
            На модерации администратора
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: theme === 'dark' ? '#f4f4f5' : '#0f172a', marginBottom: 10, letterSpacing: '-0.02em' }}>
            Статус не подтверждён
          </h1>
          <p style={{ fontSize: 14, color: theme === 'dark' ? '#a1a1aa' : '#64748b', maxWidth: 440, lineHeight: 1.6, marginBottom: 28 }}>
            Ваша заявка на статус Преподавателя находится на проверке у Главного Администратора. Кабинет учителя недоступен до официального подтверждения.
          </p>
          <button className="btn btn-ghost" onClick={() => handleNavigate('auth')} style={{ padding: '10px 20px', fontSize: 13 }}>
            🚪 Выйти / Сменить аккаунт
          </button>
        </div>
      );
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
