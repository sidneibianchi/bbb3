/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Drum Kit presets library and track kit manager.
 */

import React, { useState } from 'react';
import { TrackDefinition } from '../types/rhythm';
import { DrumKitDefinition } from '../types/kit';
import { X, Layers, Check, Sparkles } from 'lucide-react';
import { getStarterKitTracks } from '../presets/groovePresets';

interface DrumKitManagerModalProps {
  currentProjectTracks: TrackDefinition[];
  onClose: () => void;
  onApplyKitToProject: (kit: DrumKitDefinition, preserveStepData: boolean) => void;
}

const PRESET_KITS: DrumKitDefinition[] = [
  {
    id: 'kit_samba_raiz',
    name: 'Samba Raiz & Pagode',
    category: 'Brasileiro',
    description: 'Pandeiro grave, pandeiro tapa, ganzá, tamborim e surdo.',
    tracks: getStarterKitTracks('samba'),
  },
  {
    id: 'kit_rock_standard',
    name: 'Bateria Rock Completa',
    category: 'Acústico',
    description: 'Bumbo potente, caixa com esteira, hi-hat fechado e aberto, prato crash.',
    tracks: getStarterKitTracks('rock'),
  },
];

export const DrumKitManagerModal: React.FC<DrumKitManagerModalProps> = ({
  currentProjectTracks,
  onClose,
  onApplyKitToProject,
}) => {
  const [selectedKit, setSelectedKit] = useState<DrumKitDefinition>(PRESET_KITS[0]);
  const [preserveSteps, setPreserveSteps] = useState(true);

  const handleApply = () => {
    onApplyKitToProject(selectedKit, preserveSteps);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <Layers className="w-5 h-5" />
            <h3 className="text-base font-black text-white">Gerenciador de Kits de Bateria</h3>
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
          <div className="text-xs text-slate-400">
            Selecione um conjunto de instrumentos para aplicar ao ritmo atual:
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {PRESET_KITS.map((kit) => {
              const isSelected = selectedKit.id === kit.id;
              return (
                <div
                  key={kit.id}
                  onClick={() => setSelectedKit(kit)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400 text-white shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{kit.name}</span>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-mono">
                        {kit.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{kit.description}</div>
                    <div className="text-[11px] text-slate-500 mt-2 font-mono">
                      {kit.tracks.length} instrumentos: {kit.tracks.map((t) => t.name).join(', ')}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-1 bg-amber-400 text-slate-950 rounded-full shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={preserveSteps}
              onChange={(e) => setPreserveSteps(e.target.checked)}
              className="accent-amber-400 rounded cursor-pointer"
            />
            <span>Preservar as notas/passos já programados nas faixas existentes</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Aplicar Kit ao Ritmo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
