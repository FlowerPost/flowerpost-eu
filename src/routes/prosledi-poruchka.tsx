import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { trackOrder } from "@/lib/shop.functions";
import { formatDateBg, formatPrice } from "@/lib/pricing";
import { paymentStatusLabel, statusLabel } from "@/lib/config";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Result = Awaited<ReturnType<typeof trackOrder>>;

export const Route = createFileRoute("/prosledi-poruchka")({
  head: () => ({
    meta: [
      { title: "Проследи поръчка — FLOWERPOST" },
      {
        name: "description",
        content: "Провери статуса на своята FLOWERPOST поръчка с номер и имейл или телефон.",
      },
      { property: "og:title", content: "Проследи поръчка — FLOWERPOST" },
      { property: "og:description", content: "Провери статуса на своята поръчка." },
      { property: "og:url", content: "/prosledi-poruchka" },
    ],
    links: [{ rel: "canonical", href: "/prosledi-poruchka" }],
  }),
  component: TrackPage,
});

function TrackPage() {
  const lookup = useServerFn(trackOrder);
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await lookup({ data: { orderNumber, contact } });
      setResult(res);
      if (!res.ok) setError(res.error);
    } catch {
      setError("Провери въведените данни и опитай отново.");
    }
    setLoading(false);
  }

  return (
    <>
      <PageHeader
        eyebrow="Поръчки"
        title="Проследи своята поръчка"
        intro="Въведи номера на поръчката и имейла или телефона, с които е направена. Личните данни от картичката не се показват тук."
      />
      <div className="container-fp section-fp max-w-2xl">
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
          <div>
            <Label htmlFor="orderNumber">Номер на поръчката</Label>
            <Input
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="FP-2026-00001"
              className="mt-2 rounded-none"
            />
          </div>
          <div>
            <Label htmlFor="contact">Имейл или телефон</Label>
            <Input
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mt-2 rounded-none"
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="rounded-none px-8" disabled={loading}>
              {loading ? "Търсене…" : "Провери статуса"}
            </Button>
          </div>
        </form>

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

        {result?.ok && (
          <div className="surface-card mt-10 p-6">
            <h2 className="font-display text-2xl">{result.order.orderNumber}</h2>
            <dl className="mt-5 space-y-2 border-b border-border pb-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Статус</dt>
                <dd>{statusLabel(result.order.status)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Плащане</dt>
                <dd>{paymentStatusLabel(result.order.paymentStatus)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Обща сума</dt>
                <dd>{formatPrice(result.order.totalCents)}</dd>
              </div>
            </dl>
            <ul className="mt-5 space-y-3 text-sm">
              {result.order.items.map((i, idx) => (
                <li key={idx} className="text-muted-foreground">
                  {i.roseCount} рози · {i.colorName} · {i.city} · {formatDateBg(i.deliveryDate)}
                  {i.deliverySlot ? ` (${i.deliverySlot})` : ""}
                  {i.courier ? ` · ${i.courier}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
