import React from 'react';
import type { Role } from '@/types';
import AvatarIcon from '@/components/icons/Avatars';
import Tooltip from '@/components/Tooltip';

interface Props {
  role: Role;
  text: string;
  align?: 'left' | 'right';
  typing?: boolean;
}

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
      <Tooltip label={role === 'prosecutor' ? '检察官' : role === 'defender' ? '辩护人' : '法官'}>
        <div
          className={`w-12 h-12 min-w-12 rounded-full border-1_5 border-black flex items-center justify-center ${COLOR[role].bg} transition-transform duration-150 ease-in-out hover:-translate-y-0.5`}
          aria-label={role === 'prosecutor' ? '检察官头像' : role === 'defender' ? '辩护人头像' : '法官头像'}
        >
          <AvatarIcon role={role} className="w-7 h-7" />
        </div>
      </Tooltip>
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
