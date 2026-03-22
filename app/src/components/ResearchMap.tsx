import { useState, useRef, useCallback } from 'react';

interface Publication {
  code: string;
  title: string;
}

interface AreaNode {
  id: string;
  label: string;
  shortLabel: string;
  methodology: 'computational' | 'formal' | 'bridge';
  description: string;
  publications: Publication[];
  software?: string[];
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  label?: string;
}

// Node positions laid out for a 1000x520 viewBox — organic network layout
const nodes: AreaNode[] = [
  {
    id: 'dl-nlu',
    label: 'Deep Learning, NLU & Explainability',
    shortLabel: 'Deep Learning\n& Explainability',
    methodology: 'computational',
    x: 160, y: 100,
    description: 'NLI evaluation and robustness, annotation artifact detection, neuro-symbolic integration with Coq, LLM critique and explanation methods.',
    publications: [
      { code: 'Π3', title: 'Neuro-symbolic natural language inference with Coq' },
      { code: 'Π7', title: 'Evaluation and robustness of NLI systems' },
      { code: 'Σ10', title: 'Detecting annotation artifacts in NLI datasets' },
      { code: 'Σ34', title: 'Explainability methods for deep learning' },
      { code: 'Σ35', title: 'LLM critique and analysis' },
    ],
    software: ['MEDEA', 'RAG-to-Coq', 'DI_detector'],
  },
  {
    id: 'greek-nlp',
    label: 'Greek NLP & Dialect Processing',
    shortLabel: 'Greek NLP\n& Dialects',
    methodology: 'computational',
    x: 400, y: 55,
    description: 'Building resources for Greek: GRDD/GRDD+ dialect datasets, OYXOY/SuperOYXOY benchmarks, Krikri language models, dialect identification.',
    publications: [
      { code: 'Σ1', title: 'GRDD: Greek Dialect Dataset' },
      { code: 'Σ7', title: 'SuperOYXOY benchmark for Greek NLU' },
      { code: 'Σ8', title: 'Krikri: language models for Greek' },
      { code: 'Σ9', title: 'Fine-grained textual entailment for Greek' },
      { code: 'Σ15', title: 'Dialect identification systems for Greek' },
    ],
    software: ['DI_detector'],
  },
  {
    id: 'arabic',
    label: 'Arabic Dialect NLP & Language Distance',
    shortLabel: 'Arabic Dialects\n& Distance',
    methodology: 'computational',
    x: 650, y: 45,
    description: 'Shami corpus for Levantine Arabic, ATSAD sentiment analysis, computational dialectometry, multidimensional language distance frameworks.',
    publications: [
      { code: 'Π10', title: 'Computational dialectometry for Arabic varieties' },
      { code: 'Σ28', title: 'Shami: a corpus of Levantine Arabic dialects' },
      { code: 'Σ30', title: 'ATSAD: Arabic sentiment analysis dataset' },
      { code: 'Σ37', title: 'LSTM-CNN models for Arabic sentiment' },
    ],
    software: ['Dialect Analyzer', 'Distance Calculator'],
  },
  {
    id: 'rag',
    label: 'RAG & Knowledge-Enhanced LLMs',
    shortLabel: 'RAG &\nKnowledge LLMs',
    methodology: 'bridge',
    x: 140, y: 280,
    description: 'MEDEA-NEUMOUSA platform for classical philology, RAG-to-Coq verification pipeline, TextCraft/Simasia systems, RAG poetry generation.',
    publications: [
      { code: 'Σ4', title: 'MEDEA-NEUMOUSA: RAG for classical philology' },
      { code: 'Σ6', title: 'RAG-to-Coq: verified reasoning pipeline' },
      { code: 'Σ12', title: 'TextCraft: creative writing with RAG' },
      { code: 'ΑΣ1', title: 'RAG-based Greek poetry generation' },
    ],
    software: ['MuVeS', 'Plot Analyzer', 'MEDEA', 'TextCraft', 'RAG-to-Coq'],
  },
  {
    id: 'type-theory',
    label: 'Type-Theoretical Semantics & Proof Assistants',
    shortLabel: 'Type Theory\n& Proof Assistants',
    methodology: 'formal',
    x: 500, y: 210,
    description: 'Martin-Löf Type Theory for natural language, Coq proof assistant for compositional semantics: adjectives, adverbs, copredication, coordination.',
    publications: [
      { code: 'Β4', title: 'Natural Language Inference in Coq (monograph)' },
      { code: 'Π5', title: 'Type-theoretical analysis of adjectival modification' },
      { code: 'Π6', title: 'Copredication in Modern Type Theories' },
      { code: 'Π15', title: 'Compositional semantics via dependent types' },
      { code: 'Π19', title: 'Formal verification of natural language reasoning' },
    ],
    software: ['Coq for NL Semantics'],
  },
  {
    id: 'bayesian',
    label: 'Probabilistic & Bayesian Semantics',
    shortLabel: 'Bayesian\nSemantics',
    methodology: 'formal',
    x: 760, y: 185,
    description: 'Bayesian Inference Semantics, predicates-as-boxes, compositional Bayesian pragmatics with Monte Carlo methods, Haskell implementations.',
    publications: [
      { code: 'Β7', title: 'Bayesian Inference Semantics (monograph chapter)' },
      { code: 'Σ25', title: 'Predicates-as-boxes: a probabilistic model' },
      { code: 'Σ31', title: 'Compositional Bayesian pragmatics' },
      { code: 'Σ38', title: 'Monte Carlo methods for formal semantics' },
    ],
  },
  {
    id: 'digital-humanities',
    label: 'AI for Digital Humanities',
    shortLabel: 'Digital\nHumanities',
    methodology: 'bridge',
    x: 310, y: 380,
    description: 'Plot Analyzer for narrative structure, MEDEA for classical texts, NATS text analysis suite, curriculum ontology, diachronic corpus analysis.',
    publications: [
      { code: 'Σ2', title: 'AI-driven plot structure analysis' },
      { code: 'Σ5', title: 'MEDEA platform for classical philology' },
      { code: 'Σ6', title: 'NATS: a text analysis toolkit' },
      { code: 'Σ13', title: 'Automatic curriculum ontology extraction' },
    ],
    software: ['Plot Analyzer', 'MEDEA', 'NATS'],
  },
  {
    id: 'dialogue',
    label: 'Dialogue Modelling & Incremental Processing',
    shortLabel: 'Dialogue &\nIncremental Parsing',
    methodology: 'computational',
    x: 550, y: 380,
    description: 'Split utterances, fragmentary answers, afterthoughts, shared utterances. Dynamic Syntax for dialogue and incremental parsing. DNLI dataset.',
    publications: [
      { code: 'Β1', title: 'Dialogue and Dynamic Syntax (monograph)' },
      { code: 'Β2', title: 'Split utterances in dialogue (monograph chapter)' },
      { code: 'Π4', title: 'Fragmentary answers and ellipsis' },
      { code: 'Π8', title: 'Afterthoughts in incremental parsing' },
      { code: 'Π16', title: 'Shared utterances and turn-taking' },
    ],
  },
  {
    id: 'formal-syntax',
    label: 'Formal Syntax of Greek & Diachronic Linguistics',
    shortLabel: 'Greek Formal\nSyntax',
    methodology: 'formal',
    x: 820, y: 370,
    description: 'Clitic systems across Greek varieties (Cypriot, Griko, Pontic, Northern), Dynamic Syntax, PCC constraints, polydefinites, fieldwork data.',
    publications: [
      { code: 'Π1', title: 'Clitic placement in Cypriot Greek' },
      { code: 'Π12', title: 'PCC constraints across Greek dialects' },
      { code: 'Π20', title: 'The clitic system of Griko' },
      { code: 'Π21', title: 'Pontic Greek morphosyntax' },
      { code: 'Π22', title: 'Polydefinites in Modern Greek' },
    ],
  },
  {
    id: 'music',
    label: 'Music & Language: Shared Processing',
    shortLabel: 'Music &\nLanguage',
    methodology: 'formal',
    x: 700, y: 480,
    description: 'Polyrhythm processing, shared parsing mechanisms between music and language, Dynamic Syntax applied to music-language interaction.',
    publications: [
      { code: 'Β11', title: 'Music and language shared processing (monograph)' },
      { code: 'ΑΣ23', title: 'Polyrhythm and syntactic parsing parallels' },
      { code: 'ΑΣ26', title: 'Shared mechanisms in music and language' },
    ],
  },
];

