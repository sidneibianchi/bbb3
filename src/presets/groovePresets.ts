/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SongProject,
  SongPartId,
  StepData,
  TimeSignature,
  TrackDefinition,
  RhythmicResolution,
} from '../types/rhythm';
import rhythmsJson from '../../data/rhythms.json';

export type StarterKitType =
  | 'samba'
  | 'pagode'
  | 'rock'
  | 'acoustic'
  | 'brazilian'
  | 'latin'
  | 'empty'
  | (string & {});

export function createEmptySteps(count: number): StepData[] {
  const steps: StepData[] = [];
  for (let i = 0; i < count; i++) {
    steps.push({
      active: false,
      velocity: 90,
      probability: 1.0,
      ratchet: 1,
      pitchOffset: 0,
    });
  }
  return steps;
}

export const sambaPreset: SongProject = (rhythmsJson as SongProject[])[0] || {
  id: 'rhythm_samba_default',
  name: 'Samba',
  genre: 'Samba / Choro',
  bpm: 94,
  timeSignature: '4/4',
  resolution: '1/32',
  barsCount: 1,
  swing: 15,
  humanize: 10,
  accentSound: 'tamborim',
  defaultStepCount: 32,
  tracks: [
    {
      id: 'track_ganza',
      name: 'Ganzá',
      category: 'brazilian',
      soundType: 'custom',
      color: '#10b981',
      volume: 0.85,
      pan: -0.2,
      tune: 0,
      decay: 1.0,
      tone: 0.8,
      muted: false,
      solo: false,
      customSampleId: 'sample_1791929097159_2w8rm',
      customSampleName: 'ganza.wav',
    },
    {
      id: 'track_pandeiro_grave',
      name: 'Pandeiro Grave',
      category: 'brazilian',
      soundType: 'custom',
      color: '#06b6d4',
      volume: 0.9,
      pan: 0,
      tune: 0,
      decay: 1.0,
      tone: 0.8,
      muted: false,
      solo: false,
      customSampleId: 'sample_1791928977387_ssxqu',
      customSampleName: 'pandeiro grave.wav',
    },
    {
      id: 'track_pandeiro_tapa',
      name: 'Pandeiro Tapa',
      category: 'brazilian',
      soundType: 'custom',
      color: '#f97316',
      volume: 0.85,
      pan: 0.2,
      tune: 0,
      decay: 1.0,
      tone: 0.8,
      muted: false,
      solo: false,
      customSampleId: 'sample_1791928977720_5b722',
      customSampleName: 'pandeiro tapa.wav',
    },
    {
      id: 'track_tamborim',
      name: 'Tamborim',
      category: 'brazilian',
      soundType: 'custom',
      color: '#8b5cf6',
      volume: 0.85,
      pan: 0.3,
      tune: 0,
      decay: 1.0,
      tone: 0.8,
      muted: false,
      solo: false,
      customSampleId: 'sample_1791929185450_q4cv7',
      customSampleName: 'tamborim grave.wav',
    },
    {
      id: 'track_bumbo',
      name: 'Bumbo / Kick',
      category: 'kick',
      soundType: 'custom',
      color: '#ec4899',
      volume: 0.9,
      pan: 0,
      tune: 0,
      decay: 1.0,
      tone: 0.8,
      muted: false,
      solo: false,
      customSampleId: 'sample_1791929293573_w07zv',
      customSampleName: 'kickdrum9.wav',
    },
    {
      id: 'track_surdo_grave',
      name: 'Surdo Grave',
      category: 'brazilian',
      soundType: 'custom',
      color: '#ef4444',
      volume: 0.95,
      pan: -0.1,
      tune: 0,
      decay: 1.1,
      tone: 0.8,
      muted: false,
      solo: false,
      customSampleId: 'sample_1791929472468_l6qxe',
      customSampleName: 'GRAVE SD.wav',
    },
    {
      id: 'track_surdo_resposta',
      name: 'Surdo Resposta',
      category: 'brazilian',
      soundType: 'custom',
      color: '#f59e0b',
      volume: 0.9,
      pan: 0.1,
      tune: 2,
      decay: 1.0,
      tone: 0.8,
      muted: false,
      solo: false,
      customSampleId: 'sample_1791929483367_ii2ay',
      customSampleName: 'GRAVE 2 SD.wav',
    },
  ],
  parts: {
    verse: {
      id: 'verse',
      name: 'Parte A',
      description: 'Padrão principal do ritmo',
      trackSteps: {},
    },
  },
};

