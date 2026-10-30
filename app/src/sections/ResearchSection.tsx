import { ArrowRight } from 'lucide-react';
import { useT } from '../i18n';
import SectionHead from '../components/SectionHead';
import Deferred, { LazyResearchNetwork } from '../components/Deferred';
import { goTo } from '../components/Navigation';

const ResearchSection = () => {
  const { t } = useT();
  return (
  <section id="research" className="block" aria-labelledby="research-title">
    <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start mb-10">
      <div>
        <SectionHead index="03" kicker={t('research.kicker')} id="research-title" title={t('research.title')} />
        <div className="prose-le reveal">
          <p>
            {t('research.p1')}
          </p>
          <p>
            {t('research.p2')}
          </p>
        </div>
        <a href="#outputs" onClick={(e) => { e.preventDefault(); goTo('outputs', 'publications'); }} className="btn ghost sm mt-2 reveal">
          {t('research.cta')} <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
      <figure className="panel p-3 reveal" style={{ margin: 0 }}>
        <img src="/images/research-zeugma.png" alt={t('research.figAlt')} loading="lazy" decoding="async" style={{ width: '100%', height: 'auto', borderRadius: 10, background: '#fff' }} />
        <figcaption className="mono text-[11px] muted mt-2">{t('research.fig')}</figcaption>
      </figure>
    </div>
    <div className="reveal" id="research-network" style={{ scrollMarginTop: 80 }}>
      <p className="eyebrow">{t('research.eyebrow')}</p>
      <Deferred label="network" minHeight={520}><LazyResearchNetwork /></Deferred>
    </div>
  </section>
  );
};

export default ResearchSection;
