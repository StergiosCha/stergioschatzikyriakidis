import { useState } from 'react';
import { ChevronDown, Map } from 'lucide-react';
import { news } from '../data/news';
import ResearchMap from '../components/ResearchMap';

const NewsResearchSection = () => {
  const [showResearchMap, setShowResearchMap] = useState(true);

  return (
    <section
      id="news-research"
      className="relative z-[60] py-16"
      style={{ backgroundColor: 'var(--bg-alt)', scrollMarginTop: '4rem' }}
    >
      {/* Top divider line */}
      <div className="px-[4vw] lg:px-[6vw] max-w-[1800px] mx-auto mb-10">
        <div className="h-px bg-ink/10" />
      </div>

      <div className="px-[4vw] lg:px-[6vw] max-w-[1800px] mx-auto">
        {/* Latest News - always visible */}
        <div className="mb-12">
          <h2
            className="text-2xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}
          >
            Latest News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {news.map((item, idx) => (
              <div key={idx} className="bg-surface/60 rounded-lg p-4 border border-ink/5 hover:border-terra/30 transition-all duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-medium text-terra bg-terra/10 px-2 py-0.5 rounded">{item.date}</span>
                  <span className="text-[10px] font-mono text-mut uppercase">{item.type}</span>
                </div>
                <p className="text-xs text-ink leading-relaxed">
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-terra transition-colors">
                      {item.text} →
                    </a>
                  ) : item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Research Map - collapsible */}
        <div>
          <button
            onClick={() => setShowResearchMap(!showResearchMap)}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-ink/10 bg-surface/60 hover:bg-surface/80 hover:border-terra/30 transition-all duration-200 text-sm font-medium text-ink mb-6"
          >
            <Map size={16} className="text-terra" />
            Research Landscape
            <ChevronDown size={14} className={`text-mut transition-transform duration-200 ${showResearchMap ? 'rotate-180' : ''}`} />
          </button>
          {showResearchMap && (
            <div className="bg-surface/40 rounded-xl p-6 border border-ink/5">
              <ResearchMap />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsResearchSection;
