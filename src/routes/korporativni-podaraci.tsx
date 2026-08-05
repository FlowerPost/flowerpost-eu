import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { submitCorporate } from "@/lib/forms.functions";
import { corporateSchema } from "@/lib/validation";
import { track } from "@/lib/analytics";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/korporativni-podaraci")({
  head: () => ({
    meta: [
      { title: "Корпоративни подаръци — FLOWERPOST" },
      {
        name: "description",
        content:
          "Подаръци за екипи, клиенти и партньори. Персонализирани кутии с рози и ръчно изписани картички, доставени по график.",
      },
      { property: "og:title", content: "Корпоративни подаръци — FLOWERPOST" },
      {
        property: "og:description",
        content: "Персонализирани кутии за екипи, клиенти и партньори.",
      },
      { property: "og:url", content: "/korporativni-podaraci" },
    ],
    links: [{ rel: "canonical", href: "/korporativni-podaraci" }],
  }),
  component: CorporatePage,
});

function CorporatePage() {
  const send = useServerFn(submitCorporate);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    boxCount: "10",
    targetDate: "",
    message: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = corporateSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(parsed.error.issues.map((i) => i.message));
      return;
    }
    setErrors([]);
    setLoading(true);
    const res = await send({ data: parsed.data });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      track("corporate_form_submit");
    } else setErrors([res.error]);
  }

  return (
    <>
      <PageHeader
        eyebrow="За бизнеса"
        title="Корпоративни подаръци"
        intro="Жест, който екипът или клиентът запомня. Персонализирани кутии, доставени по график и с еднакво внимание към всяка картичка."
      />

      <div className="container-fp section-fp grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="font-display text-2xl">Какво предлагаме</h2>
          <ul className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <li>Индивидуално послание за всеки получател, изписано на ръка.</li>
            <li>Съгласуван график на доставките за няколко адреса.</li>
            <li>Фактура с фирмени данни и единна отчетност.</li>
            <li>Възможност за брандиран елемент в кутията при по-големи количества.</li>
          </ul>
          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            Обемните поръчки се планират предварително спрямо наличността на пилотната серия.
          </p>
        </div>

        <div className="md:col-span-7">
          {done ? (
            <p className="surface-card p-6 text-sm">
              Благодарим за запитването. Ще се върнем с предложение в рамките на един работен ден.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
              {errors.length > 0 && (
                <ul className="border-l-2 border-destructive bg-destructive/5 p-4 text-sm text-destructive sm:col-span-2">
                  {errors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              )}
              <div>
                <Label htmlFor="cname">Име</Label>
                <Input
                  id="cname"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 rounded-none"
                />
              </div>
              <div>
                <Label htmlFor="company">Компания</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="mt-2 rounded-none"
                />
              </div>
              <div>
                <Label htmlFor="cemail">Служебен имейл</Label>
                <Input
                  id="cemail"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-2 rounded-none"
                />
              </div>
              <div>
                <Label htmlFor="cphone">Телефон (по желание)</Label>
                <Input
                  id="cphone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-2 rounded-none"
                />
              </div>
              <div>
                <Label htmlFor="boxCount">Приблизителен брой кутии</Label>
                <Input
                  id="boxCount"
                  type="number"
                  min={1}
                  value={form.boxCount}
                  onChange={(e) => setForm({ ...form, boxCount: e.target.value })}
                  className="mt-2 rounded-none"
                />
              </div>
              <div>
                <Label htmlFor="targetDate">Желана дата (по желание)</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={form.targetDate}
                  onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                  className="mt-2 rounded-none"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="cmessage">Детайли по запитването</Label>
                <Textarea
                  id="cmessage"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-2 rounded-none"
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" className="rounded-none px-8" disabled={loading}>
                  {loading ? "Изпращане…" : "Изпрати запитване"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
