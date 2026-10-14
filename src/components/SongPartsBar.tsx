/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Song structure parts selector (Intro, Parte A, Parte B, Fills, Transitions, Outro).
 */

import React from 'react';
import { SongPartId, SongProject } from '../types/rhythm';
import { Copy, Trash2, Play } from 'lucide-react';

interface SongPartsBarProps {
  project: SongProject;
  activePartId: SongPartId;
  playingPartId: SongPartId;
  selectedStartPart?: SongPartId;
  basePartId?: SongPartId;
  isPlaying: boolean;
  onSelectPart: (partId: SongPartId) => void;
  onOpenCopyModal: () => void;
  onClearPart: (partId: SongPartId) => void;
}

export const SongPartsBar: React.FC<SongPartsBarProps> = ({
  project,
  activePartId,
  playingPartId,
  isPlaying,
  onSelectPart,
  onOpenCopyModal,
  onClearPart,
}) => {
  // Ordered standard parts
  const partOrder: Array<{ id: SongPartId; label: string; badge: string; color: string }> = [
    { id: 'intro', label: 'Intro', badge: 'IN', color: 'from-cyan-600 to-blue-700' },
    { id: 'verse', label: 'Parte A', badge: 'A', color: 'from-emerald-600 to-teal-700' },
    { id: 'part_b', label: 'Parte B', badge: 'B', color: 'from-violet-600 to-purple-700' },
    { id: 'part_c', label: 'Parte C', badge: 'C', color: 'from-indigo-600 to-blue-800' },
    { id: 'fill_a', label: 'Virada A', badge: 'FL-A', color: 'from-amber-600 to-yellow-700' },
    { id: 'fill_b', label: 'Virada B', badge: 'FL-B', color: 'from-orange-600 to-amber-700' },
    { id: 'transition_a_b', label: 'Transição A→B', badge: 'TR-AB', color: 'from-rose-600 to-red-700' },
    { id: 'transition_b_a', label: 'Transição B→A', badge: 'TR-BA', color: 'from-rose-600 to-red-700' },
    { id: 'outro', label: 'Final', badge: 'OUT', color: 'from-purple-700 to-pink-800' },
  ];

  const availableParts = partOrder.filter(
    (p) => project.parts[p.id] || p.id === 'verse' || p.id === 'part_b' || p.id === 'fill_a' || p.id === 'intro' || p.id === 'outro'
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Scrollable Part Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
        {availableParts.map((item) => {
          const isCurrentActive = activePartId === item.id;
          const isCurrentPlaying = isPlaying && playingPartId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectPart(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border select-none relative ${
                isCurrentActive
                  ? 'bg-slate-800 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/40'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {isCurrentPlaying && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}

              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r ${item.color} text-white`}>
                {item.badge}
              </span>

              <span>{project.parts[item.id]?.name || item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Part Actions (Copy / Clear) */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          type="button"
          onClick={onOpenCopyModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          title="Copiar compassos de uma parte para outra"
        >
          <Copy className="w-3.5 h-3.5 text-amber-400" />
          <span>Copiar Parte</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (confirm(`Deseja limpar todos os passos da parte "${project.parts[activePartId]?.name || activePartId}"?`)) {
              onClearPart(activePartId);
            }
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg border border-rose-900/50 transition-colors cursor-pointer"
          title="Limpar passos desta parte"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Limpar</span>
        </button>
      </div>
    </div>
  );
};
