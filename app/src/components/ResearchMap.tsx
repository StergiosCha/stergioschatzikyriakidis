import { useState, useCallback } from 'react';

interface Publication {
  number: number;
  title: string;
}

interface ResearchArea {
  id: string;
  label: string;
  methodology: 'computational' | 'formal' | 'bridge';
  description: string;
  publications: Publication[];
  software?: string[];
  connections: string[];
}

// Publication numbers match the site's publication list
const areas: ResearchArea[] = [
  {
    id: 'dl-nlu',
    label: 'Deep Learning & Explainability',
    methodology: 'computational',
    description: 'NLI evaluation, annotation artifacts, neuro-symbolic integration with Coq, LLM critique and explanation.',
    publications: [
      { number: 27, title: 'Neuro-Symbolic NLP: Taxonomy, Assessment, and Directions' },
      { number: 43, title: 'Natural Language Inference in Coq' },
      { number: 59, title: 'Reverse Engineering NLI: Meta-inferential Properties of NLI' },
      { number: 66, title: 'How Does Data Corruption Affect NLU Models?' },
      { number: 53, title: 'Zeugma: Neuro-Symbolic Reasoning Over LLM-Generated KGs' },
    ],
    software: ['MEDEA', 'RAG-to-Coq', 'DI_detector'],
    connections: ['rag', 'greek-nlp', 'type-theory', 'digital-humanities'],
  },
  {
    id: 'greek-nlp',
    label: 'Greek NLP & Dialects',
    methodology: 'computational',
    description: 'GRDD/GRDD+ dialect datasets, OYXOY/SuperOYXOY benchmarks, Krikri models, dialect identification.',
    publications: [
      { number: 58, title: 'GRDD: A Dataset for Greek Dialectal NLP' },
      { number: 57, title: 'GRDD+: Extended Greek Dialectal Dataset' },
      { number: 64, title: 'OYXOY: A Modern NLP Test Suite for Modern Greek' },
      { number: 56, title: 'Perplexity as a Metric for Dialectal Distance' },
      { number: 68, title: 'Fine-grained Entailment: Resources for Greek NLI' },
    ],
    software: ['DI_detector'],
    connections: ['dl-nlu', 'arabic', 'formal-syntax', 'digital-humanities'],
  },
  {
    id: 'arabic',
    label: 'Arabic Dialects & Language Distance',
    methodology: 'computational',
    description: 'Shami corpus, ATSAD sentiment analysis, computational dialectometry, language distance frameworks.',
    publications: [
      { number: 34, title: 'A Lexical Distance Study of Arabic Dialects' },
      { number: 67, title: 'Pre-trained Models or Feature Engineering? Dialectal Arabic' },
      { number: 50, title: 'Italian and Turkish Loanwords Detection in Greek Dialects' },
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
      { number: 55, title: 'LLMs Got Rhyme? Hybrid Phonological Filtering for Greek Poetry' },
      { number: 61, title: 'Poetry in RAGs: Modern Greek Poetry Generation Using RAG' },
      { number: 54, title: 'HeptaTAX: Neuro-Symbolic Pipeline for Heptanesian Notarial Acts' },
      { number: 53, title: 'Zeugma: Neuro-Symbolic Reasoning Over LLM-Generated KGs' },
    ],
    software: ['MuVeS', 'Plot Analyzer', 'MEDEA', 'TextCraft', 'RAG-to-Coq'],
    connections: ['dl-nlu', 'type-theory', 'digital-humanities'],
  },
  {
    id: 'type-theory',
    label: 'Type Theory & Proof Assistants',
    methodology: 'formal',
    description: 'Martin-Löf Type Theory for NL semantics, Coq for adjectives, adverbs, copredication, coordination.',
    publications: [
      { number: 4, title: 'Formal Semantics in Modern Type Theories (monograph)' },
      { number: 2, title: 'Theories of Types and the Structure of Meaning' },
      { number: 43, title: 'Natural Language Inference in Coq' },
      { number: 39, title: 'Adjectival/Adverbial Modification in Modern Type Theories' },
      { number: 29, title: 'Dependent Types and Continuations' },
    ],
    software: ['Coq for NL Semantics'],
    connections: ['dl-nlu', 'rag', 'bayesian', 'dialogue', 'formal-syntax'],
  },
  {
    id: 'bayesian',
    label: 'Bayesian Semantics',
    methodology: 'formal',
    description: 'Bayesian Inference Semantics, predicates-as-boxes, compositional pragmatics, Monte Carlo, Haskell.',
    publications: [
      { number: 8, title: 'Bayesian Inference Semantics for Natural Language' },
      { number: 7, title: 'Introduction to Probabilistic Approaches to Linguistic Theory' },
      { number: 31, title: 'A Computational Treatment of Anaphora' },
    ],
    connections: ['type-theory'],
  },
  {
    id: 'digital-humanities',
    label: 'AI for Digital Humanities',
    methodology: 'bridge',
    description: 'Plot Analyzer for narrative, MEDEA for classical texts, NATS text analysis, ontology extraction.',
    publications: [
      { number: 51, title: 'GeoAffect: Geoaffective Analysis of Literary Texts' },
      { number: 54, title: 'HeptaTAX: Classifying 16th-Century Heptanesian Notarial Acts' },
      { number: 62, title: 'Literary Translation and Electronic Text Corpus' },
    ],
    software: ['Plot Analyzer', 'MEDEA', 'NATS'],
    connections: ['rag', 'greek-nlp', 'dl-nlu'],
  },
  {
    id: 'dialogue',
    label: 'Dialogue & Incremental Parsing',
    methodology: 'computational',
    description: 'Split utterances, fragmentary answers, afterthoughts, shared utterances, Dynamic Syntax, DNLI.',
    publications: [
      { number: 1, title: 'Dialogical Interaction, Types, and the Structure of Meaning' },
      { number: 28, title: 'Constructive Dynamic Syntax' },
      { number: 40, title: 'Afterthoughts in Greek: Gender Mismatches Under Dynamic Framework' },
      { number: 63, title: 'A Dataset of Inferences from Natural Language Dialogues' },
      { number: 33, title: 'Completability vs (In)completeness' },
    ],
    connections: ['type-theory', 'formal-syntax', 'music'],
  },
  {
    id: 'formal-syntax',
    label: 'Greek Formal Syntax',
    methodology: 'formal',
    description: 'Clitic systems (Cypriot, Griko, Pontic, Northern Greek), Dynamic Syntax, PCC, polydefinites.',
    publications: [
      { number: 44, title: 'A Dynamic Account of the Cypriot Greek Clitic System' },
      { number: 36, title: 'The Bantu/Romance/Greek Connection Revisited' },
      { number: 46, title: 'Clitics in Grecia Salentina Greek' },
      { number: 45, title: 'Standard Modern and Pontic Greek Person Restrictions' },
      { number: 25, title: 'Polydefinites as Markers of Prominence' },
    ],
    connections: ['greek-nlp', 'arabic', 'type-theory', 'dialogue', 'music'],
  },
  {
    id: 'music',
    label: 'Music & Language',
    methodology: 'formal',
    description: 'Polyrhythm processing, shared parsing mechanisms, Dynamic Syntax for music-language interaction.',
    publications: [
      { number: 11, title: 'Underspecification Restrictions in Polyrhythmic Processing' },
    ],
    connections: ['dialogue', 'formal-syntax'],
  },
];

