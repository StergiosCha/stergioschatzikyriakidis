import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.5,
        },
      });

      // ENTRANCE (0-30%)
      // Background overlay fade in
      scrollTl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'none' },
        0
      );

      // Accent circle
      scrollTl.fromTo(
        circleRef.current,
        { x: '60vw', scale: 0.7, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Text group
      scrollTl.fromTo(
        [headlineRef.current, bodyRef.current, emailRef.current, ctaRef.current],
        { y: '30vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0.05
      );

      // Footer
      scrollTl.fromTo(
        footerRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'none' },
        0.15
      );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%): Subtle fade to avoid blank
      scrollTl.to(
        [headlineRef.current, bodyRef.current, emailRef.current, ctaRef.current, circleRef.current],
        { opacity: 0.2, ease: 'power2.in' },
        0.85
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="pinned-section z-[70]"
      style={{ backgroundColor: '#E9E6E1' }}
    >
      {/* Dark overlay that fades in */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[#111]"
        style={{ opacity: 0 }}
      />

      <div className="section-content relative">
        {/* Accent Circle */}
        <div
          ref={circleRef}
          className="accent-shape rounded-full"
          style={{
            right: '6vw',
            top: '12vh',
            width: '34vw',
            height: '34vw',
            backgroundColor: '#D06D48',
          }}
        />

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="absolute text-[#E9E6E1]"
          style={{
            left: '8vw',
            top: '18vh',
          }}
        >
          Contact
        </h2>

        {/* Body */}
        <div
          ref={bodyRef}
          className="absolute"
          style={{
            left: '8vw',
            top: '34vh',
            width: '40vw',
          }}
        >
          <p className="text-[#E9E6E1]/80 leading-relaxed" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            Department of Philology
            <br />
            University of Crete
            <br />
            74100 Gallos, Rethymno
            <br />
            Greece
          </p>
        </div>

        {/* Email */}
        <a
          ref={emailRef}
          href="mailto:stergios.chatzikyriakidis@uoc.gr"
          className="absolute text-[#E9E6E1] hover:text-[#D06D48] transition-colors"
          style={{
            left: '8vw',
            top: '54vh',
            fontSize: 'clamp(14px, 1.2vw, 18px)',
          }}
        >
          stergios.chatzikyriakidis@uoc.gr
        </a>

        {/* CTA Row */}
        <div
          ref={ctaRef}
          className="absolute flex gap-4"
          style={{
            left: '8vw',
            top: '64vh',
          }}
        >
          <a
            href="mailto:stergios.chatzikyriakidis@uoc.gr"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D06D48] text-white rounded-lg hover:bg-[#B85A38] transition-colors"
          >
            <Mail size={18} />
            Send email
          </a>
        </div>

        {/* Footer */}
        <div
          ref={footerRef}
          className="absolute bottom-[6vh] left-[8vw]"
        >
          <p className="text-sm text-[#E9E6E1]/50">
            © {new Date().getFullYear()} Stergios Chatzikyriakidis
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
