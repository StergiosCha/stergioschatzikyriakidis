// Foundational projects. Every fact here is taken from a file in the author's Dropbox; the path is in `source`.
export interface ProjectLink { label: string; href: string }
export interface FoundationalProject {
  id: string; name: string; kicker: string; summary: string; facts: string[];
  links: ProjectLink[]; tags: string[]; source: string; needsConfirmation?: string; bibtex?: string;
}

export const svarnaProject: FoundationalProject = {
  id: 'svarna', name: 'Svarna', kicker: 'Greek Corpus Workbench · open source',
  summary: 'A free, open-source, web-based corpus workbench for Modern Greek. Five databases (institutional, literary, dialectal, social media and historical) in one interface that needs no login, installation or specialised training.',
  facts: [
    'KWIC concordancer, register-normalised frequencies, collocations by mutual information',
    'A dictionary of 93 Greek discourse markers with distribution profiles',
    'Register comparison by log-ratio, n-grams, regex search, optional LLM layer for pragmatic annotation',
    'SQLite FTS5 indexes behind a FastAPI backend, Docker on Azure, MIT licence',
  ],
  links: [
    { label: 'Open the workbench', href: 'https://greek-corpus-workbench.wonderfulhill-e1c9f1a0.westeurope.azurecontainerapps.io' },
    { label: 'arXiv:2607.00970', href: 'https://arxiv.org/abs/2607.00970' },
    { label: 'GitHub', href: 'https://github.com/StergiosCha/SVARNA_CORPUS_APP' },
  ],
  tags: ['KWIC', 'Keyness', 'Discourse markers', 'LLM analysis'],
  source: 'Dropbox/svarna_arxiv_submission.zip (svarna_arxiv.tex: abstract + Table 1); app/src/data/liveApps.ts; app/src/data/news.ts',
  bibtex: `@misc{chatzikyriakidis2026svarna,
  title  = {Svarna: An Open Corpus Workbench for Modern Greek},
  author = {Chatzikyriakidis, Stergios},
  year   = {2026},
  eprint = {2607.00970},
  archivePrefix = {arXiv},
  url    = {https://arxiv.org/abs/2607.00970}
}`
};

export const atlasProject: FoundationalProject = {
  id: 'atlas', name: 'Formal Atlas of Semantics', kicker: 'Mechanised semantics · Coq / Rocq',
  summary: 'What must be made explicit, assumed or added to mechanise a semantic theory, and what changes when different choices are made? The atlas connects a 230-source survey with Coq implementations, source-to-code audits, checked comparisons and countermodels.',
  facts: [
    'Two separate axes: P0–P5 intrinsic formality of a source, F0–F5 project evidence',
    'Checked proofs concern explicitly scoped encodings, not whole-source verification',
    'Comparisons are scoped evidence profiles, not a theoretical similarity score',
    'Tested toolchain Coq 8.20.1; MIT licence',
  ],
  links: [
    { label: 'Explore the atlas', href: 'https://orange-beach-0c447e210.5.azurestaticapps.net' },
    { label: 'GitHub', href: 'https://github.com/StergiosCha/formal_atlas_of_semantics' },
  ],
  tags: ['Coq', 'Montague', 'MTT', 'TTR', 'DisCoCat'],
  source: 'Dropbox/revisiting-formal-semantics/README.md, CITATION.cff, atlas_data/atlas.json',
  bibtex: `@software{chatzikyriakidis_formal_atlas,
  title   = {Formal Atlas of Semantics},
  author  = {Chatzikyriakidis, Stergios},
  license = {MIT},
  url     = {https://github.com/StergiosCha/formal_atlas_of_semantics},
  note    = {Cite with the exact Git commit used}
}`
};

export const lingembedProject: FoundationalProject = {
  id: "lingembed", name: "LingEmbed", kicker: "Research programme · COLING 2027 workshop",
  summary: "LingEmbed studies how the structures of formal linguistics (categories, types, λ-terms, dependency arcs, semantic graphs) can be written into vector spaces and neural networks, and how they can be read back out of them.",
  facts: [
    "Research programme. Planned components: theory encoders, an embedding library (TPR, typed-tensor and tree-metric embeddings), a probing suite and benchmarks",
    "Workshop: Theories Under Pressure: Embedding Linguistic Frameworks in Neural Models. First workshop at COLING 2027, Macau, 9–14 May 2027; papers due 5 January 2027",
    "Workshop organisers: Stergios Chatzikyriakidis and Emmanuele Chersoni (The Hong Kong Polytechnic University)",
  ],
  links: [
    { label: "Research programme", href: "https://stergioscha.github.io/LingEmbed/" },
    { label: "2027 workshop (proposal)", href: "https://stergioscha.github.io/LingEmbed-workshop/" },
    { label: "GitHub", href: "https://github.com/StergiosCha/LingEmbed" },
  ],
  tags: ["Neuro-symbolic", "Structural probes", "TPR"],
  source: "Lead-agent instruction (round 2: two URLs, title, status); Dropbox/LingEmbed/README.md; LingEmbed index.html (lede and roadmap)",
  needsConfirmation: "Workshop remains a proposal; no venue/date given.",
};

export const codagProject: FoundationalProject = {
  id: 'codag', name: 'CoDAG', kicker: 'Computational Dialectal Atlas of Greek',
  summary: 'Funding from Microsoft’s LINGUA project supported CoDAG, making Svarna, GPT-4.1 fine-tuning and the Greek NLP Swiss Knife possible. The dialectal database of Svarna draws on the GRDD+ collection.',
  facts: [],
  links: [
    { label: 'Dialect Generator', href: 'https://dialect-gen-cpu.blackplant-0f676054.westeurope.azurecontainerapps.io' },
    { label: 'GRDD corpus', href: 'https://github.com/StergiosCha/Greek_dialect_corpus' },
  ],
  tags: ['GRDD+', 'Dialect LLMs', 'LoRA'],
  source: 'app/public/teaching/clarin-2026/funding_acknowledgment.md; svarna_arxiv.tex Table 1 (dialectal rows); app/src/data/tools.ts',
};

export const svarnaLabUrl = 'https://stergioscha.github.io/svarna/'; // Dropbox/site/svarna/index.html canonical URL
