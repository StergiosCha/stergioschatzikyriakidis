import { useMemo, useState } from 'react';
import { useT } from '../../i18n';
import { formalAtlas } from '../../data/formalAtlas';
import { bfsDistances, classicalMDS, fit2D, fmtInt } from '../../lib/le-math';

const LEVEL_COLOR: Record<string, string> = { 'intra-family': '#a78bfa', 'cross-family': '#f5b942', 'cross-foundation': '#38d9f5' };
const GRADE_COLOR = (g: number | null) => g == null ? 'var(--muted)' : g >= 5 ? '#6ee7b7' : g === 4 ? '#38d9f5' : g === 3 ? '#a78bfa' : g === 2 ? '#f5b942' : '#ff6b9a';

/** Graph of the checked framework comparisons in the Formal Atlas of Semantics.
 *  Positions: classical MDS (Jacobi eigensolver) of hop distances in the comparison graph, so the layout
 *  encodes only which comparisons exist, never a similarity score (the atlas explicitly rejects one). */
export default function AtlasGraph() {
  const { t } = useT();
  const F_LABEL = [0, 1, 2, 3, 4, 5].map(i => t(`at.F${i}`));
  const P_LABEL = [0, 1, 2, 3, 4, 5].map(i => t(`at.P${i}`));
  const { nodes, edges, stats, papers } = formalAtlas;
  const [selEdge, setSelEdge] = useState(6); // PTQ ↔ MTT by default
  const [hover, setHover] = useState<string | null>(null);

  const g = useMemo(() => {
    const idx: Record<string, number> = Object.fromEntries(nodes.map((n, i) => [n.id, i]));
    const adj: number[][] = nodes.map(() => []);
    edges.forEach(e => { adj[idx[e.a]].push(idx[e.b]); adj[idx[e.b]].push(idx[e.a]); });
    const dist = bfsDistances(adj);
    const E = classicalMDS(dist);
    const P = fit2D(E.X, { x: 90, y: 50, w: 520, h: 300 });
    // P × F cross-tabulation of the surveyed sources
    const grid = Array.from({ length: 6 }, () => Array(6).fill(0));
    let nPF = 0;
    papers.forEach(([p, f]) => { if (p != null && f != null) { grid[p][f]++; nPF++; } });
    const maxCell = Math.max(...grid.flat());
    return { idx, P, E, grid, nPF, maxCell, diameter: Math.max(...dist.flat()) };
  }, [nodes, edges, papers]);

  const e = edges[selEdge];
  const lab = (id: string) => nodes.find(n => n.id === id)!.label;
  const maxThm = Math.max(...nodes.map(n => n.theorems ?? 0));

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[[String(formalAtlas.generatedFrom.papers), t('at.sources')], [String(stats.records), t('at.records')], [fmtInt(stats.theorems), t('at.theorems')], [`${((stats.proved / stats.theorems) * 100).toFixed(1)}%`, t('at.proved', { n: stats.admitted })]].map(([v, l]) => (
          <div key={l} className="info-card"><div className="big-num grad-all" style={{ fontSize: 'clamp(1.05rem,1.8vw,1.45rem)' }}>{v}</div><div className="num-label">{l}</div></div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-4">
        <div className="panel p-2">
          <svg className="viz" viewBox="0 0 700 400" role="img" aria-label={`${t('at.graphAria', { n: nodes.length, e: edges.length })}. ${t('at.graphSub')}`}>
            <text x={16} y={24} className="mono-t" fontSize={11} letterSpacing="1.5" fill="#f5b942">{t('at.graphTitle')}</text>
            {edges.map((ed, i) => {
              const [x1, y1] = g.P[g.idx[ed.a]], [x2, y2] = g.P[g.idx[ed.b]];
              const on = i === selEdge || hover === ed.a || hover === ed.b;
              const nG = ed.phenomena.filter(p => p.grade != null).length;
              return (
                <g key={i} className="seg-btn" role="button" tabIndex={0} aria-pressed={i === selEdge}
                  aria-label={t('at.edgeAria', { a: lab(ed.a), b: lab(ed.b), level: t(`at.level.${ed.level}`), n: nG })}
                  onClick={() => setSelEdge(i)} onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setSelEdge(i); } }}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={16} />
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LEVEL_COLOR[ed.level] ?? '#8c98b8'} strokeOpacity={on ? 0.95 : 0.35} strokeWidth={1 + nG * 0.6} />
                  {i === selEdge && <line x1={x1} y1={y1} x2={x2} y2={y2} className="flow" stroke="#fff" strokeOpacity={0.6} />}
                </g>
              );
            })}
            {nodes.map((n, i) => {
              const [x, y] = g.P[i];
              const r = n.theorems ? 7 + 13 * Math.sqrt(n.theorems / maxThm) : 7;
              const act = hover === n.id || e.a === n.id || e.b === n.id;
              return (
                <g key={n.id} transform={`translate(${x},${y})`} className="seg-btn" tabIndex={0} role="img" aria-label={`${n.label}: ${n.theorems != null ? `${n.theorems} ${t('at.theorems')}` : t('at.outsideAria')}`} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}>
                  <circle r={r + 6} fill={act ? 'rgba(167,139,250,.16)' : 'transparent'} />
                  <circle r={r} fill={n.theorems ? 'rgba(245,185,66,.22)' : '#0d1428'} stroke={act ? '#fff' : '#f5b942'} strokeWidth={act ? 2.2 : 1.5} strokeDasharray={n.theorems ? undefined : '3 3'} />
                  <text y={-r - 8} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="#e7ecf7">{n.label}</text>
                  <text y={r + 15} textAnchor="middle" className="mono-t" fontSize={10} fill="#8c98b8">{n.theorems != null ? t('at.thm', { n: n.theorems }) : t('at.outside')}</text>
                </g>
              );
            })}
          </svg>
          <div className="legend px-3 pb-2">
            {Object.entries(LEVEL_COLOR).map(([k, c]) => <span key={k}><i className="dot" style={{ background: c }} />{t(`at.level.${k}`)}</span>)}
          </div>
        </div>

        <div className="info-card" aria-live="polite">
          <h5>{t('at.selected', { level: t(`at.level.${e.level}`) })}</h5>
          <div className="h3" style={{ fontSize: '1.15rem' }}>{lab(e.a)} <span className="muted">↔</span> {lab(e.b)}</div>
          {e.bridge && <p className="mono text-[11.5px] muted mt-1 break-all">{t('at.bridge')} {e.bridge}</p>}
          <div className="mt-3 grid gap-1">
            {e.phenomena.map(p => (
              <div key={p.name} className="flex items-center justify-between gap-2 mono text-[12px]" style={{ borderBottom: '1px dashed rgba(255,255,255,.06)', padding: '3px 0' }}>
                <span className="soft truncate" title={p.name}>{p.name}</span>
                <span className="shrink-0 px-2 rounded-full" style={{ color: GRADE_COLOR(p.grade), border: `1px solid ${GRADE_COLOR(p.grade)}55` }}>{p.grade ?? '—'}</span>
              </div>
            ))}
          </div>
          <p className="muted text-[11.5px] mt-3" style={{ lineHeight: 1.5 }}>{t('at.grades')}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="info-card">
          <h5>{t('at.pf')}</h5>
          <div className="overflow-x-auto">
            <table className="mono text-[11px] w-full mt-2" style={{ borderCollapse: 'separate', borderSpacing: 3 }}>
              <caption className="sr-only">{t('at.pfCaption', { n: g.nPF })}</caption>
              <thead><tr><th className="muted font-normal text-left">P \ F</th>{F_LABEL.map((_, f) => <th key={f} scope="col" className="muted font-normal" title={F_LABEL[f]}>F{f}</th>)}</tr></thead>
              <tbody>
                {g.grid.map((row, p) => (
                  <tr key={p}>
                    <th scope="row" className="muted font-normal text-left whitespace-nowrap" title={P_LABEL[p]}>P{p}</th>
                    {row.map((v, f) => (
                      <td key={f} title={`P${p} ${P_LABEL[p]} × F${f} ${F_LABEL[f]}: ${v}`} className="text-center rounded"
                        style={{ background: v ? `rgba(167,139,250,${0.12 + 0.58 * (v / g.maxCell)})` : 'rgba(255,255,255,.03)', color: '#ffffff', padding: '5px 0', minWidth: 30 }}>{v || ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="legend mt-2" style={{ fontSize: '.7rem' }}>{F_LABEL.map((l, i) => <span key={i}>F{i} {l}</span>)}</div>
          <div className="legend mt-1" style={{ fontSize: '.7rem' }}>{P_LABEL.map((l, i) => <span key={i}>P{i} {l}</span>)}</div>
        </div>
      </div>
    </div>
  );
}
