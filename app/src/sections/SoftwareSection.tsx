import { ArrowRight, Database } from 'lucide-react';
import { useT } from '../i18n';
import SectionHead from '../components/SectionHead';
import { goTo } from '../components/Navigation';
import { tools } from '../data/tools';

const CAT = [
  { id: 'application', color: 'var(--neu)' },
  { id: 'dataset', color: 'var(--sym)' },
  { id: 'code', color: 'var(--emb)' },
  { id: 'model', color: 'var(--neg)' },
] as const;

const SoftwareSection = () => {
  const { t } = useT();
  return (
  <section id="software" className="block" aria-labelledby="software-title">
    <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
      <div>
        <SectionHead index="04" kicker={t('software.kicker')} id="software-title" title={<>{t('software.title.a')}<br />{t('software.title.b')}</>} />
        <div className="prose-le reveal">
          <p>
            {t('software.p1')}
          </p>
          <p>
            {t('software.p2.a')} <strong>Greek NLP Swiss Knife</strong> {t('software.p2.b')}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 reveal">
          {CAT.map(c => (
            <div key={c.id} className="info-card">
              <div className="big-num" style={{ color: c.color }}>{tools.filter(t => t.category === c.id).length}</div>
              <div className="num-label">{t(`software.cat.${c.id}`)}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 reveal">
          <a href="#outputs" onClick={(e) => { e.preventDefault(); goTo('outputs', 'software'); }} className="btn primary"><ArrowRight size={18} aria-hidden="true" /> {t('software.explore')}</a>
          <a href="#outputs" onClick={(e) => { e.preventDefault(); goTo('outputs', 'software'); }} className="btn ghost"><Database size={18} aria-hidden="true" /> {t('software.datasets')}</a>
        </div>
      </div>
      <div className="panel p-3 reveal">
        <img src="/images/software-collage.jpg" alt={t('software.alt')} loading="lazy" decoding="async" style={{ width: '100%', height: 'auto', borderRadius: 10 }} />
      </div>
    </div>
  </section>
  );
};

export default SoftwareSection;