const methodMeta: Record<string, { label: string; color: string; bg: string }> = {
  computational: { label: 'Computational', color: '#D06D48', bg: 'rgba(208,109,72,0.06)' },
  formal: { label: 'Formal', color: '#6E6A63', bg: 'rgba(110,106,99,0.06)' },
  bridge: { label: 'Bridge', color: '#9E7B5A', bg: 'rgba(158,123,90,0.06)' },
};

const ResearchMap = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const connectedTo = useCallback((id: string): Set<string> => {
    const area = areas.find(a => a.id === id);
    return new Set(area?.connections || []);
  }, []);

  const selected = selectedId ? areas.find(a => a.id === selectedId) : null;

  return (
    <div className="w-full">
      {/* Two-row layout: Computational+Bridge on top, Formal on bottom */}
      <div className="space-y-3 mb-5">
        <div className="flex flex-wrap gap-2 justify-center">
          {areas.filter(a => a.methodology === 'computational' || a.methodology === 'bridge').map(area => {
            const meta = methodMeta[area.methodology];
            const isSelected = selectedId === area.id;
            const isConnected = selected ? connectedTo(selected.id).has(area.id) : false;
            const dimmed = selected && !isSelected && !isConnected;

            return (
              <button
                key={area.id}
                onClick={() => setSelectedId(isSelected ? null : area.id)}
                className="relative px-4 py-3 rounded-lg text-left transition-all duration-200 min-w-[140px] max-w-[200px] flex-1"
                style={{
                  backgroundColor: isSelected ? meta.bg : 'rgba(255,255,255,0.7)',
                  border: `1.5px solid ${isSelected ? meta.color : isConnected ? `${meta.color}60` : 'rgba(17,17,17,0.08)'}`,
                  opacity: dimmed ? 0.35 : 1,
                  boxShadow: isSelected ? `0 2px 12px ${meta.color}15` : 'none',
                }}
              >
                <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: meta.color }} />
                <div className="text-[12px] font-semibold text-[#111] leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {area.label}
                </div>
                <div className="text-[10px] text-[#6E6A63] mt-1">{area.publications.length} papers</div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <svg width="100%" height="16" className="overflow-visible">
            <line x1="10%" y1="8" x2="90%" y2="8" stroke="#bbb" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {areas.filter(a => a.methodology === 'formal').map(area => {
            const meta = methodMeta[area.methodology];
            const isSelected = selectedId === area.id;
            const isConnected = selected ? connectedTo(selected.id).has(area.id) : false;
            const dimmed = selected && !isSelected && !isConnected;

            return (
              <button
                key={area.id}
                onClick={() => setSelectedId(isSelected ? null : area.id)}
                className="relative px-4 py-3 rounded-lg text-left transition-all duration-200 min-w-[140px] max-w-[200px] flex-1"
                style={{
                  backgroundColor: isSelected ? meta.bg : 'rgba(255,255,255,0.7)',
                  border: `1.5px solid ${isSelected ? meta.color : isConnected ? `${meta.color}60` : 'rgba(17,17,17,0.08)'}`,
                  opacity: dimmed ? 0.35 : 1,
                  boxShadow: isSelected ? `0 2px 12px ${meta.color}15` : 'none',
                }}
              >
                <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: meta.color }} />
                <div className="text-[12px] font-semibold text-[#111] leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {area.label}
                </div>
                <div className="text-[10px] text-[#6E6A63] mt-1">{area.publications.length} papers</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-5 justify-center">
        {Object.entries(methodMeta).map(([key, m]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
            <span className="text-[10px] text-[#6E6A63] uppercase tracking-wide font-medium">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selected && (
        <div
          className="rounded-lg border-l-4 bg-white/80 p-5 sm:p-6"
          style={{ borderLeftColor: methodMeta[selected.methodology].color }}
        >
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-bold text-[#111]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {selected.label}
            </h3>
            <p className="text-sm text-[#6E6A63] leading-relaxed mt-1">{selected.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-[#E9E6E1]">
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold text-[#111] uppercase tracking-tight mb-3">Key Publications</h4>
              <div className="space-y-2">
                {selected.publications.map(pub => (
                  <div key={pub.number} className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-semibold text-[#D06D48] bg-[#D06D48]/10 px-1.5 py-0.5 rounded flex-shrink-0">
                      #{pub.number}
                    </span>
                    <span className="text-xs text-[#111] leading-relaxed">{pub.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {selected.software && selected.software.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#111] uppercase tracking-tight mb-3">Software</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.software.map(s => (
                      <span key={s} className="text-[11px] bg-[#111]/5 text-[#6E6A63] px-2 py-1 rounded font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h4 className="text-xs font-bold text-[#111] uppercase tracking-tight mb-3">Connected Areas</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selected.connections.map(cid => {
                    const cn = areas.find(a => a.id === cid);
                    if (!cn) return null;
                    const cc = methodMeta[cn.methodology];
                    return (
                      <button
                        key={cid}
                        onClick={() => setSelectedId(cid)}
                        className="text-[11px] px-2 py-1 rounded font-medium transition-colors hover:opacity-80"
                        style={{ backgroundColor: cc.bg, color: cc.color, border: `1px solid ${cc.color}30` }}
                      >
                        {cn.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <p className="text-center text-xs text-[#6E6A63] py-1">Click any area to explore publications and connections</p>
      )}
    </div>
  );
};

export default ResearchMap;
