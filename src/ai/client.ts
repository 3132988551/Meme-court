export type ChatRole = 'system' | 'user' | 'assistant';
export interface ChatMessage { role: ChatRole; content: string }

const BASE_URL = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
const MODEL = import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat';
const PROXY_URL = (import.meta.env.VITE_PROXY_URL || '').replace(/\/$/, '');
const USE_PROXY = import.meta.env.VITE_USE_PROXY === '1' || Boolean(PROXY_URL);

interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export async function chatComplete(messages: ChatMessage[], opts: ChatOptions = {}) {
  const endpoint = USE_PROXY
    ? (PROXY_URL ? `${PROXY_URL}/api/chat` : '/api/chat')
    : `${BASE_URL}/chat/completions`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!USE_PROXY) {
    if (!API_KEY) throw new Error('Missing VITE_DEEPSEEK_API_KEY');
    headers.Authorization = `Bearer ${API_KEY}`;
  }

  const body = {
    model: opts.model || MODEL,
    temperature: opts.temperature ?? 1.5,
    max_tokens: opts.max_tokens ?? 700,
    messages,
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || '请求失败'}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content as string | undefined;
  if (!content) throw new Error('No content from API');
  return content;
}

export function envSummary() {
  return {
    baseUrl: BASE_URL,
    model: MODEL,
    hasKey: Boolean(API_KEY),
    useProxy: USE_PROXY,
  };
}
