import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

const BioSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
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
          end: '+=130%',
          pin: true,
          scrub: 0.5,
        },
      });

      scrollTl.fromTo(portraitRef.current, { x: '-60vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo([labelRef.current, headlineRef.current], { x: '20vw', opacity: 0 }, { x: 0, opacity: 1, stagger: 0.02, ease: 'none' }, 0);
      scrollTl.fromTo(bodyRef.current, { y: '40vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.05);
      scrollTl.fromTo(ctaRef.current, { y: '12vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.1);
      scrollTl.to(portraitRef.current, { x: '-20vw', opacity: 0.25, ease: 'power2.in' }, 0.7);
      scrollTl.to([labelRef.current, headlineRef.current, bodyRef.current, ctaRef.current], { x: '18vw', opacity: 0.25, ease: 'power2.in' }, 0.7);
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) {
    return (
      <section ref={sectionRef} id="bio" className="bg-[#E9E6E1] px-6 py-16">
        <div className="w-full aspect-[3/4] max-h-[50vh] rounded-lg overflow-hidden mb-8">
          <img
            ref={portraitRef}
            src="/stergioschatzikyriakidis/images/bio-portrait.jpg"
            alt="Stergios Chatzikyriakidis"
            className="img-cover"
          />
        </div>
        <span ref={labelRef} className="label">About</span>
        <h2 ref={headlineRef} className="text-[#111] mt-2 mb-6">Background</h2>
        <div ref={bodyRef}>
          <p className="text-[#111] leading-relaxed text-base">
            I am a Professor of Computational Linguistics at the University of Crete. I earned my BA in
            Greek Philology specializing in Linguistics from Aristotle University, Thessaloniki. I continued
            my studies obtaining an MSc in Computational Linguistics and Formal Grammar, and a PhD in Linguistics,
            both from King&apos;s College, London.
          </p>
          <p className="text-[#111] leading-relaxed mt-4 text-base">
            I have worked at Royal Holloway, University of London, the French National Centre for Scientific
            Research (CNRS), the Open University of Cyprus and the University of Gothenburg. From 2016 until 2021,
            I was the Associate Director of the Center for Linguistic Theory and Studies in Probability (CLASP).
          </p>
        </div>
        <div ref={ctaRef} className="mt-6">
          <a
            href="https://scholar.google.com/scholar?q=Stergios+Chatzikyriakidis"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <FileText size={18} />
            Google Scholar
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="bio"
      className="pinned-section z-20"
      style={{ backgroundColor: '#E9E6E1' }}
    >
      <div className="section-content">
        <div className="absolute overflow-hidden" style={{ left: '8vw', top: '18vh', width: '34vw', height: '64vh', borderRadius: '10px' }}>
          <img ref={portraitRef} src="/stergioschatzikyriakidis/images/bio-portrait.jpg" alt="Stergios Chatzikyriakidis" className="img-cover" />
        </div>
        <span ref={labelRef} className="label absolute" style={{ left: '46vw', top: '14vh' }}>About</span>
        <h2 ref={headlineRef} className="absolute text-[#111]" style={{ left: '46vw', top: '20vh' }}>Background</h2>
        <div ref={bodyRef} className="absolute" style={{ left: '46vw', top: '34vh', width: '44vw' }}>
          <p className="text-[#111] leading-relaxed" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            I am a Professor of Computational Linguistics at the University of Crete. I earned my BA in
            Greek Philology specializing in Linguistics from Aristotle University, Thessaloniki. I continued
            my studies obtaining an MSc in Computational Linguistics and Formal Grammar, and a PhD in Linguistics,
            both from King&apos;s College, London.
          </p>
          <p className="text-[#111] leading-relaxed mt-4" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            I have worked at Royal Holloway, University of London, the French National Centre for Scientific
            Research (CNRS), the Open University of Cyprus and the University of Gothenburg. From 2016 until 2021,
            I was the Associate Director of the Center for Linguistic Theory and Studies in Probability (CLASP).
          </p>
        </div>
        <div ref={ctaRef} className="absolute flex gap-4" style={{ left: '46vw', top: '72vh' }}>
          <a href="https://scholar.google.com/scholar?q=Stergios+Chatzikyriakidis" target="_blank" rel="noopener noreferrer" className="btn-primary">
            <FileText size={18} />
            Google Scholar
          </a>
        </div>
      </div>
    </section>
  );
};

export default BioSection;
