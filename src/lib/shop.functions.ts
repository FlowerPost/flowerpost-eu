import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { cartItemSchema, checkoutSchema, trackingSchema } from "./validation";
import { roseBoxPriceCents, shippingCents, type PricingConfig, type DeliveryConfig } from "./pricing";
import { PRICING_DEFAULTS, DELIVERY_DEFAULTS } from "./config";

const createOrderSchema = z.object({
  customer: checkoutSchema,
  items: z.array(cartItemSchema).min(1, "Количката е празна."),
});

/** Публични данни за магазина: продукт, цветове, настройки, блокирани дати. */
export const getShopData = createServerFn({ method: "GET" }).handler(async () => {
  const { supabasePublic } = await import("./supabase-public.server");
  const [productRes, colorsRes, settingsRes, blackoutRes] = await Promise.all([
    supabasePublic
      .from("products")
      .select(
        "id, slug, name, short_description, description, base_price_cents, base_rose_count, rose_step, step_price_cents, min_roses, max_roses, box_inventory, promo_label, is_active",
      )
      .eq("slug", "flowerpost-signature-box")
      .maybeSingle(),
    supabasePublic
      .from("flower_colors")
      .select("code, name_bg, hex, sort_order, stock_roses, is_available")
      .order("sort_order"),
    supabasePublic.from("site_settings").select("key, value").eq("is_public", true),
    supabasePublic.from("delivery_blackout_dates").select("blackout_date"),
  ]);

  const settings = Object.fromEntries(
    (settingsRes.data ?? []).map((row) => [row.key, row.value as Record<string, unknown>]),
  );
  const deliverySetting = (settings["delivery"] ?? {}) as Partial<Record<string, unknown>>;
  const product = productRes.data;

  const pricing: PricingConfig = {
    basePriceCents: product?.base_price_cents ?? PRICING_DEFAULTS.basePriceCents,
    baseRoseCount: product?.base_rose_count ?? PRICING_DEFAULTS.baseRoseCount,
    roseStep: product?.rose_step ?? PRICING_DEFAULTS.roseStep,
    stepPriceCents: product?.step_price_cents ?? PRICING_DEFAULTS.stepPriceCents,
    minRoses: product?.min_roses ?? PRICING_DEFAULTS.minRoses,
    maxRoses: product?.max_roses ?? PRICING_DEFAULTS.maxRoses,
  };

  const delivery: DeliveryConfig = {
    sofiaShippingCents: Number(deliverySetting["sofia_shipping_cents"] ?? DELIVERY_DEFAULTS.sofiaShippingCents),
    countryShippingCents: Number(deliverySetting["country_shipping_cents"] ?? DELIVERY_DEFAULTS.countryShippingCents),
    leadTimeDays: Number(deliverySetting["lead_time_days"] ?? DELIVERY_DEFAULTS.leadTimeDays),
    maxDeliveriesPerDay: Number(deliverySetting["max_deliveries_per_day"] ?? DELIVERY_DEFAULTS.maxDeliveriesPerDay),
    slots: (deliverySetting["slots"] as string[] | undefined) ?? [...DELIVERY_DEFAULTS.slots],
  };

  return {
    product: product
      ? {
          id: product.id,
          slug: product.slug,
          name: product.name,
          shortDescription: product.short_description,
          description: product.description,
          boxInventory: product.box_inventory,
          promoLabel: product.promo_label,
          isActive: product.is_active,
        }
      : null,
    colors: (colorsRes.data ?? []).map((c) => ({
      code: c.code,
      name: c.name_bg,
      hex: c.hex,
      stockRoses: c.stock_roses,
      isAvailable: c.is_available && c.stock_roses > 0,
    })),

    pricing,
    delivery,
    company: (settings["company"] ?? {}) as Record<string, string>,
    payment: {
      revolutLinkConfigured: Boolean(
        (settings["payment"] as Record<string, unknown> | undefined)?.["revolut_link_configured"],
      ),
      note: String(
        (settings["payment"] as Record<string, unknown> | undefined)?.["revolut_note"] ?? "",
      ),
    },

    blackoutDates: (blackoutRes.data ?? []).map((d) => d.blackout_date),
  };
});

