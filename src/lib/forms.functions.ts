import { createServerFn } from "@tanstack/react-start";
import {
  complaintSchema,
  contactSchema,
  corporateSchema,
  newsletterSchema,
  stockNotifySchema,
} from "./validation";

const OK = { ok: true as const };

/** Контактна форма. */
export const submitContact = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_requests").insert({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    });
    if (error)
      return { ok: false as const, error: "Съобщението не беше изпратено. Опитай отново." };
    return OK;
  });

/** Корпоративно запитване. */
export const submitCorporate = createServerFn({ method: "POST" })
  .validator((data: unknown) => corporateSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("corporate_requests").insert({
      name: data.name,
      company: data.company,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      box_count: data.boxCount,
      target_date: data.targetDate || null,
      message: data.message || null,
    });
    if (error)
      return { ok: false as const, error: "Запитването не беше изпратено. Опитай отново." };
    return OK;
  });

/** Абонамент за бюлетин. */
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((data: unknown) => newsletterSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert({ email: data.email.toLowerCase(), consent: true }, { onConflict: "email" });
    if (error) return { ok: false as const, error: "Абонаментът не беше записан. Опитай отново." };
    return OK;
  });

/** Рекламация. */
export const submitComplaint = createServerFn({ method: "POST" })
  .validator((data: unknown) => complaintSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("complaints").insert({
      order_number: data.orderNumber.toUpperCase(),
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      problem_description: data.problemDescription,
      desired_resolution: data.desiredResolution || null,
      photo_urls: data.photoUrls ?? [],
    });
    if (error)
      return { ok: false as const, error: "Рекламацията не беше изпратена. Опитай отново." };
    return OK;
  });

/** Известяване при нова наличност. */
export const notifyWhenAvailable = createServerFn({ method: "POST" })
  .validator((data: unknown) => stockNotifySchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("stock_notifications")
      .upsert({ email: data.email.toLowerCase() }, { onConflict: "email" });
    if (error) return { ok: false as const, error: "Записът не беше запазен. Опитай отново." };
    return OK;
  });
