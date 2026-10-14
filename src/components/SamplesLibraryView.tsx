/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Audio Sample Library view with auditioning, file upload, microphone recorder,
 * and track generator.
 */

import React, { useState, useRef } from 'react';
import {
  Volume2,
  Plus,
  Trash2,
  Edit2,
  Mic,
  Square,
  Upload,
  Download,
  Check,
  Disc,
} from 'lucide-react';
import { audioEngine } from '../audio/AudioEngine';
import {
  saveSampleToStorage,
  exportFullLibraryBackup,
  importFullLibraryBackup,
} from '../audio/sampleStorage';

interface SamplesLibraryViewProps {
  onAddTrackWithSample: (sampleId: string, sampleName: string, color?: string) => void;
  onDeleteSample: (sampleId: string) => void;
  onRenameSample: (sampleId: string, newName: string) => void;
  customSamplesList: Array<{ id: string; name: string }>;
}

export const SamplesLibraryView: React.FC<SamplesLibraryViewProps> = ({
  onAddTrackWithSample,
  onDeleteSample,
  onRenameSample,
  customSamplesList,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const handleAudition = (sampleId: string, sampleName: string) => {
    audioEngine.triggerInstrument('custom', { velocity: 120, volume: 0.9 }, sampleId, sampleName);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const sampleId = `sample_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const sampleName = `Gravacao_${new Date().toLocaleTimeString().replace(/:/g, '-')}`;
        await saveSampleToStorage(sampleId, sampleName, audioBlob);
        await audioEngine.loadCustomSample(sampleId, audioBlob, sampleName);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordTimerRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
    } catch (err) {
      alert('Não foi possível acessar o microfone: ' + err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sampleId = `sample_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      await saveSampleToStorage(sampleId, cleanName, file);
      await audioEngine.loadCustomSample(sampleId, file, cleanName);
    }
    e.target.value = '';
  };

  const handleStartRename = (id: string, current: string) => {
    setEditingId(id);
    setEditName(current);
  };

  const handleSaveRename = (id: string) => {
    if (editName.trim()) {
      onRenameSample(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Disc className="w-5 h-5 text-amber-400" />
            <span>Biblioteca de Samples de Áudio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Grave suas próprias percussões pelo microfone ou importe arquivos WAV/MP3.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="audio/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Importar Áudio</span>
          </button>

          {/* Microphone Recording Button */}
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-black bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-900/30 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Gravar pelo Microfone</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-black bg-rose-500 text-slate-950 rounded-xl shadow-lg animate-pulse transition-all cursor-pointer"
            >
              <Square className="w-4 h-4 fill-slate-950" />
              <span>Parar Gravação ({recordingDuration}s)</span>
            </button>
          )}

          {/* Backup Library Button */}
          <button
            type="button"
            onClick={exportFullLibraryBackup}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all cursor-pointer"
            title="Exportar backup completo de todos os ritmos e áudios"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Exportar Backup</span>
          </button>
        </div>
      </div>

      {/* Samples Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {customSamplesList.map((sample) => (
          <div
            key={sample.id}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => handleAudition(sample.id, sample.name)}
                className="p-2.5 bg-amber-400/10 text-amber-400 hover:bg-amber-400 hover:text-slate-950 rounded-lg transition-all cursor-pointer shrink-0"
                title="Ouvir áudio"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <div className="min-w-0">
                {editingId === sample.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(sample.id)}
                      autoFocus
                      className="bg-slate-950 border border-amber-400 text-xs px-2 py-1 rounded text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveRename(sample.id)}
                      className="p-1 text-emerald-400 hover:bg-slate-800 rounded"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-white truncate max-w-[160px]">
                    {sample.name}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 font-mono">WAV / PCM</div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onAddTrackWithSample(sample.id, sample.name)}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold bg-amber-400/20 text-amber-300 hover:bg-amber-400 hover:text-slate-950 rounded-md transition-all cursor-pointer"
                title="Adicionar como instrumento no sequenciador"
              >
                <Plus className="w-3 h-3" />
                <span>Usar</span>
              </button>

              <button
                type="button"
                onClick={() => handleStartRename(sample.id, sample.name)}
                className="p-1 text-slate-400 hover:text-slate-200 rounded"
                title="Renomear"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir o sample "${sample.name}"?`)) {
                    onDeleteSample(sample.id);
                  }
                }}
                className="p-1 text-slate-400 hover:text-rose-400 rounded"
                title="Excluir sample"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
