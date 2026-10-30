import { useMemo } from 'react';
import { useT } from '../../i18n';
import { svarnaDatabases } from '../../data/svarnaCorpus';
import { fmtInt } from '../../lib/le-math';

/** Dialectal database of Svarna (GRDD+ rows of the paper's Table 1), with shares computed live. */
export default function DialectBars() {
  const { t } = useT();
  const m = useMemo(() => {
    const parts = svarnaDatabases.find(d => d.id === 'dialectal')!.parts;
    const words = parts.reduce((s, p) => s + p.words, 0);
    const max = Math.max(...parts.map(p => p.words));
    return { parts: [...parts].sort((a, b) => b.words - a.words), words, max };
  }, []);
  return (
    <div className="info-card">
      <h5>{t('dia.title', { n: m.parts.length, w: fmtInt(m.words) })}</h5>
      <div className="grid gap-x-3 gap-y-1.5 mt-2" style={{ gridTemplateColumns: '92px 1fr 46px' }}>
        {m.parts.map(p => (
          <div key={p.name} className="contents">
            <span className="mono text-[12px] soft">{p.name}</span>
            <span className="self-center h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }} title={`${fmtInt(p.words)} words, ${fmtInt(p.sentences)} sentences`}>
              <i className="block h-full rounded-full" style={{ width: `${(p.words / m.max) * 100}%`, background: 'linear-gradient(90deg, var(--sym), #ff9f6b)' }} />
            </span>
            <span className="mono text-[12px] text-right" style={{ color: 'var(--sym)' }}>{((p.words / m.words) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
