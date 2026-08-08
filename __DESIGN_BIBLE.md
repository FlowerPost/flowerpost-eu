# FLOWERPOST — DESIGN BIBLE
> Прилага [[__BRAND_BIBLE.md]] визуално. Layout, spacing, компонентни правила.

## 1. Grid & layout
- Asymmetric editorial layout — запазено от Vol.1 инстинкт, но по-изчистено.
  Никога perfectly centered hero. Текст и визуал живеят в различни везни (напр.
  40/60 или 35/65 split), не 50/50.
- Extreme whitespace. Section padding: `py-32 md:py-48` на десктоп. Луксът се чете
  през пространство, не през декорация.
- Max content width: `max-w-7xl`, но текстови блокове ограничени до `max-w-xl`
  за четимост (editorial column width).

## 2. Тон на повърхностите
- `rounded-none` навсякъде по подразбиране — остри ръбове, само кутията/lid имат
  мека сянка за физическа достоверност.
- Borders: `1px`, hairline, gold/bordeaux в 20–40% opacity — никога тежки контури.
- Сенки: почти невидими ambient shadows (`shadow-[0_8px_40px_rgba(43,36,32,0.08)]`),
  никога drop-shadow с твърд ъгъл.

## 3. Типографска скала (Tailwind utility classes за прилагане в `globals.css @layer`)
```
.tf-display   → Playfair, clamp(2.75rem, 6vw, 6rem), font-medium, tracking-tight
.tf-headline  → Playfair, clamp(1.75rem, 3.5vw, 3rem), font-medium
.tf-quote     → Playfair italic, clamp(1.25rem, 2vw, 1.75rem)
.tf-mono      → Space Mono, text-[11px], tracking-[0.2em], uppercase
.tf-body      → system body, text-base md:text-lg, leading-relaxed, text-stone
```

## 4. Бутони и интерактивни елементи
- Primary CTA: bordeaux fill, ivory text, `rounded-none`, mono uppercase label,
  hover = тънка gold underline animation (не color swap блок).
- Secondary CTA: hairline gold border, transparent fill, text гold → fills on hover
  с 400ms ease.
- Линкове в текст: без underline по default, gold underline drawn on hover
  (ляво-надясно wipe, вижте Motion Bible §3).

## 5. Компонентна карта (Vol.2 sections)
1. **HeroSection ("the Fugate")** — работно име на flagship hero композицията: пълен
   viewport, asymmetric split, монограм voluntary watermark вляво горе, product
   headline дясно/долу, subtle parallax визуал (виж 3D Bible за depth layers).
   "The Fugate" = концептуалното име за hero motif: единичен елемент (роза/кутия),
   който "бяга" (fugue) в паралакс докато скролваш — оттук идва името, запазва се
   като вътрешен label за компонента.
2. **StoryScene** — editorial наратив блок, дълъг текст + provenance imagery,
   sticky text column / scrolling imagery column.
3. **ProductScene** — продуктова презентация, кутия с рози, спецификации в mono
   таблица (наследено от Vol.1 "Технически spec" паттерн — работи, запазваме го).
4. **LidReveal** — интерактивен/scroll-driven unboxing момент: капакът на кутията
   се "отваря" при scroll trigger, разкривайки розите отдолу. Ключов marquee
   moment на страницата.
5. **ConfiguratorTeaser** — тийзър за бъдещ box-builder (backend отложен) —
   визуален preview на "избери своя кутия" UI, без функционален state отвъд
   client-side demo.
6. **TrustScene** — provenance / farms / process доверие блок (наследник на
   Vol.1 "Farm to table"), но третиран като editorial fact-strip, не card grid.
7. **Footer** — тъмен espresso фон, минимален, монограм watermark.

## 6. Imagery
- Продуктова фотография: топла естествена светлина, текстил/хартия текстури на
  фон (виж референтните снимки), никога студио бял фон.
- Ако няма реален asset — използвай абстрактни gradient/mesh placeholder в
  brand палитрата, никога generic stock.

## 7. Responsive поведение
- Mobile: asymmetry се свежда до single column, но typographic hierarchy и
  whitespace ритъмът се запазват — не компресирай padding агресивно.
