import { ArrowUpRight, BookOpen, Download, Play } from 'lucide-react';
import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const workshop = '/teaching/clarin-2026/';

export default function TeachingSection() {
  useEffect(() => {
    let frame = 0;
    const followTeachingLink = () => {
      if (window.location.hash !== '#teaching') return;
      cancelAnimationFrame(frame);
      // Wait for React's responsive layout and the existing pinned sections.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          document.getElementById('teaching')?.scrollIntoView({ behavior: 'auto' });
        });
      });
    };
    window.addEventListener('hashchange', followTeachingLink);
    window.addEventListener('load', followTeachingLink);
    if (document.readyState === 'complete') followTeachingLink();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', followTeachingLink);
      window.removeEventListener('load', followTeachingLink);
    };
  }, []);

  return (
    <section id="teaching" className="relative z-[60] py-20" style={{ backgroundColor: 'var(--bg-alt)', scrollMarginTop: '5rem' }}>
      <div className="px-[4vw] lg:px-[6vw] max-w-[1800px] mx-auto">
        <span className="label mb-3 block">Learn with the tools</span>
        <h2 className="text-ink text-3xl lg:text-4xl mb-5">Teaching &amp; workshops</h2>
        <p className="text-mut max-w-2xl mb-9">
          Texts to investigate, methods to question and examples to work through.
          Explore the material in your browser or download it for your own teaching.
        </p>
        <article className="rounded-xl border border-ink/10 bg-surface/60 p-6 md:p-9 grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div>
            <p className="label text-terra mb-4">CLARIN:EL Summer School · 24 September 2026</p>
            <h3 className="text-ink text-2xl md:text-3xl leading-tight mb-4">
              <a href={workshop} className="hover:text-terra transition-colors">AI Applications for Language Analysis</a>
            </h3>
            <p className="text-mut max-w-2xl mb-6">
              A talk and hands-on workshop for digital humanities. Move from Greek poetry
              and emotion analysis to historical knowledge graphs, corpus exploration and
              dialect generation. Inspect the prompts, the returned answers and the evidence.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={`${workshop}demo.html`} className="btn-primary"><Play size={16} aria-hidden="true" />Open interactive workshop</a>
              <a href={workshop} className="btn-secondary">All workshop materials<ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-ink/10 pt-6 lg:pt-0 lg:pl-8 space-y-5">
            <div className="flex gap-3"><BookOpen className="text-terra shrink-0 mt-1" size={20} aria-hidden="true" /><div><h4 className="text-base leading-normal text-ink mb-1">Work through eleven activities</h4><p className="text-sm text-mut">Complete texts, copyable prompts, saved outputs, interactive graphs and links to the existing apps.</p></div></div>
            <div className="flex gap-3"><Download className="text-terra shrink-0 mt-1" size={20} aria-hidden="true" /><div><h4 className="text-base leading-normal text-ink mb-1">Keep the material</h4><p className="text-sm text-mut">Both slide decks, complete worked examples and an offline workshop bundle.</p><a href={`${workshop}#downloads`} className="inline-flex text-sm text-terra underline underline-offset-4 mt-3">Browse downloads</a></div></div>
          </div>
        </article>
      </div>
    </section>
  );
}
