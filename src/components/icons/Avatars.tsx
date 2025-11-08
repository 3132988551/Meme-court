import React from 'react';
import type { Role } from '@/types';

interface Props {
  role: Role;
  className?: string;
}

// 简约卡通头像：黑描边 + 角色色块
export const AvatarIcon: React.FC<Props> = ({ role, className }) => {
  const stroke = '#000000';
  const fillMap: Record<Role, string> = {
    prosecutor: '#FFB5C2',
    defender: '#A6D8FF',
    judge: '#FFE577',
  };
  const accentMap: Record<Role, string> = {
    prosecutor: '#C63E4A',
    defender: '#3178C6',
    judge: '#E49D3B',
  };
  const labelMap: Record<Role, string> = {
    prosecutor: '检',
    defender: '辩',
    judge: '法',
  };

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden
      role="img"
    >
      <circle cx="20" cy="20" r="18" fill={fillMap[role]} stroke={stroke} strokeWidth={1.5} />
      {/* 简单的笑脸 */}
      <circle cx="15" cy="16" r="2" fill={stroke} />
      <circle cx="25" cy="16" r="2" fill={stroke} />
      <path d="M14 24 q6 6 12 0" fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
      {/* 角色小饰品 */}
      {role === 'prosecutor' && (
        <path d="M8 10 h10 v4 h-10 z" fill={accentMap[role]} stroke={stroke} strokeWidth={1.5} />
      )}
      {role === 'defender' && (
        <path d="M28 9 l6 4 l-6 4 z" fill={accentMap[role]} stroke={stroke} strokeWidth={1.5} />
      )}
      {role === 'judge' && (
        <g>
          <rect x="5" y="8" width="8" height="4" rx="1" fill={accentMap[role]} stroke={stroke} strokeWidth={1.5} />
          <rect x="10" y="11" width="12" height="3" rx="1" fill={stroke} />
        </g>
      )}
      {/* 中心字标 */}
      <g>
        <circle cx="32" cy="32" r="7" fill="#fff" stroke={stroke} strokeWidth={1.5} />
        <text x="32" y="35" textAnchor="middle" fontSize="9" fontWeight={900} fontFamily="inherit" fill={stroke}>
          {labelMap[role]}
        </text>
      </g>
    </svg>
  );
};

export default AvatarIcon;

