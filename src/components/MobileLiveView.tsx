/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Live mobile & stage performance view for BeatBuddy Studio.
 */

import React, { useState } from 'react';
import { SongProject, SongPartId } from '../types/rhythm';
import {
  Volume2,
  Sliders,
  Play,
  Pause,
  Square,
  Zap,
  ChevronLeft,
  ChevronRight,
  Settings,
  Music,
} from 'lucide-react';

interface MobileLiveViewProps {
  project: SongProject;
  rhythms: SongProject[];
  onSelectProject: (preset: SongProject) => void;
  masterVolume: number;
  onMasterVolumeChange: (vol: number) => void;
  onBpmChange: (bpm: number) => void;
  isPlaying: boolean;
  currentBeat: number;
  currentBar: number;
  isIntro?: boolean;
  isOutro?: boolean;
  isFill?: boolean;
  isTransition?: boolean;
  activeFillId?: SongPartId | null;
  activeTransitionId?: SongPartId | null;
  selectedStartPart?: SongPartId;
  basePartId?: SongPartId;
  onPedal1Down: (isExternal?: boolean) => void;
  onPedal1Up: () => void;
  onPedal2Down: () => void;
  onPedal2Up: () => void;
  isPedal1Pressed: boolean;
  isPedal2Pressed: boolean;
  isPedalEnabled: boolean;
  onTogglePedalEnabled: () => void;
  onOpenFootswitchModal: () => void;
  onOpenStudioView: () => void;
  isAudioUnlocked: boolean;
  onUnlockAudio: () => void;
}

