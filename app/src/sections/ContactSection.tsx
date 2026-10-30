import { Mail } from 'lucide-react';
import { useT } from '../i18n';
import { SOCIALS } from '../components/icons';

const ContactSection = () => {
  const { t } = useT();
  return (
  <>
    <section id="contact" className="block" aria-labelledby="contact-title">
      <div className="proj neu grid md:grid-cols-[1.2fr_1fr] gap-8 items-center reveal">
        <div>
          <p className="eyebrow">{t('contact.kicker')} · <b>10</b></p>
          <h2 className="h2" id="contact-title">{t('contact.title')}</h2>
          <p className="soft" style={{ fontSize: '1.05rem' }}>
            {t('contact.l1')}<br />{t('contact.l2')}<br />{t('contact.l3')}<br />{t('contact.l4')}
          </p>
          <a href="mailto:s.chatzikyriakidis@athenarc.gr" className="block mt-4" style={{ fontSize: '1.05rem' }}>s.chatzikyriakidis@athenarc.gr</a>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <a href="mailto:s.chatzikyriakidis@athenarc.gr" className="btn primary"><Mail size={18} aria-hidden="true" /> {t('contact.send')}</a>
          <div className="socials">
            {SOCIALS.map(({ href, label, Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Icon /></a>)}
          </div>
        </div>
      </div>
    </section>
    <footer className="footer flex flex-wrap justify-between gap-3">
      <span>© {new Date().getFullYear()} {t('name.full')}</span>
    </footer>
  </>
  );
};

export default ContactSection;
