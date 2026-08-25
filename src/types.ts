export type DirectionId = 'minimal' | 'editorial' | 'signal' | 'depth';
export type FrameMode = 'browser' | 'none';
export type SourceFitMode = 'contain' | 'focus';

export type CompositionSettings = {
  direction: DirectionId;
  background: string;
  scale: number;
  radius: number;
  shadow: number;
  frame: FrameMode;
  sourceFit: SourceFitMode;
  sourceZoom: number;
};

export type SourceImage = {
  name: string;
  origin: 'file' | 'url';
  sourceUrl?: string;
  url: string;
  element: HTMLImageElement;
  width: number;
  height: number;
  captureScale?: number;
  captureViewportWidth?: number;
  captureViewportHeight?: number;
};

export type OutputPresetId = 'hero' | 'og' | 'productHunt' | 'square' | 'story';

export type OutputPreset = {
  id: OutputPresetId;
  name: string;
  shortName: string;
  width: number;
  height: number;
  fileSuffix: string;
  description: string;
};
