// Research areas of the site (moved verbatim from components/ResearchMap.tsx).
export interface AreaPublication {
  number: number;
  title: string;
}

export interface ResearchArea {
  id: string;
  label: string;
  methodology: 'computational' | 'formal' | 'bridge';
  description: string;
  publications: AreaPublication[];
  software?: string[];
  connections: string[];
}

// Copied from the original ResearchMap.tsx. The `number` fields are the original ones and do NOT all
// match publications.ts; the site resolves each entry by title instead (see resolveTitle in lib/pubs.ts).
export const researchAreas: ResearchArea[] = [
  {
    id: 'dl-nlu',
    label: 'Deep Learning, NLU, Explainability & Neuro-Symbolic Systems',
    methodology: 'computational',
    description: 'NLI evaluation, annotation artifacts, neuro-symbolic integration with Coq, LLM critique and explanation, the ELOQUENT Fragments task (CLEF 2027).',
    publications: [
      { number: 15, title: 'Neural-Symbolic NLP: Bridging Theory and Practice' },
      { number: 30, title: 'Neuro-Symbolic NLP: Taxonomy, Assessment, and Directions' },
      { number: 46, title: 'Natural Language Inference in Coq' },
      { number: 57, title: 'Zeugma: A Neuro-Symbolic System for Reasoning Over LLM-Generated Knowledge Graphs' },
      { number: 63, title: 'Reverse Engineering NLI: A study of the meta-inferential properties of Natural Language Inference' },
      { number: 86, title: 'A Wide-Coverage Symbolic Natural Language Inference System' },
      { number: 87, title: 'Testing the Generalization Power of Neural Network Models Across NLI Benchmarks' },
      { number: 89, title: 'What kind of Natural Language Inference are NLP systems learning: Is this enough?' },
      { number: 95, title: 'A Type-Theoretical System for the FraCaS Test Suite: Grammatical Framework Meets Coq' },
      { number: 70, title: 'How Does Data Corruption Affect Natural Language Understanding Models? A Study on GLUE datasets' },
      { number: 77, title: 'NLI Data Sanity Check: Assessing the Effect of Data Corruption on Model Performance' },
      { number: 96, title: 'An Overview of Natural Language Inference Data Collection: The Way Forward?' },
    ],
    software: ['MEDEA', 'RAG-to-Coq', 'DI_detector'],
    connections: ['rag', 'greek-nlp', 'type-theory', 'digital-humanities'],
  },
  {
    id: 'greek-nlp',
    label: 'NLP for Greek, its Dialects & Under-Resourced Languages',
    methodology: 'computational',
    description: 'GRDD/GRDD+ dialect datasets, OYXOY/SuperOYXOY benchmarks, Krikri models, dialect identification.',
    publications: [
      { number: 62, title: 'GRDD: A Dataset for Greek Dialectal NLP' },
      { number: 61, title: 'GRDD+: An Extended Greek Dialectal Dataset with Cross-Architecture Fine-tuning Evaluation' },
      { number: 68, title: 'OYXOY: A Modern NLP Test Suite for Modern Greek' },
      { number: 60, title: 'Perplexity as a Metric for Dialectal Distance: A Computational Study of Greek Varieties' },
      { number: 72, title: 'Fine-grained Entailment: Resources for Greek NLI and Precise Entailment' },
    ],
    software: ['DI_detector'],
    connections: ['dl-nlu', 'arabic', 'formal-syntax', 'digital-humanities'],
  },
  {
    id: 'arabic',
    label: 'NLP for Arabic Dialects & Language Distance Models',
    methodology: 'computational',
    description: 'Shami corpus, ATSAD sentiment analysis, computational dialectometry, language distance frameworks.',
    publications: [
      { number: 90, title: 'A Lexical Distance Study of Arabic Dialects' },
      { number: 71, title: 'Pre-trained models or Feature Engineering? The Case of Dialectal Arabic' },
      { number: 54, title: 'Italian and Turkish loanwords detection in Greek dialects' },
    ],
    software: ['Dialect Analyzer', 'Distance Calculator'],
    connections: ['greek-nlp', 'formal-syntax'],
  },
  {
    id: 'rag',
    label: 'RAG & Knowledge-Enhanced LLMs',
    methodology: 'bridge',
    description: 'MEDEA-NEUMOUSA for classical philology, RAG-to-Coq verification, TextCraft, poetry generation.',
    publications: [
      { number: 113, title: 'Reasoning with RAGged events: RAG-Enhanced Event Knowledge Base Construction and reasoning with proof-assistants' },
      { number: 59, title: 'LLMs Got Rhyme? Hybrid Phonological Filtering for Greek Poetry Rhyme Detection and Generation' },
      { number: 65, title: 'Poetry in RAGs: Modern Greek interwar poetry generation using RAG and contrastive training' },
      { number: 58, title: 'HeptaTAX: A Neuro-Symbolic Pipeline and Benchmark for Classifying 16th-Century Heptanesian Notarial Acts' },
      { number: 57, title: 'Zeugma: A Neuro-Symbolic System for Reasoning Over LLM-Generated Knowledge Graphs' },
    ],
    software: ['MuVeS', 'Plot Analyzer', 'MEDEA', 'TextCraft', 'RAG-to-Coq'],
    connections: ['dl-nlu', 'type-theory', 'digital-humanities'],
  },
  {
    id: 'type-theory',
    label: 'Type-Theoretic Semantics & Proof Assistants',
    methodology: 'formal',
    description: 'Martin-Löf Type Theory for NL semantics, Coq for adjectives, adverbs, copredication, coordination.',
    publications: [
      { number: 4, title: 'Formal Semantics in Modern Type Theories' },
      { number: 2, title: 'Theories of Types and the Structure of Meaning' },
      { number: 46, title: 'Natural Language Inference in Coq' },
      { number: 42, title: 'Adjectival/adverbial modification: The view from modern type theories' },
      { number: 32, title: 'Dependent Types and Continuations' },
      { number: 100, title: 'Natural Language Reasoning Using Coq: Interaction and Automation' },
      { number: 106, title: 'Natural Language Reasoning Using Proof Technology: Rich Typing and Beyond' },
    ],
    software: ['Coq for NL Semantics'],
    connections: ['dl-nlu', 'rag', 'bayesian', 'dialogue', 'formal-syntax'],
  },
  {
    id: 'bayesian',
    label: 'Probabilistic & Bayesian Semantics',
    methodology: 'formal',
    description: 'Bayesian Inference Semantics, predicates-as-boxes, compositional pragmatics, Monte Carlo, Haskell.',
    publications: [
      { number: 10, title: 'Bayesian Inference Semantics for Natural Language' },
      { number: 9, title: 'Introduction to Probabilistic Approaches to Linguistic Theory' },
      { number: 34, title: 'A Computational Treatment of Anaphora and its Algorithmic Implementation' },
      { number: 88, title: 'Bayesian Inference Semantics: A Modelling System and A Test Suite' },
      { number: 75, title: 'From Compositional Semantics to Bayesian Pragmatics via Logical Inference' },
      { number: 80, title: 'How does Punctuation Affect Neural Models in Natural Language Inference' },
    ],
    connections: ['type-theory'],
  },
  {
    id: 'digital-humanities',
    label: 'AI for Digital Humanities',
    methodology: 'bridge',
    description: 'Plot Analyzer for narrative, MEDEA for classical texts, NATS text analysis, ontology extraction.',
    publications: [
      { number: 55, title: 'GeoAffect: A Multi-Layer Annotation Schema and Few-Shot LLM Evaluation for Geoaffective Analysis of Literary Texts' },
      { number: 58, title: 'HeptaTAX: A Neuro-Symbolic Pipeline and Benchmark for Classifying 16th-Century Heptanesian Notarial Acts' },
      { number: 66, title: 'Literary Translation and Electronic Text Corpus: Compilation and processing of a parallel diachronic French-Greek literary corpus' },
    ],
    software: ['Plot Analyzer', 'MEDEA', 'NATS'],
    connections: ['rag', 'greek-nlp', 'dl-nlu'],
  },
  {
    id: 'dialogue',
    label: 'Dialogue Modelling & Incremental Processing',
    methodology: 'computational',
    description: 'Split utterances, fragmentary answers, afterthoughts, shared utterances, Dynamic Syntax, DNLI.',
    publications: [
      { number: 1, title: 'Dialogical Interaction, Types, and the Structure of Meaning' },
      { number: 120, title: 'Constructive Dynamic Syntax' },
      { number: 43, title: 'Afterthoughts in Greek: Gender Mismatches Under a Dynamic Framework' },
      { number: 67, title: 'I hea- umm think that\'s what they say: A Dataset of Inferences from Natural Language Dialogues' },
      { number: 36, title: 'Completability vs (In)completeness' },
    ],
    connections: ['type-theory', 'formal-syntax', 'music'],
  },
  {
    id: 'formal-syntax',
    label: 'Formal Syntax of Greek, Dialects & Diachronic Linguistics',
    methodology: 'formal',
    description: 'Clitic systems (Cypriot, Griko, Pontic, Northern Greek), Dynamic Syntax, PCC, polydefinites.',
    publications: [
      { number: 47, title: 'A Dynamic Account of the Cypriot Greek Clitic Positioning system' },
      { number: 39, title: 'The Bantu/Romance/Greek Connection Revisited: Processing Constraints in Auxiliary and Clitic Placement from a Cross-linguistic Perspective' },
      { number: 49, title: 'Clitics in Grecia Salentina Greek: A Dynamic account' },
      { number: 48, title: 'Standard Modern and Pontic Greek Person Restrictions: A feature-free Dynamic Account' },
      { number: 27, title: 'Polydefinites as Markers of Prominence: A Unified Analysis of Greek Polydefinites' },
    ],
    connections: ['greek-nlp', 'arabic', 'type-theory', 'dialogue', 'music'],
  },
  {
    id: 'music',
    label: 'Music & Language: Shared Processing Strategies',
    methodology: 'formal',
    description: 'Polyrhythm processing, shared parsing mechanisms, Dynamic Syntax for music-language interaction.',
    publications: [
      { number: 13, title: 'Underspecification Restrictions in Polyrhythmic processing' },
    ],
    connections: ['dialogue', 'formal-syntax'],
  },
];

