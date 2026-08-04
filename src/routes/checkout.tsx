import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { createOrder } from "@/lib/shop.functions";
import { checkoutSchema } from "@/lib/validation";
import { formatPrice } from "@/lib/pricing";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Плащане — FLOWERPOST" },
      { name: "description", content: "Завърши поръчката си във FLOWERPOST." },
      { property: "og:title", content: "Плащане — FLOWERPOST" },
      { property: "og:description", content: "Завърши поръчката си във FLOWERPOST." },
      { property: "og:url", content: "/checkout" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotalCents, shippingTotalCents, totalCents, clear, hydrated } = useCart();
  const submit = useServerFn(createOrder);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    billingAddress: "",
    companyName: "",
    companyEik: "",
    companyVat: "",
  });
  const [invoiceRequired, setInvoiceRequired] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [confirmedMessage, setConfirmedMessage] = useState(false);
  const [acceptDeliveryPolicy, setAcceptDeliveryPolicy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && items.length > 0) track("begin_checkout", { items: items.length });
  }, [hydrated, items.length]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    const parsed = checkoutSchema.safeParse({
      ...form,
      invoiceRequired,
      acceptTerms,
      confirmedMessage,
      acceptDeliveryPolicy,
    });
    if (!parsed.success) {
      setErrors(parsed.error.issues.map((i) => i.message));
      return;
    }
    if (invoiceRequired && (!form.companyName.trim() || !form.companyEik.trim())) {
      setErrors(["За фактура попълни име на фирмата и ЕИК."]);
      return;
    }
    setLoading(true);
    track("submit_order", { total: totalCents });
    try {
      const res = await submit({ data: { customer: parsed.data, items } });
      if (!res.ok) {
        setErrors([res.error]);
        setLoading(false);
        return;
      }
      clear();
      navigate({
        to: "/blagodarim",
        search: { order: res.orderNumber, token: res.accessToken },
      });
    } catch {
      setErrors(["Възникна грешка при изпращане на поръчката. Опитай отново."]);
      setLoading(false);
    }
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="container-fp section-fp max-w-xl text-center">
        <h1 className="display-lg">Количката е празна</h1>
        <Button asChild size="lg" className="mt-8 rounded-none px-8">
          <Link to="/poruchaj">Създай кутия</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-fp py-10 md:py-16">
      <p className="eyebrow">Стъпка 2 от 2</p>
      <h1 className="display-lg mt-3">Данни за поръчката</h1>

      <form onSubmit={onSubmit} className="mt-10 grid gap-10 lg:grid-cols-12" noValidate>
        <div className="space-y-6 lg:col-span-7">
          {errors.length > 0 && (
            <ul className="border-l-2 border-destructive bg-destructive/5 p-4 text-sm text-destructive">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">Име</Label>
              <Input id="firstName" value={form.firstName} onChange={set("firstName")} className="mt-2 rounded-none" />
            </div>
            <div>
              <Label htmlFor="lastName">Фамилия</Label>
              <Input id="lastName" value={form.lastName} onChange={set("lastName")} className="mt-2 rounded-none" />
            </div>
            <div>
              <Label htmlFor="email">Имейл</Label>
              <Input id="email" type="email" value={form.email} onChange={set("email")} className="mt-2 rounded-none" />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" value={form.phone} onChange={set("phone")} className="mt-2 rounded-none" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="billing">Адрес за фактуриране</Label>
              <Input id="billing" value={form.billingAddress} onChange={set("billingAddress")} className="mt-2 rounded-none" />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <Checkbox checked={invoiceRequired} onCheckedChange={(v) => setInvoiceRequired(v === true)} />
            <span>Желая фактура на фирма</span>
          </label>

          {invoiceRequired && (
            <div className="grid gap-4 border border-border bg-secondary/30 p-5 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <Label htmlFor="companyName">Име на фирмата</Label>
                <Input id="companyName" value={form.companyName} onChange={set("companyName")} className="mt-2 rounded-none bg-background" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="companyEik">ЕИК</Label>
                <Input id="companyEik" value={form.companyEik} onChange={set("companyEik")} className="mt-2 rounded-none bg-background" />
              </div>
              <div>
                <Label htmlFor="companyVat">ДДС №</Label>
                <Input id="companyVat" value={form.companyVat} onChange={set("companyVat")} className="mt-2 rounded-none bg-background" />
              </div>
            </div>
          )}

          <div className="space-y-3 border-t border-border pt-6">
            <label className="flex cursor-pointer items-start gap-2.5 text-sm">
              <Checkbox checked={confirmedMessage} onCheckedChange={(v) => setConfirmedMessage(v === true)} className="mt-0.5" />
              <span>Проверих текста на картичката и е верен.</span>
            </label>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm">
              <Checkbox checked={acceptDeliveryPolicy} onCheckedChange={(v) => setAcceptDeliveryPolicy(v === true)} className="mt-0.5" />
              <span>
                Запознат съм с{" "}
                <Link to="/dostavka-i-plashtane" className="underline underline-offset-4">
                  политиката за доставка
                </Link>{" "}
                и{" "}
                <Link to="/reklamacii" className="underline underline-offset-4">
                  рекламации
                </Link>
                .
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm">
              <Checkbox checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(v === true)} className="mt-0.5" />
              <span>
                Приемам{" "}
                <Link to="/obshti-uslovia" className="underline underline-offset-4">
                  Общите условия
                </Link>{" "}
                и{" "}
                <Link to="/poveritelnost" className="underline underline-offset-4">
                  Политиката за поверителност
                </Link>
                .
              </span>
            </label>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="surface-card sticky top-24 p-6">
            <h2 className="font-display text-xl">Поръчка</h2>
            <ul className="mt-4 space-y-3 border-b border-border pb-4 text-sm">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">
                    {i.roseCount} рози · {i.colorName} → {i.recipientName}
                  </span>
                  <span>{formatPrice(i.unitPriceCents + i.shippingCents)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Междинна сума</dt>
                <dd>{formatPrice(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Доставка</dt>
                <dd>{shippingTotalCents === 0 ? "Безплатна" : formatPrice(shippingTotalCents)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <dt>За плащане</dt>
                <dd className="font-medium">{formatPrice(totalCents)}</dd>
              </div>
            </dl>
            <Button type="submit" size="lg" className="mt-6 w-full rounded-none" disabled={loading}>
              {loading ? "Изпращане…" : "Завърши поръчката"}
            </Button>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              След потвърждение ще получиш инструкции за плащане с карта чрез сигурна връзка на
              Revolut. Поръчката се обработва след потвърдено плащане.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
