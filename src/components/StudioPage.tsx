import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { t } from '../i18n';
import { directionMeta, directionPresets, exportPng, renderComposition } from '../lib/render';
import type { CompositionSettings, DirectionId, SourceImage } from '../types';
import { CheckIcon, ExportIcon, GlobeIcon, ImageIcon, SparkIcon, TuneIcon, UploadIcon } from './Icons';
import { Mark } from './Mark';
import { OutputPackDialog } from './OutputPackDialog';

const DEFAULT: CompositionSettings = {
  direction: 'minimal',
  background: '#FAFAFA',
  scale: 0.67,
  radius: 18,
  shadow: 26,
  frame: 'browser',
};

const backgrounds = ['#FAFAFA', '#FCD535', '#0B0E11', '#EAECEF', '#1E2329'];

type Props = { onGoHome: () => void };

type CaptureErrorState = { message: string; code?: string } | null;

function captureErrorLabel(code?: string) {
  if (!code) return t.studio.captureErrorLabels.generic;
  return t.studio.captureErrorLabels[code as keyof typeof t.studio.captureErrorLabels] ?? t.studio.captureErrorLabels.generic;
}

export function StudioPage({ onGoHome }: Props) {
  const [settings, setSettings] = useState(DEFAULT);
  const [source, setSource] = useState<SourceImage | null>(null);
  const [sourceMode, setSourceMode] = useState<'file' | 'url'>('file');
  const [error, setError] = useState('');
  const [captureUrl, setCaptureUrl] = useState('');
  const [captureViewport, setCaptureViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [captureState, setCaptureState] = useState<'idle' | 'capturing'>('idle');
  const [captureError, setCaptureError] = useState<CaptureErrorState>(null);
  const [isDragging, setDragging] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [packOpen, setPackOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const rerender = useCallback(() => {
    if (canvasRef.current) renderComposition(canvasRef.current, settings, source);
  }, [settings, source]);

  useEffect(() => rerender(), [rerender]);
  useEffect(() => () => { if (source) URL.revokeObjectURL(source.url); }, [source]);

  const setSourceFromBlob = useCallback((blob: Blob, name: string, origin: 'file' | 'url', sourceUrl?: string) => new Promise<void>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      setSource((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return {
          name,
          origin,
          sourceUrl,
          url: objectUrl,
          element: image,
          width: image.naturalWidth,
          height: image.naturalHeight,
        };
      });
      resolve();
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(t.studio.imageReadFailed));
    };
    image.src = objectUrl;
  }), []);

  const loadFile = useCallback(async (file?: File) => {
    if (!file) return;
    setError('');
    setCaptureError(null);
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError(t.studio.invalidFile);
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError(t.studio.fileTooLarge);
      return;
    }
    try {
      await setSourceFromBlob(file, file.name, 'file');
      setSourceMode('file');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t.studio.imageReadFailed);
    }
  }, [setSourceFromBlob]);

  const captureFromUrl = useCallback(async () => {
    const value = captureUrl.trim();
    if (!value) {
      setCaptureError({ message: t.studio.captureEmptyUrl });
      return;
    }
    setError('');
    setCaptureError(null);
    setCaptureState('capturing');
    try {
      const response = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value, viewport: captureViewport }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({})) as { error?: string; code?: string };
        setCaptureError({ message: payload.error || t.studio.captureFailed, code: payload.code });
        return;
      }
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        setCaptureError({ message: t.studio.captureInvalidImage, code: 'CAPTURE_INVALID_RESPONSE' });
        return;
      }
      const normalizedUrl = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(value) ? value : `https://${value}`;
      const host = new URL(normalizedUrl).hostname.replace(/^www\./, '') || 'website';
      await setSourceFromBlob(blob, `${host}-${captureViewport}.png`, 'url', normalizedUrl);
      setCaptureUrl(normalizedUrl);
      setSourceMode('url');
    } catch (captureFailure) {
      setCaptureError({ message: captureFailure instanceof Error ? captureFailure.message : t.studio.captureFailed, code: 'CAPTURE_NETWORK_ERROR' });
    } finally {
      setCaptureState('idle');
    }
  }, [captureUrl, captureViewport, setSourceFromBlob]);

  const applyDirection = (id: DirectionId) => setSettings((previous) => ({ ...previous, ...directionPresets[id], direction: id }));
  const doSingleExport = useCallback(async () => {
    if (canvasRef.current) await exportPng(canvasRef.current, `launchset-${settings.direction}-website-hero.png`);
  }, [settings.direction]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'e') {
        event.preventDefault();
        setPackOpen(true);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'o') {
        event.preventDefault();
        fileInput.current?.click();
      }
      if (event.key === 'Escape' && !packOpen) setAdvanced(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [packOpen]);

  const sourceMeta = useMemo(() => {
    if (sourceMode === 'url' && source?.origin !== 'url') return t.studio.urlAwaitingCapture;
    return source ? `${source.width} × ${source.height}${source.origin === 'url' ? ' · URL' : ''}` : t.studio.noSource;
  }, [source, sourceMode]);
  const sourceStatus = sourceMode === 'url'
    ? captureState === 'capturing'
      ? t.studio.urlCapturingStatus
      : source?.origin === 'url'
        ? t.studio.capturedServerSide
        : captureError
          ? t.studio.urlCaptureErrorStatus
          : t.studio.urlCaptureReady
    : source?.origin === 'file'
      ? t.studio.renderedLocally
      : t.studio.noSourceStatus;
  const currentDirection = directionMeta.find((item) => item.id === settings.direction)?.name ?? settings.direction;

  return (
    <>
      <MobileStudioFallback onGoHome={onGoHome} />
      <div className="studio-shell hidden min-h-screen bg-canvas-dark text-body lg:grid">
        <header className="col-span-3 flex h-16 items-center justify-between border-b border-hairline-dark bg-canvas-dark px-4">
          <div className="flex items-center gap-3">
            <button onClick={onGoHome} className="flex items-center gap-2" aria-label={t.studio.homeAria}><Mark className="size-8" /><span className="text-[15px] font-semibold tracking-[-0.005em] text-white">{t.brand.name}</span></button>
            <span className="text-muted">/</span>
            <span className="text-[13px] font-medium leading-[1.55] text-muted-strong">{t.studio.untitled}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 text-[12px] leading-[1.5] text-muted md:flex"><i className="size-1.5 rounded-full bg-primary" />{sourceStatus}</span>
            <button className="secondary-button hidden h-10 px-4 sm:inline-flex" onClick={() => setAdvanced((value) => !value)}><TuneIcon className="size-4" />{t.studio.advanced}</button>
            <button className="secondary-button hidden h-10 px-4 xl:inline-flex" onClick={doSingleExport} disabled={!source}><ExportIcon className="size-4" />{t.studio.heroPng}</button>
            <button className="primary-button h-10 px-5" onClick={() => setPackOpen(true)}><ExportIcon className="size-4" />{t.studio.visualPack}</button>
          </div>
        </header>

        <aside className="hidden border-r border-hairline-dark bg-[#0D1115] lg:flex lg:flex-col lg:items-center lg:gap-2 lg:py-3">
          <RailButton active icon={<SparkIcon />} label={t.studio.rail.create} />
          <RailButton icon={<ImageIcon />} label={t.studio.rail.source} />
          <RailButton icon={<TuneIcon />} label={t.studio.rail.tune} />
          <div className="my-1 h-px w-8 bg-hairline-dark" />
          <RailButton icon={<ExportIcon />} label={t.studio.rail.pack} onClick={() => setPackOpen(true)} />
        </aside>

        <aside className="col-span-1 border-r border-hairline-dark bg-surface-card px-4 py-5 lg:col-start-2 lg:row-start-2 lg:overflow-y-auto">
          <div className="mb-6">
            <p className="section-kicker">{t.studio.createKicker}</p>
            <h1 className="kr-heading mt-1 text-[20px] font-semibold leading-[1.45] tracking-[-0.008em] text-white">{t.studio.createTitle}</h1>
            <p className="kr-body mt-2 text-[13px] leading-[1.6] text-muted-strong">{t.studio.createBody}</p>
          </div>

          <Section title={t.studio.source} meta={sourceMeta}>
            <input ref={fileInput} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void loadFile(event.target.files?.[0])} />
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg border border-hairline-dark bg-canvas-dark p-1" role="tablist" aria-label={t.studio.source}>
              {(['file', 'url'] as const).map((mode) => (
                <button
                  key={mode}
                  role="tab"
                  aria-selected={sourceMode === mode}
                  onClick={() => { setSourceMode(mode); setError(''); setCaptureError(null); }}
                  className={`h-9 rounded-md text-[13px] font-semibold ${sourceMode === mode ? 'bg-surface-elevated text-white' : 'text-muted hover:text-body'}`}
                >
                  {t.studio.sourceModes[mode]}
                </button>
              ))}
            </div>

            {sourceMode === 'file' ? (
              <>
                <button onClick={() => fileInput.current?.click()} className="flex w-full items-center gap-3 rounded-lg border border-hairline-dark bg-canvas-dark p-3 text-left hover:border-muted">
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface-elevated text-primary"><UploadIcon /></span>
                  <span className="min-w-0"><b className="block truncate text-[13px] font-semibold leading-[1.55] text-white">{source?.origin === 'file' ? source.name : t.studio.chooseScreenshot}</b><small className="block text-[12px] leading-[1.5] text-muted">PNG · JPEG · WebP</small></span>
                </button>
                {error && <p role="alert" className="kr-body mt-2 text-[12px] leading-[1.55] text-danger">{error}</p>}
              </>
            ) : (
              <div className="space-y-3">
                <label className="block">
                  <span className="sr-only">{t.studio.urlLabel}</span>
                  <div className="flex h-11 items-center gap-2 rounded-md border border-hairline-dark bg-canvas-dark px-3 focus-within:border-primary">
                    <GlobeIcon className="size-4 shrink-0 text-muted" />
                    <input
                      type="url"
                      inputMode="url"
                      autoComplete="url"
                      value={captureUrl}
                      onChange={(event) => { setCaptureUrl(event.target.value); if (captureError) setCaptureError(null); }}
                      onKeyDown={(event) => { if (event.key === 'Enter' && captureState !== 'capturing') void captureFromUrl(); }}
                      placeholder={t.studio.urlPlaceholder}
                      className="min-w-0 flex-1 border-0 bg-transparent text-[13px] leading-[1.55] text-white outline-none placeholder:text-muted"
                    />
                  </div>
                </label>
                <div>
                  <div className="mb-2 text-[12px] font-medium leading-[1.5] text-muted-strong">{t.studio.captureViewport}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['desktop', 'mobile'] as const).map((viewport) => (
                      <button
                        key={viewport}
                        onClick={() => { setCaptureViewport(viewport); if (captureError) setCaptureError(null); }}
                        className={`h-9 rounded-md border text-[12px] font-semibold ${captureViewport === viewport ? 'border-primary bg-[#3A3A1F] text-primary' : 'border-hairline-dark bg-canvas-dark text-muted-strong hover:border-muted'}`}
                      >
                        {t.studio.captureViewports[viewport]}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="primary-button h-10 w-full disabled:cursor-wait disabled:border-primary-disabled disabled:bg-primary-disabled disabled:text-muted" onClick={() => void captureFromUrl()} disabled={captureState === 'capturing'} aria-busy={captureState === 'capturing'}>
                  <GlobeIcon className="size-4" />{captureState === 'capturing' ? t.studio.capturingUrl : t.studio.urlCapture}
                </button>
                <p className="kr-body m-0 text-[12px] leading-[1.55] text-muted">{t.studio.captureServerNote}</p>
                {source?.origin === 'url' && source.sourceUrl && (
                  <div role="status" aria-live="polite" className="flex items-center gap-2 rounded-md border border-[#3F5B2A] bg-[#18220F] px-3 py-2 text-[12px] leading-[1.5] text-[#B7D69B]">
                    <CheckIcon className="size-3.5 shrink-0" />
                    <span className="truncate">{source.sourceUrl}</span>
                  </div>
                )}
                {captureError && (
                  <div role="alert" className="rounded-md border border-[#6E2A38] bg-[#2A151A] px-3 py-2">
                    <p className="m-0 text-[12px] font-semibold leading-[1.5] text-danger">{captureErrorLabel(captureError.code)}</p>
                    <p className="kr-body mt-1 mb-0 text-[12px] leading-[1.55] text-[#F2A5B2]">{captureError.message}</p>
                  </div>
                )}
              </div>
            )}
          </Section>

          <Section title={t.studio.direction} meta={currentDirection}>
            <div className="space-y-2">{directionMeta.map((item) => <DirectionButton key={item.id} item={item} selected={settings.direction === item.id} onClick={() => applyDirection(item.id)} />)}</div>
          </Section>

          <Section title={t.studio.background}>
            <div className="flex flex-wrap gap-2">{backgrounds.map((color) => <button key={color} onClick={() => setSettings((previous) => ({ ...previous, background: color }))} aria-label={t.studio.backgroundAria(color)} className={`size-9 rounded-md border ${settings.background === color ? 'border-primary ring-2 ring-primary/20' : 'border-hairline-dark'}`} style={{ backgroundColor: color }} />)}</div>
          </Section>

          <Section title={t.studio.frame} meta={t.studio.frameLabels[settings.frame]}>
            <div className="grid grid-cols-2 gap-2">{(['browser', 'none'] as const).map((frame) => <button key={frame} onClick={() => setSettings((previous) => ({ ...previous, frame }))} className={`h-10 rounded-md border text-[13px] font-medium ${settings.frame === frame ? 'border-primary bg-[#3A3A1F] text-primary' : 'border-hairline-dark bg-canvas-dark text-muted-strong'}`}>{t.studio.frameLabels[frame]}</button>)}</div>
          </Section>

          <Range label={t.studio.scale} value={Math.round(settings.scale * 100)} min={46} max={82} onChange={(value) => setSettings((previous) => ({ ...previous, scale: value / 100 }))} />
          <Range label={t.studio.radius} value={settings.radius} min={0} max={32} onChange={(value) => setSettings((previous) => ({ ...previous, radius: value }))} />
          <Range label={t.studio.shadow} value={settings.shadow} min={0} max={60} onChange={(value) => setSettings((previous) => ({ ...previous, shadow: value }))} />

          <section className="border-t border-hairline-dark py-5">
            <div className="rounded-lg border border-hairline-dark bg-canvas-dark p-3">
              <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#3A3A1F] text-primary"><ExportIcon className="size-4" /></span><div><h2 className="text-[13px] font-semibold leading-[1.55] text-white">{t.studio.visualPack}</h2><p className="kr-body mt-1 text-[12px] leading-[1.55] text-muted">{t.studio.packBody}</p></div></div>
              <button className="primary-button mt-3 h-10 w-full" onClick={() => setPackOpen(true)}>{t.studio.openPack}</button>
            </div>
          </section>
        </aside>

        <main
          className="relative min-h-[520px] overflow-hidden bg-canvas-dark lg:col-start-3 lg:row-start-2"
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); setSourceMode('file'); void loadFile(event.dataTransfer.files?.[0]); }}
        >
          <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
            <span className="rounded-md border border-hairline-dark bg-surface-card px-3 py-2 text-[12px] font-medium leading-[1.5] text-muted-strong">{t.studio.websiteHero} <span className="ml-2 text-muted">1440 × 900</span></span>
            <span className="rounded-md border border-hairline-dark bg-surface-card px-3 py-2 font-number text-[12px] leading-[1.5] text-muted">{t.studio.masterPreview}</span>
          </div>
          <div className="grid h-full min-h-[620px] place-items-center px-6 pb-12 pt-20 lg:min-h-0">
            <div className="canvas-frame w-full max-w-[1040px]"><canvas ref={canvasRef} className="block h-auto w-full bg-white" /></div>
          </div>
          {!source && <button onClick={() => fileInput.current?.click()} className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 rounded-md border border-hairline-dark bg-surface-card px-4 py-2.5 text-[13px] font-semibold leading-[1.5] text-white hover:border-primary"><UploadIcon className="mr-2 inline size-4 text-primary" />{t.studio.replacePreview}</button>}
          {isDragging && <div className="absolute inset-4 z-40 grid place-items-center rounded-xl border-2 border-dashed border-primary bg-canvas-dark/90"><div className="text-center"><UploadIcon className="mx-auto size-8 text-primary" /><b className="kr-heading mt-3 block text-[16px] leading-[1.55] text-white">{t.studio.dropHere}</b><span className="kr-body mt-1 block text-[13px] leading-[1.6] text-muted-strong">{t.studio.staysLocal}</span></div></div>}
          {advanced && <AdvancedPanel settings={settings} setSettings={setSettings} source={source} onClose={() => setAdvanced(false)} />}
        </main>
      </div>

      {packOpen && <OutputPackDialog settings={settings} source={source} onClose={() => setPackOpen(false)} />}
    </>
  );
}

