/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modal to copy rhythm steps from one song part to another.
 */

import React, { useState } from 'react';
import { SongPartId, SongProject } from '../types/rhythm';
import { Copy, X, ArrowRight } from 'lucide-react';

interface CopyPartModalProps {
  project: SongProject;
  currentActivePartId: SongPartId;
  onClose: () => void;
  onCopyPart: (sourcePartId: SongPartId, targetPartIds: SongPartId[], switchToTarget?: boolean) => void;
}

export const CopyPartModal: React.FC<CopyPartModalProps> = ({
  project,
  currentActivePartId,
  onClose,
  onCopyPart,
}) => {
  const partsList = Object.keys(project.parts).map((id) => ({
    id: id as SongPartId,
    name: project.parts[id]?.name || id,
  }));

  const [source, setSource] = useState<SongPartId>(currentActivePartId);
  const [target, setTarget] = useState<SongPartId>(
    (partsList.find((p) => p.id !== currentActivePartId)?.id || 'part_b') as SongPartId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (source === target) {
      alert('Selecione uma parte de destino diferente da parte de origem.');
      return;
    }
    onCopyPart(source, [target], true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <Copy className="w-5 h-5" />
            <h3 className="text-base font-black text-white">Copiar Parte do Ritmo</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Copiar Da Parte (Origem):
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as SongPartId)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {partsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center text-slate-500">
            <ArrowRight className="w-5 h-5" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Colar Na Parte (Destino):
            </label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as SongPartId)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {partsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>Copiar Passos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
