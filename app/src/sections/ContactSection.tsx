import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (isMobile) return;
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

      scrollTl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, ease: 'power2.out' }, 0);
      scrollTl.fromTo([headlineRef.current, bodyRef.current, emailRef.current, ctaRef.current], { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.01, ease: 'power2.out' }, 0);
      scrollTl.fromTo(footerRef.current, { opacity: 0 }, { opacity: 1, ease: 'power2.out' }, 0.05);
      scrollTl.to([headlineRef.current, bodyRef.current, emailRef.current, ctaRef.current], { opacity: 0.3, ease: 'power2.in' }, 0.85);
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) {
    return (
      <section ref={sectionRef} id="contact" className="bg-[#111] px-6 py-16 min-h-[60vh] flex flex-col justify-center">
        <h2 ref={headlineRef} className="text-[#E9E6E1] mb-6">Contact</h2>
        <div ref={bodyRef}>
          <p className="text-[#E9E6E1]/80 leading-relaxed text-base">
            Department of Philology
            <br />
            University of Crete
            <br />
            74100 Gallos, Rethymno
            <br />
            Greece
          </p>
        </div>
        <a
          ref={emailRef}
          href="mailto:stergios.chatzikyriakidis@uoc.gr"
          className="text-[#E9E6E1] hover:text-[#D06D48] transition-colors mt-6 text-base"
        >
          stergios.chatzikyriakidis@uoc.gr
        </a>
        <div ref={ctaRef} className="mt-6">
          <a
            href="mailto:stergios.chatzikyriakidis@uoc.gr"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D06D48] text-white rounded-lg hover:bg-[#B85A38] transition-colors"
          >
            <Mail size={18} />
            Send email
          </a>
        </div>
        <div ref={footerRef} className="mt-12">
          <p className="text-sm text-[#E9E6E1]/50">
            © {new Date().getFullYear()} Stergios Chatzikyriakidis
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="contact" className="pinned-section z-[70]" style={{ backgroundColor: '#E9E6E1' }}>
      <div ref={overlayRef} className="absolute inset-0 bg-[#111]" style={{ opacity: 0 }} />
      <div className="section-content relative">
        <h2 ref={headlineRef} className="absolute text-[#E9E6E1]" style={{ left: '8vw', top: '18vh' }}>Contact</h2>
        <div ref={bodyRef} className="absolute" style={{ left: '8vw', top: '34vh', width: '40vw' }}>
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
        <a ref={emailRef} href="mailto:stergios.chatzikyriakidis@uoc.gr" className="absolute text-[#E9E6E1] hover:text-[#D06D48] transition-colors" style={{ left: '8vw', top: '54vh', fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
          stergios.chatzikyriakidis@uoc.gr
        </a>
        <div ref={ctaRef} className="absolute flex gap-4" style={{ left: '8vw', top: '64vh' }}>
          <a href="mailto:stergios.chatzikyriakidis@uoc.gr" className="inline-flex items-center gap-2 px-6 py-3 bg-[#D06D48] text-white rounded-lg hover:bg-[#B85A38] transition-colors">
            <Mail size={18} />
            Send email
          </a>
        </div>
        <div ref={footerRef} className="absolute bottom-[6vh] left-[8vw]">
          <p className="text-sm text-[#E9E6E1]/50">
            © {new Date().getFullYear()} Stergios Chatzikyriakidis
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
