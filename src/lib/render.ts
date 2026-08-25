import type { CompositionSettings, DirectionId, OutputPreset, SourceImage } from '../types';

export const ARTBOARD = { width: 1440, height: 900 } as const;

export const outputPresets: OutputPreset[] = [
  { id: 'hero', name: 'Website Hero', shortName: 'Hero', width: 1440, height: 900, fileSuffix: 'website-hero', description: 'Landing pages and feature sections' },
  { id: 'og', name: 'Open Graph', shortName: 'OG', width: 1200, height: 630, fileSuffix: 'open-graph', description: 'Link previews and social shares' },
  { id: 'productHunt', name: 'Product Hunt', shortName: 'PH', width: 1270, height: 760, fileSuffix: 'product-hunt', description: 'Launch gallery and product showcases' },
  { id: 'square', name: 'Social Square', shortName: 'Square', width: 1080, height: 1080, fileSuffix: 'social-square', description: 'Instagram and square social posts' },
  { id: 'story', name: 'Story', shortName: 'Story', width: 1080, height: 1920, fileSuffix: 'story', description: 'Stories, reels covers and vertical promos' },
];

export const directionPresets: Record<DirectionId, Partial<CompositionSettings>> = {
  minimal: { background: '#FAFAFA', scale: 0.67, radius: 18, shadow: 26, frame: 'browser' },
  editorial: { background: '#FCD535', scale: 0.62, radius: 10, shadow: 18, frame: 'none' },
  signal: { background: '#0B0E11', scale: 0.66, radius: 12, shadow: 8, frame: 'browser' },
  depth: { background: '#181A20', scale: 0.64, radius: 16, shadow: 42, frame: 'browser' },
};

export const directionMeta: Array<{ id: DirectionId; name: string; description: string }> = [
  { id: 'minimal', name: 'Minimal', description: 'Product-first, quiet contrast' },
  { id: 'editorial', name: 'Editorial', description: 'Bold launch-message treatment' },
  { id: 'signal', name: 'Signal', description: 'Dark, precise, high-voltage' },
  { id: 'depth', name: 'Depth', description: 'Layered and dimensional' },
];

type LayoutMode = 'wide' | 'square' | 'portrait';

type Layout = {
  mode: LayoutMode;
  unit: number;
  copyX: number;
  labelY: number;
  headlineY: number;
  headlineSize: number;
  headlineGap: number;
  subY: number;
  sourceCX: number;
  sourceCY: number;
  sourceMaxW: number;
  sourceMaxH: number;
};

export function renderComposition(
  canvas: HTMLCanvasElement,
  settings: CompositionSettings,
  source: SourceImage | null,
  artboard: Pick<OutputPreset, 'width' | 'height'> = ARTBOARD,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = artboard;
  canvas.width = width;
  canvas.height = height;
  const layout = getLayout(width, height, settings.direction);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = settings.background;
  ctx.fillRect(0, 0, width, height);

  drawDirectionBackground(ctx, settings.direction, settings.background, width, height, layout);
  drawDirectionCopy(ctx, settings.direction, width, height, layout);

  if (source) drawSource(ctx, source, settings, width, height, layout);
  else drawPlaceholder(ctx, settings, width, height, layout);

  drawSignature(ctx, settings.direction, width, height, layout);
}

function getLayout(width: number, height: number, direction: DirectionId): Layout {
  const ratio = width / height;
  const mode: LayoutMode = ratio < 0.8 ? 'portrait' : ratio < 1.2 ? 'square' : 'wide';
  const unit = mode === 'portrait' ? width / 1080 : Math.min(width / 1440, height / 900);

  if (mode === 'portrait') {
    return {
      mode,
      unit,
      copyX: width * 0.08,
      labelY: height * 0.075,
      headlineY: height * 0.135,
      headlineSize: (direction === 'editorial' ? 76 : 64) * unit,
      headlineGap: (direction === 'editorial' ? 78 : 69) * unit,
      subY: height * 0.255,
      sourceCX: width * 0.5,
      sourceCY: height * 0.67,
      sourceMaxW: width * 0.84,
      sourceMaxH: height * 0.43,
    };
  }

  if (mode === 'square') {
    return {
      mode,
      unit,
      copyX: width * 0.08,
      labelY: height * 0.095,
      headlineY: height * 0.175,
      headlineSize: (direction === 'editorial' ? 76 : 61) * unit,
      headlineGap: (direction === 'editorial' ? 76 : 66) * unit,
      subY: height * 0.34,
      sourceCX: width * 0.53,
      sourceCY: height * 0.69,
      sourceMaxW: width * 0.82,
      sourceMaxH: height * 0.43,
    };
  }

  return {
    mode,
    unit,
    copyX: width * 0.067,
    labelY: height * 0.133,
    headlineY: height * 0.228,
    headlineSize: (direction === 'editorial' ? 86 : 66) * unit,
    headlineGap: (direction === 'editorial' ? 82 : 70) * unit,
    subY: height * (direction === 'editorial' ? 0.447 : 0.406),
    sourceCX: width * (direction === 'editorial' ? 0.72 : 0.70),
    sourceCY: height * 0.69,
    sourceMaxW: width * 0.49,
    sourceMaxH: height * 0.52,
  };
}