export const availablePresets: SongProject[] = (rhythmsJson as SongProject[]) || [sambaPreset];

export function getStarterKitTracks(kit: StarterKitType): TrackDefinition[] {
  switch (kit) {
    case 'samba':
    case 'brazilian':
      return [
        {
          id: 'trk_ganza',
          name: 'Ganzá',
          category: 'brazilian',
          soundType: 'custom',
          color: '#10b981',
          volume: 0.85,
          pan: -0.2,
          tune: 0,
          decay: 1.0,
          tone: 0.8,
          muted: false,
          solo: false,
          customSampleId: 'sample_1791929097159_2w8rm',
          customSampleName: 'ganza.wav',
        },
        {
          id: 'trk_pandeiro_grv',
          name: 'Pandeiro Grave',
          category: 'brazilian',
          soundType: 'custom',
          color: '#06b6d4',
          volume: 0.9,
          pan: 0,
          tune: 0,
          decay: 1.0,
          tone: 0.8,
          muted: false,
          solo: false,
          customSampleId: 'sample_1791928977387_ssxqu',
          customSampleName: 'pandeiro grave.wav',
        },
        {
          id: 'trk_pandeiro_tp',
          name: 'Pandeiro Tapa',
          category: 'brazilian',
          soundType: 'custom',
          color: '#f97316',
          volume: 0.85,
          pan: 0.2,
          tune: 0,
          decay: 1.0,
          tone: 0.8,
          muted: false,
          solo: false,
          customSampleId: 'sample_1791928977720_5b722',
          customSampleName: 'pandeiro tapa.wav',
        },
        {
          id: 'trk_tamborim',
          name: 'Tamborim',
          category: 'brazilian',
          soundType: 'custom',
          color: '#8b5cf6',
          volume: 0.85,
          pan: 0.3,
          tune: 0,
          decay: 1.0,
          tone: 0.8,
          muted: false,
          solo: false,
          customSampleId: 'sample_1791929185450_q4cv7',
          customSampleName: 'tamborim grave.wav',
        },
        {
          id: 'trk_surdo',
          name: 'Surdo Grave',
          category: 'brazilian',
          soundType: 'custom',
          color: '#ef4444',
          volume: 0.95,
          pan: 0,
          tune: 0,
          decay: 1.1,
          tone: 0.8,
          muted: false,
          solo: false,
          customSampleId: 'sample_1791929472468_l6qxe',
          customSampleName: 'GRAVE SD.wav',
        },
      ];
    case 'rock':
      return [
        {
          id: 'trk_kick',
          name: 'Bumbo / Kick',
          category: 'kick',
          soundType: 'kick',
          color: '#ec4899',
          volume: 0.95,
          pan: 0,
          tune: 0,
          decay: 1.0,
          tone: 0.8,
          muted: false,
          solo: false,
          customSampleId: 'sample_1791929293573_w07zv',
          customSampleName: 'kickdrum9.wav',
        },
        {
          id: 'trk_snare',
          name: 'Caixa / Snare',
          category: 'snare',
          soundType: 'snare',
          color: '#3b82f6',
          volume: 0.9,
          pan: 0,
          tune: 0,
          decay: 1.0,
          tone: 0.8,
          muted: false,
          solo: false,
        },
        {
          id: 'trk_hh_closed',
          name: 'Chimbal Fechado',
          category: 'hihat',
          soundType: 'hihat',
          color: '#10b981',
          volume: 0.8,
          pan: -0.2,
          tune: 0,
          decay: 0.8,
          tone: 0.85,
          muted: false,
          solo: false,
        },
        {
          id: 'trk_hh_open',
          name: 'Chimbal Aberto',
          category: 'hihat',
          soundType: 'hihat_open',
          color: '#06b6d4',
          volume: 0.75,
          pan: -0.2,
          tune: 0,
          decay: 1.5,
          tone: 0.85,
          muted: false,
          solo: false,
        },
        {
          id: 'trk_crash',
          name: 'Prato de Ataque',
          category: 'cymbals',
          soundType: 'crash',
          color: '#f59e0b',
          volume: 0.85,
          pan: 0.3,
          tune: 0,
          decay: 2.0,
          tone: 0.9,
          muted: false,
          solo: false,
        },
      ];
    case 'empty':
      return [];
    default:
      return [
        {
          id: 'trk_kick',
          name: 'Bumbo',
          category: 'kick',
          soundType: 'custom',
          color: '#ec4899',
          volume: 0.9,
          pan: 0,
          tune: 0,
          decay: 1.0,
          tone: 0.8,
          muted: false,
          solo: false,
          customSampleId: 'sample_1791929293573_w07zv',
          customSampleName: 'kickdrum9.wav',
        },
        {
          id: 'trk_shaker',
          name: 'Shaker / Ganzá',
          category: 'brazilian',
          soundType: 'custom',
          color: '#10b981',
          volume: 0.85,
          pan: -0.2,
          tune: 0,
          decay: 1.0,
          tone: 0.8,
          muted: false,
          solo: false,
          customSampleId: 'sample_1791929097159_2w8rm',
          customSampleName: 'ganza.wav',
        },
      ];
  }
}

