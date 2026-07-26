// Shared design tokens and style helpers for SkillPlanet
// All styles are inline for maximum reliability

export const colors = {
  blue: '#3b82f6',
  blueLight: '#60a5fa',
  violet: '#8b5cf6',
  violetLight: '#a78bfa',
  green: '#10b981',
  greenLight: '#34d399',
  amber: '#f59e0b',
  amberLight: '#fbbf24',
  red: '#ef4444',
  redLight: '#f87171',
  cyan: '#06b6d4',
};

export const dark = {
  bg: '#09090b',
  surface: '#111113',
  card: 'rgba(20,20,26,0.85)',
  cardSolid: '#16161e',
  border: 'rgba(255,255,255,0.07)',
  borderHover: 'rgba(255,255,255,0.14)',
  text: '#f4f4f5',
  textSub: '#a1a1aa',
  textMuted: '#71717a',
  textFaint: '#52525b',
  inputBg: 'rgba(255,255,255,0.04)',
};

export const light = {
  bg: '#f8fafc',
  surface: '#ffffff',
  card: 'rgba(255,255,255,0.95)',
  cardSolid: '#ffffff',
  border: 'rgba(0,0,0,0.07)',
  borderHover: 'rgba(0,0,0,0.13)',
  text: '#0f172a',
  textSub: '#475569',
  textMuted: '#64748b',
  textFaint: '#94a3b8',
  inputBg: '#f1f5f9',
};

export type T = typeof dark;

export function getTheme(isDark: boolean): T {
  return isDark ? dark : light;
}

// Glassmorphism card style
export function cardStyle(t: T, extra?: React.CSSProperties): React.CSSProperties {
  return {
    background: t.card,
    border: `1px solid ${t.border}`,
    borderRadius: 16,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    ...extra,
  };
}

// Gradient text
export const gradientText: React.CSSProperties = {
  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// Primary button
export function btnPrimary(extra?: React.CSSProperties): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '11px 24px', borderRadius: 12,
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: '#fff', fontWeight: 700, fontSize: 14,
    border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
    transition: 'all 0.18s',
    letterSpacing: '-0.01em',
    ...extra,
  };
}

// Secondary button
export function btnSecondary(t: T, extra?: React.CSSProperties): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '10px 20px', borderRadius: 12,
    background: 'transparent',
    border: `1px solid ${t.border}`,
    color: t.textSub, fontWeight: 600, fontSize: 14,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    transition: 'all 0.18s',
    ...extra,
  };
}

// Input style
export function inputStyle(t: T, extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: '100%', padding: '11px 14px', borderRadius: 11,
    background: t.inputBg, border: `1px solid ${t.border}`,
    color: t.text, fontSize: 14, fontFamily: 'Inter, sans-serif',
    outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
    ...extra,
  };
}

// Badge
export function badgeStyle(color: string, bg: string, extra?: React.CSSProperties): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 10px', borderRadius: 99,
    background: bg, color: color,
    fontSize: 11, fontWeight: 700,
    border: `1px solid ${color}30`,
    letterSpacing: '0.01em',
    ...extra,
  };
}

// Section tag
export function sectionTag(extra?: React.CSSProperties): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 14px', borderRadius: 99,
    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
    color: '#60a5fa', fontSize: 11, fontWeight: 800,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    marginBottom: 12,
    ...extra,
  };
}

// Progress bar container
export function progressTrack(extra?: React.CSSProperties): React.CSSProperties {
  return { width: '100%', height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', ...extra };
}

export function progressFill(pct: number, color = 'blue', extra?: React.CSSProperties): React.CSSProperties {
  const gradients: Record<string, string> = {
    blue: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    green: 'linear-gradient(90deg, #10b981, #34d399)',
    amber: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
    violet: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
  };
  return { height: '100%', borderRadius: 99, width: `${Math.min(100, pct)}%`, background: gradients[color] || gradients.blue, transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)', ...extra };
}

// Layout containers
export const pageWrap = (bg: string): React.CSSProperties => ({
  minHeight: '100vh', background: bg,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  overflowX: 'hidden', paddingBottom: 96,
});

export const maxW = (px = 1200): React.CSSProperties => ({
  maxWidth: px, margin: '0 auto', width: '100%',
});

export const flex = (extra?: React.CSSProperties): React.CSSProperties => ({
  display: 'flex', ...extra,
});

export const grid = (cols: string, gap = 16, extra?: React.CSSProperties): React.CSSProperties => ({
  display: 'grid', gridTemplateColumns: cols, gap, ...extra,
});
