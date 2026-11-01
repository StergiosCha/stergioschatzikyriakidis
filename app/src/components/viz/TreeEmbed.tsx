import { useEffect, useMemo, useState } from 'react';
import { useT } from '../../i18n';
import { THEORIES, ORDER } from '../../data/lingembedTheories';
import { buildTree, classicalMDS, fit2D } from '../../lib/le-math';
import { usePrefersReducedMotion } from '../../hooks/use-reduced-motion';

/** "One sentence, five theories, one geometry" from the LingEmbed site, as a React component.
 *  Left: the analysis of "every student reads a book". Right: nodes placed so that ‖hᵢ − hⱼ‖² = d_tree(i, j)
 *  (classical MDS with the LingEmbed Jacobi solver; exact in n−1 dimensions, top-2 shown). */
export default function TreeEmbed() {
  const { t } = useT();
  const [key, setKey] = useState<string>('ccg');
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const th = THEORIES[key];
  const m = useMemo(() => {
    const T = buildTree(th);
    const E = classicalMDS(T.dist);
    const tp = { x: 40, y: 78, w: 290, h: 250 };
    const tree = T.nodes.map(n => [tp.x + n.xi * tp.w, tp.y + n.yi * tp.h] as [number, number]);
    const emb = fit2D(E.X, { x: 420, y: 80, w: 260, h: 260 });
    return { T, E, tree, emb };
  }, [th]);

  useEffect(() => {
    if (paused || reduced) return;
    const t = window.setInterval(() => { if (!document.hidden) setActive(a => (a + 1) % m.T.nodes.length); }, 2200);
    return () => window.clearInterval(t);
  }, [paused, reduced, m]);

  const n = m.T.nodes[Math.min(active, m.T.nodes.length - 1)];
  const [px, py] = m.tree[n.idx], [ex, ey] = m.emb[n.idx];
  const others = m.T.nodes.filter(o => o.idx !== n.idx).map(o => `${o.label}:${m.T.dist[n.idx][o.idx]}`).join('  ');

  return (
    <div>
      <div className="tabs mb-3" role="tablist" aria-label={t('le.theoryAria')}>
        {ORDER.map(k => (
          <button key={k} role="tab" aria-selected={k === key} className="tab" style={{ padding: '6px 13px', fontSize: '.84rem' }}
            onClick={() => { setKey(k); setActive(0); }}>{THEORIES[k].short}</button>
        ))}
      </div>
      <div className="panel p-2" onMouseLeave={() => setPaused(false)}>
        <svg className="viz" viewBox="0 0 720 380" role="img" aria-label={t('le.svgAria', { t: th.title })}>
          <defs>
            <linearGradient id="gSE" x1="0" x2="1"><stop offset="0" stopColor="#f5b942" /><stop offset="1" stopColor="#a78bfa" /></linearGradient>
          </defs>
          <rect x={8} y={8} width={352} height={364} rx={14} fill="var(--hair2)" stroke="var(--hair)" />
          <rect x={370} y={8} width={342} height={364} rx={14} fill="var(--hair2)" stroke="var(--hair)" />
          <text x={24} y={32} className="mono-t" fontSize={11} letterSpacing="1.5" fill="var(--sym)">{t('le.symbolic')}</text>
          <text x={24} y={48} fontSize={11} fill="var(--muted)">{t('le.analysis', { t: th.short })}</text>
          <text x={386} y={32} className="mono-t" fontSize={11} letterSpacing="1.5" fill="var(--emb)">{t('le.embedding')}</text>
          <text x={386} y={48} fontSize={11} fill="var(--muted)">‖hᵢ − hⱼ‖² = d_tree(i, j)</text>
          {m.T.nodes.map(c => {
            if (!c.parent) return null;
            const p = m.T.byId[c.parent];
            const [x1, y1] = m.tree[p.idx], [x2, y2] = m.tree[c.idx];
            return th.layout === 'dependency'
              ? <path key={c.id} d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`} stroke="var(--line2)" strokeWidth={1.4} fill="none" />
              : <line key={c.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line2)" strokeWidth={1.4} />;
          })}
          {m.T.nodes.map(c => {
            if (!c.parent) return null;
            const p = m.T.byId[c.parent];
            const [x1, y1] = m.emb[p.idx], [x2, y2] = m.emb[c.idx];
            return <line key={'e' + c.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(167,139,250,.28)" className="lt-embedge" strokeWidth={1.2} />;
          })}
          <path className="flow" stroke="url(#gSE)" d={`M${px},${py} C${(px + ex) / 2 + 40},${py} ${(px + ex) / 2 - 40},${ey} ${ex},${ey}`} />
          {m.T.nodes.map(c => {
            const [x, y] = m.tree[c.idx];
            const below = !c.children.length || th.layout !== 'constituency';
            const on = c.idx === n.idx;
            return (
              <g key={'t' + c.id} transform={`translate(${x},${y})`} className="seg-btn" role="button" tabIndex={0} aria-pressed={on} aria-label={`${c.label} (${c.sub})`} onMouseEnter={() => { setPaused(true); setActive(c.idx); }} onFocus={() => { setPaused(true); setActive(c.idx); }} onBlur={() => setPaused(false)}>
                <circle r={8} fill={on ? 'var(--sym)' : c.word ? 'rgba(245,185,66,.18)' : 'var(--bg2)'} stroke={on ? '#fff' : 'var(--sym)'} strokeWidth={on ? 2.4 : 1.6} />
                <text y={below ? 24 : -14} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--text)">{c.label}</text>
                <text y={below ? 37 : -27} textAnchor="middle" className="mono-t" fontSize={9.5} fill="var(--sym)" opacity={0.9}>{c.sub}</text>
              </g>
            );
          })}
          {m.T.nodes.map(c => {
            const [x, y] = m.emb[c.idx]; const on = c.idx === n.idx;
            return (
              <g key={'p' + c.id} style={{ cursor: 'pointer' }} onMouseEnter={() => { setPaused(true); setActive(c.idx); }}>
                <circle cx={x} cy={y} r={c.word ? 7 : 5.5} fill={on ? '#fff' : c.word ? '#c4b5fd' : 'var(--emb)'} stroke={on ? 'var(--emb)' : '#0a0f20'} strokeWidth={on ? 3 : 1.5} />
                <text x={x + 10} y={y - 8} className="mono-t lt-emblabel" fontSize={10} fill="#cfc6f7">{c.label}</text>
              </g>
            );
          })}
          <text x={386} y={360} fontSize={11} fill="var(--muted)">{t('le.exact', { d: m.E.dims, p: (m.E.explained2 * 100).toFixed(0) })}</text>
        </svg>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        <div className="info-card" aria-live="polite">
          <h5>{t('le.selected')}</h5>
          <div className="font-serif text-[1.05rem]">{n.label} <span className="mono muted text-[12px]">{n.sub}</span></div>
          <code className="mono text-[12px]" style={{ color: 'var(--sym)', wordBreak: 'break-word' }}>{n.detail}</code>
          <div className="kv mt-2"><span>{t('le.role')}</span><span>{n.role}</span></div>
          <div className="kv"><span>{t('le.dtree')}</span><span className="text-[11px]">{others}</span></div>
        </div>
        <div className="info-card">
          <h5>{t('le.geom')}</h5>
          <div className="kv"><span>{t('le.nodes')}</span><span>{m.T.nodes.length}</span></div>
          <div className="kv"><span>{t('le.dims')}</span><span>{m.E.dims}</span></div>
          <div className="kv"><span>{t('le.err')}</span><span>{m.E.maxErr.toExponential(1)}</span></div>
          <div className="kv"><span>{t('le.var')}</span><span>{(m.E.explained2 * 100).toFixed(1)}%</span></div>
        </div>
      </div>
    </div>
  );
}
