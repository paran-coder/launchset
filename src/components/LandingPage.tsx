import type { ReactNode } from 'react';
import { t } from '../i18n';
import { ArrowIcon, CheckIcon, ExportIcon, ImageIcon, ShieldIcon, SparkIcon } from './Icons';
import { Mark } from './Mark';

type Props = { onEnterStudio: () => void };

export function LandingPage({ onEnterStudio }: Props) {
  return (
    <div className="min-h-screen bg-canvas-dark text-body">
      <header className="sticky top-0 z-40 border-b border-hairline-dark bg-canvas-dark/95 backdrop-blur-md motion-reduce:backdrop-blur-none">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 lg:px-8">
          <button onClick={onEnterStudio} className="flex items-center gap-2.5" aria-label={t.studio.homeAria}>
            <Mark className="size-8" />
            <span className="text-[15px] font-semibold tracking-[-0.005em] text-white">{t.brand.name}</span>
          </button>
          <nav className="hidden items-center gap-7 text-[14px] font-medium text-muted-strong md:flex" aria-label={t.nav.aria}>
            <a href="#product" className="hover:text-white">{t.nav.product}</a>
            <a href="#workflow" className="hover:text-white">{t.nav.workflow}</a>
            <a href="#privacy" className="hover:text-white">{t.nav.privacy}</a>
          </nav>
          <button onClick={onEnterStudio} className="primary-button h-10 px-5">{t.nav.start} <ArrowIcon className="size-4" /></button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-[1280px] gap-12 px-5 pb-20 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-24 lg:pt-24">
          <div className="flex flex-col justify-center">
            <div className="mb-6 flex w-fit items-center gap-2 rounded-md border border-hairline-dark bg-surface-card px-3 py-2 text-[12px] font-medium leading-[1.5] text-muted-strong">
              <span className="size-1.5 rounded-full bg-primary" />{t.landing.badge}
            </div>
            <h1 className="kr-heading max-w-[720px] text-[42px] font-bold leading-[1.12] tracking-[-0.012em] text-white sm:text-[52px] lg:text-[60px]">
              {t.brand.sloganLead}<br /><span className="text-primary">{t.brand.sloganAccent}</span>
            </h1>
            <p className="kr-body mt-6 max-w-[610px] text-[17px] leading-[1.72] text-muted-strong">{t.landing.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={onEnterStudio} className="primary-button h-12 px-6 text-[15px]">{t.landing.primaryCta} <ArrowIcon /></button>
              <a href="#product" className="secondary-button h-12 px-6 text-[15px]">{t.landing.secondaryCta}</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[13px] leading-[1.55] text-muted-strong">
              {t.landing.trust.map((item) => <span key={item} className="flex items-center gap-2"><CheckIcon className="size-4 text-primary" />{item}</span>)}
            </div>
          </div>
          <HeroPreview />
        </section>

        <section id="product" className="border-y border-hairline-dark bg-[#0D1115]">
          <div className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24">
            <p className="section-kicker">{t.landing.principleKicker}</p>
            <h2 className="section-heading kr-heading max-w-[800px]">{t.landing.principleTitle}</h2>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <Feature index="01" icon={<ImageIcon />} title={t.landing.features[0].title} copy={t.landing.features[0].copy} />
              <Feature index="02" icon={<SparkIcon />} title={t.landing.features[1].title} copy={t.landing.features[1].copy} />
              <Feature index="03" icon={<ExportIcon />} title={t.landing.features[2].title} copy={t.landing.features[2].copy} />
            </div>
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="section-kicker">{t.landing.workflowKicker}</p>
              <h2 className="section-heading kr-heading">{t.landing.workflowTitle}</h2>
              <p className="section-body kr-body mt-5">{t.landing.workflowBody}</p>
            </div>
            <div className="divide-y divide-hairline-dark border-y border-hairline-dark">
              {t.landing.workflowSteps.map(([n, title, copy]) => (
                <div key={n} className="grid gap-3 py-6 sm:grid-cols-[56px_180px_1fr]">
                  <span className="font-number text-[14px] font-semibold text-primary">{n}</span>
                  <h3 className="kr-heading text-[16px] font-semibold leading-[1.55] text-white">{title}</h3>
                  <p className="kr-body m-0 text-[14px] leading-[1.65] text-muted-strong">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="privacy" className="border-y border-hairline-dark bg-surface-card">
          <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
            <div className="flex gap-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg border border-hairline-dark bg-canvas-dark text-primary"><ShieldIcon /></span>
              <div>
                <p className="section-kicker">{t.landing.privacyKicker}</p>
                <h2 className="kr-heading mt-2 text-[28px] font-semibold leading-[1.35] tracking-[-0.01em] text-white">{t.landing.privacyTitle}</h2>
                <p className="kr-body mt-3 max-w-[760px] text-[14px] leading-[1.7] text-muted-strong">{t.landing.privacyBody}</p>
              </div>
            </div>
            <button onClick={onEnterStudio} className="primary-button h-11 px-5">{t.landing.openStudio} <ArrowIcon /></button>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 py-24 text-center lg:px-8">
          <p className="section-kicker">{t.landing.finalKicker}</p>
          <h2 className="kr-heading mx-auto max-w-[820px] text-[38px] font-bold leading-[1.2] tracking-[-0.015em] text-white sm:text-[46px]">{t.landing.finalTitle}</h2>
          <button onClick={onEnterStudio} className="primary-button mx-auto mt-8 h-12 px-7 text-[15px]">{t.nav.start} <ArrowIcon /></button>
        </section>
      </main>

      <footer className="bg-[#FAFAFA] text-ink">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2.5"><Mark className="size-7" /><span className="text-[14px] font-semibold">{t.brand.name}</span></div>
          <p className="m-0 text-[13px] leading-[1.55] text-[#5E6673]">{t.landing.footer}</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ index, icon, title, copy }: { index: string; icon: ReactNode; title: string; copy: string }) {
  return (
    <article className="rounded-xl border border-hairline-dark bg-surface-card p-6">
      <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-lg bg-primary text-ink">{icon}</span><span className="font-number text-[12px] font-semibold text-muted">{index}</span></div>
      <h3 className="kr-heading mt-8 text-[20px] font-semibold leading-[1.45] text-white">{title}</h3>
      <p className="kr-body mt-3 text-[14px] leading-[1.7] text-muted-strong">{copy}</p>
    </article>
  );
}

function HeroPreview() {
  return (
    <div className="relative min-h-[480px] overflow-hidden rounded-xl border border-hairline-dark bg-surface-card p-3 shadow-[0_16px_44px_rgba(0,0,0,.16)]">
      <div className="flex h-10 items-center justify-between border-b border-hairline-dark px-2 text-[12px] leading-[1.45] text-muted"><span>{t.landing.preview.title}</span><span>74%</span></div>
      <div className="relative mt-3 h-[410px] overflow-hidden rounded-lg bg-[#FAFAFA] p-8 text-ink">
        <span className="text-[12px] font-semibold leading-[1.5] tracking-[0.02em] text-[#5E6673]">{t.landing.preview.label}</span>
        <h3 className="kr-heading mt-4 max-w-[440px] text-[31px] font-bold leading-[1.16] tracking-[-0.012em] sm:text-[35px]">{t.landing.preview.headline}</h3>
        <div className="absolute bottom-6 right-6 h-[188px] w-[72%] rounded-lg border border-[#CDD1D6] bg-white shadow-[0_10px_24px_rgba(24,26,32,.12)] sm:bottom-9 sm:right-8 sm:h-[210px] sm:w-[66%]">
          <div className="flex h-8 items-center gap-2 rounded-t-lg bg-[#F5F5F5] px-3"><i className="size-2 rounded-full bg-[#CDD1D6]" /><i className="size-2 rounded-full bg-[#CDD1D6]" /><i className="size-2 rounded-full bg-[#CDD1D6]" /></div>
          <div className="grid h-[156px] grid-cols-[48px_1fr] sm:h-[178px]"><div className="border-r border-[#EAECEF] p-3"><i className="block size-5 rounded bg-[#181A20]" /><i className="mt-4 block h-2 rounded bg-[#EAECEF]" /><i className="mt-2 block h-2 rounded bg-[#FCD535]" /></div><div className="p-4"><i className="block h-3 w-28 rounded bg-[#181A20]" /><div className="mt-4 grid grid-cols-3 gap-2">{[1, 2, 3].map((x) => <i key={x} className="h-14 rounded-md bg-[#F5F5F5]" />)}</div><i className="mt-3 block h-14 rounded-md bg-[#F5F5F5]" /></div></div>
        </div>
      </div>
    </div>
  );
}
