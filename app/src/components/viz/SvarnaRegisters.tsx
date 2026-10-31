import { useMemo, useState } from 'react';
import { useT } from '../../i18n';
import { svarnaDatabases, svarnaReportedTotal } from '../../data/svarnaCorpus';
import { fmtInt, fmtM } from '../../lib/le-math';

export const DB_COLORS: Record<string, string> = { corpus: 'var(--neu)', literature: 'var(--emb)', dialectal: 'var(--sym)', social: '#ff6b9a', historical: '#6ee7b7' };

/** Register composition of Svarna, recomputed in the browser from the paper's per-source table. */
export default function SvarnaRegisters() {
  const { t } = useT();
  const [scale, setScale] = useState<'linear' | 'log'>('log');
  const [sel, setSel] = useState<string>('corpus');

  const m = useMemo(() => {
    const dbs = svarnaDatabases.map(d => ({
      ...d,
      words: d.parts.reduce((s, p) => s + p.words, 0),
      sentences: d.parts.reduce((s, p) => s + p.sentences, 0),
    }));
    const words = dbs.reduce((s, d) => s + d.words, 0);
    const sentences = dbs.reduce((s, d) => s + d.sentences, 0);
    const parts = dbs.reduce((s, d) => s + d.parts.length, 0);
    return { dbs, words, sentences, parts };
  }, []);

  const weight = (w: number) => (scale === 'log' ? Math.log10(w) : w);
  const tot = m.dbs.reduce((s, d) => s + weight(d.words), 0);
  let acc = 0;
  const segs = m.dbs.map(d => { const w = (weight(d.words) / tot) * 1000; const seg = { d, x: acc, w }; acc += w; return seg; });
  const cur = m.dbs.find(d => d.id === sel)!;
  const maxPart = Math.max(...cur.parts.map(p => p.words));
  // Row sums are checked against the paper's printed totals (see CHANGES.md); a mismatch is logged, not shown.
  if (m.words !== svarnaReportedTotal.words || m.sentences !== svarnaReportedTotal.sentences) console.warn('Svarna table sums differ from reported totals');
  const pct = (w: number) => { const p = (w / m.words) * 100; return p < 1 ? p.toFixed(2) : p.toFixed(1); };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[[fmtInt(m.words), 'sv.words'], [fmtInt(m.sentences), 'sv.sentences'], [String(m.dbs.length), 'sv.databases'], [String(m.parts), 'sv.subcorpora']].map(([v, l]) => (
          <div key={l} className="info-card"><div className="big-num grad-all" style={{ fontSize: 'clamp(1.05rem,1.8vw,1.45rem)' }}>{v}</div><div className="num-label">{t(l)}</div></div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <p className="eyebrow" style={{ margin: 0 }}>{t('sv.composition')}</p>
        <div className="flex gap-2" role="group" aria-label={t('sv.scaleAria')}>
          {(['log', 'linear'] as const).map(s => (
            <button key={s} className="chip" aria-pressed={scale === s} onClick={() => setScale(s)}>{t(s === 'log' ? 'sv.log' : 'sv.linear')}</button>
          ))}
        </div>
      </div>
      <svg className="viz" viewBox="0 0 1000 46" role="group" aria-label={t('sv.barAria')}>
        {segs.map(({ d, x, w }) => (
          <g key={d.id} className="seg-btn" role="button" tabIndex={0} aria-pressed={sel === d.id}
            aria-label={t('sv.segAria', { label: t(`db.${d.id}`), w: fmtInt(d.words), p: pct(d.words) })}
            onClick={() => setSel(d.id)} onMouseEnter={() => setSel(d.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(d.id); } }}
            style={{ opacity: sel === d.id ? 1 : 0.5 }}>
            <rect x={x + 1} y={4} width={Math.max(1.5, w - 2)} height={38} rx={7} fill={DB_COLORS[d.id]} />
            {w > 96 && <text x={x + 10} y={28} fontSize={13} fontWeight={600} fill="#0a0f20">{t(`db.${d.id}`).split(/[ (/]/)[0]}</text>}
          </g>
        ))}
      </svg>
      <div className="legend mt-2">
        {m.dbs.map(d => (
          <span key={d.id}><i className="dot" style={{ background: DB_COLORS[d.id] }} />{t(`db.${d.id}`)} · {pct(d.words)}%</span>
        ))}
      </div>

      <div className="grid md:grid-cols-[1.4fr_1fr] gap-4 mt-5">
        <div className="info-card" aria-live="polite">
          <h5>{t('sv.subs', { label: t(`db.${cur.id}`), n: cur.parts.length })}</h5>
          <div className="grid gap-x-3 gap-y-1.5 mt-2" style={{ gridTemplateColumns: 'minmax(110px,170px) 1fr 58px' }}>
            {[...cur.parts].sort((a, b) => b.words - a.words).map(p => (
              <div key={p.name} className="contents">
                <span className="mono text-[12px] soft truncate" title={p.name}>{p.name}</span>
                <span className="self-center h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
                  <i className="block h-full rounded-full" style={{ width: `${(p.words / maxPart) * 100}%`, background: `linear-gradient(90deg, ${DB_COLORS[cur.id]}, var(--emb))`, transition: 'width .4s' }} />
                </span>
                <span className="mono text-[12px] text-right" style={{ color: 'var(--emb)' }}>{fmtM(p.words, p.words < 1e6 ? 2 : 1)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="info-card">
          <h5>{t(`db.${cur.id}`)}</h5>
          <div className="kv"><span>{t('sv.words')}</span><span>{fmtInt(cur.words)}</span></div>
          <div className="kv"><span>{t('sv.sentences')}</span><span>{fmtInt(cur.sentences)}</span></div>
          <div className="kv"><span>{t('sv.wpsHere')}</span><span>{(cur.words / cur.sentences).toFixed(1)}</span></div>
          <div className="kv"><span>{t('sv.wpsAll')}</span><span>{(m.words / m.sentences).toFixed(1)}</span></div>
        </div>
      </div>
    </div>
  );
}
