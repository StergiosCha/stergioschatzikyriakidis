import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { useT } from '../i18n';

class VizBoundary extends Component<{ children: ReactNode; message: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="info-card muted text-[13px]" role="status">{this.props.message}</div>;
    return this.props.children;
  }
}

const Placeholder = ({ minHeight, label }: { minHeight: number; label: string }) => {
  const { t } = useT();
  return (
    <div className="panel flex items-center justify-center" style={{ minHeight }} role="status">
      <span className="mono text-[11px] muted">{t('load.loading', { label })}</span>
    </div>
  );
};

/** Mounts its (lazy) children only when the placeholder comes within 600px of the viewport, so the
 *  visualisation chunks are fetched on demand. `eager` mounts immediately (e.g. after a user click). */
export default function Deferred({ children, minHeight = 320, label, eager = false }: { children: ReactNode; minHeight?: number; label: string; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useT();
  const [show, setShow] = useState(eager);
  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setShow(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some(e => e.isIntersecting)) { setShow(true); io.disconnect(); } }, { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, [show]);
  return (
    <div ref={ref} data-deferred={label}>
      {show ? (
        <VizBoundary message={t('load.failed')}>
          <Suspense fallback={<Placeholder minHeight={minHeight} label={label} />}>{children}</Suspense>
        </VizBoundary>
      ) : <Placeholder minHeight={minHeight} label={label} />}
    </div>
  );
}

// Lazily loaded visualisation chunks
export const LazyAtlasGraph = lazy(() => import('./viz/AtlasGraph'));
export const LazySvarnaRegisters = lazy(() => import('./viz/SvarnaRegisters'));
export const LazyTreeEmbed = lazy(() => import('./viz/TreeEmbed'));
export const LazyLingEmbedLab = lazy(() => import('./viz/LingEmbedLab'));
export const LazyDialectBars = lazy(() => import('./viz/DialectBars'));
export const LazyResearchNetwork = lazy(() => import('./ResearchNetwork'));
export const LazyYearChart = lazy(() => import('./viz/YearChart'));
export const LazyToolMap = lazy(() => import('./viz/ToolMap'));
export const LazyZeugma = lazy(() => import('./viz/ZeugmaFigure'));
export const LazyTimeline = lazy(() => import('./viz/Timeline'));
