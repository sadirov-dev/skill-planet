import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Star, Users, Clock, ChevronRight, BookOpen, Sparkles, ArrowRight, Play, CheckCircle, RefreshCw, Filter, Layers, MessageSquare, Headphones, FileText, Edit3, Book, Award } from 'lucide-react';
import { mockCourses, getSavedCourses, saveEnrollment } from '../data/mock';
import { fetchLiveKgsRate, formatPriceKGS, type ExchangeRateData } from '../utils/currency';
import type { Course, CourseLevel, SkillType } from '../types';

interface Props { theme: 'dark' | 'light'; onNavigate: (p: string) => void; }

const CATEGORY_TAGS = ['Все', 'Языки', 'IT & AI', 'Шахматы'];
const LEVEL_FILTERS: { label: string; value: CourseLevel | 'All'; color: string }[] = [
  { label: 'Все уровни', value: 'All', color: 'badge-white' },
  { label: 'Beginner (A1)', value: 'Beginner', color: 'badge-green' },
  { label: 'Elementary (A2)', value: 'Elementary', color: 'badge-blue' },
  { label: 'Pre-Intermediate (B1)', value: 'Pre-Intermediate', color: 'badge-violet' },
  { label: 'Intermediate (B2)', value: 'Intermediate', color: 'badge-amber' },
  { label: 'Upper-Intermediate', value: 'Upper-Intermediate', color: 'badge-red' },
  { label: 'Advanced (C1)', value: 'Advanced', color: 'badge-violet' },
];

function getSkillIcon(skill?: SkillType) {
  switch (skill) {
    case 'Grammar': return <Layers size={13} color="#a78bfa" />;
    case 'Reading': return <Book size={13} color="#60a5fa" />;
    case 'Listening': return <Headphones size={13} color="#fbbf24" />;
    case 'Speaking': return <MessageSquare size={13} color="#34d399" />;
    case 'Writing': return <Edit3 size={13} color="#f87171" />;
    case 'Vocabulary': return <FileText size={13} color="#38bdf8" />;
    case 'Homework': return <Award size={13} color="#f59e0b" />;
    default: return <BookOpen size={13} color="#60a5fa" />;
  }
}

function getSkillBadgeClass(skill?: SkillType) {
  switch (skill) {
    case 'Grammar': return 'badge-violet';
    case 'Reading': return 'badge-blue';
    case 'Listening': return 'badge-amber';
    case 'Speaking': return 'badge-green';
    case 'Writing': return 'badge-red';
    case 'Vocabulary': return 'badge-blue';
    case 'Homework': return 'badge-amber';
    default: return 'badge-white';
  }
}

