import React, { useEffect, useMemo, useState } from 'react';

interface Props {
  seed?: number;
}

const LoadingCourtroom: React.FC<Props> = ({ seed = 0 }) => {
  const messages = useMemo(
    () => [
      '📜 法官正在敲定案件编号……',
      '⚖️ 检察官正在翻阅证据……',
      '🛡️ 辩护人正在组织语言……',
      '🔨 法官在喝咖啡观察双方气势……',
      '👩‍⚖️ 法官咳嗽了一声，准备宣判……',
    ],
    []
  );
  const [msg, setMsg] = useState<string>(messages[0]);

  useEffect(() => {
    setMsg(messages[0]);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      // 前2秒固定第0条；之后在中间的几条里切换
      if (i < 1) return setMsg(messages[0]);
      const pool = [messages[1], messages[2], messages[3]];
      setMsg(pool[Math.floor(Math.random() * pool.length)]!);
    }, 2000);
    return () => clearInterval(timer);
    // seed 变化时重置
  }, [seed, messages]);

  return (
    <section className="paper-card p-6 text-center select-none" aria-live="polite">
      <p className="font-semibold text-gray-900">{msg}</p>
      <p className="mt-2 animate-pulse text-lg">● ● ●</p>
    </section>
  );
};

export default LoadingCourtroom;

