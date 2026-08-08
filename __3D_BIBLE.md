# FLOWERPOST — 3D BIBLE
> Прилага [[__BRAND_BIBLE.md]], [[__DESIGN_BIBLE.md]], [[__MOTION_BIBLE.md]].
> Обхваща depth/parallax/pseudo-3D техники, използвани БЕЗ WebGL runtime за момента.

## 1. Обхват на "3D" в тази фаза
Няма Three.js/WebGL dependency в текущия greenfield build — прекалено тежко за
initial landing performance budget. "3D" тук означава **layered CSS/Framer Motion
depth** (parallax, perspective transforms, rotateX/Y), не истински 3D рендъринг.
Ако бъдещ configurator изисква реален 3D box viewer — това е отделно решение,
взето изрично, не имплицитно от тази доктрина.

## 2. Depth layer система
Всяка scene, използваща depth, дефинира explicit layers по z-порядък:
```
layer-bg      → далечен фон (gradient/texture), parallax factor 0.05–0.1
layer-mid     → второстепенни декоративни елементи, factor 0.2–0.35
layer-subject → основният обект (кутия/роза/текст block), factor 0.5–0.7 или fixed
layer-fg      → преден план акцент (напр. частичен crop на роза), factor 0.9–1.1
             (движи се БЪРЗО от базовия скрол → усеща се "най-близо")
```
Имплементация: `useTransform(scrollYProgress, [0,1], [startPx, endPx])` per layer,
приложено към `translateY` (не `top/left` — GPU-friendly).

## 3. Perspective & rotation правила (за LidReveal и product cards)
- Container: `perspective: 1200px` (CSS), деца получават `transform-style: preserve-3d`
  само за елементи, участващи в rotation (капак, карти при hover-tilt).
- Rotation амплитуда е сдържана:
  - Card hover tilt: max `rotateX/rotateY: 4deg`, spring `stiffness: 150, damping: 20`.
  - LidReveal: `rotateX` до `-110deg` (виж Motion Bible §5) — единствената голяма
    rotation в целия сайт. Ако усетиш нужда от повторение на този ефект другаде —
    спри и провери дали не отслабва signature-ефекта чрез overuse.
- Никога rotate по Z-ос за "3D" усещане — Z-rotation чете като 2D spin, не depth.

## 4. Light & shadow консистентност
- Единствен виртуален light source: горе-ляво, топла температура (съответства на
  референтните продуктови снимки с естествена светлина).
- Всички pseudo-3D елементи (lid, tilted cards) хвърлят сянка спрямо тази посока:
  `box-shadow` offset долу-дясно, топъл тъмен тон (`rgba(43,36,32, X)`), никога
  чисто черна сянка.

## 5. Кога да ескалираш до истинско 3D (бъдещо решение, не сега)
Валидни тригери за въвеждане на react-three-fiber в бъдеща фаза:
- ConfiguratorTeaser преминава от "тийзър" към функционален box-builder с
  избираеми цветя/цветове, изискващи истинска ротация на продукт.
- Explicit продуктов ask за "завърти кутията с мишката" интеракция.
До тогава — CSS/Framer depth техниките по-горе са границата на обхвата.

## 6. Performance guardrails
- Depth-layer parallax се изчислява само за viewport-visible scenes
  (`useInView` gate преди да се activate-ва `useScroll` transform chain).
- Mobile: намали parallax factors наполовина (движение на малък viewport се
  усеща по-агресивно) и премахни card tilt-on-hover (няма hover на touch).
