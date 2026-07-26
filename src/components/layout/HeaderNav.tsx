import React, { useState } from 'react';
import { Sparkles, Sun, Moon, ChevronDown, Check, UserCheck, ShieldCheck, GraduationCap, Users, LogOut, BookOpen, Settings, Plus, PhoneCall, Code2 } from 'lucide-react';
import type { Page, Theme, UserRole } from '../../types';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  badgeColor: string;
  defaultPage: Page;
}

export const accounts: UserAccount[] = [
  {
    id: 'u1',
    name: 'Алинур Каримов',
    email: 'alinur@skillplanet.uz',
    role: 'student',
    roleTitle: 'Ученик',
    avatar: '/images/avatar_teacher2.png',
    badgeColor: 'badge-blue',
    defaultPage: 'student-dashboard',
  },
  {
    id: 'u2',
    name: 'Малика Рашидова',
    email: 'malika@skillplanet.uz',
    role: 'teacher',
    roleTitle: 'Преподаватель',
    avatar: '/images/avatar_teacher1.png',
    badgeColor: 'badge-violet',
    defaultPage: 'teacher-dashboard',
  },
  {
    id: 'u8',
    name: 'Отабек Мирзаев',
    email: 'admin@skillplanet.uz',
    role: 'admin',
    roleTitle: 'Администратор',
    avatar: '/images/avatar_teacher3.png',
    badgeColor: 'badge-amber',
    defaultPage: 'admin-dashboard',
  },
];

export interface HeaderNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  currentUser: UserAccount;
  onSwitchUser: (user: UserAccount) => void;
  theme: Theme;
  onThemeToggle: () => void;
  onOpenCreateCourse?: () => void;
}

export default function HeaderNav({
  currentPage,
  onNavigate,
  currentUser,
  onSwitchUser,
  theme,
  onThemeToggle,
  onOpenCreateCourse,
}: HeaderNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dark = theme === 'dark';

  return (
    <header className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="navbar__inner container">

        {/* Logo */}
        <div
          className="navbar__logo"
          onClick={() =>
            onNavigate(
              currentUser.role === 'teacher'
                ? 'teacher-dashboard'
                : currentUser.role === 'admin'
                ? 'admin-dashboard'
                : 'landing'
            )
          }
        >
          <img src="/logo.png" alt="SkillPlanet" />
          <span>Skill<span className="g-text">Planet</span></span>
          <span className={`badge ${currentUser.badgeColor}`} style={{ marginLeft: 4, fontSize: 10 }}>
            {currentUser.roleTitle}
          </span>
        </div>

        {/* Role-Specific Navigation Bar */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {currentUser.role === 'student' && (
            <>
              <button className={`navbar__link ${currentPage === 'landing' ? 'active' : ''}`} onClick={() => onNavigate('landing')}>
                🌐 Главная
              </button>
              <button className={`navbar__link ${currentPage === 'catalog' ? 'active' : ''}`} onClick={() => onNavigate('catalog')}>
                📚 Каталог курсов
              </button>
              <button className={`navbar__link ${currentPage === 'student-dashboard' ? 'active' : ''}`} onClick={() => onNavigate('student-dashboard')}>
                🎓 Кабинет ученика
              </button>
              <button className={`navbar__link ${currentPage === 'lesson' ? 'active' : ''}`} onClick={() => onNavigate('lesson')}>
                📖 Урок & Тесты
              </button>
            </>
          )}

          {currentUser.role === 'teacher' && (
            <>
              <button className={`navbar__link ${currentPage === 'teacher-dashboard' ? 'active' : ''}`} onClick={() => onNavigate('teacher-dashboard')}>
                👨‍🏫 Кабинет Учителя
              </button>
            </>
          )}

          {currentUser.role === 'admin' && (
            <>
              <button className={`navbar__link ${currentPage === 'admin-dashboard' ? 'active' : ''}`} onClick={() => onNavigate('admin-dashboard')}>
                🛡️ Кабинет Администратора
              </button>
            </>
          )}
        </nav>

        {/* Right User Settings & Profile Dropdown */}
        <div className="navbar__actions" style={{ position: 'relative' }}>

          {/* Profile Trigger */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 12px 4px 4px', borderRadius: 99,
              background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            <img src={currentUser.avatar} alt="" className="avatar" style={{ width: 30, height: 30 }} />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }} className="hidden sm:block">
              <div style={{ fontSize: 13, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: 10, color: '#71717a' }}>{currentUser.roleTitle}</div>
            </div>
            <ChevronDown size={14} style={{ color: dark ? '#71717a' : '#94a3b8', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {/* Settings & Profile Popover Modal */}
          {dropdownOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setDropdownOpen(false)} />
              <div
                style={{
                  position: 'absolute', top: 48, right: 0, zIndex: 100,
                  width: 300, padding: 14, borderRadius: 18,
                  background: dark ? '#111116' : '#ffffff',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  boxShadow: dark ? '0 24px 70px rgba(0,0,0,0.8)' : '0 16px 50px rgba(0,0,0,0.15)',
                }}
              >
                {/* Active User Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', marginBottom: 12 }}>
                  <img src={currentUser.avatar} alt="" className="avatar" style={{ width: 40, height: 40 }} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#71717a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {currentUser.email}
                    </div>
                    <span className={`badge ${currentUser.badgeColor}`} style={{ marginTop: 4, fontSize: 9 }}>
                      {currentUser.roleTitle}
                    </span>
                  </div>
                </div>

                {/* Theme Switcher in Settings */}
                <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '8px 10px', borderRadius: 10, background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: dark ? '#a1a1aa' : '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Settings size={14} /> Тема оформления:
                  </span>
                  <button
                    onClick={onThemeToggle}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 8, border: 'none',
                      background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                      color: dark ? '#fbbf24' : '#0f172a', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    {dark ? <Sun size={13} /> : <Moon size={13} />}
                    {dark ? 'Тёмная' : 'Светлая'}
                  </button>
                </div>

                <div style={{ fontSize: 10, fontWeight: 800, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 8px 6px' }}>
                  Настройки аккаунта / Переключение ролей:
                </div>

                {/* Account / Role Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {accounts.map(acc => {
                    const isSelected = acc.id === currentUser.id;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => {
                          onSwitchUser(acc);
                          setDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '9px 10px', borderRadius: 11, border: 'none',
                          background: isSelected ? (dark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)') : 'transparent',
                          cursor: 'pointer', fontFamily: 'inherit', width: '100%',
                          textAlign: 'left', transition: 'background 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={acc.avatar} alt="" className="avatar" style={{ width: 28, height: 28 }} />
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? '#60a5fa' : dark ? '#f4f4f5' : '#0f172a' }}>
                              {acc.name}
                            </div>
                            <div style={{ fontSize: 10, color: '#71717a' }}>{acc.roleTitle}</div>
                          </div>
                        </div>
                        {isSelected && <Check size={15} color="#60a5fa" />}
                      </button>
                    );
                  })}
                </div>

                <div className="stripe" style={{ margin: '10px 0' }} />

                <button
                  onClick={() => {
                    onNavigate('auth');
                    setDropdownOpen(false);
                  }}
                  className="btn btn-sm btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: 12, padding: '8px 10px', color: '#f87171' }}
                >
                  <LogOut size={14} /> Выйти в окно авторизации
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </header>
  );
}
