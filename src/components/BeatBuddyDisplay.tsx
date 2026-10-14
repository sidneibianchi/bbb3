/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * BeatBuddy LCD-style visual display screen.
 * Shows high-contrast song info, tempo, bar/beat visualizer, and dynamic color state
 * (Green = Part, Yellow = Fill, Red = Transition, Blue = Intro/Outro).
 */

import React from 'react';
import { SongPartId, TimeSignature } from '../types/rhythm';
import { Play, Pause, Zap } from 'lucide-react';

interface BeatBuddyDisplayProps {
  songName: string;
  partName: string;
  partId: SongPartId;
  basePartId?: SongPartId;
  selectedStartPart?: SongPartId;
  activeFillId?: SongPartId | null;
  activeTransitionId?: SongPartId | null;
  bpm: number;
  timeSignature: TimeSignature;
  currentBeat: number;
  currentBar: number;
  subdivision: number;
  isPlaying: boolean;
  isFill: boolean;
  isTransition: boolean;
  isOutro: boolean;
  isIntro?: boolean;
}

export const BeatBuddyDisplay: React.FC<BeatBuddyDisplayProps> = ({
  songName,
  partName,
  bpm,
  timeSignature,
  currentBeat,
  currentBar,
  subdivision,
  isPlaying,
  isFill,
  isTransition,
  isOutro,
  isIntro,
}) => {
  // Determine color theme based on BeatBuddy states
  let themeBg = 'bg-slate-900';
  let themeBorder = 'border-slate-700';
  let statusText = 'PRONTO';
  let statusBadgeBg = 'bg-slate-800 text-slate-300';
  let accentBarColor = 'bg-slate-600';

  if (!isPlaying) {
    statusText = 'PARADO';
    statusBadgeBg = 'bg-slate-800 text-slate-400';
  } else if (isOutro) {
    themeBg = 'bg-purple-950/90';
    themeBorder = 'border-purple-500';
    statusText = 'OUTRO / FINALIZANDO';
    statusBadgeBg = 'bg-purple-500 text-slate-950 font-black animate-pulse';
    accentBarColor = 'bg-purple-400';
  } else if (isIntro) {
    themeBg = 'bg-cyan-950/90';
    themeBorder = 'border-cyan-500';
    statusText = 'INTRO';
    statusBadgeBg = 'bg-cyan-500 text-slate-950 font-black';
    accentBarColor = 'bg-cyan-400';
  } else if (isTransition) {
    themeBg = 'bg-rose-950/90';
    themeBorder = 'border-rose-500';
    statusText = 'TRANSIÇÃO EM ANDAMENTO';
    statusBadgeBg = 'bg-rose-500 text-slate-950 font-black animate-pulse';
    accentBarColor = 'bg-rose-400';
  } else if (isFill) {
    themeBg = 'bg-amber-950/90';
    themeBorder = 'border-amber-400';
    statusText = 'VIRADA / FILL';
    statusBadgeBg = 'bg-amber-400 text-slate-950 font-black animate-pulse';
    accentBarColor = 'bg-amber-400';
  } else {
    // Regular part playing
    themeBg = 'bg-emerald-950/90';
    themeBorder = 'border-emerald-500';
    statusText = 'PARTE PRINCIPAL ATIVA';
    statusBadgeBg = 'bg-emerald-500 text-slate-950 font-black';
    accentBarColor = 'bg-emerald-400';
  }

  // Parse beats in bar from time signature
  const beatsPerBar = parseInt((timeSignature || '4/4').split('/')[0], 10) || 4;

  return (
    <div
      className={`relative w-full rounded-2xl border-2 ${themeBorder} ${themeBg} p-4 sm:p-5 shadow-2xl transition-colors duration-200 overflow-hidden flex flex-col justify-between`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-extrabold ${statusBadgeBg}`}
          >
            {statusText}
          </span>
          <h2 className="text-sm sm:text-base font-black tracking-tight text-white truncate max-w-[200px] sm:max-w-xs">
            {songName || 'Ritmo'}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm font-mono font-bold">
          <div className="flex items-center gap-1 text-slate-300">
            <span className="text-slate-400 text-[10px] font-sans uppercase">Compasso:</span>
            <span className="text-amber-400">{timeSignature}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/10">
            <span className="text-amber-400 text-sm sm:text-base font-black">{bpm}</span>
            <span className="text-slate-400 text-[10px]">BPM</span>
          </div>
          {isPlaying ? (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600 inline-block"></span>
          )}
        </div>
      </div>

      {/* Main Center Section: Giant Part Name */}
      <div className="py-2 sm:py-4 flex flex-col items-center justify-center text-center">
        <div className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-semibold mb-0.5 flex items-center gap-1">
          {isPlaying ? <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3 h-3 text-slate-500" />}
          <span>{isPlaying ? 'Reproduzindo' : 'Pronto para Iniciar'}</span>
        </div>
        <div className="text-2xl sm:text-4xl font-black text-white tracking-wide uppercase drop-shadow-md">
          {partName || 'Parte A'}
        </div>
      </div>

      {/* Bottom Row: Beat & Bar Progress Bars */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-sans text-[11px]">Compasso:</span>
            <span className="font-extrabold text-white text-sm">#{Math.max(1, currentBar)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-sans text-[11px]">Tempo:</span>
            <span className="font-extrabold text-amber-400 text-sm">
              {Math.max(1, currentBeat)} / {beatsPerBar}
            </span>
          </div>
        </div>

        {/* Visual Beat Blocks */}
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${beatsPerBar}, minmax(0, 1fr))` }}>
          {Array.from({ length: beatsPerBar }).map((_, beatIdx) => {
            const isCurrentBeat = isPlaying && currentBeat === beatIdx + 1;
            return (
              <div
                key={beatIdx}
                className={`h-4 sm:h-5 rounded-lg border flex items-center justify-center transition-all ${
                  isCurrentBeat
                    ? `${accentBarColor} border-white shadow-lg shadow-emerald-500/30 scale-105`
                    : 'bg-black/40 border-white/10 opacity-60'
                }`}
              >
                <span
                  className={`text-[10px] font-black ${
                    isCurrentBeat ? 'text-slate-950 font-black' : 'text-slate-400'
                  }`}
                >
                  {beatIdx + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* Subdivision indicator dots (16ths) */}
        <div className="flex justify-center items-center gap-1.5 pt-1">
          {[0, 1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                isPlaying && subdivision === dot
                  ? 'bg-amber-400 scale-150'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
