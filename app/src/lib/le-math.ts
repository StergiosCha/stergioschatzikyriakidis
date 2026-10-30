/* Numerical core ported from the LingEmbed site (assets/app.js) without changing the algorithms:
 * seeded RNG, tree layout + BFS distances, cyclic Jacobi eigensolver, classical MDS. */
import type { Theory, TheoryNode } from '../data/lingembedTheories';

export function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
export const sub = (a: number[], b: number[]) => a.map((x, i) => x - b[i]);

export interface TNode extends TheoryNode { idx: number; children: TNode[]; depth: number; xi: number; yi: number; role: string }
export interface BuiltTree { nodes: TNode[]; byId: Record<string, TNode>; root: TNode; dist: number[][] }

export function buildTree(th: Theory): BuiltTree {
  const nodes = th.nodes.map((n, i) => ({ ...n, idx: i, children: [] as TNode[], depth: 0, xi: 0, yi: 0, role: '' })) as TNode[];
  const byId: Record<string, TNode> = Object.fromEntries(nodes.map(n => [n.id, n]));
  nodes.forEach(n => { if (n.parent) byId[n.parent].children.push(n); });
  const root = nodes.find(n => !n.parent)!;
  (function depth(n: TNode, k: number) { n.depth = k; n.children.forEach(c => depth(c, k + 1)); })(root, 0);
  const maxD = Math.max(...nodes.map(n => n.depth));
  if (th.layout === 'dependency') {
    const mp = Math.max(...nodes.map(n => n.pos ?? 0));
    nodes.forEach(n => { n.xi = (n.pos ?? 0) / mp; });
  } else {
    const leaves: TNode[] = [];
    (function dfs(n: TNode) { if (!n.children.length) leaves.push(n); n.children.forEach(dfs); })(root);
    leaves.forEach((l, i) => { l.xi = leaves.length > 1 ? i / (leaves.length - 1) : 0.5; });
    (function post(n: TNode) {
      if (n.children.length) { n.children.forEach(post); n.xi = n.children.reduce((s, c) => s + c.xi, 0) / n.children.length; }
    })(root);
  }
  nodes.forEach(n => {
    n.yi = (th.layout === 'constituency' && !n.children.length) ? maxD : n.depth;
    n.yi = maxD ? n.yi / maxD : 0;
  });
  nodes.forEach(n => {
    const path: string[] = []; let cur: TNode = n;
    while (cur.parent) {
      const p = byId[cur.parent];
      if (th.nodes.some(x => x.rel)) path.unshift(cur.rel ?? '');
      else path.unshift(p.children.indexOf(cur) === 0 ? 'L' : 'R');
      cur = p;
    }
    n.role = path.length ? path.join('·') : 'root';
  });
  const adj: number[][] = nodes.map(() => []);
  nodes.forEach(n => { if (n.parent) { const p = byId[n.parent]; adj[n.idx].push(p.idx); adj[p.idx].push(n.idx); } });
  return { nodes, byId, root, dist: bfsDistances(adj) };
}

/** All-pairs hop distances of an undirected graph (BFS from every node); -1 = unreachable. */
export function bfsDistances(adj: number[][]): number[][] {
  const N = adj.length;
  return adj.map((_, s) => {
    const d: number[] = Array(N).fill(-1); d[s] = 0; const q = [s];
    while (q.length) { const u = q.shift()!; adj[u].forEach(v => { if (d[v] < 0) { d[v] = d[u] + 1; q.push(v); } }); }
    return d;
  });
}

/** Cyclic Jacobi eigen-decomposition of a symmetric matrix (identical to LingEmbed). */
export function jacobiEigen(A: number[][]) {
  const n = A.length;
  const a = A.map(r => r.slice());
  const V: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += a[i][j] * a[i][j];
    if (off < 1e-20) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(a[p][q]) < 1e-15) continue;
      const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
      const t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  return { vals: a.map((r, i) => r[i]), V };
}

/** Classical MDS whose *squared* target distances are `dist` (LingEmbed treeEmbedding).
 *  For tree metrics the embedding is exact; maxErr reports max |‖xi−xj‖² − dist_ij|.
 *  negMass is the total magnitude of negative eigenvalues (0 ⇔ the target is exactly Euclidean). */
