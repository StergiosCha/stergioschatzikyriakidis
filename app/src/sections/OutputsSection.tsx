import { useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../i18n';
import { BookOpen, Check, Copy, Download, ExternalLink, FileText, Github, Globe, Mic, Search, X } from 'lucide-react';
import SectionHead from '../components/SectionHead';
import Deferred, { LazyYearChart } from '../components/Deferred';
import { allPubs, bibtexFor, copyText, groupOf, KIND_GROUPS, themesOf, THEMES, venueOf, VENUES, type PubEntry } from '../lib/pubs';
import { conferenceTalks, invitedTalks, posters, type Talk } from '../data/talks';
import { tools, type Tool } from '../data/tools';

const clean = (t: string) => t.replace(/\\'/g, "'");
const TABS = [
  { id: 'publications', label: 'Publications', Icon: BookOpen },
  { id: 'talks', label: 'Talks & presentations', Icon: Mic },
  { id: 'software', label: 'Software & datasets', Icon: FileText },
] as const;
type TabId = typeof TABS[number]['id'];

const TALK_CATS = [
  { id: 'invited', label: 'Invited talks', color: '#f5b942' },
  { id: 'conference', label: 'Conference / workshop', color: '#a78bfa' },
  { id: 'poster', label: 'Posters', color: '#38d9f5' },
];
const talkNum = (t: Talk) => { const m = t.year.match(/(19|20)\d{2}/); return m ? +m[0] : null; };

function PubRow({ pub }: { pub: PubEntry }) {
  const { t } = useT();
  const tr = t;
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  const bib = useMemo(() => bibtexFor(pub), [pub]);
  const themes = themesOf(pub);
  return (
    <li className="pub" id={`pub-${pub.key}`}>
      <span className="n">[{pub.number}]</span>
      <div className="min-w-0">
        <h4>{clean(pub.title)}</h4>
        <p className="meta">{pub.authors}</p>
        <p className="meta">{pub.venue && <span>{pub.venue}, </span>}<span className="yr">{pub.year || 'n.d.'}</span></p>
        <div className="flex flex-wrap gap-2 mt-2.5 items-center">
          {pub.pdfLink && <a className="minibtn hl" href={pub.pdfLink} target="_blank" rel="noopener noreferrer" aria-label={`PDF: ${clean(pub.title)}`}><Download size={12} aria-hidden="true" /> {t('out.pdf')}</a>}
          {pub.link && <a className="minibtn" href={pub.link} target="_blank" rel="noopener noreferrer" aria-label={`Link: ${clean(pub.title)}`}><ExternalLink size={12} aria-hidden="true" /> {t('out.link')}</a>}
          <button className="minibtn" onClick={async () => { if (await copyText(bib)) { setCopied(true); window.setTimeout(() => setCopied(false), 1600); } }} aria-label={t('out.copyAria', { t: clean(pub.title) })}>
            {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />} {copied ? t('out.copied') : t('out.bibtex')}
          </button>
          <button className="minibtn" aria-expanded={show} onClick={() => setShow(s => !s)}>{show ? t('out.hide') : t('out.show')}</button>
          {themes.map(th => <span key={th} className="tag emb" style={{ fontSize: '.6rem' }}>{tr(`theme.${th}`)}</span>)}
        </div>
        {show && <pre aria-label="BibTeX entry">{bib}</pre>}
      </div>
    </li>
  );
}

function TalkRow({ talk }: { talk: Talk }) {
  return (
    <li className="pub">
      <span className="n">[{talk.number}]</span>
      <div className="min-w-0">
        <h4>{clean(talk.title)}</h4>
        <p className="meta">{talk.authors}</p>
        <p className="meta"><span>{talk.venue}, </span><span className="yr">{talk.year}</span></p>
      </div>
    </li>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const { t } = useT();
  return (
    <article className="card lift">
      <h4 className="font-serif font-semibold text-[1.02rem] mb-1.5">{tool.name}</h4>
      <p className="soft text-[13px] leading-relaxed mb-3">{tool.description}</p>
      <div className="flex gap-2 flex-wrap">
        {tool.platformUrl && <a className="minibtn hl" href={tool.platformUrl} target="_blank" rel="noopener noreferrer" aria-label={`Platform: ${tool.name}`}><Globe size={12} aria-hidden="true" /> {t('out.platform')}</a>}
        {tool.githubUrl && <a className="minibtn" href={tool.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`GitHub: ${tool.name}`}><Github size={12} aria-hidden="true" /> {t('out.github')}</a>}
      </div>
    </article>
  );
}

const OutputsSection = () => {
  const { t } = useT();
  const [tab, setTab] = useState<TabId>('publications');
  const [query, setQuery] = useState('');
  const [year, setYear] = useState<number | null>(null);
  const [kinds, setKinds] = useState<string[]>([]);
  const [theme, setTheme] = useState<string | null>(null);
  const [venue, setVenue] = useState<string>('all');
  const [talkYear, setTalkYear] = useState<number | null>(null);
  const [bulk, setBulk] = useState<'idle' | 'copied'>('idle');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handler = (e: Event) => { const t = (e as CustomEvent).detail; if (t) setTab(t); };
    const onTheme = (e: Event) => { const th = (e as CustomEvent).detail; if (th) { setTab('publications'); setTheme(th); setYear(null); setKinds([]); setVenue('all'); setQuery(''); } };
    window.addEventListener('switchOutputTab', handler);
    window.addEventListener('setPubTheme', onTheme);
    return () => { window.removeEventListener('switchOutputTab', handler); window.removeEventListener('setPubTheme', onTheme); };
  }, []);

  const venueCounts = useMemo(() => VENUES.map(v => ({ ...v, n: allPubs.filter(p => venueOf(p) === v.id).length })).filter(v => v.n >= 2), []);
  const themeCounts = useMemo(() => THEMES.map(t => ({ ...t, n: allPubs.filter(p => themesOf(p).includes(t.id)).length })), []);
  const years = useMemo(() => Array.from(new Set(allPubs.map(p => p.yearNum).filter(Boolean) as number[])).sort((a, b) => b - a), []);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => allPubs.filter(p => {
    if (q && !`${p.title} ${p.authors} ${p.venue ?? ''} ${p.year}`.toLowerCase().includes(q)) return false;
    if (year != null && p.yearNum !== year) return false;
    if (kinds.length && !kinds.includes(groupOf(p.type).id)) return false;
    if (theme && !themesOf(p).includes(theme)) return false;
    if (venue !== 'all' && venueOf(p) !== venue) return false;
    return true;
  }), [q, year, kinds, theme, venue]);
  const filtering = !!q || year != null || kinds.length > 0 || !!theme || venue !== 'all';
  const clearAll = () => { setQuery(''); setYear(null); setKinds([]); setTheme(null); setVenue('all'); };
  const bibAll = () => filtered.map(p => bibtexFor(p)).join('\n\n');
  const downloadBib = () => {
    const blob = new Blob([bibAll() + '\n'], { type: 'application/x-bibtex' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'chatzikyriakidis.bib'; a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const allTalks = useMemo(() => [
    ...invitedTalks.map(t => ({ t, cat: 'invited' })), ...conferenceTalks.map(t => ({ t, cat: 'conference' })), ...posters.map(t => ({ t, cat: 'poster' })),
  ], []);
  const talkGroups = [
    { title: t('out.talk.invited'), items: invitedTalks },
    { title: t('out.talk.conference'), items: conferenceTalks },
    { title: t('out.talk.posters'), items: posters },
  ].map(g => ({ ...g, items: g.items.filter(t => (talkYear == null || talkNum(t) === talkYear) && (!q || `${t.title} ${t.authors} ${t.venue}`.toLowerCase().includes(q))) }));

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const j = (i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
    setTab(TABS[j].id); tabRefs.current[j]?.focus();
  };

  return (
    <section id="outputs" className="block" aria-labelledby="outputs-title">
      <SectionHead index="08" kicker={t('out.kicker')} id="outputs-title" title={t(`out.tab.${tab}`)}>
        {t(`out.intro.${tab}`)}
      </SectionHead>

      <div className="tabs mb-6" role="tablist" aria-label={t('out.tabsAria')}>
        {TABS.map(({ id, Icon }, i) => (
          <button key={id} ref={el => { tabRefs.current[i] = el; }} role="tab" id={`tab-${id}`} aria-controls={`panel-${id}`} aria-selected={tab === id} tabIndex={tab === id ? 0 : -1}
            className="tab" onClick={() => setTab(id)} onKeyDown={(e) => onTabKey(e, i)}>
            <Icon size={15} aria-hidden="true" /> {t(`out.tab.${id}`)}
          </button>
        ))}
      </div>

      {tab === 'publications' && (
        <div role="tabpanel" id="panel-publications" aria-labelledby="tab-publications">
          <div className="panel p-4 mb-4">
            <p className="eyebrow" style={{ marginBottom: 6 }}>{t('out.chart.pubs')}</p>
            <Deferred label="year chart" minHeight={220}><LazyYearChart items={allPubs.map(p => ({ year: p.yearNum, cat: groupOf(p.type).id }))} cats={KIND_GROUPS.map(g => ({ id: g.id, label: t(`kind.${g.id}`), color: g.color }))}
              selected={year} onSelect={setYear} label={t('nav.publications')} /></Deferred>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto_auto] gap-3 mb-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 muted pointer-events-none" aria-hidden="true" />
              <input type="search" className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('out.search')} aria-label={t('out.searchAria')} />
              {query && <button onClick={() => setQuery('')} aria-label={t('out.clearSearch')} className="absolute right-2.5 top-1/2 -translate-y-1/2 muted"><X size={15} /></button>}
            </div>
            <select className="select" value={year ?? 'all'} onChange={(e) => setYear(e.target.value === 'all' ? null : +e.target.value)} aria-label={t('out.yearAria')}>
              <option value="all">{t('out.allYears')}</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select className="select" value={venue} onChange={(e) => setVenue(e.target.value)} aria-label={t('out.venueAria')}>
              <option value="all">{t('out.allVenues')}</option>
              {venueCounts.map(v => <option key={v.id} value={v.id}>{v.label} ({v.n})</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-2 mb-2" role="group" aria-label={t('out.typeAria')}>
            {KIND_GROUPS.map(g => (
              <button key={g.id} className="chip" aria-pressed={kinds.includes(g.id)} onClick={() => setKinds(k => k.includes(g.id) ? k.filter(x => x !== g.id) : [...k, g.id])}>
                <i className="dot" style={{ background: g.color, margin: 0 }} /> {t(`kind.${g.id}`)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={t('out.themeAria')}>
            {themeCounts.map(tc => (
              <button key={tc.id} className="chip emb" aria-pressed={theme === tc.id} onClick={() => setTheme(th => th === tc.id ? null : tc.id)}>{t(`theme.${tc.id}`)} · {tc.n}</button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 py-3" style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
            <p className="mono text-[12px] soft" role="status" aria-live="polite" style={{ margin: 0 }}>
              {t('out.count', { n: filtered.length, total: allPubs.length })}{year != null && ` · ${year}`}{theme && ` · ${t(`theme.${theme}`)}`}
            </p>
            <div className="flex flex-wrap gap-2">
              {filtering && <button className="minibtn" onClick={clearAll}><X size={12} aria-hidden="true" /> {t('out.clear')}</button>}
              <button className="minibtn" disabled={!filtered.length} onClick={async () => { if (await copyText(bibAll())) { setBulk('copied'); window.setTimeout(() => setBulk('idle'), 1600); } }}>
                {bulk === 'copied' ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />} {bulk === 'copied' ? t('out.copied') : t('out.copyAll', { n: filtered.length })}
              </button>
              <button className="minibtn" disabled={!filtered.length} onClick={downloadBib}><Download size={12} aria-hidden="true" /> .bib</button>
            </div>
          </div>

          <div className="grid gap-8">
            {KIND_GROUPS.map(g => {
              const items = filtered.filter(p => g.kinds.includes(p.type));
              if (!items.length) return null;
              return (
                <div key={g.id}>
                  <div className="group-h"><span className="dot" style={{ background: g.color }} /><h3 className="font-serif text-lg font-semibold">{g.title.slice(0, 3)}{t(`kind.${g.id}`)}</h3><span className="mono text-[12px] muted">{items.length}</span></div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{items.map(p => <PubRow key={p.key} pub={p} />)}</ul>
                </div>
              );
            })}
            {!filtered.length && <p className="muted text-center py-8">{t('out.none')}</p>}
          </div>
        </div>
      )}

      {tab === 'talks' && (
        <div role="tabpanel" id="panel-talks" aria-labelledby="tab-talks">
          <div className="panel p-4 mb-4">
            <p className="eyebrow" style={{ marginBottom: 6 }}>{t('out.chart.talks')}</p>
            <Deferred label="year chart" minHeight={220}><LazyYearChart items={allTalks.map(({ t, cat }) => ({ year: talkNum(t), cat }))} cats={TALK_CATS.map(c => ({ ...c, label: t(`out.talkCat.${c.id}`) }))} selected={talkYear} onSelect={setTalkYear} label={t('nav.talks')} /></Deferred>
          </div>
          <div className="relative mb-6 max-w-xl">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 muted pointer-events-none" aria-hidden="true" />
            <input type="search" className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('out.talkSearch')} aria-label={t('out.talkSearchAria')} />
          </div>
          <div className="grid gap-8">
            {talkGroups.map(g => (
              <div key={g.title}>
                <div className="group-h"><h3 className="font-serif text-lg font-semibold">{g.title}</h3><span className="mono text-[12px] muted">{g.items.length}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{g.items.map((t, i) => <TalkRow key={`${g.title}-${i}`} talk={t} />)}</ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'software' && (
        <div role="tabpanel" id="panel-software" aria-labelledby="tab-software" className="grid gap-10">
          {(['application', 'code', 'dataset', 'model'] as const).map(cat => {
            const title = t(`out.sw.${cat}`);
            const items = tools.filter(t => t.category === cat);
            return (
              <div key={cat}>
                <div className="group-h mb-4"><h3 className="font-serif text-lg font-semibold">{title}</h3><span className="mono text-[12px] muted">{items.length}</span></div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{items.map(t => <ToolCard key={t.name} tool={t} />)}</div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default OutputsSection;
