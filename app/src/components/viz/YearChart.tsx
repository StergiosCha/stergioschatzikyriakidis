import { useMemo } from 'react';
import { useT } from '../../i18n';

export interface YearItem { year: number | null; cat: string }
export interface YearCat { id: string; label: string; color: string }

/** Stacked bars of items per year, counted live. Each year is a keyboard-operable filter button. */
export default function YearChart({ items, cats, selected, onSelect, label }: {
  items: YearItem[]; cats: YearCat[]; selected: number | null; onSelect?: (y: number | null) => void; label: string;
}) {
  const { t } = useT();
  const m = useMemo(() => {
    const dated = items.filter(i => i.year != null) as { year: number; cat: string }[];
    const y0 = Math.min(...dated.map(i => i.year)), y1 = Math.max(...dated.map(i => i.year));
    const years = Array.from({ length: y1 - y0 + 1 }, (_, i) => y0 + i);
    const counts = years.map(y => cats.map(c => dated.filter(i => i.year === y && i.cat === c.id).length));
    const totals = counts.map(r => r.reduce((s, x) => s + x, 0));
    const max = Math.max(...totals);
    const peak = years[totals.indexOf(max)];
    return { years, counts, totals, max, peak, undated: items.length - dated.length, dated: dated.length, y0, y1 };
  }, [items, cats]);
  const W = 1000, H = 190, padL = 30, padB = 26, top = 14;
  const bw = (W - padL) / m.years.length;
  const ystep = m.max > 12 ? 5 : 2;
  return (
    <div>
      <svg className="viz" viewBox={`0 0 ${W} ${H}`} role="group" aria-label={t('chart.aria', { label, a: m.y0, b: m.y1 })}>
        {Array.from({ length: Math.floor(m.max / ystep) + 1 }, (_, k) => k * ystep).map(v => {
          const y = H - padB - (v / m.max) * (H - padB - top);
          return <g key={v}><line x1={padL} x2={W} y1={y} y2={y} stroke="rgba(255,255,255,.06)" /><text x={padL - 6} y={y + 4} textAnchor="end" fontSize={10} className="mono-t" fill="#8c98b8">{v}</text></g>;
        })}
        {m.years.map((y, i) => {
          let acc = 0; const x = padL + i * bw;
          const on = selected == null || selected === y;
          return (
            <g key={y} className="seg-btn" role="button" tabIndex={m.totals[i] ? 0 : -1} aria-pressed={selected === y}
              aria-label={t('chart.bar', { y, n: m.totals[i], label })}
              onClick={() => onSelect?.(selected === y ? null : y)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(selected === y ? null : y); } }}
              style={{ opacity: on ? 1 : 0.28 }}>
              <rect x={x} y={top} width={bw} height={H - padB - top} fill="transparent" />
              {cats.map((c, k) => {
                const v = m.counts[i][k]; if (!v) return null;
                const h = (v / m.max) * (H - padB - top); acc += h;
                return <rect key={c.id} x={x + bw * 0.14} width={bw * 0.72} y={H - padB - acc} height={Math.max(0, h - 1)} rx={2} fill={c.color}><title>{`${y} · ${c.label}: ${v}`}</title></rect>;
              })}
              {(i % (m.years.length > 24 ? 3 : 2) === 0 || y === m.y1) && <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize={10} className="mono-t" fill="#8c98b8">{`’${String(y).slice(2)}`}</text>}
            </g>
          );
        })}
      </svg>
      <div className="legend mt-1">{cats.map(c => <span key={c.id}><i className="dot" style={{ background: c.color }} />{c.label}</span>)}</div>
    </div>
  );
}
