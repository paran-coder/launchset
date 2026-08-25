import type { ReactNode } from 'react';
import { ArrowIcon, CheckIcon, ExportIcon, ImageIcon, ShieldIcon, SparkIcon } from './Icons';
import { Mark } from './Mark';

type Props={onEnterStudio:()=>void};
export function LandingPage({onEnterStudio}:Props){
  return <div className="min-h-screen bg-canvas-dark text-body">
    <header className="sticky top-0 z-40 border-b border-hairline-dark bg-canvas-dark/95 backdrop-blur-md motion-reduce:backdrop-blur-none">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 lg:px-8">
        <button onClick={onEnterStudio} className="flex items-center gap-2.5" aria-label="Launchset studio"><Mark className="size-8"/><span className="text-[15px] font-semibold tracking-[-0.01em] text-white">Launchset</span></button>
        <nav className="hidden items-center gap-7 text-[14px] font-medium text-muted-strong md:flex"><a href="#product" className="hover:text-white">Product</a><a href="#workflow" className="hover:text-white">How it works</a><a href="#privacy" className="hover:text-white">Privacy</a></nav>
        <button onClick={onEnterStudio} className="primary-button h-10 px-5">Start creating <ArrowIcon className="size-4"/></button>
      </div>
    </header>

    <main>
      <section className="mx-auto grid max-w-[1280px] gap-12 px-5 pb-20 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-24 lg:pt-24">
        <div className="flex flex-col justify-center">
          <div className="mb-6 flex w-fit items-center gap-2 rounded-md border border-hairline-dark bg-surface-card px-3 py-2 text-[12px] font-medium text-muted-strong"><span className="size-1.5 rounded-full bg-primary"/>Local-first product visual studio</div>
          <h1 className="max-w-[680px] text-[46px] font-bold leading-[1.04] tracking-[-0.02em] text-white sm:text-[56px] lg:text-[64px] lg:leading-[1.08]">One product.<br/><span className="text-primary">Every launch visual.</span></h1>
          <p className="mt-6 max-w-[590px] text-[17px] leading-[1.65] text-muted-strong">Drop one product screenshot, choose a direction, and export a coordinated launch pack across web, social and launch channels.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button onClick={onEnterStudio} className="primary-button h-12 px-6 text-[15px]">Start with a screenshot <ArrowIcon/></button><a href="#product" className="secondary-button h-12 px-6 text-[15px]">See the workflow</a></div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-muted-strong"><span className="flex items-center gap-2"><CheckIcon className="size-4 text-primary"/>No account for first export</span><span className="flex items-center gap-2"><CheckIcon className="size-4 text-primary"/>Browser-local rendering</span><span className="flex items-center gap-2"><CheckIcon className="size-4 text-primary"/>5-format Visual Pack</span></div>
        </div>
        <HeroPreview/>
      </section>

      <section id="product" className="border-y border-hairline-dark bg-[#0D1115]">
        <div className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24">
          <p className="section-kicker">PRODUCT PRINCIPLE</p><h2 className="section-heading max-w-[760px]">Preset before parameters. Result before account.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Feature index="01" icon={<ImageIcon/>} title="Input once" copy="Use a product screenshot as the source. Launchset keeps the first workflow intentionally narrow."/>
            <Feature index="02" icon={<SparkIcon/>} title="Choose a direction" copy="Start from an art direction instead of a blank canvas and dozens of sliders."/>
            <Feature index="03" icon={<ExportIcon/>} title="Export a coordinated pack" copy="Render Hero, Open Graph, Product Hunt, Square and Story assets locally from the same source."/>
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div><p className="section-kicker">INTENT → DIRECTION → PRECISION</p><h2 className="section-heading">The editor stays quiet until you need control.</h2><p className="section-body mt-5">Quick controls solve the common case. Radius, scale and shadow stay available without turning the first screen into a professional-tool cockpit.</p></div>
          <div className="divide-y divide-hairline-dark border-y border-hairline-dark">
            {[
              ['1','Choose the goal','Start with a launch hero, social asset or product showcase.'],
              ['2','Pick an art direction','Minimal, Editorial, Signal and Depth alter the composition in one decision.'],
              ['3','Tune only what matters','Background, frame, scale, corner radius and shadow stay within one compact inspector.'],
              ['4','Export the pack','Download selected responsive artboards as PNG files or one local ZIP.'],
            ].map(([n,t,c])=><div key={n} className="grid gap-3 py-6 sm:grid-cols-[56px_180px_1fr]"><span className="font-number text-[14px] font-semibold text-primary">{n}</span><h3 className="text-[16px] font-semibold leading-6 text-white">{t}</h3><p className="m-0 text-[14px] leading-[1.6] text-muted-strong">{c}</p></div>)}
          </div>
        </div>
      </section>

      <section id="privacy" className="border-y border-hairline-dark bg-surface-card">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div className="flex gap-5"><span className="grid size-12 shrink-0 place-items-center rounded-lg border border-hairline-dark bg-canvas-dark text-primary"><ShieldIcon/></span><div><p className="section-kicker">LOCAL-FIRST MVP</p><h2 className="mt-2 text-[28px] font-semibold leading-[1.25] tracking-[-0.02em] text-white">Your screenshot stays in the browser.</h2><p className="mt-3 max-w-[720px] text-[14px] leading-[1.65] text-muted-strong">v1.3.0 decodes the selected file locally, reflows it across five artboards, and packages selected PNGs in the browser. URL capture and cloud video rendering remain separate server capabilities.</p></div></div>
          <button onClick={onEnterStudio} className="primary-button h-11 px-5">Open studio <ArrowIcon/></button>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-24 text-center lg:px-8"><p className="section-kicker">READY WHEN THE PRODUCT IS</p><h2 className="mx-auto max-w-[760px] text-[40px] font-bold leading-[1.12] tracking-[-0.03em] text-white sm:text-[48px]">Make the launch visual before the meeting starts.</h2><button onClick={onEnterStudio} className="primary-button mx-auto mt-8 h-12 px-7 text-[15px]">Start creating <ArrowIcon/></button></section>
    </main>

    <footer className="bg-[#FAFAFA] text-ink"><div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div className="flex items-center gap-2.5"><Mark className="size-7"/><span className="text-[14px] font-semibold">Launchset</span></div><p className="m-0 text-[13px] text-[#5E6673]">v1.3.0 · Product Visual Studio · Visual Pack MVP</p></div></footer>
  </div>
}

