import { useMemo, useState } from 'react';
import { useT } from '../../i18n';
import { publications, abstracts } from '../../data/publications';
import { allTalks } from '../../data/talks';
import { news } from '../../data/news';

/** Career timeline computed from the data files: per-year output (publications, talks) as a
 *  stacked bar track, with milestones (books, appointments, software) as labelled pins.
 *  Everything comes from publications.ts, talks.ts and news.ts; nothing here is typed by hand
 *  except the milestone categories and the small fixed list of career positions below. */

type Kind = 'pub' | 'talk';
const COL: Record<Kind, string> = { pub: 'var(--sym)', talk: 'var(--neu)' };

// Career positions, from the bio text on the site (bio.p2) and the news list.
const POSITIONS = [
  { from: 2016, to: 2021, key: 'tl.pos.clasp', row: 0 },
  { from: 2021, to: 2026, key: 'tl.pos.crete', row: 1 },
  { from: 2026, to: 2026, key: 'tl.pos.ilsp', row: 0 },
];

const yearOf = (s: string) => { const m = s.match(/(19|20)\d{2}/); return m ? +m[0] : null; };

export default function Timeline() {
  const { t, lang } = useT();
  const [sel, setSel] = useState<number | null>(null);

  const m = useMemo(() => {
    const counts: Record<number, { pub: number; talk: number }> = {};
    const bump = (y: number | null, k: Kind) => { if (!y) return; (counts[y] ||= { pub: 0, talk: 0 })[k]++; };
    [...publications, ...abstracts].forEach(p => bump(yearOf(p.year), 'pub'));
    allTalks.forEach(x => bump(yearOf(x.year), 'talk'));
    const years = Object.keys(counts).map(Number).sort((a, b) => a - b);
    const y0 = years[0], y1 = years[years.length - 1];
    const max = Math.max(...Object.values(counts).map(c => c.pub + c.talk));
    // milestones: monographs + edited volumes from publications, and software/general news items
    const books = publications.filter(p => p.type === 'monograph').map(p => ({ year: yearOf(p.year), label: p.title, kind: 'book' as const, link: p.link || p.pdfLink || null }));
    const soft = news.filter(n => n.type === 'software' || n.type === 'general').map(n => ({ year: yearOf(n.date), label: n.text, kind: n.type === 'software' ? 'software' as const : 'career' as const, link: n.link || null }));
    const miles = [...books, ...soft].filter(x => x.year) as { year: number; label: string; kind: 'book' | 'software' | 'career'; link: string | null }[];
    return { counts, y0, y1, max, miles };
  }, []);

  const W = 1100, H = 300, L = 40, Rr = 20, top = 86, barH = 110, span = m.y1 - m.y0 + 1, cw = (W - L - Rr) / span;
  const x = (y: number) => L + (y - m.y0) * cw;
  const fmt = (n: number) => n.toLocaleString(lang === 'el' ? 'el-GR' : 'en-GB');
  const kindColor = { book: 'var(--sym)', software: 'var(--neu)', career: 'var(--emb)' };
  const yearItems = sel ? {
    pubs: [...publications, ...abstracts].filter(p => yearOf(p.year) === sel),
    talks: allTalks.filter(x => yearOf(x.year) === sel),
    miles: m.miles.filter(x => x.year === sel),
  } : null;

  return (
    <div className="panel p-3">
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={t('tl.aria')} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* positions band */}
        {POSITIONS.map(p => (
          <g key={p.key}>
            <rect x={x(p.from) + 2} y={10 + p.row * 20} width={Math.max(cw, (p.to - p.from + (p.to === p.from ? 1 : 0)) * cw) - 4} height={16} rx={8} fill="var(--emb)" opacity={0.18} />
            <text x={p.from === p.to ? x(p.to) + cw - 10 : x(p.from) + 10} textAnchor={p.from === p.to ? 'end' : 'start'} y={22 + p.row * 20} fontSize={10.5} fill="var(--soft)" style={{ fontFamily: 'var(--mono)' }}>{t(p.key)}</text>
          </g>
        ))}
        {/* milestones */}
        {m.miles.map((mi, i) => {
          const same = m.miles.filter(z => z.year === mi.year); const k = same.indexOf(mi);
          const cx = x(mi.year) + cw / 2, cy = 62 + (k % 2) * 10;
          return (
            <g key={i} style={{ cursor: 'pointer' }} onClick={() => setSel(mi.year)}>
              <circle cx={cx} cy={cy} r={5} fill={kindColor[mi.kind]} stroke="var(--bg)" strokeWidth={1.5} />
              <title>{mi.label}</title>
            </g>
          );
        })}
        {/* bars */}
        {Array.from({ length: span }, (_, i) => m.y0 + i).map(y => {
          const c = m.counts[y] || { pub: 0, talk: 0 }, total = c.pub + c.talk, on = sel === y;
          const hp = (c.pub / m.max) * barH, ht = (c.talk / m.max) * barH, base = top + barH;
          return (
            <g key={y} role="button" tabIndex={0} aria-label={`${y}: ${c.pub} ${t('tl.pubs')}, ${c.talk} ${t('tl.talks')}`}
               onClick={() => setSel(on ? null : y)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(on ? null : y); } }}
               style={{ cursor: 'pointer' }} opacity={sel && !on ? 0.45 : 1}>
              <rect x={x(y) + 1} y={top} width={cw - 2} height={barH} fill={on ? 'var(--hair)' : 'transparent'} rx={4} />
              <rect x={x(y) + 4} y={base - hp} width={cw - 8} height={hp} fill={COL.pub} rx={2} />
              <rect x={x(y) + 4} y={base - hp - ht} width={cw - 8} height={ht} fill={COL.talk} rx={2} opacity={0.85} />
              {total > 0 && <text x={x(y) + cw / 2} y={base - hp - ht - 5} textAnchor="middle" fontSize={10} fill="var(--muted)" style={{ fontFamily: 'var(--mono)' }}>{total}</text>}
              <text x={x(y) + cw / 2} y={base + 16} textAnchor="middle" fontSize={y % 2 === 0 || span < 16 ? 10.5 : 0} fill={on ? 'var(--text)' : 'var(--muted)'} style={{ fontFamily: 'var(--mono)' }}>{y}</text>
            </g>
          );
        })}
        <g style={{ fontFamily: 'var(--mono)' }} fontSize={10.5} fill="var(--muted)">
          <rect x={L} y={H - 22} width={10} height={10} rx={2} fill={COL.pub} /><text x={L + 16} y={H - 13}>{t('tl.pubs')}</text>
          <rect x={L + 120} y={H - 22} width={10} height={10} rx={2} fill={COL.talk} /><text x={L + 136} y={H - 13}>{t('tl.talks')}</text>
          <circle cx={L + 245} cy={H - 17} r={5} fill={kindColor.book} /><text x={L + 256} y={H - 13}>{t('tl.books')}</text>
          <circle cx={L + 330} cy={H - 17} r={5} fill={kindColor.software} /><text x={L + 341} y={H - 13}>{t('tl.software')}</text>
          <circle cx={L + 430} cy={H - 17} r={5} fill={kindColor.career} /><text x={L + 441} y={H - 13}>{t('tl.career')}</text>
        </g>
      </svg>
      {yearItems && (
        <div className="info-card mt-2" aria-live="polite">
          <div className="flex items-baseline justify-between gap-3">
            <h5 style={{ margin: 0 }}>{sel} · {fmt(yearItems.pubs.length)} {t('tl.pubs')} · {fmt(yearItems.talks.length)} {t('tl.talks')}</h5>
            <button type="button" className="chip" onClick={() => setSel(null)}>{t('tl.close')}</button>
          </div>
          {yearItems.miles.length > 0 && (
            <ul className="mt-2 grid gap-1" style={{ listStyle: 'none', padding: 0 }}>
              {yearItems.miles.map((mi, i) => (
                <li key={i} className="text-[13px] flex gap-2 items-start"><i className="dot mt-1.5" style={{ background: kindColor[mi.kind], flex: '0 0 auto' }} />
                  <span>{mi.link ? <a href={mi.link} target="_blank" rel="noopener noreferrer">{mi.label}</a> : mi.label}</span></li>
              ))}
            </ul>
          )}
          <ul className="mt-2 grid gap-1" style={{ listStyle: 'none', padding: 0 }}>
            {yearItems.pubs.slice(0, 6).map(p => <li key={p.number} className="text-[13px] font-serif soft">{p.title.replace(/\\'/g, "'")}</li>)}
            {yearItems.pubs.length > 6 && <li className="text-[12px] muted">+{yearItems.pubs.length - 6} {t('tl.more')}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
