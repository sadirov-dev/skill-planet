// API Client Service for connecting SkillPlanet Frontend to Node.js Backend

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('skillplanet_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🏥 Health Check
export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { success: false, message: 'Бэкенд не отвечает' };
    return await res.json();
  } catch (error) {
    return { success: false, message: 'Ошибка подключения к серверу Node.js' };
  }
}

// 🔐 Auth APIs
export async function loginUser(credentials: { email: string; password: string }) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem('skillplanet_auth_token', data.token);
    }
    return data;
  } catch (err: any) {
    return { success: false, message: 'Ошибка соединения с бэкенд сервером' };
  }
}

export async function registerUser(userData: { name: string; email: string; password: string; role?: string }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (data.success && data.token) {
    localStorage.setItem('skillplanet_auth_token', data.token);
  }
  return data;
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...getAuthHeader() },
  });
  return await res.json();
}

// 📚 Courses APIs
export async function fetchCourses(params?: { search?: string; category?: string; level?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.category) query.append('category', params.category);
  if (params?.level) query.append('level', params.level);

  const res = await fetch(`${API_BASE}/courses?${query.toString()}`);
  return await res.json();
}

export async function fetchCourseById(id: string) {
  const res = await fetch(`${API_BASE}/courses/${id}`);
  return await res.json();
}

export async function enrollInCourse(courseId: string) {
  const res = await fetch(`${API_BASE}/courses/enroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ courseId }),
  });
  return await res.json();
}

// 🤖 AI Assistant Proxy API
export async function sendAiPrompt(payload: {
  prompt: string;
  modelId?: string;
  history?: any[];
  customApiKey?: string;
  customEndpoint?: string;
  customModelId?: string;
}) {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

// 🏆 Leaderboard & Stats APIs
export async function fetchLeaderboard() {
  const res = await fetch(`${API_BASE}/leaderboard`);
  return await res.json();
}

export async function fetchPlatformStats() {
  const res = await fetch(`${API_BASE}/leaderboard/stats`);
  return await res.json();
}