export function classicalMDS(dist: number[][]) {
  const n = dist.length;
  const rowMean = dist.map(r => r.reduce((s, x) => s + x, 0) / n);
  const all = rowMean.reduce((s, x) => s + x, 0) / n;
  const B = dist.map((r, i) => r.map((d, j) => -0.5 * (d - rowMean[i] - rowMean[j] + all)));
  const { vals, V } = jacobiEigen(B);
  const order = vals.map((v, i) => [v, i] as [number, number]).sort((x, y) => y[0] - x[0]);
  const pos = order.filter(([v]) => v > 1e-9);
  const X = Array.from({ length: n }, (_, i) => pos.map(([v, k]) => V[i][k] * Math.sqrt(v)));
  const total = pos.reduce((s, [v]) => s + v, 0);
  const explained2 = pos.slice(0, 2).reduce((s, [v]) => s + v, 0) / (total || 1);
  const negMass = order.filter(([v]) => v < -1e-9).reduce((s, [v]) => s - v, 0);
  let maxErr = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const d2 = dot(sub(X[i], X[j]), sub(X[i], X[j]));
    maxErr = Math.max(maxErr, Math.abs(d2 - dist[i][j]));
  }
  return { X, dims: pos.length, explained2, maxErr, negMass };
}

/** Fit the first two coordinates into a box (uniform scale, centred). */
export function fit2D(X: number[][], box: { x: number; y: number; w: number; h: number }): [number, number][] {
  const xs = X.map(v => v[0] || 0), ys = X.map(v => v[1] || 0);
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) || 1;
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const s = Math.min(box.w, box.h) / span;
  return X.map((_, i) => [box.x + box.w / 2 + (xs[i] - cx) * s, box.y + box.h / 2 + (ys[i] - cy) * s]);
}

/* ---------- ported verbatim from LingEmbed app.js: vectors, encoder, TPR binding ---------- */
export function randn(rng: () => number) {
  let u = 0, v = 0;
  while (!u) u = rng();
  while (!v) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
export const randVec = (seed: number, d: number) => { const r = mulberry32(seed); return Array.from({ length: d }, () => randn(r)); };
export const norm = (a: number[]) => Math.sqrt(dot(a, a));
export const scale = (a: number[], k: number) => a.map(x => x * k);
export const unit = (a: number[]) => scale(a, 1 / (norm(a) || 1));
export const cosine = (a: number[], b: number[]) => dot(a, b) / ((norm(a) * norm(b)) || 1);

/** Illustrative random-weight tanh encoder 8 → 8 → 8 → 4 (weights ~ N(0,1)·1.3/√fan-in, seeded). */
export const LAYERS = [8, 8, 8, 4];
export function makeEncoder(seed: number): number[][][] {
  const rng = mulberry32(seed);
  const W: number[][][] = [];
  for (let l = 1; l < LAYERS.length; l++) {
    W.push(Array.from({ length: LAYERS[l] }, () => Array.from({ length: LAYERS[l - 1] }, () => randn(rng) * 1.3 / Math.sqrt(LAYERS[l - 1]))));
  }
  return W;
}
export function forward(W: number[][][], x: number[]) {
  const acts = [x.slice(0, LAYERS[0]).concat(Array(Math.max(0, LAYERS[0] - x.length)).fill(0))];
  W.forEach(M => { const prev = acts[acts.length - 1]; acts.push(M.map(row => Math.tanh(dot(row, prev)))); });
  return acts;
}
export function gramSchmidt(vs: number[][]) {
  const out: number[][] = [];
  vs.forEach(v => { let w = v.slice(); out.forEach(u => { w = sub(w, scale(u, dot(w, u))); }); out.push(unit(w)); });
  return out;
}
/** Diverging colour: cyan for positive, pink for negative; v in [-1, 1]. */
export function divColor(v: number) {
  const a = Math.min(1, Math.abs(v));
  return v >= 0 ? `rgba(56,217,245,${0.12 + 0.88 * a})` : `rgba(255,107,154,${0.12 + 0.88 * a})`;
}

/** Integer formatting helpers used across the visualisations. */
export const fmtInt = (n: number) => n.toLocaleString('en-US');
export const fmtM = (n: number, d = 1) => `${(n / 1e6).toFixed(d)}M`;
