import { useEffect, useState } from 'react';
import { publications, abstracts } from '../data/publications';
import { conferenceTalks, invitedTalks, posters } from '../data/talks';
import { tools } from '../data/tools';

interface OpenAlexStats {
  citations: number;
  hIndex: number;
  works: number;
}

const CACHE_KEY = 'openalex-stats-v1';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

const readCache = (): OpenAlexStats | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { at, data } = JSON.parse(cached);
      if (Date.now() - at < CACHE_TTL) return data as OpenAlexStats;
    }
  } catch { /* noop */ }
  return null;
};

const useOpenAlexStats = (): OpenAlexStats | null => {
  const [stats, setStats] = useState<OpenAlexStats | null>(readCache);

  useEffect(() => {
    if (stats) return;
    const controller = new AbortController();
    fetch(
      'https://api.openalex.org/authors?search=Stergios%20Chatzikyriakidis&per-page=5',
      { signal: controller.signal }
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json) => {
        const results: Array<{
          cited_by_count?: number;
          works_count?: number;
          summary_stats?: { h_index?: number };
        }> = json?.results ?? [];
        if (results.length === 0) return;
        // Pick the profile with the largest citation count (dedups stray profiles)
        const best = results.reduce((a, b) =>
          (b.cited_by_count ?? 0) > (a.cited_by_count ?? 0) ? b : a
        );
        const data: OpenAlexStats = {
          citations: best.cited_by_count ?? 0,
          hIndex: best.summary_stats?.h_index ?? 0,
          works: best.works_count ?? 0,
        };
        if (data.citations > 0) {
          setStats(data);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
          } catch { /* noop */ }
        }
      })
      .catch(() => { /* metrics are optional — fail silently */ });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return stats;
};

const MetricsBand = () => {
  const stats = useOpenAlexStats();
  const pubCount = publications.length + abstracts.length;
  const talkCount = invitedTalks.length + conferenceTalks.length + posters.length;
  const liveAppCount = tools.filter((t) => t.category === 'application' && t.platformUrl).length;

  const items: Array<{ value: string; label: string }> = [
    { value: `${pubCount}`, label: 'Publications' },
    { value: `${talkCount}`, label: 'Talks & posters' },
    { value: `${liveAppCount}`, label: 'Live apps' },
  ];
  if (stats) {
    items.push(
      { value: stats.citations.toLocaleString('en-US'), label: 'Citations' },
      { value: `${stats.hIndex}`, label: 'h-index' }
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-10">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-ink/5 bg-surface/50 px-4 py-3 text-center"
        >
          <div className="font-display font-semibold text-ink text-xl lg:text-2xl leading-none">
            {item.value}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-mut mt-1.5">
            {item.label}
          </div>
        </div>
      ))}
      {stats && (
        <div className="col-span-3 sm:col-span-5 text-right -mt-1">
          <a
            href="https://openalex.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-mut/70 hover:text-terra"
          >
            citation data via OpenAlex
          </a>
        </div>
      )}
    </div>
  );
};

export default MetricsBand;
