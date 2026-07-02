import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, RefreshCw } from 'lucide-react';
import { featuredApp, liveApps } from '../data/liveApps';

const EMBED_TIMEOUT_MS = 20000;

const LiveDot = () => (
  <span className="relative flex h-2.5 w-2.5 shrink-0">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
  </span>
);

const LiveAppsSection = () => {
  const embedWrapRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [embedState, setEmbedState] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle');

  // Lazy-load the iframe only when the section approaches the viewport
  useEffect(() => {
    const el = embedWrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          setEmbedState('loading');
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fallback if the app never loads (blocked framing, cold start gone wrong)
  useEffect(() => {
    if (!shouldLoad) return;
    const t = window.setTimeout(() => {
      setEmbedState((s) => (s === 'ready' ? s : 'failed'));
    }, EMBED_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [shouldLoad, attempt]);

  return (
    <section
      id="demos"
      className="relative z-[60] py-20"
      style={{ backgroundColor: 'var(--bg-primary)', scrollMarginTop: '4rem' }}
    >
      <div className="px-[4vw] lg:px-[6vw] max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <span className="label mb-3 block">Interactive</span>
          <h2 className="text-ink mb-4 text-3xl lg:text-4xl">Live demos</h2>
          <p className="text-mut max-w-2xl text-sm lg:text-base leading-relaxed">
            These are not screenshots. Every tool below is deployed and running right now —
            try the embedded workbench directly, or launch any app in a new tab.
          </p>
        </div>

        {/* Featured embed: Svarna */}
        <div ref={embedWrapRef} className="mb-14">
          <div className="rounded-xl overflow-hidden border border-ink/10 bg-surface/60 shadow-sm">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-ink/10 bg-surface/70">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-ink/15" />
                <span className="w-3 h-3 rounded-full bg-ink/15" />
                <span className="w-3 h-3 rounded-full bg-ink/15" />
              </div>
              <div className="hidden sm:flex items-center gap-2 flex-1 min-w-0 px-3 py-1 rounded-md bg-ink/5 text-[11px] font-mono text-mut truncate">
                <LiveDot />
                <span className="truncate">{featuredApp.url.replace('https://', '')}</span>
              </div>
              <span className="sm:hidden flex items-center gap-2 text-[11px] font-mono text-mut">
                <LiveDot /> live
              </span>
              <a
                href={featuredApp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 bg-terra text-white text-xs font-semibold rounded hover:bg-terradark transition-colors"
              >
                <ExternalLink size={12} />
                Open full screen
              </a>
            </div>

            {/* Embed / fallback */}
            <div className="relative" style={{ height: 'min(72vh, 720px)' }}>
              {shouldLoad && embedState !== 'failed' && (
                <iframe
                  key={attempt}
                  src={featuredApp.url}
                  title={featuredApp.name}
                  loading="lazy"
                  className="w-full h-full border-0"
                  onLoad={() => setEmbedState('ready')}
                />
              )}
              {embedState !== 'ready' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-paper px-6 text-center pointer-events-auto">
                  {embedState === 'failed' ? (
                    <>
                      <p className="text-mut text-sm max-w-md">
                        The live app didn&apos;t load here — it may be waking up from a cold start.
                      </p>
                      <div className="flex gap-3">
                        <a href={featuredApp.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                          <ExternalLink size={16} />
                          Launch in a new tab
                        </a>
                        <button onClick={() => { setEmbedState('loading'); setAttempt((a) => a + 1); }} className="btn-secondary">
                          <RefreshCw size={16} />
                          Retry
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-display text-terra">{featuredApp.glyph}</span>
                      <p className="text-mut text-sm">
                        {embedState === 'loading' ? 'Waking up the corpus workbench…' : featuredApp.name}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Featured caption */}
          <div className="flex flex-wrap items-start justify-between gap-3 mt-4">
            <div className="max-w-2xl">
              <h3 className="font-display font-semibold text-ink text-base lg:text-lg">{featuredApp.name}</h3>
              <p className="text-mut text-sm leading-relaxed mt-1">{featuredApp.tagline}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {featuredApp.tags.map((t) => (
                <span key={t} className="text-[10px] font-mono text-mut bg-ink/5 px-2 py-1 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* App cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveApps.map((app) => (
            <div
              key={app.name}
              className="group flex flex-col rounded-xl border border-ink/10 bg-surface/60 p-5 hover:border-terra/40 hover:bg-surface/80 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-display text-terra leading-none">{app.glyph}</span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-400">
                  <LiveDot /> live
                </span>
              </div>
              <h3 className="font-display font-semibold text-ink text-sm mb-1.5">{app.name}</h3>
              <p className="text-xs text-mut leading-relaxed mb-3 flex-1">{app.tagline}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {app.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono text-mut bg-ink/5 px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink text-paper text-xs font-semibold rounded hover:bg-terra transition-colors"
                >
                  <ExternalLink size={12} />
                  Launch
                </a>
                {app.githubUrl && (
                  <a
                    href={app.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink/10 text-ink text-xs font-medium rounded hover:bg-ink/20 transition-colors"
                  >
                    <Github size={12} />
                    Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveAppsSection;
