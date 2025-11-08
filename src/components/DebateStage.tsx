import React from 'react';
import RoleBubble from '@/components/RoleBubble';
import type { Role } from '@/types';

export interface Utterance { role: Role; text: string }

interface Props {
  utterances: Utterance[];
  visibleCount: number;
  onNext: () => void;
  disabled?: boolean;
  hideHint?: boolean;
}

const DebateStage: React.FC<Props> = ({ utterances, visibleCount, onNext, disabled, hideHint }) => {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [typedMap, setTypedMap] = React.useState<Record<number, number>>({});
  const handleClick: React.MouseEventHandler = () => {
    if (disabled) return;
    onNext();
  };
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    // 若接近底部则自动滚动
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [visibleCount]);

  // Typewriter effect for the latest visible utterance
  React.useEffect(() => {
    const idx = visibleCount - 1;
    if (idx < 0 || idx >= utterances.length) return;
    const full = utterances[idx].text;
    // if already fully typed, skip
    if ((typedMap[idx] ?? 0) >= full.length) return;
    let raf = 0;
    let start = 0;
    const duration = Math.min(1200, Math.max(300, full.length * 16)); // finish within ~0.3–1.2s
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const len = Math.floor(full.length * p);
      setTypedMap((prev) => ({ ...prev, [idx]: len }));
      // keep scrolled to bottom while typing
      const el = listRef.current;
      if (el) el.scrollTop = el.scrollHeight;
      if (len < full.length) raf = requestAnimationFrame(tick);
    };
    setTypedMap((prev) => ({ ...prev, [idx]: 0 }));
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visibleCount, utterances]);

  return (
    <section
      className="paper-card p-0 select-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.code === 'Space' || e.key === ' ') onNext();
      }}
      onClick={handleClick}
    >
      <div ref={listRef} className="h-[420px] sm:h-[520px] overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {utterances.slice(0, visibleCount).map((u, idx) => {
          const isCurrent = idx === visibleCount - 1;
          const typedLen = typedMap[idx] ?? (isCurrent ? 0 : u.text.length);
          const displayText = isCurrent ? u.text.slice(0, typedLen) : u.text;
          return (
            <RoleBubble key={idx} role={u.role} text={displayText} align={u.role === 'defender' ? 'right' : 'left'} typing={isCurrent && typedLen < u.text.length} />
          );
        })}
      </div>
      {!hideHint && (
        <div className="text-center text-xs text-gray-600 py-2 border-t border-black">
          点击空白处或按空格 → 下一句
        </div>
      )}
    </section>
  );
};

export default DebateStage;
