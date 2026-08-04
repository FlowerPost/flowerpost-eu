import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/PageHeader";

export const Route = createFileRoute("/za-nas")({
  head: () => ({
    meta: [
      { title: 'За нас — FLOWERPOST' },
      { name: "description", content: 'Историята зад FLOWERPOST — марка за подаръци, създадена около един жест.' },
      { property: "og:title", content: 'За нас — FLOWERPOST' },
      { property: "og:description", content: 'Историята зад FLOWERPOST — марка за подаръци, създадена около един жест.' },
      { property: "og:url", content: "/za-nas" },
    ],
    links: [{ rel: "canonical", href: "/za-nas" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader eyebrow={'Историята'} title={'За нас'} intro={'FLOWERPOST е малка марка от София, създадена около една проста идея: жестът е по-важен от повода.'} />
      <Prose>
        <h2>Как започна</h2>
        <p>Започнахме с една кутия и едно изречение — „Някой мисли за теб“. Останалото дойде от хората, които искаха да го кажат, но не знаеха как.</p>
        <h2>Как работим</h2>
        <p>Работим на малки серии. Всяка кутия се подрежда ръчно в деня преди доставката, а всяка картичка се изписва на ръка. Не автоматизираме частта, която прави подаръка личен.</p>
        <h2>Пилотната серия</h2>
        <p>В момента предлагаме ограничена серия от 50 кутии. Когато свършат, спираме поръчките, докато не подготвим следващата.</p>
      </Prose>
    </>
  );
}
