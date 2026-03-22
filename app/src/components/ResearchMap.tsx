import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ResearchArea {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  methodology: 'computational' | 'formal' | 'bridge';
  x: number;
  y: number;
  size: number;
  publicationCount: number;
  publications: Array<{ code: string; title?: string }>;
  software?: Array<{ code: string; name: string }>;
  datasets?: Array<{ code: string; name: string }>;
}

interface ResearchConnection {
  from: number;
  to: number;
  strength: 'strong' | 'medium' | 'weak';
}

const researchAreas: ResearchArea[] = [
  {
    id: 1,
    title: 'Deep Learning, NLU, Explainability & Neuro-Symbolic Systems',
    shortTitle: 'Deep Learning &\nExplainability',
    description: 'NLI evaluation, robustness testing, annotation artifacts, neuro-symbolic integration, symbolic inference with Coq, LLM critique and explanation.',
    methodology: 'computational',
    x: 150,
    y: 120,
    size: 32,
    publicationCount: 10,
    publications: [
      { code: 'Π3' },
      { code: 'Π7' },
      { code: 'Π19' },
      { code: 'Σ10' },
      { code: 'Σ17' },
      { code: 'Σ22' },
      { code: 'Σ29' },
      { code: 'Σ34' },
      { code: 'Σ35' },
      { code: 'Σ36' },
    ],
    software: [
      { code: 'S-3', name: 'MEDEA' },
      { code: 'S-5', name: 'RAG-to-Coq' },
      { code: 'S-11', name: 'DI_detector' },
    ],
  },
  {
    id: 2,
    title: 'Greek NLP, Dialects & Under-Resourced Languages',
    shortTitle: 'Greek NLP &\nDialects',
    description: 'GRDD/GRDD+ datasets, OYXOY/SuperOYXOY benchmarks, Krikri models, fine-grained entailment for Greek, dialect identification systems.',
    methodology: 'computational',
    x: 300,
    y: 80,
    size: 32,
    publicationCount: 5,
    publications: [
      { code: 'Σ1' },
      { code: 'Σ7' },
      { code: 'Σ8' },
      { code: 'Σ9' },
      { code: 'Σ15' },
    ],
    software: [
      { code: 'S-11', name: 'DI_detector' },
    ],
    datasets: [
      { code: 'DS-1', name: 'GRDD' },
      { code: 'DS-2', name: 'GRDD+' },
      { code: 'DS-3', name: 'OYXOY' },
      { code: 'DS-4', name: 'SuperOYXOY' },
      { code: 'DS-5', name: 'Krikri' },
      { code: 'DS-6', name: 'Greek Dialect Corpus' },
    ],
  },
  {
    id: 3,
    title: 'Arabic Dialect NLP & Language Distance Models',
    shortTitle: 'Arabic Dialects &\nLanguage Distance',
    description: 'Shami corpus, ATSAD sentiment analysis, computational dialectometry, multidimensional distance framework, LSTM-CNN sentiment models.',
    methodology: 'computational',
    x: 450,
    y: 60,
    size: 28,
    publicationCount: 5,
    publications: [
      { code: 'Π10' },
      { code: 'Σ28' },
      { code: 'Σ30' },
      { code: 'Σ37' },
      { code: 'Σ40' },
    ],
    software: [
      { code: 'S-7', name: 'Dialect Analyzer' },
      { code: 'S-10', name: 'Distance Calculator' },
    ],
    datasets: [
      { code: 'DS-7', name: 'Shami Corpus' },
      { code: 'DS-8', name: 'ATSAD' },
      { code: 'DS-9', name: 'Arabic Distance' },
      { code: 'DS-10', name: 'Sentiment Data' },
    ],
  },
  {
    id: 4,
    title: 'RAG & Knowledge-Enhanced LLMs',
    shortTitle: 'RAG & Knowledge-\nEnhanced LLMs',
    description: 'MEDEA-NEUMOUSA platform, RAG-to-Coq pipeline, TextCraft/Simasia systems, RAG poetry generation, Zeugma neuro-symbolic reasoning.',
    methodology: 'bridge',
    x: 100,
    y: 280,
    size: 30,
    publicationCount: 4,
    publications: [
      { code: 'Σ4' },
      { code: 'Σ6' },
      { code: 'Σ12' },
      { code: 'ΑΣ1' },
    ],
    software: [
      { code: 'S-1', name: 'MuVeS' },
      { code: 'S-2', name: 'Plot Analyzer' },
      { code: 'S-3', name: 'MEDEA' },
      { code: 'S-4', name: 'TextCraft' },
      { code: 'S-5', name: 'RAG-to-Coq' },
    ],
  },
  {
    id: 5,
    title: 'Type-Theoretical Semantics & Proof Assistants',
    shortTitle: 'Type Theory &\nProof Assistants',
    description: 'Martin-Löf Type Theory, Coq proof assistant, compositional semantics (adjectives, adverbs, copredication, coordination), formal verification.',
    methodology: 'formal',
    x: 650,
    y: 120,
    size: 32,
    publicationCount: 8,
    publications: [
      { code: 'Β4' },
      { code: 'Π5' },
      { code: 'Π6' },
      { code: 'Π15' },
      { code: 'Π19' },
      { code: 'Σ42' },
      { code: 'Σ46' },
      { code: 'Σ48' },
    ],
    software: [
      { code: 'S-12', name: 'Coq for NL Semantics' },
    ],
  },
  {
    id: 6,
    title: 'Probabilistic & Bayesian Semantics',
    shortTitle: 'Probabilistic &\nBayesian Semantics',
    description: 'Bayesian Inference Semantics, predicates-as-boxes model, compositional Bayesian pragmatics, Haskell implementation, Monte Carlo methods.',
    methodology: 'formal',
    x: 750,
    y: 240,
    size: 26,
    publicationCount: 5,
    publications: [
      { code: 'Β7' },
      { code: 'Σ25' },
      { code: 'Σ31' },
      { code: 'Σ32' },
      { code: 'Σ38' },
    ],
    software: [
      { code: 'S-13', name: 'Compositional Bayesian Semantics' },
    ],
  },
  {
    id: 7,
    title: 'AI for Digital Humanities',
    shortTitle: 'AI for Digital\nHumanities',
    description: 'Plot Analyzer for narrative analysis, MEDEA for classical philology, NATS text analysis suite, curriculum ontology extraction, diachronic corpus analysis.',
    methodology: 'bridge',
    x: 550,
    y: 350,
    size: 28,
    publicationCount: 4,
    publications: [
      { code: 'Σ2' },
      { code: 'Σ5' },
      { code: 'Σ6' },
      { code: 'Σ13' },
    ],
    software: [
      { code: 'S-2', name: 'Plot Analyzer' },
      { code: 'S-3', name: 'MEDEA' },
      { code: 'S-6', name: 'NATS' },
      { code: 'S-7', name: 'DH Tools' },
      { code: 'S-8', name: 'Corpus Tools' },
    ],
  },
  {
    id: 8,
    title: 'Dialogue Modelling & Incremental Processing',
    shortTitle: 'Dialogue Modelling &\nIncremental Processing',
    description: 'Split utterances, fragmentary answers, DNLI dataset, afterthoughts, shared utterances, Dynamic Syntax for dialogue and incremental parsing.',
    methodology: 'computational',
    x: 300,
    y: 420,
    size: 28,
    publicationCount: 8,
    publications: [
      { code: 'Β1' },
      { code: 'Β2' },
      { code: 'Π4' },
      { code: 'Π8' },
      { code: 'Π16' },
      { code: 'Σ14' },
      { code: 'Σ25' },
      { code: 'Σ26' },
    ],
    datasets: [
      { code: 'DS-4', name: 'Dialogue NLI (DNLI)' },
    ],
  },
  {
    id: 9,
    title: 'Formal Syntax of Greek & Diachronic Linguistics',
    shortTitle: 'Formal Syntax &\nDiachronic Linguistics',
    description: 'Clitic systems (Cypriot, Griko, Pontic, Northern Greek), Dynamic Syntax framework, PCC constraints, polydefinites, fieldwork data, cross-linguistic comparison.',
    methodology: 'formal',
    x: 700,
    y: 380,
    size: 32,
    publicationCount: 8,
    publications: [
      { code: 'Π1' },
      { code: 'Π12' },
      { code: 'Π16' },
      { code: 'Π20' },
      { code: 'Π21' },
      { code: 'Π22' },
      { code: 'Σ57' },
      { code: 'Σ58' },
    ],
    software: [
      { code: 'S-9', name: 'Syntax-Expert' },
    ],
  },
  {
    id: 10,
    title: 'Music & Language: Shared Processing',
    shortTitle: 'Music & Language:\nShared Processing',
    description: 'Polyrhythm processing, shared parsing mechanisms between music and language, Dynamic Syntax framework applied to music-language interaction.',
    methodology: 'formal',
    x: 550,
    y: 520,
    size: 22,
    publicationCount: 3,
    publications: [
      { code: 'Β11' },
      { code: 'ΑΣ23' },
      { code: 'ΑΣ26' },
    ],
  },
];

