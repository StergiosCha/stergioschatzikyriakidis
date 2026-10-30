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
const W = 720, C = W / 2, R_NODE = 200, R_HUB = 78, R_BAND = 184, MIN_SPAN = 46, GAP = 7;

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
    const sectors = CATS.map((c, i) => { const s = { ...c, n: counts[i], a0: start, a1: start + spans[i], mid: start + spans[i] / 2 }; start += spans[i]; return s; });
    const nodes: { tool: Tool; idx: number; ang: number; x: number; y: number; color: string; cat: Cat; path: string }[] = [];
    sectors.forEach(sec => {
      const list = tools.map((tool, idx) => ({ tool, idx })).filter(o => o.tool.category === sec.id);
      const lo = sec.a0 + GAP, hi = sec.a1 - GAP, step = (hi - lo) / list.length;
      const [hx, hy] = pol(R_HUB, sec.mid);
      list.forEach((o, j) => {
        const ang = lo + (j + 0.5) * step;
        const [x, y] = pol(R_NODE, ang);
        const [qx, qy] = pol((R_HUB + R_NODE) / 2 + 10, ang);
        nodes.push({ ...o, ang, x, y, color: sec.color, cat: sec.id, path: `M${hx.toFixed(1)},${hy.toFixed(1)} Q${qx.toFixed(1)},${qy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}` });
      });
    });
    const arc = (r0: number, r1: number, d0: number, d1: number) => {
      const [x0, y0] = pol(r1, d0), [x1, y1] = pol(r1, d1), [x2, y2] = pol(r0, d1), [x3, y3] = pol(r0, d0);
      const large = d1 - d0 > 180 ? 1 : 0;
      return `M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`;
    };
    return { sectors, nodes, arc };
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
          <radialGradient id="tmGlow"><stop offset="0" stopColor="rgba(167,139,250,.20)" /><stop offset=".6" stopColor="rgba(56,217,245,.05)" /><stop offset="1" stopColor="rgba(56,217,245,0)" /></radialGradient>
          <filter id="tmSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        <circle cx={C} cy={C} r={R_NODE + 30} fill="url(#tmGlow)" />
        <circle cx={C} cy={C} r={R_HUB} fill="none" stroke="var(--line)" strokeDasharray="2 5" />
        <circle cx={C} cy={C} r={R_NODE} fill="none" stroke="var(--line)" strokeOpacity={0.6} />
        {layout.sectors.map(s => {
          const dim = cat && s.id !== cat;
          return <path key={'b' + s.id} d={layout.arc(R_BAND - 5, R_BAND, s.a0 + GAP / 2, s.a1 - GAP / 2)} fill={s.color} opacity={dim ? 0.12 : 0.7} />;
        })}
        {layout.nodes.map(n => {
          const dim = cat && n.cat !== cat, on = n.idx === active;
          return <path key={'e' + n.idx} d={n.path} fill="none" stroke={n.color} strokeOpacity={dim ? 0.04 : on ? 0.95 : 0.28} strokeWidth={on ? 2.2 : 1.1} />;
        })}
        {layout.sectors.map(s => {
          const [hx, hy] = pol(R_HUB, s.mid);
          const dim = cat && s.id !== cat;
          return (
            <g key={'h' + s.id} opacity={dim ? 0.25 : 1} style={{ cursor: 'pointer' }} onClick={() => setCat(cat === s.id ? null : s.id)}>
              <circle cx={hx} cy={hy} r={20} fill={s.color} opacity={0.25} filter="url(#tmSoft)" />
              <circle cx={hx} cy={hy} r={16} fill="var(--bg2)" stroke={s.color} strokeWidth={2} />
              <text x={hx} y={hy + 4.5} textAnchor="middle" className="mono" fontSize={13} fontWeight={600} fill={s.color}>{s.n}</text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={38} fill="var(--panel)" stroke="var(--line2)" />
        <text x={C} y={C + 4} textAnchor="middle" fontSize={26} fontWeight={600} fill="var(--text)" style={{ fontFamily: 'var(--serif)' }}>{tools.length}</text>
        <text x={C} y={C + 21} textAnchor="middle" fontSize={10} className="mono" fill="var(--muted)" letterSpacing="1.5">{t('software.map.total')}</text>
        {layout.nodes.map(n => {
          const dim = cat && n.cat !== cat, on = n.idx === active, live = !!n.tool.platformUrl;
          const left = n.ang > 180, rot = left ? n.ang + 90 : n.ang - 90;
          const name = n.tool.name.length > 24 && !on ? n.tool.name.slice(0, 23) + '…' : n.tool.name;
          return (
            <g key={'n' + n.idx} className="tm-node" tabIndex={0} role="button" aria-label={n.tool.name}
               opacity={dim ? 0.15 : 1} transform={`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`}
               onMouseEnter={() => setActive(n.idx)} onFocus={() => setActive(n.idx)} onClick={() => open(n.tool)}
               onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n.tool); } }}>
              {on && <circle r={18} fill={n.color} opacity={0.35} filter="url(#tmSoft)" />}
              {live && <circle r={on ? 11.5 : 9.5} fill="none" stroke={n.color} strokeOpacity={on ? 1 : 0.55} strokeWidth={1.3} />}
              <circle r={on ? 7 : 5.2} fill={n.color} stroke="var(--bg)" strokeWidth={1.5} />
              <text transform={`rotate(${rot.toFixed(1)})`} x={left ? -15 : 15} y={3.6} textAnchor={left ? 'end' : 'start'}
                    fontSize={on ? 12.5 : 11} fontWeight={on ? 600 : 400} fill={on ? 'var(--text)' : 'var(--soft)'}>{name}</text>
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