function MobileStudioFallback({ onGoHome }: { onGoHome: () => void }) {
  return (
    <main className="flex min-h-screen flex-col bg-canvas-dark p-5 text-body lg:hidden">
      <header className="flex h-12 items-center justify-between"><button onClick={onGoHome} className="flex items-center gap-2" aria-label={t.studio.homeAria}><Mark className="size-8" /><span className="text-[15px] font-semibold text-white">{t.brand.name}</span></button><span className="rounded-md border border-hairline-dark bg-surface-card px-2.5 py-1.5 text-[12px] font-medium leading-[1.5] text-muted-strong">{t.studio.mobileBadge}</span></header>
      <section className="my-auto py-14">
        <p className="section-kicker">{t.studio.mobileKicker}</p>
        <h1 className="kr-heading mt-3 max-w-[380px] text-[36px] font-bold leading-[1.18] tracking-[-0.012em] text-white">{t.studio.mobileTitle}</h1>
        <p className="kr-body mt-5 max-w-[390px] text-[15px] leading-[1.7] text-muted-strong">{t.studio.mobileBody}</p>
        <div className="mt-7 grid grid-cols-2 gap-2 rounded-xl border border-hairline-dark bg-surface-card p-3">
          {t.studio.mobileFormats.map((item, index) => <div key={item} className={`grid min-h-24 place-items-center rounded-lg border border-hairline-dark ${index === 1 ? 'bg-[#181A20]' : index === 2 ? 'bg-primary text-ink' : 'bg-[#FAFAFA] text-ink'}`}><span className="px-2 text-center text-[12px] font-semibold leading-[1.5]">{item}</span></div>)}
        </div>
        <button onClick={onGoHome} className="secondary-button mt-6 h-11 w-full">{t.studio.backOverview}</button>
      </section>
    </main>
  );
}

