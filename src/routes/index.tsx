import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import boxClosedImg from "@/assets/box-closed.jpg";
import rosesImg from "@/assets/roses-closeup.jpg";
import cardImg from "@/assets/card-detail.jpg";
import heroVideo from "@/assets/hero-3d.mp4.asset.json";
import heroPoster from "@/assets/hero-3d-poster.png.asset.json";
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
      {
        property: "og:title",
        content: "FLOWERPOST — подаръчна кутия с рози и ръчно изписана картичка",
      },
      {
        property: "og:description",
        content:
          "Премиум подаръчна кутия със свежи рози, персонализирано послание и ръчно изписано име. Безплатна доставка в София, куриер за цялата страна.",
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

    // Fade-in on scroll (simple, accessible)
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll("[data-fade]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* HERO (keep existing video/poster but update copy & CTAs) */}
      <section className="hero-veil relative overflow-hidden" aria-label="Hero">
        <div className="container-fp grid items-center gap-12 py-14 md:grid-cols-12 md:gap-16 md:py-24">
          <div className="order-1 hero-stage md:col-span-7" data-fade>
            <div className="hero-portal aspect-[4/3] w-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={heroPoster.url}
                className="hero-slow-zoom h-full w-full object-cover"
                aria-hidden="true"
              >
                <source src={heroVideo.url} type="video/mp4" />
              </video>
              <span className="hero-portal-rim" aria-hidden="true" />
            </div>
          </div>

          <div className="order-2 md:col-span-5" data-fade>
            <p className="eyebrow">Повече от цветя</p>
            <h1 className="display-xl mt-5 text-foreground">
              Повече от букет.
              <br />
              Емоции, доставени с внимание.
            </h1>
            <hr className="gold-rule mt-8" />
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Луксозни аранжировки от свежи рози, поднесени в елегантна подаръчна кутия и доставени с грижа
              към всеки детайл.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-none px-8 tracking-wide">
                <Link to="/poruchaj">
                  Разгледайте колекцията
                  <ArrowRight className="ml-1 h-4 w-4" strokeWidth={1.5} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-none px-8 tracking-wide"
              >
                <Link to="/poruchaj">Поръчайте сега</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">С внимание към най-малкия детайл.</p>

            <p className="mt-6 text-sm text-muted-foreground">
              От {formatPrice(roseBoxPriceCents(pricing.minRoses, pricing))} · {pricing.minRoses}–
              {pricing.maxRoses} рози ·{' '}
              {soldOut ? (
                <span className="text-primary">пилотната серия е изчерпана</span>
              ) : (
                <span>останали {inventory} кутии</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* WHY FLOWER POST */}
      <section className="section-fp" aria-labelledby="why-heading">
        <div className="container-fp" data-fade>
          <h2 id="why-heading" className="display-md">Защо FLOWERPOST</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="surface-card p-6 text-center lift">
              <div className="text-4xl">🌹</div>
              <h3 className="mt-4 font-display text-lg">Премиум свежи рози</h3>
              <p className="mt-2 text-sm text-muted-foreground">Подбираме само свежи цветя с безкомпромисно качество.</p>
            </div>
            <div className="surface-card p-6 text-center lift">
              <div className="text-4xl">🎁</div>
              <h3 className="mt-4 font-display text-lg">Луксозна подаръчна кутия</h3>
              <p className="mt-2 text-sm text-muted-foreground">Елегантна опаковка, която превръща всеки букет в истинско преживяване.</p>
            </div>
            <div className="surface-card p-6 text-center lift">
              <div className="text-4xl">💌</div>
              <h3 className="mt-4 font-display text-lg">Персонално послание</h3>
              <p className="mt-2 text-sm text-muted-foreground">Добавете картичка с лично послание без допълнително заплащане.</p>
            </div>
            <div className="surface-card p-6 text-center lift">
              <div className="text-4xl">🚚</div>
              <h3 className="mt-4 font-display text-lg">Доставка с внимание</h3>
              <p className="mt-2 text-sm text-muted-foreground">Всяка поръчка пристига подготвена така, че да изглежда безупречно.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE EXPERIENCE — horizontal storytelling */}
      <section className="section-fp border-y border-border bg-secondary/30" aria-labelledby="exp-heading">
        <div className="container-fp">
          <h2 id="exp-heading" className="display-md" data-fade>Всеки детайл е създаден, за да направи момента незабравим.</h2>
          <div className="mt-8 overflow-x-auto story-scroll" data-fade>
            <ul className="flex gap-6 w-max">
              <li className="w-[28rem] surface-card p-4">
                <img src={boxClosedImg} alt="Затворена кутия FLOWERPOST" className="h-56 w-full object-cover story-img" />
                <p className="mt-3 text-sm text-muted-foreground">Затворена кутия</p>
              </li>
              <li className="w-[28rem] surface-card p-4">
                <img src={cardImg} alt="Отваряне на кутията" className="h-56 w-full object-cover story-img" />
                <p className="mt-3 text-sm text-muted-foreground">Отваряне</p>
              </li>
              <li className="w-[28rem] surface-card p-4">
                <img src={rosesImg} alt="Разгръщане и красота на розите" className="h-56 w-full object-cover story-img" />
                <p className="mt-3 text-sm text-muted-foreground">Разгръщане</p>
              </li>
              <li className="w-[28rem] surface-card p-4">
                <img src={rosesImg} alt="Финални детайли" className="h-56 w-full object-cover story-img" />
                <p className="mt-3 text-sm text-muted-foreground">Финални детайли</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* PRODUCTS — elegant cards (visual only) */}
      <section className="section-fp" aria-labelledby="products-heading">
        <div className="container-fp">
          <h2 id="products-heading" className="display-lg" data-fade>Колекция</h2>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground" data-fade>Избери класическа елегантност или модерен минимализъм — всеки букет идва в луксозна кутия.</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { key: 'classic', title: 'Classic', desc: '15 кремави рози', color: 'champagne' },
              { key: 'romance', title: 'Romance', desc: '15 червени рози', color: 'burgundy' },
              { key: 'white', title: 'White Elegance', desc: '15 бели рози', color: 'ivory' },
            ].map((p) => (
              <article key={p.key} className="surface-card p-6 lift hover:lift-hover" data-fade>
                <div className="h-48 overflow-hidden rounded-md">
                  <img src={rosesImg} alt={`${p.title} — ${p.desc}`} className="w-full h-full object-cover card-img" />
                </div>
                <h3 className="mt-4 font-display text-lg">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-3 text-sm text-muted-foreground space-y-1">
                  <li>✔ Свежи цветя</li>
                  <li>✔ Луксозна подаръчна кутия</li>
                  <li>✔ Персонална картичка</li>
                  <li>✔ Инструкции за грижа</li>
                </ul>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-medium">{formatPrice(roseBoxPriceCents(15, pricing))}</span>
                  <Button asChild size="sm">
                    <Link to="/poruchaj">Поръчайте</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="section-fp bg-secondary/10" aria-labelledby="diff-heading">
        <div className="container-fp" data-fade>
          <h2 id="diff-heading" className="display-lg">Не изпращаме просто цветя.</h2>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground">Създаваме момента, в който някой отваря кутията и остава без думи.</p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {['Премиум визия','Ръчна аранжировка','Луксозна опаковка','Персонално отношение','Внимание към всеки детайл'].map((f)=> (
              <li key={f} className="surface-card p-4 text-center lift">
                <p className="text-sm font-medium">{f}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS — reuse existing process block */}
      <section className="section-fp" aria-labelledby="how-heading" data-fade>
        <div className="container-fp">
          <h2 id="how-heading" className="display-lg">Как работи</h2>
          <ol className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: 'Избирате букет', d: 'Изберете модел и брой рози.' },
              { t: 'Добавяте лично послание', d: 'Кратко и лично послание, ръчно изписано.' },
              { t: 'Ние аранжираме всичко ръчно', d: 'Всяка кутия се сглобява и проверява.' },
              { t: 'Доставяме готовия подарък', d: 'Доставка в предпочитания от вас ден и часови прозорец.' },
            ].map((s, i) => (
              <li key={s.t} className="text-center">
                <span className="font-display text-4xl text-champagne-deep">{String(i + 1).padStart(2,'0')}</span>
                <h3 className="mt-3 text-lg">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHAT'S INSIDE THE BOX */}
      <section className="section-fp border-y border-border bg-secondary/20" aria-labelledby="inside-heading" data-fade>
        <div className="container-fp grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 id="inside-heading" className="display-lg">Какво има в кутията</h2>
            <ul className="mt-6 text-sm text-muted-foreground space-y-2">
              <li>✓ Свеж букет</li>
              <li>✓ Луксозна подаръчна кутия</li>
              <li>✓ Персонална картичка</li>
              <li>✓ Инструкции за грижа</li>
              <li>✓ Транспортна защита</li>
            </ul>
          </div>
          <img src={boxClosedImg} alt="Какво има в кутията - бутилка и рози" className="w-full h-64 object-cover rounded-md" />
        </div>
      </section>

      {/* QUALITY & DELIVERY (compact) */}
      <section className="section-fp" data-fade>
        <div className="container-fp grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="display-md">Безкомпромисно качество</h3>
            <p className="mt-4 text-sm text-muted-foreground">Подбрани свежи цветя. Всеки букет се аранжира ръчно. Всяка поръчка се изработва с внимание.</p>
          </div>
          <div>
            <h3 className="display-md">Доставка с внимание</h3>
            <p className="mt-4 text-sm text-muted-foreground">Доставка в същия ден при поръчки до 14:00 часа. Възможност за избор на часови диапазон между 09:00 и 19:00 часа.</p>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section-fp border-t border-border" data-fade>
        <div className="container-fp">
          <h2 className="display-lg">Отзиви</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <blockquote className="surface-card p-6">★★★★★<p className="mt-3">„Най-красивият подарък, който съм получавала.“</p></blockquote>
            <blockquote className="surface-card p-6">★★★★★<p className="mt-3">„Изглежда още по-красиво на живо.“</p></blockquote>
            <blockquote className="surface-card p-6">★★★★★<p className="mt-3">„Опаковката беше впечатляваща.“</p></blockquote>
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="section-fp bg-secondary/10" data-fade>
        <div className="container-fp">
          <h2 className="display-md">Споделете своя момент</h2>
          <p className="mt-2 text-sm text-muted-foreground">#flowerpost</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <img src={rosesImg} alt="Instagram 1" className="w-full h-28 object-cover rounded-sm" />
            <img src={boxClosedImg} alt="Instagram 2" className="w-full h-28 object-cover rounded-sm" />
            <img src={cardImg} alt="Instagram 3" className="w-full h-28 object-cover rounded-sm" />
            <img src={rosesImg} alt="Instagram 4" className="w-full h-28 object-cover rounded-sm" />
          </div>
        </div>
      </section>

      {/* FAQ (accessible accordion using details) */}
      <section className="section-fp" data-fade aria-labelledby="faq-heading">
        <div className="container-fp max-w-3xl">
          <h2 id="faq-heading" className="display-lg">Често задавани въпроси</h2>
          <div className="mt-6 space-y-3">
            {[
              'Колко време издържат цветята?',
              'Как се доставят?',
              'Мога ли да избера час?',
              'Какво става ако получателят не е вкъщи?',
              'Има ли персонално послание?'
            ].map((q)=> (
              <details key={q} className="surface-card p-4">
                <summary className="font-medium">{q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">Отговор: Ние работим, за да осигурим максимална свежест и ще се свържем при нужда.</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-secondary/5">
        <div className="container-fp py-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <strong>FLOWERPOST</strong>
            <div className="text-sm text-muted-foreground mt-2">Контакти · Instagram · TikTok</div>
          </div>
          <nav className="text-sm text-muted-foreground flex gap-4">
            <Link to="/politika">Политика за поверителност</Link>
            <Link to="/usloviya">Общи условия</Link>
            <Link to="/faq">Често задавани въпроси</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
