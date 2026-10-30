// Source: Table "Overview of the five Svarna databases" in svarna_arxiv.tex
// (Dropbox/svarna_arxiv_submission.zip; preprint arXiv:2607.00970). Numbers copied verbatim.
export interface SubCorpus { name: string; sentences: number; words: number }
export interface SvarnaDatabase { id: 'corpus' | 'literature' | 'dialectal' | 'social' | 'historical'; label: string; parts: SubCorpus[] }

export const svarnaDatabases: SvarnaDatabase[] = [
  { id: 'corpus', label: 'Institutional & general', parts: [
    { name: 'CC-100 (web)', sentences: 5000000, words: 112135259 },
    { name: 'Wikipedia (encyc.)', sentences: 4739089, words: 67569423 },
    { name: 'Europarl (instit.)', sentences: 1589886, words: 39342006 },
    { name: 'OPUS WikiMatrix', sentences: 2000000, words: 39317133 },
    { name: 'OPUS EUbookshop', sentences: 2000000, words: 36233670 },
    { name: 'OPUS ParaCrawl', sentences: 2000000, words: 31004648 },
    { name: 'Parliament (political)', sentences: 198850, words: 24561364 },
    { name: 'Leipzig news 2020', sentences: 1000000, words: 19075841 },
    { name: 'Leipzig newscrawl 2011', sentences: 999996, words: 19743123 },
    { name: 'Leipzig newscrawl 2017', sentences: 1000000, words: 19452653 },
    { name: 'Leipzig wikipedia 2016', sentences: 1000000, words: 18903388 },
    { name: 'Leipzig wikipedia 2021', sentences: 1000000, words: 18060085 },
    { name: 'OPUS CCAligned (web)', sentences: 2000000, words: 17370501 },
    { name: 'OpenSubtitles (dialogue)', sentences: 2000000, words: 10053036 },
    { name: 'UD Greek-GDT', sentences: 2521, words: 55633 },
    { name: 'UD Greek-GUD', sentences: 1807, words: 20536 },
  ] },
  { id: 'literature', label: 'Literary', parts: [
    { name: 'Gutenberg', sentences: 562432, words: 8227594 },
    { name: 'BabyLM', sentences: 1049266, words: 10177729 },
    { name: 'Poetry (interwar)', sentences: 4087, words: 110823 },
    { name: 'Tesserae (Anc. Greek)', sentences: 310928, words: 8131811 },
  ] },
  { id: 'dialectal', label: 'Dialectal (GRDD+)', parts: [
    { name: 'Cretan', sentences: 150000, words: 1600000 },
    { name: 'Cypriot', sentences: 120000, words: 1300000 },
    { name: 'Pontic', sentences: 80000, words: 900000 },
    { name: 'Northern', sentences: 60000, words: 650000 },
    { name: 'Eptanisian', sentences: 40000, words: 450000 },
    { name: 'Tsakonian', sentences: 35000, words: 400000 },
    { name: 'Maniot', sentences: 25000, words: 250000 },
    { name: 'Griko', sentences: 20000, words: 200000 },
    { name: 'Katharevousa', sentences: 12935, words: 148147 },
  ] },
  { id: 'social', label: 'Social media', parts: [
    { name: 'Twitter (non-toxic)', sentences: 58294, words: 1222768 },
    { name: 'Twitter (toxic)', sentences: 30389, words: 674936 },
  ] },
  { id: 'historical', label: 'Historical / folkloric', parts: [
    { name: 'CLARIN Crete (13 colls.)', sentences: 3599, words: 117004 },
  ] },
];

/** Totals as printed in the paper's table; the visual recomputes the sum and checks it against these. */
export const svarnaReportedTotal = { sentences: 29094079, words: 507459111 };