const edges: Edge[] = [
  { from: 'dl-nlu', to: 'greek-nlp', label: 'NLI for Greek' },
  { from: 'dl-nlu', to: 'rag', label: 'neuro-symbolic' },
  { from: 'dl-nlu', to: 'type-theory', label: 'Coq verification' },
  { from: 'greek-nlp', to: 'arabic', label: 'dialect methods' },
  { from: 'greek-nlp', to: 'formal-syntax', label: 'Greek varieties' },
  { from: 'greek-nlp', to: 'digital-humanities', label: 'Greek corpora' },
  { from: 'arabic', to: 'formal-syntax', label: 'language distance' },
  { from: 'rag', to: 'type-theory', label: 'RAG-to-Coq' },
  { from: 'rag', to: 'digital-humanities', label: 'MEDEA platform' },
  { from: 'type-theory', to: 'bayesian', label: 'formal semantics' },
  { from: 'type-theory', to: 'dialogue', label: 'Dynamic Syntax' },
  { from: 'type-theory', to: 'formal-syntax', label: 'type-theoretic syntax' },
  { from: 'dialogue', to: 'formal-syntax', label: 'Dynamic Syntax' },
  { from: 'dialogue', to: 'music', label: 'shared parsing' },
  { from: 'formal-syntax', to: 'music', label: 'Dynamic Syntax' },
  { from: 'dl-nlu', to: 'digital-humanities', label: 'AI tools' },
];

