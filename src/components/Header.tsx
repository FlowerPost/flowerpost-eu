import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/config";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export function Header() {
  const { count, hydrated } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border bg-background/90 backdrop-blur-md"
          : "border-transparent bg-background"
      }`}
    >
      <div className="container-fp flex h-16 items-center justify-between gap-4 md:h-20">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <span className="font-display text-lg tracking-[0.32em] text-foreground md:text-xl">
            {BRAND.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Основна навигация">
          {NAV_LINKS.filter((l) => l.to !== "/").map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[0.8125rem] tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            to="/kolichka"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
            aria-label="Количка"
          >
            <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
            {hydrated && count > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-medium text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          <Button
            asChild
            size="sm"
            className="hidden rounded-none px-5 tracking-wide sm:inline-flex"
          >
            <Link to="/poruchaj">Поръчай</Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent lg:hidden"
            aria-label={open ? "Затвори менюто" : "Отвори менюто"}
            aria-expanded={open}
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-border bg-background lg:hidden">
          <nav className="container-fp flex flex-col py-4" aria-label="Мобилна навигация">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-4 font-display text-2xl text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/prosledi-poruchka"
              onClick={() => setOpen(false)}
              className="py-4 text-sm text-muted-foreground"
            >
              Проследи поръчка
            </Link>
            <Button asChild size="lg" className="mt-4 rounded-none tracking-wide">
              <Link to="/poruchaj" onClick={() => setOpen(false)}>
                Поръчай своята кутия
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
