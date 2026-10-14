/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modal to create a new rhythm / song project.
 */

import React, { useState } from 'react';
import { TimeSignature, RhythmicResolution, TrackDefinition } from '../types/rhythm';
import { StarterKitType } from '../presets/groovePresets';
import { X, Plus, Music } from 'lucide-react';

interface CreateRhythmModalProps {
  onClose: () => void;
  onCreate: (params: {
    name: string;
    genre: string;
    bpm: number;
    timeSignature: TimeSignature;
    starterKit: StarterKitType;
    resolution?: RhythmicResolution;
    barsCount?: number;
    customKitTracks?: TrackDefinition[];
  }) => void;
  isPedalEnabled: boolean;
  onTogglePedalEnabled: () => void;
}

export const CreateRhythmModal: React.FC<CreateRhythmModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('Samba');
  const [bpm, setBpm] = useState(95);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [starterKit, setStarterKit] = useState<StarterKitType>('brazilian');
  const [resolution, setResolution] = useState<RhythmicResolution>('1/32');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      genre,
      bpm,
      timeSignature,
      starterKit,
      resolution,
      barsCount: 1,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400/10 text-amber-400 rounded-lg">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white">Criar Novo Ritmo</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Nome do Ritmo *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Samba de Roda, Baião 6/8, Rock Pop..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Gênero Musical
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Samba">Samba</option>
                <option value="Pagode">Pagode</option>
                <option value="Forró / Baião">Forró / Baião</option>
                <option value="Bossa Nova">Bossa Nova</option>
                <option value="Sertanejo">Sertanejo</option>
                <option value="Rock">Rock</option>
                <option value="Pop">Pop</option>
                <option value="Personalizado">Personalizado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Andamento (BPM)
              </label>
              <input
                type="number"
                min={40}
                max={260}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Fórmula de Compasso
              </label>
              <select
                value={timeSignature}
                onChange={(e) => setTimeSignature(e.target.value as TimeSignature)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="4/4">4/4 (Quaternário)</option>
                <option value="3/4">3/4 (Ternário / Valsa)</option>
                <option value="6/8">6/8 (Baião / Composto)</option>
                <option value="7/8">7/8 (Ímpar)</option>
                <option value="12/8">12/8 (Blues / Lento)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Subdivisão / Grade
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as RhythmicResolution)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="1/32">1/32 (32 Passos)</option>
                <option value="1/64">1/64 (64 Passos Ultra Fiéis)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Kit de Instrumentos Inicial
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  starterKit === 'brazilian'
                    ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="kit"
                  value="brazilian"
                  checked={starterKit === 'brazilian'}
                  onChange={() => setStarterKit('brazilian')}
                  className="hidden"
                />
                <span className="font-bold">Percussão Brasileira</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  starterKit === 'rock'
                    ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="kit"
                  value="rock"
                  checked={starterKit === 'rock'}
                  onChange={() => setStarterKit('rock')}
                  className="hidden"
                />
                <span className="font-bold">Bateria Padrão</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  starterKit === 'empty'
                    ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="kit"
                  value="empty"
                  checked={starterKit === 'empty'}
                  onChange={() => setStarterKit('empty')}
                  className="hidden"
                />
                <span className="font-bold">Em Branco (Vazio)</span>
              </label>
            </div>
          </div>

          {/* Footer buttons */}
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
              className="px-5 py-2 text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Criar Ritmo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
