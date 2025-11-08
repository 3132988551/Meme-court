import type { Round, Summary } from '@/types';
import { chatComplete } from '@/ai/client';
import { extractFirstJsonObject } from '@/utils/json';
import * as Personas from '@/ai/personas';

interface LLMResp {
  rounds: { prosecutor: string; defender: string }[];
  summary: Summary;
}

function systemPrompt() {
  return [
    '你是“梗图法庭 · Meme Court”的辩论编排官。',
    '目标：让最终可见的发言与三位角色的人设高度一致。',
    '要求：',
    '1) 仅输出严格符合 schema 的 JSON；',
    '2) 所有文本使用中文；',
    '3) 禁止输出前言、后记、注释、道歉或自我描述（如“作为AI”）。',
    '4) 每句话 1–3 句，信息密度高，不跑题，不复读；',
    '5) 不包含任何 Markdown 或代码块围栏。',
  ].join('\n');
}

function styleRubric() {
  return [
    '【风格校验清单（生成时必须内化，不要输出）】',
    '- 检察官：以“指控/证据/结语”结构收束；结尾有锋利短句；',
    '- 辩护人：对点反驳 + 自洽替代解释 + 人情味收束；',
    '- 法官：3 条精炼金句（各 1 句）+ 口号（醒目简短）。',
    '- 全程严禁使用“我们AI”、“抱歉”、“作为模型”等措辞。',
  ].join('\n');
}

function getPersonaText(role: 'prosecutor' | 'defender' | 'judge'): string {
  const cands: any[] = [];
  if (role === 'prosecutor') {
    cands.push(
      (Personas as any).ProsecutorPersona?.zh,
      (Personas as any).ProsecutorPersona,
      (Personas as any).ProsecutorPrompt,
      (Personas as any).prosecutor,
      (Personas as any).prosecutorPrompt
    );
  } else if (role === 'defender') {
    cands.push(
      (Personas as any).DefenderPersona?.zh,
      (Personas as any).DefenderPersona,
      (Personas as any).DefenderPrompt,
      (Personas as any).defender,
      (Personas as any).defenderPrompt
    );
  } else {
    cands.push(
      (Personas as any).JudgePersona?.zh,
      (Personas as any).JudgePersona,
      (Personas as any).JudgePrompt,
      (Personas as any).judge,
      (Personas as any).judgePrompt
    );
  }
  const txt = cands.find((x) => typeof x === 'string' && x.trim().length > 0);
  return (txt as string) || '';
}

function userPrompt(topic: string) {
  const schema = `请严格输出如下 JSON 结构：
{
  "rounds": [
    { "prosecutor": "...", "defender": "..." },
    { "prosecutor": "...", "defender": "..." },
    { "prosecutor": "...", "defender": "..." }
  ],
  "summary": {
    "verdict": "guilty" | "not_guilty" | "hung",
    "lines": ["...", "...", "..."],
    "slogan": "..."
  }
}
生成约束：
- 不要在内容前加“检察官：/辩护人：/法官：”等标签；
- 每条发言 1–3 句；
- 不得加入“免责声明/作为AI/很抱歉”等无关语；
- 与主题强相关、与人设贴合。`;

  const ask = `【主题】${topic}
【目标】围绕主题生成 3 轮交锋（先检察官后辩护人），最后给出法官总结（3 金句 + 口号 + 判决）。
${schema}`;
  return ask;
}

export async function generateDebateLLM(topic: string): Promise<{ rounds: Round[]; summary: Summary }>
{
  try {
    const content = await chatComplete([
      { role: 'system', content: systemPrompt() },
      { role: 'system', content: `【检察官人设】\n${getPersonaText('prosecutor')}` },
      { role: 'system', content: `【辩护人人设】\n${getPersonaText('defender')}` },
      { role: 'system', content: `【法官人设】\n${getPersonaText('judge')}` },
      { role: 'system', content: styleRubric() },
      { role: 'user', content: userPrompt(topic) },
    ], { temperature: 1.5, max_tokens: 900 });
    const json = extractFirstJsonObject(content) as LLMResp;
    if (!json?.rounds?.length || !json.summary) throw new Error('Invalid JSON');
    // Simple type guard
    const rounds: Round[] = json.rounds.slice(0, 3).map(r => ({
      prosecutor: sanitizeLine(String(r.prosecutor || '')),
      defender: sanitizeLine(String(r.defender || '')),
    }));
    const summary: Summary = {
      verdict: json.summary.verdict,
      lines: (json.summary.lines?.slice(0, 3) || []).map((s: any) => sanitizeLine(String(s))),
      slogan: sanitizeLine(String(json.summary.slogan || '')),
    } as Summary;
    return { rounds, summary };
  } catch (e) {
    throw e;
  }
}

function sanitizeLine(s: string): string {
  let out = s.trim();
  // 去掉潜在标签前缀
  out = out.replace(/^([\u3010\[]?)(检察官|辩护人|法官)[:：】\]]\s*/g, '');
  // 去掉多余引号/代码围栏
  out = out.replace(/^"|"$/g, '').replace(/^'|'$/g, '').replace(/^```[\s\S]*?```$/g, '');
  // 限制长度，避免模型长篇输出
  if (out.length > 280) out = out.slice(0, 280);
  return out;
}
