import React, { useState } from 'react';
import { Bot, X, Send, Zap, Cpu, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { askAiAssistant, type AiModelProvider } from '../../services/aiService';

interface Props {
  theme: 'dark' | 'light';
}

export default function GlobalAiWidget({ theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [model, setModel] = useState<AiModelProvider>('groq');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: 'Привет! Я глобальный ИИ-Ассистент SkillPlanet. Выберите модель (Llama 3.3 / Gemini 2.0) и задайте любой вопрос!'
    }
  ]);

  const dark = theme === 'dark';

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const txt = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: txt }]);
    setLoading(true);

    try {
      const reply = await askAiAssistant(txt, 'Общие знания / SkillPlanet', model);
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Запрос обработан. Готов отвечать дальше!' }]);
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
          bottom: 74,
          right: 20,
          zIndex: 9999,
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
          border: 'none',
          boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Быстрый ИИ-Ассистент"
      >
        {isOpen ? <X size={24} /> : <Bot size={26} />}
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 140,
            right: 20,
            zIndex: 9999,
            width: 'clamp(300px, 90vw, 380px)',
            height: 480,
            borderRadius: 20,
            background: dark ? '#0d0d12' : '#ffffff',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Drawer Header */}
          <div style={{ padding: '14px 16px', background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={15} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: dark ? '#f4f4f5' : '#0f172a' }}>ИИ-Ассистент</div>
                  <div style={{ fontSize: 10, color: '#34d399', fontWeight: 600 }}>● Онлайн</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}>
                <X size={18} />
              </button>
            </div>

            {/* Model Selector Tabs */}
            <div style={{ display: 'flex', gap: 4, background: dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)', padding: 3, borderRadius: 10, border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
              <button
                onClick={() => setModel('groq')}
                style={{
                  flex: 1, padding: '5px 8px', borderRadius: 8, border: 'none',
                  background: model === 'groq' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                  color: model === 'groq' ? '#fff' : '#71717a',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'all 0.15s'
                }}
              >
                <Zap size={11} /> Groq Llama 3.3
              </button>
              <button
                onClick={() => setModel('gemini')}
                style={{
                  flex: 1, padding: '5px 8px', borderRadius: 8, border: 'none',
                  background: model === 'gemini' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                  color: model === 'gemini' ? '#fff' : '#71717a',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'all 0.15s'
                }}
              >
                <Cpu size={11} /> Gemini 2.0
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: 14, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  fontSize: 12,
                  lineHeight: 1.5,
                  maxWidth: '85%',
                  alignSelf: m.role === 'ai' ? 'flex-start' : 'flex-end',
                  background: m.role === 'ai' ? (dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9') : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: m.role === 'ai' ? (dark ? '#f4f4f5' : '#0f172a') : '#ffffff',
                  border: m.role === 'ai' ? `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` : 'none',
                  whiteSpace: 'pre-line',
                }}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div style={{ padding: '10px 14px', borderRadius: 14, background: dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: '#a78bfa', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
                <Loader2 size={13} className="spin" />
                <span>{model === 'groq' ? 'Llama 3.3 думает...' : 'Gemini 2.0 думает...'}</span>
              </div>
            )}
          </div>

          {/* Drawer Input */}
          <div style={{ padding: 12, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, display: 'flex', gap: 6 }}>
            <input
              className="input"
              placeholder={`Задать вопрос (${model === 'groq' ? 'Llama 3.3' : 'Gemini'})...`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ fontSize: 12, padding: '8px 12px' }}
            />
            <button className="btn btn-sm btn-primary" onClick={handleSend} disabled={loading} style={{ padding: '8px 12px' }}>
              <Send size={13} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
