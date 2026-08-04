import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/PageHeader";

export const Route = createFileRoute("/biskvitki")({
  head: () => ({
    meta: [
      { title: 'Политика за бисквитките — FLOWERPOST' },
      { name: "description", content: 'Какви бисквитки използва FLOWERPOST и как да управляваш съгласието си.' },
      { property: "og:title", content: 'Политика за бисквитките — FLOWERPOST' },
      { property: "og:description", content: 'Какви бисквитки използва FLOWERPOST и как да управляваш съгласието си.' },
      { property: "og:url", content: "/biskvitki" },
    ],
    links: [{ rel: "canonical", href: "/biskvitki" }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <>
      <PageHeader eyebrow={'Правна информация'} title={'Политика за бисквитките'} intro={'Използваме минимален набор бисквитки. Аналитични и маркетингови се зареждат само след изрично съгласие.'} />
      <Prose>
        <h2>Необходими бисквитки</h2>
        <p>Осигуряват работата на количката и сигурността на формите. Не могат да бъдат изключени.</p>
        <h2>Аналитични бисквитки</h2>
        <p>Помагат ни да разберем как се използва сайтът. Данните са агрегирани и анонимни.</p>
        <h2>Маркетингови бисквитки</h2>
        <p>Използват се за измерване на кампании и ремаркетинг. Зареждат се само при дадено съгласие.</p>
        <h2>Управление на съгласието</h2>
        <p>Можеш да промениш избора си по всяко време, като изчистиш данните на сайта в браузъра си и презаредиш страницата.</p>
      </Prose>
    </>
  );
}