function CourseModal({ course, theme, rate, onClose, onEnroll }: { course: Course; theme: string; rate: number; onClose: () => void; onEnroll: () => void; }) {
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | 'All'>('All');
  const [expandedMod, setExpandedMod] = useState<string | null>(course.curriculum[0]?.id || null);
  const priceFormatted = formatPriceKGS(course.price, rate);

  const filteredCurriculum = useMemo(() => {
    if (selectedLevel === 'All') return course.curriculum;
    return course.curriculum.filter(m => !m.level || m.level === selectedLevel);
  }, [course.curriculum, selectedLevel]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
        {/* Banner image */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
          <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(9,9,11,0.95) 100%)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} />
          </button>
          <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
              <span className="badge badge-green">{course.level}</span>
              {course.levelsSupported && (
                <span className="badge badge-violet">Многоуровневый курс (A1-C1)</span>
              )}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{course.title}</h2>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 20 }}>{course.description}</p>

          {/* Stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
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

          {/* Filter Curriculum by Levels */}
          {course.levelsSupported && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
                Фильтр программы по уровням:
              </div>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                <button className={`tag-filter ${selectedLevel === 'All' ? 'active' : ''}`} onClick={() => setSelectedLevel('All')}>
                  Все уровни ({course.curriculum.length})
                </button>
                {course.levelsSupported.map(lvl => (
                  <button key={lvl} className={`tag-filter ${selectedLevel === lvl ? 'active' : ''}`} onClick={() => setSelectedLevel(lvl)}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum Modules divided by Skill Subdivisions */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f4f4f5', marginBottom: 12 }}>
              Структурированная программа по уровням и задачам
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredCurriculum.map(mod => (
                <div key={mod.id} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <button onClick={() => setExpandedMod(expandedMod === mod.id ? null : mod.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: '#f4f4f5', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                      {getSkillIcon(mod.skillType)}
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{mod.title}</span>
                      {mod.skillType && (
                        <span className={`badge ${getSkillBadgeClass(mod.skillType)}`} style={{ fontSize: 10 }}>
                          {mod.skillType}
                        </span>
                      )}
                    </div>
                    <ChevronRight size={14} style={{ color: '#71717a', transform: expandedMod === mod.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {expandedMod === mod.id && (
                    <div style={{ padding: '8px 16px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {mod.lessons.map(l => (
                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#a1a1aa', padding: '6px 0' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {getSkillIcon(l.skillType)}
                            <span>{l.title}</span>
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {l.skillType && <span style={{ fontSize: 10, color: '#71717a' }}>[{l.skillType}]</span>}
                            <span style={{ fontSize: 11, color: '#52525b' }}>{l.duration}</span>
                          </div>
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
  const [activeCategory, setActiveCategory] = useState('Все');
  const [activeLevel, setActiveLevel] = useState<CourseLevel | 'All'>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [rateData, setRateData] = useState<ExchangeRateData>({ rate: 89.50, lastUpdated: '', isLive: false });
  const dark = theme === 'dark';

  useEffect(() => {
    fetchLiveKgsRate().then(data => setRateData(data));
    const interval = setInterval(() => {
      fetchLiveKgsRate().then(data => setRateData(data));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    return mockCourses.filter(c => {
      const matchCat = activeCategory === 'Все' || c.category === activeCategory;
      const matchLvl = activeLevel === 'All' || c.level === activeLevel || (c.levelsSupported && c.levelsSupported.includes(activeLevel));
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.teacherName.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchLvl && matchSearch;
    });
  }, [search, activeCategory, activeLevel]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 96, background: dark ? '#09090b' : '#f8fafc' }}>

      {/* Header Search & Level Filters */}
      <div style={{ position: 'sticky', top: 56, zIndex: 40, background: dark ? 'rgba(9,9,11,0.9)' : 'rgba(248,250,252,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`, padding: '12px 20px' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            {/* Search Input */}
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: dark ? '#52525b' : '#94a3b8' }} />
              <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по уровням, предметам, Грамматике..." style={{ paddingLeft: 36, paddingRight: search ? 36 : 14 }} />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORY_TAGS.map(t => (
                <button key={t} className={`tag-filter ${activeCategory === t ? 'active' : ''}`} onClick={() => setActiveCategory(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter Tabs */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#71717a', alignSelf: 'center', marginRight: 4 }}>Уровень:</span>
            {LEVEL_FILTERS.map(lvl => (
              <button key={lvl.value} className={`tag-filter ${activeLevel === lvl.value ? 'active' : ''}`} onClick={() => setActiveLevel(lvl.value)}>
                {lvl.label}
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
              Найдено {filtered.length} многоуровневых курсов · Разделение на <strong style={{ color: '#a78bfa' }}>Grammar, Reading, Listening, Speaking, Writing, Vocabulary</strong>
            </p>
          </div>

          {/* Live Rate Ticker */}
          <div style={{ padding: '8px 14px', borderRadius: 12, background: dark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399' }}>
              Курс USD/KGS: 1 $ = {rateData.rate} сом
            </span>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid-3">
          {filtered.map(course => {
            const priceFormatted = formatPriceKGS(course.price, rateData.rate);

            return (
              <div key={course.id} className="card card-lift" onClick={() => setSelectedCourse(course)} style={{ cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* Thumbnail */}
                <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                  <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(9,9,11,0.85) 100%)' }} />

                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                    <span className={`badge ${course.level === 'Beginner' ? 'badge-green' : course.level === 'Pro' ? 'badge-red' : 'badge-blue'}`}>
                      {course.level}
                    </span>
                    {course.levelsSupported && (
                      <span className="badge badge-violet">A1 - C1</span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a', lineHeight: 1.3, marginBottom: 6 }}>
                      {course.title}
                    </h3>

                    {/* Skill Tags Strip */}
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                      {['Grammar', 'Speaking', 'Listening', 'Writing', 'Reading', 'Vocabulary'].map(sk => (
                        <span key={sk} style={{ fontSize: 10, fontWeight: 700, color: dark ? '#a1a1aa' : '#64748b', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', padding: '2px 6px', borderRadius: 5 }}>
                          {sk}
                        </span>
                      ))}
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
                        Программа <ChevronRight size={14} />
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
        <CourseModal
          course={selectedCourse}
          theme={theme}
          rate={rateData.rate}
          onClose={() => setSelectedCourse(null)}
          onEnroll={() => {
            saveEnrollment(selectedCourse);
            setSelectedCourse(null);
            onNavigate('student-dashboard');
          }}
        />
      )}
    </div>
  );
}
