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
import { directionMeta, directionPresets, exportPng, renderComposition } from '../lib/render';
import type { CompositionSettings, DirectionId, SourceImage } from '../types';
import { CheckIcon, ExportIcon, ImageIcon, SparkIcon, TuneIcon, UploadIcon } from './Icons';
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

export function StudioPage({ onGoHome }: Props) {
  const [settings, setSettings] = useState(DEFAULT);
  const [source, setSource] = useState<SourceImage | null>(null);
  const [error, setError] = useState('');
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

  const loadFile = useCallback((file?: File) => {
    if (!file) return;
    setError('');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('PNG, JPEG 또는 WebP 파일을 선택해 주세요.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('파일은 20MB 이하를 권장합니다.');
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setSource((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return {
          name: file.name,
          url,
          element: image,
          width: image.naturalWidth,
          height: image.naturalHeight,
        };
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError('이미지를 읽지 못했습니다. 다른 파일을 선택해 주세요.');
    };
    image.src = url;
  }, []);

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

  const sourceMeta = useMemo(() => source ? `${source.width} × ${source.height}` : 'No source yet', [source]);

  return (
    <>
      <MobileStudioFallback onGoHome={onGoHome} />
      <div className="studio-shell hidden min-h-screen bg-canvas-dark text-body lg:grid">
        <header className="col-span-3 flex h-16 items-center justify-between border-b border-hairline-dark bg-canvas-dark px-4">
          <div className="flex items-center gap-3">
            <button onClick={onGoHome} className="flex items-center gap-2" aria-label="Go to Launchset home"><Mark className="size-8" /><span className="text-[15px] font-semibold tracking-[-0.01em] text-white">Launchset</span></button>
            <span className="text-muted">/</span>
            <span className="text-[13px] font-medium text-muted-strong">Untitled launch</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 text-[12px] text-muted md:flex"><i className="size-1.5 rounded-full bg-primary" />Rendered locally</span>
            <button className="secondary-button hidden h-10 px-4 sm:inline-flex" onClick={() => setAdvanced((value) => !value)}><TuneIcon className="size-4" />Advanced</button>
            <button className="secondary-button hidden h-10 px-4 xl:inline-flex" onClick={doSingleExport} disabled={!source}><ExportIcon className="size-4" />Hero PNG</button>
            <button className="primary-button h-10 px-5" onClick={() => setPackOpen(true)}><ExportIcon className="size-4" />Visual Pack</button>
          </div>
        </header>

        <aside className="hidden border-r border-hairline-dark bg-[#0D1115] lg:flex lg:flex-col lg:items-center lg:gap-2 lg:py-3">
          <RailButton active icon={<SparkIcon />} label="Create" />
          <RailButton icon={<ImageIcon />} label="Source" />
          <RailButton icon={<TuneIcon />} label="Tune" />
          <div className="my-1 h-px w-8 bg-hairline-dark" />
          <RailButton icon={<ExportIcon />} label="Pack" onClick={() => setPackOpen(true)} />
        </aside>

        <aside className="col-span-1 border-r border-hairline-dark bg-surface-card px-4 py-5 lg:col-start-2 lg:row-start-2 lg:overflow-y-auto">
          <div className="mb-6">
            <p className="section-kicker">CREATE</p>
            <h1 className="mt-1 text-[20px] font-semibold leading-[1.35] tracking-[-0.015em] text-white">Launch visual</h1>
            <p className="mt-2 text-[13px] leading-[1.5] text-muted-strong">Start from a direction, then let the Output Pack adapt it across formats.</p>
          </div>

          <Section title="Source" meta={sourceMeta}>
            <input ref={fileInput} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => loadFile(event.target.files?.[0])} />
            <button onClick={() => fileInput.current?.click()} className="flex w-full items-center gap-3 rounded-lg border border-hairline-dark bg-canvas-dark p-3 text-left hover:border-muted">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface-elevated text-primary"><UploadIcon /></span>
              <span className="min-w-0"><b className="block truncate text-[13px] font-semibold leading-5 text-white">{source?.name || 'Choose screenshot'}</b><small className="block text-[12px] leading-[1.4] text-muted">PNG · JPEG · WebP</small></span>
            </button>
            {error && <p role="alert" className="mt-2 text-[12px] leading-[1.45] text-[#F6465D]">{error}</p>}
          </Section>

          <Section title="Direction" meta={settings.direction}>
            <div className="space-y-2">{directionMeta.map((item) => <DirectionButton key={item.id} item={item} selected={settings.direction === item.id} onClick={() => applyDirection(item.id)} />)}</div>
          </Section>

          <Section title="Background">
            <div className="flex flex-wrap gap-2">{backgrounds.map((color) => <button key={color} onClick={() => setSettings((previous) => ({ ...previous, background: color }))} aria-label={`Background ${color}`} className={`size-9 rounded-md border ${settings.background === color ? 'border-primary ring-2 ring-primary/20' : 'border-hairline-dark'}`} style={{ backgroundColor: color }} />)}</div>
          </Section>

          <Section title="Frame" meta={settings.frame}>
            <div className="grid grid-cols-2 gap-2">{(['browser', 'none'] as const).map((frame) => <button key={frame} onClick={() => setSettings((previous) => ({ ...previous, frame }))} className={`h-10 rounded-md border text-[13px] font-medium capitalize ${settings.frame === frame ? 'border-primary bg-[#3A3A1F] text-primary' : 'border-hairline-dark bg-canvas-dark text-muted-strong'}`}>{frame}</button>)}</div>
          </Section>

          <Range label="Scale" value={Math.round(settings.scale * 100)} min={46} max={82} onChange={(value) => setSettings((previous) => ({ ...previous, scale: value / 100 }))} />
          <Range label="Radius" value={settings.radius} min={0} max={32} onChange={(value) => setSettings((previous) => ({ ...previous, radius: value }))} />
          <Range label="Shadow" value={settings.shadow} min={0} max={60} onChange={(value) => setSettings((previous) => ({ ...previous, shadow: value }))} />

          <section className="border-t border-hairline-dark py-5">
            <div className="rounded-lg border border-hairline-dark bg-canvas-dark p-3">
              <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#3A3A1F] text-primary"><ExportIcon className="size-4" /></span><div><h2 className="text-[13px] font-semibold leading-5 text-white">Visual Pack</h2><p className="mt-1 text-[12px] leading-[1.45] text-muted">5 responsive artboards from this composition.</p></div></div>
              <button className="primary-button mt-3 h-10 w-full" onClick={() => setPackOpen(true)}>Open Output Pack</button>
            </div>
          </section>
        </aside>

        <main
          className="relative min-h-[520px] overflow-hidden bg-canvas-dark lg:col-start-3 lg:row-start-2"
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); loadFile(event.dataTransfer.files?.[0]); }}
        >
          <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
            <span className="rounded-md border border-hairline-dark bg-surface-card px-3 py-2 text-[12px] font-medium text-muted-strong">Website Hero <span className="ml-2 text-muted">1440 × 900</span></span>
            <span className="rounded-md border border-hairline-dark bg-surface-card px-3 py-2 font-number text-[12px] text-muted">Master preview</span>
          </div>
          <div className="grid h-full min-h-[620px] place-items-center px-6 pb-12 pt-20 lg:min-h-0">
            <div className="canvas-frame w-full max-w-[1040px]"><canvas ref={canvasRef} className="block h-auto w-full bg-white" /></div>
          </div>
          {!source && <button onClick={() => fileInput.current?.click()} className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 rounded-md border border-hairline-dark bg-surface-card px-4 py-2.5 text-[13px] font-semibold text-white hover:border-primary"><UploadIcon className="mr-2 inline size-4 text-primary" />Replace preview with your screenshot</button>}
          {isDragging && <div className="absolute inset-4 z-40 grid place-items-center rounded-xl border-2 border-dashed border-primary bg-canvas-dark/90"><div className="text-center"><UploadIcon className="mx-auto size-8 text-primary" /><b className="mt-3 block text-[16px] text-white">Drop screenshot here</b><span className="mt-1 block text-[13px] text-muted-strong">It stays in this browser session.</span></div></div>}
          {advanced && <AdvancedPanel settings={settings} setSettings={setSettings} onClose={() => setAdvanced(false)} />}
        </main>
      </div>

      {packOpen && <OutputPackDialog settings={settings} source={source} onClose={() => setPackOpen(false)} />}
    </>
  );
}

