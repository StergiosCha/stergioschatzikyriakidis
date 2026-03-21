import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Auto-play entrance animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Accent ring entrance
      tl.fromTo(
        ringRef.current,
        { scale: 0.85, rotation: -12, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.9 },
        0
      );

      // Portrait entrance
      tl.fromTo(
        portraitRef.current,
        { x: '-8vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
        0.08
      );

      // Headline entrance
      tl.fromTo(
        headlineRef.current,
        { x: '10vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
        0.14
      );

      // Subtitle + CTA entrance
      tl.fromTo(
        [subtitleRef.current, ctaRef.current],
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
        0.28
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
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

      // Phase 3 (70-100%): Exit animations
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
  }, []);

  const scrollToOutputs = () => {
    const element = document.getElementById('outputs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="pinned-section z-10"
      style={{ backgroundColor: '#E9E6E1' }}
    >
      <div className="section-content">

        {/* Portrait Image - wider, less height */}
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

        {/* Headline */}
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

        {/* Subtitle */}
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

        {/* CTA Button */}
        <a
          ref={ctaRef}
          href="#outputs"
          onClick={(e) => {
            e.preventDefault();
            scrollToOutputs();
          }}
          className="btn-primary absolute"
          style={{
            left: '56vw',
            top: '58vh',
          }}
        >
          View research outputs
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
