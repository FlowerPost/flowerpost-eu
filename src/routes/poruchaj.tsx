import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import boxOpen from "@/assets/hero-box-open.jpg";
import { shopDataQuery } from "@/lib/shop-queries";
import {
  earliestDeliveryDate,
  formatDateBg,
  formatPrice,
  roseBoxPriceCents,
  roseCountOptions,
  shippingCents,
} from "@/lib/pricing";
import {
  CARD_MESSAGE_MAX,
  COURIERS,
  DELIVERY_CONFIRMATION_NOTE,
  DELIVERY_TYPES,
  OCCASIONS,
} from "@/lib/config";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/poruchaj")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(shopDataQuery());
  },
  head: () => ({
    meta: [
      { title: "Поръчай своята кутия — FLOWERPOST" },
      {
        name: "description",
        content:
          "Конфигурирай FLOWERPOST Signature Box: брой и цвят на розите, ръчно изписано послание, дата и адрес за доставка.",
      },
      { property: "og:title", content: "Поръчай своята кутия — FLOWERPOST" },
      {
        property: "og:description",
        content: "Конфигурирай кутията си стъпка по стъпка и изпрати подарък, който се помни.",
      },
      { property: "og:url", content: "/poruchaj" },
    ],
    links: [{ rel: "canonical", href: "/poruchaj" }],
  }),
  component: Configurator,
});

const STEPS = ["Кутия", "Послание", "Доставка", "Преглед"] as const;

