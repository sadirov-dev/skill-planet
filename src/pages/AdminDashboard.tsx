import React, { useState, useEffect } from 'react';
import { Users, BookOpen, DollarSign, TrendingUp, ShieldCheck, ShieldX, CheckCircle, XCircle, Search, Filter, Activity, GraduationCap, UserCheck, AlertTriangle, PhoneCall, Code2, Mail, MessageSquare, Send } from 'lucide-react';
import { mockUsers, mockCourses, mockTeachers, mockActivityLogs, platformStats, saveNewCourse } from '../data/mock';
import { Plus, X, Upload } from 'lucide-react';

interface Props { theme: 'dark' | 'light'; onNavigate: (p: string) => void; }

const stats = [
  { label: 'Всего пользователей', value: '28,400', change: '+342 за неделю', color: '#60a5fa', icon: Users },
  { label: 'Активных курсов', value: '148', change: '+8 за месяц', color: '#a78bfa', icon: BookOpen },
  { label: 'Общий доход платформы', value: '86 703 125 сом ($968,750)', change: '+23% за месяц', color: '#34d399', icon: DollarSign },
  { label: 'Средний рейтинг', value: '4.8', change: '↑ 0.1 за квартал', color: '#fbbf24', icon: TrendingUp },
];

export default function AdminDashboard({ theme, onNavigate }: Props) {
  const [tab, setTab] = useState<'analytics' | 'students' | 'teachers' | 'admins' | 'approvals' | 'support'>('analytics');
  const [search, setSearch] = useState('');
  const [banned, setBanned] = useState<Set<string>>(new Set());
  const [verified, setVerified] = useState<Set<string>>(new Set(['u1', 'u2', 'u5', 'u8']));
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  // Admin Course Creation modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('IT & AI');
  const [newPrice, setNewPrice] = useState('0');
  const [createdNotice, setCreatedNotice] = useState(false);

  const dark = theme === 'dark';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCreateModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const studentsList = mockUsers.filter(u => u.role === 'student' && (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())));
  const teachersList = mockUsers.filter(u => u.role === 'teacher' && (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())));
  const adminsList = mockUsers.filter(u => u.role === 'admin' && (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())));

  const handleSendSupport = () => {
    if (!supportMessage.trim()) return;
    setSupportSent(true);
    setTimeout(() => {
      setSupportMessage('');
      setSupportSent(false);
    }, 2500);
  };

  return (
    <div className="dash-wrap" style={{ background: dark ? '#09090b' : '#f8fafc' }}>
      <div className="dash-content">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <div>
            <span className="section-label">🛡️ Кабинет Главного Администратора</span>
            <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 900, letterSpacing: '-0.03em', color: dark ? '#f4f4f5' : '#0f172a', marginTop: 4 }}>
              Центр Управления Платформой
            </h1>
            <p style={{ fontSize: 13, color: dark ? '#71717a' : '#64748b', marginTop: 2 }}>
              Полный контроль пользователей, аналитики, списков учителей/учеников и обращений к разработчикам
            </p>
          </div>
          <button className="btn btn-md btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Добавить новый курс
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs" style={{ flexWrap: 'wrap' }}>
          <button className={`tab ${tab === 'analytics' ? 'active' : ''}`} onClick={() => setTab('analytics')}>📊 Аналитика</button>
          <button className={`tab ${tab === 'students' ? 'active' : ''}`} onClick={() => setTab('students')}>🎓 Список Учеников ({studentsList.length})</button>
          <button className={`tab ${tab === 'teachers' ? 'active' : ''}`} onClick={() => setTab('teachers')}>👨‍🏫 Список Учителей ({teachersList.length})</button>
          <button className={`tab ${tab === 'admins' ? 'active' : ''}`} onClick={() => setTab('admins')}>🛡️ Администраторы ({adminsList.length})</button>
          <button className={`tab ${tab === 'approvals' ? 'active' : ''}`} onClick={() => setTab('approvals')}>⚡ Модерация курсов (1)</button>
          <button className={`tab ${tab === 'support' ? 'active' : ''}`} onClick={() => setTab('support')}>📞 Связь с разработчиком</button>
        </div>

        {/* Tab 1: Global Analytics */}
        {tab === 'analytics' && (
          <>
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

            {/* Growth Chart */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a', marginBottom: 20 }}>
                Динамика посещений и активности платформы (Июль 2026)
              </h3>
              <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', gap: 6, paddingBottom: 10 }}>
                {[45, 60, 52, 78, 90, 65, 84, 92, 70, 88, 95, 100, 82, 91, 88, 96, 75, 89, 94, 98, 88, 92, 96, 100].map((h, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${h}%` }} title={`День ${i+1}: ${h * 3} активных`} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#71717a', paddingTop: 10, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                <span>1 июля</span>
                <span>Июль 2026</span>
                <span>30 июля</span>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Students List */}
        {tab === 'students' && (
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                <input className="input" placeholder="Поиск среди учеников..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Студент</th>
                    <th>Баллы (XP)</th>
                    <th>Дата регистрации</th>
                    <th>Статус верификации</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsList.map(u => {
                    const isBanned = banned.has(u.id);
                    const isVer = verified.has(u.id);
                    return (
                      <tr key={u.id} style={{ opacity: isBanned ? 0.4 : 1 }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={u.avatar || '/images/avatar_teacher2.jpg'} alt="" className="avatar" style={{ width: 32, height: 32 }} />
                            <div>
                              <div style={{ fontWeight: 700, color: dark ? '#f4f4f5' : '#0f172a' }}>{u.name}</div>
                              <div style={{ fontSize: 11, color: '#71717a' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><strong style={{ color: '#60a5fa' }}>{u.xp || 1200} XP</strong></td>
                        <td style={{ color: '#71717a', fontSize: 12 }}>{u.joinedAt}</td>
                        <td>
                          {isVer ? <span className="badge badge-green"><CheckCircle size={10} /> Подтверждён</span> : <span className="badge badge-white">Обычный</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-sm btn-ghost" onClick={() => setVerified(p => { const n = new Set(p); n.has(u.id) ? n.delete(u.id) : n.add(u.id); return n; })}>
                              <ShieldCheck size={13} color={isVer ? '#34d399' : '#71717a'} />
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => setBanned(p => { const n = new Set(p); n.has(u.id) ? n.delete(u.id) : n.add(u.id); return n; })}>
                              <ShieldX size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Teachers List by Subject Directions */}
        {tab === 'teachers' && (
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                <input className="input" placeholder="Поиск среди преподавателей по предметам..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Преподаватель</th>
                    <th>Направление / Дисциплина</th>
                    <th>Рейтинг</th>
                    <th>Верификация</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {teachersList.map(u => {
                    const isBanned = banned.has(u.id);
                    const isVer = verified.has(u.id);
                    return (
                      <tr key={u.id} style={{ opacity: isBanned ? 0.4 : 1 }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={u.avatar || '/images/avatar_teacher1.jpg'} alt="" className="avatar" style={{ width: 32, height: 32 }} />
                            <div>
                              <div style={{ fontWeight: 700, color: dark ? '#f4f4f5' : '#0f172a' }}>{u.name}</div>
                              <div style={{ fontSize: 11, color: '#71717a' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-violet">{u.subject || 'IT & AI / Языки'}</span></td>
                        <td>★ 4.9 (1,200+ студентов)</td>
                        <td>
                          {isVer ? <span className="badge badge-green"><CheckCircle size={10} /> Подтверждён</span> : <span className="badge badge-amber">Ожидает проверки</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-sm btn-ghost" onClick={() => setVerified(p => { const n = new Set(p); n.has(u.id) ? n.delete(u.id) : n.add(u.id); return n; })}>
                              <ShieldCheck size={13} color={isVer ? '#34d399' : '#71717a'} />
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => setBanned(p => { const n = new Set(p); n.has(u.id) ? n.delete(u.id) : n.add(u.id); return n; })}>
                              <ShieldX size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Admins List */}
        {tab === 'admins' && (
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a', marginBottom: 16 }}>
              🛡️ Список Администраторов Платформы
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Администратор</th>
                    <th>Роль</th>
                    <th>Дата присоединения</th>
                    <th>Доступ</th>
                  </tr>
                </thead>
                <tbody>
                  {adminsList.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={u.avatar || '/images/avatar_teacher3.jpg'} alt="" className="avatar" style={{ width: 32, height: 32 }} />
                          <div>
                            <div style={{ fontWeight: 700, color: dark ? '#f4f4f5' : '#0f172a' }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: '#71717a' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-amber">Super Admin</span></td>
                      <td style={{ color: '#71717a', fontSize: 12 }}>{u.joinedAt}</td>
                      <td><span className="badge badge-green">Полный доступ</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Approvals */}
        {tab === 'approvals' && (
          <div className="grid-1">
            <h3 style={{ fontSize: 16, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a', marginBottom: 14 }}>
              👨‍🏫 Заявки на получение статуса Преподавателя
            </h3>

            {(() => {
              const pending: any[] = JSON.parse(localStorage.getItem('skillplanet_pending_teachers') || '[]');
              if (pending.length === 0) {
                return (
                  <div className="card" style={{ padding: 24, textAlign: 'center', color: '#71717a' }}>
                    Новых заявок от учителей пока нет ☕
                  </div>
                );
              }
              return pending.map((reqItem: any) => (
                <div key={reqItem.id} className="card" style={{ padding: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <img src="/images/avatar_teacher1.jpg" alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>{reqItem.name}</h4>
                      <div style={{ fontSize: 12, color: dark ? '#71717a' : '#64748b' }}>{reqItem.email} · Подано: {reqItem.requestedAt || 'Сегодня'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        // Approve Teacher
                        try {
                          const savedAccs: any[] = JSON.parse(localStorage.getItem('skillplanet_saved_accounts_v1') || '[]');
                          const updated = savedAccs.map(a => a.id === reqItem.id ? { ...a, role: 'teacher', teacherPending: false, roleTitle: 'Преподаватель', badgeColor: 'badge-violet', defaultPage: 'teacher-dashboard' } : a);
                          localStorage.setItem('skillplanet_saved_accounts_v1', JSON.stringify(updated));

                          const remaining = pending.filter(p => p.id !== reqItem.id);
                          localStorage.setItem('skillplanet_pending_teachers', JSON.stringify(remaining));

                          alert(`Статус Преподавателя официально подтвержден для ${reqItem.name}!`);
                          window.location.reload();
                        } catch {}
                      }}
                    >
                      <CheckCircle size={13} /> ✓ Подтвердить статус Учителя
                    </button>
                  </div>
                </div>
              ));
            })()}

            <h3 style={{ fontSize: 16, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a', margin: '20px 0 14px' }}>
              📚 Курсы на модерации
            </h3>
            <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img src="/images/course_go.jpg" alt="" style={{ width: 64, height: 48, borderRadius: 10, objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>Go: Стратегическое мышление</h3>
                  <div style={{ fontSize: 12, color: dark ? '#71717a' : '#64748b', marginTop: 2 }}>Санжар Тошматов · Шахматы / Игра Го</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-sm btn-success"><CheckCircle size={13} /> Одобрить</button>
                <button className="btn btn-sm btn-danger"><XCircle size={13} /> Отклонить</button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Contact Developer & Tech Support */}
        {tab === 'support' && (
          <div className="card" style={{ padding: 28, maxWidth: 640 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Code2 size={22} color="#60a5fa" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: dark ? '#f4f4f5' : '#0f172a' }}>Связаться с Разработчиком</h3>
                <p style={{ fontSize: 13, color: dark ? '#71717a' : '#64748b' }}>Прямой канал технической поддержки платформы SkillPlanet</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#71717a', display: 'block', marginBottom: 4 }}>Тема обращения / Баг-репорт</label>
                <input className="input" placeholder="Например: Запрос на обновление модуля аналитики..." />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#71717a', display: 'block', marginBottom: 4 }}>Сообщение для команды разработки</label>
                <textarea className="input" rows={4} value={supportMessage} onChange={e => setSupportMessage(e.target.value)} placeholder="Опишите ваши технические пожелания или вопросы..." />
              </div>

              {supportSent ? (
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
                  ✓ Сообщение успешно отправлено ведущему разработчику!
                </div>
              ) : (
                <button className="btn btn-lg btn-primary" onClick={handleSendSupport}>
                  <Send size={16} /> Отправить сообщение разработчику
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Admin Create Course Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>Создать и опубликовать курс (Админ)</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#71717a', display: 'block', marginBottom: 4 }}>Название курса</label>
                <input className="input" placeholder="Например: Продвинутый курс по веб-безопасности" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#71717a', display: 'block', marginBottom: 4 }}>Категория</label>
                <select className="input" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                  <option value="IT & AI">IT & AI</option>
                  <option value="Языки">Языки</option>
                  <option value="Шахматы">Шахматы</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#71717a', display: 'block', marginBottom: 4 }}>Стоимость ($)</label>
                <input className="input" type="number" placeholder="0 для бесплатного" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
              </div>

              <div className="upload-zone">
                <Upload size={24} color="#60a5fa" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: 13, fontWeight: 600, color: dark ? '#f4f4f5' : '#0f172a' }}>Загрузить материалы курса (.mp4 / .pdf)</p>
              </div>

              {createdNotice ? (
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
                  ✓ Курс моментально опубликован на платформе!
                </div>
              ) : (
                <button
                  className="btn btn-lg btn-primary"
                  onClick={() => {
                    if (!newTitle.trim()) return;
                    saveNewCourse({
                      title: newTitle.trim(),
                      category: newCategory,
                      price: parseFloat(newPrice) || 0,
                      teacherName: 'Абдуллох Садиров (Admin)',
                      teacherAvatar: '/images/avatar_teacher3.jpg',
                    });
                    setCreatedNotice(true);
                    setTimeout(() => {
                      setShowCreateModal(false);
                      setCreatedNotice(false);
                      setNewTitle('');
                    }, 1200);
                  }}
                >
                  Опубликовать на платформе
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
