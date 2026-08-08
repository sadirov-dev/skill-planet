import React, { useState } from 'react';
import { Flame, Trophy, Play, ArrowRight, Sparkles, TrendingUp, Calendar, CheckCircle, Circle, AlertCircle, Medal, Star, BookOpen, Award } from 'lucide-react';
import { mockEnrolled, getSavedEnrolled, mockHomework, mockBadges, mockLeaderboard } from '../data/mock';

interface Props { theme: 'dark' | 'light'; onNavigate: (p: string) => void; }

export default function StudentDashboard({ theme, onNavigate }: Props) {
  const [tab, setTab] = useState<'courses' | 'leaderboard' | 'homework' | 'badges'>('courses');
  const dark = theme === 'dark';
  const enrolledList = getSavedEnrolled();
  const primaryCourse = enrolledList[0] || mockEnrolled[0];

  return (
    <div className="dash-wrap" style={{ background: dark ? '#09090b' : '#f8fafc' }}>
      <div className="dash-content">

        {/* Student Welcome Header */}
        <div className="card" style={{ padding: '20px 18px', position: 'relative', overflow: 'hidden', background: dark ? 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)', borderColor: dark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.2)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <span className="section-label">🎓 Кабинет ученика</span>
              <h1 style={{ fontSize: 'clamp(20px,4vw,32px)', fontWeight: 900, letterSpacing: '-0.03em', color: dark ? '#f4f4f5' : '#0f172a', marginTop: 4 }}>
                Привет, Алинур! 👋
              </h1>
              <p style={{ fontSize: 13, color: dark ? '#a1a1aa' : '#64748b', marginTop: 4 }}>
                Твой текущий уровень: <strong style={{ color: '#60a5fa' }}>4,850 XP</strong> · 5 дней подряд 🔥
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ padding: '10px 16px', borderRadius: 14, background: dark ? 'rgba(245,158,11,0.12)' : '#fff', border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center', flex: 1 }}>
                <Flame size={20} color="#f59e0b" style={{ margin: '0 auto 2px' }} />
                <div style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b' }}>5</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>дней подряд</div>
              </div>
              <div style={{ padding: '10px 16px', borderRadius: 14, background: dark ? 'rgba(59,130,246,0.12)' : '#fff', border: '1px solid rgba(59,130,246,0.2)', textAlign: 'center', flex: 1 }}>
                <Trophy size={20} color="#60a5fa" style={{ margin: '0 auto 2px' }} />
                <div style={{ fontSize: 18, fontWeight: 900, color: '#60a5fa' }}>#1</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase' }}>в Лидерборде</div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning Active Banner */}
        <div className="card card-lift" onClick={() => onNavigate('lesson')} style={{ padding: '18px 16px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>Продолжить обучение</div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>{primaryCourse.title}</h2>
              <p style={{ fontSize: 12, color: dark ? '#71717a' : '#64748b', marginTop: 2 }}>Урок: {primaryCourse.nextLesson}</p>
            </div>
            <img src={primaryCourse.thumbnail} alt="" style={{ width: 54, height: 54, borderRadius: 12, objectFit: 'cover' }} />
          </div>

          <div className="prog-track">
            <div className="prog-fill" style={{ width: `${primaryCourse.progress}%` }} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 12 }}>
            <span style={{ fontSize: 12, color: dark ? '#71717a' : '#64748b' }}>{primaryCourse.completedLessons} / {primaryCourse.totalLessons} уроков ({primaryCourse.progress}%)</span>
            <button className="btn btn-sm btn-primary" style={{ width: '100%', maxWidth: 220 }}>
              <Play size={13} fill="#fff" /> Пройти урок / Тест <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Scrollable on mobile) */}
        <div className="tabs">
          <button className={`tab ${tab === 'courses' ? 'active' : ''}`} onClick={() => setTab('courses')}>📚 Мои курсы</button>
          <button className={`tab ${tab === 'leaderboard' ? 'active' : ''}`} onClick={() => setTab('leaderboard')}>🏆 Лидерборд</button>
          <button className={`tab ${tab === 'homework' ? 'active' : ''}`} onClick={() => setTab('homework')}>📝 Задания</button>
          <button className={`tab ${tab === 'badges' ? 'active' : ''}`} onClick={() => setTab('badges')}>🏅 Награды</button>
        </div>

        {/* Tab 1: Courses */}
        {tab === 'courses' && (
          <div className="grid-1">
            {enrolledList.map(course => (
              <div key={course.courseId} className="card card-lift" onClick={() => onNavigate('lesson')} style={{ padding: 16, cursor: 'pointer', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
                <img src={course.thumbnail} alt="" style={{ width: 64, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>{course.title}</h3>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#60a5fa' }}>{course.progress}%</span>
                  </div>
                  <div style={{ fontSize: 11, color: dark ? '#71717a' : '#64748b', marginBottom: 6 }}>Преподаватель: {course.teacherName}</div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Leaderboard */}
        {tab === 'leaderboard' && (
          <div className="card" style={{ padding: '20px 16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: dark ? '#f4f4f5' : '#0f172a' }}>🏆 Таблица Лидеров</h3>
                <p style={{ fontSize: 12, color: dark ? '#71717a' : '#64748b', marginTop: 2 }}>Рейтинг студентов по XP</p>
              </div>
              <span className="badge badge-amber" style={{ padding: '4px 10px', fontSize: 11 }}>
                Топ 5 Студентов
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockLeaderboard.map((lb) => (
                <div
                  key={lb.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 14,
                    background: lb.rank === 1 ? (dark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.08)') : dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    border: lb.rank === 1 ? '1px solid rgba(245,158,11,0.3)' : `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 22, fontSize: 14, fontWeight: 900, color: lb.rank === 1 ? '#f59e0b' : lb.rank === 2 ? '#a78bfa' : lb.rank === 3 ? '#60a5fa' : '#71717a', textAlign: 'center' }}>
                      #{lb.rank}
                    </div>
                    <img src={lb.avatar} alt="" className="avatar" style={{ width: 34, height: 34 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {lb.name}
                      </div>
                      <div style={{ fontSize: 11, color: dark ? '#71717a' : '#64748b' }}>
                        🔥 {lb.streak} дн
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#60a5fa' }}>{lb.xp.toLocaleString()} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Homework */}
        {tab === 'homework' && (
          <div className="grid-1">
            {mockHomework.map(hw => (
              <div key={hw.id} className="card" style={{ padding: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: dark ? '#f4f4f5' : '#0f172a' }}>{hw.title}</h3>
                  <div style={{ fontSize: 12, color: dark ? '#71717a' : '#64748b', marginTop: 2 }}>{hw.courseName} · До {hw.dueDate}</div>
                  {hw.feedback && (
                    <div style={{ fontSize: 12, color: '#34d399', marginTop: 4 }}>💬 {hw.feedback}</div>
                  )}
                </div>
                <span className={`badge ${hw.status === 'graded' ? 'badge-green' : hw.status === 'overdue' ? 'badge-red' : 'badge-amber'}`}>
                  {hw.status === 'graded' ? `Оценено: ${hw.grade}/100` : hw.status === 'submitted' ? 'На проверке' : hw.status === 'overdue' ? 'Просрочено' : 'Ожидает решения'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Badges */}
        {tab === 'badges' && (
          <div className="grid-2">
            {mockBadges.map(b => (
              <div key={b.id} className="card" style={{ padding: 16, textAlign: 'center', opacity: b.earned ? 1 : 0.4 }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>{b.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>{b.name}</h3>
                <p style={{ fontSize: 11, color: dark ? '#71717a' : '#64748b', marginTop: 2 }}>{b.description}</p>
                {b.earned && <div style={{ fontSize: 10, fontWeight: 700, color: '#34d399', marginTop: 6 }}>Получен {b.earnedAt}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
