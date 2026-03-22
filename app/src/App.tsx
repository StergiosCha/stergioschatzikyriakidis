import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import BioSection from './sections/BioSection';
import ResearchSection from './sections/ResearchSection';
import SoftwareSection from './sections/SoftwareSection';
import NovelistSection from './sections/NovelistSection';
import OutputsSection from './sections/OutputsSection';
import ContactSection from './sections/ContactSection';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Global scroll snap for pinned sections
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            // Find if we're inside a pinned range
            const currentPinned = pinnedRanges.find(
              r => value >= r.start - 0.01 && value <= r.end + 0.01
            );
            // If not inside any pinned section (e.g. scrolling through Outputs), don't snap
            if (!currentPinned) return value;
            // Snap to the center of the current pinned section
            return currentPinned.center;
          },
          duration: { min: 0.25, max: 0.6 },
          delay: 0.05,
          ease: 'power2.inOut',
        },
      });
    };

    // Delay to ensure all ScrollTriggers are created
    const timer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="app">
      <Navigation />
      <main className="main-content">
        <HeroSection />
        <BioSection />
        <ResearchSection />
        <SoftwareSection />
        <NovelistSection />
        <OutputsSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
