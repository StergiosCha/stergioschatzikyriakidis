export interface LiveApp {
  name: string;
  tagline: string;
  url: string;
  githubUrl?: string | null;
  glyph: string;
  tags: string[];
}

// The app embedded live at the top of the Live Demos section
export const featuredApp: LiveApp = {
  name: "Svarna — Greek Corpus Workbench",
  tagline:
    "Concordancing, frequencies, discourse markers, keyness and LLM-assisted analysis over 500M+ words of Modern Greek, live in your browser.",
  url: "https://greek-corpus-workbench.wonderfulhill-e1c9f1a0.westeurope.azurecontainerapps.io",
  githubUrl: "https://github.com/StergiosCha/GreekNLP-SwissKnife",
  glyph: "Σ",
  tags: ["KWIC", "Frequencies", "Keyness", "LLM Analysis"],
};

export const liveApps: LiveApp[] = [
  {
    name: "Greek NLP Swiss Knife",
    tagline:
      "The portal: ten containerized research platforms for Modern Greek linguistics, classical studies, and digital humanities.",
    url: "https://greek-app-heaven-portal.livelyhill-85880e66.westeurope.azurecontainerapps.io",
    githubUrl: "https://github.com/StergiosCha/GreekNLP-SwissKnife",
    glyph: "Α",
    tags: ["10 Platforms", "Portal", "Azure"],
  },
  {
    name: "MEDEA-NEUMOUSA",
    tagline:
      "Neuro-symbolic AI for classical studies: translation across 18 ancient languages, knowledge graphs, and Prolog-based reasoning.",
    url: "https://greek-app-heaven-medea.livelyhill-85880e66.westeurope.azurecontainerapps.io",
    githubUrl: "https://github.com/StergiosCha/MEDEA/",
    glyph: "☤",
    tags: ["Ancient Languages", "Knowledge Graphs", "Zeugma"],
  },
  {
    name: "Greek Rhyme System",
    tagline:
      "Identify and generate rhyme patterns in Modern Greek poetry with multi-LLM analysis and phonological verification.",
    url: "https://greek-app-heaven-rhyme.livelyhill-85880e66.westeurope.azurecontainerapps.io",
    githubUrl: "https://github.com/StergiosCha/GreekNLP-SwissKnife",
    glyph: "♫",
    tags: ["Rhyme Taxonomy", "RAG", "Verification Loop"],
  },
  {
    name: "Dialect Generator",
    tagline:
      "Text generation in Pontic, Cretan, Northern Greek, and Cypriot via LoRA adapters fine-tuned on the GRDD+ corpus.",
    url: "https://dialect-gen-cpu.blackplant-0f676054.westeurope.azurecontainerapps.io",
    githubUrl: "https://github.com/StergiosCha/krikri_dialectal",
    glyph: "Γ",
    tags: ["4 Dialects", "LoRA", "GRDD+"],
  },
  {
    name: "PlotAnalyzer",
    tagline:
      "Neuro-symbolic narrative analysis through five theories, from Aristotelian Poetics to Russian Formalism.",
    url: "https://greek-app-heaven-plot.livelyhill-85880e66.westeurope.azurecontainerapps.io",
    githubUrl: "https://github.com/StergiosCha/plot_analyzer",
    glyph: "✎",
    tags: ["5 Theories", "NeSy", "Conflict Detection"],
  },
  {
    name: "Linguistic Distance",
    tagline:
      "Measure linguistic distance across seven dimensions for eleven language pairs, from Ancient to Modern Greek and beyond.",
    url: "https://greek-app-heaven-linguistic.livelyhill-85880e66.westeurope.azurecontainerapps.io",
    githubUrl: "https://github.com/StergiosCha/linguistic-distance",
    glyph: "Δ",
    tags: ["7 Dimensions", "WALS", "URIEL+"],
  },
  {
    name: "NATS",
    tagline:
      "Named entity recognition with morphological normalization, embeddings, and interactive entity networks for Greek.",
    url: "https://greek-app-heaven-nats.livelyhill-85880e66.westeurope.azurecontainerapps.io",
    githubUrl: "https://github.com/StergiosCha/NATS",
    glyph: "◇",
    tags: ["NER", "Embeddings", "Networks"],
  },
  {
    name: "Voyant-NLP",
    tagline:
      "Text analysis and embeddings lab: Word2Vec/FastText training, topics, sentiment, POS tagging, and clustering.",
    url: "https://greek-app-heaven-voyant.livelyhill-85880e66.westeurope.azurecontainerapps.io",
    githubUrl: "https://github.com/StergiosCha/GreekNLP-SwissKnife",
    glyph: "⚙",
    tags: ["Word2Vec", "Topics", "KWIC"],
  },
  {
    name: "TermGuard",
    tagline:
      "AI-assisted terminography: term extraction, ISO 1087-compliant definitions, and neuro-symbolic validation.",
    url: "https://greek-app-heaven-terminography.livelyhill-85880e66.westeurope.azurecontainerapps.io",
    githubUrl: "https://github.com/StergiosCha/term_extraction",
    glyph: "☶",
    tags: ["ISO 1087", "RAG", "Symbolic Parser"],
  },
];