/** Създава поръчка със статус „Очаква плащане“. Плащането НЕ се отбелязва автоматично. */
export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: product } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("slug", "flowerpost-signature-box")
      .maybeSingle();

    if (!product || !product.is_active) {
      return { ok: false as const, error: "Продуктът не е наличен в момента." };
    }
    if (product.box_inventory < data.items.length) {
      return { ok: false as const, error: "Пилотната серия е изчерпана за този брой кутии." };
    }

    const { data: settings } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "delivery")
      .maybeSingle();
    const ds = (settings?.value ?? {}) as Record<string, unknown>;
    const deliveryConfig: DeliveryConfig = {
      sofiaShippingCents: Number(ds["sofia_shipping_cents"] ?? DELIVERY_DEFAULTS.sofiaShippingCents),
      countryShippingCents: Number(ds["country_shipping_cents"] ?? DELIVERY_DEFAULTS.countryShippingCents),
      leadTimeDays: Number(ds["lead_time_days"] ?? DELIVERY_DEFAULTS.leadTimeDays),
      maxDeliveriesPerDay: Number(ds["max_deliveries_per_day"] ?? DELIVERY_DEFAULTS.maxDeliveriesPerDay),
      slots: (ds["slots"] as string[] | undefined) ?? [...DELIVERY_DEFAULTS.slots],
    };

    const pricing: PricingConfig = {
      basePriceCents: product.base_price_cents,
      baseRoseCount: product.base_rose_count,
      roseStep: product.rose_step,
      stepPriceCents: product.step_price_cents,
      minRoses: product.min_roses,
      maxRoses: product.max_roses,
    };

    // Цените се преизчисляват на сървъра — клиентските стойности не се доверяват.
    const priced = data.items.map((item) => ({
      ...item,
      unitPriceCents: roseBoxPriceCents(item.roseCount, pricing),
      shippingCents: shippingCents(item.deliveryType, deliveryConfig),
    }));

    const subtotal = priced.reduce((s, i) => s + i.unitPriceCents, 0);
    const shipping = priced.reduce((s, i) => s + i.shippingCents, 0);

    const { data: numberRow, error: numberError } = await supabaseAdmin.rpc("next_order_number");
    if (numberError || !numberRow) {
      return { ok: false as const, error: "Възникна грешка при създаване на номера на поръчката." };
    }
    const orderNumber = numberRow as unknown as string;

    const c = data.customer;
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        status: "awaiting_payment",
        payment_status: "awaiting_payment",
        payment_method: "revolut_link",
        customer_first_name: c.firstName,
        customer_last_name: c.lastName,
        customer_email: c.email.toLowerCase(),
        customer_phone: c.phone,
        billing_address: c.billingAddress,
        invoice_required: c.invoiceRequired,
        company_name: c.companyName || null,
        company_eik: c.companyEik || null,
        company_vat: c.companyVat || null,
        subtotal_cents: subtotal,
        shipping_cents: shipping,
        total_cents: subtotal + shipping,
      })
      .select("id, order_number, access_token, total_cents")
      .single();

    if (orderError || !order) {
      return { ok: false as const, error: "Поръчката не можа да бъде записана. Опитай отново." };
    }

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      priced.map((i) => ({
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        rose_count: i.roseCount,
        color_code: i.colorCode,
        color_name: i.colorName,
        unit_price_cents: i.unitPriceCents,
        shipping_cents: i.shippingCents,
        card_recipient_name: i.cardRecipientName,
        card_message: i.cardMessage,
        card_sender_name: i.hideSender ? null : i.cardSenderName || null,
        hide_sender: i.hideSender,
        occasion: i.occasion || null,
        recipient_name: i.recipientName,
        recipient_phone: i.recipientPhone,
        region: i.region || null,
        city: i.city,
        postal_code: i.postalCode || null,
        street_address: i.streetAddress,
        entrance: i.entrance || null,
        floor: i.floor || null,
        apartment: i.apartment || null,
        delivery_notes: i.deliveryNotes || null,
        delivery_date: i.deliveryDate,
        delivery_slot: i.deliverySlot || null,
        delivery_type: i.deliveryType,
        courier: i.courier || null,
      })),
    );

    if (itemsError) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return { ok: false as const, error: "Поръчката не можа да бъде записана. Опитай отново." };
    }

    await supabaseAdmin.from("payments").insert({
      order_id: order.id,
      provider: "revolut_link",
      status: "awaiting_payment",
      amount_cents: subtotal + shipping,
      reference: orderNumber,
    });
    await supabaseAdmin.from("order_status_history").insert({
      order_id: order.id,
      status: "awaiting_payment",
      note: "Поръчката е създадена от клиента.",
    });

    const revolutLink = process.env["REVOLUT_PAYMENT_LINK"] ?? null;
    const notifyEmail = process.env["ADMIN_NOTIFICATION_EMAIL"] ?? null;
    // Имейл известията се изпращат без съдържанието на личната картичка.
    console.info(
      `[FLOWERPOST] Нова поръчка ${orderNumber} на стойност ${(subtotal + shipping) / 100} EUR.` +
        (notifyEmail ? ` Известие до: ${notifyEmail}` : " (ADMIN_NOTIFICATION_EMAIL не е конфигуриран)"),
    );

    return {
      ok: true as const,
      orderNumber: order.order_number,
      accessToken: order.access_token,
      totalCents: order.total_cents,
      revolutLink,
    };
  });

