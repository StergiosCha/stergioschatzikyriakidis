import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { usePrefersReducedMotion } from '../hooks/use-reduced-motion';

gsap.registerPlugin(ScrollTrigger);

const BioSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  const scrollToNovelist = () => {
    const element = document.getElementById('novelist');
    if (!element) return;
    const allTriggers = ScrollTrigger.getAll();
    const pinTrigger = allTriggers.find(
      (st) => st.vars.pin && st.trigger === element
    );
    if (pinTrigger) {
      const target = pinTrigger.start + (pinTrigger.end - pinTrigger.start) * 0.5;
      window.scrollTo({ top: target, behavior: 'smooth' });
      setTimeout(() => ScrollTrigger.update(), 50);
      setTimeout(() => ScrollTrigger.update(), 200);
      setTimeout(() => ScrollTrigger.update(), 500);
    } else {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useLayoutEffect(() => {
    if (isMobile || reducedMotion) return;
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
  }, [isMobile, reducedMotion]);

  if (isMobile) {
    return (
      <section ref={sectionRef} id="bio" className="bg-paper px-6 py-16">
        <div className="w-full aspect-[3/4] max-h-[50vh] rounded-lg overflow-hidden mb-8">
          <img
            ref={portraitRef}
            src="/images/bio-portrait.jpg"
            alt="Stergios Chatzikyriakidis"
            className="img-cover"
          />
        </div>
        <span ref={labelRef} className="label">About</span>
        <h2 ref={headlineRef} className="text-ink mt-2 mb-6">Background</h2>
        <div ref={bodyRef}>
          <p className="text-ink leading-relaxed text-base">
            I am a Professor of Computational Linguistics at the University of Crete, where I direct the
            Computational Linguistics and Language Technology Lab. I am also Head of Research at MuVeS AI and
            founder of SimasiaAI. My work lies at the intersection of NLP, formal semantics and type theory,
            the reasoning and evaluation of large language models, computational dialectology and low-resource
            varieties.
          </p>
          <p className="text-ink leading-relaxed mt-4 text-base">
            I hold an MSc in Computational Linguistics and Formal Grammar and a PhD in Linguistics, both from
            King&apos;s College, London, after a BA in Greek Philology from Aristotle University, Thessaloniki.
            I have worked at Royal Holloway, CNRS, the Open University of Cyprus and the University of
            Gothenburg, where I was Associate Director of CLASP from 2016 to 2021.
          </p>
        </div>
        <div ref={ctaRef} className="mt-6">
          <a
            href="https://scholar.google.com/citations?user=dAYpE3MAAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <FileText size={18} />
            Google Scholar
          </a>
        </div>
        <p className="mt-4 text-mut text-sm">
          I am also a novelist.{' '}
          <a href="#novelist" onClick={(e) => { e.preventDefault(); scrollToNovelist(); }} className="text-terra hover:underline">
            See here
          </a>
        </p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="bio"
      className="pinned-section z-20"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="section-content">
        <div className="absolute overflow-hidden" style={{ left: '8vw', top: '18vh', width: '34vw', height: '64vh', borderRadius: '10px' }}>
          <img ref={portraitRef} src="/images/bio-portrait.jpg" alt="Stergios Chatzikyriakidis" className="img-cover" />
        </div>
        <span ref={labelRef} className="label absolute" style={{ left: '46vw', top: '14vh' }}>About</span>
        <h2 ref={headlineRef} className="absolute text-ink" style={{ left: '46vw', top: '20vh' }}>Background</h2>
        <div ref={bodyRef} className="absolute" style={{ left: '46vw', top: '34vh', width: '44vw' }}>
          <p className="text-ink leading-relaxed" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            I am a Professor of Computational Linguistics at the University of Crete, where I direct the
            Computational Linguistics and Language Technology Lab. I am also Head of Research at MuVeS AI and
            founder of SimasiaAI. My work lies at the intersection of NLP, formal semantics and type theory,
            the reasoning and evaluation of large language models, computational dialectology and low-resource
            varieties.
          </p>
          <p className="text-ink leading-relaxed mt-4" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            I hold an MSc in Computational Linguistics and Formal Grammar and a PhD in Linguistics, both from
            King&apos;s College, London, after a BA in Greek Philology from Aristotle University, Thessaloniki.
            I have worked at Royal Holloway, CNRS, the Open University of Cyprus and the University of
            Gothenburg, where I was Associate Director of CLASP from 2016 to 2021.
          </p>
          <div ref={ctaRef} className="flex flex-col gap-3 items-start mt-10">
            <a href="https://scholar.google.com/citations?user=dAYpE3MAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="btn-primary">
              <FileText size={18} />
              Google Scholar
            </a>
            <p className="text-mut" style={{ fontSize: 'clamp(12px, 1vw, 15px)' }}>
              I am also a novelist.{' '}
              <a href="#novelist" onClick={(e) => { e.preventDefault(); scrollToNovelist(); }} className="text-terra hover:underline">
                See here
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BioSection;