const connections: ResearchConnection[] = [
  // Strong connections (direct methodological links)
  { from: 1, to: 5, strength: 'strong' }, // Neuro-symbolic ↔ Type theory
  { from: 1, to: 4, strength: 'strong' }, // DL ↔ RAG (RAG-to-Coq)
  { from: 1, to: 2, strength: 'strong' }, // DL ↔ Greek NLP (NLI evaluation)
  { from: 2, to: 3, strength: 'strong' }, // Greek ↔ Arabic dialects (language distance)
  { from: 2, to: 9, strength: 'strong' }, // Greek dialects ↔ Formal syntax
  { from: 4, to: 5, strength: 'strong' }, // RAG-to-Coq pipeline
  { from: 4, to: 7, strength: 'strong' }, // MEDEA platform
  { from: 5, to: 6, strength: 'medium' }, // Both formal semantics approaches
  { from: 5, to: 8, strength: 'medium' }, // Dynamic Syntax in both
  { from: 5, to: 9, strength: 'medium' }, // Type theory ↔ Formal syntax
  { from: 8, to: 9, strength: 'medium' }, // Dialogue ↔ Formal syntax (Dynamic Syntax)
  { from: 8, to: 10, strength: 'medium' }, // Dialogue ↔ Music (shared mechanisms)
  { from: 7, to: 2, strength: 'medium' }, // DH ↔ Greek NLP
  { from: 1, to: 7, strength: 'medium' }, // Neuro-symbolic for DH
  { from: 3, to: 9, strength: 'weak' }, // Language distance ↔ Diachronic
];

