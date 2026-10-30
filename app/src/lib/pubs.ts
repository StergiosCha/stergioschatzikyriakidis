import { publications, abstracts, type Publication } from '../data/publications';

export type PubKind = Publication['type'];
export interface PubEntry extends Publication { key: string; group: 'publication' | 'abstract'; yearNum: number | null }

export const yearOf = (y: string): string => y.match(/(19|20)\d{2}/)?.[0] ?? (y || 'n.d.');
const yearNum = (y: string): number | null => { const m = y.match(/(19|20)\d{2}/); return m ? +m[0] : null; };

export const slugify = (t: string): string =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 6).join('-');

/** Every publication and peer-reviewed abstract, with a unique key (numbers in the data are not unique). */
export const allPubs: PubEntry[] = [
  ...publications.map((p, i) => ({ ...p, key: `p${i}-${slugify(p.title)}`, group: 'publication' as const, yearNum: yearNum(p.year) })),
  ...abstracts.map((p, i) => ({ ...p, key: `a${i}-${slugify(p.title)}`, group: 'abstract' as const, yearNum: yearNum(p.year) })),
];

export const KIND_LABEL: Record<PubKind, string> = {
  monograph: 'Monographs', chapter: 'Book chapters', edited: 'Edited volumes', journal: 'Journal papers',
  other_journal: 'Journal papers', conference: 'Conference proceedings', abstract: 'Peer-reviewed abstracts',
};
/** Display groups, in the order and lettering of the original site. */
export const KIND_GROUPS: { id: string; title: string; kinds: PubKind[]; color: string }[] = [
  { id: 'monograph', title: 'A. Monographs', kinds: ['monograph'], color: '#f5b942' },
  { id: 'chapter', title: 'B. Book chapters', kinds: ['chapter'], color: '#ff9f6b' },
  { id: 'edited', title: 'C. Edited books / volumes', kinds: ['edited'], color: '#ff6b9a' },
  { id: 'journal', title: 'D. Journal papers', kinds: ['journal', 'other_journal'], color: '#a78bfa' },
  { id: 'conference', title: 'E. Conference proceedings', kinds: ['conference'], color: '#38d9f5' },
  { id: 'abstract', title: 'F. Peer-reviewed abstracts', kinds: ['abstract'], color: '#6ee7b7' },
];
export const groupOf = (k: PubKind) => KIND_GROUPS.find(g => g.kinds.includes(k))!;

/** Theme tags are assigned by these transparent keyword rules over title + venue (case-insensitive).
 *  A publication can carry several themes; untagged publications are simply not in any theme. */
export const THEMES: { id: string; label: string; re: RegExp }[] = [
  { id: 'types', label: 'Type theory & proof assistants', re: /\btype[sd]?\b|type-theor|\bcoq\b|proof|\bmtt\b|\bttr\b|lambda|dependent|copredication|judgement/i },
  { id: 'nli', label: 'Inference & reasoning', re: /inference|\bnli\b|entailment|fracas|reasoning|logic/i },
  { id: 'nesy', label: 'Neuro-symbolic AI & LLMs', re: /neur|symbolic|\bllms?\b|language models?|\brag\b|gpt|bert|transformer|deep learning|machine learning/i },
  { id: 'greek', label: 'Greek & its dialects', re: /greek|dialect|cypriot|pontic|cretan|griko|grdd|oyxoy|heptan/i },
  { id: 'arabic', label: 'Arabic NLP', re: /arabic|shami|levantine/i },
  { id: 'dialogue', label: 'Dialogue & Dynamic Syntax', re: /dialog|dynamic syntax|dynamic account|interaction|utterance|incremental|completab/i },
  { id: 'prob', label: 'Probabilistic semantics', re: /probabilis|bayes/i },
  { id: 'syntax', label: 'Clitics & morphosyntax', re: /clitic|polydefinit|genitive|person restriction|syntax/i },
];
export const themesOf = (p: { title: string; venue?: string }) =>
  THEMES.filter(t => t.re.test(`${p.title} ${p.venue ?? ''}`)).map(t => t.id);

/** Venue families (regex over the venue string). */
export const VENUES: { id: string; label: string; re: RegExp }[] = [
  { id: 'jolli', label: 'J. Logic, Language & Information', re: /logic,? language,? and information|jolli/i },
  { id: 'acl', label: 'ACL Anthology venues', re: /\bacl\b|anthology|emnlp|naacl|eacl|coling|lrec|\*sem|iwcs|semdial|vardial|ranlp|nodalida|paclic|conll/i },
  { id: 'lacl', label: 'LACL / logic venues', re: /lacl|logical aspects|lenls|esslli|wollic|types\b/i },
  { id: 'cup-oup', label: 'CUP / OUP', re: /cambridge|\bcup\b|oxford|\boup\b/i },
  { id: 'csli', label: 'CSLI', re: /csli/i },
  { id: 'springer', label: 'Springer / LNCS', re: /springer|lncs|lecture notes/i },
  { id: 'frontiers', label: 'Frontiers', re: /frontiers/i },
  { id: 'arxiv', label: 'arXiv', re: /arxiv/i },
];
export const venueOf = (p: { venue?: string }) => VENUES.find(v => v.re.test(p.venue ?? ''))?.id ?? null;

export const bibtexFor = (pub: { title: string; authors: string; venue?: string; year: string; type: string }): string => {
  const year = yearOf(pub.year);
  const lastName = (pub.authors.split(',')[0] || 'chatzikyriakidis').trim().toLowerCase().replace(/[^a-z]/g, '');
  const firstWord = pub.title.match(/[A-Za-z]{4,}/)?.[0]?.toLowerCase() ?? 'work';
  const typeMap: Record<string, string> = { monograph: 'book', chapter: 'incollection', edited: 'book', journal: 'article', other_journal: 'article', conference: 'inproceedings', abstract: 'misc' };
  const entry = typeMap[pub.type] ?? 'misc';
  const lines = [
    `@${entry}{${lastName}${year}${firstWord},`,
    `  ${pub.type === 'edited' ? 'editor' : 'author'} = {${pub.authors}},`,
    `  title = {${pub.title}},`,
  ];
  if (pub.venue) {
    const field = entry === 'article' ? 'journal' : entry === 'book' ? 'publisher' : 'booktitle';
    lines.push(`  ${field} = {${pub.venue}},`);
  }
  lines.push(`  year = {${year}}`, '}');
  return lines.join('\n');
};

const norm = (s: string) => s.toLowerCase().replace(/\\'/g, "'").replace(/[^a-z0-9]+/g, ' ').trim();
/** Resolve a title (e.g. from the research areas) to the publication actually listed on the site. */
export function resolveTitle(title: string): PubEntry | null {
  const t = norm(title);
  return allPubs.find(p => norm(p.title) === t)
    ?? allPubs.find(p => norm(p.title).startsWith(t.slice(0, 40)) || t.startsWith(norm(p.title).slice(0, 40)))
    ?? null;
}

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    try {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    } catch { return false; }
  }
}
