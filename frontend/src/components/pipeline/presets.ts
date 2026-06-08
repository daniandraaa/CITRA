import type { RecommendedPreset } from '../../types';

export const RECOMMENDED_PRESETS: RecommendedPreset[] = [
  {
    id: 'full_diagnostic',
    name: 'Full Diagnostic',
    description: 'Pipeline lengkap untuk analisis menyeluruh',
    steps: [
      { id: 'w1', module: 'windowing', config: { preset: 'lung' }, enabled: true },
      { id: 'n1', module: 'noise-removal', config: { method: 'gaussian' }, enabled: true },
      { id: 'e1', module: 'edge-detection', config: { method: 'canny' }, enabled: true },
      { id: 's1', module: 'segmentation', config: { min_thresh: 100, max_thresh: 200 }, enabled: true },
    ],
  },
  {
    id: 'lung_analysis',
    name: 'Lung Analysis',
    description: 'Optimized untuk visualisasi jaringan paru',
    steps: [
      { id: 'w1', module: 'windowing', config: { preset: 'lung' }, enabled: true },
      { id: 'n1', module: 'noise-removal', config: { method: 'gaussian' }, enabled: true },
      { id: 'e1', module: 'edge-detection', config: { method: 'canny' }, enabled: true },
    ],
  },
  {
    id: 'bone_study',
    name: 'Bone Study',
    description: 'Identifikasi batas & densitas tulang',
    steps: [
      { id: 'w1', module: 'windowing', config: { preset: 'bone' }, enabled: true },
      { id: 'e1', module: 'edge-detection', config: { method: 'sobel' }, enabled: true },
      { id: 's1', module: 'segmentation', config: { min_thresh: 150, max_thresh: 255 }, enabled: true },
    ],
  },
  {
    id: 'soft_tissue_roi',
    name: 'Soft Tissue ROI',
    description: 'Deteksi massa jaringan lunak',
    steps: [
      { id: 'w1', module: 'windowing', config: { preset: 'soft_tissue' }, enabled: true },
      { id: 'n1', module: 'noise-removal', config: { method: 'median' }, enabled: true },
      { id: 's1', module: 'segmentation', config: { min_thresh: 50, max_thresh: 150 }, enabled: true },
    ],
  },
  {
    id: 'edge_only',
    name: 'Quick Edge',
    description: 'Ekstraksi tepi cepat, tanpa windowing',
    steps: [
      { id: 'n1', module: 'noise-removal', config: { method: 'gaussian' }, enabled: true },
      { id: 'e1', module: 'edge-detection', config: { method: 'canny' }, enabled: true },
    ],
  },
];
