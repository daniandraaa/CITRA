export type AppMode = 'per-module' | 'pipeline';

export type ProcessingTab = 'windowing' | 'noise' | 'edge' | 'segmentation';

export type ProcessingEndpoint = 'windowing' | 'noise-removal' | 'edge-detection' | 'segmentation';

export interface RoiData {
  pixels: number;
  percent: number;
}

export interface PipelineStep {
  id: string; // Unique ID for dnd-kit
  module: ProcessingEndpoint;
  config: any; // Record<string, any>
  enabled: boolean;
}

export interface RecommendedPreset {
  id: string;
  name: string;
  description: string;
  steps: PipelineStep[];
}
