import { useEffect, useMemo, useRef, useState } from 'react';
import { t } from '../i18n';
import { downloadBlob, outputPresets, renderComposition, renderPresetBlob } from '../lib/render';
import { createZipBlob } from '../lib/zip';
import type { CompositionSettings, OutputPreset, OutputPresetId, SourceImage } from '../types';
import { CheckIcon, ExportIcon } from './Icons';

type Props = {
  settings: CompositionSettings;
  source: SourceImage | null;
  onClose: () => void;
};

type ExportState = 'idle' | 'rendering' | 'zipping' | 'done' | 'error';

export function OutputPackDialog({ settings, source, onClose }: Props) {
  const [selected, setSelected] = useState<Set<OutputPresetId>>(() => new Set(outputPresets.map((item) => item.id)));
  const [exportState, setExportState] = useState<ExportState>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const selectedPresets = useMemo(
    () => outputPresets.filter((preset) => selected.has(preset.id)),
    [selected],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && exportState !== 'rendering' && exportState !== 'zipping') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [exportState, onClose]);

  const toggle = (id: OutputPresetId) => {
    if (exportState === 'rendering' || exportState === 'zipping') return;
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = selected.size === outputPresets.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(outputPresets.map((item) => item.id)));

  const downloadOne = async (preset: OutputPreset) => {
    if (!source) return;
    setExportState('rendering');
    setProgress(20);
    setMessage(t.pack.rendering(preset.name));
    try {
      const blob = await renderPresetBlob(preset, settings, source);
      setProgress(90);
      downloadBlob(blob, `launchset-${preset.fileSuffix}.png`);
      setProgress(100);
      setMessage(t.pack.downloaded(preset.name));
      setExportState('done');
      window.setTimeout(() => { setExportState('idle'); setProgress(0); setMessage(''); }, 1200);
    } catch {
      setExportState('error');
      setMessage(t.pack.pngFailed);
    }
  };

  const downloadZip = async () => {
    if (!source || selectedPresets.length === 0) return;
    setExportState('rendering');
    setProgress(3);
    setMessage(t.pack.renderingSelected);

    try {
      const files: Array<{ name: string; blob: Blob }> = [];
      for (let index = 0; index < selectedPresets.length; index += 1) {
        const preset = selectedPresets[index];
        const blob = await renderPresetBlob(preset, settings, source);
        files.push({ name: `launchset-${preset.fileSuffix}-${preset.width}x${preset.height}.png`, blob });
        setProgress(Math.round(((index + 1) / selectedPresets.length) * 72));
      }

      setExportState('zipping');
      setMessage(t.pack.packagingZip);
      const archive = await createZipBlob(files, (zipPercent) => setProgress(72 + Math.round(zipPercent * 0.27)));

      downloadBlob(archive, `launchset-${settings.direction}-visual-pack.zip`);
      setProgress(100);
      setExportState('done');
      setMessage(t.pack.zipDone(selectedPresets.length));
      window.setTimeout(() => { setExportState('idle'); setProgress(0); setMessage(''); }, 1800);
    } catch {
      setExportState('error');
      setMessage(t.pack.packFailed);
    }
  };

  const busy = exportState === 'rendering' || exportState === 'zipping';

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-6 backdrop-blur-[3px] motion-reduce:backdrop-blur-none" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="visual-pack-title"
        className="pack-dialog flex max-h-[min(820px,calc(100vh-48px))] w-full max-w-[1120px] flex-col overflow-hidden rounded-xl border border-hairline-dark bg-surface-card text-body"
      >
        <header className="flex items-start justify-between gap-6 border-b border-hairline-dark px-6 py-5">
          <div>
            <p className="section-kicker">{t.pack.kicker}</p>
            <h2 id="visual-pack-title" className="kr-heading mt-1 text-[24px] font-semibold leading-[1.4] tracking-[-0.01em] text-white">{t.pack.title}</h2>
            <p className="kr-body mt-2 max-w-[700px] text-[13px] leading-[1.65] text-muted-strong">{t.pack.body}</p>
          </div>
          <button className="grid size-10 shrink-0 place-items-center rounded-md border border-hairline-dark text-[20px] text-muted hover:bg-surface-elevated hover:text-white disabled:cursor-not-allowed disabled:opacity-50" onClick={onClose} disabled={busy} aria-label={t.pack.closeAria}>×</button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {!source && (
            <div role="status" className="kr-body mb-5 flex items-start gap-3 rounded-lg border border-[#5A4C13] bg-[#2A260F] px-4 py-3 text-[13px] leading-[1.6] text-[#FBEA9A]">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
              {t.pack.noSource}
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="m-0 text-[13px] leading-[1.55] text-muted-strong">{t.pack.selected(selectedPresets.length, outputPresets.length)}</p>
            <button className="text-[13px] font-semibold text-primary hover:text-primary-active" onClick={toggleAll} disabled={busy}>{allSelected ? t.pack.clearAll : t.pack.selectAll}</button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {outputPresets.map((preset) => (
              <OutputCard
                key={preset.id}
                preset={preset}
                settings={settings}
                source={source}
                selected={selected.has(preset.id)}
                onToggle={() => toggle(preset.id)}
                onDownload={() => downloadOne(preset)}
                disabled={busy}
              />
            ))}
          </div>
        </div>

        <footer className="border-t border-hairline-dark bg-[#181D23] px-6 py-4">
          {(message || busy) && (
            <div className="mb-3" aria-live="polite">
              <div className="mb-2 flex items-center justify-between gap-4 text-[12px] leading-[1.5] text-muted-strong"><span>{message}</span><span className="font-number">{progress}%</span></div>
              <div className="h-1 overflow-hidden rounded-full bg-hairline-dark"><div className="h-full bg-primary transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div>
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="kr-body m-0 text-[12px] leading-[1.55] text-muted">{t.pack.localNote}</p>
            <div className="flex gap-2">
              <button className="secondary-button h-10 px-4" onClick={onClose} disabled={busy}>{t.pack.close}</button>
              <button className="primary-button h-10 min-w-[210px] px-5 disabled:cursor-not-allowed disabled:border-primary-disabled disabled:bg-primary-disabled disabled:text-muted" onClick={downloadZip} disabled={!source || selectedPresets.length === 0 || busy}>
                <ExportIcon className="size-4" />
                {busy ? t.pack.preparing : t.pack.downloadSelectedZip(selectedPresets.length)}
              </button>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}

function OutputCard({ preset, settings, source, selected, onToggle, onDownload, disabled }: {
  preset: OutputPreset;
  settings: CompositionSettings;
  source: SourceImage | null;
  selected: boolean;
  onToggle: () => void;
  onDownload: () => void;
  disabled: boolean;
}) {
  return (
    <article className={`overflow-hidden rounded-lg border bg-canvas-dark transition-colors ${selected ? 'border-primary' : 'border-hairline-dark hover:border-muted'}`}>
      <button className="block w-full text-left" onClick={onToggle} disabled={disabled} aria-pressed={selected}>
        <div className="flex h-[210px] items-center justify-center bg-[#0D1115] p-4">
          <OutputPreview preset={preset} settings={settings} source={source} />
        </div>
        <div className="border-t border-hairline-dark px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className={`kr-heading text-[14px] font-semibold leading-[1.55] ${selected ? 'text-primary' : 'text-white'}`}>{preset.name}</h3>
              <p className="mt-1 text-[12px] leading-[1.5] text-muted">{preset.width} × {preset.height}</p>
            </div>
            <span className={`grid size-5 place-items-center rounded border ${selected ? 'border-primary bg-primary text-ink' : 'border-hairline-dark text-transparent'}`} aria-hidden="true"><CheckIcon className="size-3.5" /></span>
          </div>
          <p className="kr-body mt-2 text-[12px] leading-[1.55] text-muted-strong">{preset.description}</p>
        </div>
      </button>
      <div className="border-t border-hairline-dark px-3 py-2">
        <button className="h-8 w-full rounded-md text-[12px] font-semibold text-muted-strong hover:bg-surface-elevated hover:text-white disabled:cursor-not-allowed disabled:opacity-40" onClick={onDownload} disabled={!source || disabled}>{t.pack.downloadPng}</button>
      </div>
    </article>
  );
}

function OutputPreview({ preset, settings, source }: { preset: OutputPreset; settings: CompositionSettings; source: SourceImage | null }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) renderComposition(ref.current, settings, source, preset);
  }, [preset, settings, source]);

  const ratio = preset.width / preset.height;
  const style = ratio >= 1
    ? { width: '100%', maxHeight: '178px' }
    : { height: '178px', maxWidth: '100%' };

  return <canvas ref={ref} className="block rounded-[4px] border border-hairline-dark bg-white object-contain" style={style} />;
}
