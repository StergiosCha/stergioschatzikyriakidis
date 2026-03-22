import { useState } from 'react';

interface Publication {
  code: string;
  title: string;
}

interface ResearchArea {
  id: string;
  title: string;
  methodology: 'computational' | 'formal' | 'bridge';
  description: string;
  publications: Publication[];
  software?: string[];
  connections: string[]; // ids of connected areas
}

const areas: ResearchArea[] = [
  {
    id: 'dl-nlu',
    title: 'Deep Learning, NLU & Explainability',
    methodology: 'computational',
    description: 'NLI evaluation and robustness, annotation artifact detection, neuro-symbolic integration with Coq, LLM critique and explanation methods.',
    publications: [
      { code: 'Π3', title: 'Neuro-symbolic inference with Coq' },
      { code: 'Π7', title: 'NLI evaluation and robustness testing' },
      { code: 'Σ10', title: 'Annotation artifacts in NLI datasets' },
      { code: 'Σ34', title: 'Explainability in deep learning models' },
      { code: 'Σ35', title: 'LLM critique and analysis' },
    ],
    software: ['MEDEA', 'RAG-to-Coq', 'DI_detector'],
    connections: ['rag', 'greek-nlp', 'type-theory'],
  },
  {
    id: 'greek-nlp',
    title: 'Greek NLP & Dialect Processing',
    methodology: 'computational',
    description: 'Building resources for Greek: GRDD/GRDD+ dialect datasets, OYXOY/SuperOYXOY benchmarks, Krikri language models, dialect identification systems.',
    publications: [
      { code: 'Σ1', title: 'GRDD: Greek Dialect Dataset' },
      { code: 'Σ7', title: 'SuperOYXOY benchmark for Greek NLU' },
      { code: 'Σ8', title: 'Krikri language models' },
      { code: 'Σ9', title: 'Fine-grained entailment for Greek' },
      { code: 'Σ15', title: 'Greek dialect identification' },
    ],
    software: ['DI_detector'],
    connections: ['dl-nlu', 'arabic', 'formal-syntax', 'digital-humanities'],
  },
  {
    id: 'arabic',
    title: 'Arabic Dialect NLP & Language Distance',
    methodology: 'computational',
    description: 'Shami corpus for Levantine Arabic, ATSAD sentiment analysis, computational dialectometry, multidimensional language distance frameworks.',
    publications: [
      { code: 'Π10', title: 'Computational dialectometry for Arabic' },
      { code: 'Σ28', title: 'Shami corpus for Levantine Arabic' },
      { code: 'Σ30', title: 'ATSAD sentiment analysis dataset' },
      { code: 'Σ37', title: 'LSTM-CNN Arabic sentiment models' },
    ],
    software: ['Dialect Analyzer', 'Distance Calculator'],
    connections: ['greek-nlp', 'formal-syntax'],
  },
  {
    id: 'rag',
    title: 'RAG & Knowledge-Enhanced LLMs',
    methodology: 'bridge',
    description: 'MEDEA-NEUMOUSA platform for classical philology, RAG-to-Coq verification pipeline, TextCraft/Simasia writing systems, RAG-based poetry generation.',
    publications: [
      { code: 'Σ4', title: 'MEDEA-NEUMOUSA RAG platform' },
      { code: 'Σ6', title: 'RAG-to-Coq verification pipeline' },
      { code: 'Σ12', title: 'TextCraft creative writing system' },
      { code: 'ΑΣ1', title: 'RAG-based Greek poetry generation' },
    ],
    software: ['MuVeS', 'Plot Analyzer', 'MEDEA', 'TextCraft', 'RAG-to-Coq'],
    connections: ['dl-nlu', 'type-theory', 'digital-humanities'],
  },
  {
    id: 'type-theory',
    title: 'Type-Theoretical Semantics & Proof Assistants',
    methodology: 'formal',
    description: 'Martin-Löf Type Theory for natural language semantics, Coq proof assistant for compositional phenomena: adjectives, adverbs, copredication, coordination.',
    publications: [
      { code: 'Β4', title: 'Natural Language Inference in Coq (monograph)' },
      { code: 'Π5', title: 'Type-theoretical analysis of adjectives' },
      { code: 'Π6', title: 'Copredication in Modern Type Theories' },
      { code: 'Π15', title: 'Compositional semantics via dependent types' },
      { code: 'Π19', title: 'Formal verification of NL reasoning' },
    ],
    software: ['Coq for NL Semantics'],
    connections: ['dl-nlu', 'rag', 'bayesian', 'dialogue', 'formal-syntax'],
  },
  {
    id: 'bayesian',
    title: 'Probabilistic & Bayesian Semantics',
    methodology: 'formal',
    description: 'Bayesian Inference Semantics framework, predicates-as-boxes model, compositional Bayesian pragmatics with Monte Carlo methods, Haskell implementations.',
    publications: [
      { code: 'Β7', title: 'Bayesian Inference Semantics (monograph chapter)' },
      { code: 'Σ25', title: 'Predicates-as-boxes probabilistic model' },
      { code: 'Σ31', title: 'Compositional Bayesian pragmatics' },
      { code: 'Σ38', title: 'Monte Carlo methods for semantics' },
    ],
    connections: ['type-theory'],
  },
  {
    id: 'digital-humanities',
    title: 'AI for Digital Humanities',
    methodology: 'bridge',
    description: 'Plot Analyzer for narrative structure, MEDEA platform for classical texts, NATS text analysis suite, curriculum ontology extraction, diachronic corpus analysis.',
    publications: [
      { code: 'Σ2', title: 'Plot structure analysis with AI' },
      { code: 'Σ5', title: 'MEDEA for classical philology' },
      { code: 'Σ6', title: 'NATS text analysis toolkit' },
      { code: 'Σ13', title: 'Curriculum ontology extraction' },
    ],
    software: ['Plot Analyzer', 'MEDEA', 'NATS'],
    connections: ['rag', 'greek-nlp'],
  },
  {
    id: 'dialogue',
    title: 'Dialogue Modelling & Incremental Processing',
    methodology: 'computational',
    description: 'Split utterances, fragmentary answers, afterthoughts, shared utterances. Dynamic Syntax framework for dialogue and incremental parsing. DNLI dataset.',
    publications: [
      { code: 'Β1', title: 'Dialogue and Dynamic Syntax (monograph)' },
      { code: 'Β2', title: 'Split utterances (monograph chapter)' },
      { code: 'Π4', title: 'Fragmentary answers in dialogue' },
      { code: 'Π8', title: 'Afterthoughts in incremental parsing' },
      { code: 'Π16', title: 'Shared utterances and turn-taking' },
    ],
    connections: ['type-theory', 'formal-syntax', 'music'],
  },
  {
    id: 'formal-syntax',
    title: 'Formal Syntax of Greek & Diachronic Linguistics',
    methodology: 'formal',
    description: 'Clitic systems across Greek varieties (Cypriot, Griko, Pontic, Northern Greek), Dynamic Syntax, PCC constraints, polydefinites, fieldwork-based analysis.',
    publications: [
      { code: 'Π1', title: 'Clitic placement in Cypriot Greek' },
      { code: 'Π12', title: 'PCC constraints across Greek dialects' },
      { code: 'Π20', title: 'Griko clitic systems' },
      { code: 'Π21', title: 'Pontic Greek syntax' },
      { code: 'Π22', title: 'Polydefinites in Modern Greek' },
    ],
    connections: ['greek-nlp', 'arabic', 'type-theory', 'dialogue', 'music'],
  },
  {
    id: 'music',
    title: 'Music & Language: Shared Processing',
    methodology: 'formal',
    description: 'Polyrhythm processing, shared parsing mechanisms between music and language, Dynamic Syntax framework applied to music-language interaction.',
    publications: [
      { code: 'Β11', title: 'Music and language processing (monograph chapter)' },
      { code: 'ΑΣ23', title: 'Polyrhythm and syntactic parsing' },
      { code: 'ΑΣ26', title: 'Shared processing mechanisms' },
    ],
    connections: ['dialogue', 'formal-syntax'],
  },
];

