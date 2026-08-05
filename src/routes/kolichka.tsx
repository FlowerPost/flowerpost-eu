import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatDateBg, formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/kolichka")({
  head: () => ({
    meta: [
      { title: "Количка — FLOWERPOST" },
      {
        name: "description",
        content: "Прегледай кутиите в количката си преди да завършиш поръчката.",
      },
      { property: "og:title", content: "Количка — FLOWERPOST" },
      { property: "og:description", content: "Прегледай кутиите в количката си." },
      { property: "og:url", content: "/kolichka" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/kolichka" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, removeItem, subtotalCents, shippingTotalCents, totalCents, hydrated } = useCart();

  if (!hydrated) {
    return <div className="container-fp section-fp text-sm text-muted-foreground">Зареждане…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-fp section-fp max-w-xl text-center">
        <p className="eyebrow">Количка</p>
        <h1 className="display-lg mt-4">Все още е празна</h1>
        <hr className="gold-rule mx-auto mt-6" />
        <p className="mt-6 text-sm text-muted-foreground">
          Създай своята кутия — избираш броя и цвета на розите и пишеш посланието.
        </p>
        <Button asChild size="lg" className="mt-8 rounded-none px-8">
          <Link to="/poruchaj">Създай кутия</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-fp py-10 md:py-16">
      <p className="eyebrow">Количка</p>
      <h1 className="display-lg mt-3">Твоите кутии</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <ul className="space-y-4 lg:col-span-7">
          {items.map((item) => (
            <li key={item.id} className="surface-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl">{item.productName}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.roseCount} рози · {item.colorName}
                    {item.occasion ? ` · ${item.occasion}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Премахни кутията"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>

              <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex gap-3">
                  <dt className="w-28 shrink-0 text-muted-foreground">Картичка</dt>
                  <dd className="whitespace-pre-wrap">
                    {item.cardRecipientName}
                    {item.cardMessage ? ` — „${item.cardMessage}“` : ""}
                    {item.hideSender
                      ? " (анонимно)"
                      : item.cardSenderName
                        ? `, ${item.cardSenderName}`
                        : ""}
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-28 shrink-0 text-muted-foreground">Получател</dt>
                  <dd>
                    {item.recipientName} · {item.recipientPhone}
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-28 shrink-0 text-muted-foreground">Адрес</dt>
                  <dd>
                    {item.streetAddress}, {item.city}
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-28 shrink-0 text-muted-foreground">Доставка</dt>
                  <dd>
                    {formatDateBg(item.deliveryDate)}
                    {item.deliverySlot ? ` · ${item.deliverySlot}` : ""} ·{" "}
                    {item.deliveryType === "sofia" ? "София" : `Куриер ${item.courier}`}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="text-muted-foreground">
                  Кутия {formatPrice(item.unitPriceCents)} + доставка{" "}
                  {item.shippingCents === 0 ? "0 €" : formatPrice(item.shippingCents)}
                </span>
                <span className="font-medium">
                  {formatPrice(item.unitPriceCents + item.shippingCents)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:col-span-5">
          <div className="surface-card sticky top-24 p-6">
            <h2 className="font-display text-xl">Обобщение</h2>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Междинна сума</dt>
                <dd>{formatPrice(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Доставка</dt>
                <dd>{shippingTotalCents === 0 ? "Безплатна" : formatPrice(shippingTotalCents)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <dt>Общо</dt>
                <dd className="font-medium">{formatPrice(totalCents)}</dd>
              </div>
            </dl>
            <Button asChild size="lg" className="mt-6 w-full rounded-none">
              <Link to="/checkout">Към плащане</Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full rounded-none">
              <Link to="/poruchaj">Добави още една кутия</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
