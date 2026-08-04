import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, Sparkles, ChevronDown, Check, Plus, Key, Cpu, AlertCircle } from 'lucide-react';
import { askAiAssistant, AI_MODELS, type AiModelId } from '../../services/aiService';

interface Props {
  theme: 'dark' | 'light';
}

interface CustomModel {
  id: string;
  label: string;
  badge: string;
  apiKey: string;
  modelId: string;
  endpoint: string;
}

const CUSTOM_MODELS_KEY = 'skillplanet_custom_models_v3';

function loadCustomModels(): CustomModel[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_MODELS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCustomModels(models: CustomModel[]) {
  localStorage.setItem(CUSTOM_MODELS_KEY, JSON.stringify(models));
}

export default function GlobalAiWidget({ theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [modelId, setModelId] = useState<string>('llama3.3');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Привет! Я ИИ-Ассистент SkillPlanet. Выберите модель из списка и задайте любой вопрос!' }
  ]);

  // Modal state - ONLY 2 FIELDS: Name & API Key
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [customError, setCustomError] = useState('');
  const [customTesting, setCustomTesting] = useState(false);
  const [customModels, setCustomModels] = useState<CustomModel[]>(loadCustomModels);

  const dark = theme === 'dark';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const builtInModel = AI_MODELS.find(m => m.id === modelId);
  const customModel = customModels.find(m => m.id === modelId);
  const activeLabel = builtInModel?.label ?? customModel?.label ?? modelId;
  const activeBadge = builtInModel?.badge ?? customModel?.badge ?? '🤖';
  const activeDesc = builtInModel?.description ?? customModel?.modelId ?? 'Своя модель';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const txt = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user' as const, text: txt }]);
    setLoading(true);

    try {
      let reply: string;

      if (customModel) {
        const endpoint = customModel.endpoint.replace(/\/$/, '');
        const res = await fetch(`${endpoint}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${customModel.apiKey}`,
          },
          body: JSON.stringify({
            model: customModel.modelId,
            messages: [
              { role: 'system', content: `Ты — ИИ-ассистент ${customModel.label}. Отвечай прямо и по существу.` },
              ...messages.slice(-8).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
              { role: 'user', content: txt }
            ],
            temperature: 0.7,
            max_tokens: 800,
          })
        });

        if (res.ok) {
          const data = await res.json();
          reply = data?.choices?.[0]?.message?.content ?? 'Нет ответа.';
        } else {
          const err = await res.json().catch(() => ({}));
          reply = `Ошибка API: ${err?.error?.message ?? res.status}. Проверьте ключ.`;
        }
      } else {
        reply = await askAiAssistant(txt, 'SkillPlanet', modelId as AiModelId, messages);
      }

      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Ошибка соединения. Попробуйте снова.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomModel = async () => {
    if (!customName.trim()) return setCustomError('Введите имя модели');
    if (!customApiKey.trim()) return setCustomError('Введите API ключ');

    setCustomTesting(true);
    setCustomError('');

    const key = customApiKey.trim();
    // Auto-detect endpoint & model ID based on key format
    let endpoint = 'https://api.groq.com/openai/v1';
    let targetModelId = 'llama-3.3-70b-versatile';

    if (key.startsWith('sk-or-')) {
      endpoint = 'https://openrouter.ai/api/v1';
      targetModelId = 'meta-llama/llama-3.3-70b-instruct:free';
    } else if (key.startsWith('sk-')) {
      endpoint = 'https://api.openai.com/v1';
      targetModelId = 'gpt-3.5-turbo';
    }

    try {
      const res = await fetch(`${endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: targetModelId,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5,
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setCustomError(`Ошибка: ${err?.error?.message ?? `Статус ${res.status}`}`);
        setCustomTesting(false);
        return;
      }
    } catch {
      setCustomError('Не удалось проверить ключ. Проверьте подключение к интернету.');
      setCustomTesting(false);
      return;
    }

    const newModel: CustomModel = {
      id: `custom_${Date.now()}`,
      label: customName.trim(),
      badge: '🤖',
      apiKey: key,
      modelId: targetModelId,
      endpoint: endpoint,
    };

    const updated = [...customModels, newModel];
    setCustomModels(updated);
    saveCustomModels(updated);
    setModelId(newModel.id);

    setCustomName('');
    setCustomApiKey('');
    setCustomError('');
    setCustomTesting(false);
    setShowAddModal(false);
  };

  const handleDeleteCustomModel = (id: string) => {
    const updated = customModels.filter(m => m.id !== id);
    setCustomModels(updated);
    saveCustomModels(updated);
    if (modelId === id) setModelId('llama3.3');
  };

  const s = (obj: React.CSSProperties) => obj;

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        className="ai-widget-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={s({
          display: isOpen ? 'none' : 'flex',
        })}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Bot size={26} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="ai-widget-window"
          style={s({
            position: 'fixed', bottom: 24, right: 20, zIndex: 9999,
            width: 'clamp(340px, 92vw, 540px)',
            height: 'calc(100vh - 48px)', maxHeight: 700,
            borderRadius: 20,
            background: dark ? '#0d0d12' : '#ffffff',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', overflow: 'visible',
            animation: 'fadeIn 0.2s ease-out',
          })}
        >
          {/* Header */}
          <div style={s({ padding: '14px 16px 12px', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`, borderRadius: '20px 20px 0 0' })}>
            <div style={s({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 })}>
              <div style={s({ display: 'flex', alignItems: 'center', gap: 8 })}>
                <div style={s({ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                  <Sparkles size={15} color="#fff" />
                </div>
                <div>
                  <div style={s({ fontSize: 13, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' })}>ИИ-Ассистент</div>
                  <div style={s({ fontSize: 10, color: '#34d399', fontWeight: 600 })}>● Онлайн — {activeLabel}</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={s({ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' })}>
                <X size={18} />
              </button>
            </div>

            {/* Dropdown Selector */}
            <div ref={dropdownRef} style={s({ position: 'relative' })}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                style={s({
                  width: '100%', padding: '8px 12px', borderRadius: 10,
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  color: dark ? '#f4f4f5' : '#0f172a', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 8, fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                })}
              >
                <div style={s({ display: 'flex', alignItems: 'center', gap: 8 })}>
                  {builtInModel ? (
                    <img
                      src={builtInModel.logo}
                      alt={builtInModel.label}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      style={s({ width: 28, height: 28, borderRadius: 8, objectFit: 'cover', flexShrink: 0 })}
                    />
                  ) : (
                    <span style={s({ fontSize: 18, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'rgba(139,92,246,0.15)', flexShrink: 0 })}>{activeBadge}</span>
                  )}
                  <div style={s({ textAlign: 'left' })}>
                    <div style={s({ fontWeight: 700 })}>{activeLabel}</div>
                    <div style={s({ fontSize: 10, color: '#71717a' })}>{activeDesc}</div>
                  </div>
                </div>
                <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: '#71717a' }} />
              </button>

              {dropdownOpen && (
                <div style={s({
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                  zIndex: 10000, background: dark ? '#1a1a2e' : '#ffffff',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                  maxHeight: 340, overflowY: 'auto',
                })}>
                  {AI_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setModelId(m.id); setDropdownOpen(false); }}
                      style={s({
                        width: '100%', padding: '10px 14px', border: 'none',
                        background: m.id === modelId ? (dark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.08)') : 'transparent',
                        color: dark ? '#f4f4f5' : '#0f172a', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 10, fontFamily: 'inherit', fontSize: 13, textAlign: 'left',
                      })}
                    >
                      <div style={s({ display: 'flex', alignItems: 'center', gap: 10 })}>
                        <img
                          src={m.logo}
                          alt={m.label}
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex'; }}
                          style={s({ width: 28, height: 28, borderRadius: 8, objectFit: 'cover', flexShrink: 0 })}
                        />
                        <span style={s({ fontSize: 18, width: 28, height: 28, display: 'none', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'rgba(139,92,246,0.15)' })}>{m.badge}</span>
                        <div>
                          <div style={s({ fontWeight: 700 })}>{m.label}</div>
                          <div style={s({ fontSize: 11, color: '#71717a' })}>{m.description}</div>
                        </div>
                      </div>
                      {m.id === modelId && <Check size={14} color="#8b5cf6" />}
                    </button>
                  ))}

                  {/* Custom models section */}
                  {customModels.length > 0 && (
                    <div style={s({ padding: '6px 14px 2px', fontSize: 10, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: 0.5, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` })}>
                      Мои модели
                    </div>
                  )}
                  {customModels.map(m => (
                    <div key={m.id} style={s({ display: 'flex', alignItems: 'center', background: m.id === modelId ? (dark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.08)') : 'transparent' })}>
                      <button
                        onClick={() => { setModelId(m.id); setDropdownOpen(false); }}
                        style={s({ flex: 1, padding: '10px 14px', border: 'none', background: 'transparent', color: dark ? '#f4f4f5' : '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit', fontSize: 13, textAlign: 'left' })}
                      >
                        <span style={s({ fontSize: 18 })}>{m.badge}</span>
                        <div>
                          <div style={s({ fontWeight: 700 })}>{m.label}</div>
                          <div style={s({ fontSize: 11, color: '#71717a' })}>Своя модель</div>
                        </div>
                        {m.id === modelId && <Check size={14} color="#8b5cf6" />}
                      </button>
                      <button onClick={() => handleDeleteCustomModel(m.id)} style={s({ padding: '10px 12px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' })}>
                        <X size={13} />
                      </button>
                    </div>
                  ))}

                  {/* Add button */}
                  <div style={s({ borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` })}>
                    <button
                      onClick={() => { setDropdownOpen(false); setShowAddModal(true); }}
                      style={s({ width: '100%', padding: '11px 14px', border: 'none', background: 'transparent', color: '#8b5cf6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 700 })}
                      onMouseEnter={e => (e.currentTarget.style.background = dark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={s({ width: 24, height: 24, borderRadius: 6, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                        <Plus size={13} color="#8b5cf6" />
                      </div>
                      Добавить свою модель
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div style={s({ flex: 1, padding: '14px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 })}>
            {messages.map((m, i) => (
              <div key={i} style={s({
                padding: '10px 14px',
                borderRadius: m.role === 'ai' ? '4px 14px 14px 14px' : '14px 14px 4px 14px',
                fontSize: 13, lineHeight: 1.6, maxWidth: '88%',
                alignSelf: m.role === 'ai' ? 'flex-start' : 'flex-end',
                background: m.role === 'ai' ? (dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9') : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: m.role === 'ai' ? (dark ? '#f4f4f5' : '#0f172a') : '#ffffff',
                border: m.role === 'ai' ? `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` : 'none',
                whiteSpace: 'pre-line', wordBreak: 'break-word',
              })}>
                {m.role === 'ai' && <div style={s({ fontSize: 10, fontWeight: 700, color: '#8b5cf6', marginBottom: 4 })}>{activeBadge} {activeLabel}</div>}
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={s({ padding: '10px 14px', borderRadius: '4px 14px 14px 14px', background: dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, width: 'fit-content', border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` })}>
                <Loader2 size={13} color="#8b5cf6" className="spin" />
                <span style={s({ color: '#8b5cf6', fontWeight: 600 })}>{activeLabel} думает...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={s({ padding: '10px 12px', borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`, display: 'flex', gap: 8, borderRadius: '0 0 20px 20px' })}>
            <input className="input" placeholder={`Спросить ${activeLabel}...`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} style={{ fontSize: 13, padding: '9px 14px', flex: 1 }} />
            <button className="btn btn-sm btn-primary" onClick={handleSend} disabled={loading} style={{ padding: '9px 14px', flexShrink: 0 }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Model Modal — ONLY 2 FIELDS (Name & API Key) */}
      {showAddModal && (
        <div
          style={s({ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 })}
          onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <div style={s({ width: '100%', maxWidth: 420, borderRadius: 20, background: dark ? '#0d0d12' : '#ffffff', border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`, boxShadow: '0 30px 80px rgba(0,0,0,0.6)', animation: 'fadeIn 0.2s ease-out' })}>
            {/* Header */}
            <div style={s({ padding: '20px 24px 16px', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
              <div style={s({ display: 'flex', alignItems: 'center', gap: 12 })}>
                <div style={s({ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                  <Plus size={19} color="#fff" />
                </div>
                <div>
                  <div style={s({ fontSize: 15, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' })}>Добавить модель</div>
                  <div style={s({ fontSize: 11, color: '#71717a' })}>Введите название и ваш API ключ</div>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} style={s({ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' })}><X size={20} /></button>
            </div>

            {/* Body — EXACTLY 2 INPUT FIELDS */}
            <div style={s({ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 })}>
              {/* Field 1: Name */}
              <div>
                <label style={s({ fontSize: 12, fontWeight: 700, color: dark ? '#a1a1aa' : '#52525b', display: 'block', marginBottom: 6 })}>
                  Напишите имя модели
                </label>
                <input
                  className="input"
                  placeholder="Например: Моя Модель, Llama 3, GPT-4..."
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  style={{ fontSize: 13, padding: '10px 14px', width: '100%', boxSizing: 'border-box' as const }}
                />
              </div>

              {/* Field 2: API Key */}
              <div>
                <label style={s({ fontSize: 12, fontWeight: 700, color: dark ? '#a1a1aa' : '#52525b', display: 'block', marginBottom: 6 })}>
                  <Key size={11} style={{ display: 'inline', marginRight: 4 }} />
                  Дайте API ключ
                </label>
                <input
                  className="input"
                  type="password"
                  placeholder="Вставьте ваш API ключ (gsk_..., sk-...)"
                  value={customApiKey}
                  onChange={e => setCustomApiKey(e.target.value)}
                  style={{ fontSize: 13, padding: '10px 14px', width: '100%', boxSizing: 'border-box' as const }}
                />
              </div>

              {/* Error Alert */}
              {customError && (
                <div style={s({ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'flex-start', gap: 8 })}>
                  <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={s({ fontSize: 12, color: '#ef4444' })}>{customError}</span>
                </div>
              )}

              {/* Buttons */}
              <div style={s({ display: 'flex', gap: 10, marginTop: 4 })}>
                <button onClick={() => setShowAddModal(false)} className="btn btn-ghost" style={{ flex: 1, padding: '10px', fontSize: 13 }}>Отмена</button>
                <button
                  onClick={handleAddCustomModel}
                  disabled={customTesting}
                  style={s({
                    flex: 2, padding: '10px', borderRadius: 10, border: 'none',
                    background: customTesting ? '#52525b' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    color: '#fff', fontSize: 13, fontWeight: 700,
                    cursor: customTesting ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  })}
                >
                  {customTesting ? <><Loader2 size={14} className="spin" /> Проверяем...</> : <><Cpu size={14} /> Сохранить модель</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
