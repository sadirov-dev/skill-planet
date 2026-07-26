import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Star, Users, Clock, ChevronRight, BookOpen, Sparkles, ArrowRight, Play, CheckCircle, RefreshCw } from 'lucide-react';
import { mockCourses } from '../data/mock';
import { fetchLiveKgsRate, formatPriceKGS, type ExchangeRateData } from '../utils/currency';
import type { Course } from '../types';

interface Props { theme: 'dark' | 'light'; onNavigate: (p: string) => void; }

const TAGS = ['Все', 'Языки', 'IT & AI', 'Шахматы'];

function CourseModal({ course, theme, rate, onClose, onEnroll }: { course: Course; theme: string; rate: number; onClose: () => void; onEnroll: () => void; }) {
  const [expandedMod, setExpandedMod] = useState<string | null>(course.curriculum[0]?.id || null);
  const priceFormatted = formatPriceKGS(course.price, rate);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Banner image */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
          <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(9,9,11,0.95) 100%)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} />
          </button>
          <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
            <span className={`badge ${course.level === 'Beginner' ? 'badge-green' : course.level === 'Pro' ? 'badge-red' : 'badge-blue'}`} style={{ marginBottom: 6 }}>
              {course.level}
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{course.title}</h2>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 20 }}>{course.description}</p>

          {/* Stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={14} className="star" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f4f4f5' }}>{course.rating}</span>
              <span style={{ fontSize: 12, color: '#71717a' }}>({course.reviewCount.toLocaleString()})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#a1a1aa' }}>
              <Users size={14} /> {course.studentsCount.toLocaleString()} студентов
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#a1a1aa' }}>
              <Clock size={14} /> {course.duration}
            </div>
          </div>

          {/* Teacher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <img src={course.teacherAvatar || '/images/avatar_teacher1.png'} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f4f4f5' }}>{course.teacherName}</div>
              <div style={{ fontSize: 11, color: '#71717a' }}>Преподаватель курса</div>
            </div>
          </div>

          {/* Curriculum */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f4f4f5', marginBottom: 12 }}>Программа курса</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {course.curriculum.map(mod => (
                <div key={mod.id} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <button onClick={() => setExpandedMod(expandedMod === mod.id ? null : mod.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: '#f4f4f5', textAlign: 'left' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{mod.title}</span>
                    <span style={{ fontSize: 12, color: '#71717a', marginRight: 8 }}>{mod.lessons.length} уроков</span>
                    <ChevronRight size={14} style={{ color: '#71717a', transform: expandedMod === mod.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {expandedMod === mod.id && (
                    <div style={{ padding: '8px 16px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {mod.lessons.map(l => (
                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#a1a1aa', padding: '4px 0' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Play size={11} style={{ color: '#60a5fa' }} /> {l.title}
                          </span>
                          <span style={{ fontSize: 11, color: '#52525b' }}>{l.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-xl btn-primary" style={{ width: '100%' }} onClick={onEnroll}>
            {course.priceType === 'free' ? 'Записаться бесплатно ($0)' : `Записаться — ${priceFormatted.full}`}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage({ theme, onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('Все');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [rateData, setRateData] = useState<ExchangeRateData>({ rate: 89.50, lastUpdated: '', isLive: false });
  const dark = theme === 'dark';

  useEffect(() => {
    fetchLiveKgsRate().then(data => setRateData(data));
    const interval = setInterval(() => {
      fetchLiveKgsRate().then(data => setRateData(data));
    }, 30000); // Live poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    return mockCourses.filter(c => {
      const matchTag = activeTag === 'Все' || c.category === activeTag;
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.teacherName.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchTag && matchSearch;
    });
  }, [search, activeTag]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 96, background: dark ? '#09090b' : '#f8fafc' }}>

      {/* Search Header Bar */}
      <div style={{ position: 'sticky', top: 56, zIndex: 40, background: dark ? 'rgba(9,9,11,0.9)' : 'rgba(248,250,252,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`, padding: '12px 20px' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
          {/* Search Input */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: dark ? '#52525b' : '#94a3b8' }} />
            <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск курсов, авторов, технологий..." style={{ paddingLeft: 36, paddingRight: search ? 36 : 14 }} />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TAGS.map(t => (
              <button key={t} className={`tag-filter ${activeTag === t ? 'active' : ''}`} onClick={() => setActiveTag(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
          <div>
            <span className="section-label">📚 Каталог курсов</span>
            <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, letterSpacing: '-0.03em', color: dark ? '#f4f4f5' : '#0f172a', marginTop: 6 }}>
              Вселенная знаний
            </h1>
            <p style={{ fontSize: 14, color: dark ? '#71717a' : '#64748b', marginTop: 4 }}>
              Найдено {filtered.length} курсов · Цены пересчитываются по <strong style={{ color: '#60a5fa' }}>живому курсу Кыргызского сома (KGS / сом)</strong>
            </p>
          </div>

          {/* Live KGS Exchange Rate Indicator Ticker */}
          <div style={{ padding: '8px 14px', borderRadius: 12, background: dark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulseRing 1.8s ease-out infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399' }}>
              Курс USD/KGS: 1 $ = {rateData.rate} сом
            </span>
            <span style={{ fontSize: 10, color: '#a1a1aa' }}>({rateData.isLive ? 'Real-Time Live' : 'Обновлено'})</span>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid-3">
          {filtered.map(course => {
            const priceFormatted = formatPriceKGS(course.price, rateData.rate);

            return (
              <div key={course.id} className="card card-lift" onClick={() => setSelectedCourse(course)} style={{ cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* Real Thumbnail Image */}
                <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                  <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(9,9,11,0.85) 100%)' }} />

                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                    <span className={`badge ${course.level === 'Beginner' ? 'badge-green' : course.level === 'Pro' ? 'badge-red' : 'badge-blue'}`}>
                      {course.level}
                    </span>
                  </div>

                  {course.priceType === 'free' && (
                    <span className="badge badge-blue" style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(59,130,246,0.85)', color: '#fff', border: 'none' }}>
                      FREE
                    </span>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                      {course.tags.slice(0, 2).map(t => (
                        <span key={t} style={{ fontSize: 11, fontWeight: 600, color: dark ? '#71717a' : '#64748b', background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: 6 }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3 style={{ fontSize: 15, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a', lineHeight: 1.3, marginBottom: 6, letterSpacing: '-0.01em' }}>
                      {course.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <img src={course.teacherAvatar || '/images/avatar_teacher1.png'} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ fontSize: 12, color: dark ? '#a1a1aa' : '#64748b', fontWeight: 500 }}>{course.teacherName}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: dark ? '#71717a' : '#64748b', paddingBottom: 12, borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={13} className="star" /> <strong style={{ color: dark ? '#f4f4f5' : '#0f172a' }}>{course.rating}</strong>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Users size={13} /> {course.studentsCount.toLocaleString()}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} /> {course.duration}
                      </span>
                    </div>

                    {/* Kyrgyzstani Som & USD Real-Time Price Display */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }}>
                      <div>
                        {course.priceType === 'free' ? (
                          <span style={{ fontSize: 15, fontWeight: 900, color: '#34d399' }}>Бесплатно ($0)</span>
                        ) : (
                          <div>
                            <span style={{ fontSize: 15, fontWeight: 900, color: dark ? '#f4f4f5' : '#0f172a' }}>
                              {priceFormatted.som}
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399', marginLeft: 6 }}>
                              ({priceFormatted.usd})
                            </span>
                          </div>
                        )}
                      </div>

                      <span style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 2 }}>
                        Подробнее <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCourse && (
        <CourseModal course={selectedCourse} theme={theme} rate={rateData.rate} onClose={() => setSelectedCourse(null)} onEnroll={() => { setSelectedCourse(null); onNavigate('student-dashboard'); }} />
      )}
    </div>
  );
}
