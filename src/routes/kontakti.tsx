import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { submitContact } from "@/lib/forms.functions";
import { contactSchema } from "@/lib/validation";
import { BRAND } from "@/lib/config";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/kontakti")({
  head: () => ({
    meta: [
      { title: "Контакти — FLOWERPOST" },
      {
        name: "description",
        content: "Свържи се с екипа на FLOWERPOST по имейл или чрез формата за контакт.",
      },
      { property: "og:title", content: "Контакти — FLOWERPOST" },
      { property: "og:description", content: "Свържи се с екипа на FLOWERPOST." },
      { property: "og:url", content: "/kontakti" },
    ],
    links: [{ rel: "canonical", href: "/kontakti" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const send = useServerFn(submitContact);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(parsed.error.issues.map((i) => i.message));
      return;
    }
    setErrors([]);
    setLoading(true);
    const res = await send({ data: parsed.data });
    setLoading(false);
    if (res.ok) setDone(true);
    else setErrors([res.error]);
  }

  return (
    <>
      <PageHeader
        eyebrow="Контакти"
        title="Пиши ни"
        intro="Отговаряме лично, обикновено в рамките на един работен ден."
      />
      <div className="container-fp section-fp grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 className="font-display text-xl">Директно</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <a href={`mailto:${BRAND.email}`} className="hover:text-foreground">
              {BRAND.email}
            </a>
            <br />
            {BRAND.phone}
            <br />
            {BRAND.city}
          </p>
        </div>

        <div className="md:col-span-8">
          {done ? (
            <p className="surface-card p-6 text-sm">
              Благодарим за съобщението. Ще се свържем с теб скоро.
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
                <Label htmlFor="name">Име</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 rounded-none"
                />
              </div>
              <div>
                <Label htmlFor="email">Имейл</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-2 rounded-none"
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон (по желание)</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-2 rounded-none"
                />
              </div>
              <div>
                <Label htmlFor="subject">Тема (по желание)</Label>
                <Input
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="mt-2 rounded-none"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message">Съобщение</Label>
                <Textarea
                  id="message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-2 rounded-none"
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" className="rounded-none px-8" disabled={loading}>
                  {loading ? "Изпращане…" : "Изпрати"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
