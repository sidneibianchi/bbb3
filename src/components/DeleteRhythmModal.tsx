/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Confirmation modal for deleting a rhythm.
 */

import React from 'react';
import { SongProject } from '../types/rhythm';
import { Trash2, X, AlertTriangle } from 'lucide-react';

interface DeleteRhythmModalProps {
  rhythm: SongProject;
  canDelete: boolean;
  onClose: () => void;
  onConfirmDelete: (id: string) => void;
}

export const DeleteRhythmModal: React.FC<DeleteRhythmModalProps> = ({
  rhythm,
  canDelete,
  onClose,
  onConfirmDelete,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-black text-white">Excluir Ritmo</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 text-sm text-slate-300">
          {canDelete ? (
            <p>
              Tem certeza que deseja excluir o ritmo{' '}
              <strong className="text-white font-bold">"{rhythm.name}"</strong>? Esta ação não pode ser desfeita.
            </p>
          ) : (
            <p className="text-amber-300">
              Você não pode excluir o único ritmo restante da biblioteca. Crie outro ritmo antes de excluir este.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={() => {
                onConfirmDelete(rhythm.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Confirmar Exclusão</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
