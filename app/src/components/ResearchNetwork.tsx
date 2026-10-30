import { useEffect, useMemo, useState } from 'react';
import { useT } from '../i18n';
import { ExternalLink, FileDown } from 'lucide-react';
import { researchAreas } from '../data/researchAreas';
import { bfsDistances, classicalMDS, fit2D, hashStr } from '../lib/le-math';
import { resolveTitle } from '../lib/pubs';

const METH: Record<string, { label: string; color: string }> = {
  formal: { label: 'net.formal', color: '#f5b942' },
  bridge: { label: 'net.bridge', color: '#a78bfa' },
  computational: { label: 'net.computational', color: '#38d9f5' },
};
const short = (l: string) => l.replace(/ [&κ][αι]? .*$/, '').replace(/ & .*$/, '').replace(/,.*$/, '').replace(/ (for|για) .*$/, '');
const clean = (t: string) => t.replace(/\\'/g, "'");

/** Research areas as a network. Positions: classical MDS (LingEmbed Jacobi solver) of hop distances along the
 *  area-to-area connections; software nodes sit at the centroid of the areas that list them. Each listed
 *  publication is resolved by title against the site's publication list. */
export default function ResearchNetwork() {
  const { t } = useT();
  const [sel, setSel] = useState<string>(() => (window as unknown as { __pendingArea?: string }).__pendingArea ?? 'type-theory');
  useEffect(() => {
    const on = (e: Event) => { const id = (e as CustomEvent).detail; if (researchAreas.some(a => a.id === id)) setSel(id); };
    window.addEventListener('selectResearchArea', on);
    return () => window.removeEventListener('selectResearchArea', on);
  }, []);
  const L = (id: string) => t(`area.${id}.label`);
  const m = useMemo(() => {
    const idx: Record<string, number> = Object.fromEntries(researchAreas.map((a, i) => [a.id, i]));
    const adj: number[][] = researchAreas.map(() => []);
    const edges: [number, number][] = [];
    researchAreas.forEach((a, i) => a.connections.forEach(c => {
      const j = idx[c]; if (j == null) return;
      if (!adj[i].includes(j)) { adj[i].push(j); adj[j].push(i); edges.push([Math.min(i, j), Math.max(i, j)]); }
    }));
    const E = classicalMDS(bfsDistances(adj));
    const P = fit2D(E.X, { x: 170, y: 80, w: 560, h: 300 });
    const cx = P.reduce((s, p) => s + p[0], 0) / P.length, cy = P.reduce((s, p) => s + p[1], 0) / P.length;
    const resolved = researchAreas.map(a => a.publications.map(p => ({ ref: p, pub: resolveTitle(p.title) })));
    const sw: Record<string, number[]> = {};
    researchAreas.forEach((a, i) => (a.software ?? []).forEach(s => { (sw[s] ||= []).push(i); }));
    const soft = Object.entries(sw).map(([name, areas]) => {
      const mx = areas.reduce((s, k) => s + P[k][0], 0) / areas.length, my = areas.reduce((s, k) => s + P[k][1], 0) / areas.length;
      let dx = mx - cx, dy = my - cy; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      const jit = ((hashStr(name) % 1000) / 1000 - 0.5) * 1.6;
      const ox = dx * Math.cos(jit) - dy * Math.sin(jit), oy = dx * Math.sin(jit) + dy * Math.cos(jit);
      const off = areas.length > 1 ? 34 : 52;
      return { name, areas, x: mx + ox * off, y: my + oy * off };
    });
    return { idx, P, edges, resolved, soft, E };
  }, []);

  const i = m.idx[sel];
  const area = researchAreas[i];
  const neigh = new Set(area.connections);
  const res = m.resolved[i];

  return (
    <div className="grid lg:grid-cols-[1.45fr_1fr] gap-4">
      <div className="panel p-2">
        <svg className="viz" viewBox="0 0 900 440" role="group" aria-label={t('net.aria')}>
          <text x={16} y={24} className="mono-t" fontSize={11} letterSpacing="1.5" fill="#a78bfa">{t('net.title')}</text>
          <text x={16} y={40} fontSize={11} fill="#9aa5c4">{t('net.sub', { a: researchAreas.length, c: m.edges.length, s: m.soft.length })}</text>
          {m.soft.map(s => s.areas.map(ai => (
            <line key={s.name + ai} x1={s.x} y1={s.y} x2={m.P[ai][0]} y2={m.P[ai][1]} stroke="#38d9f5" strokeOpacity={s.areas.includes(i) ? 0.45 : 0.08} strokeDasharray="2 4" />
          )))}
          {m.edges.map(([a, b]) => {
            const on = a === i || b === i;
            return <line key={`${a}-${b}`} x1={m.P[a][0]} y1={m.P[a][1]} x2={m.P[b][0]} y2={m.P[b][1]} stroke={on ? '#e7ecf7' : '#4b5a82'} strokeOpacity={on ? 0.75 : 0.45} strokeWidth={on ? 1.8 : 1.1} />;
          })}
          {m.soft.map(s => (
            <g key={s.name} opacity={s.areas.includes(i) ? 1 : 0.4}>
              <rect x={s.x - 4} y={s.y - 4} width={8} height={8} rx={2} transform={`rotate(45 ${s.x} ${s.y})`} fill="#38d9f5" />
              <text x={s.x} y={s.y + 16} textAnchor="middle" className="mono-t" fontSize={9.5} fill="#8fdcef">{s.name}</text>
            </g>
          ))}
          {researchAreas.map((a, k) => {
            const [x, y] = m.P[k]; const meta = METH[a.methodology];
            const r = 8 + 4.4 * Math.sqrt(a.publications.length);
            const on = k === i, near = neigh.has(a.id);
            return (
              <g key={a.id} className="seg-btn" role="button" tabIndex={0} aria-pressed={on} aria-label={t('net.nodeAria', { label: L(a.id), n: a.publications.length })}
                onClick={() => setSel(a.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(a.id); } }}
                opacity={on || near ? 1 : 0.55}>
                <circle cx={x} cy={y} r={r + 9} fill={on ? `${meta.color}22` : 'transparent'} />
                <circle cx={x} cy={y} r={r} fill={`${meta.color}33`} stroke={on ? '#fff' : meta.color} strokeWidth={on ? 2.4 : 1.6} />
                <text x={x} y={y + 4} textAnchor="middle" className="mono-t" fontSize={11} fontWeight={600} fill="#e7ecf7">{a.publications.length}</text>
                <text x={x} y={y - r - 8} textAnchor="middle" fontSize={12} fontWeight={600} fill="#e7ecf7">{short(L(a.id))}</text>
              </g>
            );
          })}
        </svg>
        <div className="legend px-3 pb-2">
          {Object.values(METH).map(v => <span key={v.label}><i className="dot" style={{ background: v.color }} />{t(v.label)}</span>)}
          <span><i className="dot" style={{ background: '#38d9f5', borderRadius: 2 }} />{t('net.software')}</span>
        </div>
      </div>
      <div className="info-card" aria-live="polite" style={{ borderTop: `3px solid ${METH[area.methodology].color}` }}>
        <h5>{t(METH[area.methodology].label)}</h5>
        <h3 className="h3" style={{ fontSize: '1.2rem' }}>{L(area.id)}</h3>
        <p className="soft text-[14px] mt-1">{t(`area.${area.id}.desc`)}</p>
        <ul className="mt-3 grid gap-2" style={{ listStyle: 'none', padding: 0 }}>
          {res.map(({ ref, pub }) => (
            <li key={ref.title} className="text-[13px]" style={{ lineHeight: 1.4 }}>
              <span className="font-serif">{clean(pub?.title ?? ref.title)}</span>
              {pub ? (
                <span className="muted"> · {pub.year || 'n.d.'}
                  {pub.pdfLink && <a className="ml-2 inline-flex items-center gap-1" href={pub.pdfLink} target="_blank" rel="noopener noreferrer" aria-label={`PDF of ${clean(pub.title)}`}><FileDown size={12} aria-hidden="true" />pdf</a>}
                  {pub.link && <a className="ml-2 inline-flex items-center gap-1" href={pub.link} target="_blank" rel="noopener noreferrer" aria-label={`Link to ${clean(pub.title)}`}><ExternalLink size={12} aria-hidden="true" />link</a>}
                </span>
              ) : <span className="tag neg ml-2" style={{ fontSize: '.6rem' }}>{t('net.notInList')}</span>}
            </li>
          ))}
        </ul>
        {area.software && area.software.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">{area.software.map(s => <span key={s} className="tag neu">{s}</span>)}</div>
        )}
        <p className="eyebrow mt-4" style={{ marginBottom: 6 }}>{t('net.connected')}</p>
        <div className="flex flex-wrap gap-1.5">
          {area.connections.map(c => { const a = researchAreas.find(x => x.id === c); return a ? <button key={c} className="chip" onClick={() => setSel(c)}>{short(L(a.id))}</button> : null; })}
        </div>
      </div>
    </div>
  );
}
