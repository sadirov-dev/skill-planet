import React, { useState } from 'react';
import { Users, BookOpen, Star, Plus, X, Send, Check, ChevronRight, TrendingUp, Upload, FileText, MessageSquare, Clock, Edit2, Play, Eye, HelpCircle } from 'lucide-react';
import { mockSubmissions, mockTeachers, mockCourses } from '../data/mock';
import type { Course } from '../types';

interface Props { theme: 'dark' | 'light'; onNavigate: (p: string) => void; }

const stats = [
  { label: 'Моих активных студентов', value: '247', change: '+12 за неделю', color: '#60a5fa', icon: Users },
  { label: 'Опубликовано курсов', value: '3', change: '1 на модерации', color: '#a78bfa', icon: BookOpen },
  { label: 'Средняя оценка курса', value: '4.85', change: '↑ 0.05 за месяц', color: '#fbbf24', icon: Star },
  { label: 'Доход за месяц', value: '588 910 сом ($6,580)', change: '+18% к прошлому месяцу', color: '#34d399', icon: TrendingUp },
];

export default function TeacherDashboard({ theme, onNavigate }: Props) {
  const [tab, setTab] = useState<'overview' | 'my-students' | 'homework'>('overview');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [grade, setGrade] = useState('');
  const [gradedIds, setGradedIds] = useState<Set<string>>(new Set());

  // Create course form state
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('IT & AI');
  const [newCoursePrice, setNewCoursePrice] = useState('0');
  const [newCourseVideo, setNewCourseVideo] = useState('');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [createdNotice, setCreatedNotice] = useState(false);

  const dark = theme === 'dark';

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setEditTitle(course.title);
    setEditDesc(course.description);
  };

  const handleSaveNewCourse = () => {
    if (!newCourseTitle.trim()) return;
    setCreatedNotice(true);
    setTimeout(() => {
      setShowModal(false);
      setCreatedNotice(false);
      setNewCourseTitle('');
    }, 1500);
  };

  return (
    <div className="dash-wrap" style={{ background: dark ? '#09090b' : '#f8fafc' }}>
      <div className="dash-content">
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <div>
            <span className="section-label">👨‍🏫 Изолированный Кабинет Преподавателя</span>
            <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 900, letterSpacing: '-0.03em', color: dark ? '#f4f4f5' : '#0f172a', marginTop: 4 }}>
              Малика Рашидова
            </h1>
            <p style={{ fontSize: 13, color: dark ? '#71717a' : '#64748b' }}>Направление: English Business & Tech Communication</p>
          </div>
          <button className="btn btn-md btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Создать новый курс
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="card stat-card">
                <div className="stat-card__icon" style={{ background: s.color + '15', border: `1px solid ${s.color}30` }}>
                  <Icon size={18} color={s.color} />
                </div>
                <div className="stat-card__value" style={{ color: dark ? '#f4f4f5' : '#0f172a' }}>{s.value}</div>
                <div className="stat-card__label">{s.label}</div>
                <div className="stat-card__change" style={{ color: s.color }}>{s.change}</div>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>📚 Управление видеоуроками и тестами</button>
          <button className={`tab ${tab === 'homework' ? 'active' : ''}`} onClick={() => setTab('homework')}>✍️ Проверка работ учеников ({mockSubmissions.length})</button>
          <button className={`tab ${tab === 'my-students' ? 'active' : ''}`} onClick={() => setTab('my-students')}>🎓 Мои записанные ученики (247)</button>
        </div>

        {/* Tab 1: My Courses, Video & Quiz Creator */}
        {tab === 'overview' && (
          <div className="grid-1">
            {mockCourses.slice(0, 3).map((c) => (
              <div key={c.id} className="card" style={{ padding: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img src={c.thumbnail} alt="" style={{ width: 80, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>{c.title}</h3>
                    <div style={{ fontSize: 12, color: dark ? '#71717a' : '#64748b', marginTop: 4 }}>
                      {c.studentsCount.toLocaleString()} записанных студентов · ★ {c.rating} · {c.duration}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="btn btn-sm btn-ghost" onClick={() => handleOpenEdit(c)}>
                    <Edit2 size={13} /> Редактировать видео и тесты
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Homework Grading */}
        {tab === 'homework' && (
          <div className="grid-1">
            {mockSubmissions.map(sub => {
              const done = gradedIds.has(sub.id);
              return (
                <div key={sub.id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src="/images/avatar_teacher2.jpg" alt="" className="avatar" style={{ width: 36, height: 36 }} />
                      <div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: dark ? '#f4f4f5' : '#0f172a' }}>{sub.studentName}</h3>
                        <div style={{ fontSize: 12, color: dark ? '#71717a' : '#64748b' }}>{sub.title} · {sub.courseName}</div>
                      </div>
                    </div>
                    {done ? (
                      <span className="badge badge-green"><Check size={12} /> Оценено</span>
                    ) : (
                      <button className="btn btn-sm btn-ghost" onClick={() => setSelectedSub(selectedSub === sub.id ? null : sub.id)}>
                        <MessageSquare size={13} /> Проверить и выставить оценку
                      </button>
                    )}
                  </div>

                  {selectedSub === sub.id && !done && (
                    <div style={{ paddingTop: 16, marginTop: 12, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                      <input className="input" placeholder="Оценка (0-100)" type="number" value={grade} onChange={e => setGrade(e.target.value)} style={{ width: 140 }} />
                      <input className="input" placeholder="Комментарий учителя для ученика..." style={{ flex: 1, minWidth: 200 }} />
                      <button className="btn btn-sm btn-primary" onClick={() => { setGradedIds(p => new Set([...p, sub.id])); setSelectedSub(null); }}>
                        <Send size={13} /> Отправить
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: My Students List */}
        {tab === 'my-students' && (
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a', marginBottom: 16 }}>
              🎓 Список Учеников, записанных на ваши курсы
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Студент</th>
                    <th>Курс</th>
                    <th>Прогресс</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Алинур Каримов', email: 'alinur@gmail.com', course: 'English: Business & Tech', progress: '60%', avatar: '/images/avatar_teacher2.jpg' },
                    { name: 'Жасур Усманов', email: 'jasur@gmail.com', course: 'English: Business & Tech', progress: '35%', avatar: '/images/avatar_teacher3.jpg' },
                    { name: 'Дилноза Юлдашева', email: 'dilnoza@mail.ru', course: 'IELTS Preparation Pro', progress: '80%', avatar: '/images/avatar_teacher1.jpg' },
                  ].map((s, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={s.avatar} alt="" className="avatar" style={{ width: 32, height: 32 }} />
                          <div>
                            <div style={{ fontWeight: 700, color: dark ? '#f4f4f5' : '#0f172a' }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: '#71717a' }}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-violet">{s.course}</span></td>
                      <td><strong style={{ color: '#60a5fa' }}>{s.progress}</strong></td>
                      <td><span className="badge badge-green">Активен</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Edit Course */}
      {editingCourse && (
        <div className="modal-overlay" onClick={() => setEditingCourse(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>Редактирование видеоуроков и тестов</h2>
              <button onClick={() => setEditingCourse(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#71717a', display: 'block', marginBottom: 4 }}>Название курса</label>
                <input className="input" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#71717a', display: 'block', marginBottom: 4 }}>Описание курса</label>
                <textarea className="input" value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3} />
              </div>

              {/* Upload video section */}
              <div className="upload-zone">
                <Upload size={24} color="#60a5fa" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: 13, fontWeight: 600, color: dark ? '#f4f4f5' : '#0f172a' }}>Загрузить новые видеоуроки (.mp4)</p>
                <p style={{ fontSize: 11, color: '#71717a', marginTop: 2 }}>Файлы высокого качества 1080p</p>
              </div>

              {/* Quiz creator section */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#71717a', display: 'block', marginBottom: 4 }}>Добавить тестовый вопрос к уроку</label>
                <input className="input" placeholder="Введите вопрос для теста..." value={quizQuestion} onChange={e => setQuizQuestion(e.target.value)} />
              </div>

              <button className="btn btn-lg btn-primary" onClick={() => setEditingCourse(null)}>Сохранить изменения</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create Course */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>Конструктор нового курса</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#71717a', display: 'block', marginBottom: 4 }}>Название будущего курса</label>
                <input className="input" placeholder="Например: Продвинутый Python для веб-разработки" value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#71717a', display: 'block', marginBottom: 4 }}>Категория</label>
                <select className="input" value={newCourseCategory} onChange={e => setNewCourseCategory(e.target.value)}>
                  <option value="IT & AI">IT & AI</option>
                  <option value="Языки">Языки</option>
                  <option value="Шахматы">Шахматы</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#71717a', display: 'block', marginBottom: 4 }}>Стоимость (в ₽)</label>
                <input className="input" type="number" placeholder="0 для бесплатного" value={newCoursePrice} onChange={e => setNewCoursePrice(e.target.value)} />
              </div>

              <div className="upload-zone">
                <Upload size={24} color="#60a5fa" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: 13, fontWeight: 600, color: dark ? '#f4f4f5' : '#0f172a' }}>Загрузить первое видео урока (.mp4)</p>
              </div>

              {createdNotice ? (
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
                  ✓ Курс создан и отправлен на модерацию!
                </div>
              ) : (
                <button className="btn btn-lg btn-primary" onClick={handleSaveNewCourse}>Опубликовать курс</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
