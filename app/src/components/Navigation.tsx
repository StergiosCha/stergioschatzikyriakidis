import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string, tab?: string) => {
    setIsOpen(false);

    if (tab) {
      window.dispatchEvent(new CustomEvent('switchOutputTab', { detail: tab }));
    }

    const element = document.getElementById(id);
    if (!element) return;

    // Find the ScrollTrigger pinned to this section and scroll into its mid-range
    const allTriggers = ScrollTrigger.getAll();
    const pinTrigger = allTriggers.find(
      (st) => st.vars.pin && st.trigger === element
    );

    if (pinTrigger) {
      // Scroll to 20% into the pin range so content is visible
      const target = pinTrigger.start + (pinTrigger.end - pinTrigger.start) * 0.2;
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Bio', id: 'bio' },
    { label: 'Research', id: 'research' },
    { label: 'Publications', id: 'outputs', tab: 'publications' },
    { label: 'Talks', id: 'outputs', tab: 'talks' },
    { label: 'Software', id: 'outputs', tab: 'software' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#E9E6E1]/95 backdrop-blur-md py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="px-6 lg:px-[8vw] flex items-center justify-between">
          {/* Wordmark */}
          <button
            onClick={() => scrollToSection('hero')}
            className="font-display text-sm lg:text-base font-semibold text-[#111] hover:opacity-70 transition-opacity"
          >
            Stergios Chatzikyriakidis
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id, link.tab)}
                className="text-sm font-medium text-[#111] hover:opacity-70 transition-opacity"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 text-[#111] hover:bg-[#111]/5 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#111]/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-[280px] bg-[#E9E6E1] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#111]/10">
              <span className="font-display text-sm font-semibold text-[#111]">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#111] hover:bg-[#111]/5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex flex-col py-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id, link.tab)}
                  className="px-5 py-3 text-left text-base font-medium text-[#111] hover:bg-[#111]/5 transition-colors border-l-2 border-transparent hover:border-[#D06D48]"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            
            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t border-[#111]/10">
              <p className="text-xs text-[#6E6A63] leading-relaxed">
                Professor of Computational Linguistics
                <br />
                University of Crete
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