function Feature({index,icon,title,copy}:{index:string;icon:ReactNode;title:string;copy:string}){return <article className="rounded-xl border border-hairline-dark bg-surface-card p-6"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-lg bg-primary text-ink">{icon}</span><span className="font-number text-[12px] font-semibold text-muted">{index}</span></div><h3 className="mt-8 text-[20px] font-semibold leading-[1.35] text-white">{title}</h3><p className="mt-3 text-[14px] leading-[1.65] text-muted-strong">{copy}</p></article>}

function HeroPreview(){return <div className="relative min-h-[480px] overflow-hidden rounded-xl border border-hairline-dark bg-surface-card p-3 shadow-[0_18px_56px_rgba(0,0,0,.20)]"><div className="flex h-10 items-center justify-between border-b border-hairline-dark px-2 text-[12px] text-muted"><span>Launch hero · 1440 × 900</span><span>74%</span></div><div className="relative mt-3 h-[410px] overflow-hidden rounded-lg bg-[#FAFAFA] p-8 text-ink"><span className="text-[12px] font-semibold leading-[1.4] tracking-[0.08em] text-[#5E6673]">PRODUCT STORY / LAUNCHSET</span><h3 className="mt-4 max-w-[430px] text-[32px] font-bold leading-[1.03] sm:text-[36px] sm:leading-[1.02] tracking-[-0.035em]">Turn product screens into launch-ready visuals.</h3><div className="absolute bottom-6 right-6 h-[188px] w-[72%] sm:bottom-9 sm:right-8 sm:h-[210px] sm:w-[66%] rounded-lg border border-[#CDD1D6] bg-white shadow-[0_12px_28px_rgba(24,26,32,.14)]"><div className="flex h-8 items-center gap-2 rounded-t-lg bg-[#F5F5F5] px-3"><i className="size-2 rounded-full bg-[#CDD1D6]"/><i className="size-2 rounded-full bg-[#CDD1D6]"/><i className="size-2 rounded-full bg-[#CDD1D6]"/></div><div className="grid h-[156px] grid-cols-[48px_1fr] sm:h-[178px]"><div className="border-r border-[#EAECEF] p-3"><i className="block size-5 rounded bg-[#181A20]"/><i className="mt-4 block h-2 rounded bg-[#EAECEF]"/><i className="mt-2 block h-2 rounded bg-[#FCD535]"/></div><div className="p-4"><i className="block h-3 w-28 rounded bg-[#181A20]"/><div className="mt-4 grid grid-cols-3 gap-2">{[1,2,3].map(x=><i key={x} className="h-14 rounded-md bg-[#F5F5F5]"/>)}</div><i className="mt-3 block h-14 rounded-md bg-[#F5F5F5]"/></div></div></div></div></div>}
