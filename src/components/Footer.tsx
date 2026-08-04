import { Link } from "@tanstack/react-router";
import { BRAND, FOOTER_LEGAL, NAV_LINKS } from "@/lib/config";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      <div className="container-fp grid gap-10 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <span className="font-display text-lg tracking-[0.32em]">{BRAND.name}</span>
          <p className="mt-4 max-w-xs font-display text-xl italic text-muted-foreground">
            {BRAND.tagline}
          </p>
          <hr className="gold-rule mt-6" />
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {BRAND.city}
            <br />
            <a href={`mailto:${BRAND.email}`} className="transition-colors hover:text-foreground">
              {BRAND.email}
            </a>
            <br />
            {BRAND.phone}
          </p>
        </div>

        <div className="md:col-span-2">
          <h3 className="eyebrow">Магазин</h3>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.filter((l) => l.to !== "/").map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/prosledi-poruchka"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Проследи поръчка
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="eyebrow">Условия</h3>
          <ul className="mt-4 space-y-2.5">
            {FOOTER_LEGAL.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="eyebrow">Бюлетин</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Тихи съобщения за нови серии и поводи. Без спам.
          </p>
          <NewsletterForm className="mt-4" />
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container-fp flex flex-col gap-2 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.domain}
          </p>
          <p>Плащане с карта чрез сигурна връзка на Revolut.</p>
        </div>
      </div>
    </footer>
  );
}
