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
