import { ArrowRight, Download } from 'lucide-react';
import { SOCIALS } from '../components/icons';
import { goArea, goTheme, goTo } from '../components/Navigation';
import { useT } from '../i18n';

// "applied to:" chips → the best existing target on the page
const APPLIED: { key: string; go: () => void; href: string }[] = [
  { key: 'hero.chip.dialect', go: () => goTo('p-codag'), href: '#p-codag' },          // CoDAG project card
  { key: 'hero.chip.llm', go: () => goArea('dl-nlu'), href: '#research-network' },     // research area: DL, NLU & neuro-symbolic
  { key: 'hero.chip.nli', go: () => goTheme('nli'), href: '#outputs' },                // publications filtered by theme
  { key: 'hero.chip.distance', go: () => goArea('arabic'), href: '#research-network' }, // area: Arabic dialects & language distance
  { key: 'hero.chip.dh', go: () => goArea('digital-humanities'), href: '#research-network' },
  { key: 'hero.chip.dialogue', go: () => goArea('dialogue'), href: '#research-network' },
];

const HeroSection = () => {
  const { t } = useT();

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div>
        <p className="eyebrow reveal">{t('hero.eyebrow')}</p>
        <h1 id="hero-title" className="h-display reveal" style={{ marginBottom: 22, color: 'var(--text)' }}>
          {t('name.first')}<br />{t('name.last')}
        </h1>
        <p className="lede reveal" style={{ fontSize: '1.14rem', marginBottom: 10 }}>
          {t('hero.lede.a')} <span className="grad-sym" style={{ fontWeight: 600 }}>{t('hero.lede.sym')}</span> {t('hero.lede.b')}{' '}
          <span className="grad-neu" style={{ fontWeight: 600 }}>{t('hero.lede.neu')}</span>{t('hero.lede.c')}
        </p>
        <p className="muted reveal" style={{ fontSize: '.95rem', marginBottom: 28, maxWidth: '62ch' }}>
          {t('hero.role1')}<br />{t('hero.role2')}
        </p>
        <div className="flex flex-wrap gap-3 reveal">
          <a className="btn primary" href="#outputs" onClick={(e) => { e.preventDefault(); goTo('outputs', 'publications'); }}>
            {t('hero.ctaOutputs')} <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a className="btn ghost" href="/cv_cha.pdf" download="cv_cha.pdf"><Download size={18} aria-hidden="true" /> {t('hero.ctaCv')}</a>
          <a className="btn ghost" href="#projects" onClick={(e) => { e.preventDefault(); goTo('projects'); }}>{t('hero.ctaProjects')}</a>
        </div>
        <div className="flex flex-wrap items-start gap-6 mt-8 reveal">
          <div className="socials">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Icon /></a>
            ))}
          </div>
          <div>
            <div className="hero-legend loop" aria-label={t('hero.legend.aria')}>
              <span><i className="dot" style={{ background: 'var(--sym)' }} />{t('hero.legend.formal')}</span><span className="arrow" aria-hidden="true">⇄</span>
              <span><i className="dot" style={{ background: 'var(--emb)' }} />{t('hero.legend.proof')}</span><span className="arrow" aria-hidden="true">⇄</span>
              <span><i className="dot" style={{ background: 'var(--neu)' }} />{t('hero.legend.neural')}</span>
            </div>
            <nav className="flex flex-wrap items-center gap-1.5 mt-3" aria-label={t('hero.applied')}>
              <span className="mono text-[.74rem] muted mr-1">{t('hero.applied')}</span>
              {APPLIED.map(c => (
                <a key={c.key} href={c.href} className="chip" style={{ textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); c.go(); }}>{t(c.key)}</a>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="reveal">
        <div className="portrait">
          <img src="/images/hero-portrait.jpg" alt={t('name.full')} width={720} height={900} fetchPriority="high" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
