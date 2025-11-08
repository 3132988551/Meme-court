import React from 'react';
import type { Role } from '@/types';

interface Props {
  role: Role;
  text: string;
  align?: 'left' | 'right';
  typing?: boolean;
}

const EMOJI: Record<Role, string> = {
  prosecutor: '🧑‍💼',
  defender: '🧑‍🎓',
  judge: '👩‍⚖️',
};

const COLOR: Record<Role, { bg: string }> = {
  prosecutor: { bg: 'bg-prosecutor' },
  defender: { bg: 'bg-defender' },
  judge: { bg: 'bg-judge' },
};

const RoleBubble: React.FC<Props> = ({ role, text, align = 'left', typing = false }) => {
  const dir = align === 'right' ? 'justify-end' : 'justify-start';
  const order = align === 'right' ? 'flex-row-reverse' : 'flex-row';
  return (
    <div className={`flex items-start gap-4 ${dir} ${order}`}>
      <div className={`w-12 h-12 min-w-12 rounded-full border-1_5 border-black flex items-center justify-center text-2xl ${COLOR[role].bg}`}>
        <span aria-hidden>{EMOJI[role]}</span>
      </div>
      <div className={`bubble ${COLOR[role].bg} flex-1 px-5 py-4` }>
        <div className="text-sm font-bold mb-1">{role === 'prosecutor' ? '检察官' : role === 'defender' ? '辩护人' : '法官'}</div>
        <div className="text-[15px] text-left">
          {text}
          {typing && <span className="type-caret ml-1"></span>}
        </div>
      </div>
    </div>
  );
};

export default RoleBubble;
