import { useState, useCallback } from 'react';

interface Publication {
  code: string;
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

const areas: ResearchArea[] = [
  {
    id: 'dl-nlu',
    label: 'Deep Learning & Explainability',
    methodology: 'computational',
    description: 'NLI evaluation, annotation artifacts, neuro-symbolic integration with Coq, LLM critique and explanation.',
    publications: [
      { code: 'Π3', title: 'Neuro-symbolic natural language inference with Coq' },
      { code: 'Π7', title: 'Evaluation and robustness of NLI systems' },
      { code: 'Σ10', title: 'Detecting annotation artifacts in NLI datasets' },
      { code: 'Σ34', title: 'Explainability methods for deep learning' },
      { code: 'Σ35', title: 'LLM critique and analysis' },
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
      { code: 'Σ1', title: 'GRDD: Greek Dialect Dataset' },
      { code: 'Σ7', title: 'SuperOYXOY benchmark for Greek NLU' },
      { code: 'Σ8', title: 'Krikri: language models for Greek' },
      { code: 'Σ9', title: 'Fine-grained textual entailment for Greek' },
      { code: 'Σ15', title: 'Dialect identification systems for Greek' },
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
      { code: 'Π10', title: 'Computational dialectometry for Arabic varieties' },
      { code: 'Σ28', title: 'Shami: a corpus of Levantine Arabic dialects' },
      { code: 'Σ30', title: 'ATSAD: Arabic sentiment analysis dataset' },
      { code: 'Σ37', title: 'LSTM-CNN models for Arabic sentiment' },
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
      { code: 'Σ4', title: 'MEDEA-NEUMOUSA: RAG for classical philology' },
      { code: 'Σ6', title: 'RAG-to-Coq: verified reasoning pipeline' },
      { code: 'Σ12', title: 'TextCraft: creative writing with RAG' },
      { code: 'ΑΣ1', title: 'RAG-based Greek poetry generation' },
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
      { code: 'Β4', title: 'Natural Language Inference in Coq (monograph)' },
      { code: 'Π5', title: 'Type-theoretical analysis of adjectival modification' },
      { code: 'Π6', title: 'Copredication in Modern Type Theories' },
      { code: 'Π15', title: 'Compositional semantics via dependent types' },
      { code: 'Π19', title: 'Formal verification of natural language reasoning' },
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
      { code: 'Β7', title: 'Bayesian Inference Semantics (monograph chapter)' },
      { code: 'Σ25', title: 'Predicates-as-boxes: a probabilistic model' },
      { code: 'Σ31', title: 'Compositional Bayesian pragmatics' },
      { code: 'Σ38', title: 'Monte Carlo methods for formal semantics' },
    ],
    connections: ['type-theory'],
  },
  {
    id: 'digital-humanities',
    label: 'AI for Digital Humanities',
    methodology: 'bridge',
    description: 'Plot Analyzer for narrative, MEDEA for classical texts, NATS text analysis, ontology extraction.',
    publications: [
      { code: 'Σ2', title: 'AI-driven plot structure analysis' },
      { code: 'Σ5', title: 'MEDEA platform for classical philology' },
      { code: 'Σ6', title: 'NATS: a text analysis toolkit' },
      { code: 'Σ13', title: 'Automatic curriculum ontology extraction' },
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
      { code: 'Β1', title: 'Dialogue and Dynamic Syntax (monograph)' },
      { code: 'Β2', title: 'Split utterances in dialogue (monograph chapter)' },
      { code: 'Π4', title: 'Fragmentary answers and ellipsis' },
      { code: 'Π8', title: 'Afterthoughts in incremental parsing' },
      { code: 'Π16', title: 'Shared utterances and turn-taking' },
    ],
    connections: ['type-theory', 'formal-syntax', 'music'],
  },
  {
    id: 'formal-syntax',
    label: 'Greek Formal Syntax',
    methodology: 'formal',
    description: 'Clitic systems (Cypriot, Griko, Pontic, Northern Greek), Dynamic Syntax, PCC, polydefinites.',
    publications: [
      { code: 'Π1', title: 'Clitic placement in Cypriot Greek' },
      { code: 'Π12', title: 'PCC constraints across Greek dialects' },
      { code: 'Π20', title: 'The clitic system of Griko' },
      { code: 'Π21', title: 'Pontic Greek morphosyntax' },
      { code: 'Π22', title: 'Polydefinites in Modern Greek' },
    ],
    connections: ['greek-nlp', 'arabic', 'type-theory', 'dialogue', 'music'],
  },
  {
    id: 'music',
    label: 'Music & Language',
    methodology: 'formal',
    description: 'Polyrhythm processing, shared parsing mechanisms, Dynamic Syntax for music-language interaction.',
    publications: [
      { code: 'Β11', title: 'Music and language shared processing (monograph)' },
      { code: 'ΑΣ23', title: 'Polyrhythm and syntactic parsing parallels' },
      { code: 'ΑΣ26', title: 'Shared mechanisms in music and language' },
    ],
    connections: ['dialogue', 'formal-syntax'],
  },
];

const methodMeta: Record<string, { label: string; color: string; border: string; bg: string }> = {
  computational: { label: 'Computational', color: '#D06D48', border: '#D06D48', bg: 'rgba(208,109,72,0.06)' },
  formal: { label: 'Formal', color: '#6E6A63', border: '#6E6A63', bg: 'rgba(110,106,99,0.06)' },
  bridge: { label: 'Bridge', color: '#9E7B5A', border: '#9E7B5A', bg: 'rgba(158,123,90,0.06)' },
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
      {/* Network as a flow diagram: two rows of connected areas */}
      <div className="space-y-3 mb-6">
        {/* Row 1: Computational + Bridge areas */}
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
                  border: `1.5px solid ${isSelected ? meta.border : isConnected ? `${meta.border}60` : 'rgba(17,17,17,0.08)'}`,
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

        {/* Connection indicator */}
        <div className="flex justify-center">
          <svg width="100%" height="20" className="overflow-visible">
            <line x1="10%" y1="10" x2="90%" y2="10" stroke="#ccc" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Row 2: Formal areas */}
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
                  border: `1.5px solid ${isSelected ? meta.border : isConnected ? `${meta.border}60` : 'rgba(17,17,17,0.08)'}`,
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
                  <div key={pub.code} className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-semibold text-[#D06D48] bg-[#D06D48]/10 px-1.5 py-0.5 rounded flex-shrink-0">
                      {pub.code}
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
