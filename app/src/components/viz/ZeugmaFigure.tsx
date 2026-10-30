import { useMemo, useState } from 'react';
import { useT } from '../../i18n';

/** Zeugma (MEDEA-NEUMOUSA): ancient text → LLM extraction → knowledge graph → Prolog → reasoning.
 *  The Prolog query is evaluated live by a small backtracking solver over the facts shown. */

type Term = string;                       // Capitalised = variable
type Atom = [string, Term[]];
type Rule = { head: Atom; body: Atom[] };

const FACTS: Atom[] = [
  ['hero', ['jason']], ['sorceress', ['medea']], ['loves', ['medea', 'jason']], ['artifact', ['golden_fleece']],
];
const RULES: Rule[] = [{ head: ['quest', ['X', 'Y']], body: [['hero', ['X']], ['artifact', ['Y']]] }];
const QUERY: Atom = ['quest', ['Who', 'What']];

const isVar = (t: Term) => /^[A-Z]/.test(t);
type Env = Record<string, Term>;
const walk = (t: Term, e: Env): Term => (isVar(t) && e[t] !== undefined ? walk(e[t], e) : t);
function unify(a: Term[], b: Term[], e: Env): Env | null {
  if (a.length !== b.length) return null;
  let env: Env = { ...e };
  for (let i = 0; i < a.length; i++) {
    const x = walk(a[i], env), y = walk(b[i], env);
    if (x === y) continue;
    if (isVar(x)) env = { ...env, [x]: y };
    else if (isVar(y)) env = { ...env, [y]: x };
    else return null;
  }
  return env;
}
function* solve(goals: Atom[], env: Env, depth = 0): Generator<Env> {
  if (!goals.length) { yield env; return; }
  if (depth > 32) return;
  const [[p, args], ...rest] = goals;
  for (const [fp, fa] of FACTS) if (fp === p) { const e = unify(args, fa, env); if (e) yield* solve(rest, e, depth + 1); }
  for (const r of RULES) if (r.head[0] === p) {
    const sfx = `_${depth}`, ren = (t: Term) => (isVar(t) ? t + sfx : t);
    const head = r.head[1].map(ren), body = r.body.map(([bp, ba]) => [bp, ba.map(ren)] as Atom);
    const e = unify(args, head, env); if (e) yield* solve([...body, ...rest], e, depth + 1);
  }
}

const NODES = [
  { id: 'medea', label: 'Medea', x: 92, y: 52 },
  { id: 'jason', label: 'Jason', x: 252, y: 36 },
  { id: 'colchis', label: 'Colchis', x: 48, y: 112 },
  { id: 'argonauts', label: 'Argonauts', x: 334, y: 98 },
  { id: 'golden_fleece', label: 'Golden Fleece', x: 200, y: 124 },
];
const EDGES: [string, string, string][] = [
  ['medea', 'loves', 'jason'], ['medea', 'from', 'colchis'], ['medea', 'helps_obtain', 'golden_fleece'],
  ['jason', 'seeks', 'golden_fleece'], ['jason', 'leads', 'argonauts'], ['argonauts', 'sail_for', 'golden_fleece'],
];
const GREEN = '#34d399';
const W = 440, X0 = 14, BW = 412;

