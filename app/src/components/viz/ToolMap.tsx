import { useMemo, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { useT } from '../../i18n';
import { tools, type Tool } from '../../data/tools';

type Cat = Tool['category'];
const CATS: { id: Cat; color: string }[] = [
  { id: 'application', color: 'var(--neu)' },
  { id: 'dataset', color: 'var(--sym)' },
  { id: 'code', color: 'var(--emb)' },
  { id: 'model', color: 'var(--neg)' },
];
const W = 520, C = W / 2, RINGS = [118, 168, 214], MIN_SPAN = 46, GAP = 8;

const firstSentence = (s: string) => {
  const cut = s.indexOf('. ');
  return cut > 0 && cut < 220 ? s.slice(0, cut + 1) : s.length > 220 ? s.slice(0, 217) + '…' : s;
};
const pol = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};

/** Constellation of every tool in tools.ts: one angular sector per category (sized by count),
 *  nodes on concentric rings, live apps ringed. Hover/focus shows the card; click opens the link. */
export default function ToolMap() {
  const { t } = useT();
  const [active, setActive] = useState(0);
  const [cat, setCat] = useState<Cat | null>(null);

  const layout = useMemo(() => {
    const counts = CATS.map(c => tools.filter(x => x.category === c.id).length);
    const small = counts.map(n => n * 360 / tools.length < MIN_SPAN);
    const fixed = small.filter(Boolean).length * MIN_SPAN;
    const restN = counts.reduce((s, n, i) => s + (small[i] ? 0 : n), 0);
    const spans = counts.map((n, i) => small[i] ? MIN_SPAN : (360 - fixed) * n / restN);
    let start = 0;
    const sectors = CATS.map((c, i) => { const s = { ...c, n: counts[i], a0: start, a1: start + spans[i] }; start += spans[i]; return s; });
    const nodes: { tool: Tool; idx: number; x: number; y: number; color: string; cat: Cat; hub: number[] }[] = [];
    sectors.forEach(sec => {
      const list = tools.map((tool, idx) => ({ tool, idx })).filter(o => o.tool.category === sec.id);
      const k = list.length > 9 ? 3 : list.length > 3 ? 2 : 1;
      const lo = sec.a0 + GAP, hi = sec.a1 - GAP;
      const hub = pol(64, (sec.a0 + sec.a1) / 2);
      list.forEach((o, j) => {
        const ring = j % k, perRing = Math.ceil(list.length / k), pos = Math.floor(j / k);
        const frac = perRing > 1 ? (pos + (ring % 2 ? 0.5 : 0)) / (perRing - (ring % 2 ? 0 : 1) || 1) : 0.5;
        const [x, y] = pol(RINGS[ring + (k === 1 ? 1 : 0)], lo + Math.min(1, frac) * (hi - lo));
        nodes.push({ ...o, x, y, color: sec.color, cat: sec.id, hub });
      });
    });
    return { sectors, nodes };
  }, []);

  const cur = tools[active];
  const open = (tool: Tool) => { const u = tool.platformUrl || tool.githubUrl; if (u) window.open(u, '_blank', 'noopener'); };

  return (
    <div className="toolmap">
      <div className="flex flex-wrap gap-2 mb-2" role="group" aria-label={t('software.map.aria')}>
        <button type="button" className={`chip-btn ${cat === null ? 'on' : ''}`} onClick={() => setCat(null)}>{t('software.map.all')} · {tools.length}</button>
        {layout.sectors.map(s => (
          <button key={s.id} type="button" className={`chip-btn ${cat === s.id ? 'on' : ''}`} onClick={() => setCat(cat === s.id ? null : s.id)} style={{ ['--c' as string]: s.color }}>
            <i className="dot" style={{ background: s.color }} />{t(`software.cat.${s.id}`)} · {s.n}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${W}`} role="img" aria-label={t('software.map.aria')} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <radialGradient id="tmGlow"><stop offset="0" stopColor="rgba(167,139,250,.22)" /><stop offset="1" stopColor="rgba(167,139,250,0)" /></radialGradient>
        </defs>
        <circle cx={C} cy={C} r={W / 2 - 6} fill="url(#tmGlow)" />
        {RINGS.map(r => <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="var(--line)" strokeDasharray="2 6" />)}
        {layout.sectors.map(s => {
          const [x0, y0] = pol(W / 2 - 10, s.a0);
          return <line key={s.id} x1={C} y1={C} x2={x0} y2={y0} stroke="var(--line)" strokeWidth={1} />;
        })}
        {layout.nodes.map(n => {
          const dim = cat && n.cat !== cat;
          return <line key={'e' + n.idx} x1={n.hub[0]} y1={n.hub[1]} x2={n.x} y2={n.y} stroke={n.color} strokeOpacity={dim ? 0.05 : n.idx === active ? 0.9 : 0.22} strokeWidth={n.idx === active ? 2 : 1} />;
        })}
        {layout.sectors.map(s => {
          const [hx, hy] = pol(64, (s.a0 + s.a1) / 2);
          const dim = cat && s.id !== cat;
          return (
            <g key={'h' + s.id} opacity={dim ? 0.25 : 1}>
              <circle cx={hx} cy={hy} r={15} fill="var(--bg2)" stroke={s.color} strokeWidth={2} />
              <text x={hx} y={hy + 4} textAnchor="middle" className="mono" fontSize={11} fill={s.color}>{s.n}</text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={30} fill="var(--panel)" stroke="var(--line2)" />
        <text x={C} y={C + 2} textAnchor="middle" fontSize={20} fontWeight={600} fill="var(--text)" style={{ fontFamily: 'var(--serif)' }}>{tools.length}</text>
        <text x={C} y={C + 17} textAnchor="middle" fontSize={9} className="mono" fill="var(--muted)">{t('software.map.total')}</text>
        {layout.nodes.map(n => {
          const dim = cat && n.cat !== cat, on = n.idx === active, live = !!n.tool.platformUrl;
          return (
            <g key={'n' + n.idx} className="tm-node" tabIndex={0} role="button" aria-label={n.tool.name}
               opacity={dim ? 0.18 : 1} transform={`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`}
               onMouseEnter={() => setActive(n.idx)} onFocus={() => setActive(n.idx)} onClick={() => open(n.tool)}
               onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n.tool); } }}>
              {live && <circle r={on ? 15 : 12.5} fill="none" stroke={n.color} strokeOpacity={on ? 0.9 : 0.45} strokeWidth={1.4} />}
              <circle r={on ? 9.5 : 7.5} fill={n.color} fillOpacity={on ? 1 : 0.85} stroke="var(--bg)" strokeWidth={2} />
              {on && <text y={-22} textAnchor="middle" fontSize={11.5} fontWeight={600} fill="var(--text)" style={{ paintOrder: 'stroke', stroke: 'var(--bg)', strokeWidth: 4 }}>{n.tool.name.length > 28 ? n.tool.name.slice(0, 27) + '…' : n.tool.name}</text>}
            </g>
          );
        })}
      </svg>
      <div className="info-card mt-2" aria-live="polite" style={{ minHeight: 132 }}>
        <div className="flex items-center gap-2 mb-1">
          <i className="dot" style={{ background: CATS.find(c => c.id === cur.category)!.color }} />
          <span className="num-label" style={{ margin: 0 }}>{t(`software.cat.${cur.category}`)}{cur.platformUrl ? ` · ${t('software.map.live')}` : ''}</span>
        </div>
        <h5 style={{ fontSize: '1.05rem', margin: '2px 0 6px', textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--serif)', color: 'var(--text)' }}>{cur.name}</h5>
        <p className="soft" style={{ fontSize: '.88rem', margin: '0 0 8px' }}>{firstSentence(cur.description)}</p>
        <div className="flex flex-wrap gap-3 text-[13px]">
          {cur.platformUrl && <a href={cur.platformUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1"><ExternalLink size={14} aria-hidden="true" />{t('software.map.open')}</a>}
          {cur.githubUrl && <a href={cur.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1"><Github size={14} aria-hidden="true" />{t('software.map.github')}</a>}
        </div>
      </div>
    </div>
  );
}
