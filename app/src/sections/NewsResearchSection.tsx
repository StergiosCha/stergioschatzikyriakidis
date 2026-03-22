import { useState } from 'react';
import { ChevronDown, Newspaper, Map } from 'lucide-react';
import { news } from '../data/news';
import ResearchMap from '../components/ResearchMap';

const NewsResearchSection = () => {
  const [showNews, setShowNews] = useState(true);
  const [showResearchMap, setShowResearchMap] = useState(false);

  return (
    <section
      id="news-research"
      className="relative z-[60] py-16"
      style={{ backgroundColor: '#E9E6E1' }}
    >
      <div className="px-[4vw] lg:px-[6vw] max-w-[1800px] mx-auto">
        {/* Toggle buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setShowNews(!showNews)}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-[#111]/10 bg-white/60 hover:bg-white/80 hover:border-[#D06D48]/30 transition-all duration-200 text-sm font-medium text-[#111]"
          >
            <Newspaper size={16} className="text-[#D06D48]" />
            Latest News
            <ChevronDown size={14} className={`text-[#6E6A63] transition-transform duration-200 ${showNews ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => setShowResearchMap(!showResearchMap)}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-[#111]/10 bg-white/60 hover:bg-white/80 hover:border-[#D06D48]/30 transition-all duration-200 text-sm font-medium text-[#111]"
          >
            <Map size={16} className="text-[#D06D48]" />
            Research Landscape
            <ChevronDown size={14} className={`text-[#6E6A63] transition-transform duration-200 ${showResearchMap ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* News & Updates */}
        {showNews && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {news.map((item, idx) => (
                <div key={idx} className="bg-white/60 rounded-lg p-4 border border-[#111]/5 hover:border-[#D06D48]/30 transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-medium text-[#D06D48] bg-[#D06D48]/10 px-2 py-0.5 rounded">{item.date}</span>
                    <span className="text-[10px] font-mono text-[#6E6A63] uppercase">{item.type}</span>
                  </div>
                  <p className="text-xs text-[#111] leading-relaxed">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-[#D06D48] transition-colors">
                        {item.text} →
                      </a>
                    ) : item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Research Map */}
        {showResearchMap && (
          <div>
            <div className="bg-white/40 rounded-xl p-6 border border-[#111]/5">
              <ResearchMap />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsResearchSection;
