/**
 * Централна конфигурация на FLOWERPOST.
 * Всички константи за бранда, доставката, статусите и навигацията са тук.
 */

export const BRAND = {
  name: "FLOWERPOST",
  domain: "flowerpost.eu",
  tagline: "Someone thinking of you.",
  taglineBg: "Някой мисли за теб.",
  email: "hello@flowerpost.eu",
  phone: "[Телефон]",
  city: "София, България",
} as const;

export const CURRENCY = "EUR";

/** Резервни стойности, ако настройките от базата не са налични. */
export const PRICING_DEFAULTS = {
  basePriceCents: 9900,
  baseRoseCount: 11,
  roseStep: 2,
  stepPriceCents: 1000,
  minRoses: 11,
  maxRoses: 21,
} as const;

export const DELIVERY_DEFAULTS = {
  sofiaShippingCents: 0,
  countryShippingCents: 900,
  leadTimeDays: 1,
  maxDeliveriesPerDay: 15,
  slots: ["10:00 – 13:00", "13:00 – 17:00", "17:00 – 20:00"],
} as const;

export const DELIVERY_TYPES = [
  {
    value: "sofia",
    label: "София – доставка от наш представител",
    note: "Безплатна доставка в София",
  },
  {
    value: "courier",
    label: "Извън София – куриер (Еконт или Спиди)",
    note: "Куриерска такса до 9 €, потвърждава се преди изпращане",
  },
] as const;

export const COURIERS = ["Еконт", "Спиди"] as const;

export const DELIVERY_CONFIRMATION_NOTE =
  "След получаване на поръчката нашият екип ще потвърди наличността и възможния часови интервал за доставка.";

export const CARD_MESSAGE_MAX = 300;

export const ORDER_STATUSES = [
  { value: "awaiting_payment", label: "Очаква плащане" },
  { value: "paid", label: "Платена" },
  { value: "confirmed", label: "Потвърдена" },
  { value: "preparing", label: "Подготвя се" },
  { value: "ready", label: "Готова за доставка" },
  { value: "shipped", label: "Изпратена" },
  { value: "delivered", label: "Доставена" },
  { value: "failed_delivery", label: "Неуспешна доставка" },
  { value: "cancelled", label: "Отказана" },
  { value: "refunded", label: "Възстановена сума" },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]["value"];

export const PAYMENT_STATUSES = [
  { value: "awaiting_payment", label: "Очаква плащане" },
  { value: "paid", label: "Платена" },
  { value: "failed", label: "Плащането е неуспешно" },
] as const;

export function statusLabel(value: string): string {
  return ORDER_STATUSES.find((s) => s.value === value)?.label ?? value;
}

export function paymentStatusLabel(value: string): string {
  return PAYMENT_STATUSES.find((s) => s.value === value)?.label ?? value;
}

export const OCCASIONS = [
  {
    slug: "prosto-taka",
    title: "Просто защото мисля за теб",
    text: "Понякога най-хубавите жестове идват без повод.",
    suggestion: "Няма повод. Просто исках да знаеш, че мисля за теб.",
  },
  {
    slug: "rozhden-den",
    title: "Рожден ден",
    text: "Подарък, който отваря деня по различен начин.",
    suggestion: "Честит рожден ден. Нека тази година ти носи спокойствие и радост.",
  },
  {
    slug: "godishnina",
    title: "Годишнина",
    text: "За годините, които си струват.",
    suggestion: "Още една година заедно. И още много напред.",
  },
  {
    slug: "lyubov",
    title: "Любов",
    text: "Един жест може да каже повече от много думи.",
    suggestion: "Обичам те. Днес и всеки следващ ден.",
  },
  {
    slug: "blagodarnost",
    title: "Благодарност",
    text: "Благодаря, казано с внимание.",
    suggestion: "Благодаря ти. За времето, за подкрепата, за всичко.",
  },
  {
    slug: "korporativen",
    title: "Корпоративен подарък",
    text: "Жест, който екипът запомня.",
    suggestion: "Благодарим ти за отдадеността и за всичко, което правиш за екипа.",
  },
] as const;

export const NAV_LINKS = [
  { to: "/", label: "Начало" },
  { to: "/poruchaj", label: "Поръчай" },
  { to: "/kak-raboti", label: "Как работи" },
  { to: "/povodi", label: "Поводи" },
  { to: "/korporativni-podaraci", label: "Корпоративни подаръци" },
  { to: "/za-nas", label: "За нас" },
  { to: "/vaprosi", label: "FAQ" },
  { to: "/kontakti", label: "Контакти" },
] as const;

