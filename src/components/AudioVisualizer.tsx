/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Real-time audio spectrum & VU meter visualizer using Web Audio AnalyserNode.
 */

import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../audio/AudioEngine';

export const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const analyser = audioEngine.getAnalyser();
      if (!analyser) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animId = requestAnimationFrame(render);
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.8;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        // Gradient from amber to emerald to rose
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#10b981'); // emerald
        gradient.addColorStop(0.6, '#f59e0b'); // amber
        gradient.addColorStop(1, '#ef4444'); // rose

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full h-10 bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-1">
      <canvas ref={canvasRef} width={280} height={36} className="w-full h-full" />
    </div>
  );
};
