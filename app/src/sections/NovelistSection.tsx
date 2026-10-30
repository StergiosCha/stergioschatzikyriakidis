import { ExternalLink } from 'lucide-react';
import { useT } from '../i18n';

const NovelistSection = () => {
  const { t } = useT();
  return (
  <section id="novelist" className="block" aria-labelledby="novelist-title">
    <div className="proj emb grid md:grid-cols-[0.8fr_1.2fr] gap-10 items-center reveal">
      <img src="/images/novelist-collage.jpg" alt={t('novel.alt')} loading="lazy" decoding="async" style={{ width: '100%', height: 'auto', borderRadius: 14 }} />
      <div>
        <p className="eyebrow">{t('novel.kicker')} · <b>{t('novel.kickerB')}</b></p>
        <h2 className="h2" id="novelist-title">{t('novel.title')}</h2>
        <p className="soft" style={{ fontSize: '1.06rem', maxWidth: '56ch' }}>
          {t('novel.text')}
        </p>
        <a href="https://stergioscha.github.io/stergios/" target="_blank" rel="noopener noreferrer" className="btn primary mt-4">
          {t('novel.cta')} <ExternalLink size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
  );
};

export default NovelistSection;
