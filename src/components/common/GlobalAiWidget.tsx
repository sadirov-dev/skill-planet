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
  groqModelId: string;
}

const CUSTOM_MODELS_KEY = 'skillplanet_custom_models';

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

  // Custom model modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customGroqId, setCustomGroqId] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [customError, setCustomError] = useState('');
  const [customTesting, setCustomTesting] = useState(false);
  const [customModels, setCustomModels] = useState<CustomModel[]>(loadCustomModels);

  const dark = theme === 'dark';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find active model (built-in or custom)
  const builtInModel = AI_MODELS.find(m => m.id === modelId);
  const customModel = customModels.find(m => m.id === modelId);
  const activeLabel = builtInModel?.label ?? customModel?.label ?? modelId;
  const activeBadge = builtInModel?.badge ?? customModel?.badge ?? '🤖';
  const activeDesc = builtInModel?.description ?? customModel?.groqModelId ?? '';

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

      // Custom model — use its own API key
      if (customModel) {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${customModel.apiKey}`,
          },
          body: JSON.stringify({
            model: customModel.groqModelId,
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
          reply = 'Ошибка API ключа или модели. Проверьте настройки.';
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
    if (!customName.trim()) return setCustomError('Введите название модели');
    if (!customGroqId.trim()) return setCustomError('Введите ID модели (например: llama-3.3-70b-versatile)');
    if (!customApiKey.trim() || !customApiKey.startsWith('gsk_')) return setCustomError('Введите корректный API ключ (начинается с gsk_)');

    setCustomTesting(true);
    setCustomError('');

    // Test the key
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customApiKey}`,
        },
        body: JSON.stringify({
          model: customGroqId,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5,
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setCustomError(`Ошибка: ${err?.error?.message ?? 'Неверный ключ или модель'}`);
        setCustomTesting(false);
        return;
      }
    } catch {
      setCustomError('Не удалось подключиться. Проверьте интернет.');
      setCustomTesting(false);
      return;
    }

    const newModel: CustomModel = {
      id: `custom_${Date.now()}`,
      label: customName.trim(),
      badge: '🤖',
      apiKey: customApiKey.trim(),
      groqModelId: customGroqId.trim(),
    };

    const updated = [...customModels, newModel];
    setCustomModels(updated);
    saveCustomModels(updated);
    setModelId(newModel.id);
    setCustomName('');
    setCustomGroqId('');
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

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(139,92,246,0.5)',
          color: '#fff',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        title="ИИ-Ассистент"
      >
        <Bot size={26} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 9999,
            width: 'clamp(340px, 92vw, 540px)',
            height: 'calc(100vh - 40px)',
            maxHeight: 700,
            borderRadius: 20,
            background: dark ? '#0d0d12' : '#ffffff',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'visible',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 16px 12px',
            background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
            borderRadius: '20px 20px 0 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={15} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>ИИ-Ассистент</div>
                  <div style={{ fontSize: 10, color: '#34d399', fontWeight: 600 }}>● Онлайн — {activeLabel}</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', padding: 4, borderRadius: 6 }}>
                <X size={18} />
              </button>
            </div>

            {/* Model Dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  color: dark ? '#f4f4f5' : '#0f172a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{activeBadge}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700 }}>{activeLabel}</div>
                    <div style={{ fontSize: 10, color: '#71717a', fontWeight: 400 }}>{activeDesc}</div>
                  </div>
                </div>
                <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: '#71717a', flexShrink: 0 }} />
              </button>

              {/* Dropdown list */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  zIndex: 10000,
                  background: dark ? '#1a1a2e' : '#ffffff',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  borderRadius: 12,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                  overflow: 'hidden',
                  maxHeight: 340,
                  overflowY: 'auto',
                }}>
                  {/* Built-in models */}
                  {AI_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setModelId(m.id); setDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: 'none',
                        background: m.id === modelId ? (dark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.08)') : 'transparent',
                        color: dark ? '#f4f4f5' : '#0f172a',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        fontFamily: 'inherit',
                        fontSize: 13,
                        textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (m.id !== modelId) (e.currentTarget as HTMLElement).style.background = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; }}
                      onMouseLeave={e => { if (m.id !== modelId) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{m.badge}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{m.label}</div>
                          <div style={{ fontSize: 11, color: '#71717a' }}>{m.description}</div>
                        </div>
                      </div>
                      {m.id === modelId && <Check size={14} color="#8b5cf6" />}
                    </button>
                  ))}

                  {/* Custom models */}
                  {customModels.length > 0 && (
                    <div style={{ padding: '6px 14px 2px', fontSize: 10, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: 0.5, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` }}>
                      Мои модели
                    </div>
                  )}
                  {customModels.map(m => (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: m.id === modelId ? (dark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.08)') : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <button
                        onClick={() => { setModelId(m.id); setDropdownOpen(false); }}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          border: 'none',
                          background: 'transparent',
                          color: dark ? '#f4f4f5' : '#0f172a',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          fontFamily: 'inherit',
                          fontSize: 13,
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontSize: 18 }}>🤖</span>
                        <div>
                          <div style={{ fontWeight: 700 }}>{m.label}</div>
                          <div style={{ fontSize: 11, color: '#71717a' }}>{m.groqModelId}</div>
                        </div>
                        {m.id === modelId && <Check size={14} color="#8b5cf6" />}
                      </button>
                      <button
                        onClick={() => handleDeleteCustomModel(m.id)}
                        style={{ padding: '10px 12px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: 13 }}
                        title="Удалить"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}

                  {/* Add custom model button */}
                  <div style={{ borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` }}>
                    <button
                      onClick={() => { setDropdownOpen(false); setShowAddModal(true); }}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        border: 'none',
                        background: 'transparent',
                        color: '#8b5cf6',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontFamily: 'inherit',
                        fontSize: 13,
                        fontWeight: 700,
                        textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = dark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <div style={{ flex: 1, padding: '14px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 14px',
                  borderRadius: m.role === 'ai' ? '4px 14px 14px 14px' : '14px 14px 4px 14px',
                  fontSize: 13,
                  lineHeight: 1.6,
                  maxWidth: '88%',
                  alignSelf: m.role === 'ai' ? 'flex-start' : 'flex-end',
                  background: m.role === 'ai' ? (dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9') : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: m.role === 'ai' ? (dark ? '#f4f4f5' : '#0f172a') : '#ffffff',
                  border: m.role === 'ai' ? `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` : 'none',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {m.role === 'ai' && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#8b5cf6', marginBottom: 4, letterSpacing: 0.5 }}>
                    {activeBadge} {activeLabel}
                  </div>
                )}
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ padding: '10px 14px', borderRadius: '4px 14px 14px 14px', background: dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, width: 'fit-content', border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                <Loader2 size={13} color="#8b5cf6" className="spin" />
                <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{activeLabel} думает...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`, display: 'flex', gap: 8, background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderRadius: '0 0 20px 20px' }}>
            <input
              className="input"
              placeholder={`Спросить ${activeLabel}...`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ fontSize: 13, padding: '9px 14px', flex: 1 }}
            />
            <button className="btn btn-sm btn-primary" onClick={handleSend} disabled={loading} style={{ padding: '9px 14px', flexShrink: 0 }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Model Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <div style={{
            width: '100%',
            maxWidth: 460,
            borderRadius: 20,
            background: dark ? '#0d0d12' : '#ffffff',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out',
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>Добавить свою модель</div>
                  <div style={{ fontSize: 11, color: '#71717a' }}>Подключите любую Groq модель с вашим ключом</div>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Model Name */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: dark ? '#a1a1aa' : '#52525b', display: 'block', marginBottom: 6 }}>
                  Название модели
                </label>
                <input
                  className="input"
                  placeholder="Например: Мой GPT, Custom Llama, GPT-4..."
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  style={{ fontSize: 13, padding: '10px 14px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* Groq Model ID */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: dark ? '#a1a1aa' : '#52525b', display: 'block', marginBottom: 6 }}>
                  ID модели (Groq Model ID)
                </label>
                <input
                  className="input"
                  placeholder="Например: llama-3.3-70b-versatile"
                  value={customGroqId}
                  onChange={e => setCustomGroqId(e.target.value)}
                  style={{ fontSize: 13, padding: '10px 14px', width: '100%', boxSizing: 'border-box' }}
                />
                <div style={{ fontSize: 11, color: '#71717a', marginTop: 4 }}>
                  Доступные модели: llama-3.3-70b-versatile, llama3-70b-8192, mixtral-8x7b-32768, gemma2-9b-it
                </div>
              </div>

              {/* API Key */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: dark ? '#a1a1aa' : '#52525b', display: 'block', marginBottom: 6 }}>
                  <Key size={12} style={{ display: 'inline', marginRight: 4 }} />
                  API Ключ (Groq API Key)
                </label>
                <input
                  className="input"
                  type="password"
                  placeholder="gsk_..."
                  value={customApiKey}
                  onChange={e => setCustomApiKey(e.target.value)}
                  style={{ fontSize: 13, padding: '10px 14px', width: '100%', boxSizing: 'border-box' }}
                />
                <div style={{ fontSize: 11, color: '#71717a', marginTop: 4 }}>
                  Получить бесплатный ключ: <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" style={{ color: '#8b5cf6' }}>console.groq.com/keys</a>
                </div>
              </div>

              {/* Error */}
              {customError && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: '#ef4444' }}>{customError}</span>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-ghost"
                  style={{ flex: 1, padding: '10px', fontSize: 13 }}
                >
                  Отмена
                </button>
                <button
                  onClick={handleAddCustomModel}
                  disabled={customTesting}
                  style={{
                    flex: 2,
                    padding: '10px',
                    borderRadius: 10,
                    border: 'none',
                    background: customTesting ? '#52525b' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: customTesting ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                  }}
                >
                  {customTesting ? (
                    <><Loader2 size={14} className="spin" /> Проверяем ключ...</>
                  ) : (
                    <><Cpu size={14} /> Добавить модель</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
