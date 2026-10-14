/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * BeatBuddy interactive hardware-style pedal footswitch controller.
 */

import React, { useState, useRef } from 'react';
import { SongPartId } from '../types/rhythm';
import { Settings, Volume2, Square, Zap } from 'lucide-react';

interface PedalControllerProps {
  isPlaying: boolean;
  currentPartId: SongPartId;
  basePartId?: SongPartId;
  selectedStartPart?: SongPartId;
  isFill: boolean;
  isTransition: boolean;
  isOutro: boolean;
  isIntro?: boolean;
  activeFillId?: SongPartId | null;
  activeTransitionId?: SongPartId | null;
  isExternalPedal1Pressed: boolean;
  isExternalPedal2Pressed: boolean;
  onPedal1Down: () => void;
  onPedal1Up: () => void;
  onPedal2Down: () => void;
  onPedal2Up: () => void;
  onPedal1Tap: () => void;
  onPedal1HoldStart: () => void;
  onPedal2Tap: () => void;
  onStop: () => void;
  onOpenFootswitchConfig: () => void;
  isPedalEnabled: boolean;
  onTogglePedalEnabled: () => void;
}

export const PedalController: React.FC<PedalControllerProps> = ({
  isPlaying,
  isFill,
  isTransition,
  isOutro,
  isExternalPedal1Pressed,
  isExternalPedal2Pressed,
  onPedal1Down,
  onPedal1Up,
  onPedal2Down,
  onPedal2Up,
  onStop,
  onOpenFootswitchConfig,
  isPedalEnabled,
  onTogglePedalEnabled,
}) => {
  const [isPedal1Active, setIsPedal1Active] = useState(false);
  const [isPedal2Active, setIsPedal2Active] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleP1MouseDown = () => {
    setIsPedal1Active(true);
    onPedal1Down();
  };

  const handleP1MouseUp = () => {
    setIsPedal1Active(false);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    onPedal1Up();
  };

  const handleP2MouseDown = () => {
    setIsPedal2Active(true);
    onPedal2Down();
  };

  const handleP2MouseUp = () => {
    setIsPedal2Active(false);
    onPedal2Up();
  };

  const p1Pressed = isPedal1Active || isExternalPedal1Pressed;
  const p2Pressed = isPedal2Active || isExternalPedal2Pressed;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      {/* Header bar with pedal status and config */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isPedalEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
            }`}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Controle de Pedal / Footswitch
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            Cuvave / Teclado
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePedalEnabled}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
              isPedalEnabled
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isPedalEnabled ? 'Pedal Ativo' : 'Pedal Inativo'}
          </button>
          <button
            type="button"
            onClick={onOpenFootswitchConfig}
            title="Configurar Pedal e Atalhos"
            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Dual Pedal Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PEDAL 1: Main BeatBuddy Footswitch */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-bold text-slate-200">Pedal Principal (Toque / Segure)</span>
            <span className="font-mono text-[11px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-amber-400">
              Espaço / PageDown
            </span>
          </div>

          <button
            type="button"
            onMouseDown={handleP1MouseDown}
            onMouseUp={handleP1MouseUp}
            onTouchStart={handleP1MouseDown}
            onTouchEnd={handleP1MouseUp}
            className={`w-full h-32 sm:h-36 rounded-2xl flex flex-col items-center justify-center gap-2 font-black transition-all cursor-pointer select-none border-2 shadow-2xl relative overflow-hidden active:scale-95 ${
              p1Pressed
                ? 'bg-amber-500 border-white text-slate-950 shadow-amber-500/50 scale-98 translate-y-1'
                : isFill
                ? 'bg-amber-600/80 border-amber-400 text-white animate-pulse'
                : isTransition
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                : isPlaying
                ? 'bg-gradient-to-b from-slate-800 to-slate-950 border-slate-700 text-white hover:border-amber-400/60'
                : 'bg-gradient-to-b from-emerald-700 to-emerald-900 border-emerald-500 text-white hover:brightness-110'
            }`}
          >
            {/* Visual Footswitch Pad */}
            <div className="w-16 h-4 bg-black/40 rounded-full border border-white/20 mb-1 flex items-center justify-center">
              <div
                className={`w-8 h-1 rounded-full ${
                  p1Pressed ? 'bg-amber-300' : 'bg-slate-500'
                }`}
              />
            </div>

            <div className="text-base sm:text-lg uppercase tracking-wider drop-shadow">
              {!isPlaying ? '▶ Iniciar Ritmo' : isTransition ? '🔄 Trocando Parte...' : isFill ? '⚡ Executando Virada' : '🦶 Toque = Virada / Segure = Transição'}
            </div>

            <div className="text-[11px] font-sans font-medium opacity-80 max-w-xs text-center px-4">
              {!isPlaying
                ? 'Clique para começar com a Intro ou Parte A'
                : '1 Toque: Virada (Fill) • Segurar: Transição para próxima parte • 2 Toques: Parar/Outro'}
            </div>
          </button>
        </div>

        {/* PEDAL 2: Aux / Accent / Stop Footswitch */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-bold text-slate-200">Pedal 2 (Acento / Parar)</span>
            <span className="font-mono text-[11px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-amber-400">
              Enter / PageUp
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 h-32 sm:h-36">
            {/* Accent Hit Button */}
            <button
              type="button"
              onMouseDown={handleP2MouseDown}
              onMouseUp={handleP2MouseUp}
              onTouchStart={handleP2MouseDown}
              onTouchEnd={handleP2MouseUp}
              className={`h-full rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold transition-all cursor-pointer select-none border-2 shadow-lg active:scale-95 ${
                p2Pressed
                  ? 'bg-amber-400 border-white text-slate-950 translate-y-1 shadow-amber-400/40'
                  : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-amber-400 hover:text-white'
              }`}
            >
              <Zap className={`w-6 h-6 ${p2Pressed ? 'text-slate-950 fill-slate-950' : 'text-amber-400'}`} />
              <span className="text-xs uppercase tracking-wider font-extrabold">Acento Crash</span>
              <span className="text-[10px] text-slate-400 font-normal">Batida imediata</span>
            </button>

            {/* Instant Stop Button */}
            <button
              type="button"
              onClick={onStop}
              className="h-full rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold transition-all cursor-pointer select-none border-2 border-rose-900/60 bg-rose-950/40 text-rose-200 hover:bg-rose-900/60 hover:border-rose-500 hover:text-white shadow-lg active:scale-95"
            >
              <Square className="w-6 h-6 text-rose-400 fill-rose-400" />
              <span className="text-xs uppercase tracking-wider font-extrabold">Parar Tudo</span>
              <span className="text-[10px] text-rose-300 font-normal">Interrupção imediata</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
