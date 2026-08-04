import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/PageHeader";

export const Route = createFileRoute("/kak-raboti")({
  head: () => ({
    meta: [
      { title: 'Как работи — FLOWERPOST' },
      { name: "description", content: 'Четири стъпки от избора на розите до доставката на кутията.' },
      { property: "og:title", content: 'Как работи — FLOWERPOST' },
      { property: "og:description", content: 'Четири стъпки от избора на розите до доставката на кутията.' },
      { property: "og:url", content: "/kak-raboti" },
    ],
    links: [{ rel: "canonical", href: "/kak-raboti" }],
  }),
  component: HowPage,
});

function HowPage() {
  return (
    <>
      <PageHeader eyebrow={'Процесът'} title={'Как работи'} intro={'От конфигуратора до вратата на получателя — процесът е кратък, но всяка стъпка е обмислена.'} />
      <Prose>
        <h2>1. Избираш кутията</h2>
        <p>Определяш броя рози — от 11 до 21, на стъпки от по 2 — и цвета им. Цената се обновява веднага и е видима на всяка стъпка.</p>
        <h2>2. Пишеш посланието</h2>
        <p>До 300 символа, които изписваме на ръка. Добавяш името на получателя, а своето можеш да скриеш, ако предпочиташ анонимност.</p>
        <h2>3. Ние подготвяме</h2>
        <p>Подреждаме розите в деня преди доставката, обгръщаме ги в tissue хартия и добавяме картичката, съветите за грижа и панделката.</p>
        <h2>4. Доставяме</h2>
        <p>Лично в София или с куриер до цялата страна. Потвърждаваме часовия интервал предварително, за да е сигурно, че някой ще посрещне кутията.</p>
      </Prose>
    </>
  );
}
