import React from 'react';
import type { DebateCase, Role } from '@/types';

interface PosterProps {
  debate: DebateCase;
}

const EMOJI: Record<Role, string> = {
  prosecutor: '🧑‍💼',
  defender: '🧑‍🎓',
  judge: '👩‍⚖️',
};

const BG_BY_ROLE: Record<Role, string> = {
  prosecutor: 'bg-prosecutor',
  defender: 'bg-defender',
  judge: 'bg-judge',
};

const PosterBubble: React.FC<{ role: Role; text: string; align?: 'left' | 'right' }>
  = ({ role, text, align = 'left' }) => {
  const dir = align === 'right' ? 'justify-end' : 'justify-start';
  const order = align === 'right' ? 'flex-row-reverse' : 'flex-row';
  return (
    <div className={`flex items-start gap-4 ${dir} ${order}`}>
      <div className={`w-14 h-14 min-w-14 rounded-full border-1_5 border-black flex items-center justify-center text-2xl ${BG_BY_ROLE[role]}`}>
        <span aria-hidden>{EMOJI[role]}</span>
      </div>
      <div className={`bubble ${BG_BY_ROLE[role]} flex-1 px-6 py-5` }>
        <div className="text-base font-extrabold mb-1">{role === 'prosecutor' ? '检察官' : role === 'defender' ? '辩护人' : '法官'}</div>
        <div className="text-[16px] leading-7 break-words whitespace-pre-wrap">{text}</div>
      </div>
    </div>
  );
};

const Poster: React.FC<PosterProps> = ({ debate }) => {
  const verdictText = debate.summary?.verdict === 'guilty'
    ? '有罪'
    : debate.summary?.verdict === 'not_guilty'
      ? '无罪'
      : '争议保留';

  return (
    <div
      data-poster-root
      className="paper-card bg-milky w-[1080px] mx-auto p-8"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold title-cartoon">梗图法庭 · Meme Court</h1>
      </div>
      <div className="bubble bg-white text-2xl font-extrabold mb-6 break-words">
        {debate.topic}
      </div>

      {/* Conversation */}
      <div className="space-y-6">
        {debate.rounds.map((r, i) => (
          <div key={i} className="space-y-6">
            <PosterBubble role="prosecutor" text={r.prosecutor} align="left" />
            <PosterBubble role="defender" text={r.defender} align="right" />
          </div>
        ))}
      </div>

      {/* Judge summary */}
      {debate.summary && (
        <div className="mt-8 space-y-4">
          <div className="bubble bg-judge">
            <div className="font-extrabold mb-1">法官总结</div>
            <ul className="list-disc pl-5 text-[16px] leading-7">
              {(debate.summary.lines || []).slice(0,3).map((line, idx) => (
                <li key={idx} className="break-words">{line}</li>
              ))}
            </ul>
          </div>
          <div className="bubble bg-judge text-xl font-extrabold">
            {debate.summary.slogan}（{verdictText}）
          </div>
        </div>
      )}

      {/* Watermark */}
      <div className="mt-8 text-center poster-watermark select-none">
        梗图法庭 · Meme Court ｜ memecourt.vercel.app
      </div>
    </div>
  );
};

export default Poster;

