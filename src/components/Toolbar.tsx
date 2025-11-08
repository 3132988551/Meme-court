import React from 'react';

interface Props {
  onNew: () => void;
  onCopy: () => Promise<void>;
  onCopyShare: () => Promise<void>;
  onExportPoster: () => Promise<void>;
  auto: boolean;
  onToggleAuto: () => void;
}

const Toolbar: React.FC<Props> = ({ onNew, onCopy, onCopyShare, onExportPoster, auto, onToggleAuto }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <button className="btn-cartoon bg-btnGreen hover:brightness-110" onClick={onNew}>
        开始新辩论
      </button>
      <button className="btn-cartoon bg-btnPink hover:brightness-110" onClick={onToggleAuto}>
        {auto ? '自动模式：开' : '自动模式：关'}
      </button>
      <button className="btn-cartoon bg-btnBlue hover:brightness-110" onClick={onCopy}>
        复制文本
      </button>
      <button className="btn-cartoon bg-judge hover:brightness-110" onClick={onCopyShare}>
        复制分享文案
      </button>
      <button className="btn-cartoon bg-prosecutor hover:brightness-110" onClick={onExportPoster}>
        生成海报
      </button>
    </div>
  );
};

export default Toolbar;
