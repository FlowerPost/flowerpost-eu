import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { z } from "zod";
import { getOrderSummary } from "@/lib/shop.functions";
import { formatDateBg, formatPrice } from "@/lib/pricing";
import { paymentStatusLabel, statusLabel } from "@/lib/config";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  order: z.string().default(""),
  token: z.string().default(""),
});

export const Route = createFileRoute("/blagodarim")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Благодарим за поръчката — FLOWERPOST" },
      { name: "description", content: "Потвърждение на поръчката и инструкции за плащане." },
      { property: "og:title", content: "Благодарим за поръчката — FLOWERPOST" },
      { property: "og:description", content: "Потвърждение на поръчката." },
      { property: "og:url", content: "/blagodarim" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/blagodarim" }],
  }),
  component: ThankYou,
});

function ThankYou() {
  const { order, token } = Route.useSearch();
  const fetchSummary = useServerFn(getOrderSummary);
  const { data, isPending } = useQuery({
    queryKey: ["order-summary", order, token],
    queryFn: () => fetchSummary({ data: { orderNumber: order, token } }),
    enabled: Boolean(order && token),
  });

  useEffect(() => {
    if (order) track("payment_redirect", { orderNumber: order });
  }, [order]);

  if (!order || !token) {
    return (
      <div className="container-fp section-fp max-w-xl text-center">
        <h1 className="display-lg">Липсват данни за поръчката</h1>
        <Button asChild className="mt-8 rounded-none px-8">
          <Link to="/prosledi-poruchka">Проследи поръчка</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-fp py-12 md:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Поръчката е приета</p>
        <h1 className="display-lg mt-4">Благодарим.</h1>
        <hr className="gold-rule mt-6" />
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          Номерът на твоята поръчка е{" "}
          <strong className="text-foreground">{order}</strong>. Запази го — с него можеш да
          проследиш статуса по всяко време.
        </p>

        {isPending && <p className="mt-8 text-sm text-muted-foreground">Зареждане…</p>}

        {data && !data.ok && (
          <p className="mt-8 text-sm text-destructive">{data.error}</p>
        )}

        {data && data.ok && (
          <>
            <div className="surface-card mt-8 p-6">
              <h2 className="font-display text-xl">Плащане</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Плащането се извършва с карта чрез сигурна връзка на Revolut. Статус:{" "}
                <strong className="text-foreground">
                  {paymentStatusLabel(data.order.paymentStatus)}
                </strong>
                .
              </p>
              {data.revolutLink ? (
                <Button asChild size="lg" className="mt-5 rounded-none px-8">
                  <a href={data.revolutLink} target="_blank" rel="noopener noreferrer">
                    Плати сигурно
                  </a>
                </Button>
              ) : (
                <p className="mt-5 border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
                  Ще получиш линк за плащане на посочения имейл. Поръчката се потвърждава ръчно от
                  нашия екип след получено плащане.
                </p>
              )}
            </div>

            <div className="surface-card mt-6 p-6">
              <h2 className="font-display text-xl">Резюме</h2>
              <ul className="mt-4 space-y-3 border-b border-border pb-4 text-sm">
                {data.order.items.map((i, idx) => (
                  <li key={idx} className="flex flex-wrap justify-between gap-2">
                    <span className="text-muted-foreground">
                      {i.roseCount} рози · {i.colorName} → {i.recipientName}, {i.city} ·{" "}
                      {formatDateBg(i.deliveryDate)}
                      {i.deliverySlot ? ` (${i.deliverySlot})` : ""}
                    </span>
                    <span>{formatPrice(i.unitPriceCents + i.shippingCents)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Статус на поръчката</dt>
                  <dd>{statusLabel(data.order.status)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt>Общо</dt>
                  <dd className="font-medium">{formatPrice(data.order.totalCents)}</dd>
                </div>
              </dl>
            </div>
          </>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-none px-6">
            <Link to="/prosledi-poruchka">Проследи поръчка</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-none px-6">
            <Link to="/">Към началото</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
