export interface NewsItem {
  date: string;
  text: string;
  link?: string | null;
  type: 'paper' | 'talk' | 'award' | 'event' | 'software' | 'general';
}

export const news: NewsItem[] = [
  {
    date: "2026-07",
    text: "New preprint on arXiv: Svarna, an open corpus workbench for Modern Greek — 507M+ words and ~29M sentences across five registers, free and open source.",
    link: "https://arxiv.org/abs/2607.00970",
    type: "paper"
  },
  {
    date: "2026-07",
    text: "Paper published in Frontiers in Artificial Intelligence: 'Neuro-symbolic NLP: taxonomy, assessment, and directions' (with Shalom Lappin).",
    link: "https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2026.1797587/full",
    type: "paper"
  },
  {
    date: "2026-04",
    text: "Completed an invited lecture tour across leading universities in China and Hong Kong, presenting research on LLMs, formal semantics, and neural-symbolic systems at ECNU, BNU, KELKIP (Chongqing), Shenzhen, and HK PolyU.",
    link: null,
    type: "talk"
  },
  {
    date: "2026-02",
    text: "Invited speaker at CLARIN Strategy Days (Athens) on 'CLARIN's Users and their Needs'.",
    link: "https://www.clarin.eu/",
    type: "talk"
  },
  {
    date: "2025-11",
    text: "Delivered invited and plenary lectures at Patras LanguageTech, OUP Handbook of Greek Linguistics conference (Thessaloniki), and presented the TermCraft terminological platform at the 15th Conference on Greek Language and Terminology.",
    link: null,
    type: "talk"
  },
  {
    date: "2025-09",
    text: "New paper accepted: Italian and Turkish loanwords detection in Greek dialects at ICGL17, Cambridge",
    link: null,
    type: "paper"
  },
  {
    date: "2025-08",
    text: "Plenary talk on 'AI, Large Language Models and Under-resourced Languages' at the 6th Summer School, International Summer University, Albania.",
    link: null,
    type: "talk"
  },
  {
    date: "2025",
    text: "Constructive Dynamic Syntax published in Languages special issue on Dynamic Syntax",
    link: null,
    type: "paper"
  },
  {
    date: "2026",
    text: "Dependent Types and Continuations published in Journal of Mathematical Structures in Computer Science, CUP",
    link: null,
    type: "paper"
  },
  {
    date: "2025",
    text: "Released Krikri-8B: fine-tuned Llama model for Greek dialectal varieties on Hugging Face",
    link: "https://huggingface.co/Stergios/krikri-8b-base-lora",
    type: "software"
  },
  {
    date: "2025",
    text: "Launched MuVeS — AI research assistant platform for paper discovery and literature reviews",
    link: "https://muves.io",
    type: "software"
  },
  {
    date: "2025",
    text: "Plot Analyzer released: bidirectional neuro-symbolic narrative analysis platform",
    link: "https://github.com/StergiosCha/plot_analyzer",
    type: "software"
  },
  {
    date: "2025",
    text: "Appointed Professor of Computational Linguistics at University of Crete",
    link: null,
    type: "general"
  },
];
