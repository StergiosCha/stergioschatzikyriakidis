export interface NewsItem {
  date: string;
  text: string;
  link?: string | null;
  type: 'paper' | 'talk' | 'award' | 'event' | 'software' | 'general';
}

export const news: NewsItem[] = [
  {
    date: "2025-09",
    text: "New paper accepted: Italian and Turkish loanwords detection in Greek dialects at ICGL17, Cambridge",
    link: null,
    type: "paper"
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
    date: "2026",
    text: "Neuro-Symbolic NLP: Taxonomy, Assessment, and Directions — submitted to Frontiers in AI",
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
