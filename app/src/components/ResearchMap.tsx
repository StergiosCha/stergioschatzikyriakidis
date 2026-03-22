import { useState, useRef, useEffect } from 'react';

interface ResearchNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  group: 'core' | 'nlp' | 'formal' | 'applied' | 'resource';
}

interface ResearchEdge {
  from: string;
  to: string;
}

const nodes: ResearchNode[] = [
  // Core hub
  { id: 'comp-ling', label: 'Computational\nLinguistics', x: 400, y: 260, size: 38, color: '#D06D48', group: 'core' },

  // NLP cluster (left)
  { id: 'nli', label: 'Natural Language\nInference', x: 160, y: 140, size: 28, color: '#111', group: 'nlp' },
  { id: 'dialogue', label: 'Dialogue\nModelling', x: 100, y: 280, size: 24, color: '#111', group: 'nlp' },
  { id: 'sentiment', label: 'Sentiment\nAnalysis', x: 130, y: 410, size: 22, color: '#111', group: 'nlp' },
  { id: 'metaphor', label: 'Metaphor\nDetection', x: 250, y: 440, size: 20, color: '#111', group: 'nlp' },
  { id: 'rag', label: 'RAG & LLM\nGeneration', x: 260, y: 120, size: 26, color: '#111', group: 'nlp' },

  // Formal cluster (right)
  { id: 'mtt', label: 'Type-Theoretical\nSemantics', x: 620, y: 140, size: 28, color: '#6E6A63', group: 'formal' },
  { id: 'itp', label: 'Theorem Proving\nfor NL', x: 700, y: 270, size: 24, color: '#6E6A63', group: 'formal' },
  { id: 'formal-syntax', label: 'Formal\nSyntax', x: 660, y: 400, size: 22, color: '#6E6A63', group: 'formal' },
  { id: 'prob-sem', label: 'Probabilistic\nSemantics', x: 540, y: 420, size: 22, color: '#6E6A63', group: 'formal' },

  // Applied / interdisciplinary (bottom)
  { id: 'neuro-sym', label: 'Neuro-Symbolic\nNLP', x: 400, y: 100, size: 26, color: '#D06D48', group: 'applied' },
  { id: 'dialectology', label: 'Computational\nDialectology', x: 400, y: 440, size: 24, color: '#9E7B5A', group: 'resource' },
  { id: 'dh', label: 'Digital\nHumanities', x: 530, y: 340, size: 20, color: '#9E7B5A', group: 'applied' },
  { id: 'under-res', label: 'Under-Resourced\nLanguages', x: 260, y: 320, size: 22, color: '#9E7B5A', group: 'resource' },
];

const edges: ResearchEdge[] = [
  // Core connections
  { from: 'comp-ling', to: 'nli' },
  { from: 'comp-ling', to: 'dialogue' },
  { from: 'comp-ling', to: 'mtt' },
  { from: 'comp-ling', to: 'neuro-sym' },
  { from: 'comp-ling', to: 'dialectology' },
  { from: 'comp-ling', to: 'under-res' },
  { from: 'comp-ling', to: 'dh' },
  // NLP internal
  { from: 'nli', to: 'rag' },
  { from: 'nli', to: 'dialogue' },
  { from: 'sentiment', to: 'metaphor' },
  { from: 'dialogue', to: 'sentiment' },
  { from: 'rag', to: 'neuro-sym' },
  // Formal internal
  { from: 'mtt', to: 'itp' },
  { from: 'mtt', to: 'prob-sem' },
  { from: 'itp', to: 'formal-syntax' },
  { from: 'formal-syntax', to: 'prob-sem' },
  // Cross-cluster
  { from: 'neuro-sym', to: 'mtt' },
  { from: 'neuro-sym', to: 'nli' },
  { from: 'dialectology', to: 'under-res' },
  { from: 'dh', to: 'itp' },
  { from: 'dh', to: 'dialectology' },
  { from: 'metaphor', to: 'under-res' },
  { from: 'prob-sem', to: 'comp-ling' },
  { from: 'sentiment', to: 'under-res' },
];

const groupLabels: Record<string, string> = {
  core: 'Central Focus',
  nlp: 'NLP & Machine Learning',
  formal: 'Formal & Theoretical',
  applied: 'Neuro-Symbolic & DH',
  resource: 'Languages & Resources',
};

const groupColors: Record<string, string> = {
  core: '#D06D48',
  nlp: '#111',
  formal: '#6E6A63',
  applied: '#D06D48',
  resource: '#9E7B5A',
};

const ResearchMap = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 520 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setDimensions({ width: w, height: Math.min(520, w * 0.65) });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const scaleX = dimensions.width / 800;
  const scaleY = dimensions.height / 520;

  const getConnectedNodes = (nodeId: string) => {
    return edges
      .filter(e => e.from === nodeId || e.to === nodeId)
      .flatMap(e => [e.from, e.to])
      .filter(id => id !== nodeId);
  };

  const isHighlighted = (nodeId: string) => {
    if (!hoveredNode) return true;
    return nodeId === hoveredNode || getConnectedNodes(hoveredNode).includes(nodeId);
  };

  const isEdgeHighlighted = (edge: ResearchEdge) => {
    if (!hoveredNode) return true;
    return edge.from === hoveredNode || edge.to === hoveredNode;
  };

  return (
    <div ref={containerRef} className="w-full">
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full"
        style={{ maxHeight: '520px' }}
      >
        {/* Edges */}
        {edges.map((edge, idx) => {
          const fromNode = nodes.find(n => n.id === edge.from)!;
          const toNode = nodes.find(n => n.id === edge.to)!;
          const highlighted = isEdgeHighlighted(edge);
          return (
            <line
              key={idx}
              x1={fromNode.x * scaleX}
              y1={fromNode.y * scaleY}
              x2={toNode.x * scaleX}
              y2={toNode.y * scaleY}
              stroke={highlighted ? '#111' : '#111'}
              strokeWidth={highlighted ? 1 : 0.5}
              strokeOpacity={hoveredNode ? (highlighted ? 0.25 : 0.05) : 0.12}
              strokeDasharray={highlighted && hoveredNode ? 'none' : '4 4'}
              style={{ transition: 'all 0.3s ease' }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const highlighted = isHighlighted(node.id);
          const isHovered = hoveredNode === node.id;
          const lines = node.label.split('\n');
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              opacity={hoveredNode ? (highlighted ? 1 : 0.15) : 1}
            >
              <circle
                cx={node.x * scaleX}
                cy={node.y * scaleY}
                r={node.size * (isHovered ? 1.15 : 1) * Math.min(scaleX, scaleY)}
                fill={node.color}
                fillOpacity={isHovered ? 0.15 : 0.08}
                stroke={node.color}
                strokeWidth={isHovered ? 2 : 1}
                strokeOpacity={isHovered ? 0.6 : 0.3}
                style={{ transition: 'all 0.3s ease' }}
              />
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={node.x * scaleX}
                  y={node.y * scaleY + (i - (lines.length - 1) / 2) * 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={node.color}
                  fontSize={node.group === 'core' ? 11 : 10}
                  fontFamily="'Space Grotesk', sans-serif"
                  fontWeight={node.group === 'core' || isHovered ? 600 : 500}
                  style={{ transition: 'all 0.3s ease', pointerEvents: 'none' }}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {Object.entries(groupLabels).filter(([key]) => key !== 'core').map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupColors[key] }} />
            <span className="text-[10px] font-mono text-[#6E6A63] uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchMap;
