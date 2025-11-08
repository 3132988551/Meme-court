import React from 'react';

interface Props {
  topic: string;
  onTopicChange: (v: string) => void;
  onStart: () => void;
  disabled?: boolean;
  showControls?: boolean;
}

const CaseHeader: React.FC<Props> = ({ topic, onTopicChange, onStart, disabled, showControls = true }) => {
  return (
    <header className="paper-card p-4 sm:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-extrabold title-cartoon">Meme法庭 · Meme Court</h1>
      </div>

      {topic.trim() && (
        <div className="bubble bg-white text-lg font-extrabold">
          {topic}
        </div>
      )}

      {showControls && (
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            className="flex-1 bubble bg-white placeholder:text-gray-400"
            placeholder="请输入辩论主题，如：轻百合不算gl"
            aria-label="请输入辩论主题"
          />
          <button
            className="btn-cartoon bg-btnPink whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={onStart}
            disabled={disabled}
          >
            开始辩论
          </button>
        </div>
      )}
    </header>
  );
};

export default CaseHeader;
