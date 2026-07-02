import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch { /* noop */ }
  };

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
      // Scroll to 50% into the pin range (well past entrance animations)
      const target = pinTrigger.start + (pinTrigger.end - pinTrigger.start) * 0.5;
      window.scrollTo({ top: target, behavior: 'smooth' });
      // Force GSAP to catch up immediately so content isn't blank
      setTimeout(() => ScrollTrigger.update(), 50);
      setTimeout(() => ScrollTrigger.update(), 200);
      setTimeout(() => ScrollTrigger.update(), 500);
    } else {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Bio', id: 'bio' },
    { label: 'Research', id: 'research' },
    { label: 'Publications', id: 'outputs', tab: 'publications' },
    { label: 'Talks', id: 'outputs', tab: 'talks' },
    { label: 'Software', id: 'software' },
    { label: 'Live demos', id: 'demos' },
    { label: 'News', id: 'news-research' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? 'bg-paper/95 backdrop-blur-md py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="px-6 lg:px-[8vw] flex items-center justify-between">
          {/* Wordmark */}
          <button
            onClick={() => scrollToSection('hero')}
            className="font-display text-sm lg:text-base font-semibold text-ink hover:opacity-70 transition-opacity"
          >
            Stergios Chatzikyriakidis
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id, link.tab)}
                className="text-sm font-medium text-ink hover:opacity-70 transition-opacity"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 text-ink hover:bg-ink/5 rounded-lg transition-colors"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </nav>

          {/* Mobile: theme toggle + menu button */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 text-ink hover:bg-ink/5 rounded-lg transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 text-ink hover:bg-ink/5 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-[280px] bg-paper shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
              <span className="font-display text-sm font-semibold text-ink">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-ink hover:bg-ink/5 rounded-lg transition-colors"
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
                  className="px-5 py-3 text-left text-base font-medium text-ink hover:bg-ink/5 transition-colors border-l-2 border-transparent hover:border-terra"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            
            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t border-ink/10">
              <p className="text-xs text-mut leading-relaxed">
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
