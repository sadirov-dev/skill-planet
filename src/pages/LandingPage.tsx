import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Users, BookOpen, Zap, Trophy, TrendingUp, Globe, Play, ChevronRight, Check } from 'lucide-react';
import { mockTestimonials, platformStats } from '../data/mock';

interface LandingPageProps {
  theme: 'dark' | 'light';
  onNavigate: (page: string) => void;
}

const isDarkMode = (theme: string) => theme === 'dark';

const galaxies = [
  {
    emoji: '🌐',
    title: 'Языки',
    subtitle: 'English · Arabic · French · Spanish',
    count: 32,
    accent: '#3b82f6',
    glow: 'rgba(59,130,246,0.15)',
    tags: ['English', 'Arabic', 'French'],
    students: '12.4k',
  },
  {
    emoji: '🤖',
    title: 'IT & AI',
    subtitle: 'Python · Web Dev · Machine Learning',
    count: 58,
    accent: '#8b5cf6',
    glow: 'rgba(139,92,246,0.15)',
    tags: ['Python', 'React', 'AI/ML'],
    students: '18.9k',
  },
  {
    emoji: '♟️',
    title: 'Стратегия',
    subtitle: 'Chess · Go · Strategic Thinking',
    count: 18,
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.15)',
    tags: ['Chess', 'Go', 'Logic'],
    students: '3.1k',
  },
];

const stats = [
  { value: '28.4k', label: 'Студентов' },
  { value: '148',   label: 'Курсов' },
  { value: '4.8★',  label: 'Рейтинг' },
  { value: '47',    label: 'Стран' },
  { value: '78%',   label: 'Завершают' },
];

const features = [
  { icon: Zap,        color: '#f59e0b', title: 'AI-поддержка',      desc: 'Умный ассистент отвечает на вопросы прямо во время урока в режиме реального времени.' },
  { icon: Trophy,     color: '#8b5cf6', title: 'Система наград',     desc: 'Зарабатывай бейджи и поднимайся по рейтингу — мотивация встроена в платформу.' },
  { icon: TrendingUp, color: '#3b82f6', title: 'Трекинг прогресса',  desc: 'Детальная аналитика твоего обучения. Видь рост каждый день.' },
  { icon: Globe,      color: '#10b981', title: 'Мировое сообщество', desc: 'Учись вместе с 28к+ студентами из 47 стран мира.' },
];

