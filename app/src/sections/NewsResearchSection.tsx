import { news } from '../data/news';
import { useT } from '../i18n';
import SectionHead from '../components/SectionHead';

const TONE: Record<string, string> = { paper: 'emb', talk: 'sym', software: 'neu', general: 'ok', award: 'sym', event: 'neu' };

// The research map that used to live here is now the interactive network in the Research section.
const NewsResearchSection = () => {
  const { t } = useT();
  return (
  <section id="news" className="block" aria-labelledby="news-title">
    <SectionHead index="09" kicker={t('news.kicker')} id="news-title" title={t('news.title')} />
    <ol className="timeline grid md:grid-cols-2 gap-x-10" style={{ listStyle: 'none', margin: 0 }}>
      {news.map((item, idx) => (
        <li key={idx} className="tl-item reveal">
          <span className="tl-dot" aria-hidden="true" />
          <div className="flex items-center gap-2 mb-1">
            <span className="mono text-[12px]" style={{ color: 'var(--sym)' }}>{item.date}</span>
            <span className={`tag ${TONE[item.type] ?? 'emb'}`} style={{ fontSize: '.6rem' }}>{t(`news.type.${item.type}`)}</span>
          </div>
          <p className="soft text-[14px]" style={{ margin: 0 }}>
            {item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer">{item.text} →</a> : item.text}
          </p>
        </li>
      ))}
    </ol>
  </section>
  );
};

export default NewsResearchSection;
