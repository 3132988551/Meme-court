import React from 'react';
import type { Summary } from '@/types';
import RoleBubble from '@/components/RoleBubble';

interface Props {
  summary: Summary;
}

const JudgeSummary: React.FC<Props> = ({ summary }) => {
  const verdictText = summary.verdict === 'guilty' ? '有罪' : summary.verdict === 'not_guilty' ? '无罪' : '争议保留';

  return (
    <section className="paper-card p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-extrabold">⚖️</div>
        <h2 className="text-lg sm:text-xl font-extrabold">法官总结</h2>
      </div>
      <RoleBubble role="judge" text={summary.lines.join(' ')} />
      <div className="text-center">
        <div className="inline-block bubble bg-judge">
          <div className="text-base sm:text-lg font-extrabold">{verdictText}</div>
          <div className="text-xl sm:text-2xl font-black mt-1">{summary.slogan}</div>
        </div>
      </div>
    </section>
  );
};

export default JudgeSummary;