export const MobileLiveView: React.FC<MobileLiveViewProps> = ({
  project,
  rhythms,
  onSelectProject,
  masterVolume,
  onMasterVolumeChange,
  onBpmChange,
  isPlaying,
  currentBeat,
  currentBar,
  isIntro,
  isOutro,
  isFill,
  isTransition,
  onPedal1Down,
  onPedal1Up,
  onPedal2Down,
  onPedal2Up,
  isPedal1Pressed,
  isPedal2Pressed,
  isPedalEnabled,
  onTogglePedalEnabled,
  onOpenFootswitchModal,
  onOpenStudioView,
  isAudioUnlocked,
  onUnlockAudio,
}) => {
  const [isP1Touched, setIsP1Touched] = useState(false);
  const [isP2Touched, setIsP2Touched] = useState(false);

  // Status colors
  let statusBg = 'bg-slate-900 border-slate-700';
  let statusText = 'PRONTO';
  let badgeColor = 'bg-slate-800 text-slate-300';

  if (!isPlaying) {
    statusText = 'PARADO';
  } else if (isOutro) {
    statusBg = 'bg-purple-950 border-purple-500';
    statusText = 'FINALIZANDO (OUTRO)';
    badgeColor = 'bg-purple-500 text-slate-950';
  } else if (isIntro) {
    statusBg = 'bg-cyan-950 border-cyan-500';
    statusText = 'INTRO';
    badgeColor = 'bg-cyan-500 text-slate-950';
  } else if (isTransition) {
    statusBg = 'bg-rose-950 border-rose-500';
    statusText = 'TRANSIÇÃO EM ANDAMENTO';
    badgeColor = 'bg-rose-500 text-slate-950 animate-pulse';
  } else if (isFill) {
    statusBg = 'bg-amber-950 border-amber-400';
    statusText = 'VIRADA / FILL';
    badgeColor = 'bg-amber-400 text-slate-950 animate-pulse';
  } else {
    statusBg = 'bg-emerald-950 border-emerald-500';
    statusText = 'PARTE PRINCIPAL';
    badgeColor = 'bg-emerald-500 text-slate-950';
  }

  const beatsPerBar = parseInt((project.timeSignature || '4/4').split('/')[0], 10) || 4;

  const currentIndex = rhythms.findIndex((r) => r.id === project.id);
  const handlePrevRhythm = () => {
    if (rhythms.length <= 1) return;
    const prevIdx = (currentIndex - 1 + rhythms.length) % rhythms.length;
    onSelectProject(rhythms[prevIdx]);
  };
  const handleNextRhythm = () => {
    if (rhythms.length <= 1) return;
    const nextIdx = (currentIndex + 1) % rhythms.length;
    onSelectProject(rhythms[nextIdx]);
  };

  const p1Active = isP1Touched || isPedal1Pressed;
  const p2Active = isP2Touched || isPedal2Pressed;

  return (
    <div className="flex flex-col h-full bg-[#050811] text-white p-3 select-none justify-between overflow-hidden">
      {/* Audio unlock banner if needed */}
      {!isAudioUnlocked && (
        <button
          type="button"
          onClick={onUnlockAudio}
          className="w-full bg-emerald-500 text-slate-950 font-black text-xs py-2 px-3 rounded-xl mb-2 text-center animate-bounce shadow-lg cursor-pointer"
        >
          🔊 Toque para ativar som no celular
        </button>
      )}

      {/* Top Navbar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={onOpenStudioView}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 rounded-lg hover:text-white"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>Editor Grade</span>
        </button>

        {/* Rhythm Switcher */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevRhythm}
            className="p-1 text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center px-1">
            <div className="text-xs font-black text-white truncate max-w-[140px]">
              {project.name}
            </div>
            <div className="text-[10px] text-amber-400 font-mono">
              {project.timeSignature} • {project.bpm} BPM
            </div>
          </div>
          <button
            type="button"
            onClick={handleNextRhythm}
            className="p-1 text-slate-400 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenFootswitchModal}
          className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg"
          title="Configurar Pedal"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Visual Display */}
      <div className={`p-4 rounded-2xl border-2 ${statusBg} flex flex-col justify-between my-2 shadow-xl`}>
        <div className="flex items-center justify-between text-xs">
          <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${badgeColor}`}>
            {statusText}
          </span>
          <div className="font-mono text-amber-400 font-bold">
            Compasso #{Math.max(1, currentBar)} • Tempo {Math.max(1, currentBeat)}/{beatsPerBar}
          </div>
        </div>

        <div className="text-center py-2">
          <div className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
            {project.parts['verse']?.name || 'Parte A'}
          </div>
        </div>

        {/* Visual Beats */}
        <div
          className="grid gap-1.5 pt-1"
          style={{ gridTemplateColumns: `repeat(${beatsPerBar}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: beatsPerBar }).map((_, idx) => {
            const isHit = isPlaying && currentBeat === idx + 1;
            return (
              <div
                key={idx}
                className={`h-3 rounded-full transition-all ${
                  isHit ? 'bg-amber-400 shadow-md scale-105' : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Tempo & Volume Sliders */}
      <div className="grid grid-cols-2 gap-3 bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
            <span>BPM:</span>
            <span className="font-mono text-amber-400">{project.bpm}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onBpmChange(Math.max(40, project.bpm - 1))}
              className="px-2 py-0.5 bg-slate-800 rounded text-xs font-bold"
            >
              -
            </button>
            <input
              type="range"
              min={50}
              max={220}
              value={project.bpm}
              onChange={(e) => onBpmChange(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <button
              type="button"
              onClick={() => onBpmChange(Math.min(260, project.bpm + 1))}
              className="px-2 py-0.5 bg-slate-800 rounded text-xs font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-amber-400" />
              <span>Volume:</span>
            </span>
            <span className="font-mono text-amber-400">{Math.round(masterVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={masterVolume}
            onChange={(e) => onMasterVolumeChange(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>
      </div>

      {/* GIANT LIVE PEDAL BUTTONS */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {/* Pedal 1 (Main - Spans 2 cols) */}
        <button
          type="button"
          onMouseDown={() => {
            setIsP1Touched(true);
            onPedal1Down(false);
          }}
          onMouseUp={() => {
            setIsP1Touched(false);
            onPedal1Up();
          }}
          onTouchStart={() => {
            setIsP1Touched(true);
            onPedal1Down(false);
          }}
          onTouchEnd={() => {
            setIsP1Touched(false);
            onPedal1Up();
          }}
          className={`col-span-2 h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-2 font-black transition-all cursor-pointer shadow-2xl active:scale-95 ${
            p1Active
              ? 'bg-amber-400 border-white text-slate-950 scale-98'
              : isPlaying
              ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-600 text-white'
              : 'bg-emerald-600 border-emerald-400 text-white'
          }`}
        >
          <div className="text-base uppercase tracking-wider">
            {!isPlaying ? '▶ Iniciar' : isTransition ? 'Trocando...' : isFill ? 'Virada' : 'Pedal 1 (Fill/Trans)'}
          </div>
          <div className="text-[10px] opacity-80 font-normal mt-0.5 text-center">
            Toque = Virada • Segure = Trocar Parte
          </div>
        </button>

        {/* Pedal 2 (Crash / Accent / Stop) */}
        <button
          type="button"
          onMouseDown={() => {
            setIsP2Touched(true);
            onPedal2Down();
          }}
          onMouseUp={() => {
            setIsP2Touched(false);
            onPedal2Up();
          }}
          onTouchStart={() => {
            setIsP2Touched(true);
            onPedal2Down();
          }}
          onTouchEnd={() => {
            setIsP2Touched(false);
            onPedal2Up();
          }}
          className={`h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-2 font-black transition-all cursor-pointer shadow-lg active:scale-95 ${
            p2Active
              ? 'bg-amber-400 border-white text-slate-950 scale-98'
              : 'bg-slate-900 border-slate-700 text-amber-300'
          }`}
        >
          <Zap className="w-5 h-5 mb-1" />
          <div className="text-xs uppercase">Acento Crash</div>
          <div className="text-[9px] text-slate-400 font-normal">Pedal 2</div>
        </button>
      </div>
    </div>
  );
};
