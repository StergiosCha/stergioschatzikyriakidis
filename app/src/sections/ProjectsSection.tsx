import { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import SectionHead from '../components/SectionHead';
import Deferred, { LazyAtlasGraph, LazyDialectBars, LazyLingEmbedLab, LazySvarnaRegisters, LazyTreeEmbed } from '../components/Deferred';
import { svarnaProject, atlasProject, lingembedProject, codagProject, type FoundationalProject } from '../data/projects';
import { useT } from '../i18n';

const Links = ({ p }: { p: FoundationalProject }) => {
  const { t } = useT();
  return (
    <div className="flex flex-wrap gap-2 mt-5">
      {p.links.map((l, i) => (
        <a key={l.href} className={`btn sm ${i === 0 ? 'primary' : 'ghost'}`} href={l.href} target="_blank" rel="noopener noreferrer">
          {t(`proj.${p.id}.link${i}`)} <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
};

const Head = ({ p, glyph, tone }: { p: FoundationalProject; glyph: string; tone: 'sym' | 'emb' | 'neu' }) => {
  const { t } = useT();
  return (
    <>
      <div className="flex items-center gap-3 mb-3"><span className={`tag ${tone}`}>{t(`proj.${p.id}.kicker`)}</span></div>
      <h3 className="h3 flex items-baseline gap-3"><span className="mono grad-all" aria-hidden="true">{glyph}</span>{p.name}</h3>
      <p className="soft mt-3" style={{ maxWidth: '62ch' }}>{t(`proj.${p.id}.summary`)}</p>
    </>
  );
};

const Cite = ({ p }: { p: FoundationalProject }) => {
  const { t } = useT();
  const [ok, setOk] = useState(false);
  if (!p.bibtex) return null;
  const copy = () => { navigator.clipboard?.writeText(p.bibtex!).then(() => { setOk(true); setTimeout(() => setOk(false), 1800); }); };
  return (
    <details className="cite mt-4">
      <summary className="mono text-[12px]">{t('proj.cite')}</summary>
      <pre className="cite-pre"><code>{p.bibtex}</code></pre>
      <button type="button" className="btn sm ghost" onClick={copy}>{ok ? t('proj.cite.copied') : t('proj.cite.copy')}</button>
    </details>
  );
};

const Facts = ({ p }: { p: FoundationalProject }) => {
  const { t } = useT();
  return p.facts.length ? <ul className="facts">{p.facts.map((_, i) => <li key={i}>{t(`proj.${p.id}.fact${i}`)}</li>)}</ul> : null;
};

export default function ProjectsSection() {
  const { t } = useT();
  const [lab, setLab] = useState(false);
  const loading = (k: string) => k;
  return (
    <section id="projects" className="block" aria-labelledby="projects-title">
      <SectionHead index="01" kicker={t('projects.kicker')} id="projects-title" title={<>{t('projects.title.a')} <span className="grad-sym">{t('projects.title.greek')}</span> {t('projects.title.b')} <span className="grad-neu">{t('projects.title.formal')}</span></>}>
        {t('projects.intro')}
      </SectionHead>

      <div className="grid gap-6">
        <article className="proj neu reveal" aria-labelledby="p-svarna">
          <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-8">
            <div>
              <div id="p-svarna"><Head p={svarnaProject} glyph="Σ" tone="neu" /></div>
              <Facts p={svarnaProject} />
              <div className="flex flex-wrap gap-1.5 mt-4">{svarnaProject.tags.map(x => <span key={x} className="tag emb">{x}</span>)}</div>
              <Links p={svarnaProject} />
              <Cite p={svarnaProject} />
            </div>
            <Deferred label={loading('Svarna')} minHeight={420}><LazySvarnaRegisters /></Deferred>
          </div>
        </article>

        <article className="proj sym reveal" aria-labelledby="p-atlas">
          <div className="grid lg:grid-cols-[0.8fr_1.5fr] gap-8">
            <div>
              <div id="p-atlas"><Head p={atlasProject} glyph="⊢" tone="sym" /></div>
              <Facts p={atlasProject} />
              <div className="flex flex-wrap gap-1.5 mt-4">{atlasProject.tags.map(x => <span key={x} className="tag sym">{x}</span>)}</div>
              <Links p={atlasProject} />
              <Cite p={atlasProject} />
            </div>
            <Deferred label="Formal Atlas" minHeight={640}><LazyAtlasGraph /></Deferred>
          </div>
        </article>

        <div className="grid xl:grid-cols-[1.35fr_1fr] gap-6">
          <article className="proj emb reveal" aria-labelledby="p-lingembed">
            <div id="p-lingembed"><Head p={lingembedProject} glyph="λ⊗" tone="emb" /></div>
            <Facts p={lingembedProject} />
            <div className="mt-5"><Deferred label="LingEmbed" minHeight={420}><LazyTreeEmbed /></Deferred></div>
            <Links p={lingembedProject} />
            <button className="btn ghost sm mt-4" aria-expanded={lab} aria-controls="lingembed-lab" onClick={() => setLab(v => !v)}>
              {lab ? t('projects.explore.close') : t('projects.explore.open')} <ChevronDown size={14} aria-hidden="true" style={{ transform: lab ? 'rotate(180deg)' : undefined }} />
            </button>
          </article>
          <article className="proj sym reveal" aria-labelledby="p-codag">
            <div id="p-codag" style={{ scrollMarginTop: 90 }}><Head p={codagProject} glyph="Γ" tone="sym" /></div>
            <div className="mt-5"><Deferred label="CoDAG" minHeight={300}><LazyDialectBars /></Deferred></div>
            <div className="flex flex-wrap gap-1.5 mt-4">{codagProject.tags.map(x => <span key={x} className="tag sym">{x}</span>)}</div>
            <Links p={codagProject} />
          </article>
        </div>
        {lab && (
          <div id="lingembed-lab" className="proj emb" role="region" aria-label={t('projects.lab.aria')}>
            <Deferred label="LingEmbed lab" minHeight={900} eager><LazyLingEmbedLab /></Deferred>
          </div>
        )}
      </div>
    </section>
  );
}
