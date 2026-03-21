import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const BioSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
      // Accent circle
      scrollTl.fromTo(
        circleRef.current,
        { x: '60vw', scale: 0.6, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Portrait
      scrollTl.fromTo(
        portraitRef.current,
        { x: '-60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      // Label + Headline
      scrollTl.fromTo(
        [labelRef.current, headlineRef.current],
        { x: '20vw', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0
      );

      // Body card
      scrollTl.fromTo(
        bodyRef.current,
        { y: '40vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      // CTA row
      scrollTl.fromTo(
        ctaRef.current,
        { y: '12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      // SETTLE (30-70%): Hold positions

      // EXIT (70-100%)
      scrollTl.to(
        circleRef.current,
        { x: '30vw', scale: 1.15, opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        portraitRef.current,
        { x: '-20vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        [labelRef.current, headlineRef.current, bodyRef.current, ctaRef.current],
        { x: '18vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="bio"
      className="pinned-section z-20"
      style={{ backgroundColor: '#E9E6E1' }}
    >
      <div className="section-content">
        {/* Accent Circle */}
        <div
          ref={circleRef}
          className="accent-shape rounded-full"
          style={{
            right: '6vw',
            top: '10vh',
            width: '44vw',
            height: '44vw',
            backgroundColor: '#D06D48',
          }}
        />

        {/* Portrait Image */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: '8vw',
            top: '18vh',
            width: '34vw',
            height: '64vh',
            borderRadius: '10px',
          }}
        >
          <img
            ref={portraitRef}
            src="/images/bio-portrait.jpg"
            alt="Stergios Chatzikyriakidis"
            className="img-cover"
          />
        </div>

        {/* Label */}
        <span
          ref={labelRef}
          className="label absolute"
          style={{
            left: '46vw',
            top: '14vh',
          }}
        >
          About
        </span>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="absolute text-[#111]"
          style={{
            left: '46vw',
            top: '20vh',
          }}
        >
          Background
        </h2>

        {/* Body Copy */}
        <div
          ref={bodyRef}
          className="absolute"
          style={{
            left: '46vw',
            top: '34vh',
            width: '44vw',
          }}
        >
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

        {/* CTA Row */}
        <div
          ref={ctaRef}
          className="absolute flex gap-4"
          style={{
            left: '46vw',
            top: '72vh',
          }}
        >
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
      </div>
    </section>
  );
};

export default BioSection;
