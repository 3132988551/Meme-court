import React from 'react';

interface Props {
  topic: string;
  onTopicChange: (v: string) => void;
  onStart: () => void;
  disabled?: boolean;
  showControls?: boolean;
}

const CaseHeader: React.FC<Props> = ({ topic, onTopicChange, onStart, disabled, showControls = true }) => {
  const hasTopic = topic.trim().length > 0;
  const btnLabel = !hasTopic ? '开始辩论' : disabled ? '生成中…' : '生成辩论';
  return (
    <header className="paper-card p-4 sm:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-extrabold title-cartoon font-display">Meme法庭 · Meme Court</h1>
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
            className="flex-1 bubble bg-white placeholder:text-gray-400 focus:outline-none focus:ring-0"
            placeholder="请输入辩论主题，如：轻百合不算gl"
            aria-label="请输入辩论主题"
          />
          <button
            className="btn-cartoon bg-btnPink whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed min-w-[7rem] relative"
            onClick={onStart}
            disabled={disabled}
          >
            {btnLabel}
            {hasTopic && disabled && (
              <span className="absolute -right-3 -top-3 w-6 h-6 rounded-full border-1_5 border-black bg-white flex items-center justify-center">
                <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full inline-block animate-spin" />
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};

export default CaseHeader;
