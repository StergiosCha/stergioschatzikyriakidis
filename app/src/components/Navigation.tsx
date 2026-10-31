import { useEffect, useRef, useState } from 'react';
import { Menu, X, Download, Sun, Moon } from 'lucide-react';
import { useT, type Lang } from '../i18n';

export const NAV_LINKS: { label: string; id: string; tab?: string }[] = [
  { label: 'nav.projects', id: 'projects' },
  { label: 'nav.about', id: 'bio' },
  { label: 'nav.research', id: 'research' },
  { label: 'nav.publications', id: 'outputs', tab: 'publications' },
  { label: 'nav.talks', id: 'outputs', tab: 'talks' },
  { label: 'nav.software', id: 'software' },
  { label: 'nav.demos', id: 'demos' },
  { label: 'nav.teaching', id: 'teaching' },
  { label: 'nav.news', id: 'news' },
  { label: 'nav.contact', id: 'contact' },
];

/** Jump to a research area in the network (works before the lazy network has mounted). */
export const goArea = (areaId: string) => {
  (window as unknown as { __pendingArea?: string }).__pendingArea = areaId;
  window.dispatchEvent(new CustomEvent('selectResearchArea', { detail: areaId }));
  goTo('research-network');
};
/** Open the publications tab filtered by a theme. */
export const goTheme = (themeId: string) => {
  window.dispatchEvent(new CustomEvent('setPubTheme', { detail: themeId }));
  goTo('outputs', 'publications');
};

export const goTo = (id: string, tab?: string) => {
  if (tab) window.dispatchEvent(new CustomEvent('switchOutputTab', { detail: tab }));
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
};

const getDark = () => document.documentElement.classList.contains('dark');
const ThemeToggle = () => {
  const { t } = useT();
  const [dark, setDark] = useState<boolean>(() => (typeof document !== 'undefined' ? getDark() : true));
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* storage unavailable */ }
    setDark(next);
  };
  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-pressed={!dark} aria-label={dark ? t('nav.theme.light') : t('nav.theme.dark')} title={dark ? t('nav.theme.light') : t('nav.theme.dark')}>
      {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
};

const LangToggle = () => {
  const { lang, setLang, t } = useT();
  return (
    <div className="flex gap-1" role="group" aria-label={t('nav.lang')}>
      {([['en', 'EN', 'English'], ['el', 'ΕΛ', 'Ελληνικά']] as [Lang, string, string][]).map(([l, short, full]) => (
        <button key={l} className="chip" lang={l} aria-pressed={lang === l} aria-label={full} onClick={() => setLang(l)}>{short}</button>
      ))}
    </div>
  );
};

const Navigation = () => {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // highlight the section currently in view
  useEffect(() => {
    const ids = Array.from(new Set(NAV_LINKS.map(l => l.id)));
    const els = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: '-35% 0px -55% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, []);

  // drawer: Escape closes, focus moves in and returns, page scroll locked
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('a,button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab' && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>('a,button'));
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); menuBtn.current?.focus(); };
  }, [open]);

  const link = (l: typeof NAV_LINKS[0], onDone?: () => void) => (
    <a key={l.label} href={`#${l.id}`} aria-current={active === l.id && (!l.tab || l.tab === 'publications') ? 'true' : undefined}
      onClick={(e) => { e.preventDefault(); onDone?.(); goTo(l.id, l.tab); }}>{t(l.label)}</a>
  );

  return (
    <>
      <header className="nav">
        <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <span className="brand-mark" aria-hidden="true">λ⊢</span> <span className="brand-long">{t('name.full')}</span><span className="brand-short">{t('name.last')}</span>
        </a>
        <nav className="nav-links" aria-label={t('nav.main')}>
          {NAV_LINKS.map(l => link(l))}
          <a className="btn-pill" href="/cv_cha.pdf" download="cv_cha.pdf" style={{ marginLeft: 8 }}><Download size={14} aria-hidden="true" /> {t('nav.cv')}</a>
          
        </nav>
        <span className="nav-tools"><LangToggle /><ThemeToggle /></span>
        <button ref={menuBtn} className="icon-btn nav-menu-btn" aria-label={t('nav.openMenu')} aria-expanded={open} aria-controls="nav-drawer" onClick={() => setOpen(true)}>
          <Menu size={20} aria-hidden="true" />
        </button>
      </header>
      {open && (
        <div className="drawer" id="nav-drawer" role="dialog" aria-modal="true" aria-label={t('nav.drawer')}>
          <div className="drawer-backdrop" onClick={() => setOpen(false)} />
          <div className="drawer-panel" ref={panel}>
            <div className="flex items-center justify-between mb-3">
              <span className="eyebrow" style={{ margin: 0 }}>{t('nav.menu')}</span>
              <button className="icon-btn" aria-label={t('nav.closeMenu')} onClick={() => setOpen(false)}><X size={18} aria-hidden="true" /></button>
            </div>
            {NAV_LINKS.map(l => link(l, () => setOpen(false)))}
            <a href="/cv_cha.pdf" download="cv_cha.pdf">{t('nav.downloadCv')}</a>
            <p className="muted text-xs mt-auto pt-6" style={{ lineHeight: 1.6 }}>{t('nav.role')}<br />{t('nav.org')}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
