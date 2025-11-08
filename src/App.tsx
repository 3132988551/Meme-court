import React, { useEffect, useMemo, useState } from 'react';
import CaseHeader from '@/components/CaseHeader';
import Toolbar from '@/components/Toolbar';
import DebateStage, { Utterance } from '@/components/DebateStage';
import LoadingCourtroom from '@/components/LoadingCourtroom';
import { copyToClipboard } from '@/utils/copy';
import { generateDebateLLM } from '@/ai/generator';
import type { DebateCase } from '@/types';

const AppInner: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [debate, setDebate] = useState<DebateCase | null>(null);
  const [utterances, setUtterances] = useState<Utterance[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  // 分享文案功能已移除
  const [auto, setAuto] = useState<boolean>(true);
  const [started, setStarted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState<number>(0);
  // 海报导出功能已移除

  const canStart = topic.trim().length > 0 && !isGenerating;

  const startDebate = async () => {
    if (!topic.trim()) {
      alert('请先输入辩论主题');
      return;
    }
    setStarted(true);
    setIsGenerating(true);
    setError(null);
    setLoadingKey((k) => k + 1);
    try {
      const { rounds, summary } = await generateDebateLLM(topic);
      const base: DebateCase = { topic: topic.trim(), rounds, summary };
      setDebate(base);
      const seq: Utterance[] = rounds.flatMap((r) => [
        { role: 'prosecutor', text: r.prosecutor },
        { role: 'defender', text: r.defender },
      ]);
      const verdictText = summary.verdict === 'guilty' ? '有罪' : summary.verdict === 'not_guilty' ? '无罪' : '争议保留';
      const judgeMsg = `法官总结：${summary.lines.join(' ')}\n${summary.slogan}（${verdictText}）`;
      seq.push({ role: 'judge', text: judgeMsg });
      setUtterances(seq);
      setVisibleCount(0);
    } catch (e) {
      setStarted(false);
      const msg = e instanceof Error ? e.message : String(e);
      setError(`生成失败：${msg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const onNew = () => {
    setTopic('');
    setDebate(null);
    setUtterances([]);
    setVisibleCount(0);
    setAuto(true);
    setStarted(false);
    setError(null);
  };

  const plainText = useMemo(() => {
    if (!debate) return '';
    const title = `【Meme法庭 · Meme Court】`;
    const header = `${title}\n${debate.topic}\n`;
    const body = debate.rounds
      .map((r, i) => {
        const head = `第 ${i + 1} 轮`;
        return [
          head,
          `检察官: ${r.prosecutor}`,
          `辩护人: ${r.defender}`,
        ].join('\n');
      })
      .join('\n\n');
    const tail = debate.summary
      ? `\n\n法官总结: ${debate.summary.lines.join(' ')}\n${debate.summary.slogan} (${debate.summary.verdict === 'guilty' ? '有罪' : debate.summary.verdict === 'not_guilty' ? '无罪' : '争议保留'})`
      : '';
    return header + body + tail;
  }, [debate]);

  const onCopy = async () => {
    const ok = await copyToClipboard(plainText);
    setCopied(ok);
    setTimeout(() => setCopied(false), 1000);
  };

  // 分享文案与海报导出相关逻辑已移除

  // 海报功能已移除

  // 无 i18n 依赖
  // Auto mode: reveal next every 1.5s
  useEffect(() => {
    if (!auto) return;
    if (!utterances.length) return;
    const timer = setInterval(() => {
      setVisibleCount((n) => (n < utterances.length ? n + 1 : n));
    }, 1500);
    return () => clearInterval(timer);
  }, [auto, utterances.length]);

  const next = () => {
    setVisibleCount((n) => (n < utterances.length ? n + 1 : n));
  };

  return (
    <div className="relative max-w-3xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <CaseHeader
        topic={topic}
        onTopicChange={setTopic}
        onStart={startDebate}
        disabled={!canStart}
        showControls={!started}
      />

      {isGenerating && (<LoadingCourtroom seed={loadingKey} />)}
      {error && (
        <div className="paper-card p-4 text-sm">
          <div className="font-bold mb-1">出错了</div>
          <div className="text-[14px] leading-6">{error}</div>
        </div>
      )}

      {debate && (
        <DebateStage
          utterances={utterances}
          visibleCount={visibleCount}
          onNext={next}
          disabled={isGenerating}
          hideHint={utterances[Math.max(0, Math.min(visibleCount - 1, utterances.length - 1))]?.role === 'judge'}
        />
      )}

      <footer className="paper-card p-4 sm:p-6">
        <Toolbar
          onNew={onNew}
          onCopy={onCopy}
          auto={auto}
          onToggleAuto={() => setAuto((v) => !v)}
        />
        {copied && <div className="text-center mt-2 text-sm">已复制文本！</div>}
      </footer>

    </div>
  );
};

const App: React.FC = () => <AppInner />;

export default App;
