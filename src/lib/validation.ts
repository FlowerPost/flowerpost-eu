import { z } from "zod";
import { CARD_MESSAGE_MAX } from "./config";

const phoneRegex = /^[+0-9 ()-]{6,20}$/;

export const cartItemSchema = z.object({
  id: z.string(),
  productSlug: z.string(),
  productName: z.string(),
  roseCount: z.number().int(),
  colorCode: z.string().min(1, "Избери цвят на розите."),
  colorName: z.string(),
  occasion: z.string().optional().nullable(),
  cardRecipientName: z.string().trim().min(1, "Въведи име на получателя.").max(80),
  cardMessage: z.string().trim().max(CARD_MESSAGE_MAX, `Максимум ${CARD_MESSAGE_MAX} символа.`),
  cardSenderName: z.string().trim().max(80).optional().default(""),
  hideSender: z.boolean().default(false),
  recipientName: z.string().trim().min(2, "Въведи име на получателя."),
  recipientPhone: z.string().trim().regex(phoneRegex, "Въведи валиден телефон."),
  region: z.string().trim().optional().default(""),
  city: z.string().trim().min(2, "Въведи населено място."),
  postalCode: z.string().trim().optional().default(""),
  streetAddress: z.string().trim().min(4, "Въведи адрес."),
  entrance: z.string().trim().optional().default(""),
  floor: z.string().trim().optional().default(""),
  apartment: z.string().trim().optional().default(""),
  deliveryNotes: z.string().trim().max(500).optional().default(""),
  deliveryDate: z.string().min(10, "Избери дата за доставка."),
  deliverySlot: z.string().trim().optional().default(""),
  deliveryType: z.enum(["sofia", "courier"]),
  courier: z.string().trim().optional().default(""),
  unitPriceCents: z.number().int(),
  shippingCents: z.number().int(),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;

export const checkoutSchema = z.object({
  firstName: z.string().trim().min(2, "Въведи име."),
  lastName: z.string().trim().min(2, "Въведи фамилия."),
  email: z.string().trim().email("Въведи валиден имейл."),
  phone: z.string().trim().regex(phoneRegex, "Въведи валиден телефон."),
  billingAddress: z.string().trim().min(4, "Въведи адрес за фактура."),
  invoiceRequired: z.boolean().default(false),
  companyName: z.string().trim().optional().default(""),
  companyEik: z.string().trim().optional().default(""),
  companyVat: z.string().trim().optional().default(""),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Необходимо е да приемеш Общите условия." }),
  }),
  confirmedMessage: z.literal(true, {
    errorMap: () => ({ message: "Потвърди, че си проверил текста на картичката." }),
  }),
  acceptDeliveryPolicy: z.literal(true, {
    errorMap: () => ({
      message: "Потвърди, че си запознат с политиката за доставка и рекламации.",
    }),
  }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Въведи име."),
  email: z.string().trim().email("Въведи валиден имейл."),
  phone: z.string().trim().optional().default(""),
  subject: z.string().trim().optional().default(""),
  message: z.string().trim().min(10, "Напиши поне няколко изречения."),
});

export const corporateSchema = z.object({
  name: z.string().trim().min(2, "Въведи име."),
  company: z.string().trim().min(2, "Въведи име на компанията."),
  email: z.string().trim().email("Въведи валиден служебен имейл."),
  phone: z.string().trim().optional().default(""),
  boxCount: z.coerce.number().int().min(1, "Въведи приблизителен брой кутии.").max(10000),
  targetDate: z.string().trim().optional().default(""),
  message: z.string().trim().optional().default(""),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Въведи валиден имейл."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Необходимо е съгласие за получаване на имейли." }),
  }),
});

export const complaintSchema = z.object({
  orderNumber: z.string().trim().min(4, "Въведи номер на поръчка."),
  email: z.string().trim().email("Въведи валиден имейл."),
  phone: z.string().trim().optional().default(""),
  problemDescription: z.string().trim().min(10, "Опиши проблема."),
  desiredResolution: z.string().trim().optional().default(""),
  photoUrls: z.array(z.string()).optional().default([]),
});

export const trackingSchema = z.object({
  orderNumber: z.string().trim().min(4, "Въведи номер на поръчка."),
  contact: z.string().trim().min(4, "Въведи имейла или телефона от поръчката."),
});

export const stockNotifySchema = z.object({
  email: z.string().trim().email("Въведи валиден имейл."),
});