/** Проследяване на поръчка по номер + имейл или телефон. */
export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => trackingSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const contact = data.contact.trim().toLowerCase();

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("order_number, status, payment_status, total_cents, created_at, customer_email, customer_phone")
      .eq("order_number", data.orderNumber.trim().toUpperCase())
      .maybeSingle();

    if (!order) return { ok: false as const, error: "Не намерихме поръчка с тези данни." };

    const normalize = (v: string) => v.replace(/[^0-9a-z@.]/gi, "").toLowerCase();
    const matches =
      normalize(order.customer_email) === normalize(contact) ||
      normalize(order.customer_phone) === normalize(contact);
    if (!matches) return { ok: false as const, error: "Не намерихме поръчка с тези данни." };

    const { data: orderRow } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("order_number", order.order_number)
      .single();

    const { data: fullItems } = await supabaseAdmin
      .from("order_items")
      .select("rose_count, color_name, city, delivery_date, delivery_slot, delivery_status, courier")
      .eq("order_id", orderRow!.id);


    return {
      ok: true as const,
      order: {
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        totalCents: order.total_cents,
        createdAt: order.created_at,
        // Пълният адрес и текстът на картичката не се показват при проследяване.
        items: (fullItems ?? []).map((i) => ({
          roseCount: i.rose_count,
          colorName: i.color_name,
          city: i.city,
          deliveryDate: i.delivery_date,
          deliverySlot: i.delivery_slot,
          deliveryStatus: i.delivery_status,
          courier: i.courier,
        })),
      },
    };
  });

/** Резюме на поръчката за страницата с потвърждение (по номер + токен). */
export const getOrderSummary = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ orderNumber: z.string().min(4), token: z.string().min(8) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, status, payment_status, payment_method, total_cents, subtotal_cents, shipping_cents, created_at, access_token")
      .eq("order_number", data.orderNumber.toUpperCase())
      .maybeSingle();

    if (!order || order.access_token !== data.token) {
      return { ok: false as const, error: "Поръчката не беше намерена." };
    }

    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("rose_count, color_name, recipient_name, city, delivery_date, delivery_slot, unit_price_cents, shipping_cents")
      .eq("order_id", order.id);

    return {
      ok: true as const,
      order: {
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        paymentMethod: order.payment_method,
        subtotalCents: order.subtotal_cents,
        shippingCents: order.shipping_cents,
        totalCents: order.total_cents,
        createdAt: order.created_at,
        items: (items ?? []).map((i) => ({
          roseCount: i.rose_count,
          colorName: i.color_name,
          recipientName: i.recipient_name,
          city: i.city,
          deliveryDate: i.delivery_date,
          deliverySlot: i.delivery_slot,
          unitPriceCents: i.unit_price_cents,
          shippingCents: i.shipping_cents,
        })),
      },
      revolutLink: process.env["REVOLUT_PAYMENT_LINK"] ?? null,
    };
  });
