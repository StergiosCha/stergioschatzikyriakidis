import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Download } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Auto-play entrance animation on mount (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        ringRef.current,
        { scale: 0.85, rotation: -12, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.9 },
        0
      );

      tl.fromTo(
        portraitRef.current,
        { x: '-8vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
        0.08
      );

      tl.fromTo(
        headlineRef.current,
        { x: '10vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
        0.14
      );

      tl.fromTo(
        [subtitleRef.current, ctaRef.current],
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
        0.28
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  // Scroll-driven exit animation (desktop only)
  useLayoutEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
          onLeaveBack: () => {
            gsap.set([ringRef.current, portraitRef.current, headlineRef.current, subtitleRef.current, ctaRef.current], {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
            });
          },
        },
      });

      scrollTl.fromTo(
        ringRef.current,
        { x: 0, scale: 1, rotation: 0, opacity: 1 },
        { x: '-18vw', scale: 1.25, rotation: 25, opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        portraitRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        [subtitleRef.current, ctaRef.current],
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0.2, ease: 'power2.in' },
        0.72
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  const scrollToOutputs = () => {
    window.dispatchEvent(new CustomEvent('switchOutputTab', { detail: 'publications' }));
    const element = document.getElementById('outputs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isMobile) {
    return (
      <section ref={sectionRef} id="hero" className="min-h-screen bg-[#E9E6E1] px-6 pt-24 pb-12 flex flex-col">
        <div className="w-full aspect-[3/4] max-h-[50vh] rounded-lg overflow-hidden mb-8">
          <img
            ref={portraitRef}
            src="/stergioschatzikyriakidis/images/hero-portrait.jpg"
            alt="Stergios Chatzikyriakidis"
            className="img-cover"
          />
        </div>
        <div ref={headlineRef}>
          <h1 className="text-[#111] leading-[1] text-4xl font-semibold">
            Stergios
            <br />
            Chatzikyriakidis
          </h1>
        </div>
        <p ref={subtitleRef} className="text-[#6E6A63] text-sm leading-relaxed mt-4">
          Professor of Computational Linguistics, University of Crete
          <br />
          Associate Researcher, Centre for Linguistic Theory and Studies in Probability (CLASP)
        </p>
        <div ref={ctaRef} className="flex flex-col gap-3 mt-6">
          <div className="flex flex-wrap gap-3">
            <a href="#outputs" onClick={(e) => { e.preventDefault(); scrollToOutputs(); }} className="btn-primary">
              View research outputs
              <ArrowRight size={18} />
            </a>
            <a href="/stergioschatzikyriakidis/cv_cha.pdf" download="cv_cha.pdf" className="btn-secondary">
              <Download size={18} />
              Download CV
            </a>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <a href="https://scholar.google.com/citations?user=dAYpE3MAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-[#6E6A63] hover:text-[#D06D48] transition-colors" title="Google Scholar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z"/></svg>
            </a>
            <a href="https://www.researchgate.net/profile/Stergios-Chatzikyriakidis" target="_blank" rel="noopener noreferrer" className="text-[#6E6A63] hover:text-[#D06D48] transition-colors" title="ResearchGate">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.586 0c-1.543.007-3.86 1.95-4.51 5.2-.39 1.97.164 3.39 1.205 4.46-1.156.82-2.35.88-3.188.29-.91-.64-.96-1.88-.34-2.59.44-.51.19-1.17-.47-.99-2.06.56-3.45 2.57-2.4 5.16.79 1.93 2.91 3.15 5.36 2.68-1.74 2.4-5.27 3.63-8.3 2.39C3.68 15.4 1.64 12.13 2.1 8.36 2.83 2.6 8.45-.4 13.5.06c2.44.22 4.52 1.36 5.56 3.03.6.97.78 1.93.68 2.72-.14 1.1-.92 1.73-1.73 1.38-.58-.25-.67-.9-.4-1.38.32-.57.35-1.32-.13-2C16.62 2.56 14.7 1.8 12.6 2c-3.76.36-6.6 3.52-6.12 7.37.45 3.57 3.6 6.14 7.15 5.84 1.58-.13 3.13-.92 4.1-2.1.45-.54.32-.56-.1-.36-1.27.6-2.83.67-4.18-.03-1.72-.88-2.55-2.77-1.88-4.57.2-.52.5-.98.87-1.35-.1-.23-.17-.47-.21-.72-.15-.98.14-2.06.87-2.72.58-.52.4-1.3-.32-1.13C8.28 3.3 4.57 7.1 4.57 11.72c0 5.23 4.49 9.35 9.87 8.9 4.95-.42 8.77-4.76 8.55-9.72C22.85 7.05 21.43 3.6 19.59 0z"/></svg>
            </a>
            <a href="https://github.com/StergiosCha" target="_blank" rel="noopener noreferrer" className="text-[#6E6A63] hover:text-[#D06D48] transition-colors" title="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://huggingface.co/Stergios" target="_blank" rel="noopener noreferrer" className="text-[#6E6A63] hover:text-[#D06D48] transition-colors" title="Hugging Face">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 7.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zm5 0a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM8.5 14.5s1 2 3.5 2 3.5-2 3.5-2"/></svg>
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="pinned-section z-10"
      style={{ backgroundColor: '#E9E6E1' }}
    >
      <div className="section-content">
        <div
          className="absolute overflow-hidden"
          style={{
            left: '10vw',
            top: '15vh',
            width: '38vw',
            height: '65vh',
            borderRadius: '10px',
          }}
        >
          <img
            ref={portraitRef}
            src="/stergioschatzikyriakidis/images/hero-portrait.jpg"
            alt="Stergios Chatzikyriakidis"
            className="img-cover"
          />
        </div>

        <div
          ref={headlineRef}
          className="absolute"
          style={{
            left: '56vw',
            top: '22vh',
            width: '40vw',
          }}
        >
          <h1 className="text-[#111] leading-[1]" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
            Stergios
            <br />
            Chatzikyriakidis
          </h1>
        </div>

        <p
          ref={subtitleRef}
          className="absolute text-[#6E6A63]"
          style={{
            left: '56vw',
            top: '46vh',
            width: '40vw',
            fontSize: 'clamp(11px, 1vw, 15px)',
            lineHeight: '1.6',
          }}
        >
          Professor of Computational Linguistics, University of Crete
          <br />
          Associate Researcher, Centre for Linguistic Theory and Studies in Probability (CLASP)
        </p>

        <div
          ref={ctaRef}
          className="absolute flex flex-col gap-4"
          style={{
            left: '56vw',
            top: '56vh',
          }}
        >
          <div className="flex gap-3">
            <a
              href="#outputs"
              onClick={(e) => {
                e.preventDefault();
                scrollToOutputs();
              }}
              className="btn-primary"
            >
              View research outputs
              <ArrowRight size={18} />
            </a>
            <a
              href="/stergioschatzikyriakidis/cv_cha.pdf"
              download="cv_cha.pdf"
              className="btn-secondary"
            >
              <Download size={18} />
              Download CV
            </a>
          </div>

          <div className="flex items-center gap-4 mt-1">
            <a href="https://scholar.google.com/citations?user=dAYpE3MAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-[#6E6A63] hover:text-[#D06D48] transition-colors" title="Google Scholar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z"/></svg>
            </a>
            <a href="https://www.researchgate.net/profile/Stergios-Chatzikyriakidis" target="_blank" rel="noopener noreferrer" className="text-[#6E6A63] hover:text-[#D06D48] transition-colors" title="ResearchGate">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.586 0c-1.543.007-3.86 1.95-4.51 5.2-.39 1.97.164 3.39 1.205 4.46-1.156.82-2.35.88-3.188.29-.91-.64-.96-1.88-.34-2.59.44-.51.19-1.17-.47-.99-2.06.56-3.45 2.57-2.4 5.16.79 1.93 2.91 3.15 5.36 2.68-1.74 2.4-5.27 3.63-8.3 2.39C3.68 15.4 1.64 12.13 2.1 8.36 2.83 2.6 8.45-.4 13.5.06c2.44.22 4.52 1.36 5.56 3.03.6.97.78 1.93.68 2.72-.14 1.1-.92 1.73-1.73 1.38-.58-.25-.67-.9-.4-1.38.32-.57.35-1.32-.13-2C16.62 2.56 14.7 1.8 12.6 2c-3.76.36-6.6 3.52-6.12 7.37.45 3.57 3.6 6.14 7.15 5.84 1.58-.13 3.13-.92 4.1-2.1.45-.54.32-.56-.1-.36-1.27.6-2.83.67-4.18-.03-1.72-.88-2.55-2.77-1.88-4.57.2-.52.5-.98.87-1.35-.1-.23-.17-.47-.21-.72-.15-.98.14-2.06.87-2.72.58-.52.4-1.3-.32-1.13C8.28 3.3 4.57 7.1 4.57 11.72c0 5.23 4.49 9.35 9.87 8.9 4.95-.42 8.77-4.76 8.55-9.72C22.85 7.05 21.43 3.6 19.59 0z"/></svg>
            </a>
            <a href="https://github.com/StergiosCha" target="_blank" rel="noopener noreferrer" className="text-[#6E6A63] hover:text-[#D06D48] transition-colors" title="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://huggingface.co/Stergios" target="_blank" rel="noopener noreferrer" className="text-[#6E6A63] hover:text-[#D06D48] transition-colors" title="Hugging Face">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 7.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zm5 0a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM8.5 14.5s1 2 3.5 2 3.5-2 3.5-2"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
