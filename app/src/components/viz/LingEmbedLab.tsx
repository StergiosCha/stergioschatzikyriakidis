import { useEffect, useMemo, useState } from 'react';
import { useT } from '../../i18n';
import { THEORIES, ORDER } from '../../data/lingembedTheories';
import { buildTree, classicalMDS, cosine, divColor, dot, forward, gramSchmidt, hashStr, LAYERS, makeEncoder, randVec, unit } from '../../lib/le-math';
import { usePrefersReducedMotion } from '../../hooks/use-reduced-motion';

/* Full LingEmbed pipeline + tensor-product binding, ported from the LingEmbed site (assets/app.js).
 * Geometry identical to the original: three 370×380 panels in a 1200×480 viewBox. */
const P = { tree: { x: 20, y: 70, w: 370, h: 380 }, emb: { x: 415, y: 70, w: 370, h: 380 }, neu: { x: 810, y: 70, w: 370, h: 380 } };
const D = 6;

export default function LingEmbedLab({ initial = 'ccg' }: { initial?: string }) {
  const { t } = useT();
  const [key, setKey] = useState(initial);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ortho, setOrtho] = useState(true);
  const [query, setQuery] = useState(0);
  const reduced = usePrefersReducedMotion();
  const th = THEORIES[key];

  const m = useMemo(() => {
    const T = buildTree(th);
    const E = classicalMDS(T.dist);
    const W = makeEncoder(hashStr('enc:' + key));
    const acts = E.X.map(x => forward(W, x));
    const tp = { x: P.tree.x + 40, y: P.tree.y + 30, w: P.tree.w - 80, h: P.tree.h - 80 };
    const tree = T.nodes.map(n => [tp.x + n.xi * tp.w, tp.y + n.yi * tp.h] as [number, number]);
    const ep = { x: P.emb.x + 40, y: P.emb.y + 20, w: P.emb.w - 80, h: P.emb.h - 60 };
    const xs = E.X.map(v => v[0] || 0), ys = E.X.map(v => v[1] || 0);
    const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) || 1;
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
    const s = Math.min(ep.w, ep.h) / span;
    const emb = T.nodes.map((_, i) => [ep.x + ep.w / 2 + (xs[i] - cx) * s, ep.y + ep.h / 2 + (ys[i] - cy) * s] as [number, number]);
    const np = { x: P.neu.x + 36, y: P.neu.y + 20, w: P.neu.w - 72, h: P.neu.h - 70 };
    const cols = LAYERS.map((_, l) => np.x + (l / (LAYERS.length - 1)) * np.w);
    const npos = LAYERS.map((mm, l) => Array.from({ length: mm }, (_, j) => [cols[l], np.y + ((j + 0.5) / mm) * np.h] as [number, number]));
    return { T, E, W, acts, tree, emb, ep, np, cols, npos };
  }, [th, key]);

  useEffect(() => {
    if (paused || reduced) return;
    const t = window.setInterval(() => { if (!document.hidden) setActive(a => (a + 1) % m.T.nodes.length); }, 2200);
    return () => window.clearInterval(t);
  }, [paused, reduced, m]);

  const i = Math.min(active, m.T.nodes.length - 1);
  const n = m.T.nodes[i];
  const a = m.acts[i];
  const [px, py] = m.tree[i], [ex, ey] = m.emb[i];
  const [ix, iy] = [m.npos[0][0][0], m.npos[0][Math.floor(m.npos[0].length / 2)][1]];
  const pick = (k: number) => { setPaused(true); setActive(k); };

  // tensor-product binding (same seeds and formulas as the original)
  const b = useMemo(() => {
    const items = m.T.nodes.filter(x => x.word);
    const fillers = items.map(x => unit(randVec(hashStr('filler:' + x.label), D)));
    let roles = items.map(x => unit(randVec(hashStr('role:' + x.role), D)));
    if (ortho) roles = gramSchmidt(roles);
    const Tm = Array.from({ length: D }, (_, r) => Array.from({ length: D }, (_, c) => items.reduce((s, _x, k) => s + fillers[k][r] * roles[k][c], 0)));
    return { items, fillers, roles, Tm, mx: Math.max(...Tm.flat().map(Math.abs)) || 1 };
  }, [m, ortho]);
  const k = Math.min(query, b.items.length - 1);
  const u = b.Tm.map(row => dot(row, b.roles[k]));
  const sims = b.fillers.map(f => cosine(u, f));
  const best = sims.indexOf(Math.max(...sims));
  const vrow = (v: number[], label: string) => (
    <div className="flex gap-[3px] my-1.5" role="img" aria-label={`${label}: ${v.map(x => x.toFixed(2)).join(', ')}`}>
      {v.map((x, j) => <div key={j} className="flex-1 h-[22px] rounded" style={{ background: divColor(x / 0.9) }} title={x.toFixed(3)} />)}
    </div>
  );
  const others = m.T.nodes.filter(o => o.idx !== n.idx).map(o => `${o.label}:${m.T.dist[n.idx][o.idx]}`).slice(0, 8).join('  ');

  return (
    <div>
      <p className="eyebrow">LingEmbed · <b>{t('le.pipelineEyebrow')}</b></p>
      <div className="tabs mb-3" role="tablist" aria-label={t('le.theoryAria')}>
        {ORDER.map(tk => (
          <button key={tk} role="tab" aria-selected={tk === key} className="tab" onClick={() => { setKey(tk); setActive(0); setQuery(0); }}>{THEORIES[tk].short}</button>
        ))}
      </div>
      <div className="panel p-2 overflow-x-auto" onMouseLeave={() => setPaused(false)}>
        <svg className="viz" style={{ minWidth: 760 }} viewBox="0 0 1200 480" role="group" aria-label={`${t('le.labAria', { t: th.title })} ${t('le.encoder')}`}>
          <defs>
            <linearGradient id="labSE" x1="0" x2="1"><stop offset="0" stopColor="#f5b942" /><stop offset="1" stopColor="#a78bfa" /></linearGradient>
            <linearGradient id="labEN" x1="0" x2="1"><stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#38d9f5" /></linearGradient>
          </defs>
          {([[P.tree, t('le.symbolic'), 'var(--sym)', t('le.analysis', { t: th.short }), ''], [P.emb, t('le.embedding'), 'var(--emb)', '‖hᵢ − hⱼ‖² = d_tree(i, j)', ''], [P.neu, t('le.neural'), 'var(--neu)', 'tanh · 8 → 8 → 8 → 4', t('le.encoder')]] as const).map(([p, ttl, c, s, tip]) => (
            <g key={ttl}>{tip && <title>{tip}</title>}
              <rect x={p.x} y={p.y - 50} width={p.w} height={p.h + 60} rx={14} fill="var(--hair2)" stroke="var(--hair)" />
              <text x={p.x + 16} y={p.y - 26} className="mono-t" fontSize={13} fontWeight={600} letterSpacing="1.5" fill={c}>{ttl}</text>
              <text x={p.x + 16} y={p.y - 10} fontSize={11.5} fill="var(--muted)">{s}</text>
            </g>
          ))}
          {/* links */}
          <path className="flow" stroke="url(#labSE)" d={`M${px},${py} C${(px + ex) / 2 + 40},${py} ${(px + ex) / 2 - 40},${ey} ${ex},${ey}`} />
          <path className="flow" stroke="url(#labEN)" d={`M${ex},${ey} C${(ex + ix) / 2 + 40},${ey} ${(ex + ix) / 2 - 40},${iy} ${ix - 12},${iy}`} />
          {/* tree */}
          {m.T.nodes.map(c => {
            if (!c.parent) return null;
            const p = m.T.byId[c.parent]; const [x1, y1] = m.tree[p.idx], [x2, y2] = m.tree[c.idx];
            return (
              <g key={'te' + c.id}>
                {th.layout === 'dependency'
                  ? <path d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`} stroke="var(--line2)" strokeWidth={1.4} fill="none" />
                  : <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line2)" strokeWidth={1.4} />}
                {c.rel && c.rel !== 'root' && <text x={(x1 + x2) / 2 + (x2 < x1 ? -14 : 14)} y={(y1 + y2) / 2 - 2} textAnchor="middle" className="mono-t" fontSize={10} fill="var(--muted)">{c.rel}</text>}
              </g>
            );
          })}
          {m.T.nodes.map(c => {
            const [x, y] = m.tree[c.idx]; const below = !c.children.length || th.layout !== 'constituency'; const on = c.idx === i;
            return (
              <g key={'tn' + c.id} transform={`translate(${x},${y})`} className="seg-btn" role="button" tabIndex={0} aria-pressed={on} aria-label={`${c.label} (${c.sub})`}
                onMouseEnter={() => pick(c.idx)} onFocus={() => pick(c.idx)} onBlur={() => setPaused(false)}>
                <circle r={8} fill={on ? 'var(--sym)' : c.word ? 'rgba(245,185,66,.18)' : 'var(--bg2)'} stroke={on ? '#fff' : 'var(--sym)'} strokeWidth={on ? 2.4 : 1.6} />
                <text y={below ? 24 : -14} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="var(--text)">{c.label}</text>
                <text y={below ? 38 : -28} textAnchor="middle" className="mono-t" fontSize={10.5} fill="var(--sym)">{c.sub}</text>
              </g>
            );
          })}
          {/* embedding */}
          <circle cx={m.ep.x + m.ep.w / 2} cy={m.ep.y + m.ep.h / 2} r={Math.min(m.ep.w, m.ep.h) / 2 + 10} fill="none" stroke="var(--emb)" strokeOpacity={0.35} strokeDasharray="3 4" />
          {m.T.nodes.map(c => { if (!c.parent) return null; const p = m.T.byId[c.parent]; return <line key={'ee' + c.id} x1={m.emb[p.idx][0]} y1={m.emb[p.idx][1]} x2={m.emb[c.idx][0]} y2={m.emb[c.idx][1]} stroke="rgba(167,139,250,.28)" className="lt-embedge" strokeWidth={1.2} />; })}
          {m.T.nodes.map(c => {
            const [x, y] = m.emb[c.idx]; const on = c.idx === i;
            return (
              <g key={'en' + c.id} onMouseEnter={() => pick(c.idx)}>
                <circle cx={x} cy={y} r={c.word ? 7 : 5.5} fill={on ? '#fff' : c.word ? '#c4b5fd' : 'var(--emb)'} stroke={on ? 'var(--emb)' : '#0a0f20'} strokeWidth={on ? 3 : 1.5} />
                <text x={x + 10} y={y - 8} className="mono-t lt-emblabel" fontSize={10.5} fill="#cfc6f7">{c.label}</text>
              </g>
            );
          })}
          <text x={P.emb.x + 16} y={P.emb.y + P.emb.h} fontSize={11.5} fill="var(--muted)">{t('le.exact', { d: m.E.dims, p: (m.E.explained2 * 100).toFixed(0) })}</text>
          {/* neural */}
          {m.W.map((M, l) => M.map((row, j) => row.map((w, src) => {
            const [x1, y1] = m.npos[l][src], [x2, y2] = m.npos[l + 1][j];
            const flow = Math.abs(w * (l === 0 ? a[0][src] : a[l][src]));
            return <line key={`${l}-${j}-${src}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--neu)" strokeWidth={1} strokeOpacity={Math.min(0.85, 0.04 + flow * 0.9)} style={{ transition: 'stroke-opacity .35s' }} />;
          })))}
          {m.npos.map((layer, l) => layer.map(([x, y], j) => (
            <circle key={`n${l}-${j}`} cx={x} cy={y} r={9} stroke="var(--line2)" fill={divColor(l === 0 ? a[0][j] / 1.2 : a[l][j])} style={{ transition: 'fill .35s' }}><title>{`${['input', 'layer 1', 'layer 2', 'out'][l]} unit ${j}: ${a[l][j].toFixed(3)}`}</title></circle>
          )))}
          {['h ∈ ℝ⁸', 'layer 1', 'layer 2', 'out'].map((lbl, l) => <text key={lbl} x={m.cols[l]} y={m.np.y + m.np.h + 26} textAnchor="middle" className="mono-t" fontSize={10} fill="var(--muted)">{lbl}</text>)}
        </svg>
      </div>
      <div className="grid md:grid-cols-3 gap-3 mt-3">
        <div className="info-card"><h5>{t('le.theory')}</h5><div className="font-serif text-[1.1rem]">{th.title}</div><p className="soft text-[13.5px] mt-1" style={{ margin: 0 }}>{th.blurb}</p></div>
        <div className="info-card" aria-live="polite">
          <h5>{t('le.selected')}</h5>
          <div className="font-serif text-[1.05rem]">{n.label} <span className="mono muted text-[12px]">{n.sub}</span></div>
          <code className="mono text-[12px]" style={{ color: 'var(--sym)', wordBreak: 'break-word' }}>{n.detail}</code>
          <div className="kv mt-2"><span>{t('le.role')}</span><span>{n.role}</span></div>
          <div className="kv"><span>{t('le.dtree')}</span><span className="text-[11px]">{others}</span></div>
          <div className="kv"><span>{t('le.output')}</span><span>[{a[a.length - 1].map(v => v.toFixed(2)).join(', ')}]</span></div>
        </div>
        <div className="info-card">
          <h5>{t('le.geom')}</h5>
          <div className="kv"><span>{t('le.nodes')}</span><span>{m.T.nodes.length}</span></div>
          <div className="kv"><span>{t('le.dims')}</span><span>{m.E.dims}</span></div>
          <div className="kv"><span>{t('le.err')}</span><span>{m.E.maxErr.toExponential(1)}</span></div>
          <div className="kv"><span>{t('le.var')}</span><span>{(m.E.explained2 * 100).toFixed(1)}%</span></div>
        </div>
      </div>

      <div className="mt-10">
        <p className="eyebrow">LingEmbed · <b>{t('le.bindEyebrow')}</b></p>
        <p className="soft text-[14.5px] mb-4" style={{ maxWidth: '78ch' }}>
          {t('le.bind.p1')} <span className="mono">T = Σ fᵢ ⊗ rᵢ</span>. {t('le.bind.p2')} <span className="mono">T·rₖ</span> {t('le.bind.p3')} <span className="mono">fₖ</span> {t('le.bind.p4', { t: th.short })}
        </p>
        <div className="panel p-5 grid lg:grid-cols-[1.1fr_1fr] gap-6">
          <div>
            <h4 className="text-[.95rem] mb-2">{t('le.bindings')} <span className="muted font-normal">{t('le.pairs', { n: b.items.length })}</span></h4>
            <ul className="flex flex-wrap gap-2 mb-4" style={{ listStyle: 'none', padding: 0 }}>
              {b.items.map(x => <li key={x.id} className="mono text-[12.5px] rounded-lg px-2.5 py-1" style={{ background: 'var(--bg2)', border: '1px solid var(--line)' }}><span style={{ color: 'var(--sym)' }}>{x.label}</span><span className="muted mx-1.5">⊗</span><span style={{ color: 'var(--emb)' }}>{x.role}</span></li>)}
            </ul>
            <label className="flex gap-2 items-center text-[14px] soft mb-4 cursor-pointer">
              <input type="checkbox" checked={ortho} onChange={e => setOrtho(e.target.checked)} style={{ accentColor: 'var(--emb)', width: 16, height: 16 }} />
              {t('le.ortho')}
            </label>
            <h4 className="text-[.95rem] mb-2">{t('le.superposition')} <span className="mono muted font-normal">T ∈ ℝ<sup>6×6</sup></span></h4>
            <div className="grid gap-[3px] max-w-[360px]" style={{ gridTemplateColumns: 'repeat(6,1fr)' }} role="img" aria-label={t('le.heatAria')}>
              {b.Tm.flat().map((v, j) => <div key={j} className="aspect-square rounded flex items-center justify-center mono text-[9.5px]" style={{ background: divColor(v / b.mx), color: 'var(--text)' }}>{v.toFixed(1)}</div>)}
            </div>
          </div>
          <div aria-live="polite">
            <h4 className="text-[.95rem] mb-2">{t('le.unbind')}</h4>
            <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={t('le.roleAria')}>
              {b.items.map((x, j) => <button key={x.id} className="minibtn lt-onfill-btn" aria-pressed={j === k} style={j === k ? { background: 'var(--emb)', color: '#0a0f20', borderColor: 'var(--emb)' } : { color: 'var(--emb)' }} onClick={() => setQuery(j)}>{x.role}</button>)}
            </div>
            <div className="mono text-[13px] soft mb-3">T · r<sub>{b.items[k].role}</sub> = û → {t('le.nearest')} <b style={{ color: 'var(--sym)' }}>{b.items[best].label}</b> {best === k ? '✓' : '✗'}</div>
            <div className="mono text-[12px] muted">{t('le.recovered')}</div>{vrow(u, t('le.recovered'))}
            <div className="mono text-[12px] muted">{t('le.trueFiller')} f<sub>{b.items[k].label}</sub></div>{vrow(b.fillers[k], t('le.trueFiller'))}
            <div className="mono text-[12px] muted mb-1.5 mt-3">{t('le.cosines')}</div>
            <div className="grid gap-x-2.5 gap-y-1.5 items-center mono text-[12.5px]" style={{ gridTemplateColumns: '70px 1fr 58px' }}>
              {b.items.map((x, j) => (
                <div key={x.id} className="contents">
                  <span style={j === best ? { color: 'var(--sym)', fontWeight: 600 } : undefined}>{x.label}</span>
                  <div className="h-3 rounded-md overflow-hidden" style={{ background: 'var(--bg2)' }}><i className="block h-full rounded-md" style={{ width: `${Math.max(0, sims[j]) * 100}%`, background: 'linear-gradient(90deg,var(--emb),var(--neu))', transition: 'width .4s' }} /></div>
                  <span style={j === best ? { color: 'var(--sym)', fontWeight: 600 } : undefined}>{sims[j].toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
