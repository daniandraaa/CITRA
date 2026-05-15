export type ProcessingTab = 'windowing' | 'noise' | 'edge' | 'segmentation';

export type ProcessingEndpoint = 'windowing' | 'noise-removal' | 'edge-detection' | 'segmentation';

export interface RoiData {
  pixels: number;
  percent: number;
}