function MobileStudioFallback({ onGoHome }: { onGoHome: () => void }) {
  return (
    <main className="flex min-h-screen flex-col bg-canvas-dark p-5 text-body lg:hidden">
      <header className="flex h-12 items-center justify-between"><button onClick={onGoHome} className="flex items-center gap-2"><Mark className="size-8" /><span className="text-[15px] font-semibold text-white">Launchset</span></button><span className="rounded-md border border-hairline-dark bg-surface-card px-2.5 py-1.5 text-[12px] font-medium text-muted-strong">Desktop studio</span></header>
      <section className="my-auto py-14">
        <p className="section-kicker">FIVE OUTPUTS · ONE SOURCE</p>
        <h1 className="mt-3 max-w-[360px] text-[38px] font-bold leading-[1.08] tracking-[-0.03em] text-white">Build the pack on a wider canvas.</h1>
        <p className="mt-5 max-w-[380px] text-[15px] leading-[1.65] text-muted-strong">Launchset v1.3 keeps precision editing desktop-first, then reflows the composition into Hero, OG, Product Hunt, Square and Story formats.</p>
        <div className="mt-7 grid grid-cols-2 gap-2 rounded-xl border border-hairline-dark bg-surface-card p-3">
          {['Hero 1440×900', 'OG 1200×630', 'Square 1080×1080', 'Story 1080×1920'].map((item, index) => <div key={item} className={`grid min-h-24 place-items-center rounded-lg border border-hairline-dark ${index === 1 ? 'bg-[#181A20]' : index === 2 ? 'bg-primary text-ink' : 'bg-[#FAFAFA] text-ink'}`}><span className="px-2 text-center text-[12px] font-semibold">{item}</span></div>)}
        </div>
        <button onClick={onGoHome} className="secondary-button mt-6 h-11 w-full">Back to overview</button>
      </section>
    </main>
  );
}

