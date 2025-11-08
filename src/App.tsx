import React, { useEffect, useMemo, useState } from 'react';
import CaseHeader from '@/components/CaseHeader';
import Toolbar from '@/components/Toolbar';
import DebateStage, { Utterance } from '@/components/DebateStage';
import Poster from '@/components/Poster';
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
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [auto, setAuto] = useState<boolean>(true);
  const [started, setStarted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState<number>(0);
  const [exportingPoster, setExportingPoster] = useState<boolean>(false);
  const posterRef = React.useRef<HTMLDivElement | null>(null);
  const posterStageRef = React.useRef<HTMLDivElement | null>(null); // 离屏裁剪容器
  const posterContentRef = React.useRef<HTMLDivElement | null>(null); // 离屏完整内容

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
    const title = `【梗图法庭 · Meme Court】`;
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

  const shareCopy = useMemo(() => {
    if (!debate) return '';
    const picks = [
      `今天的法庭真精彩，我押${debate.summary?.verdict === 'not_guilty' ? '无罪' : debate.summary?.verdict === 'guilty' ? '有罪' : '摇摆'} ⚖️ #梗图法庭`,
      `${debate.topic}｜法官金句：${debate.summary?.lines?.[0] || ''} #梗图法庭`,
      `我把「${debate.topic}」拉上法庭了，判词：${debate.summary?.slogan || '不打无准备之仗'} ⚖️ #梗图法庭`,
    ].filter(Boolean);
    return picks[Math.floor(Math.random() * picks.length)];
  }, [debate]);

  const onCopyShare = async () => {
    const ok = await copyToClipboard(shareCopy || '梗图法庭 · Meme Court');
    setCopiedShare(ok);
    setTimeout(() => setCopiedShare(false), 1000);
  };

  const onExportPoster = async () => {
    if (!debate) { alert('请先完成一场辩论'); return; }
    setExportingPoster(true);
    await new Promise((r) => setTimeout(r, 0));
    try {
      const html2canvas = (await import('html2canvas')).default;
      const stage = posterStageRef.current!;
      const content = posterContentRef.current!;
      if (!stage || !content) throw new Error('Poster stage missing');

      const WIDTH = 1080; // 导出宽度（CSS px）
      const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      const MAX_OUTPUT = 16000; // 单图最大像素高度
      const SLICE_CSS = Math.floor(MAX_OUTPUT / scale); // 单片 CSS 高度

      stage.style.width = WIDTH + 'px';
      stage.style.overflow = 'hidden';
      content.style.transform = 'translateY(0)';
      const totalHeight = content.scrollHeight;
      const sliceCount = Math.max(1, Math.ceil(totalHeight / SLICE_CSS));

      const urls: string[] = [];
      for (let i = 0; i < sliceCount; i++) {
        const y = i * SLICE_CSS;
        const sliceHeight = Math.min(SLICE_CSS, totalHeight - y);
        stage.style.height = sliceHeight + 'px';
        content.style.transform = `translateY(-${y}px)`;
        const canvas = await html2canvas(stage, {
          backgroundColor: '#FFF8E8',
          scale,
          useCORS: true,
          foreignObjectRendering: true,
          windowWidth: WIDTH,
          windowHeight: sliceHeight,
          scrollX: 0,
          scrollY: 0,
          width: WIDTH,
          height: sliceHeight,
        });
        urls.push(canvas.toDataURL('image/png'));
      }

      const ts = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const base = `memecourt-${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}-${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}`;
      urls.forEach((url, idx) => {
        const a = document.createElement('a');
        const suffix = urls.length > 1 ? `-p${idx+1}of${urls.length}` : '';
        a.href = url;
        a.download = `${base}${suffix}.png`;
        a.click();
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      alert('生成海报失败：' + msg);
    } finally {
      if (posterContentRef.current) posterContentRef.current.style.transform = 'translateY(0)';
      setExportingPoster(false);
    }
  };

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
    <div ref={posterRef} className="relative max-w-3xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <CaseHeader
        topic={topic}
        onTopicChange={setTopic}
        onStart={startDebate}
        disabled={!canStart}
        showControls={!started && !exportingPoster}
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

      <footer className="paper-card p-4 sm:p-6" data-export-ignore="1">
        <Toolbar
          onNew={onNew}
          onCopy={onCopy}
          onCopyShare={onCopyShare}
          onExportPoster={onExportPoster}
          auto={auto}
          onToggleAuto={() => setAuto((v) => !v)}
        />
        {copied && <div className="text-center mt-2 text-sm">已复制文本！</div>}
        {copiedShare && <div className="text-center mt-2 text-sm">已复制分享文案！</div>}
      </footer>

      {/* 离屏 Poster 舞台：固定宽度 1080，完整高度；导出时分片裁剪 */}
      {debate && (
        <div
          ref={posterStageRef}
          style={{ position: 'fixed', left: 0, top: 0, zIndex: 2147483647, background: '#FFF8E8', opacity: 0, pointerEvents: 'none' }}
        >
          <div style={{ width: 1080, overflow: 'hidden' }}>
            <div ref={posterContentRef} style={{ willChange: 'transform' }}>
              <Poster debate={debate} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => <AppInner />;

export default App;
