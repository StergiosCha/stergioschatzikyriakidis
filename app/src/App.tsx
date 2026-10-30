import Navigation from './components/Navigation';
import { LangProvider, useT } from './i18n';
import BackgroundCanvas from './components/BackgroundCanvas';
import HeroSection from './sections/HeroSection';
import ProjectsSection from './sections/ProjectsSection';
import BioSection from './sections/BioSection';
import ResearchSection from './sections/ResearchSection';
import SoftwareSection from './sections/SoftwareSection';
import NovelistSection from './sections/NovelistSection';
import LiveAppsSection from './sections/LiveAppsSection';
import TeachingSection from './sections/TeachingSection';
import OutputsSection from './sections/OutputsSection';
import NewsResearchSection from './sections/NewsResearchSection';
import ContactSection from './sections/ContactSection';
import { useReveal } from './hooks/use-reveal';
import './App.css';

function Shell() {
  const { t } = useT();
  useReveal();
  return (
    <>
      <a className="skip-link" href="#main">{t('skip')}</a>
      <BackgroundCanvas />
      <div className="app" id="top">
        <Navigation />
        <main id="main">
          <HeroSection />
          <ProjectsSection />
          <div className="divider" />
          <BioSection />
          <ResearchSection />
          <SoftwareSection />
          <NovelistSection />
          <LiveAppsSection />
          <TeachingSection />
          <OutputsSection />
          <NewsResearchSection />
        </main>
        <ContactSection />
      </div>
    </>
  );
}

function App() {
  return <LangProvider><Shell /></LangProvider>;
}

export default App;
