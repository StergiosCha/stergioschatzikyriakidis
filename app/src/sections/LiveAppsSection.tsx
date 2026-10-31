import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';
import { ExternalLink, Github, RefreshCw } from 'lucide-react';
import { featuredApp, liveApps } from '../data/liveApps';
import SectionHead from '../components/SectionHead';

const EMBED_TIMEOUT_MS = 20000;

const LiveDot = () => (
  <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: 'var(--ok)' }} />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: 'var(--ok)' }} />
  </span>
);

const LiveAppsSection = () => {
  const { t } = useT();
  const embedWrapRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [embedState, setEmbedState] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle');

  // Lazy-load the iframe only when the section approaches the viewport
  useEffect(() => {
    const el = embedWrapRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setShouldLoad(true); setEmbedState('loading'); observer.disconnect(); }
    }, { rootMargin: '400px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fallback if the app never loads (blocked framing, cold start gone wrong)
  useEffect(() => {
    if (!shouldLoad) return;
    const t = window.setTimeout(() => { setEmbedState((s) => (s === 'ready' ? s : 'failed')); }, EMBED_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [shouldLoad, attempt]);

  return (
    <section id="demos" className="block" aria-labelledby="demos-title">
      <SectionHead index="06" kicker={t('demos.kicker')} id="demos-title" title={t('demos.title')}>
        {t('demos.intro')}
      </SectionHead>

      <div ref={embedWrapRef} className="mb-12 reveal">
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: '1px solid var(--line)', background: 'rgba(7,11,24,.6)' }}>
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="w-3 h-3 rounded-full" style={{ background: '#ff6b9a88' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: 'var(--sym)88' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: 'var(--neu)88' }} />
            </div>
            <div className="hidden sm:flex items-center gap-2 flex-1 min-w-0 px-3 py-1 rounded-md mono text-[11px] muted truncate" style={{ background: 'var(--bg2)' }}>
              <LiveDot /><span className="truncate">{featuredApp.url.replace('https://', '')}</span>
            </div>
            <span className="sm:hidden flex items-center gap-2 mono text-[11px] muted flex-1"><LiveDot /> {t('demos.live')}</span>
            <a href={featuredApp.url} target="_blank" rel="noopener noreferrer" className="btn primary sm shrink-0"><ExternalLink size={12} aria-hidden="true" /> {t('demos.full')}</a>
          </div>
          <div className="relative" style={{ height: 'min(72vh, 720px)' }}>
            {shouldLoad && embedState !== 'failed' && (
              <iframe key={attempt} src={featuredApp.url} title={featuredApp.name} loading="lazy" className="w-full h-full border-0" style={{ background: '#fff' }} onLoad={() => setEmbedState('ready')} />
            )}
            {embedState !== 'ready' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ background: 'var(--bg2)' }}>
                {embedState === 'failed' ? (
                  <>
                    <p className="muted text-sm max-w-md">{t('demos.failed')}</p>
                    <div className="flex gap-3">
                      <a href={featuredApp.url} target="_blank" rel="noopener noreferrer" className="btn primary sm"><ExternalLink size={16} aria-hidden="true" /> {t('demos.newTab')}</a>
                      <button onClick={() => { setEmbedState('loading'); setAttempt((a) => a + 1); }} className="btn ghost sm"><RefreshCw size={16} aria-hidden="true" /> {t('demos.retry')}</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="font-serif text-5xl grad-all" aria-hidden="true">{featuredApp.glyph}</span>
                    <p className="muted text-sm" role="status">{embedState === 'loading' ? t('demos.waking') : featuredApp.name}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-3 mt-4">
          <div className="max-w-2xl">
            <h3 className="font-serif text-lg font-semibold">{featuredApp.name}</h3>
            <p className="soft text-sm mt-1">{featuredApp.tagline}</p>
            {featuredApp.paperUrl && (
              <a href={featuredApp.paperUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-xs">
                <ExternalLink size={12} aria-hidden="true" /> {t('demos.paper')}
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-2">{featuredApp.tags.map((t) => <span key={t} className="tag emb">{t}</span>)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveApps.map((app) => (
          <article key={app.name} className="card lift flex flex-col reveal">
            <div className="flex items-center justify-between mb-3">
              <span className="font-serif text-3xl leading-none grad-all" aria-hidden="true">{app.glyph}</span>
              <span className="flex items-center gap-1.5 mono text-[10px] uppercase" style={{ color: 'var(--ok)' }}><LiveDot /> {t('demos.live')}</span>
            </div>
            <h3 className="font-serif font-semibold text-[1.08rem] mb-1.5">{app.name}</h3>
            <p className="soft text-[13.5px] leading-relaxed mb-3 flex-1">{app.tagline}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">{app.tags.map((t) => <span key={t} className="tag neu">{t}</span>)}</div>
            <div className="flex gap-2">
              <a href={app.url} target="_blank" rel="noopener noreferrer" className="minibtn hl" aria-label={`Launch ${app.name}`}><ExternalLink size={12} aria-hidden="true" /> {t('demos.launch')}</a>
              {app.githubUrl && <a href={app.githubUrl} target="_blank" rel="noopener noreferrer" className="minibtn" aria-label={`Code for ${app.name}`}><Github size={12} aria-hidden="true" /> {t('demos.code')}</a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LiveAppsSection;
