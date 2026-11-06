import { useMemo, useState } from 'react';
import { useT } from '../../i18n';
import { formalAtlas } from '../../data/formalAtlas';
import { PHENOMENON_LABEL } from '../../data/atlasLabels';
import { fmtInt } from '../../lib/le-math';

const LEVEL_COLOR: Record<string, string> = { 'intra-family': 'var(--emb)', 'cross-family': 'var(--sym)', 'cross-foundation': 'var(--neu)' };

/** Editorial layout, following the Atlas's own presentation rule: positions are editorial, lines have uniform
 *  width, a solid line means a comparison (bridge) file is listed and a dashed line means none is listed yet. */
const FAMILIES: { key: string; x: number; y: number; w: number; h: number }[] = [
  { key: 'montague', x: 14, y: 50, w: 240, h: 416 },
  { key: 'typelogical', x: 270, y: 50, w: 476, h: 138 },
  { key: 'mtt', x: 270, y: 204, w: 306, h: 262 },
  { key: 'ttr', x: 592, y: 204, w: 154, h: 262 },
];
/** Node position and label side, chosen so that no edge crosses a label. */
const POS: Record<string, [number, number, 'above' | 'below' | 'left']> = {
  extras__BarwiseCooper: [104, 166, 'above'],
  atlas__ptq: [190, 312, 'left'],
  shallow__kratzer2: [104, 396, 'below'],
  atlas__lambek: [340, 132, 'above'],
  atlas__discocat: [610, 132, 'above'],
  atlas__mtt: [424, 312, 'above'],
  atlas__ranta: [338, 394, 'below'],
  atlas__dts: [508, 394, 'below'],
  atlas__ttr: [669, 312, 'above'],
};