function Configurator() {
  const { data } = useSuspenseQuery(shopDataQuery());
  const { pricing, delivery, colors, blackoutDates, product } = data;
  const navigate = useNavigate();
  const { addItem } = useCart();

  const options = useMemo(() => roseCountOptions(pricing), [pricing]);
  const availableColors = colors.filter((c) => c.isAvailable);

  const [step, setStep] = useState(0);
  const [roseCount, setRoseCount] = useState(pricing.minRoses);
  const [colorCode, setColorCode] = useState(availableColors[0]?.code ?? "");
  const [occasion, setOccasion] = useState("");
  const [cardRecipientName, setCardRecipientName] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [cardSenderName, setCardSenderName] = useState("");
  const [hideSender, setHideSender] = useState(false);

  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<"sofia" | "courier">("sofia");
  const [courier, setCourier] = useState<string>(COURIERS[0]);
  const [city, setCity] = useState("София");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(earliestDeliveryDate(delivery.leadTimeDays));
  const [deliverySlot, setDeliverySlot] = useState(delivery.slots[0] ?? "");
  const [errors, setErrors] = useState<string[]>([]);

  const minDate = earliestDeliveryDate(delivery.leadTimeDays);
  const soldOut = !product?.isActive || (product?.boxInventory ?? 0) <= 0;
  const unitPrice = roseBoxPriceCents(roseCount, pricing);
  const shipping = shippingCents(deliveryType, delivery);
  const selectedColor = colors.find((c) => c.code === colorCode);

  useEffect(() => {
    track("start_customization");
  }, []);

  useEffect(() => {
    setDeliveryType(city.trim().toLowerCase() === "софия" ? "sofia" : "courier");
  }, [city]);

  function validate(current: number): string[] {
    const e: string[] = [];
    if (current === 0) {
      if (!colorCode) e.push("Избери цвят на розите.");
      const color = colors.find((c) => c.code === colorCode);
      if (color && !color.isAvailable) e.push("Избраният цвят е временно изчерпан.");
    }
    if (current === 1) {
      if (cardRecipientName.trim().length < 1) e.push("Въведи име на получателя за картичката.");
      if (cardMessage.trim().length < 2) e.push("Напиши своето послание.");
      if (cardMessage.length > CARD_MESSAGE_MAX) e.push(`Максимум ${CARD_MESSAGE_MAX} символа.`);
      if (!hideSender && cardSenderName.trim().length < 1)
        e.push("Въведи име на изпращача или избери анонимно изпращане.");
    }
    if (current === 2) {
      if (recipientName.trim().length < 2) e.push("Въведи име на получателя.");
      if (!/^[+0-9 ()-]{6,20}$/.test(recipientPhone.trim())) e.push("Въведи валиден телефон на получателя.");
      if (city.trim().length < 2) e.push("Въведи населено място.");
      if (streetAddress.trim().length < 4) e.push("Въведи адрес за доставка.");
      if (!deliveryDate) e.push("Избери дата за доставка.");
      if (deliveryDate < minDate) e.push(`Най-ранната възможна дата е ${formatDateBg(minDate)}.`);
      if (blackoutDates.includes(deliveryDate)) e.push("За избраната дата не приемаме доставки.");
    }
    return e;
  }

  function next() {
    const e = validate(step);
    setErrors(e);
    if (e.length) return;
    if (step === 0) track("select_rose_count", { roseCount, colorCode });
    if (step === 1) track("complete_card_message");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setErrors([]);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addToCart() {
    const all = [0, 1, 2].flatMap(validate);
    setErrors(all);
    if (all.length) {
      setStep(0);
      return;
    }
    addItem({
      productSlug: product?.slug ?? "flowerpost-signature-box",
      productName: product?.name ?? "FLOWERPOST Signature Box",
      roseCount,
      colorCode,
      colorName: selectedColor?.name ?? "",
      occasion: occasion || null,
      cardRecipientName: cardRecipientName.trim(),
      cardMessage: cardMessage.trim(),
      cardSenderName: hideSender ? "" : cardSenderName.trim(),
      hideSender,
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim(),
      region: region.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      streetAddress: streetAddress.trim(),
      entrance: entrance.trim(),
      floor: floor.trim(),
      apartment: apartment.trim(),
      deliveryNotes: deliveryNotes.trim(),
      deliveryDate,
      deliverySlot,
      deliveryType,
      courier: deliveryType === "courier" ? courier : "",
      unitPriceCents: unitPrice,
      shippingCents: shipping,
    });
    track("add_to_cart", { roseCount, colorCode, unitPrice });
    toast.success("Кутията е добавена в количката.");
    navigate({ to: "/kolichka" });
  }

  if (soldOut) {
    return (
      <div className="container-fp section-fp max-w-xl text-center">
        <p className="eyebrow">Пилотна серия</p>
        <h1 className="display-lg mt-4">Серията е изчерпана</h1>
        <hr className="gold-rule mx-auto mt-6" />
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Пуснахме ограничен брой кутии и в момента всички са резервирани. Остави имейла си на
          страница „Контакти“ и ще те известим при следващата серия.
        </p>
      </div>
    );
  }

  return (
    <div className="container-fp py-10 md:py-16">
      <p className="eyebrow">Конфигуратор</p>
      <h1 className="display-lg mt-3">Създай своята кутия</h1>

      {/* Стъпки */}
      <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-border pb-4">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2 text-sm">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.6875rem] ${
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                    ? "bg-champagne-deep text-ink"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-3 w-3" strokeWidth={2.5} /> : i + 1}
            </span>
            <span className={i === step ? "text-foreground" : "text-muted-foreground"}>{label}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {errors.length > 0 && (
            <ul className="mb-6 border-l-2 border-destructive bg-destructive/5 p-4 text-sm text-destructive">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}

          {step === 0 && (
            <div className="space-y-8">
              <div>
                <h2 className="display-md">Брой рози</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Базовата кутия е с {pricing.baseRoseCount} рози. Всеки следващи {pricing.roseStep}{" "}
                  добавят {formatPrice(pricing.stepPriceCents)}.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {options.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRoseCount(n)}
                      aria-pressed={roseCount === n}
                      className={`border px-3 py-4 text-center transition-colors ${
                        roseCount === n
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:bg-accent"
                      }`}
                    >
                      <span className="block font-display text-2xl">{n}</span>
                      <span className="mt-1 block text-[0.6875rem] opacity-70">
                        {formatPrice(roseBoxPriceCents(n, pricing))}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="display-md">Цвят на розите</h2>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {colors.map((c) => {
                    const enough = c.isAvailable && c.stockRoses >= roseCount;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        disabled={!enough}
                        onClick={() => {
                          setColorCode(c.code);
                          track("select_rose_color", { colorCode: c.code });
                        }}
                        aria-pressed={colorCode === c.code}
                        className={`flex items-center gap-3 border px-4 py-3 text-left transition-colors ${
                          colorCode === c.code ? "border-primary" : "border-input"
                        } ${enough ? "hover:bg-accent" : "cursor-not-allowed opacity-45"}`}
                      >
                        <span
                          className="h-6 w-6 shrink-0 rounded-full border border-border"
                          style={{ backgroundColor: c.hex }}
                          aria-hidden
                        />
                        <span className="text-sm">
                          {c.name}
                          {!enough && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              временно изчерпан
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="display-md">Повод (по желание)</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o.slug}
                      type="button"
                      onClick={() => {
                        const nextValue = occasion === o.title ? "" : o.title;
                        setOccasion(nextValue);
                        if (nextValue && !cardMessage.trim()) setCardMessage(o.suggestion);
                      }}
                      className={`border px-4 py-2 text-sm transition-colors ${
                        occasion === o.title ? "border-primary bg-accent" : "border-input hover:bg-accent"
                      }`}
                    >
                      {o.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="display-md">Картичката</h2>
              <div>
                <Label htmlFor="cardRecipient">Име на получателя върху картичката</Label>
                <Input
                  id="cardRecipient"
                  value={cardRecipientName}
                  onChange={(e) => setCardRecipientName(e.target.value)}
                  maxLength={80}
                  placeholder="Мария"
                  className="mt-2 rounded-none"
                />
              </div>
              <div>
                <Label htmlFor="cardMessage">Твоето послание</Label>
                <Textarea
                  id="cardMessage"
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value.slice(0, CARD_MESSAGE_MAX))}
                  rows={5}
                  placeholder="Няма повод. Просто исках да знаеш, че мисля за теб."
                  className="mt-2 rounded-none"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {cardMessage.length} / {CARD_MESSAGE_MAX}
                </p>
              </div>
              <div>
                <Label htmlFor="cardSender">Име на изпращача</Label>
                <Input
                  id="cardSender"
                  value={cardSenderName}
                  onChange={(e) => setCardSenderName(e.target.value)}
                  disabled={hideSender}
                  maxLength={80}
                  placeholder="Иван"
                  className="mt-2 rounded-none"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                <Checkbox checked={hideSender} onCheckedChange={(v) => setHideSender(v === true)} />
                <span>Не показвай името на изпращача върху картичката</span>
              </label>

              <div className="surface-card bg-ivory p-6">
                <p className="eyebrow">Преглед на картичката</p>
                <div className="mt-4 font-display text-lg leading-relaxed text-ink">
                  <p>{cardRecipientName.trim() || "Име на получателя"},</p>
                  <p className="mt-3 whitespace-pre-wrap italic">
                    {cardMessage.trim() || "Твоето послание ще се появи тук."}
                  </p>
                  {!hideSender && cardSenderName.trim() && (
                    <p className="mt-3 text-right">{cardSenderName.trim()}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="display-md">Доставка</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="recipientName">Име на получателя</Label>
                  <Input
                    id="recipientName"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="mt-2 rounded-none"
                  />
                </div>
                <div>
                  <Label htmlFor="recipientPhone">Телефон на получателя</Label>
                  <Input
                    id="recipientPhone"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="+359 88 000 0000"
                    className="mt-2 rounded-none"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Населено място</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-2 rounded-none"
                  />
                </div>
                <div>
                  <Label htmlFor="region">Област (по желание)</Label>
                  <Input
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="mt-2 rounded-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="street">Адрес (улица и номер)</Label>
                  <Input
                    id="street"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="mt-2 rounded-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                  <Input
                    value={entrance}
                    onChange={(e) => setEntrance(e.target.value)}
                    placeholder="Вход"
                    aria-label="Вход"
                    className="rounded-none"
                  />
                  <Input
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="Етаж"
                    aria-label="Етаж"
                    className="rounded-none"
                  />
                  <Input
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Апартамент"
                    aria-label="Апартамент"
                    className="rounded-none"
                  />
                </div>
                <div>
                  <Label htmlFor="postal">Пощенски код (по желание)</Label>
                  <Input
                    id="postal"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="mt-2 rounded-none"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryDate">Дата за доставка</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    min={minDate}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="mt-2 rounded-none"
                  />
                </div>
              </div>

              <div>
                <Label>Часови интервал (предпочитание)</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {delivery.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setDeliverySlot(slot)}
                      className={`border px-4 py-2 text-sm transition-colors ${
                        deliverySlot === slot ? "border-primary bg-accent" : "border-input hover:bg-accent"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-border bg-secondary/40 p-5">
                <p className="text-sm font-medium text-foreground">
                  {DELIVERY_TYPES.find((t) => t.value === deliveryType)?.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {DELIVERY_TYPES.find((t) => t.value === deliveryType)?.note} · Такса:{" "}
                  {shipping === 0 ? "безплатно" : formatPrice(shipping)}
                </p>
                {deliveryType === "courier" && (
                  <div className="mt-4 flex gap-2">
                    {COURIERS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCourier(c)}
                        className={`border px-4 py-2 text-sm transition-colors ${
                          courier === c ? "border-primary bg-background" : "border-input"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {DELIVERY_CONFIRMATION_NOTE}
                </p>
              </div>

              <div>
                <Label htmlFor="notes">Бележка за доставката (по желание)</Label>
                <Textarea
                  id="notes"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value.slice(0, 500))}
                  rows={3}
                  placeholder="Например: не звънете на получателя предварително — това е изненада."
                  className="mt-2 rounded-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="display-md">Преглед</h2>
              <dl className="divide-y divide-border border-y border-border text-sm">
                {[
                  ["Продукт", product?.name ?? "FLOWERPOST Signature Box"],
                  ["Рози", `${roseCount} бр. · ${selectedColor?.name ?? "—"}`],
                  ["Повод", occasion || "—"],
                  ["Картичка за", cardRecipientName || "—"],
                  ["Послание", cardMessage || "—"],
                  ["Изпращач", hideSender ? "Анонимно" : cardSenderName || "—"],
                  ["Получател", `${recipientName} · ${recipientPhone}`],
                  [
                    "Адрес",
                    [streetAddress, entrance && `вх. ${entrance}`, floor && `ет. ${floor}`, apartment && `ап. ${apartment}`, city, region, postalCode]
                      .filter(Boolean)
                      .join(", "),
                  ],
                  ["Дата", `${formatDateBg(deliveryDate)} · ${deliverySlot || "без предпочитание"}`],
                  [
                    "Доставка",
                    deliveryType === "sofia" ? "София — наш представител" : `Куриер ${courier}`,
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-4 py-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="col-span-2 whitespace-pre-wrap text-foreground">{v || "—"}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Провери внимателно текста на картичката — изписваме го точно както е въведен.
              </p>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              disabled={step === 0}
              className="rounded-none"
            >
              <ArrowLeft className="mr-1 h-4 w-4" strokeWidth={1.5} />
              Назад
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" size="lg" onClick={next} className="rounded-none px-8">
                Продължи
                <ArrowRight className="ml-1 h-4 w-4" strokeWidth={1.5} />
              </Button>
            ) : (
              <Button type="button" size="lg" onClick={addToCart} className="rounded-none px-8">
                Добави в количката
              </Button>
            )}
          </div>
        </div>

        {/* Обобщение */}
        <aside className="lg:col-span-5">
          <div className="surface-card sticky top-24 overflow-hidden">
            <img
              src={boxOpen}
              alt="FLOWERPOST Signature Box"
              width={1600}
              height={1104}
              loading="lazy"
              className="h-40 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="font-display text-xl">{product?.name ?? "FLOWERPOST Signature Box"}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {product?.shortDescription ?? "Продълговата кутия с рози и ръчно изписана картичка."}
              </p>
              <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Кутия ({roseCount} рози)</dt>
                  <dd>{formatPrice(unitPrice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Доставка</dt>
                  <dd>{shipping === 0 ? "Безплатна" : formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt>Общо</dt>
                  <dd className="font-medium">{formatPrice(unitPrice + shipping)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">
                Останали кутии от пилотната серия: {product?.boxInventory ?? 0}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
