# FLOWERPOST Vol.2 — Project Vision

## Какво е това
Greenfield rebuild на FlowerPost landing experience. Vol.1 (папка `flowerpost`)
доказа концепцията (Bulgarian flower subscription, "ритуал на цветята", terra/sage
farmhouse естетика). Vol.2 е репозиционирането към **тих луксозен editorial бранд**,
изведен директно от реалните физически продуктови артефакти (кремава кутия, златен
монограм "FP", бордо рози, шампанска панделка) — виж [[__BRAND_BIBLE.md]].

## Технически стек
- Next.js (latest) + React 19 + App Router + `src/` directory
- Tailwind CSS v4
- Framer Motion (animation)
- Lenis (smooth scroll)
- Strict TypeScript, без `any`
- **Supabase/backend е отложен за тази фаза** — само визуална разработка, никакви
  реални forms/submissions/DB calls. Placeholder/demo state само.

## Доктрина (задължителна за всяко решение)
1. [[__BRAND_BIBLE.md]] — кой е брандът, глас, палитра, лого правила
2. [[__DESIGN_BIBLE.md]] — layout, типография, компонентна карта
3. [[__MOTION_BIBLE.md]] — Framer Motion + Lenis timing и поведение
4. [[__3D_BIBLE.md]] — depth/parallax/perspective техники

## Обхват на текущата фаза (landing page)
Секции, в ред на появяване на страницата:
1. **HeroSection** (вътрешно име "the Fugate") — flagship visual moment
2. **StoryScene** — editorial наратив за произход/ритуал
3. **ProductScene** — продуктова презентация с mono спецификации
4. **LidReveal** — signature scroll-driven unboxing interaction
5. **ConfiguratorTeaser** — визуален тийзър за бъдещ box-builder (не функционален)
6. **TrustScene** — provenance/farms доверие блок
7. **Footer** — минимален, тъмен

## Извън обхват (не прави без изрична задача)
- Supabase queries, email capture backend, реални форми със submit logic
- Three.js/WebGL 3D рендъринг (виж [[__3D_BIBLE.md]] §5 за критериите за ескалация)
- Multi-page routing отвъд единствен landing route
- Анализ или преизползване на код от Vol.1 освен ако не е поискано изрично

## Работен режим
- Пиши код и push-вай веднага, без одити/дълги обяснения/въпроси преди действие.
- Кратък отчет след изпълнение.
- Малки компоненти, strict TypeScript, без dead code.
