import React from 'react';

interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
}

// 轻量悬浮提示：group-hover 出现
const Tooltip: React.FC<Props> = ({ label, children, className }) => {
  return (
    <span className={`relative inline-flex items-center group ${className ?? ''}`}>
      {children}
      <span
        className="tooltip opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-transform transition-opacity duration-150 ease-out"
        role="tooltip"
      >
        {label}
      </span>
    </span>
  );
};

export default Tooltip;

