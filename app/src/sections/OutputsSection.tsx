import { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, BookOpen, FileText, Users, Mic, Github, Globe, Cpu, Download, MessageSquare, Star, Image } from 'lucide-react';
import { publications, abstracts, getPublicationsByType } from '../data/publications';
import { tools, getToolsByCategory } from '../data/tools';
import { conferenceTalks, invitedTalks, posters } from '../data/talks';
import type { Talk } from '../data/talks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

gsap.registerPlugin(ScrollTrigger);

const OutputsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('publications');

  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent).detail;
      if (tab) setActiveTab(tab);
    };
    window.addEventListener('switchOutputTab', handler);
    return () => window.removeEventListener('switchOutputTab', handler);
  }, []);

  useLayoutEffect(() => {
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
  }, []);

  const monographs = getPublicationsByType('monograph');
  const chapters = getPublicationsByType('chapter');
  const edited = getPublicationsByType('edited');
  const journals = getPublicationsByType('journal');
  const otherJournals = getPublicationsByType('other_journal');
  const conferences = getPublicationsByType('conference');
  const applications = getToolsByCategory('application');
  const datasets = getToolsByCategory('dataset');
  const codeLibs = getToolsByCategory('code');
  const models = getToolsByCategory('model');

  const PubContent = ({ pub }: { pub: typeof publications[0] | typeof abstracts[0] }) => {
    const hasPdf = !!pub.pdfLink;
    const hasExternal = !!pub.link;

    return (
      <div className="output-item p-3 rounded-lg hover:bg-[#111]/5 transition-all duration-200">
        <div className="flex gap-2 items-start">
          <span className="text-[#D06D48] font-mono text-xs font-medium shrink-0 mt-0.5">[{pub.number}]</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-semibold text-[#111] text-sm leading-snug">
              {pub.title}
            </h4>
            <p className="text-xs text-[#6E6A63] mb-1 leading-snug">{pub.authors}</p>
            <p className="text-xs text-[#6E6A63] leading-snug">
              {pub.venue && <span>{pub.venue}, </span>}
              <span className="font-medium">{pub.year}</span>
            </p>
            {(hasPdf || hasExternal) && (
              <div className="flex gap-2 mt-2">
                {hasPdf && (
                  <a
                    href={pub.pdfLink!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D06D48] text-white text-xs font-semibold rounded hover:bg-[#B85A38] transition-colors"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111]/10 text-[#111] text-xs font-medium rounded hover:bg-[#111]/20 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={12} />
                    Link
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const PublicationCard = ({ pub }: { pub: typeof publications[0] }) => (
    <PubContent pub={pub} />
  );

  const AbstractCard = ({ pub }: { pub: typeof abstracts[0] }) => (
    <PubContent pub={pub} />
  );

  const TalkCard = ({ talk }: { talk: Talk }) => (
    <div className="output-item p-3 rounded-lg hover:bg-[#111]/5 transition-all duration-200">
      <div className="flex gap-2 items-start">
        <span className="text-[#D06D48] font-mono text-xs font-medium shrink-0 mt-0.5">[{talk.number}]</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-[#111] text-sm leading-snug">
            {talk.title}
          </h4>
          <p className="text-xs text-[#6E6A63] mb-1 leading-snug">{talk.authors}</p>
          <p className="text-xs text-[#6E6A63] leading-snug">
            <span>{talk.venue}, </span>
            <span className="font-medium">{talk.year}</span>
          </p>
        </div>
      </div>
    </div>
  );

  const ToolCard = ({ tool }: { tool: typeof tools[0] }) => (
    <div className="output-item p-3 rounded-lg hover:bg-[#111]/5 transition-all duration-200">
      <h4 className="font-display font-semibold text-[#111] text-sm mb-1 leading-snug">
        {tool.name}
      </h4>
      <p className="text-xs text-[#6E6A63] mb-2 leading-snug">{tool.description}</p>
      <div className="flex gap-3 flex-wrap">
        {tool.platformUrl && (
          <a
            href={tool.platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#D06D48] hover:underline flex items-center gap-1"
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
            className="text-xs text-[#D06D48] hover:underline flex items-center gap-1"
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
      style={{ backgroundColor: '#E9E6E1', paddingTop: '6rem' }}
    >
      <div id="outputs" className="px-[4vw] lg:px-[6vw] max-w-[1800px] mx-auto" style={{ scrollMarginTop: '2rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Header */}
          <div ref={headerRef} className="lg:col-span-3 mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start">
            <span className="label mb-3 block text-xs">Research Outputs</span>
            <h2 className="text-[#111] mb-4 text-xl lg:text-2xl">
              {activeTab === 'publications' ? 'Publications' : activeTab === 'talks' ? 'Talks & Presentations' : 'Software & Datasets'}
            </h2>
            <p className="text-[#6E6A63] mb-6 text-sm leading-relaxed">
              {activeTab === 'publications'
                ? 'Complete list of academic publications including monographs, book chapters, journal papers, and conference proceedings.'
                : activeTab === 'talks'
                ? 'Invited talks, conference and workshop presentations, and poster sessions.'
                : 'Software systems, tools, datasets, and code libraries.'}
            </p>

            <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="w-full">
              <TabsList className="flex flex-col w-full bg-[#111]/5 h-auto gap-1 p-1">
                <TabsTrigger value="publications" className="w-full data-[state=active]:bg-[#111] data-[state=active]:text-white text-xs py-2.5 justify-start px-3">
                  <BookOpen size={14} className="mr-2 shrink-0" />
                  Publications
                </TabsTrigger>
                <TabsTrigger value="talks" className="w-full data-[state=active]:bg-[#111] data-[state=active]:text-white text-xs py-2.5 justify-start px-3">
                  <Mic size={14} className="mr-2 shrink-0" />
                  Talks & Presentations
                </TabsTrigger>
                <TabsTrigger value="software" className="w-full data-[state=active]:bg-[#111] data-[state=active]:text-white text-xs py-2.5 justify-start px-3">
                  <FileText size={14} className="mr-2 shrink-0" />
                  Software & Datasets
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Right Column - Content */}
          <div ref={contentRef} className="lg:col-span-9">
            {activeTab === 'publications' ? (
              <div className="space-y-8">
                {/* Monographs */}
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen size={16} className="text-[#D06D48]" />
                      A. Monographs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-1">
                    {monographs.map((pub, idx) => (
                      <PublicationCard key={idx} pub={pub} />
                    ))}
                  </CardContent>
                </Card>

                {/* Book Chapters */}
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen size={16} className="text-[#D06D48]" />
                      B. Book Chapters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-1">
                    {chapters.map((pub, idx) => (
                      <PublicationCard key={idx} pub={pub} />
                    ))}
                  </CardContent>
                </Card>

                {/* Edited Volumes */}
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users size={16} className="text-[#D06D48]" />
                      C. Edited Books/Volumes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-1">
                    {edited.map((pub, idx) => (
                      <PublicationCard key={idx} pub={pub} />
                    ))}
                  </CardContent>
                </Card>

                {/* Journal Papers */}
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText size={16} className="text-[#D06D48]" />
                      D. Journal Papers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-1">
                    {journals.map((pub, idx) => (
                      <PublicationCard key={idx} pub={pub} />
                    ))}
                    {otherJournals.map((pub, idx) => (
                      <PublicationCard key={`oj-${idx}`} pub={pub} />
                    ))}
                  </CardContent>
                </Card>

                {/* Conference Proceedings */}
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Mic size={16} className="text-[#D06D48]" />
                      E. Conference Proceedings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-1">
                    {conferences.map((pub, idx) => (
                      <PublicationCard key={idx} pub={pub} />
                    ))}
                  </CardContent>
                </Card>

                {/* Abstracts */}
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ExternalLink size={16} className="text-[#D06D48]" />
                      F. Peer-Reviewed Abstracts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-1">
                    {abstracts.map((pub, idx) => (
                      <AbstractCard key={idx} pub={pub} />
                    ))}
                  </CardContent>
                </Card>
              </div>
            ) : activeTab === 'talks' ? (
              <div className="space-y-8">
                {/* Invited Talks */}
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Star size={16} className="text-[#D06D48]" />
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
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MessageSquare size={16} className="text-[#D06D48]" />
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
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Image size={16} className="text-[#D06D48]" />
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
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Globe size={16} className="text-[#D06D48]" />
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
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Github size={16} className="text-[#D06D48]" />
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
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText size={16} className="text-[#D06D48]" />
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
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Cpu size={16} className="text-[#D06D48]" />
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