export default function ZeugmaFigure() {
  const { t } = useT();
  const [hover, setHover] = useState<string | null>(null);
  const [ran, setRan] = useState(false);
  const answers = useMemo(() => {
    const out: string[] = [];
    for (const e of solve([QUERY], {})) out.push(QUERY[1].map(v => `${v} = ${walk(v, e)}`).join(', '));
    return out;
  }, []);
  const byId = Object.fromEntries(NODES.map(n => [n.id, n]));
  const factText = (a: Atom) => `${a[0]}(${a[1].join(', ')}).`;
  const mentions = (txt: string) => !!hover && txt.includes(hover);

  const stage = (y: number, h: number, color: string, label: string) => (
    <g>
      <rect x={X0} y={y} width={BW} height={h} rx={14} fill="var(--panel)" stroke="var(--line)" />
      <rect x={X0} y={y + 12} width={3} height={h - 24} rx={1.5} fill={color} />
      <text x={X0 + 16} y={y + 20} fontSize={10} letterSpacing="1.6" fill={color} style={{ fontFamily: 'var(--mono)' }}>{label}</text>
    </g>
  );
  const link = (y1: number, y2: number) => <line x1={W / 2} y1={y1} x2={W / 2} y2={y2} stroke="var(--muted)" strokeWidth={1.4} className="zf-flow" />;
  const chips = (y: number, items: string[], color: string) => {
    let x = X0 + 16;
    return items.map(s => {
      const w = s.length * 6.4 + 16, el = (
        <g key={s}><rect x={x} y={y} width={w} height={18} rx={9} fill="none" stroke={color} strokeOpacity={0.55} />
          <text x={x + w / 2} y={y + 12.5} textAnchor="middle" fontSize={10} fill="var(--soft)" style={{ fontFamily: 'var(--mono)' }}>{s}</text></g>);
      x += w + 6; return el;
    });
  };

  return (
    <svg viewBox={`0 0 ${W} 758`} role="img" aria-label={t('zf.aria')} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <text x={X0} y={28} fontSize={24} fontWeight={600} fill="var(--text)" style={{ fontFamily: 'var(--serif)' }}>Zeugma</text>
      <text x={X0} y={46} fontSize={10.5} fill="var(--muted)" style={{ fontFamily: 'var(--mono)' }}>{t('zf.sub')}</text>

      {stage(60, 92, 'var(--sym)', `01 · ${t('zf.s1')}`)}
      <text x={X0 + 16} y={104} fontSize={16} fontStyle="italic" fill="var(--text)" style={{ fontFamily: "'Noto Serif', var(--serif)" }}>Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος</text>
      {chips(120, ['Greek', 'Latin', 'Sanskrit', 'Hebrew', 'Gothic'], 'var(--sym)')}
      {link(152, 168)}

      {stage(168, 78, 'var(--emb)', `02 · ${t('zf.s2')}`)}
      <text x={X0 + 16} y={206} fontSize={13} fill="var(--soft)">{t('zf.s2d')}</text>
      {chips(216, ['Gemini', 'OpenAI', 'Anthropic'], 'var(--emb)')}
      {[0, 1, 2].map(c => [0, 1, 2, 3].map(r => (
        <circle key={`${c}${r}`} cx={350 + c * 24} cy={190 + r * 13 - (c === 1 ? 0 : 0)} r={3.6} fill="var(--emb)" opacity={c === 1 ? 0.9 : 0.55} />
      )))}
      {[0, 1].map(c => [0, 1, 2, 3].map(r => [0, 1, 2, 3].map(q => (
        <line key={`${c}${r}${q}`} x1={350 + c * 24} y1={190 + r * 13} x2={374 + c * 24} y2={190 + q * 13} stroke="var(--emb)" strokeOpacity={0.12} />
      ))))}
      {link(246, 262)}

      {stage(262, 196, 'var(--neu)', `03 · ${t('zf.s3')}`)}
      <g transform={`translate(${X0 + 8}, 284)`}>
        {EDGES.map(([a, p, b]) => {
          const A = byId[a], B = byId[b], on = hover === a || hover === b;
          return (
            <g key={a + p + b}>
              <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--neu)" strokeOpacity={on ? 0.9 : 0.3} strokeWidth={on ? 1.8 : 1.1} />
              {on && <text x={(A.x + B.x) / 2} y={(A.y + B.y) / 2 - 4} textAnchor="middle" fontSize={9.5} fill="var(--neu)" style={{ fontFamily: 'var(--mono)', paintOrder: 'stroke', stroke: 'var(--panel)', strokeWidth: 3 }}>{p}</text>}
            </g>
          );
        })}
        {NODES.map(n => {
          const on = hover === n.id;
          return (
            <g key={n.id} tabIndex={0} role="button" aria-label={n.label} style={{ cursor: 'pointer', outline: 'none' }}
               onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}>
              <circle cx={n.x} cy={n.y} r={on ? 9 : 7} fill="var(--neu)" fillOpacity={on ? 1 : 0.8} stroke="var(--panel)" strokeWidth={2} />
              <text x={n.x} y={n.y + 22} textAnchor="middle" fontSize={11} fontWeight={on ? 600 : 400} fill={on ? 'var(--text)' : 'var(--soft)'}>{n.label}</text>
            </g>
          );
        })}
      </g>
      <text x={X0 + 16} y={448} fontSize={10} fill="var(--muted)" style={{ fontFamily: 'var(--mono)' }}>
        {hover ? EDGES.filter(e => e[0] === hover || e[2] === hover).map(e => `(${e[0]}, ${e[1]}, ${e[2]})`).slice(0, 2).join('  ') : t('zf.s3d')}
      </text>
      {link(458, 474)}

      {stage(474, 172, GREEN, `04 · ${t('zf.s4')}`)}
      <g style={{ fontFamily: 'var(--mono)' }} fontSize={11}>
        {FACTS.map((f, k) => {
          const txt = factText(f), on = mentions(txt);
          return <text key={txt} x={X0 + 16} y={516 + k * 17} fill={on ? 'var(--text)' : GREEN} fontWeight={on ? 600 : 400} opacity={hover && !on ? 0.45 : 1}>{txt}</text>;
        })}
        <text x={X0 + 16} y={590} fill={GREEN}>quest(X, Y) :- hero(X), artifact(Y).</text>
        <text x={X0 + 16} y={612} fill="var(--text)">?- quest(Who, What).</text>
        <g tabIndex={0} role="button" aria-label={t('zf.run')} style={{ cursor: 'pointer' }} onClick={() => setRan(true)}
           onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRan(true); } }}>
          <rect x={290} y={597} width={120} height={24} rx={12} fill={ran ? 'transparent' : GREEN} stroke={GREEN} />
          <text x={350} y={613} textAnchor="middle" fill={ran ? GREEN : '#06221a'} fontWeight={600} fontSize={11}>{ran ? t('zf.solved') : t('zf.run')}</text>
        </g>
        {ran && answers.map((a, k) => <text key={a} x={X0 + 16} y={634 + k * 14} fill="var(--text)">{a}</text>)}
      </g>
      {link(646, 662)}

      {stage(662, 84, 'var(--sym)', `05 · ${t('zf.s5')}`)}
      {[t('zf.o1'), t('zf.o2'), t('zf.o3'), t('zf.o4')].map((o, k) => (
        <text key={o} x={X0 + 16 + (k % 2) * 200} y={704 + Math.floor(k / 2) * 22} fontSize={12} fill="var(--soft)">
          <tspan fill="var(--sym)">› </tspan>{o}
        </text>
      ))}
    </svg>
  );
}