function drawDirectionBackground(
  ctx: CanvasRenderingContext2D,
  direction: DirectionId,
  background: string,
  width: number,
  height: number,
  layout: Layout,
) {
  if (direction === 'minimal') {
    ctx.fillStyle = '#EAECEF';
    ctx.beginPath();
    ctx.arc(width * 0.875, height * 0.1, Math.min(width, height) * 0.278, 0, Math.PI * 2);
    ctx.fill();
  }

  if (direction === 'editorial') {
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#181A20';
    const bars = layout.mode === 'portrait' ? 5 : 7;
    for (let i = 0; i < bars; i += 1) {
      const bw = 30 * layout.unit;
      const bh = (92 + i * 8) * layout.unit;
      ctx.fillRect(width * 0.07 + i * 52 * layout.unit, height - bh - height * 0.08, bw, bh);
    }
    ctx.restore();
  }

  if (direction === 'signal') {
    ctx.fillStyle = '#FCD535';
    ctx.fillRect(0, 0, Math.max(8, 14 * layout.unit), height);
    ctx.strokeStyle = '#2B3139';
    ctx.lineWidth = Math.max(1, layout.unit);
    const step = Math.max(52, 72 * layout.unit);
    for (let x = step; x < width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = step; y < height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
  }

  if (direction === 'depth') {
    const gx = layout.mode === 'portrait' ? width * 0.56 : width * 0.76;
    const gy = layout.mode === 'portrait' ? height * 0.66 : height * 0.49;
    const radius = Math.max(width, height) * (layout.mode === 'portrait' ? 0.42 : 0.36);
    const g = ctx.createRadialGradient(gx, gy, 10, gx, gy, radius);
    g.addColorStop(0, '#2B3139');
    g.addColorStop(1, background);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawDirectionCopy(
  ctx: CanvasRenderingContext2D,
  direction: DirectionId,
  width: number,
  height: number,
  layout: Layout,
) {
  const dark = direction === 'signal' || direction === 'depth';
  const ink = dark ? '#FFFFFF' : '#181A20';
  const muted = dark ? '#929AA5' : '#5E6673';
  const labelSize = Math.max(12, 17 * layout.unit);
  const subSize = Math.max(14, 20 * layout.unit);

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = direction === 'signal' ? '#FCD535' : muted;
  ctx.font = `600 ${labelSize}px Inter, system-ui, sans-serif`;
  ctx.fillText(direction === 'editorial' ? 'LAUNCH EDITION / 01' : 'PRODUCT STORY / LAUNCHSET', layout.copyX, layout.labelY);

  ctx.fillStyle = ink;
  ctx.font = `700 ${layout.headlineSize}px Inter, system-ui, sans-serif`;
  const lines = direction === 'editorial'
    ? ['MAKE THE', 'PRODUCT HIT.']
    : direction === 'signal'
      ? ['Launch visuals,', 'without the busywork.']
      : ['Turn product screens', 'into launch-ready visuals.'];
  lines.forEach((line, i) => ctx.fillText(line, layout.copyX, layout.headlineY + i * layout.headlineGap));

  ctx.fillStyle = muted;
  ctx.font = `400 ${subSize}px Inter, system-ui, sans-serif`;
  const sub = direction === 'editorial'
    ? 'A decisive frame for launches that need more energy.'
    : 'One source. Multiple formats. Export locally.';
  const maxSubW = layout.mode === 'wide' ? width * 0.42 : width * 0.82;
  drawWrappedText(ctx, sub, layout.copyX, layout.subY, maxSubW, subSize * 1.45, 2);
}

function drawSource(
  ctx: CanvasRenderingContext2D,
  source: SourceImage,
  settings: CompositionSettings,
  width: number,
  height: number,
  layout: Layout,
) {
  const ratio = source.width / source.height;
  const scaleBoost = settings.scale / 0.67;
  const maxW = layout.sourceMaxW * scaleBoost;
  const maxH = layout.sourceMaxH * Math.min(1.08, scaleBoost);
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) { h = maxH; w = h * ratio; }

  const browserH = settings.frame === 'browser' ? Math.max(24, 38 * layout.unit) : 0;
  const rotation = layout.mode === 'portrait'
    ? 0
    : settings.direction === 'editorial'
      ? -0.035
      : settings.direction === 'depth'
        ? -0.02
        : 0;

  if (settings.direction === 'depth') {
    ctx.save();
    ctx.translate(layout.sourceCX, layout.sourceCY);
    ctx.rotate(layout.mode === 'portrait' ? -0.025 : -0.06);
    ctx.globalAlpha = 0.16;
    roundRect(ctx, -w / 2 - 42 * layout.unit, -h / 2 + 42 * layout.unit, w, h, settings.radius * layout.unit);
    ctx.fillStyle = '#FCD535';
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(layout.sourceCX, layout.sourceCY);
  ctx.rotate(rotation);
  if (settings.shadow > 0) {
    ctx.shadowColor = `rgba(0,0,0,${Math.min(0.42, settings.shadow / 120)})`;
    ctx.shadowBlur = settings.shadow * layout.unit;
    ctx.shadowOffsetY = settings.shadow * 0.38 * layout.unit;
  }

  const outerX = -w / 2;
  const outerY = -h / 2 - browserH;
  const outerH = h + browserH;
  roundRect(ctx, outerX, outerY, w, outerH, settings.radius * layout.unit);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.save();
  roundRect(ctx, -w / 2, -h / 2, w, h, Math.max(0, (settings.radius - 3) * layout.unit));
  ctx.clip();
  ctx.drawImage(source.element, -w / 2, -h / 2, w, h);
  ctx.restore();

  if (settings.frame === 'browser') {
    ctx.fillStyle = '#F5F5F5';
    roundTopRect(ctx, -w / 2, -h / 2 - browserH, w, browserH, settings.radius * layout.unit);
    ctx.fill();
    ctx.fillStyle = '#C9CDD3';
    const dotR = Math.max(3, 4.6 * layout.unit);
    [0, 1, 2].forEach((i) => {
      ctx.beginPath();
      ctx.arc(-w / 2 + 22 * layout.unit + i * 17 * layout.unit, -h / 2 - browserH / 2, dotR, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#EAECEF';
    roundRect(ctx, -w * 0.18, -h / 2 - browserH * 0.68, w * 0.36, browserH * 0.36, 5 * layout.unit);
    ctx.fill();
  }
  ctx.restore();
}

function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  settings: CompositionSettings,
  width: number,
  height: number,
  layout: Layout,
) {
  const w = layout.mode === 'wide' ? width * 0.49 : width * 0.80;
  const h = Math.min(layout.sourceMaxH * 0.78, w * 0.52);
  const x = layout.sourceCX - w / 2;
  const y = layout.sourceCY - h / 2;
  const r = Math.max(8, 16 * layout.unit);

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.20)';
  ctx.shadowBlur = 34 * layout.unit;
  ctx.shadowOffsetY = 16 * layout.unit;
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.shadowColor = 'transparent';

  const headerH = Math.max(28, 42 * layout.unit);
  ctx.fillStyle = '#F5F5F5';
  roundTopRect(ctx, x, y, w, headerH, r);
  ctx.fill();
  ctx.fillStyle = '#C9CDD3';
  [0, 1, 2].forEach((i) => {
    ctx.beginPath();
    ctx.arc(x + 23 * layout.unit + i * 17 * layout.unit, y + headerH / 2, Math.max(3, 4.5 * layout.unit), 0, Math.PI * 2);
    ctx.fill();
  });

  const titleSize = Math.max(13, 18 * layout.unit);
  const bodySize = Math.max(11, 15 * layout.unit);
  ctx.fillStyle = '#181A20';
  ctx.font = `600 ${titleSize}px Inter, system-ui, sans-serif`;
  ctx.fillText('Drop a product screenshot to replace this preview', x + 42 * layout.unit, y + headerH + 72 * layout.unit);
  ctx.fillStyle = '#707A8A';
  ctx.font = `400 ${bodySize}px Inter, system-ui, sans-serif`;
  ctx.fillText('PNG, JPEG or WebP · rendered locally', x + 42 * layout.unit, y + headerH + 105 * layout.unit);
  ctx.restore();
}

function drawSignature(
  ctx: CanvasRenderingContext2D,
  direction: DirectionId,
  width: number,
  height: number,
  layout: Layout,
) {
  const x = layout.mode === 'wide' ? width * 0.067 : width * 0.08;
  const y = height * 0.94;
  ctx.fillStyle = direction === 'signal' || direction === 'depth' ? '#929AA5' : '#707A8A';
  ctx.font = `500 ${Math.max(10, 13 * layout.unit)}px Inter, system-ui, sans-serif`;
  ctx.fillText('Made with Launchset', x, y);
  ctx.fillStyle = '#FCD535';
  ctx.fillRect(x, y + 13 * layout.unit, 22 * layout.unit, Math.max(2, 3 * layout.unit));
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else current = test;
  }
  if (current && lines.length < maxLines) lines.push(current);
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(Math.max(0, r), w / 2, h / 2);
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, rr);
}

function roundTopRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(Math.max(0, r), w / 2, h);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNG encoding failed.')), 'image/png');
  });
}

export async function renderPresetBlob(
  preset: OutputPreset,
  settings: CompositionSettings,
  source: SourceImage | null,
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  renderComposition(canvas, settings, source, preset);
  return canvasToPngBlob(canvas);
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportPng(canvas: HTMLCanvasElement, fileName = 'launchset-export.png') {
  const blob = await canvasToPngBlob(canvas);
  downloadBlob(blob, fileName);
}
