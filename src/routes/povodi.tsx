import { createFileRoute, Link } from "@tanstack/react-router";
import { OCCASIONS } from "@/lib/config";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/povodi")({
  head: () => ({
    meta: [
      { title: "Поводи — FLOWERPOST" },
      {
        name: "description",
        content:
          "Рожден ден, годишнина, любов, благодарност или просто така — идеи за послание към твоята FLOWERPOST кутия.",
      },
      { property: "og:title", content: "Поводи — FLOWERPOST" },
      { property: "og:description", content: "Идеи за послание към твоята FLOWERPOST кутия." },
      { property: "og:url", content: "/povodi" },
    ],
    links: [{ rel: "canonical", href: "/povodi" }],
  }),
  component: OccasionsPage,
});

function OccasionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Поводи"
        title="За кой момент е"
        intro="Понякога най-трудното е първото изречение. Ето откъде можеш да започнеш."
      />
      <div className="container-fp section-fp grid gap-6 md:grid-cols-2">
        {OCCASIONS.map((o) => (
          <article key={o.slug} id={o.slug} className="surface-card scroll-mt-24 p-7">
            <h2 className="font-display text-2xl text-foreground">{o.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.text}</p>
            <blockquote className="mt-5 border-l-2 border-champagne-deep pl-4 font-display text-lg italic text-foreground">
              „{o.suggestion}“
            </blockquote>
            <Button asChild variant="outline" className="mt-6 rounded-none">
              <Link to="/poruchaj">Създай кутия за този повод</Link>
            </Button>
          </article>
        ))}
      </div>
    </>
  );
}
