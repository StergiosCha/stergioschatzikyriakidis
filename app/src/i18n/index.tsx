import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en } from './en';

export type Lang = 'en' | 'el';
type Vars = Record<string, string | number>;
interface I18n { lang: Lang; setLang: (l: Lang) => void; t: (key: string, vars?: Vars) => string }

// The Greek dictionary is a separate chunk, fetched only when Greek is selected.
let elDict: Record<string, string> | null = null;
const loadEl = () => import('./el').then(m => (elDict = m.el));
const fill = (s: string, vars?: Vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s);

function initialLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q === 'en' || q === 'el') { localStorage.setItem('lang', q); return q; }
    const stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'el') return stored;
  } catch { /* storage unavailable */ }
  return typeof navigator !== 'undefined' && /^el\b/i.test(navigator.language || '') ? 'el' : 'en';
}

const Ctx = createContext<I18n>({ lang: 'en', setLang: () => {}, t: (k, v) => fill(en[k] ?? k, v) });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('lang', l); } catch { /* noop */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'el'
      ? 'Στέργιος Χατζηκυριακίδης — Διευθυντής Ερευνών, Ινστιτούτο Επεξεργασίας του Λόγου, Ερευνητικό Κέντρο «Αθηνά»'
      : 'Stergios Chatzikyriakidis — Director of Research, ILSP, Athena Research Centre';
  }, [lang]);
  const [elReady, setElReady] = useState(!!elDict);
  useEffect(() => {
    if (lang === 'el' && !elDict) loadEl().then(() => setElReady(true)).catch(() => { /* stay in English */ });
  }, [lang]);
  const t = useCallback((key: string, vars?: Vars) => {
    const d = lang === 'el' && elReady && elDict ? elDict : en;
    return fill(d[key] || en[key] || key, vars);
  }, [lang, elReady]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useT = () => useContext(Ctx);
