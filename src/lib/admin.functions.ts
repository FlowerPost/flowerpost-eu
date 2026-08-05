import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.rpc("is_admin", { _user_id: userId });
  if (!data) throw new Error("Нямаш достъп до административния панел.");
  return supabaseAdmin;
}

export const getAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.rpc("is_admin", { _user_id: context.userId });
    return { isAdmin: Boolean(data) };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await assertAdmin(context.userId);
    const today = new Date();
    const todayISO = today.toISOString().slice(0, 10);
    const in7 = new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10);

    const [orders, items, product, colors] = await Promise.all([
      db.from("orders").select("id, status, payment_status, total_cents, created_at"),
      db.from("order_items").select("rose_count, color_name, delivery_date, delivery_status"),
      db
        .from("products")
        .select("box_inventory")
        .eq("slug", "flowerpost-signature-box")
        .maybeSingle(),
      db.from("flower_colors").select("name_bg, stock_roses, is_available").order("sort_order"),
    ]);

    const allOrders = orders.data ?? [];
    const allItems = items.data ?? [];

    const countBy = <T extends string | number>(values: T[]) => {
      const map = new Map<T, number>();
      values.forEach((v) => map.set(v, (map.get(v) ?? 0) + 1));
      return [...map.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    };

    return {
      ordersToday: allOrders.filter((o) => o.created_at.slice(0, 10) === todayISO).length,
      deliveriesNext7: allItems.filter((i) => i.delivery_date >= todayISO && i.delivery_date <= in7)
        .length,
      unpaid: allOrders.filter((o) => o.payment_status === "awaiting_payment").length,
      toPrepare: allOrders.filter((o) => ["paid", "confirmed"].includes(o.status)).length,
      toDeliver: allOrders.filter((o) => ["preparing", "ready", "shipped"].includes(o.status))
        .length,
      boxInventory: product.data?.box_inventory ?? 0,
      colors: (colors.data ?? []).map((c) => ({
        name: c.name_bg,
        stock: c.stock_roses,
        available: c.is_available,
      })),
      revenueCents: allOrders
        .filter((o) => o.payment_status === "paid")
        .reduce((s, o) => s + o.total_cents, 0),
      topColor: countBy(allItems.map((i) => i.color_name)),
      topRoseCount: countBy(allItems.map((i) => i.rose_count)),
    };
  });

export const listOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        search: z.string().optional().default(""),
        status: z.string().optional().default(""),
        from: z.string().optional().default(""),
        to: z.string().optional().default(""),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    const db = await assertAdmin(context.userId);
    let query = db
      .from("orders")
      .select(
        "id, order_number, status, payment_status, customer_first_name, customer_last_name, customer_email, customer_phone, total_cents, created_at, internal_note",
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (data.status) query = query.eq("status", data.status);
    if (data.from) query = query.gte("created_at", `${data.from}T00:00:00Z`);
    if (data.to) query = query.lte("created_at", `${data.to}T23:59:59Z`);
    if (data.search) {
      const s = data.search.trim();
      query = query.or(
        `order_number.ilike.%${s}%,customer_email.ilike.%${s}%,customer_phone.ilike.%${s}%,customer_first_name.ilike.%${s}%,customer_last_name.ilike.%${s}%`,
      );
    }

    const { data: rows } = await query;
    return { orders: rows ?? [] };
  });

export const getOrderDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ orderId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const db = await assertAdmin(context.userId);
    const [order, items, history, payments] = await Promise.all([
      db.from("orders").select("*").eq("id", data.orderId).single(),
      db.from("order_items").select("*").eq("order_id", data.orderId),
      db
        .from("order_status_history")
        .select("*")
        .eq("order_id", data.orderId)
        .order("created_at", { ascending: false }),
      db.from("payments").select("*").eq("order_id", data.orderId),
    ]);
    return {
      order: order.data,
      items: items.data ?? [],
      history: history.data ?? [],
      payments: payments.data ?? [],
    };
  });

