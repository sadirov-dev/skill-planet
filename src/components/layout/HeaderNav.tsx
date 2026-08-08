import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, ChevronDown, Check, UserCheck, ShieldCheck, GraduationCap, Users, LogOut, BookOpen, Settings, Plus, PhoneCall, Code2, Globe, PlayCircle, UserPlus, X, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Page, Theme, UserRole } from '../../types';
import { loginUser, registerUser } from '../../services/api';

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

export const ADMIN_SADIROV: UserAccount = {
  id: 'u_admin_sadirov',
  name: 'Абдуллох Садиров',
  email: 'sadirov@admin.dev',
  role: 'admin',
  roleTitle: 'Супер Админ',
  avatar: '/images/avatar_teacher3.jpg',
  badgeColor: 'badge-amber',
  defaultPage: 'admin-dashboard',
};

export const accounts: UserAccount[] = [ADMIN_SADIROV];

const SAVED_ACCOUNTS_KEY = 'skillplanet_saved_accounts_v1';

export function loadSavedAccounts(): UserAccount[] {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_ACCOUNTS_KEY) || '[]');
    if (saved.length > 0) return saved;
    return [ADMIN_SADIROV];
  } catch {
    return [ADMIN_SADIROV];
  }
}

export function saveSavedAccounts(accounts: UserAccount[]) {
  localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts));
}

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
  const [savedAccounts, setSavedAccounts] = useState<UserAccount[]>(loadSavedAccounts);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  // Modal Form State
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const dark = theme === 'dark';

  // Ensure current user is in saved accounts list
  useEffect(() => {
    if (!savedAccounts.some(a => a.id === currentUser.id)) {
      const updated = [currentUser, ...savedAccounts];
      setSavedAccounts(updated);
      saveSavedAccounts(updated);
    }
  }, [currentUser]);

  // Press Escape to close modal / dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddAccountModal(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddAccountSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Введите Email и пароль.');
      return;
    }

    if (tab === 'register' && !name.trim()) {
      setErrorMsg('Введите полное имя.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // Check Admin
      if (cleanEmail === 'sadirov@admin.dev') {
        if (password !== 'Dev01031990!') {
          setErrorMsg('Неверный пароль');
          setLoading(false);
          return;
        }
        setSuccessMsg('Аккаунт Администратора добавлен!');
        setTimeout(() => {
          onSwitchUser(ADMIN_SADIROV);
          setShowAddAccountModal(false);
          setDropdownOpen(false);
        }, 400);
        return;
      }

      // Try Backend API
      if (tab === 'login') {
        const apiRes = await loginUser({ email: cleanEmail, password });
        if (!apiRes.success) {
          setErrorMsg(apiRes.message || 'Неверный Gmail или пароль');
          setLoading(false);
          return;
        }

        const newAcc: UserAccount = {
          id: apiRes.user.id || `u_${Date.now()}`,
          name: apiRes.user.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: apiRes.user.role || 'student',
          roleTitle: apiRes.user.role === 'admin' ? 'Администратор' : apiRes.user.role === 'teacher' ? 'Преподаватель' : 'Ученик',
          avatar: apiRes.user.avatar || '/images/avatar_teacher2.jpg',
          badgeColor: apiRes.user.role === 'admin' ? 'badge-amber' : apiRes.user.role === 'teacher' ? 'badge-violet' : 'badge-blue',
          defaultPage: apiRes.user.role === 'admin' ? 'admin-dashboard' : apiRes.user.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard',
        };

        const updated = [newAcc, ...savedAccounts.filter(a => a.id !== newAcc.id)];
        setSavedAccounts(updated);
        saveSavedAccounts(updated);
        setSuccessMsg('Аккаунт успешно добавлен!');

        setTimeout(() => {
          onSwitchUser(newAcc);
          setShowAddAccountModal(false);
          setDropdownOpen(false);
        }, 400);
        return;
      } else {
        const apiRes = await registerUser({ name: name.trim(), email: cleanEmail, password, role });
        if (!apiRes.success) {
          setErrorMsg(apiRes.message || 'Ошибка создания аккаунта');
          setLoading(false);
          return;
        }

        const newAcc: UserAccount = {
          id: `u_${Date.now()}`,
          name: name.trim(),
          email: cleanEmail,
          role,
          roleTitle: role === 'teacher' ? 'Преподаватель' : 'Ученик',
          avatar: role === 'teacher' ? '/images/avatar_teacher1.jpg' : '/images/avatar_teacher2.jpg',
          badgeColor: role === 'teacher' ? 'badge-violet' : 'badge-blue',
          defaultPage: role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard',
        };

        const updated = [newAcc, ...savedAccounts.filter(a => a.id !== newAcc.id)];
        setSavedAccounts(updated);
        saveSavedAccounts(updated);
        setSuccessMsg('Новый аккаунт создан и привязан!');

        setTimeout(() => {
          onSwitchUser(newAcc);
          setShowAddAccountModal(false);
          setDropdownOpen(false);
        }, 400);
        return;
      }
    } catch (err: any) {
      setErrorMsg('Ошибка подключения к серверу.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAccount = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedAccounts.length <= 1) return;
    const updated = savedAccounts.filter(a => a.id !== id);
    setSavedAccounts(updated);
    saveSavedAccounts(updated);
    if (currentUser.id === id) {
      onSwitchUser(updated[0]);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="container navbar__inner">
          {/* Logo */}
          <div className="navbar__logo" onClick={() => onNavigate('landing')}>
            <img src="/logo.png" alt="SkillPlanet" />
            <span>Skill<span className="g-text">Planet</span></span>
          </div>

          {/* Navigation Links */}
          <div className="navbar__actions" style={{ gap: 6 }}>
            {currentUser.role === 'student' && (
              <>
                <button
                  className={`navbar__link ${currentPage === 'landing' ? 'active' : ''}`}
                  onClick={() => onNavigate('landing')}
                >
                  Главная
                </button>
                <button
                  className={`navbar__link ${currentPage === 'catalog' ? 'active' : ''}`}
                  onClick={() => onNavigate('catalog')}
                >
                  Каталог курсов
                </button>
                <button
                  className={`navbar__link ${currentPage === 'student-dashboard' ? 'active' : ''}`}
                  onClick={() => onNavigate('student-dashboard')}
                >
                  Моё обучение
                </button>
              </>
            )}

            {currentUser.role === 'teacher' && (
              <button className="navbar__link active">
                👨‍🏫 Кабинет Преподавателя
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button className="navbar__link active" style={{ color: '#fbbf24', borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.1)' }}>
                🛡️ Кабинет Администратора
              </button>
            )}

            {/* Instagram-style User Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 10px', borderRadius: 99,
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <img src={currentUser.avatar} alt="" className="avatar" style={{ width: 26, height: 26 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: dark ? '#f4f4f5' : '#0f172a' }}>
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} style={{ color: '#71717a', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {dropdownOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setDropdownOpen(false)} />
                  <div
                    style={{
                      position: 'absolute', top: 44, right: 0, zIndex: 100,
                      width: 310, padding: 14, borderRadius: 18,
                      background: dark ? '#111116' : '#ffffff',
                      border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                      boxShadow: dark ? '0 24px 70px rgba(0,0,0,0.8)' : '0 16px 50px rgba(0,0,0,0.15)',
                    }}
                  >
                    {/* Active Profile Card */}
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

                    {/* Theme Switcher */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 10, background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: dark ? '#a1a1aa' : '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Settings size={14} /> Тема:
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
                      Мои аккаунты:
                    </div>

                    {/* Saved Accounts List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 180, overflowY: 'auto' }}>
                      {savedAccounts.map(acc => {
                        const isSelected = acc.id === currentUser.id;
                        return (
                          <div
                            key={acc.id}
                            onClick={() => {
                              onSwitchUser(acc);
                              setDropdownOpen(false);
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '8px 10px', borderRadius: 11,
                              background: isSelected ? (dark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)') : 'transparent',
                              cursor: 'pointer', transition: 'background 0.15s',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                              <img src={acc.avatar} alt="" className="avatar" style={{ width: 28, height: 28, flexShrink: 0 }} />
                              <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? '#60a5fa' : dark ? '#f4f4f5' : '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                  {acc.name}
                                </div>
                                <div style={{ fontSize: 10, color: '#71717a' }}>{acc.roleTitle}</div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                              {isSelected && <Check size={16} color="#34d399" />}
                              {savedAccounts.length > 1 && (
                                <button
                                  onClick={e => handleRemoveAccount(acc.id, e)}
                                  title="Удалить аккаунт"
                                  style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', padding: 2 }}
                                >
                                  <X size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* "+ Add Account" Button */}
                    <div style={{ borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`, marginTop: 8, paddingTop: 8 }}>
                      <button
                        onClick={() => setShowAddAccountModal(true)}
                        style={{
                          width: '100%', padding: '9px 10px', borderRadius: 10, border: 'none',
                          background: dark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
                          color: '#60a5fa', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8,
                          transition: 'background 0.15s',
                        }}
                      >
                        <UserPlus size={15} color="#60a5fa" />
                        ➕ Добавить аккаунт
                      </button>
                    </div>

                    <div className="stripe" style={{ margin: '8px 0' }} />

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
        </div>
      </header>

      {/* ─── INSTAGRAM MULTI-ACCOUNT ADD MODAL (WITH CANCEL / X / BACKDROP / ESCAPE) ─── */}
      {showAddAccountModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddAccountModal(false); }}
        >
          <div style={{ width: '100%', maxWidth: 420, borderRadius: 20, background: dark ? '#0d0d12' : '#ffffff', border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`, boxShadow: '0 30px 80px rgba(0,0,0,0.6)', animation: 'fadeIn 0.2s ease-out' }}>

            {/* Header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>Добавить аккаунт</div>
                  <div style={{ fontSize: 11, color: '#71717a' }}>Переключайтесь между аккаунтами в 1 клик</div>
                </div>
              </div>
              <button onClick={() => setShowAddAccountModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', padding: 4 }}><X size={18} /></button>
            </div>

            {/* Body */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Tabs */}
              <div className="tabs" style={{ marginBottom: 4 }}>
                <button className={`tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setErrorMsg(''); }}>Войти</button>
                <button className={`tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setErrorMsg(''); }}>Создать</button>
              </div>

              {errorMsg && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                  <span>{successMsg}</span>
                </div>
              )}

              {tab === 'register' && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: dark ? '#a1a1aa' : '#52525b', display: 'block', marginBottom: 6 }}>Имя пользователя</label>
                  <input className="input" placeholder="Полное имя" value={name} onChange={e => setName(e.target.value)} />
                </div>
              )}

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: dark ? '#a1a1aa' : '#52525b', display: 'block', marginBottom: 6 }}>Email / Gmail</label>
                <input className="input" type="email" placeholder="ваш@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: dark ? '#a1a1aa' : '#52525b', display: 'block', marginBottom: 6 }}>Пароль</label>
                <input className="input" type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
              </div>

              {tab === 'register' && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: dark ? '#a1a1aa' : '#52525b', display: 'block', marginBottom: 6 }}>Роль аккаунта</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {(['student', 'teacher'] as const).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        style={{
                          padding: '9px 0', borderRadius: 10, fontSize: 12, fontWeight: 700,
                          cursor: 'pointer', fontFamily: 'inherit',
                          background: role === r ? 'rgba(59,130,246,0.12)' : 'transparent',
                          border: role === r ? '1px solid rgba(59,130,246,0.35)' : `1px solid ${dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.1)'}`,
                          color: role === r ? '#60a5fa' : dark ? '#71717a' : '#64748b',
                        }}
                      >
                        {r === 'student' ? '🎓 Студент' : '👨‍🏫 Преподаватель'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CANCEL & SAVE BUTTONS */}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="btn btn-ghost"
                  style={{ flex: 1, padding: 10, fontSize: 13 }}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleAddAccountSubmit}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 2, padding: 10, fontSize: 13 }}
                >
                  {loading ? 'Добавление...' : (tab === 'login' ? 'Войти в аккаунт' : 'Создать и войти')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MOBILE BOTTOM TAB BAR ─── */}
      <nav className="nav-mobile-bottom">
        {currentUser.role === 'student' && (
          <>
            <button className={`mobile-tab-btn ${currentPage === 'landing' ? 'active' : ''}`} onClick={() => onNavigate('landing')}>
              <Globe size={18} />
              <span>Главная</span>
            </button>
            <button className={`mobile-tab-btn ${currentPage === 'catalog' ? 'active' : ''}`} onClick={() => onNavigate('catalog')}>
              <BookOpen size={18} />
              <span>Каталог</span>
            </button>
            <button className={`mobile-tab-btn ${currentPage === 'student-dashboard' ? 'active' : ''}`} onClick={() => onNavigate('student-dashboard')}>
              <GraduationCap size={18} />
              <span>Обучение</span>
            </button>
            <button className={`mobile-tab-btn ${currentPage === 'lesson' ? 'active' : ''}`} onClick={() => onNavigate('lesson')}>
              <PlayCircle size={18} />
              <span>Урок & Тест</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
}
