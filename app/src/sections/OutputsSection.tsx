import { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, BookOpen, FileText, Users, Mic, Github, Globe, Cpu, Download, MessageSquare, Star, Image, Search, X, Copy, Check, Link2 } from 'lucide-react';
import { publications, abstracts, getPublicationsByType } from '../data/publications';
import { tools, getToolsByCategory } from '../data/tools';
import { conferenceTalks, invitedTalks, posters } from '../data/talks';
import type { Talk } from '../data/talks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePrefersReducedMotion } from '../hooks/use-reduced-motion';
import MetricsBand from '../components/MetricsBand';

gsap.registerPlugin(ScrollTrigger);


const yearOf = (y: string): string => y.match(/(19|20)\d{2}/)?.[0] ?? (y || 'n.d.');

const slugify = (t: string): string =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 6).join('-');

interface BibPub { title: string; authors: string; venue?: string; year: string; type: string }

const bibtexFor = (pub: BibPub): string => {
  const year = yearOf(pub.year);
  const lastName = (pub.authors.split(',')[0] || 'chatzikyriakidis').trim().toLowerCase().replace(/[^a-z]/g, '');
  const firstWord = pub.title.match(/[A-Za-z]{4,}/)?.[0]?.toLowerCase() ?? 'work';
  const typeMap: Record<string, string> = { monograph: 'book', chapter: 'incollection', edited: 'book', journal: 'article', other_journal: 'article', conference: 'inproceedings', abstract: 'misc' };
  const entry = typeMap[pub.type] ?? 'misc';
  const lines = [
    `@${entry}{${lastName}${year}${firstWord},`,
    `  ${pub.type === 'edited' ? 'editor' : 'author'} = {${pub.authors}},`,
    `  title = {${pub.title}},`,
  ];
  if (pub.venue) {
    const field = entry === 'article' ? 'journal' : entry === 'book' ? 'publisher' : 'booktitle';
    lines.push(`  ${field} = {${pub.venue}},`);
  }
  lines.push(`  year = {${year}}`, '}');
  return lines.join('\n');
};

const OutputsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('publications');
  const reducedMotion = usePrefersReducedMotion();
  const [query, setQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent).detail;
      if (tab) setActiveTab(tab);
    };
    window.addEventListener('switchOutputTab', handler);
    return () => window.removeEventListener('switchOutputTab', handler);
  }, []);

  // Deep-link support: #pub-<slug> anchors
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#pub-')) {
      // activeTab already defaults to 'publications'
      window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, x: '-6vw' },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      const items = contentRef.current?.querySelectorAll('.output-item');
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.01,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const q = query.trim().toLowerCase();
  const matches = (pub: BibPub) => {
    const inQuery = !q || `${pub.title} ${pub.authors} ${pub.venue ?? ''} ${pub.year}`.toLowerCase().includes(q);
    const inYear = yearFilter === 'all' || yearOf(pub.year) === yearFilter;
    return inQuery && inYear;
  };
  const isFiltering = q !== '' || yearFilter !== 'all';
  const allYears = Array.from(new Set([...publications, ...abstracts].map((p) => yearOf(p.year)))).sort((a, b) => {
    const na = parseInt(a); const nb = parseInt(b);
    if (!isNaN(na) && !isNaN(nb)) return nb - na;
    if (!isNaN(na)) return -1;
    if (!isNaN(nb)) return 1;
    return a.localeCompare(b);
  });
  const monographs = getPublicationsByType('monograph').filter(matches);
  const chapters = getPublicationsByType('chapter').filter(matches);
  const edited = getPublicationsByType('edited').filter(matches);
  const journals = getPublicationsByType('journal').filter(matches);
  const otherJournals = getPublicationsByType('other_journal').filter(matches);
  const conferences = getPublicationsByType('conference').filter(matches);
  const filteredAbstracts = abstracts.filter(matches);
  const pubGroups = [
    { title: 'A. Monographs', icon: BookOpen, items: monographs },
    { title: 'B. Book Chapters', icon: BookOpen, items: chapters },
    { title: 'C. Edited Books/Volumes', icon: Users, items: edited },
    { title: 'D. Journal Papers', icon: FileText, items: [...journals, ...otherJournals] },
    { title: 'E. Conference Proceedings', icon: Mic, items: conferences },
    { title: 'F. Peer-Reviewed Abstracts', icon: ExternalLink, items: filteredAbstracts },
  ];
  const applications = getToolsByCategory('application');
  const datasets = getToolsByCategory('dataset');
  const codeLibs = getToolsByCategory('code');
  const models = getToolsByCategory('model');

  const PubContent = ({ pub }: { pub: typeof publications[0] | typeof abstracts[0] }) => {
    const hasPdf = !!pub.pdfLink;
    const hasExternal = !!pub.link;

    const slug = slugify(pub.title);
    const copyBib = () => {
      navigator.clipboard.writeText(bibtexFor(pub));
      setCopiedKey(`${slug}:bib`);
      window.setTimeout(() => setCopiedKey(null), 1600);
    };
    const copyLink = () => {
      navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#pub-${slug}`);
      setCopiedKey(`${slug}:link`);
      window.setTimeout(() => setCopiedKey(null), 1600);
    };
    return (
      <div id={`pub-${slug}`} style={{ scrollMarginTop: '6rem' }} className="output-item p-3 rounded-lg hover:bg-ink/5 transition-all duration-200">
        <div className="flex gap-2 items-start">
          <span className="text-terra font-mono text-xs font-medium shrink-0 mt-0.5">[{pub.number}]</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-semibold text-ink text-sm leading-snug">
              {pub.title}
            </h4>
            <p className="text-xs text-mut mb-1 leading-snug">{pub.authors}</p>
            <p className="text-xs text-mut leading-snug">
              {pub.venue && <span>{pub.venue}, </span>}
              <span className="font-medium">{pub.year}</span>
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
                {hasPdf && (
                  <a
                    href={pub.pdfLink!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-terra text-white text-xs font-semibold rounded hover:bg-terradark transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={12} />
                    PDF
                  </a>
                )}
                {hasExternal && (
                  <a
                    href={pub.link!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink/10 text-ink text-xs font-medium rounded hover:bg-ink/20 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={12} />
                    Link
                  </a>
                )}
                <button
                  onClick={copyBib}
                  title="Copy BibTeX entry"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink/10 text-ink text-xs font-medium rounded hover:bg-ink/20 transition-colors"
                >
                  {copiedKey === `${slug}:bib` ? <Check size={12} /> : <Copy size={12} />}
                  {copiedKey === `${slug}:bib` ? 'Copied' : 'BibTeX'}
                </button>
                <button
                  onClick={copyLink}
                  title="Copy a direct link to this publication"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink/10 text-ink text-xs font-medium rounded hover:bg-ink/20 transition-colors"
                >
                  {copiedKey === `${slug}:link` ? <Check size={12} /> : <Link2 size={12} />}
                  {copiedKey === `${slug}:link` ? 'Copied' : 'Cite link'}
                </button>
              </div>
          </div>
        </div>
      </div>
    );
  };

  const TalkCard = ({ talk }: { talk: Talk }) => (
    <div className="output-item p-3 rounded-lg hover:bg-ink/5 transition-all duration-200">
      <div className="flex gap-2 items-start">
        <span className="text-terra font-mono text-xs font-medium shrink-0 mt-0.5">[{talk.number}]</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-ink text-sm leading-snug">
            {talk.title}
          </h4>
          <p className="text-xs text-mut mb-1 leading-snug">{talk.authors}</p>
          <p className="text-xs text-mut leading-snug">
            <span>{talk.venue}, </span>
            <span className="font-medium">{talk.year}</span>
          </p>
        </div>
      </div>
    </div>
  );

  const ToolCard = ({ tool }: { tool: typeof tools[0] }) => (
    <div className="output-item p-3 rounded-lg hover:bg-ink/5 transition-all duration-200">
      <h4 className="font-display font-semibold text-ink text-sm mb-1 leading-snug">
        {tool.name}
      </h4>
      <p className="text-xs text-mut mb-2 leading-snug">{tool.description}</p>
      <div className="flex gap-3 flex-wrap">
        {tool.platformUrl && (
          <a
            href={tool.platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-terra hover:underline flex items-center gap-1"
          >
            <Globe size={12} />
            Platform
          </a>
        )}
        {tool.githubUrl && (
          <a
            href={tool.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-terra hover:underline flex items-center gap-1"
          >
            <Github size={12} />
            GitHub
          </a>
        )}
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-[60] pb-32"
      style={{ backgroundColor: 'var(--bg-primary)', paddingTop: '6rem' }}
    >
      <div id="outputs" className="px-[4vw] lg:px-[6vw] max-w-[1800px] mx-auto" style={{ scrollMarginTop: '2rem' }}>
        <MetricsBand />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Header */}
          <div ref={headerRef} className="lg:col-span-3 mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start">
            <span className="label mb-3 block text-xs">Research Outputs</span>
            <h2 className="text-ink mb-4 text-xl lg:text-2xl">
              {activeTab === 'publications' ? 'Publications' : activeTab === 'talks' ? 'Talks & Presentations' : 'Software & Datasets'}
            </h2>
            <p className="text-mut mb-6 text-sm leading-relaxed">
              {activeTab === 'publications'
                ? 'Complete list of academic publications including monographs, book chapters, journal papers, and conference proceedings.'
                : activeTab === 'talks'
                ? 'Invited talks, conference and workshop presentations, and poster sessions.'
                : 'Software systems, tools, datasets, and code libraries.'}
            </p>

            <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="w-full">
              <TabsList className="flex flex-col w-full bg-ink/5 h-auto gap-1 p-1">
                <TabsTrigger value="publications" className="w-full data-[state=active]:bg-ink data-[state=active]:text-paper text-xs py-2.5 justify-start px-3">
                  <BookOpen size={14} className="mr-2 shrink-0" />
                  Publications
                </TabsTrigger>
                <TabsTrigger value="talks" className="w-full data-[state=active]:bg-ink data-[state=active]:text-paper text-xs py-2.5 justify-start px-3">
                  <Mic size={14} className="mr-2 shrink-0" />
                  Talks & Presentations
                </TabsTrigger>
                <TabsTrigger value="software" className="w-full data-[state=active]:bg-ink data-[state=active]:text-paper text-xs py-2.5 justify-start px-3">
                  <FileText size={14} className="mr-2 shrink-0" />
                  Software & Datasets
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Right Column - Content */}
          <div ref={contentRef} className="lg:col-span-9">
            {activeTab === 'publications' && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mut pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search title, author, venue…"
                    aria-label="Search publications"
                    className="w-full pl-9 pr-8 py-2 rounded-lg border border-ink/10 bg-surface/60 text-sm text-ink placeholder:text-mut/70 focus:outline-none focus:border-terra/50"
                  />
                  {query && (
                    <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mut hover:text-ink">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  aria-label="Filter by year"
                  className="px-3 py-2 rounded-lg border border-ink/10 bg-surface/60 text-sm text-ink focus:outline-none focus:border-terra/50"
                >
                  <option value="all">All years</option>
                  {allYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}
            {activeTab === 'publications' ? (
              <div className="space-y-8">
                {pubGroups.filter((g) => g.items.length > 0).map((g) => (
                  <Card key={g.title} className="bg-surface/50 border-none shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <g.icon size={16} className="text-terra" />
                        {g.title}
                        {isFiltering && (
                          <span className="text-xs font-normal text-mut">({g.items.length})</span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-1">
                      {g.items.map((pub, idx) => (
                        <PubContent key={`${g.title}-${idx}`} pub={pub} />
                      ))}
                    </CardContent>
                  </Card>
                ))}
                {pubGroups.every((g) => g.items.length === 0) && (
                  <p className="text-mut text-sm py-8 text-center">No publications match your search.</p>
                )}
              </div>
            ) : activeTab === 'talks' ? (
              <div className="space-y-8">
                {/* Invited Talks */}
                <Card className="bg-surface/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Star size={16} className="text-terra" />
                      Invited Talks ({invitedTalks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-1">
                    {invitedTalks.map((talk, idx) => (
                      <TalkCard key={idx} talk={talk} />
                    ))}
                  </CardContent>
                </Card>

                {/* Conference Talks */}
                <Card className="bg-surface/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MessageSquare size={16} className="text-terra" />
                      Conference/Workshop Presentations ({conferenceTalks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-1">
                    {conferenceTalks.map((talk, idx) => (
                      <TalkCard key={idx} talk={talk} />
                    ))}
                  </CardContent>
                </Card>

                {/* Posters */}
                <Card className="bg-surface/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Image size={16} className="text-terra" />
                      Posters ({posters.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-1">
                    {posters.map((talk, idx) => (
                      <TalkCard key={idx} talk={talk} />
                    ))}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Applications */}
                <Card className="bg-surface/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Globe size={16} className="text-terra" />
                      Software Systems ({applications.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {applications.map((tool, idx) => (
                      <ToolCard key={idx} tool={tool} />
                    ))}
                  </CardContent>
                </Card>

                {/* Code & Libraries */}
                <Card className="bg-surface/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Github size={16} className="text-terra" />
                      Code & Libraries ({codeLibs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {codeLibs.map((tool, idx) => (
                      <ToolCard key={idx} tool={tool} />
                    ))}
                  </CardContent>
                </Card>

                {/* Datasets */}
                <Card className="bg-surface/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText size={16} className="text-terra" />
                      Datasets ({datasets.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {datasets.map((tool, idx) => (
                      <ToolCard key={idx} tool={tool} />
                    ))}
                  </CardContent>
                </Card>

                {/* Fine-tuned Models */}
                <Card className="bg-surface/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Cpu size={16} className="text-terra" />
                      Fine-tuned Models ({models.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {models.map((tool, idx) => (
                      <ToolCard key={idx} tool={tool} />
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutputsSection;
