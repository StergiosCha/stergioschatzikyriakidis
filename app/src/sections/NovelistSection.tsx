import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const NovelistSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
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

      // ENTRANCE (0-30%)
      // Novelist photo
      scrollTl.fromTo(
        photoRef.current,
        { x: '-60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      // H2 + body + CTA
      scrollTl.fromTo(
        [headlineRef.current, bodyRef.current, ctaRef.current],
        { x: '30vw', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0
      );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl.to(
        photoRef.current,
        { x: '-18vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        [headlineRef.current, bodyRef.current, ctaRef.current],
        { y: '12vh', opacity: 0.25, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="novelist"
      className="pinned-section z-50"
      style={{ backgroundColor: '#E9E6E1' }}
    >
      <div className="section-content">
        {/* Book Cover Collage */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: '6vw',
            top: '15vh',
            width: '40vw',
            height: '70vh',
            borderRadius: '10px',
          }}
        >
          <img
            ref={photoRef}
            src="/stergioschatzikyriakidis/images/novelist-collage.jpg"
            alt="Book covers"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="absolute text-[#111]"
          style={{
            left: '52vw',
            top: '18vh',
          }}
        >
          Novelist
        </h2>

        {/* Body Copy */}
        <div
          ref={bodyRef}
          className="absolute"
          style={{
            left: '52vw',
            top: '32vh',
            width: '40vw',
          }}
        >
          <p className="text-[#111] leading-relaxed" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            Beyond academia, I write fiction. I have published four novels in Greek and three
            short story collections (one in English).
          </p>
        </div>

        {/* CTA */}
        <a
          ref={ctaRef}
          href="https://sites.google.com/view/stergioschatzikyriakidis/home"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary absolute"
          style={{
            left: '52vw',
            top: '68vh',
          }}
        >
          Visit my literary site
          <ExternalLink size={18} />
        </a>
      </div>
    </section>
  );
};

export default NovelistSection;
