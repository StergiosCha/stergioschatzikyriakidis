// English UI and section strings (source for the Greek translation; see el.google.ts and el.ts).
// Data-derived strings (project cards, research areas, Svarna databases) are generated from the data
// modules below so the English text exists in exactly one place.
import { svarnaProject, atlasProject, lingembedProject, codagProject } from '../data/projects';
import { researchAreas } from '../data/researchAreas';
import { svarnaDatabases } from '../data/svarnaCorpus';

const base = {
  // navigation & chrome
  'nav.projects': 'Projects', 'nav.about': 'About', 'nav.research': 'Research', 'nav.publications': 'Publications',
  'nav.talks': 'Talks', 'nav.software': 'Software', 'nav.demos': 'Live demos', 'nav.teaching': 'Teaching',
  'nav.news': 'News', 'nav.contact': 'Contact', 'nav.cv': 'CV', 'nav.downloadCv': 'Download CV', 'nav.menu': 'menu',
  'nav.openMenu': 'Open navigation menu', 'nav.closeMenu': 'Close navigation menu', 'nav.main': 'Main navigation',
  'nav.drawer': 'Navigation menu', 'nav.role': 'Director of Research (Researcher A)', 'nav.org': 'ILSP, Athena Research Centre',
  'nav.lang': 'Language', 'skip': 'Skip to content',
  // hero
  'name.first': 'Stergios', 'name.last': 'Chatzikyriakidis', 'name.full': 'Stergios Chatzikyriakidis',
  'hero.eyebrow': 'computational linguistics · formal semantics · neuro-symbolic AI',
  'hero.lede.a': 'Working at the intersection of', 'hero.lede.sym': 'linguistics, logic and machine learning,', 'hero.lede.b': 'and their interaction with',
  'hero.lede.neu': 'large language models', 'hero.lede.c': ': neurosymbolic NLP, reasoning in natural language, LLM evaluation, computational dialectology and low-resource varieties.',
  'hero.role1': 'Director of Research (Researcher A), Institute for Language and Speech Processing, Athena Research Centre',
  'hero.role2': 'Associate Researcher, Centre for Linguistic Theory and Studies in Probability (CLASP)',
  'hero.ctaOutputs': 'View research outputs', 'hero.ctaCv': 'Download CV', 'hero.ctaProjects': 'Foundational projects',
  'hero.legend.formal': 'language', 'hero.legend.proof': 'logic', 'hero.legend.neural': '(machine) learning',
  'hero.legend.aria': 'Language, logic and machine learning, each informing the others', 'hero.applied': 'applied to:',
  'hero.chip.dialect': 'dialectal NLP', 'hero.chip.llm': 'LLM reasoning', 'hero.chip.nli': 'natural language inference',
  'hero.chip.distance': 'linguistic distance', 'hero.chip.dh': 'digital humanities', 'hero.chip.dialogue': 'dialogue',
  'hero.stat.pubs': 'publications', 'hero.stat.talks': 'talks & posters', 'hero.stat.apps': 'live apps', 'hero.stat.years': 'publishing',
  // projects section
  'projects.kicker': 'foundational projects', 'projects.title.a': 'Infrastructure for', 'projects.title.greek': 'Greek',
  'projects.title.b': 'and for', 'projects.title.formal': 'formal meaning',
  'projects.intro': 'Open, running systems that other work builds on.',
  'projects.explore.open': 'Explore the full pipeline: neural encoder and tensor-product binding',
  'projects.explore.close': 'Close the full pipeline', 'projects.lab.aria': 'LingEmbed lab: symbolic, embedding and neural pipeline with tensor-product binding',
  // about
  'bio.kicker': 'about', 'bio.title': 'Background',
  'bio.p1.a': 'I am Director of Research (Researcher A) at the Institute for Language and Speech Processing (ILSP), Athena Research Centre, Athens, and I lead',
  'bio.p1.b': ', an independent lab for neuro-symbolic NLP. I am also Head of Research at MuVeS AI and founder of SimasiaAI. My work lies at the intersection of NLP, formal semantics and type theory, the reasoning and evaluation of large language models, computational dialectology and low-resource varieties.',
  'bio.p2': "I hold an MSc in Computational Linguistics and Formal Grammar and a PhD in Linguistics, both from King's College, London, after a BA in Greek Philology from Aristotle University, Thessaloniki. I have worked at Royal Holloway, CNRS, the Open University of Cyprus and the University of Gothenburg, where I was Associate Director of CLASP from 2016 to 2021. From 2021 to 2026 I was Professor of Computational Linguistics at the University of Crete.",
  'bio.scholar': 'Google Scholar', 'bio.novelist': 'I am also a novelist.', 'bio.seeHere': 'See here',
  // research
  'research.kicker': 'research', 'research.title': 'Research interests',
  'research.p1': 'My research interests lie at the intersection of Natural Language Processing (NLP), Neuro-Symbolic AI, and Theoretical Linguistics. My work spans Natural Language Inference, Dialogue Modelling, Retrieval-Augmented Generation (RAG)-assisted LLM generation, Semantic Parsing, Sentiment Analysis, Metaphor Detection, Formal Semantics and Syntax, Interactive Theorem Proving for natural language semantics, Computational Dialectology, Constructive Type-Theoretical Semantics and their computational implementation.',
  'research.p2': 'I also work on Probabilistic Semantics, developing NLP resources for under-resourced languages, and exploring the interaction between symbolic logic-based approaches and Machine Learning/Deep Learning methods for linguistic problems.',
  'research.cta': 'See selected publications', 'research.fig': 'Zeugma: neuro-symbolic reasoning over LLM-generated knowledge graphs',
  'research.figAlt': 'Zeugma Neuro-Symbolic Reasoning System', 'research.eyebrow': 'interactive · research landscape',
  'net.title': 'RESEARCH NETWORK', 'net.sub': '{a} areas · {c} connections · {s} software systems',
  'net.aria': 'Research network; select an area to see its publications and software',
  'net.formal': 'Formal', 'net.bridge': 'Bridge', 'net.computational': 'Computational', 'net.software': 'software', 'net.notInList': 'not in list', 'net.connected': 'connected areas',
  'net.nodeAria': '{label}, {n} key publications',
  // software
  'software.kicker': 'software', 'software.title.a': 'Software, Apps', 'software.title.b': '& Datasets',
  'software.p1': 'I build resources for under-resourced languages and neural-symbolic NLP: dialect identification, NLI benchmarks, dialogue systems, and RAG-assisted pipelines—often with a focus on Greek and dialectal varieties.',
  'software.p2.a': 'These include the', 'software.p2.b': 'portal, AI research assistants, classical philology platforms, text editors with grammatical analysis, linguistic distance calculators, and comprehensive datasets for Greek dialectology and natural language inference.',
  'software.cat.application': 'software systems', 'software.cat.dataset': 'datasets', 'software.cat.code': 'code libraries', 'software.cat.model': 'fine-tuned models',
  'software.explore': 'Explore tools', 'software.datasets': 'View datasets', 'software.alt': 'Software tools and platforms collage',
  // novelist
  'novel.kicker': 'beyond academia', 'novel.kickerB': 'fiction', 'novel.title': 'Novelist',
  'novel.text': 'Beyond academia, I write fiction. I have published four novels in Greek and three short story collections (one in English).',
  'novel.cta': 'Visit my literary site', 'novel.alt': 'Book covers',
  // demos
  'demos.kicker': 'interactive', 'demos.title': 'Live demos',
  'demos.intro': 'These are not screenshots. Every tool below is deployed and running right now — try the embedded workbench directly, or launch any app in a new tab.',
  'demos.full': 'Open full screen', 'demos.failed': "The live app didn't load here — it may be waking up from a cold start.",
  'demos.newTab': 'Launch in a new tab', 'demos.retry': 'Retry', 'demos.waking': 'Waking up the corpus workbench…',
  'demos.paper': 'Read the paper (arXiv:2607.00970)', 'demos.live': 'live', 'demos.launch': 'Launch', 'demos.code': 'Code',
  // teaching
  'teach.kicker': 'learn with the tools', 'teach.title': 'Teaching & workshops',
  'teach.intro': 'Texts to investigate, methods to question and examples to work through. Explore the material in your browser or download it for your own teaching.',
  'teach.event': 'CLARIN:EL Summer School · 24 September 2026',
  'teach.desc': 'A talk and hands-on workshop for digital humanities. Move from Greek poetry and emotion analysis to historical knowledge graphs, corpus exploration and dialect generation. Inspect the prompts, the returned answers and the evidence.',
  'teach.open': 'Open interactive workshop', 'teach.all': 'All workshop materials',
  'teach.act.h': 'Work through eleven activities', 'teach.act.p': 'Complete texts, copyable prompts, saved outputs, interactive graphs and links to the existing apps.',
  'teach.keep.h': 'Keep the material', 'teach.keep.p': 'Both slide decks, complete worked examples and an offline workshop bundle.', 'teach.downloads': 'Browse downloads',
  // outputs
  'out.kicker': 'research outputs', 'out.tab.publications': 'Publications', 'out.tab.talks': 'Talks & presentations', 'out.tab.software': 'Software & datasets',
  'out.intro.publications': 'Complete list of academic publications including monographs, book chapters, journal papers, and conference proceedings.',
  'out.intro.talks': 'Invited talks, conference and workshop presentations, and poster sessions.',
  'out.intro.software': 'Software systems, tools, datasets, and code libraries.', 'out.tabsAria': 'Research outputs',
  'out.chart.pubs': 'publications per year · click a year to filter', 'out.chart.talks': 'talks per year · click a year to filter',
  'out.search': 'Search title, author, venue…', 'out.searchAria': 'Search publications', 'out.clearSearch': 'Clear search',
  'out.allYears': 'All years', 'out.yearAria': 'Filter by year', 'out.allVenues': 'All venues', 'out.venueAria': 'Filter by venue',
  'out.typeAria': 'Filter by type', 'out.themeAria': 'Filter by theme', 'out.count': '{n} of {total} entries',
  'out.clear': 'clear filters', 'out.copyAll': 'Copy {n} as BibTeX', 'out.copied': 'Copied',
  'out.none': 'No publications match your search.',
  'out.pdf': 'PDF', 'out.link': 'Link', 'out.bibtex': 'BibTeX', 'out.show': 'show .bib', 'out.hide': 'hide .bib', 'out.copyAria': 'Copy BibTeX for {t}',
  'out.talkSearch': 'Search talks…', 'out.talkSearchAria': 'Search talks',
  'out.talk.invited': 'Invited talks', 'out.talk.conference': 'Conference / workshop presentations', 'out.talk.posters': 'Posters',
  'out.talkCat.invited': 'Invited talks', 'out.talkCat.conference': 'Conference / workshop', 'out.talkCat.poster': 'Posters',
  'out.sw.application': 'Software systems', 'out.sw.code': 'Code & libraries', 'out.sw.dataset': 'Datasets', 'out.sw.model': 'Fine-tuned models',
  'out.platform': 'Platform', 'out.github': 'GitHub',
  'kind.monograph': 'Monographs', 'kind.chapter': 'Book chapters', 'kind.edited': 'Edited books / volumes', 'kind.journal': 'Journal papers',
  'kind.conference': 'Conference proceedings', 'kind.abstract': 'Peer-reviewed abstracts',
  'theme.types': 'Type theory & proof assistants', 'theme.nli': 'Inference & reasoning', 'theme.nesy': 'Neuro-symbolic AI & LLMs',
  'theme.greek': 'Greek & its dialects', 'theme.arabic': 'Arabic NLP', 'theme.dialogue': 'Dialogue & Dynamic Syntax',
  'theme.prob': 'Probabilistic semantics', 'theme.syntax': 'Clitics & morphosyntax', 'chart.aria': '{label} per year, {a} to {b}', 'chart.bar': '{y}: {n} {label}',
  // news & contact
  'news.kicker': 'latest', 'news.title': 'Latest news',
  'news.type.paper': 'paper', 'news.type.talk': 'talk', 'news.type.software': 'software', 'news.type.general': 'general', 'news.type.award': 'award', 'news.type.event': 'event',
  'contact.kicker': 'get in touch', 'contact.title': 'Contact', 'contact.l1': 'Institute for Language and Speech Processing',
  'contact.l2': 'Athena Research Centre', 'contact.l3': 'Athens', 'contact.l4': 'Greece', 'contact.send': 'Send email',
  // visual: Svarna
  'sv.words': 'words', 'sv.sentences': 'sentences', 'sv.databases': 'databases', 'sv.subcorpora': 'sub-corpora',
  'sv.composition': 'register composition', 'sv.log': 'log', 'sv.linear': 'linear',
  'sv.scaleAria': 'Bar scale', 'sv.barAria': 'Svarna databases; select one to see its sub-corpora', 'sv.segAria': '{label}: {w} words, {p} percent',
  'sv.subs': '{label} · {n} sub-corpora', 'sv.wpsHere': 'words / sentence here', 'sv.wpsAll': 'words / sentence overall',
  // visual: Formal Atlas
  'at.sources': 'surveyed sources', 'at.records': 'Coq records', 'at.theorems': 'theorems', 'at.proved': 'proved ({n} admitted)',
  'at.graphTitle': 'CHECKED COMPARISONS', 'at.graphSub': 'layout = classical MDS of hop distance · not a similarity score',
  'at.graphAria': 'Comparison graph of {n} formal frameworks with {e} checked comparisons', 'at.edgeAria': '{a} and {b}, {level}, {n} graded phenomena', 'at.thm': '{n} thm', 'at.outside': 'outside atlas/', 'at.outsideAria': 'outside the atlas layer',
  'at.level.intra-family': 'intra-family', 'at.level.cross-family': 'cross-family', 'at.level.cross-foundation': 'cross-foundation',
  'at.grades': 'Grades: 5 definitional · 4 equivalence · 3 one-way or mediated · 2 divergent · 1 after re-encoding · — one side only',
  'at.selected': 'selected comparison · {level}', 'at.bridge': 'bridge:',
  'at.pf': 'sources by intrinsic formality (P) × project evidence (F)', 'at.pfCaption': 'Cross-tabulation of {n} surveyed sources by formality grade and evidence level',
  'at.F0': 'surveyed', 'at.F1': 'sourced', 'at.F2': 'designed', 'at.F3': 'piloted', 'at.F4': 'formalized', 'at.F5': 'verified / connected',
  'at.P0': 'discursive', 'at.P1': 'systematic prose', 'at.P2': 'semi-formal', 'at.P3': 'formal fragments', 'at.P4': 'full formal system', 'at.P5': 'machine-checked',
  // visual: LingEmbed
  'le.symbolic': 'SYMBOLIC', 'le.embedding': 'EMBEDDING', 'le.neural': 'NEURAL', 'le.analysis': '{t} analysis',
  'le.encoder': 'tanh encoder · 8 → 8 → 8 → 4', 'le.exact': 'exact in {d}D · top-2 PCs shown ({p}% var.)',
  'le.theoryAria': 'Linguistic theory', 'le.svgAria': '{t}: analysis of "every student reads a book" and its exact tree-metric embedding',
  'le.labAria': 'Pipeline for {t}: symbolic analysis, embedding, neural encoder. Focus a node to follow it.',
  'le.selected': 'selected node', 'le.role': 'role', 'le.dtree': 'd_tree to others', 'le.output': 'encoder output', 'le.theory': 'theory',
  'le.geom': 'geometry check', 'le.nodes': 'nodes', 'le.dims': 'embedding dims (exact)', 'le.err': 'max |‖Δh‖² − d_tree|', 'le.var': 'variance in 2-D view',
  'le.pipelineEyebrow': 'one sentence, five theories, one geometry', 'le.bindEyebrow': 'tensor-product binding',
  'le.bind.p1': "Smolensky's tensor product representations bind each filler (a word or concept) to a role (its structural position) with an outer product, then sum the bindings:",
  'le.bind.p2': 'If the roles are orthonormal, unbinding', 'le.bind.p3': 'returns', 'le.bind.p4': 'exactly. Turn orthonormality off to see crosstalk. Fillers and roles come from the {t} analysis above.',
  'le.bindings': 'Bindings', 'le.pairs': '({n} filler ⊗ role pairs)', 'le.ortho': 'orthonormal roles (Gram–Schmidt)', 'le.superposition': 'Superposition',
  'le.heatAria': 'Heat map of the 6 by 6 superposition matrix T', 'le.unbind': 'Unbind a role', 'le.roleAria': 'Role to unbind',
  'le.nearest': 'nearest filler:', 'le.recovered': 'recovered û', 'le.trueFiller': 'true filler', 'le.cosines': 'cosine(û, f) for every filler',
  // visual: dialects, loading
  'dia.title': 'Svarna dialectal database · {n} rows · {w} words',
  'load.loading': 'loading {label}…', 'load.failed': 'This visual could not be loaded. Reload the page to try again.',
};

const fromData: Record<string, string> = {};
for (const p of [svarnaProject, atlasProject, lingembedProject, codagProject]) {
  fromData[`proj.${p.id}.kicker`] = p.kicker;
  fromData[`proj.${p.id}.summary`] = p.summary;
  p.facts.forEach((f, i) => { fromData[`proj.${p.id}.fact${i}`] = f; });
  p.links.forEach((l, i) => { fromData[`proj.${p.id}.link${i}`] = l.label; });
}
for (const a of researchAreas) { fromData[`area.${a.id}.label`] = a.label; fromData[`area.${a.id}.desc`] = a.description; }
for (const d of svarnaDatabases) fromData[`db.${d.id}`] = d.label;

export const en: Record<string, string> = { ...base, ...fromData };
