import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Database } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SoftwareSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const triangleRef = useRef<SVGSVGElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
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

      // ENTRANCE (0-30%)
      // Accent triangle
      scrollTl.fromTo(
        triangleRef.current,
        { x: '60vw', y: '40vh', scale: 0.5, opacity: 0 },
        { x: 0, y: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Software photo
      scrollTl.fromTo(
        photoRef.current,
        { x: '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      // H2 + body + CTAs
      scrollTl.fromTo(
        [headlineRef.current, bodyRef.current, ctaRef.current],
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0
      );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl.to(
        triangleRef.current,
        { rotation: 25, scale: 1.2, opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        photoRef.current,
        { x: '20vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        [headlineRef.current, bodyRef.current, ctaRef.current],
        { y: '-12vh', opacity: 0.25, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSoftware = () => {
    const element = document.getElementById('outputs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="software"
      className="pinned-section z-40"
      style={{ backgroundColor: '#E9E6E1' }}
    >
      <div className="section-content">
        {/* Accent Triangle */}
        <svg
          ref={triangleRef}
          className="accent-shape"
          style={{
            right: '6vw',
            bottom: '10vh',
            width: '34vw',
            height: '34vw',
          }}
          viewBox="0 0 200 200"
        >
          <polygon
            points="100,20 180,180 20,180"
            fill="#D06D48"
          />
        </svg>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="absolute text-[#111]"
          style={{
            left: '8vw',
            top: '16vh',
            width: '46vw',
          }}
        >
          Software, Apps
          <br />
          & Datasets
        </h2>

        {/* Body Copy */}
        <div
          ref={bodyRef}
          className="absolute"
          style={{
            left: '8vw',
            top: '38vh',
            width: '44vw',
          }}
        >
          <p className="text-[#111] leading-relaxed" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            We build resources for under-resourced languages and neural-symbolic NLP: dialect 
            identification, NLI benchmarks, dialogue systems, and RAG-assisted pipelines—often 
            with a focus on Greek and dialectal varieties.
          </p>
          <p className="text-[#111] leading-relaxed mt-4" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            Our tools include AI research assistants, classical philology platforms, text editors 
            with grammatical analysis, linguistic distance calculators, and comprehensive datasets 
            for Greek dialectology and natural language inference.
          </p>
        </div>

        {/* CTA Row */}
        <div
          ref={ctaRef}
          className="absolute flex gap-4"
          style={{
            left: '8vw',
            top: '68vh',
          }}
        >
          <a
            href="#outputs"
            onClick={(e) => {
              e.preventDefault();
              scrollToSoftware();
            }}
            className="btn-primary"
          >
            <ArrowRight size={18} />
            Explore tools
          </a>
          <a
            href="#outputs"
            onClick={(e) => {
              e.preventDefault();
              scrollToSoftware();
            }}
            className="btn-secondary"
          >
            <Database size={18} />
            View datasets
          </a>
        </div>

        {/* Software Photo */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: '56vw',
            top: '18vh',
            width: '36vw',
            height: '60vh',
            borderRadius: '10px',
          }}
        >
          <img
            ref={photoRef}
            src="/stergioschatzikyriakidis/images/software-medea.png"
            alt="MEDEA-NEUMOUSA Platform"
            className="img-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default SoftwareSection;
