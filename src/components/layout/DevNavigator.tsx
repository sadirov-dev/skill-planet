import React from 'react';
import type { Page } from '../../types';
import { LogIn, Globe, BookOpen, GraduationCap, Users, ShieldCheck, PlaySquare, Sun, Moon } from 'lucide-react';

interface DevNavigatorProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

const navItems: { page: Page; label: string; emoji: string }[] = [
  { page: 'auth',              label: 'Вход',    emoji: '🔑' },
  { page: 'landing',           label: 'Лендинг', emoji: '🌐' },
  { page: 'catalog',           label: 'Каталог', emoji: '📚' },
  { page: 'student-dashboard', label: 'Ученик',  emoji: '🎓' },
  { page: 'teacher-dashboard', label: 'Учитель', emoji: '👨‍🏫' },
  { page: 'admin-dashboard',   label: 'Админ',   emoji: '🛡️' },
  { page: 'lesson',            label: 'Урок',    emoji: '📖' },
];

const DevNavigator: React.FC<DevNavigatorProps> = ({ currentPage, onPageChange, theme, onThemeToggle }) => {
  const dark = theme === 'dark';

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '6px 8px',
      borderRadius: 18,
      background: dark ? 'rgba(14,14,20,0.95)' : 'rgba(255,255,255,0.97)',
      border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      boxShadow: dark
        ? '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)'
        : '0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* DEV badge */}
      <div style={{
        padding: '3px 10px', borderRadius: 10, marginRight: 4,
        background: dark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.1)',
        border: '1px solid rgba(139,92,246,0.2)',
        color: '#a78bfa', fontSize: 10, fontWeight: 800,
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        DEV
      </div>

      {navItems.map(({ page, label, emoji }) => {
        const active = currentPage === page;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            title={label}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', borderRadius: 12,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 12, fontWeight: 600,
              transition: 'all 0.15s cubic-bezier(0.4,0,0.2,1)',
              background: active
                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                : 'transparent',
              color: active ? '#fff' : dark ? '#71717a' : '#64748b',
              boxShadow: active ? '0 2px 12px rgba(59,130,246,0.35)' : 'none',
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
                e.currentTarget.style.color = dark ? '#f4f4f5' : '#0f172a';
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = dark ? '#71717a' : '#64748b';
              }
            }}
          >
            <span style={{ fontSize: 14 }}>{emoji}</span>
            <span style={{ display: 'none' }} className="sm:inline">{label}</span>
          </button>
        );
      })}

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', margin: '0 4px' }} />

      {/* Theme toggle */}
      <button
        onClick={onThemeToggle}
        title={dark ? 'Светлая тема' : 'Тёмная тема'}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 34, height: 34, borderRadius: 10,
          border: 'none', cursor: 'pointer',
          background: 'transparent',
          color: dark ? '#71717a' : '#64748b',
          transition: 'all 0.15s',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
          e.currentTarget.style.color = dark ? '#f59e0b' : '#0f172a';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = dark ? '#71717a' : '#64748b';
        }}
      >
        {dark ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </div>
  );
};

export default DevNavigator;
