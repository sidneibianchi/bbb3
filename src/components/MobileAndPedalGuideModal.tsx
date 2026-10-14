/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Comprehensive setup guide for mobile stage use and Cuvave / Bluetooth pedals.
 */

import React from 'react';
import { X, Smartphone, Bluetooth, Footprints, ExternalLink, Settings } from 'lucide-react';

interface MobileAndPedalGuideModalProps {
  onClose: () => void;
  onOpenPedalSettings: () => void;
}

export const MobileAndPedalGuideModal: React.FC<MobileAndPedalGuideModalProps> = ({
  onClose,
  onOpenPedalSettings,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <Smartphone className="w-5 h-5" />
            <h3 className="text-base font-black text-white">Guia de Uso no Celular e Pedal</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs text-slate-300">
          {/* Section 1: Cuvave / Bluetooth Footswitch */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Bluetooth className="w-4 h-4 text-amber-400" />
              <span>Como usar com o Pedal Cuvave Cube Turner ou Page Turner</span>
            </div>
            <p>
              1. Emparelhe o seu pedal Bluetooth com o celular, tablet ou computador.
            </p>
            <p>
              2. Defina o pedal no modo de <strong>Teclado / Page Turner</strong> (geralmente envia as teclas <em>Page Down / Page Up</em> ou <em>Espaço / Enter</em>).
            </p>
            <p>
              3. No aplicativo, o <strong>Pedal 1</strong> controla o início, viradas (toque rápido) e transição de parte (segurando o pedal).
            </p>
            <p>
              4. O <strong>Pedal 2</strong> aciona o prato Crash ou parada imediata.
            </p>
          </div>

          {/* Section 2: How BeatBuddy logic works */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Footprints className="w-4 h-4 text-emerald-400" />
              <span>Ações do Pedal BeatBuddy</span>
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong>1 Toque Rápido no Pedal 1:</strong> Dispara a virada (Fill) sincronizada com o final do compasso.
              </li>
              <li>
                <strong>Segurar o Pedal 1:</strong> Entra no modo de transição contínua. Ao soltar, avança para a Parte B ou Refrão.
              </li>
              <li>
                <strong>2 Toques Rápidos no Pedal 1:</strong> Aciona a finalização (Outro) e para no tempo certo.
              </li>
              <li>
                <strong>Pedal 2 (ou Tecla Enter):</strong> Batida imediata de acento/crash.
              </li>
            </ul>
          </div>

          {/* Section 3: Add to Home Screen (PWA) */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>Instalar como App no Celular (Android & iOS)</span>
            </div>
            <p>
              Abra este link no navegador do celular (Chrome ou Safari) e selecione <strong>"Adicionar à Tela Inicial"</strong> para usar em tela cheia sem barras do navegador!
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPedalSettings();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 rounded-xl transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Abrir Ajustes de Teclas</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-black bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
