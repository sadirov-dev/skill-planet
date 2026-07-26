import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, GitBranch, Monitor, ArrowRight, Sparkles } from 'lucide-react';

interface Props { theme: 'dark' | 'light'; onNavigate: (p: string) => void; }

export default function AuthPage({ theme, onNavigate }: Props) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [showPw, setShowPw] = useState(false);
  const dark = theme === 'dark';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 96px', position: 'relative', overflow: 'hidden', background: dark ? '#09090b' : '#f1f5f9' }}>

      {/* Orbs */}
      {dark && <>
        <div className="orb" style={{ width: 500, height: 500, background: 'rgba(59,130,246,0.14)', top: -150, left: -100, animation: 'none' }} />
        <div className="orb" style={{ width: 400, height: 400, background: 'rgba(139,92,246,0.12)', bottom: -100, right: -80, animation: 'none' }} />
      </>}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: dark ? 0.6 : 0.3 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div className="anim-1" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div onClick={() => onNavigate('landing')} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 8 }}>
            <img src="/logo.png" alt="SkillPlanet" style={{ width: 44, height: 44, borderRadius: 12, boxShadow: '0 0 30px rgba(59,130,246,0.3)' }} />
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em', color: dark ? '#f4f4f5' : '#0f172a' }}>
              Skill<span className="g-text">Planet</span>
            </span>
          </div>
          <p style={{ fontSize: 14, color: dark ? '#71717a' : '#64748b' }}>Вселенная знаний ждёт тебя 🌌</p>
        </div>

        {/* Card */}
        <div className="anim-2 card" style={{ padding: '28px 28px 32px' }}>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 24 }}>
            <button className={`tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Вход</button>
            <button className={`tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Регистрация</button>
          </div>

          {/* Social */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { icon: <Monitor size={15} style={{ color: '#60a5fa' }} />, label: 'Google' },
              { icon: <GitBranch size={15} />, label: 'GitHub' },
            ].map(s => (
              <button key={s.label} className="btn btn-md btn-ghost" style={{ justifyContent: 'center' }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="stripe" style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: dark ? '#52525b' : '#94a3b8', fontWeight: 500 }}>или с email</span>
            <div className="stripe" style={{ flex: 1 }} />
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tab === 'register' && (
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: dark ? '#52525b' : '#94a3b8' }} />
                <input className="input" placeholder="Полное имя" style={{ paddingLeft: 38 }} />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: dark ? '#52525b' : '#94a3b8' }} />
              <input className="input" type="email" placeholder="Email адрес" style={{ paddingLeft: 38 }} />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: dark ? '#52525b' : '#94a3b8' }} />
              <input className="input" type={showPw ? 'text' : 'password'} placeholder="Пароль" style={{ paddingLeft: 38, paddingRight: 42 }} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: dark ? '#52525b' : '#94a3b8', padding: 0, display: 'flex' }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Role selector */}
            {tab === 'register' && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: dark ? '#71717a' : '#64748b', marginBottom: 8 }}>Выберите роль</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {(['student', 'teacher'] as const).map(r => (
                    <button key={r} onClick={() => setRole(r)} style={{
                      padding: '11px 0', borderRadius: 11, fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
                      background: role === r ? 'rgba(59,130,246,0.12)' : 'transparent',
                      border: role === r ? '1px solid rgba(59,130,246,0.35)' : `1px solid ${dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.1)'}`,
                      color: role === r ? '#60a5fa' : dark ? '#71717a' : '#64748b',
                      boxShadow: role === r ? '0 0 0 0 rgba(59,130,246,.2)' : 'none',
                    }}>
                      {r === 'student' ? '🎓 Студент' : '👨‍🏫 Преподаватель'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === 'login' && (
              <div style={{ textAlign: 'right' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#60a5fa', fontFamily: 'inherit', fontWeight: 500 }}>
                  Забыли пароль?
                </button>
              </div>
            )}

            <button className="btn btn-lg btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={() => onNavigate('student-dashboard')}>
              {tab === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <p className="anim-3" style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: dark ? '#3f3f46' : '#94a3b8' }}>
          Регистрируясь, вы принимаете{' '}
          <span style={{ color: '#60a5fa', cursor: 'pointer' }}>Условия использования</span>
        </p>
      </div>
    </div>
  );
}