const LandingPage: React.FC<LandingPageProps> = ({ theme, onNavigate }) => {
  const dark = isDarkMode(theme);
  const [hovered, setHovered] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  // Animated counter
  useEffect(() => {
    const target = 28400;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => setCount(c => Math.min(c + step, target)), 20);
    return () => clearInterval(t);
  }, []);

  const T = {
    bg: dark ? '#08080c' : '#f8fafc',
    surface: dark ? 'rgba(18,18,26,0.9)' : 'rgba(255,255,255,0.9)',
    card: dark ? 'rgba(20,20,28,0.8)' : 'rgba(255,255,255,0.95)',
    border: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)',
    borderHover: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    text: dark ? '#f4f4f5' : '#0f172a',
    muted: dark ? '#71717a' : '#64748b',
    faint: dark ? '#27272a' : '#e2e8f0',
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: 'Inter, sans-serif', overflowX: 'hidden', paddingBottom: 96 }}>


      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', paddingTop: 120, paddingBottom: 100, textAlign: 'center', overflow: 'hidden' }}>
        {/* Orbs */}
        {dark && <>
          <div className="orb orb-blue" style={{ width: 500, height: 500, top: -150, left: '10%', opacity: 0.12 }} />
          <div className="orb orb-violet" style={{ width: 400, height: 400, top: -100, right: '8%', opacity: 0.1 }} />
          <div className="orb orb-cyan" style={{ width: 300, height: 300, bottom: -50, left: '40%', opacity: 0.08 }} />
        </>}
        {/* Grid */}
        <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: dark ? 1 : 0.5 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto', padding: '0 24px' }}>
          {/* Badge */}
          <div className="fade-up-1" style={{ marginBottom: 28 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 99,
              background: dark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.2)',
              color: '#60a5fa', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', display: 'inline-block', animation: 'pulseRing 1.8s ease-out infinite' }} />
              MVP v0.1 · Открыт для всех
            </span>
          </div>

          {/* Logo image floating */}
          <div className="fade-up-2 float" style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
            <img src="/logo.png" alt="SkillPlanet" style={{ width: 80, height: 80, borderRadius: 20, boxShadow: '0 0 60px rgba(59,130,246,0.3), 0 0 120px rgba(139,92,246,0.15)' }} />
          </div>

          {/* Heading */}
          <h1 className="fade-up-3" style={{
            fontSize: 'clamp(42px, 7vw, 80px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            marginBottom: 20,
            color: T.text,
          }}>
            Вселенная знаний<br />
            <span style={{ background: 'linear-gradient(135deg, #60a5fa 20%, #a78bfa 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              в одной платформе
            </span>
          </h1>

          {/* Subtitle */}
          <p className="fade-up-4" style={{
            fontSize: 18, lineHeight: 1.7, color: T.muted,
            maxWidth: 560, margin: '0 auto 36px',
            fontWeight: 400,
          }}>
            Изучай языки, IT и стратегические игры с лучшими преподавателями.
            AI-ассистент, живые сессии, сертификаты.
          </p>

          {/* CTAs */}
          <div className="fade-up-5" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 60 }}>
            <button className="btn btn-lg btn-primary" onClick={() => onNavigate('auth')}>
              Начать бесплатно <ArrowRight size={18} />
            </button>
            <button className="btn btn-lg btn-ghost" onClick={() => onNavigate('catalog')}>
              <Play size={15} style={{ color: '#60a5fa' }} /> Смотреть курсы
            </button>
          </div>

          {/* Stats strip */}
          <div className="fade-up-6" style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0,
            borderRadius: 18,
            background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
            border: `1px solid ${T.border}`,
            overflow: 'hidden',
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                flex: '1 1 100px',
                padding: '16px 20px',
                textAlign: 'center',
                borderRight: i < stats.length - 1 ? `1px solid ${T.border}` : 'none',
              }}>
                <div style={{
                  fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALAXIES ─── */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-tag">🌌 Галактики знаний</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-0.03em', color: T.text }}>
            Выбери свой путь
          </h2>
          <p style={{ color: T.muted, marginTop: 8, fontSize: 16 }}>Три направления — безграничные возможности</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {galaxies.map((g, i) => (
            <div
              key={i}
              onClick={() => onNavigate('catalog')}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                cursor: 'pointer',
                borderRadius: 20,
                border: `1px solid ${hovered === i ? g.accent + '40' : T.border}`,
                background: hovered === i
                  ? (dark ? `rgba(20,20,28,0.95)` : 'rgba(255,255,255,0.98)')
                  : T.card,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: 28,
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                transform: hovered === i ? 'translateY(-4px)' : 'none',
                boxShadow: hovered === i ? `0 24px 60px rgba(0,0,0,0.3), 0 0 0 1px ${g.accent}30` : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glow */}
              {hovered === i && (
                <div style={{
                  position: 'absolute', top: -40, right: -40,
                  width: 160, height: 160, borderRadius: '50%',
                  background: g.glow,
                  filter: 'blur(40px)',
                  pointerEvents: 'none',
                }} />
              )}

              <div style={{ fontSize: 40, marginBottom: 16 }}>{g.emoji}</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: T.text }}>{g.title}</h3>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '3px 10px',
                  borderRadius: 99, background: g.accent + '18', color: g.accent,
                  border: `1px solid ${g.accent}30`,
                }}>
                  {g.count} курсов
                </span>
              </div>
              <p style={{ fontSize: 14, color: T.muted, marginBottom: 16, lineHeight: 1.5 }}>{g.subtitle}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                {g.tags.map(t => (
                  <span key={t} style={{
                    fontSize: 12, padding: '4px 10px', borderRadius: 8, fontWeight: 600,
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: T.muted, border: `1px solid ${T.border}`,
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.muted, fontSize: 13 }}>
                  <Users size={14} />
                  <span>{g.students} студентов</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: g.accent, fontSize: 13, fontWeight: 700 }}>
                  Смотреть
                  <ChevronRight size={15} style={{ transition: 'transform 0.2s', transform: hovered === i ? 'translateX(3px)' : 'none' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: '80px 24px', background: dark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.02)', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-tag">⚡ Почему SkillPlanet</div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, letterSpacing: '-0.03em', color: T.text }}>
              Образование нового поколения
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{
                  padding: 24, borderRadius: 18,
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  backdropFilter: 'blur(20px)',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = f.color + '40'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = T.border; }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                    background: f.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${f.color}25`,
                  }}>
                    <Icon size={20} color={f.color} />
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 8, color: T.text, letterSpacing: '-0.02em' }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-tag">💬 Отзывы</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, letterSpacing: '-0.03em', color: T.text }}>
            Студенты говорят
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {mockTestimonials.map((t: any) => (
            <div key={t.id} style={{
              padding: 24, borderRadius: 18,
              background: T.card,
              border: `1px solid ${T.border}`,
              backdropFilter: 'blur(20px)',
              transition: 'transform 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = T.border; }}
            >
              <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: dark ? '#a1a1aa' : '#475569', marginBottom: 18, fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    objectFit: 'cover',
                    border: `1px solid ${T.border}`,
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{ padding: '0 24px', maxWidth: 1200, margin: '0 auto', marginBottom: 16 }}>
        <div style={{
          borderRadius: 24, padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          background: dark
            ? 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          border: dark ? '1px solid rgba(59,130,246,0.2)' : 'none',
        }}>
          {dark && <>
            <div className="orb orb-blue" style={{ width: 300, height: 300, top: -100, right: -50, opacity: 0.15 }} />
            <div className="orb orb-violet" style={{ width: 200, height: 200, bottom: -60, left: 0, opacity: 0.12 }} />
          </>}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <img src="/logo.png" alt="" style={{ width: 56, height: 56, borderRadius: 14, marginBottom: 20, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }} />
            <h2 style={{
              fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900,
              letterSpacing: '-0.03em', marginBottom: 12,
              color: dark ? '#f4f4f5' : '#fff',
            }}>
              Готов стартовать? 🚀
            </h2>
            <p style={{ fontSize: 16, marginBottom: 28, color: dark ? '#71717a' : 'rgba(255,255,255,0.8)' }}>
              Присоединяйся к {count.toLocaleString()}+ студентам
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => onNavigate('auth')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 28px', borderRadius: 14, fontWeight: 700, fontSize: 15,
                  cursor: 'pointer', border: 'none', fontFamily: 'inherit',
                  background: dark ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : '#fff',
                  color: dark ? '#fff' : '#3b82f6',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)'; }}
              >
                Начать бесплатно <ArrowRight size={18} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: dark ? '#52525b' : 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                <Check size={14} color={dark ? '#10b981' : 'rgba(255,255,255,0.8)'} />
                Без кредитной карты
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        marginTop: 60, padding: '24px 24px',
        borderTop: `1px solid ${T.border}`,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.png" alt="" style={{ width: 22, height: 22, borderRadius: 6, opacity: 0.8 }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: T.muted }}>SkillPlanet v0.1</span>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {['Курсы', 'Преподаватели', 'Блог', 'Поддержка'].map(l => (
              <span key={l} style={{ fontSize: 13, color: T.muted, cursor: 'pointer', transition: 'color 0.15s', fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
                onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
                {l}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.muted }}>
            <Users size={13} />
            {platformStats.totalUsers.toLocaleString()} студентов по всему миру
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
