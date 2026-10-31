import { FileText } from 'lucide-react';
import { useT } from '../i18n';
import SectionHead from '../components/SectionHead';
import { goTo } from '../components/Navigation';
import { svarnaLabUrl } from '../data/projects';
import Deferred, { LazyTimeline } from '../components/Deferred';

const BioSection = () => {
  const { t } = useT();
  return (
  <section id="bio" className="block" aria-labelledby="bio-title">
    <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-12 items-start">
      <div className="reveal">
        <div className="portrait" style={{ maxWidth: 400 }}>
          <img src="/images/bio-portrait.jpg" alt={t('name.full')} loading="lazy" decoding="async" />
        </div>
      </div>
      <div>
        <SectionHead index="02" kicker={t('bio.kicker')} id="bio-title" title={t('bio.title')} />
        <div className="prose-le reveal">
          <p>
            {t('bio.p1.a')}{' '}
            <a href={svarnaLabUrl} target="_blank" rel="noopener noreferrer">SVARNA</a>{t('bio.p1.b')}
          </p>
          <p>
            {t('bio.p2')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-6 reveal">
          <a href="https://scholar.google.com/citations?user=dAYpE3MAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="btn primary sm">
            <FileText size={16} aria-hidden="true" /> {t('bio.scholar')}
          </a>
          <p className="muted" style={{ margin: 0 }}>
            {t('bio.novelist')}{' '}
            <a href="#novelist" onClick={(e) => { e.preventDefault(); goTo('novelist'); }}>{t('bio.seeHere')}</a>
          </p>
        </div>
      </div>
    </div>
    <div className="reveal mt-12" id="timeline" style={{ scrollMarginTop: 80 }}>
      <p className="eyebrow">{t('tl.eyebrow')}</p>
      <Deferred label="timeline" minHeight={360}><LazyTimeline /></Deferred>
    </div>
  </section>
  );
};

export default BioSection;