/** Split a long label over two lines at the space nearest its middle. */
const wrap = (s: string): string[] => {
  if (s.length <= 15) return [s];
  const mid = s.length / 2;
  let best = -1;
  for (let i = 0; i < s.length; i++) if (s[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  return best < 0 ? [s] : [s.slice(0, best), s.slice(best + 1)];
};

export default function AtlasGraph() {
  const { t, lang } = useT();
  const F_LABEL = [0, 1, 2, 3, 4, 5].map(i => t(`at.F${i}`));
  const P_LABEL = [0, 1, 2, 3, 4, 5].map(i => t(`at.P${i}`));
  const { nodes, edges, stats, papers } = formalAtlas;
  const [selEdge, setSelEdge] = useState(6); // PTQ ↔ MTT by default
  const [hover, setHover] = useState<string | null>(null);
  const [selP, setSelP] = useState<string | null>(null);
  const pickEdge = (i: number) => { setSelEdge(i); setSelP(null); };

  const g = useMemo(() => {
    const grid = Array.from({ length: 6 }, () => Array(6).fill(0));
    let nPF = 0;
    papers.forEach(([p, f]) => { if (p != null && f != null) { grid[p][f]++; nPF++; } });
    return { grid, nPF, maxCell: Math.max(...grid.flat()) };
  }, [papers]);

  const e = edges[selEdge];
  const lab = (id: string) => nodes.find(n => n.id === id)!.label;
  const pname = (k: string) => PHENOMENON_LABEL[k]?.[lang === 'el' ? 'el' : 'en'] ?? k.replace(/-/g, ' ');
  const maxThm = Math.max(...nodes.map(n => n.theorems ?? 0));
  const rOf = (id: string) => { const th = nodes.find(n => n.id === id)!.theorems; return th ? 8 + 12 * Math.sqrt(th / maxThm) : 8; };
  const groups = [
    { key: 'both', title: t('at.both'), items: e.phenomena.filter(p => p.side === 'both'), color: 'var(--ok)' },
    { key: 'a', title: t('at.only', { x: lab(e.a) }), items: e.phenomena.filter(p => p.side === 'a'), color: 'var(--muted)' },
    { key: 'b', title: t('at.only', { x: lab(e.b) }), items: e.phenomena.filter(p => p.side === 'b'), color: 'var(--muted)' },
  ].filter(gr => gr.items.length);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[[String(formalAtlas.generatedFrom.papers), t('at.sources')], [String(stats.records), t('at.records')], [fmtInt(stats.theorems), t('at.theorems')], [`${((stats.proved / stats.theorems) * 100).toFixed(1)}%`, t('at.proved', { n: stats.admitted })]].map(([v, l]) => (
          <div key={l} className="info-card"><div className="big-num grad-all" style={{ fontSize: 'clamp(1.05rem,1.8vw,1.45rem)' }}>{v}</div><div className="num-label">{l}</div></div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-4">
        <div className="panel p-2">
          <svg className="viz" viewBox="0 0 760 480" role="img" aria-label={t('at.graphAria', { n: nodes.length, e: edges.length })}>
            <text x={16} y={30} className="mono-t" fontSize={11} letterSpacing="1.5" fill="var(--sym)">{t('at.graphTitle')}</text>
            {FAMILIES.map(f => (
              <g key={f.key}>
                <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={14} fill="var(--hair2)" stroke="var(--line)" strokeDasharray="2 4" />
                <text x={f.x + 12} y={f.y + 18} className="mono-t" fontSize={9.5} letterSpacing="1.2" fill="var(--muted)">{t(`at.fam.${f.key}`).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()}</text>
              </g>
            ))}
            {edges.map((ed, i) => {
              const [ax, ay] = POS[ed.a], [bx, by] = POS[ed.b];
              const len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len;
              const ra = rOf(ed.a) + 3, rb = rOf(ed.b) + 3;
              const x1 = ax + ux * ra, y1 = ay + uy * ra, x2 = bx - ux * rb, y2 = by - uy * rb;
              const sel = i === selEdge;
              const on = sel || hover === ed.a || hover === ed.b;
              const nB = ed.phenomena.filter(p => p.side === 'both').length;
              return (
                <g key={i} className="seg-btn" role="button" tabIndex={0} aria-pressed={sel}
                  aria-label={t('at.edgeAria', { a: lab(ed.a), b: lab(ed.b), level: t(`at.level.${ed.level}`), n: nB, m: ed.phenomena.length })}
                  onClick={() => pickEdge(i)} onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pickEdge(i); } }}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={18} />
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LEVEL_COLOR[ed.level] ?? 'var(--muted)'} strokeOpacity={on ? 1 : 0.55}
                    strokeWidth={sel ? 3.2 : 2} strokeDasharray={ed.bridge ? undefined : '6 5'} strokeLinecap="round" />
                  {sel && <line x1={x1} y1={y1} x2={x2} y2={y2} className="flow lt-flow" stroke="#fff" strokeOpacity={0.55} />}
                </g>
              );
            })}
            {nodes.map(n => {
              const [x, y] = POS[n.id];
              const r = rOf(n.id);
              const act = hover === n.id || e.a === n.id || e.b === n.id;
              const lines = wrap(n.label);
              return (
                <g key={n.id} transform={`translate(${x},${y})`} className="seg-btn" tabIndex={0} role="img"
                  aria-label={`${n.label}: ${n.theorems != null ? `${n.theorems} ${t('at.theorems')}` : t('at.outsideAria')}`}
                  onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}>
                  <circle r={r + 7} fill={act ? 'rgba(167,139,250,.16)' : 'transparent'} />
                  <circle r={r} fill="var(--panel)" />
                  <circle r={r} fill={n.theorems ? 'rgba(245,185,66,.22)' : 'var(--bg2)'} stroke={act ? 'var(--text)' : 'var(--sym)'} strokeWidth={act ? 2.2 : 1.5} strokeDasharray={n.theorems ? undefined : '3 3'} />
                  {(() => {
                    const side = POS[n.id][2];
                    const halo = { paintOrder: 'stroke', stroke: 'var(--bg)', strokeWidth: 4, strokeLinejoin: 'round' as const };
                    const cnt = n.theorems != null ? t('at.thm', { n: n.theorems }) : t('at.outside');
                    if (side === 'left') return (<>
                      <text x={-r - 10} y={-2} textAnchor="end" fontSize={12.5} fontWeight={600} fill="var(--text)" {...halo}>{n.label}</text>
                      <text x={-r - 10} y={13} textAnchor="end" className="mono-t" fontSize={10} fill="var(--muted)" {...halo}>{cnt}</text>
                    </>);
                    if (side === 'below') return (<>
                      {lines.map((ln, k) => <text key={k} y={r + 17 + k * 15} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="var(--text)" {...halo}>{ln}</text>)}
                      <text y={r + 17 + lines.length * 15} textAnchor="middle" className="mono-t" fontSize={10} fill="var(--muted)" {...halo}>{cnt}</text>
                    </>);
                    return (<>
                      {lines.map((ln, k) => <text key={k} y={-r - 24 - (lines.length - 1 - k) * 15} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="var(--text)" {...halo}>{ln}</text>)}
                      <text y={-r - 9} textAnchor="middle" className="mono-t" fontSize={10} fill="var(--muted)" {...halo}>{cnt}</text>
                    </>);
                  })()}
                </g>
              );
            })}
          </svg>
          <div className="legend px-3 pb-2">
            {Object.entries(LEVEL_COLOR).map(([k, c]) => <span key={k}><i className="dot" style={{ background: c }} />{t(`at.level.${k}`)}</span>)}
            <span><svg width="26" height="8" aria-hidden="true" style={{ display: 'inline-block', marginRight: 6 }}><line x1="1" y1="4" x2="25" y2="4" stroke="var(--muted)" strokeWidth="2" /></svg>{t('at.solid')}</span>
            <span><svg width="26" height="8" aria-hidden="true" style={{ display: 'inline-block', marginRight: 6 }}><line x1="1" y1="4" x2="25" y2="4" stroke="var(--muted)" strokeWidth="2" strokeDasharray="6 5" /></svg>{t('at.dashed')}</span>
          </div>
        </div>

        <div className="info-card" aria-live="polite">
          <h5>{t('at.selected', { level: t(`at.level.${e.level}`) })}</h5>
          <div className="h3" style={{ fontSize: '1.15rem' }}>{lab(e.a)} <span className="muted">↔</span> {lab(e.b)}</div>
          <p className="mono text-[11.5px] muted mt-1 break-all">{e.bridge ? <>{t('at.bridge')} {e.bridge}</> : t('at.nobridge')}</p>
          <p className="soft text-[13px] mt-3" style={{ lineHeight: 1.5 }}>{t('at.checklist', { n: e.phenomena.length })}</p>
          {groups.map(gr => (
            <div key={gr.key} className="mt-3">
              <div className="mono text-[11px] uppercase" style={{ letterSpacing: '.08em', color: gr.key === 'both' ? 'var(--ok)' : 'var(--muted)' }}>{gr.title} · {gr.items.length}</div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {gr.items.map(p => (
                  <button key={p.name} type="button" aria-pressed={selP === p.name} onClick={() => setSelP(selP === p.name ? null : p.name)}
                    className="text-[12.5px] px-2.5 py-0.5 rounded-full"
                    style={{ border: `1px solid ${gr.key === 'both' ? 'var(--ok)' : 'var(--line2)'}`, color: selP === p.name ? 'var(--text)' : 'var(--soft)', background: selP === p.name ? 'var(--hair)' : 'transparent', cursor: 'pointer' }}>{pname(p.name)}</button>
                ))}
              </div>
              {gr.items.some(p => p.name === selP) && (
                <p className="mono text-[11.5px] muted mt-2" lang="en" style={{ lineHeight: 1.55, borderLeft: '2px solid var(--line2)', paddingLeft: 10 }}>{gr.items.find(p => p.name === selP)!.ev}</p>
              )}
            </div>
          ))}
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
                      <td key={f} title={`P${p} ${P_LABEL[p]} × F${f} ${F_LABEL[f]}: ${v}`} className="text-center rounded lt-pxf"
                        style={{ background: v ? `rgba(167,139,250,${0.12 + 0.58 * (v / g.maxCell)})` : 'var(--hair2)', color: '#ffffff', padding: '5px 0', minWidth: 30 }}>{v || ''}</td>
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
