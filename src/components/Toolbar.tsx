import React from 'react';
import Tooltip from '@/components/Tooltip';

interface Props {
  onNew: () => void;
  onCopy: () => Promise<void>;
  auto: boolean;
  onToggleAuto: () => void;
}

const Toolbar: React.FC<Props> = ({ onNew, onCopy, auto, onToggleAuto }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Tooltip label="重置并开始新的对局">
        <button className="btn-cartoon bg-btnGreen hover:brightness-110" onClick={onNew}>
          开始新辩论
        </button>
      </Tooltip>
      <Tooltip label="自动播放每句台词">
        <button className="btn-cartoon bg-btnPink hover:brightness-110" onClick={onToggleAuto}>
          {auto ? '自动模式：开' : '自动模式：关'}
        </button>
      </Tooltip>
      <Tooltip label="复制全场文本到剪贴板">
        <button className="btn-cartoon bg-btnBlue hover:brightness-110" onClick={onCopy}>
          复制文本
        </button>
      </Tooltip>
    </div>
  );
};

export default Toolbar;