function RailButton({ icon, label, active = false, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return <button onClick={onClick} className={`flex h-14 w-[52px] flex-col items-center justify-center gap-1 rounded-lg text-[12px] leading-[1.35] font-medium ${active ? 'bg-[#3A3A1F] text-primary' : 'text-muted hover:bg-surface-card hover:text-body'}`}>{icon}<span>{label}</span></button>;
}

function Section({ title, meta, children }: { title: string; meta?: string; children: ReactNode }) {
  return <section className="border-t border-hairline-dark py-5"><div className="mb-3 flex items-center justify-between"><h2 className="m-0 text-[14px] font-semibold leading-5 text-white">{title}</h2>{meta && <span className="max-w-[150px] truncate text-[12px] leading-[1.4] text-muted">{meta}</span>}</div>{children}</section>;
}

function DirectionButton({ item, selected, onClick }: { item: { id: DirectionId; name: string; description: string }; selected: boolean; onClick: () => void }) {
  const swatches = { minimal: 'bg-[#FAFAFA]', editorial: 'bg-primary', signal: 'bg-canvas-dark', depth: 'bg-[#181A20]' };
  return <button onClick={onClick} className={`grid w-full grid-cols-[40px_1fr_20px] items-center gap-3 rounded-lg border p-2.5 text-left ${selected ? 'border-primary bg-[#3A3A1F]' : 'border-hairline-dark bg-canvas-dark hover:border-muted'}`}><span className={`h-9 rounded-md border border-hairline-dark ${swatches[item.id]}`} /><span><b className={`block text-[13px] font-semibold leading-5 ${selected ? 'text-primary' : 'text-white'}`}>{item.name}</b><small className="block text-[12px] leading-[1.4] text-muted">{item.description}</small></span>{selected ? <CheckIcon className="size-4 text-primary" /> : null}</button>;
}

function Range({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <section className="border-t border-hairline-dark py-5"><div className="mb-3 flex justify-between"><label className="text-[14px] font-semibold leading-5 text-white">{label}</label><span className="font-number text-[12px] text-muted">{value}</span></div><input aria-label={label} className="range-control w-full" type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /></section>;
}

function AdvancedPanel({ settings, setSettings, onClose }: { settings: CompositionSettings; setSettings: Dispatch<SetStateAction<CompositionSettings>>; onClose: () => void }) {
  return <aside className="panel-slide absolute bottom-0 right-0 top-0 z-30 w-[320px] border-l border-hairline-dark bg-surface-card p-5"><div className="mb-5 flex items-start justify-between"><div><p className="section-kicker">ADVANCED</p><h2 className="mt-1 text-[20px] font-semibold text-white">Precision</h2></div><button onClick={onClose} className="grid size-9 place-items-center rounded-md border border-hairline-dark text-[18px] text-muted hover:text-white" aria-label="Close advanced panel">×</button></div><p className="text-[13px] leading-[1.55] text-muted-strong">Precision stays narrow in v1.3. Output ratios are responsive rules, not five separate manual layouts.</p><div className="mt-6 space-y-3"><ValueRow label="Master" value="1440 × 900" /><ValueRow label="Outputs" value="5 formats" /><ValueRow label="Direction" value={settings.direction} /><ValueRow label="Renderer" value="Canvas 2D" /><ValueRow label="Source" value="Browser local" /></div><button onClick={() => setSettings(DEFAULT)} className="secondary-button mt-7 h-10 w-full">Reset composition</button></aside>;
}

function ValueRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-hairline-dark py-3 text-[13px]"><span className="text-muted">{label}</span><span className="font-medium text-body">{value}</span></div>;
}
