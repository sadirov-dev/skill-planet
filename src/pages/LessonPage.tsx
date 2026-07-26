import React, { useState } from 'react';
import { CheckCircle, Circle, Play, ChevronLeft, ChevronRight, Upload, Send, Bot, X, BookOpen, Clock, HelpCircle, Award, Check, Sparkles, Loader2 } from 'lucide-react';
import { mockCourses } from '../data/mock';
import { askAiAssistant } from '../services/aiService';
import type { QuizQuestion } from '../types';

interface Props { theme: 'dark' | 'light'; onNavigate: (p: string) => void; }

export default function LessonPage({ theme, onNavigate }: Props) {
  const course = mockCourses[0];
  const [activeLesson, setActiveLesson] = useState('l3');
  const [completed, setCompleted] = useState<Set<string>>(new Set(['l1', 'l2']));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMsgs, setAiMsgs] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Привет! Я твой ИИ-Тьютор на базе Bedrock AI. Задай мне любой вопрос по коду, грамматике или тестам!' }
  ]);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const dark = theme === 'dark';
  const allLessons = course.curriculum.flatMap(m => m.lessons);
  const curLesson = allLessons.find(l => l.id === activeLesson) || allLessons[0];

  const sendAi = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const txt = aiInput;
    setAiInput('');
    setAiMsgs(p => [...p, { role: 'user', text: txt }]);
    setAiLoading(true);

    try {
      const reply = await askAiAssistant(txt, course.title);
      setAiMsgs(p => [...p, { role: 'ai', text: reply }]);
    } catch {
      setAiMsgs(p => [...p, { role: 'ai', text: 'ИИ обрабатывает запрос...' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSelectQuizOption = (qId: string, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(p => ({ ...p, [qId]: optIdx }));
  };

  const handleCalculateScore = () => {
    setQuizSubmitted(true);
    setCompleted(p => new Set([...p, curLesson.id]));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: dark ? '#09090b' : '#f8fafc' }}>
      {/* Clean Mobile-Responsive Top Bar */}
      <div style={{ height: 50, borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', background: dark ? '#0d0d12' : '#fff', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
          <button className="btn btn-sm btn-ghost" onClick={() => onNavigate('student-dashboard')} style={{ padding: '6px 10px', fontSize: 12, flexShrink: 0 }}>
            <ChevronLeft size={14} /> <span className="hidden sm:inline">Кабинет</span>
          </button>
          <span style={{ fontSize: 13, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="hidden md:inline">
            {course.title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button className={`btn btn-sm ${sidebarOpen ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setSidebarOpen(!sidebarOpen); if (aiOpen) setAiOpen(false); }} style={{ padding: '6px 10px', fontSize: 12 }}>
            <BookOpen size={14} /> <span className="hidden sm:inline">Уроки</span>
          </button>
          <button className={`btn btn-sm ${aiOpen ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setAiOpen(!aiOpen); if (sidebarOpen) setSidebarOpen(false); }} style={{ padding: '6px 10px', fontSize: 12 }}>
            <Bot size={14} /> <span className="hidden sm:inline">Bedrock AI</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Sidebar Program Overlay */}
        {sidebarOpen && (
          <div className="lesson-sidebar">
            <div style={{ padding: 16, borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>Программа и Тесты</div>
                <div className="prog-track" style={{ marginTop: 6, width: 140 }}>
                  <div className="prog-fill" style={{ width: `${Math.round((completed.size / allLessons.length) * 100)}%` }} />
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: 8 }}>
              {course.curriculum.map(mod => (
                <div key={mod.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#71717a', padding: '6px 10px', textTransform: 'uppercase' }}>{mod.title}</div>
                  {mod.lessons.map(l => (
                    <div key={l.id} onClick={() => { setActiveLesson(l.id); setQuizSubmitted(false); setSidebarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', background: l.id === activeLesson ? 'rgba(59,130,246,0.15)' : 'transparent', color: l.id === activeLesson ? '#60a5fa' : dark ? '#a1a1aa' : '#475569', fontSize: 13, fontWeight: 600 }}>
                      {completed.has(l.id) ? <CheckCircle size={15} color="#34d399" /> : l.type === 'quiz' ? <HelpCircle size={15} color="#fbbf24" /> : <Circle size={15} color="#52525b" />}
                      <span style={{ flex: 1 }}>{l.title}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lesson Main Content */}
        <div className="lesson-main" style={{ padding: '16px 14px', paddingBottom: 80 }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {curLesson.type === 'quiz' && curLesson.quiz ? (
              /* Interactive Quiz Interface */
              <div className="card" style={{ padding: '20px 16px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span className="badge badge-amber" style={{ fontSize: 11, padding: '4px 12px' }}>
                    <HelpCircle size={13} /> Интерактивное Тестирование
                  </span>
                  <span style={{ fontSize: 12, color: '#71717a' }}>+150 XP за победу</span>
                </div>

                <h2 style={{ fontSize: 'clamp(18px,3.5vw,22px)', fontWeight: 900, color: dark ? '#f4f4f5' : '#0f172a', marginBottom: 16 }}>
                  {curLesson.title}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {curLesson.quiz.map((q, qIdx) => (
                    <div key={q.id} style={{ padding: 14, borderRadius: 14, background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: dark ? '#f4f4f5' : '#0f172a', marginBottom: 12 }}>
                        {qIdx + 1}. {q.question}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {q.options.map((opt, optIdx) => {
                          const isSel = selectedAnswers[q.id] === optIdx;
                          const isCorrect = q.correctIndex === optIdx;
                          let bg = dark ? 'rgba(255,255,255,0.04)' : '#fff';
                          let border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
                          let color = dark ? '#f4f4f5' : '#0f172a';

                          if (isSel) {
                            bg = 'rgba(59,130,246,0.15)';
                            border = '#3b82f6';
                            color = '#60a5fa';
                          }

                          if (quizSubmitted) {
                            if (isCorrect) {
                              bg = 'rgba(16,185,129,0.15)';
                              border = '#10b981';
                              color = '#34d399';
                            } else if (isSel && !isCorrect) {
                              bg = 'rgba(239,68,68,0.15)';
                              border = '#ef4444';
                              color = '#f87171';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectQuizOption(q.id, optIdx)}
                              style={{
                                padding: '10px 14px', borderRadius: 11, border: `1px solid ${border}`,
                                background: bg, color: color, fontSize: 13, fontWeight: 600,
                                textAlign: 'left', cursor: quizSubmitted ? 'default' : 'pointer',
                                transition: 'all 0.15s', fontFamily: 'inherit',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              }}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && <Check size={16} color="#34d399" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <button className="btn btn-lg btn-primary" onClick={handleCalculateScore} style={{ marginTop: 8, width: '100%' }}>
                      Завершить тест и получить баллы <Award size={18} />
                    </button>
                  ) : (
                    <div style={{ padding: 16, borderRadius: 14, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center' }}>
                      <Award size={28} color="#34d399" style={{ margin: '0 auto 6px' }} />
                      <h3 style={{ fontSize: 16, fontWeight: 900, color: '#34d399' }}>Тест успешно сдан! 🎉</h3>
                      <p style={{ fontSize: 12, color: '#a1a1aa', marginTop: 4 }}>+150 XP добавлено в твой профиль. Урок отмечен пройденным!</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Standard Video / Text Lesson */
              <>
                {/* Video Player */}
                <div className="video-bg" style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <img src="/images/course_python.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                  <div style={{ position: 'absolute', textAlign: 'center', padding: '0 12px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 0 40px rgba(59,130,246,0.5)', cursor: 'pointer' }}>
                      <Play size={24} fill="#fff" color="#fff" style={{ marginLeft: 3 }} />
                    </div>
                    <h3 style={{ fontSize: 'clamp(14px,3vw,18px)', fontWeight: 800, color: '#fff' }}>{curLesson.title}</h3>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Воспроизведение урока ({curLesson.duration})</p>
                  </div>
                </div>

                {/* Lesson Title & Checkmark */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <span className="badge badge-blue">Видеоурок</span>
                    <h1 style={{ fontSize: 'clamp(18px,3.5vw,22px)', fontWeight: 900, color: dark ? '#f4f4f5' : '#0f172a', marginTop: 4 }}>{curLesson.title}</h1>
                  </div>
                  <button className={`btn btn-md ${completed.has(curLesson.id) ? 'btn-success' : 'btn-ghost'}`} onClick={() => setCompleted(p => { const n = new Set(p); n.has(curLesson.id) ? n.delete(curLesson.id) : n.add(curLesson.id); return n; })}>
                    <CheckCircle size={15} /> {completed.has(curLesson.id) ? 'Урок пройден' : 'Отметить пройденным'}
                  </button>
                </div>

                {/* Code / Markdown Content */}
                <div className="card" style={{ padding: 18 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a', marginBottom: 10 }}>Конспект урока</h3>
                  <p style={{ fontSize: 13, color: dark ? '#a1a1aa' : '#475569', lineHeight: 1.6, marginBottom: 14 }}>
                    В Python конструкции <code>if</code>, <code>elif</code> и <code>else</code> позволяют ветвить логику программы в зависимости от условий.
                  </p>
                  <div className="code-block">
                    <span style={{ color: '#a78bfa' }}># Пример условной конструкции</span><br />
                    score = <span style={{ color: '#fbbf24' }}>95</span><br /><br />
                    <span style={{ color: '#60a5fa' }}>if</span> score &gt;= <span style={{ color: '#fbbf24' }}>90</span>:<br />
                    &nbsp;&nbsp;print(<span style={{ color: '#34d399' }}>"Отлично! 🏆"</span>)<br />
                    <span style={{ color: '#60a5fa' }}>elif</span> score &gt;= <span style={{ color: '#fbbf24' }}>70</span>:<br />
                    &nbsp;&nbsp;print(<span style={{ color: '#34d399' }}>"Хорошо! 👍"</span>)<br />
                    <span style={{ color: '#60a5fa' }}>else</span>:<br />
                    &nbsp;&nbsp;print(<span style={{ color: '#34d399' }}>"Попробуй ещё раз"</span>)
                  </div>
                </div>

                {/* Homework Upload */}
                <div className="card" style={{ padding: 18 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a', marginBottom: 4 }}>Практическое задание</h3>
                  <p style={{ fontSize: 12, color: dark ? '#a1a1aa' : '#475569', marginBottom: 14 }}>Напишите программу проверки пароля с выводом сообщения об ошибке.</p>
                  <div className="upload-zone" style={{ padding: '24px 16px' }}>
                    <Upload size={22} color="#60a5fa" style={{ margin: '0 auto 6px' }} />
                    <p style={{ fontSize: 13, fontWeight: 600, color: dark ? '#f4f4f5' : '#0f172a' }}>Загрузить файл .py</p>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        {/* AI Sidebar Overlay */}
        {aiOpen && (
          <div className="lesson-ai">
            <div style={{ padding: 12, borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bot size={16} color="#a78bfa" />
                <span style={{ fontSize: 13, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>Bedrock ИИ-Тьютор</span>
                <span className="badge badge-green" style={{ fontSize: 9 }}>Active Key</span>
              </div>
              <button onClick={() => setAiOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}><X size={16} /></button>
            </div>

            <div style={{ flex: 1, padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {aiMsgs.map((m, i) => (
                <div key={i} className={m.role === 'ai' ? 'msg-ai' : 'msg-user'} style={{ padding: '10px 14px', fontSize: 12, lineHeight: 1.5, maxWidth: '90%', alignSelf: m.role === 'ai' ? 'flex-start' : 'flex-end' }}>
                  {m.text}
                </div>
              ))}
              {aiLoading && (
                <div className="msg-ai" style={{ padding: '10px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Loader2 size={13} className="spin" color="#a78bfa" />
                  <span>ИИ формирует ответ...</span>
                </div>
              )}
            </div>

            <div style={{ padding: 12, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`, display: 'flex', gap: 6 }}>
              <input className="input" placeholder="Задать вопрос ИИ..." value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAi()} style={{ fontSize: 12, padding: '8px 12px' }} />
              <button className="btn btn-sm btn-primary" onClick={sendAi} disabled={aiLoading} style={{ padding: '8px 12px' }}>
                <Send size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