export function createNewCustomRhythm(params: {
  name: string;
  genre: string;
  bpm: number;
  timeSignature: TimeSignature;
  starterKit: StarterKitType;
  resolution?: RhythmicResolution;
  barsCount?: number;
  customKitTracks?: TrackDefinition[];
}): SongProject {
  const tracks =
    params.customKitTracks && params.customKitTracks.length > 0
      ? params.customKitTracks
      : getStarterKitTracks(params.starterKit);

  const defaultStepCount = params.resolution === '1/64' ? 64 : 32;

  const partIds: Array<{ id: SongPartId; name: string; desc: string }> = [
    { id: 'intro', name: 'Intro', desc: 'Introdução' },
    { id: 'verse', name: 'Parte A', desc: 'Padrão Principal' },
    { id: 'part_b', name: 'Parte B', desc: 'Segunda Seção / Refrão' },
    { id: 'fill_a', name: 'Fill A', desc: 'Virada da Parte A' },
    { id: 'fill_b', name: 'Fill B', desc: 'Virada da Parte B' },
    { id: 'transition_a_b', name: 'Transição A -> B', desc: 'Passagem para a Parte B' },
    { id: 'transition_b_a', name: 'Transição B -> A', desc: 'Passagem de volta para Parte A' },
    { id: 'outro', name: 'Final', desc: 'Finalização do Ritmo' },
  ];

  const parts: Record<string, { id: SongPartId; name: string; description: string; trackSteps: Record<string, StepData[]> }> = {};

  partIds.forEach(({ id, name, desc }) => {
    const trackSteps: Record<string, StepData[]> = {};
    tracks.forEach((t) => {
      trackSteps[t.id] = createEmptySteps(defaultStepCount);
    });
    parts[id] = {
      id,
      name,
      description: desc,
      trackSteps,
    };
  });

  return {
    id: `rhythm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: params.name || 'Novo Ritmo',
    genre: params.genre || 'Personalizado',
    bpm: params.bpm || 95,
    timeSignature: params.timeSignature || '4/4',
    resolution: params.resolution || '1/32',
    barsCount: params.barsCount || 1,
    swing: 0,
    humanize: 0,
    accentSound: 'tamborim',
    tracks,
    parts: parts as any,
    defaultStepCount,
  };
}
