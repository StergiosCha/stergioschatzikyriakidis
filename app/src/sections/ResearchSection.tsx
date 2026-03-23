import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

const ResearchSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
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

      scrollTl.fromTo(photoRef.current, { x: '-60vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo([headlineRef.current, bodyRef.current, ctaRef.current], { x: '30vw', opacity: 0 }, { x: 0, opacity: 1, stagger: 0.02, ease: 'none' }, 0);
      scrollTl.to(photoRef.current, { y: '20vh', opacity: 0.25, ease: 'power2.in' }, 0.7);
      scrollTl.to([headlineRef.current, bodyRef.current, ctaRef.current], { x: '-18vw', opacity: 0.25, ease: 'power2.in' }, 0.7);
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
      <section ref={sectionRef} id="research" className="bg-[#E9E6E1] px-6 py-16">
        <div className="w-full aspect-[4/3] max-h-[40vh] rounded-lg overflow-hidden mb-8">
          <img ref={photoRef} src="/stergioschatzikyriakidis/images/research-zeugma.png" alt="Zeugma Neuro-Symbolic Reasoning System" className="img-cover" />
        </div>
        <h2 ref={headlineRef} className="text-[#111] mb-6">Research interests</h2>
        <div ref={bodyRef}>
          <p className="text-[#111] leading-relaxed text-base">
            My research interests lie at the intersection of Natural Language Processing (NLP),
            Neuro-Symbolic AI, and Theoretical Linguistics. My work spans Natural Language Inference,
            Dialogue Modelling, Retrieval-Augmented Generation (RAG)-assisted LLM generation, Semantic
            Parsing, Sentiment Analysis, Metaphor Detection, Formal Semantics and Syntax, Interactive
            Theorem Proving for natural language semantics, Computational Dialectology, Constructive
            Type-Theoretical Semantics and their computational implementation.
          </p>
          <p className="text-[#111] leading-relaxed mt-4 text-base">
            I also work on Probabilistic Semantics, developing NLP resources for under-resourced
            languages, and exploring the interaction between symbolic logic-based approaches and
            Machine Learning/Deep Learning methods for linguistic problems.
          </p>
        </div>
        <a
          ref={ctaRef}
          href="#outputs"
          onClick={(e) => { e.preventDefault(); scrollToOutputs(); }}
          className="btn-primary mt-6 inline-flex"
        >
          See selected publications
          <ArrowRight size={18} />
        </a>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="research" className="pinned-section z-30" style={{ backgroundColor: '#E9E6E1' }}>
      <div className="section-content">
        <div className="absolute overflow-hidden" style={{ left: '10vw', top: '30vh', width: '36vw', height: '52vh', borderRadius: '10px' }}>
          <img ref={photoRef} src="/stergioschatzikyriakidis/images/research-zeugma.png" alt="Zeugma Neuro-Symbolic Reasoning System" className="img-cover" />
        </div>
        <h2 ref={headlineRef} className="absolute text-[#111]" style={{ left: '52vw', top: '18vh', width: '40vw' }}>Research interests</h2>
        <div ref={bodyRef} className="absolute" style={{ left: '52vw', top: '32vh', width: '40vw' }}>
          <p className="text-[#111] leading-relaxed" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            My research interests lie at the intersection of Natural Language Processing (NLP),
            Neuro-Symbolic AI, and Theoretical Linguistics. My work spans Natural Language Inference,
            Dialogue Modelling, Retrieval-Augmented Generation (RAG)-assisted LLM generation, Semantic
            Parsing, Sentiment Analysis, Metaphor Detection, Formal Semantics and Syntax, Interactive
            Theorem Proving for natural language semantics, Computational Dialectology, Constructive
            Type-Theoretical Semantics and their computational implementation.
          </p>
          <p className="text-[#111] leading-relaxed mt-4" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            I also work on Probabilistic Semantics, developing NLP resources for under-resourced
            languages, and exploring the interaction between symbolic logic-based approaches and
            Machine Learning/Deep Learning methods for linguistic problems.
          </p>
        </div>
        <a ref={ctaRef} href="#outputs" onClick={(e) => { e.preventDefault(); scrollToOutputs(); }} className="btn-primary absolute" style={{ left: '52vw', top: '82vh' }}>
          See selected publications
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default ResearchSection;
