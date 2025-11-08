import { useRef, useCallback } from 'react';

// 轻量“法槌啪”音效：由 WebAudio 合成（无需外部资源）
export default function useGavelSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctxRef.current!;
  };

  const play = useCallback(() => {
    try {
      const ctx = ensureCtx();
      const t0 = ctx.currentTime + 0.02;

      // 短促的“啪”：噪声+低频击打
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        // 带指数衰减的白噪
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
      }
      noise.buffer = buffer;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, t0);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.08);

      const kick = ctx.createOscillator();
      kick.type = 'square';
      kick.frequency.setValueAtTime(220, t0);
      kick.frequency.exponentialRampToValueAtTime(55, t0 + 0.12);
      const kickGain = ctx.createGain();
      kickGain.gain.setValueAtTime(0.6, t0);
      kickGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);

      noise.connect(noiseGain).connect(ctx.destination);
      kick.connect(kickGain).connect(ctx.destination);

      noise.start(t0);
      noise.stop(t0 + 0.09);
      kick.start(t0);
      kick.stop(t0 + 0.14);
    } catch {
      // 忽略音频错误（如自动播放限制）
    }
  }, []);

  return play;
}

