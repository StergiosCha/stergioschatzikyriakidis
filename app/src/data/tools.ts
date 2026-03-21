export interface Tool {
  name: string;
  description: string;
  platformUrl?: string | null;
  githubUrl?: string | null;
  category: 'application' | 'dataset' | 'code';
}

export const tools: Tool[] = [
  // Software Systems (from CV)
  {
    name: "MuVeS",
    description: "AI research assistant platform for paper discovery, automated literature reviews, interactive chat, paper analysis. Role: One of three main developers.",
    platformUrl: "https://muves.io",
    githubUrl: null,
    category: "application"
  },
  {
    name: "MEDEA-NEUMOUSA",
    description: "AI platform for classical philology: (1) Translation between 18 ancient languages, (2) Knowledge graph extraction (RDF/TTL), (3) Zeugma neuro-symbolic reasoning (LLM+Prolog), (4) Emotion knowledge graphs, (5) Semantic analysis. Role: Main developer.",
    platformUrl: "https://medea-bvca.onrender.com",
    githubUrl: "https://github.com/StergiosCha/MEDEA/",
    category: "application"
  },
  {
    name: "Simasia-Studio (TextCraft)",
    description: "AI text editor and translator with RAG for domain-specific translation, grammar/style analysis, track changes output. Role: Main developer.",
    platformUrl: "https://textcraft-ai.onrender.com",
    githubUrl: "https://github.com/StergiosCha/editor",
    category: "application"
  },
  {
    name: "RAG-to-Coq Pipeline",
    description: "Historical event extraction with 10 extraction modes, 5 LLM support, translation to Coq for formal verification. Role: Main developer.",
    platformUrl: null,
    githubUrl: "https://github.com/StergiosCha/rag-to-coq-pipeline",
    category: "application"
  },
  {
    name: "NATS",
    description: "NLP analysis suite: document embeddings, NER (19 types), network analysis. Role: Main developer.",
    platformUrl: null,
    githubUrl: "https://github.com/StergiosCha/NATS",
    category: "application"
  },
  {
    name: "Linguistic Distance Calculator",
    description: "7-dimension language distance measurement. Role: Main developer.",
    platformUrl: "https://linguisticdistance-production.up.railway.app",
    githubUrl: "https://github.com/StergiosCha/linguistic-distance",
    category: "application"
  },
  {
    name: "Greek Curriculum Ontology Extractor",
    description: "LLM-based ontology extraction with RAG. Role: Main developer.",
    platformUrl: null,
    githubUrl: "https://github.com/StergiosCha/greek-curriculum-ontology",
    category: "application"
  },
  {
    name: "Syntax-Expert",
    description: "Multi-framework syntactic analysis (Minimalism, HPSG, LFG, DS). Role: Main developer.",
    platformUrl: null,
    githubUrl: "https://github.com/StergiosCha/Syntax-expert",
    category: "application"
  },
  {
    name: "DI_detector",
    description: "Greek dialect identification. Role: Main developer.",
    platformUrl: "https://di-detector.onrender.com",
    githubUrl: "https://github.com/StergiosCha/DI_detector",
    category: "application"
  },
  {
    name: "Coq for NL Semantics / FraCoq",
    description: "Proof assistant code for MTT semantics and NLI. Role: Main developer (MTT book), contributor (FraCoq).",
    platformUrl: null,
    githubUrl: "https://github.com/StergiosCha/MTT-semantics_book",
    category: "code"
  },
  {
    name: "Compositional Bayesian Semantics",
    description: "Haskell implementations. Role: Contributor.",
    platformUrl: null,
    githubUrl: "https://github.com/GU-CLASP/CompositionalBayesianSemantics",
    category: "code"
  },
  {
    name: "Anvec",
    description: "Metaphoricity detection. Role: Contributor.",
    platformUrl: "https://gu-clasp.github.io/anvec-metaphor",
    githubUrl: "https://github.com/gu-clasp/anvec-metaphor/",
    category: "code"
  },
  // Datasets (from CV)
  {
    name: "GRDD/GRDD+",
    description: "Greek Regional Dialects: 11 varieties, ~7M words. Role: Main creator.",
    platformUrl: null,
    githubUrl: "https://github.com/StergiosCha/Greek_dialect_corpus",
    category: "dataset"
  },
  {
    name: "DNLI",
    description: "First dialogue NLI with disfluencies. Role: Co-creator.",
    platformUrl: null,
    githubUrl: "https://github.com/GU-CLASP/DNLI",
    category: "dataset"
  },
  {
    name: "OYXOY",
    description: "Greek NLU benchmark: NLI (1,763), WSD (6,896), metaphor (14,416). Role: Co-creator.",
    platformUrl: null,
    githubUrl: "https://github.com/StergiosCha/OYXOY",
    category: "dataset"
  },
  {
    name: "SuperOYXOY",
    description: "Extended: paraphrase, augmented NLI, bias detection. Role: Co-creator.",
    platformUrl: null,
    githubUrl: null,
    category: "dataset"
  },
  {
    name: "Fine-Grained Entailment",
    description: "Greek FraCaS extension (428), RTE annotation, Greek XNLI. Role: Main creator.",
    platformUrl: null,
    githubUrl: "https://github.com/GU-CLASP/LREC_2022",
    category: "dataset"
  },
  {
    name: "Precise Entailment",
    description: "Expert-annotated NLI (150 examples). Role: Contributor.",
    platformUrl: null,
    githubUrl: null,
    category: "dataset"
  },
  {
    name: "Shami",
    description: "Levantine Arabic: 110K sentences. Role: Co-creator.",
    platformUrl: null,
    githubUrl: "https://github.com/GU-CLASP/shami-corpus",
    category: "dataset"
  },
  {
    name: "ATSAD",
    description: "Arabic Tweets Sentiment: 36K tweets. Role: Contributor.",
    platformUrl: null,
    githubUrl: "https://github.com/motazsaad/arabic-sentiment-analysis",
    category: "dataset"
  },
  {
    name: "Shami-Senti",
    description: "Levantine sentiment (~2.5K). Role: Contributor.",
    platformUrl: null,
    githubUrl: "https://github.com/kathrein/Shami-Sentiment-Analyzer",
    category: "dataset"
  },
];

export const getToolsByCategory = (category: Tool['category']) => {
  return tools.filter(t => t.category === category);
};
