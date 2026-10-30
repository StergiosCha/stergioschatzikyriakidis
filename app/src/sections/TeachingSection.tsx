import { ArrowUpRight, BookOpen, Download, Play } from 'lucide-react';
import { useT } from '../i18n';
import SectionHead from '../components/SectionHead';

const workshop = '/teaching/clarin-2026/';

export default function TeachingSection() {
  const { t } = useT();
  return (
    <section id="teaching" className="block" aria-labelledby="teaching-title">
      <SectionHead index="07" kicker={t('teach.kicker')} id="teaching-title" title={t('teach.title')}>
        {t('teach.intro')}
      </SectionHead>
      <article className="proj neu grid lg:grid-cols-[1.4fr_1fr] gap-8 reveal">
        <div>
          <p className="eyebrow" style={{ color: 'var(--sym)' }}>{t('teach.event')}</p>
          <h3 className="h3 mb-4"><a href={workshop} style={{ color: 'var(--text)' }}>AI Applications for Language Analysis</a></h3>
          <p className="soft max-w-2xl mb-6">
            {t('teach.desc')}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={`${workshop}demo.html`} className="btn primary"><Play size={16} aria-hidden="true" />{t('teach.open')}</a>
            <a href={workshop} className="btn ghost">{t('teach.all')}<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="lg:pl-8 space-y-5" style={{ borderLeft: '1px solid var(--line)' }}>
          <div className="flex gap-3"><BookOpen className="shrink-0 mt-1" style={{ color: 'var(--sym)' }} size={20} aria-hidden="true" /><div><h4 className="text-base mb-1">{t('teach.act.h')}</h4><p className="text-sm soft">{t('teach.act.p')}</p></div></div>
          <div className="flex gap-3"><Download className="shrink-0 mt-1" style={{ color: 'var(--sym)' }} size={20} aria-hidden="true" /><div><h4 className="text-base mb-1">{t('teach.keep.h')}</h4><p className="text-sm soft">{t('teach.keep.p')}</p><a href={`${workshop}#downloads`} className="inline-flex text-sm underline underline-offset-4 mt-3">{t('teach.downloads')}</a></div></div>
        </div>
      </article>
    </section>
  );
}
