import { createFileRoute } from "@tanstack/react-router";
import { FAQ_ITEMS } from "@/lib/config";
import { PageHeader } from "@/components/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/vaprosi")({
  head: () => ({
    meta: [
      { title: "Често задавани въпроси — FLOWERPOST" },
      {
        name: "description",
        content:
          "Отговори за съдържанието на кутията, броя рози, персонализацията, доставката, плащането и рекламациите.",
      },
      { property: "og:title", content: "Често задавани въпроси — FLOWERPOST" },
      { property: "og:description", content: "Отговори за поръчката, доставката и плащането." },
      { property: "og:url", content: "/vaprosi" },
    ],
    links: [{ rel: "canonical", href: "/vaprosi" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Помощ"
        title="Често задавани въпроси"
        intro="Ако не намираш отговора си тук, пиши ни — отговаряме лично."
      />
      <div className="container-fp section-fp max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-display text-lg">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