export const FOOTER_LEGAL = [
  { to: "/obshti-uslovia", label: "Общи условия" },
  { to: "/poveritelnost", label: "Политика за поверителност" },
  { to: "/biskvitki", label: "Политика за бисквитките" },
  { to: "/dostavka-i-plashtane", label: "Доставка и плащане" },
  { to: "/reklamacii", label: "Рекламации и връщане" },
] as const;

export const BOX_CONTENTS = [
  { title: "Дизайнерска кутия", text: "Продълговата кутия в цвят шампанско с логото FLOWERPOST." },
  { title: "Свежи рози", text: "Минимум 11 рози, подбрани в избрания от теб цвят." },
  { title: "Tissue хартия", text: "Висококачествена хартия, която обгръща розите." },
  { title: "Персонализирана картичка", text: "Твоето послание, изписано на ръка." },
  { title: "Ръчно изписано име", text: "Името на получателя, написано с внимание." },
  { title: "Съвети за грижа", text: "Картичка с указания за по-дълъг живот на цветята." },
  { title: "Защитна опаковка", text: "Транспортна опаковка и водни пипети при куриер." },
] as const;

export const FAQ_ITEMS = [
  {
    q: "Какво съдържа FLOWERPOST Signature Box?",
    a: "Премиум дизайнерска кутия в цвят шампанско със сатенена панделка, минимум 11 пресни рози по избор, tissue хартия, персонализирана картичка с ръчно изписано име на получателя, картичка със съвети за грижа, визитна картичка и защитна транспортна опаковка.",
  },
  {
    q: "Колко рози мога да избера?",
    a: "В пилотната серия можеш да избереш между 11 и 21 рози, на стъпки от по 2.",
  },
  {
    q: "Какви цветове рози предлагате?",
    a: "Червени, бели, розови и кремави. Ако даден цвят е временно изчерпан, той се показва като неактивен в конфигуратора.",
  },
  {
    q: "Мога ли да добавя лично послание?",
    a: "Да. Можеш да напишеш до 300 символа, които изписваме на ръка върху картичката.",
  },
  {
    q: "Ще бъде ли изписано името ми?",
    a: "Само ако пожелаеш. Можеш да скриеш името на изпращача с една отметка в конфигуратора.",
  },
  {
    q: "Мога ли да изпратя подаръка анонимно?",
    a: "Да. Отметни „Не показвай името на изпращача върху картичката“ при създаване на поръчката.",
  },
  {
    q: "Доставяте ли в същия ден?",
    a: "Не обещаваме автоматична доставка в същия ден. След поръчката екипът потвърждава наличността и възможния часови интервал. [Текст за преглед от екипа.]",
  },
  {
    q: "Безплатна ли е доставката в София?",
    a: "Да. За адреси в рамките на град София доставката на пилотния продукт е безплатна и се извършва от представител на FLOWERPOST.",
  },
  {
    q: "Доставяте ли извън София?",
    a: "Да, с Еконт или Спиди. Куриерската такса е до 9 € и се потвърждава преди изпращане.",
  },
  {
    q: "Как се предпазват розите при куриерска доставка?",
    a: "Всяка роза пътува с водна пипета, а кутията е поставена в защитна транспортна опаковка.",
  },
  {
    q: "Какво се случва, ако получателят не е на адреса?",
    a: "Свързваме се с теб и с получателя, за да уговорим нов момент за доставка. [Текст за преглед от екипа.]",
  },
  {
    q: "Как мога да сигнализирам за повреден продукт?",
    a: "Използвай формата за рекламация на страница „Рекламации и връщане“ и приложи снимки възможно най-скоро след получаването.",
  },
  {
    q: "Мога ли да коригирам текста на картичката?",
    a:
      "Да, ако поръчката още не е подготвена. Пиши ни на " +
      BRAND.email +
      " с номера на поръчката.",
  },
  {
    q: "Мога ли да променя поръчката след плащане?",
    a: "Свържи се с нас възможно най-бързо. Промените зависят от етапа на подготовка. [Текст за преглед от екипа.]",
  },
  {
    q: "Предлагате ли фирмени поръчки?",
    a: "Да. Изпрати запитване през страница „Корпоративни подаръци“ и ще се върнем с предложение.",
  },
  {
    q: "Издавате ли фактура?",
    a: "Да. Отбележи в checkout, че желаеш фактура, и попълни фирмените данни.",
  },
] as const;

export const ANALYTICS_EVENTS = [
  "view_product",
  "start_customization",
  "select_rose_count",
  "select_rose_color",
  "complete_card_message",
  "add_to_cart",
  "begin_checkout",
  "submit_order",
  "payment_redirect",
  "payment_confirmed",
  "corporate_form_submit",
  "newsletter_signup",
  "complaint_submit",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];
