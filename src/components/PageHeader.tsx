import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="hero-veil border-b border-border/60">
      <div className="container-fp py-14 md:py-24">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display-lg mt-4 max-w-3xl text-foreground">{title}</h1>
        <hr className="gold-rule mt-7" />
        {intro && (
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="container-fp section-fp">
      <div className="max-w-3xl space-y-5 text-[0.9375rem] leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground">
        {children}
      </div>
    </div>
  );
}
