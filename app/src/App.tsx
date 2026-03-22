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
import NewsResearchSection from './sections/NewsResearchSection';
import ContactSection from './sections/ContactSection';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
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
        <NewsResearchSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