const ResearchMap = () => {
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [expandedDetail, setExpandedDetail] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setDimensions({ width: w, height: Math.max(600, w * 0.67) });
      }
    };
    updateDimensions();
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const getConnectedAreas = (areaId: number): number[] => {
    return connections
      .filter(c => c.from === areaId || c.to === areaId)
      .flatMap(c => [c.from, c.to])
      .filter(id => id !== areaId);
  };

  const getConnectionStrength = (areaId: number, connectedId: number): ResearchConnection['strength'] | null => {
    const conn = connections.find(
      c => (c.from === areaId && c.to === connectedId) || (c.from === connectedId && c.to === areaId)
    );
    return conn ? conn.strength : null;
  };

  const isHighlighted = (areaId: number): boolean => {
    if (!hoveredNode && !selectedArea) return true;
    const focusId = hoveredNode || selectedArea;
    return areaId === focusId || getConnectedAreas(focusId!).includes(areaId);
  };

  const isEdgeHighlighted = (from: number, to: number): boolean => {
    if (!hoveredNode && !selectedArea) return true;
    const focusId = hoveredNode || selectedArea;
    return from === focusId! || to === focusId!;
  };

  const selectedAreaData = selectedArea ? researchAreas.find(a => a.id === selectedArea) : null;

  const methodologyColors = {
    computational: '#D06D48',
    formal: '#6E6A63',
    bridge: '#9E7B5A',
  };

  const scaleX = dimensions.width / 900;
  const scaleY = dimensions.height / 600;

  return (
    <div ref={containerRef} className="w-full bg-gradient-to-b from-[#E9E6E1] to-[#F5F3F0] rounded-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: methodologyColors.computational }}
            />
            <span className="text-xs font-medium text-[#6E6A63] uppercase tracking-tight">Computational</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: methodologyColors.formal }}
            />
            <span className="text-xs font-medium text-[#6E6A63] uppercase tracking-tight">Formal</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: methodologyColors.bridge }}
            />
            <span className="text-xs font-medium text-[#6E6A63] uppercase tracking-tight">Neuro-Symbolic Bridge</span>
          </div>
        </div>

        {/* SVG Map */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-[#D06D48]/10">
          <svg
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="w-full"
            style={{ maxHeight: '600px', minHeight: '400px' }}
          >
            {/* Connection lines */}
            {connections.map((conn, idx) => {
              const fromArea = researchAreas.find(a => a.id === conn.from)!;
              const toArea = researchAreas.find(a => a.id === conn.to)!;
              const highlighted = isEdgeHighlighted(conn.from, conn.to);

              const strokeWidthMap = {
                strong: 2,
                medium: 1.5,
                weak: 1,
              };

              const opacityMap = {
                strong: 0.25,
                medium: 0.15,
                weak: 0.08,
              };

              return (
                <line
                  key={`edge-${idx}`}
                  x1={fromArea.x * scaleX}
                  y1={fromArea.y * scaleY}
                  x2={toArea.x * scaleX}
                  y2={toArea.y * scaleY}
                  stroke="#111"
                  strokeWidth={highlighted ? strokeWidthMap[conn.strength] : strokeWidthMap[conn.strength] * 0.6}
                  strokeOpacity={highlighted ? opacityMap[conn.strength] : opacityMap[conn.strength] * 0.4}
                  strokeDasharray={conn.strength === 'weak' ? '3 3' : 'none'}
                  style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  pointerEvents="none"
                />
              );
            })}

            {/* Area nodes */}
            {researchAreas.map(area => {
              const highlighted = isHighlighted(area.id);
              const isSelected = selectedArea === area.id;
              const isHovered = hoveredNode === area.id;
              const color = methodologyColors[area.methodology];

              return (
                <g
                  key={`area-${area.id}`}
                  onMouseEnter={() => setHoveredNode(area.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => {
                    setSelectedArea(selectedArea === area.id ? null : area.id);
                    setExpandedDetail(true);
                  }}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  opacity={highlighted ? 1 : 0.25}
                >
                  {/* Glow effect for selected */}
                  {isSelected && (
                    <circle
                      cx={area.x * scaleX}
                      cy={area.y * scaleY}
                      r={(area.size * 1.4) * Math.min(scaleX, scaleY)}
                      fill={color}
                      fillOpacity={0.12}
                    />
                  )}

                  {/* Main circle */}
                  <circle
                    cx={area.x * scaleX}
                    cy={area.y * scaleY}
                    r={(area.size * (isHovered || isSelected ? 1.2 : 1)) * Math.min(scaleX, scaleY)}
                    fill={color}
                    fillOpacity={isHovered || isSelected ? 0.15 : 0.08}
                    stroke={color}
                    strokeWidth={isHovered || isSelected ? 2.5 : 1.5}
                    strokeOpacity={isHovered || isSelected ? 0.7 : 0.4}
                    style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />

                  {/* Label */}
                  <text
                    x={area.x * scaleX}
                    y={area.y * scaleY - 5}
                    textAnchor="middle"
                    fill={color}
                    fontSize={isHovered || isSelected ? 11 : 10}
                    fontWeight={isHovered || isSelected ? 700 : 600}
                    fontFamily="'Space Grotesk', sans-serif"
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      pointerEvents: 'none',
                    }}
                  >
                    {area.id}
                  </text>

                  {/* Publication count badge */}
                  <circle
                    cx={area.x * scaleX + 12 * Math.min(scaleX, scaleY)}
                    cy={area.y * scaleY - 10 * Math.min(scaleX, scaleY)}
                    r={5 * Math.min(scaleX, scaleY)}
                    fill="#D06D48"
                    fillOpacity={0.9}
                  />
                  <text
                    x={area.x * scaleX + 12 * Math.min(scaleX, scaleY)}
                    y={area.y * scaleY - 10 * Math.min(scaleX, scaleY)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={7}
                    fontWeight={700}
                    fontFamily="'Space Grotesk', sans-serif"
                    style={{ pointerEvents: 'none' }}
                  >
                    {area.publicationCount}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend explanation */}
        <div className="text-center text-xs text-[#6E6A63] mb-4">
          <p className="mb-2">Click on any area to see details. Circle size indicates publication count.</p>
        </div>

        {/* Detail panel */}
        {selectedAreaData && (
          <div
            ref={detailRef}
            className="bg-white rounded-lg border-l-4 p-6 shadow-sm transition-all"
            style={{ borderLeftColor: methodologyColors[selectedAreaData.methodology] }}
          >
            <div
              className="flex justify-between items-start gap-4 cursor-pointer"
              onClick={() => setExpandedDetail(!expandedDetail)}
            >
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xs font-semibold text-[#D06D48] uppercase tracking-tight">
                    Area {selectedAreaData.id}
                  </span>
                  <span className="text-xs text-[#6E6A63]">
                    {selectedAreaData.methodology === 'computational'
                      ? 'Computational'
                      : selectedAreaData.methodology === 'formal'
                        ? 'Formal & Theoretical'
                        : 'Neuro-Symbolic Bridge'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#111] mb-2">{selectedAreaData.title}</h3>
                {expandedDetail && (
                  <p className="text-sm text-[#6E6A63] leading-relaxed mb-4">{selectedAreaData.description}</p>
                )}
              </div>
              <button className="text-[#D06D48] flex-shrink-0 mt-1">
                {expandedDetail ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>

            {expandedDetail && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pt-4 border-t border-[#E9E6E1]">
                {/* Publications */}
                <div>
                  <h4 className="text-xs font-bold text-[#111] uppercase tracking-tight mb-3">
                    Key Publications ({selectedAreaData.publications.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAreaData.publications.map(pub => (
                      <span
                        key={pub.code}
                        className="inline-block bg-[#D06D48]/10 text-[#D06D48] text-xs font-semibold px-2 py-1 rounded"
                      >
                        {pub.code}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Software */}
                {selectedAreaData.software && selectedAreaData.software.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-[#111] uppercase tracking-tight mb-3">
                      Software ({selectedAreaData.software.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedAreaData.software.map(soft => (
                        <div key={soft.code} className="text-xs">
                          <span className="font-semibold text-[#6E6A63]">{soft.code}</span>
                          <span className="text-[#9E7B5A]">: {soft.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Datasets */}
                {selectedAreaData.datasets && selectedAreaData.datasets.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-[#111] uppercase tracking-tight mb-3">
                      Datasets ({selectedAreaData.datasets.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedAreaData.datasets.map(dataset => (
                        <div key={dataset.code} className="text-xs">
                          <span className="font-semibold text-[#6E6A63]">{dataset.code}</span>
                          <span className="text-[#9E7B5A]">: {dataset.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {expandedDetail && (
              <div className="mt-4 pt-4 border-t border-[#E9E6E1]">
                <h4 className="text-xs font-bold text-[#111] uppercase tracking-tight mb-3">
                  Related Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getConnectedAreas(selectedAreaData.id).map(connectedId => {
                    const strength = getConnectionStrength(selectedAreaData.id, connectedId);
                    const connectedArea = researchAreas.find(a => a.id === connectedId);
                    return (
                      <button
                        key={connectedId}
                        onClick={() => setSelectedArea(connectedId)}
                        className="text-xs px-3 py-1 rounded transition-colors"
                        style={{
                          backgroundColor:
                            strength === 'strong'
                              ? '#D06D48/20'
                              : strength === 'medium'
                                ? '#9E7B5A/15'
                                : '#6E6A63/10',
                          color:
                            strength === 'strong'
                              ? '#D06D48'
                              : strength === 'medium'
                                ? '#9E7B5A'
                                : '#6E6A63',
                          border: `1px solid ${
                            strength === 'strong'
                              ? '#D06D48/30'
                              : strength === 'medium'
                                ? '#9E7B5A/20'
                                : '#6E6A63/20'
                          }`,
                        }}
                        title={`${strength === 'strong' ? 'Strong' : strength === 'medium' ? 'Medium' : 'Weak'} connection`}
                      >
                        <span className="font-semibold">#{connectedId}</span> {connectedArea?.shortTitle.split('\n')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {!selectedAreaData && (
          <div className="text-center text-sm text-[#6E6A63] py-4">
            Click on any research area to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchMap;
