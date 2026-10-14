/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Configuration modal for physical footswitches (Cuvave Cube Turner, MIDI, keyboard shortcuts).
 */

import React, { useState, useEffect } from 'react';
import { footswitchManager } from '../audio/midiAndPedalManager';
import { X, Settings, RotateCcw, Activity } from 'lucide-react';

interface FootswitchConfigModalProps {
  onClose: () => void;
  isPedalEnabled: boolean;
  onTogglePedalEnabled: () => void;
}

export const FootswitchConfigModal: React.FC<FootswitchConfigModalProps> = ({
  onClose,
  isPedalEnabled,
  onTogglePedalEnabled,
}) => {
  const [settings, setSettings] = useState(footswitchManager.getSettings());
  const [learningFor, setLearningFor] = useState<'pedal1' | 'pedal2' | null>(null);
  const [lastSignal, setLastSignal] = useState<string | null>(null);

  useEffect(() => {
    footswitchManager.setCallbacks({
      onActivity: (sig) => {
        setLastSignal(`${sig.type ? '[' + sig.type + '] ' : ''}${sig.value}`);
        setSettings(footswitchManager.getSettings());
        setLearningFor(footswitchManager.getLearningTarget());
      },
    });
  }, []);

  const handleStartLearn = (pedal: 'pedal1' | 'pedal2') => {
    setLearningFor(pedal);
    footswitchManager.setLearningTarget(pedal);
  };

  const handleHoldThresholdChange = (val: number) => {
    footswitchManager.updateSettings({ holdThresholdMs: val });
    setSettings(footswitchManager.getSettings());
  };

  const handleDebounceChange = (val: number) => {
    footswitchManager.updateSettings({ debounceMs: val });
    setSettings(footswitchManager.getSettings());
  };

  const handleReset = () => {
    footswitchManager.resetToDefaults();
    setSettings(footswitchManager.getSettings());
    setLearningFor(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <Settings className="w-5 h-5" />
            <h3 className="text-base font-black text-white">Configurar Pedal e Atalhos</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Status banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isPedalEnabled ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span className="text-sm font-bold text-white">
                Reconhecimento de Pedal: {isPedalEnabled ? 'Ativado' : 'Desativado'}
              </span>
            </div>
            <button
              type="button"
              onClick={onTogglePedalEnabled}
              className={`px-3 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                isPedalEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isPedalEnabled ? 'Desativar' : 'Ativar'}
            </button>
          </div>

          {/* Live Signal Indicator */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2 text-xs">
            <Activity className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-400">Último sinal detectado:</span>
            <span className="font-mono font-bold text-amber-300 truncate">
              {lastSignal || 'Pressione qualquer tecla ou pedal para testar'}
            </span>
          </div>

          {/* Pedal 1 Setup */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Pedal 1 (Principal)</div>
                <div className="text-xs text-slate-400">
                  Viradas (Toque rápido) e Transição para Parte B (Segurar)
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleStartLearn('pedal1')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                  learningFor === 'pedal1'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {learningFor === 'pedal1' ? 'Pressione Tecla/Pedal...' : 'Aprender Tecla'}
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Tecla atual:</span>
              <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold">
                {settings.pedal1Key === ' ' ? 'Barra de Espaço' : settings.pedal1Key}
              </span>
            </div>
          </div>

          {/* Pedal 2 Setup */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Pedal 2 (Acento / Crash)</div>
                <div className="text-xs text-slate-400">
                  Dispara o prato de ataque ou acento imediato
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleStartLearn('pedal2')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                  learningFor === 'pedal2'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {learningFor === 'pedal2' ? 'Pressione Tecla/Pedal...' : 'Aprender Tecla'}
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Tecla atual:</span>
              <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold">
                {settings.pedal2Key}
              </span>
            </div>
          </div>

          {/* Sensitivity Sliders */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-bold">Tempo para Segurar (Transição):</span>
                <span className="font-mono text-amber-400 font-bold">{settings.holdThresholdMs} ms</span>
              </div>
              <input
                type="range"
                min={200}
                max={1000}
                step={25}
                value={settings.holdThresholdMs}
                onChange={(e) => handleHoldThresholdChange(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-bold">Filtro Antirruído / Debounce:</span>
                <span className="font-mono text-amber-400 font-bold">{settings.debounceMs} ms</span>
              </div>
              <input
                type="range"
                min={50}
                max={300}
                step={10}
                value={settings.debounceMs}
                onChange={(e) => handleDebounceChange(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
