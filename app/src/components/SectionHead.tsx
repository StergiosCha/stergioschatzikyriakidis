import type { ReactNode } from 'react';
export default function SectionHead({ index, kicker, title, children, id }: { index: string; kicker: string; title: ReactNode; children?: ReactNode; id?: string }) {
  return (
    <div className="block-head reveal">
      <p className="eyebrow">{kicker} · <b>{index}</b></p>
      <h2 className="h2" id={id}>{title}</h2>
      {children && <div className="lede">{children}</div>}
    </div>
  );
}