function RailButton({ icon, label, active = false, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return <button onClick={onClick} className={`flex h-14 w-[52px] flex-col items-center justify-center gap-1 rounded-lg text-[12px] font-medium leading-[1.45] ${active ? 'bg-[#3A3A1F] text-primary' : 'text-muted hover:bg-surface-card hover:text-body'}`}>{icon}<span>{label}</span></button>;
}

function Section({ title, meta, children }: { title: string; meta?: string; children: ReactNode }) {
  return <section className="border-t border-hairline-dark py-5"><div className="mb-3 flex items-center justify-between"><h2 className="m-0 text-[14px] font-semibold leading-[1.55] text-white">{title}</h2>{meta && <span className="max-w-[150px] truncate text-[12px] leading-[1.5] text-muted">{meta}</span>}</div>{children}</section>;
}

function DirectionButton({ item, selected, onClick }: { item: { id: DirectionId; name: string; description: string }; selected: boolean; onClick: () => void }) {
  const swatches = { minimal: 'bg-[#FAFAFA]', editorial: 'bg-primary', signal: 'bg-canvas-dark', depth: 'bg-[#181A20]' };
  return <button onClick={onClick} className={`grid w-full grid-cols-[40px_1fr_20px] items-center gap-3 rounded-lg border p-2.5 text-left ${selected ? 'border-primary bg-[#3A3A1F]' : 'border-hairline-dark bg-canvas-dark hover:border-muted'}`}><span className={`h-9 rounded-md border border-hairline-dark ${swatches[item.id]}`} /><span><b className={`block text-[13px] font-semibold leading-[1.55] ${selected ? 'text-primary' : 'text-white'}`}>{item.name}</b><small className="kr-body block text-[12px] leading-[1.5] text-muted">{item.description}</small></span>{selected ? <CheckIcon className="size-4 text-primary" /> : null}</button>;
}

function Range({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <section className="border-t border-hairline-dark py-5"><div className="mb-3 flex justify-between"><label className="text-[14px] font-semibold leading-[1.55] text-white">{label}</label><span className="font-number text-[12px] leading-[1.5] text-muted">{value}</span></div><input aria-label={label} className="range-control w-full" type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /></section>;
}

function AdvancedPanel({ settings, setSettings, source, onClose }: { settings: CompositionSettings; setSettings: Dispatch<SetStateAction<CompositionSettings>>; source: SourceImage | null; onClose: () => void }) {
  const directionName = directionMeta.find((item) => item.id === settings.direction)?.name ?? settings.direction;
  return <aside className="panel-slide absolute bottom-0 right-0 top-0 z-30 w-[320px] border-l border-hairline-dark bg-surface-card p-5"><div className="mb-5 flex items-start justify-between"><div><p className="section-kicker">{t.studio.advancedKicker}</p><h2 className="kr-heading mt-1 text-[20px] font-semibold leading-[1.45] tracking-[-0.008em] text-white">{t.studio.precision}</h2></div><button onClick={onClose} className="grid size-9 place-items-center rounded-md border border-hairline-dark text-[18px] text-muted hover:text-white" aria-label={t.studio.closeAdvancedAria}>×</button></div><p className="kr-body text-[13px] leading-[1.65] text-muted-strong">{t.studio.precisionBody}</p><div className="mt-6 space-y-3"><ValueRow label={t.studio.master} value="1440 × 900" /><ValueRow label={t.studio.outputs} value={t.studio.outputsValue} /><ValueRow label={t.studio.directionValue} value={directionName} /><ValueRow label={t.studio.renderer} value="Canvas 2D" /><ValueRow label={t.studio.sourceValue} value={!source ? t.studio.noSource : source.origin === 'url' ? t.studio.serverCapture : t.studio.browserLocal} /></div><button onClick={() => setSettings(DEFAULT)} className="secondary-button mt-7 h-10 w-full">{t.studio.reset}</button></aside>;
}

function ValueRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-hairline-dark py-3 text-[13px] leading-[1.55]"><span className="text-muted">{label}</span><span className="font-medium text-body">{value}</span></div>;
}