const methodColors: Record<string, { fill: string; stroke: string; text: string }> = {
  computational: { fill: '#D06D48', stroke: '#D06D48', text: '#D06D48' },
  formal: { fill: '#6E6A63', stroke: '#6E6A63', text: '#6E6A63' },
  bridge: { fill: '#9E7B5A', stroke: '#9E7B5A', text: '#9E7B5A' },
};

const ResearchMap = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const focusId = hoveredId || selectedId;

  const connectedTo = useCallback((id: string): Set<string> => {
    const set = new Set<string>();
    edges.forEach(e => {
      if (e.from === id) set.add(e.to);
      if (e.to === id) set.add(e.from);
    });
    return set;
  }, []);

  const isNodeActive = (id: string) => {
    if (!focusId) return true;
    if (id === focusId) return true;
    return connectedTo(focusId).has(id);
  };

  const isEdgeActive = (from: string, to: string) => {
    if (!focusId) return true;
    return from === focusId || to === focusId;
  };

  const selected = selectedId ? nodes.find(n => n.id === selectedId) : null;

  // Wrap text into lines
  const renderLabel = (node: AreaNode, active: boolean, isSelected: boolean) => {
    const lines = node.shortLabel.split('\n');
    const colors = methodColors[node.methodology];
    const fontSize = 11;
    const lineHeight = 14;
    const startY = node.y + 32;

    return (
      <text
        textAnchor="middle"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize={fontSize}
        fontWeight={isSelected ? 700 : 600}
        fill={active ? colors.text : '#bbb'}
        style={{ transition: 'fill 0.3s, font-weight 0.2s', pointerEvents: 'none' }}
      >
        {lines.map((line, i) => (
          <tspan key={i} x={node.x} dy={i === 0 ? startY - node.y : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-5 mb-5 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#D06D48' }} />
          <span className="text-[11px] font-medium text-[#6E6A63] uppercase tracking-tight">Computational</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#6E6A63' }} />
          <span className="text-[11px] font-medium text-[#6E6A63] uppercase tracking-tight">Formal & Theoretical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#9E7B5A' }} />
          <span className="text-[11px] font-medium text-[#6E6A63] uppercase tracking-tight">Neuro-Symbolic Bridge</span>
        </div>
      </div>

      {/* Network SVG */}
      <div className="bg-white/70 rounded-xl border border-[#111]/5 p-2 sm:p-4 mb-5">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 530"
          className="w-full"
          style={{ minHeight: '320px', maxHeight: '520px' }}
        >
          {/* Edges */}
          {edges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from)!;
            const toNode = nodes.find(n => n.id === edge.to)!;
            const active = isEdgeActive(edge.from, edge.to);

            // Compute midpoint for edge label
            const mx = (fromNode.x + toNode.x) / 2;
            const my = (fromNode.y + toNode.y) / 2;

            return (
              <g key={`edge-${i}`}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={active ? '#999' : '#ddd'}
                  strokeWidth={active ? 1.2 : 0.6}
                  strokeOpacity={active ? 0.5 : 0.25}
                  style={{ transition: 'all 0.3s' }}
                />
                {/* Edge label — only show on hover/select */}
                {focusId && active && edge.label && (
                  <text
                    x={mx}
                    y={my - 4}
                    textAnchor="middle"
                    fontSize={8}
                    fill="#999"
                    fontFamily="'Space Grotesk', sans-serif"
                    style={{ pointerEvents: 'none' }}
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const colors = methodColors[node.methodology];
            const active = isNodeActive(node.id);
            const isSelected = selectedId === node.id;
            const isHovered = hoveredId === node.id;
            const r = 22;

            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedId(selectedId === node.id ? null : node.id)}
                style={{ cursor: 'pointer' }}
                opacity={active ? 1 : 0.2}
              >
                {/* Glow ring on selected */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r + 6}
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth={1.5}
                    strokeOpacity={0.25}
                    style={{ transition: 'all 0.3s' }}
                  />
                )}
                {/* Main circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill={isSelected || isHovered ? colors.fill : 'white'}
                  fillOpacity={isSelected || isHovered ? 0.12 : 0.9}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.2}
                  strokeOpacity={active ? 0.7 : 0.2}
                  style={{ transition: 'all 0.25s' }}
                />
                {/* Publication count inside circle */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={700}
                  fill={active ? colors.text : '#ccc'}
                  fontFamily="'Space Grotesk', sans-serif"
                  style={{ pointerEvents: 'none', transition: 'fill 0.3s' }}
                >
                  {node.publications.length}
                </text>
                {/* Label below */}
                {renderLabel(node, active, isSelected)}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      {selected ? (
        <div
          className="rounded-lg border-l-4 bg-white/80 p-5 sm:p-6"
          style={{ borderLeftColor: methodColors[selected.methodology].fill }}
        >
          <div className="mb-4">
            <span
              className="text-[10px] font-mono uppercase tracking-wider"
              style={{ color: methodColors[selected.methodology].text }}
            >
              {selected.methodology === 'computational' ? 'Computational' : selected.methodology === 'formal' ? 'Formal & Theoretical' : 'Neuro-Symbolic Bridge'}
            </span>
            <h3
              className="text-base sm:text-lg font-bold text-[#111] mt-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {selected.label}
            </h3>
            <p className="text-sm text-[#6E6A63] leading-relaxed mt-2">{selected.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-[#E9E6E1]">
            {/* Publications */}
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

            {/* Software + Connections */}
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
                  {Array.from(connectedTo(selected.id)).map(cid => {
                    const cn = nodes.find(n => n.id === cid);
                    if (!cn) return null;
                    const cc = methodColors[cn.methodology];
                    return (
                      <button
                        key={cid}
                        onClick={() => setSelectedId(cid)}
                        className="text-[11px] px-2 py-1 rounded font-medium transition-colors hover:opacity-80"
                        style={{ backgroundColor: `${cc.fill}12`, color: cc.text, border: `1px solid ${cc.fill}30` }}
                      >
                        {cn.shortLabel.split('\n')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-xs text-[#6E6A63] py-1">
          Click a node to see publications and connections
        </p>
      )}
    </div>
  );
};

export default ResearchMap;
