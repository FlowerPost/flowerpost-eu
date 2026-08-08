# FLOWERPOST — MOTION BIBLE
> Прилага [[__BRAND_BIBLE.md]] и [[__DESIGN_BIBLE.md]] чрез движение. Framer Motion + Lenis.

## 1. Философия
Движението е **тихо доказателство за качество**, не забавление. Реферетна скорост:
бавно от луксозна реклама на часовник, не от gaming UI. Ако анимацията се забелязва
като "ефект" преди да се забележи съдържанието — прекалено бърза/силна е.

## 2. Global timing tokens (дефинирай в `src/lib/motion.ts`)
```ts
export const EASE_LUXE = [0.22, 1, 0.36, 1] as const; // primary ease-out
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;    // hover/interactive
export const DUR = { fast: 0.25, base: 0.6, slow: 1.1, epic: 1.8 } as const;
```
- Влизане на секции (fade+rise): `y: 32 → 0`, `opacity 0→1`, `DUR.base`, `EASE_LUXE`,
  trigger `whileInView` с `viewport={{ once: true, margin: "-15%" }}`.
- Никога `duration < 0.2s` за съдържание — само за micro hover feedback.
- Stagger между sibling елементи: `0.08–0.12s`, никога повече от 6 елемента stagger-нати
  наведнъж (изглежда developer-demo-ish отвъд това).

## 3. Lenis smooth scroll
- Инициализира се веднъж в root provider (`src/components/SmoothScrollProvider.tsx`),
  wrap-ва `{children}` в layout.
- `lerp: 0.1`, `duration: 1.2`, `smoothWheel: true`. Respect
  `prefers-reduced-motion` — при reduced motion, Lenis се disable-ва изцяло и
  Framer Motion transitions падат към `duration: 0.01`.
- Sync Lenis с Framer Motion scroll hooks чрез `useScroll` + `lenis.on('scroll', ...)`
  когато има scroll-driven анимации (LidReveal, Fugate parallax).

## 4. Hero "the Fugate" — специфична моторика
- При load: единичен elegant fade+scale-in на hero визуала (`scale: 1.04 → 1`,
  `DUR.epic`), докато текстът влиза separately с 150ms delay offset.
- При scroll: hero визуалът се движи с различна scroll velocity от текста
  (parallax factor ~0.15–0.25) — това е "fugue" ефектът, елементът леко "бяга"
  напред спрямо остатъка от страницата.
- Никога autoplay video/loop анимация в hero — статичен elegant motion, не motion
  graphics reel.

## 5. LidReveal — signature interaction
- Scroll-driven (не click-driven по default; click е fallback за touch/reduced-motion).
- Капакът ротира по X-ос (`rotateX: 0 → -110deg`, transform-origin: back edge) синхронно
  с scroll progress в рамките на pinned/sticky секция.
- Розите отдолу imaju subtle scale+opacity reveal изостанал с ~10% от lid progress,
  за да не изглежда instant pop.
- Sound-free, no haptic simulation — чисто визуално.

## 6. Hover / interactive micro-motion
- Бутони: gold underline wipe `scaleX: 0→1` left-to-right, `DUR.fast`, transform-origin left.
- Продуктови карти: `translateY(-4px)` + border opacity increase, `EASE_SOFT`.
- Никога bounce/spring за hover states — spring е запазен само за FreshnessStamp-подобни
  "печат" елементи (наследено от Vol.1 stamp motif), където лек spring усеща
  физическо подпечатване.

## 7. Performance правила
- Само `transform` и `opacity` анимации извън explicit will-change сценарии.
- Всеки `useScroll`/`useTransform` hook да е scoped към конкретен `ref`, не global
  window scroll listener директно.
- `will-change: transform` само по време на активна анимация (Framer Motion го
  управлява автоматично — не форсирай ръчно освен за LidReveal pin секцията).
