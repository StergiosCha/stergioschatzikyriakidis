import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Database } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

const SoftwareSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.5,
        },
      });

      scrollTl.fromTo(photoRef.current, { x: '60vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo([headlineRef.current, bodyRef.current, ctaRef.current], { x: '-40vw', opacity: 0 }, { x: 0, opacity: 1, stagger: 0.02, ease: 'none' }, 0);
      scrollTl.to(photoRef.current, { x: '20vw', opacity: 0.25, ease: 'power2.in' }, 0.7);
      scrollTl.to([headlineRef.current, bodyRef.current, ctaRef.current], { y: '-12vh', opacity: 0.25, ease: 'power2.in' }, 0.7);
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  const scrollToOutputsTab = (tab: string) => {
    window.dispatchEvent(new CustomEvent('switchOutputTab', { detail: tab }));
    const element = document.getElementById('outputs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isMobile) {
    return (
      <section ref={sectionRef} id="software" className="bg-[#E9E6E1] px-6 py-16">
        <h2 ref={headlineRef} className="text-[#111] mb-6">
          Software, Apps
          <br />
          & Datasets
        </h2>
        <div ref={bodyRef}>
          <p className="text-[#111] leading-relaxed text-base">
            I build resources for under-resourced languages and neural-symbolic NLP: dialect
            identification, NLI benchmarks, dialogue systems, and RAG-assisted pipelines—often
            with a focus on Greek and dialectal varieties.
          </p>
          <p className="text-[#111] leading-relaxed mt-4 text-base">
            These include AI research assistants, classical philology platforms, text editors
            with grammatical analysis, linguistic distance calculators, and comprehensive datasets
            for Greek dialectology and natural language inference.
          </p>
        </div>
        <div ref={ctaRef} className="flex flex-wrap gap-3 mt-6">
          <a href="#outputs" onClick={(e) => { e.preventDefault(); scrollToOutputsTab('software'); }} className="btn-primary">
            <ArrowRight size={18} />
            Explore tools
          </a>
          <a href="#outputs" onClick={(e) => { e.preventDefault(); scrollToOutputsTab('software'); }} className="btn-secondary">
            <Database size={18} />
            View datasets
          </a>
        </div>
        <div className="w-full aspect-[4/3] max-h-[40vh] rounded-lg overflow-hidden mt-8">
          <img ref={photoRef} src="/stergioschatzikyriakidis/images/software-collage.jpg" alt="Software tools and platforms collage" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="software" className="pinned-section z-40" style={{ backgroundColor: '#E9E6E1' }}>
      <div className="section-content">
        <h2 ref={headlineRef} className="absolute text-[#111]" style={{ left: '8vw', top: '16vh', width: '46vw' }}>
          Software, Apps
          <br />
          & Datasets
        </h2>
        <div ref={bodyRef} className="absolute" style={{ left: '8vw', top: '38vh', width: '44vw' }}>
          <p className="text-[#111] leading-relaxed" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            I build resources for under-resourced languages and neural-symbolic NLP: dialect
            identification, NLI benchmarks, dialogue systems, and RAG-assisted pipelines—often
            with a focus on Greek and dialectal varieties.
          </p>
          <p className="text-[#111] leading-relaxed mt-4" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            These include AI research assistants, classical philology platforms, text editors
            with grammatical analysis, linguistic distance calculators, and comprehensive datasets
            for Greek dialectology and natural language inference.
          </p>
        </div>
        <div ref={ctaRef} className="absolute flex gap-4" style={{ left: '8vw', top: '68vh' }}>
          <a href="#outputs" onClick={(e) => { e.preventDefault(); scrollToOutputsTab('software'); }} className="btn-primary">
            <ArrowRight size={18} />
            Explore tools
          </a>
          <a href="#outputs" onClick={(e) => { e.preventDefault(); scrollToOutputsTab('software'); }} className="btn-secondary">
            <Database size={18} />
            View datasets
          </a>
        </div>
        <div className="absolute overflow-hidden" style={{ left: '56vw', top: '18vh', width: '36vw', height: '60vh', borderRadius: '10px' }}>
          <img ref={photoRef} src="/stergioschatzikyriakidis/images/software-collage.jpg" alt="Software tools and platforms collage" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </div>
    </section>
  );
};

export default SoftwareSection;
