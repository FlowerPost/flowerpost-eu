import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import boxClosedImg from "@/assets/box-closed.jpg";
import rosesImg from "@/assets/roses-closeup.jpg";
import cardImg from "@/assets/card-detail.jpg";
import { BOX_CONTENTS, BRAND, OCCASIONS } from "@/lib/config";
import { formatPrice, roseBoxPriceCents } from "@/lib/pricing";
import { shopDataQuery } from "@/lib/shop-queries";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(shopDataQuery());
  },
  head: () => ({
    meta: [
      { title: "FLOWERPOST — подаръчна кутия с рози и ръчно изписана картичка" },
      {
        name: "description",
        content:
          "Премиум подаръчна кутия със свежи рози, персонализирано послание и ръчно изписано име. Безплатна доставка в София, куриер за цялата страна.",
      },
      { property: "og:title", content: "FLOWERPOST — подаръчна кутия с рози и ръчно изписана картичка" },
      {
        property: "og:description",
        content: "Премиум подаръчна кутия със свежи рози, персонализирано послание и ръчно изписано име. Безплатна доставка в София, куриер за цялата страна.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(shopDataQuery());
  const pricing = data.pricing;
  const inventory = data.product?.boxInventory ?? 0;
  const soldOut = inventory <= 0 || data.product?.isActive === false;

  useEffect(() => {
    track("view_product", { product: "flowerpost-signature-box" });
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero-veil relative overflow-hidden">
        <div className="container-fp grid items-center gap-10 py-14 md:grid-cols-2 md:gap-16 md:py-24">
          <div className="order-2 md:order-1">
            <p className="eyebrow">Пилотна серия · София и страната</p>
            <h1 className="display-xl mt-5 text-foreground">
              Някой мисли
              <br />
              за теб.
            </h1>
            <hr className="gold-rule mt-8" />
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Продълговата кутия в цвят шампанско. Свежи рози, подредени една до друга. Твоите думи,
              изписани на ръка. Подарък, който се отваря бавно.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-none px-8 tracking-wide">
                <Link to="/poruchaj">
                  Създай своята кутия
                  <ArrowRight className="ml-1 h-4 w-4" strokeWidth={1.5} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-none px-8 tracking-wide">
                <Link to="/kak-raboti">Как работи</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              От {formatPrice(roseBoxPriceCents(pricing.minRoses, pricing))} · {pricing.minRoses}–
              {pricing.maxRoses} рози ·{" "}
              {soldOut ? (
                <span className="text-primary">пилотната серия е изчерпана</span>
              ) : (
                <span>останали {inventory} кутии</span>
              )}
            </p>
          </div>

          <div className="order-1 md:order-2">
            <div className="overflow-hidden shadow-[var(--shadow-lift)] bg-ink">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={heroPoster.url}
                className="h-full w-full object-cover aspect-[4/3]"
              >
                <source src={heroVideo.url} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Емоционален блок */}
      <section className="section-fp">
        <div className="container-fp max-w-3xl text-center">
          <p className="eyebrow">Философията</p>
          <p className="display-md mt-6 text-foreground">
            „Един жест може да каже повече от дълъг разговор. FLOWERPOST е начин да го изпратиш —
            бавно, внимателно и точно навреме.“
          </p>
          <hr className="gold-rule mx-auto mt-8" />
        </div>
      </section>

      {/* Какво съдържа кутията */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container-fp section-fp grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow">Съдържание</p>
            <h2 className="display-lg mt-4 text-foreground">Какво има вътре</h2>
            <hr className="gold-rule mt-6" />
            <div className="mt-8 overflow-hidden">
              <img
                src={boxClosedImg}
                alt="Затворена кутия FLOWERPOST със сатенена панделка"
                width={1200}
                height={1200}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <ul className="md:col-span-7 md:pt-16">
            {BOX_CONTENTS.map((item, i) => (
              <li key={item.title} className="flex gap-5 border-b border-border/70 py-5 first:pt-0">
                <span className="font-display text-xl text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-medium text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Как работи */}
      <section className="section-fp">
        <div className="container-fp">
          <p className="eyebrow">Процесът</p>
          <h2 className="display-lg mt-4 text-foreground">Четири стъпки</h2>
          <hr className="gold-rule mt-6" />
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Избираш", d: "Брой и цвят на розите — от 11 до 21, на стъпки от по 2." },
              { t: "Персонализираш", d: "Име на получателя и твоето послание, изписани на ръка." },
              { t: "Ние подготвяме", d: "Подреждаме кутията в деня преди доставката." },
              { t: "Доставяме", d: "Лично в София или с куриер до цялата страна." },
            ].map((s, i) => (
              <li key={s.t}>
                <span className="font-display text-4xl text-champagne-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg text-foreground">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Детайли */}
      <section className="border-t border-border">
        <div className="grid md:grid-cols-2">
          <img
            src={rosesImg}
            alt="Макро кадър на кремави и розови рози"
            width={1200}
            height={1200}
            loading="lazy"
            className="h-64 w-full object-cover md:h-[32rem]"
          />
          <div className="flex items-center bg-secondary/40 px-6 py-14 md:px-16">
            <div className="max-w-sm">
              <p className="eyebrow">Розите</p>
              <h2 className="display-md mt-4 text-foreground">Подбрани сутринта</h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Работим с малки количества, за да няма компромис. Всяка роза се подбира ръчно, а при
                куриерска доставка пътува с водна пипета.
              </p>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2">
          <div className="order-2 flex items-center px-6 py-14 md:order-1 md:px-16">
            <div className="max-w-sm">
              <p className="eyebrow">Картичката</p>
              <h2 className="display-md mt-4 text-foreground">Изписана на ръка</h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                До 300 символа върху памучна хартия с накъсан ръб. Ако искаш, можеш да останеш
                анонимен — името на изпращача е по избор.
              </p>
            </div>
          </div>
          <img
            src={cardImg}
            alt="Празна картичка от памучна хартия със сатенена панделка и роза"
            width={1200}
            height={1200}
            loading="lazy"
            className="order-1 h-64 w-full object-cover md:order-2 md:h-[32rem]"
          />
        </div>
      </section>

      {/* Поводи */}
      <section className="section-fp border-t border-border">
        <div className="container-fp">
          <p className="eyebrow">Поводи</p>
          <h2 className="display-lg mt-4 text-foreground">За кой момент е</h2>
          <hr className="gold-rule mt-6" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OCCASIONS.map((o) => (
              <Link
                key={o.slug}
                to="/povodi"
                hash={o.slug}
                className="surface-card lift block p-6 hover:lift-hover"
              >
                <h3 className="font-display text-xl text-foreground">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="container-fp flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <h2 className="display-md">Изпрати нещо, което се помни.</h2>
            <p className="mt-3 text-sm opacity-80">
              {BRAND.tagline} · Безплатна доставка в София.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="rounded-none px-8 tracking-wide">
            <Link to="/poruchaj">Поръчай сега</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
