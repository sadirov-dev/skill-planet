import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, Sparkles, ChevronDown, Check } from 'lucide-react';
import { askAiAssistant, AI_MODELS, type AiModelId } from '../../services/aiService';

interface Props {
  theme: 'dark' | 'light';
}

export default function GlobalAiWidget({ theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [modelId, setModelId] = useState<AiModelId>('llama3.3');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Привет! Я ИИ-Ассистент SkillPlanet. Выберите модель из списка и задайте любой вопрос!' }
  ]);

  const dark = theme === 'dark';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedModel = AI_MODELS.find(m => m.id === modelId)!;

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close dropdown on outside click
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
    const newMessages = [...messages, { role: 'user' as const, text: txt }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await askAiAssistant(txt, 'SkillPlanet', modelId, messages);
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Ошибка соединения. Попробуйте снова.' }]);
    } finally {
      setLoading(false);
    }
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
            {/* Title row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={15} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>ИИ-Ассистент</div>
                  <div style={{ fontSize: 10, color: '#34d399', fontWeight: 600 }}>● Онлайн — {selectedModel.label}</div>
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
                  <span style={{ fontSize: 16 }}>{selectedModel.badge}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700 }}>{selectedModel.label}</div>
                    <div style={{ fontSize: 10, color: '#71717a', fontWeight: 400 }}>{selectedModel.description}</div>
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
                  maxHeight: 320,
                  overflowY: 'auto',
                }}>
                  {AI_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setModelId(m.id); setDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: 'none',
                        background: m.id === modelId
                          ? (dark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.08)')
                          : 'transparent',
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
                      onMouseEnter={e => {
                        if (m.id !== modelId) (e.currentTarget as HTMLElement).style.background = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
                      }}
                      onMouseLeave={e => {
                        if (m.id !== modelId) (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }}
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
                  background: m.role === 'ai'
                    ? (dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9')
                    : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: m.role === 'ai' ? (dark ? '#f4f4f5' : '#0f172a') : '#ffffff',
                  border: m.role === 'ai' ? `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` : 'none',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {m.role === 'ai' && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#8b5cf6', marginBottom: 4, letterSpacing: 0.5 }}>
                    {selectedModel.badge} {selectedModel.label}
                  </div>
                )}
                {m.text}
              </div>
            ))}

            {loading && (
              <div style={{ padding: '10px 14px', borderRadius: '4px 14px 14px 14px', background: dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, width: 'fit-content', border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                <Loader2 size={13} color="#8b5cf6" className="spin" />
                <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{selectedModel.label} думает...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px',
            borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
            display: 'flex',
            gap: 8,
            background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
            borderRadius: '0 0 20px 20px',
          }}>
            <input
              className="input"
              placeholder={`Спросить ${selectedModel.label}...`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ fontSize: 13, padding: '9px 14px', flex: 1 }}
            />
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSend}
              disabled={loading}
              style={{ padding: '9px 14px', flexShrink: 0 }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
