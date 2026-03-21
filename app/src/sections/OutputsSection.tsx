import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, BookOpen, FileText, Users, Mic, Github, Globe } from 'lucide-react';
import { publications, abstracts, getPublicationsByType } from '../data/publications';
import { tools, getToolsByCategory } from '../data/tools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

gsap.registerPlugin(ScrollTrigger);

const OutputsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('publications');

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
  const edited = getPublicationsByType('edited');
  const journals = getPublicationsByType('journal');
  const conferences = getPublicationsByType('conference');
  const applications = getToolsByCategory('application');
  const datasets = getToolsByCategory('dataset');
  const codeLibs = getToolsByCategory('code');

  const PublicationCard = ({ pub }: { pub: typeof publications[0] }) => {
    const content = (
      <>
        <div className="flex gap-2">
          <span className="text-[#D06D48] font-mono text-xs font-medium shrink-0">[{pub.number}]</span>
          <h4 className={`font-display font-semibold text-[#111] text-sm leading-snug ${pub.link ? 'group-hover:underline' : ''}`}>
            {pub.title}
          </h4>
        </div>
        <p className="text-xs text-[#6E6A63] mb-1 leading-snug ml-6">{pub.authors}</p>
        <p className="text-xs text-[#6E6A63] leading-snug ml-6">
          {pub.venue && <span>{pub.venue}, </span>}
          <span className="font-medium">{pub.year}</span>
        </p>
      </>
    );

    if (pub.link) {
      return (
        <a
          href={pub.link}
          target="_blank"
          rel="noopener noreferrer"
          className="output-item block p-3 rounded-lg hover:bg-[#111]/5 transition-all duration-200 group"
        >
          {content}
        </a>
      );
    }

    return (
      <div className="output-item block p-3 rounded-lg">
        {content}
      </div>
    );
  };

  const AbstractCard = ({ pub }: { pub: typeof abstracts[0] }) => {
    const content = (
      <>
        <div className="flex gap-2">
          <span className="text-[#D06D48] font-mono text-xs font-medium shrink-0">[{pub.number}]</span>
          <h4 className={`font-display font-semibold text-[#111] text-sm leading-snug ${pub.link ? 'group-hover:underline' : ''}`}>
            {pub.title}
          </h4>
        </div>
        <p className="text-xs text-[#6E6A63] mb-1 leading-snug ml-6">{pub.authors}</p>
        <p className="text-xs text-[#6E6A63] leading-snug ml-6">
          {pub.venue && <span>{pub.venue}, </span>}
          <span className="font-medium">{pub.year}</span>
        </p>
      </>
    );

    if (pub.link) {
      return (
        <a
          href={pub.link}
          target="_blank"
          rel="noopener noreferrer"
          className="output-item block p-3 rounded-lg hover:bg-[#111]/5 transition-all duration-200 group"
        >
          {content}
        </a>
      );
    }

    return (
      <div className="output-item block p-3 rounded-lg">
        {content}
      </div>
    );
  };

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
      id="outputs"
      className="relative z-[60] pb-20"
      style={{ backgroundColor: '#E9E6E1', paddingTop: '16.5rem' }}
    >
      <div className="px-[4vw] lg:px-[6vw] max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Header */}
          <div ref={headerRef} className="lg:col-span-3 mb-8 lg:mb-0">
            <span className="label mb-3 block text-xs">Research Outputs</span>
            <h2 className="text-[#111] mb-4 text-xl lg:text-2xl">Publications, Software & Datasets</h2>
            <p className="text-[#6E6A63] mb-6 text-sm leading-relaxed">
              Complete list of academic publications (1-99), conference abstracts (100-114), software systems, and datasets.
            </p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#111]/5 h-auto">
                <TabsTrigger value="publications" className="data-[state=active]:bg-[#111] data-[state=active]:text-white text-xs py-2">
                  <BookOpen size={14} className="mr-1" />
                  Publications
                </TabsTrigger>
                <TabsTrigger value="software" className="data-[state=active]:bg-[#111] data-[state=active]:text-white text-xs py-2">
                  <FileText size={14} className="mr-1" />
                  Software
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
                      A. Monographs (1-4)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-1">
                    {monographs.map((pub, idx) => (
                      <PublicationCard key={idx} pub={pub} />
                    ))}
                  </CardContent>
                </Card>

                {/* Edited Volumes */}
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users size={16} className="text-[#D06D48]" />
                      B. Edited Books/Volumes (5-15)
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
                      C. Journal Papers (16-37)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-1">
                    {journals.map((pub, idx) => (
                      <PublicationCard key={idx} pub={pub} />
                    ))}
                  </CardContent>
                </Card>

                {/* Conference Papers */}
                <Card className="bg-white/50 border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Mic size={16} className="text-[#D06D48]" />
                      D. Book Chapters, Conference Proceedings (38-99)
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
                      E. Conferences/Workshops with Peer-Reviewed Abstracts (100-114)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-1">
                    {abstracts.map((pub, idx) => (
                      <AbstractCard key={idx} pub={pub} />
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
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutputsSection;