export const updateOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        status: z.string().optional(),
        paymentStatus: z.string().optional(),
        internalNote: z.string().optional(),
        note: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const db = await assertAdmin(context.userId);
    const patch: {
      status?: string;
      payment_status?: string;
      internal_note?: string;
    } = {};
    if (data.status) patch.status = data.status;
    if (data.paymentStatus) patch.payment_status = data.paymentStatus;
    if (data.internalNote !== undefined) patch.internal_note = data.internalNote;

    if (Object.keys(patch).length > 0) {
      await db.from("orders").update(patch).eq("id", data.orderId);
    }

    if (data.status) {
      await db.from("order_status_history").insert({
        order_id: data.orderId,
        status: data.status,
        note: data.note ?? null,
        changed_by: context.userId,
      });

      // Наличността се намалява само при потвърждаване на поръчката.
      if (data.status === "confirmed") {
        const { data: items } = await db
          .from("order_items")
          .select("id")
          .eq("order_id", data.orderId);
        const { data: product } = await db
          .from("products")
          .select("id, box_inventory")
          .eq("slug", "flowerpost-signature-box")
          .maybeSingle();
        if (product) {
          const next = Math.max(0, product.box_inventory - (items?.length ?? 0));
          await db.from("products").update({ box_inventory: next }).eq("id", product.id);
        }
      }
    }

    if (data.paymentStatus) {
      await db
        .from("payments")
        .update({
          status: data.paymentStatus,
          confirmed_by: context.userId,
          confirmed_at: data.paymentStatus === "paid" ? new Date().toISOString() : null,
        })
        .eq("order_id", data.orderId);
    }

    return { ok: true as const };
  });

export const updateOrderItemDelivery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        itemId: z.string().uuid(),
        courier: z.string().optional(),
        trackingNumber: z.string().optional(),
        deliveryStatus: z.string().optional(),
        shippingCents: z.number().int().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const db = await assertAdmin(context.userId);
    const patch: {
      courier?: string;
      tracking_number?: string;
      delivery_status?: string;
      shipping_cents?: number;
    } = {};
    if (data.courier !== undefined) patch.courier = data.courier;
    if (data.trackingNumber !== undefined) patch.tracking_number = data.trackingNumber;
    if (data.deliveryStatus !== undefined) patch.delivery_status = data.deliveryStatus;
    if (data.shippingCents !== undefined) patch.shipping_cents = data.shippingCents;

    await db.from("order_items").update(patch).eq("id", data.itemId);
    return { ok: true as const };
  });

export const getProductAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await assertAdmin(context.userId);
    const [product, colors, blackouts] = await Promise.all([
      db.from("products").select("*").eq("slug", "flowerpost-signature-box").single(),
      db.from("flower_colors").select("*").order("sort_order"),
      db.from("delivery_blackout_dates").select("*").order("blackout_date"),
    ]);
    return { product: product.data, colors: colors.data ?? [], blackouts: blackouts.data ?? [] };
  });

export const updateProductAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        base_price_cents: z.number().int().min(0),
        step_price_cents: z.number().int().min(0),
        min_roses: z.number().int().min(1),
        max_roses: z.number().int().min(1),
        box_inventory: z.number().int().min(0),
        is_active: z.boolean(),
        promo_label: z.string().optional().default(""),
        short_description: z.string().optional().default(""),
        description: z.string().optional().default(""),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const db = await assertAdmin(context.userId);
    const { id, ...patch } = data;
    await db.from("products").update(patch).eq("id", id);
    return { ok: true as const };
  });

export const updateColorAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        stock_roses: z.number().int().min(0),
        is_available: z.boolean(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const db = await assertAdmin(context.userId);
    const { id, ...patch } = data;
    await db.from("flower_colors").update(patch).eq("id", id);
    return { ok: true as const };
  });

export const getDeliveryCalendar = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await assertAdmin(context.userId);
    const { data } = await db
      .from("order_items")
      .select(
        "id, delivery_date, delivery_slot, recipient_name, recipient_phone, city, region, delivery_status, delivery_type, courier, tracking_number, delivery_notes, order_id",
      )
      .order("delivery_date");
    return { deliveries: data ?? [] };
  });

export const getRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await assertAdmin(context.userId);
    const [contact, corporate, newsletter, complaints, stock] = await Promise.all([
      db.from("contact_requests").select("*").order("created_at", { ascending: false }).limit(100),
      db
        .from("corporate_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      db
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      db.from("complaints").select("*").order("created_at", { ascending: false }).limit(100),
      db
        .from("stock_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    return {
      contact: contact.data ?? [],
      corporate: corporate.data ?? [],
      newsletter: newsletter.data ?? [],
      complaints: complaints.data ?? [],
      stock: stock.data ?? [],
    };
  });