const methodologyMeta: Record<string, { label: string; color: string; bg: string }> = {
  computational: { label: 'Computational', color: '#D06D48', bg: 'rgba(208,109,72,0.08)' },
  formal: { label: 'Formal & Theoretical', color: '#6E6A63', bg: 'rgba(110,106,99,0.08)' },
  bridge: { label: 'Neuro-Symbolic Bridge', color: '#9E7B5A', bg: 'rgba(158,123,90,0.08)' },
};

const ResearchMap = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId ? areas.find(a => a.id === selectedId) : null;

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.entries(methodologyMeta).map(([key, m]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
            <span className="text-[11px] font-medium text-[#6E6A63] uppercase tracking-tight">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Area grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {areas.map(area => {
          const meta = methodologyMeta[area.methodology];
          const isSelected = selectedId === area.id;
          const isConnected = selected?.connections.includes(area.id);

          return (
            <button
              key={area.id}
              onClick={() => setSelectedId(isSelected ? null : area.id)}
              className="text-left rounded-lg p-4 transition-all duration-200 border"
              style={{
                backgroundColor: isSelected ? meta.bg : isConnected ? 'rgba(208,109,72,0.04)' : 'rgba(255,255,255,0.6)',
                borderColor: isSelected ? meta.color : isConnected ? 'rgba(208,109,72,0.25)' : 'rgba(17,17,17,0.06)',
                boxShadow: isSelected ? `0 0 0 1px ${meta.color}40` : 'none',
                opacity: selected && !isSelected && !isConnected ? 0.45 : 1,
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
                <span className="text-[10px] font-mono text-[#6E6A63] uppercase">{meta.label}</span>
              </div>
              <h4
                className="text-[13px] font-semibold leading-tight"
                style={{ color: '#111', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {area.title}
              </h4>
              <p className="text-[10px] text-[#6E6A63] mt-1 leading-relaxed line-clamp-2">
                {area.publications.length} publications
                {area.software && area.software.length > 0 && ` · ${area.software.length} tools`}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {selected && (
        <div
          className="rounded-lg border-l-4 bg-white/80 p-6 transition-all duration-200"
          style={{ borderLeftColor: methodologyMeta[selected.methodology].color }}
        >
          <div className="mb-4">
            <span
              className="text-[10px] font-mono uppercase tracking-wider"
              style={{ color: methodologyMeta[selected.methodology].color }}
            >
              {methodologyMeta[selected.methodology].label}
            </span>
            <h3
              className="text-lg font-bold text-[#111] mt-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {selected.title}
            </h3>
            <p className="text-sm text-[#6E6A63] leading-relaxed mt-2">{selected.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E9E6E1]">
            {/* Key Publications */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold text-[#111] uppercase tracking-tight mb-3">
                Key Publications
              </h4>
              <div className="space-y-2">
                {selected.publications.map(pub => (
                  <div key={pub.code} className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-semibold text-[#D06D48] bg-[#D06D48]/8 px-1.5 py-0.5 rounded flex-shrink-0">
                      {pub.code}
                    </span>
                    <span className="text-xs text-[#111] leading-relaxed">{pub.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Software & Connections */}
            <div className="space-y-5">
              {selected.software && selected.software.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#111] uppercase tracking-tight mb-3">
                    Software & Tools
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.software.map(name => (
                      <span key={name} className="text-[11px] bg-[#111]/5 text-[#6E6A63] px-2 py-1 rounded font-medium">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-[#111] uppercase tracking-tight mb-3">
                  Connects To
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selected.connections.map(connId => {
                    const connArea = areas.find(a => a.id === connId);
                    if (!connArea) return null;
                    return (
                      <button
                        key={connId}
                        onClick={() => setSelectedId(connId)}
                        className="text-[11px] px-2 py-1 rounded font-medium transition-colors hover:opacity-80"
                        style={{
                          backgroundColor: methodologyMeta[connArea.methodology].bg,
                          color: methodologyMeta[connArea.methodology].color,
                          border: `1px solid ${methodologyMeta[connArea.methodology].color}30`,
                        }}
                      >
                        {connArea.title.split(',')[0].split('&')[0].trim()}
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
        <p className="text-center text-xs text-[#6E6A63] py-2">
          Click any research area to see key publications and connections
        </p>
      )}
    </div>
  );
};

export default ResearchMap;
