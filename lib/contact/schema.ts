import { z } from "zod";
import { PRODUCT_IDS } from "@/lib/contact/products";

export interface ContactFormMessages {
  emailRequired: string;
  emailInvalid: string;
  messageRequired: string;
  messageTooLong: string;
  agreeRequired: string;
  productRequired: string;
}

export function createContactFormSchema(messages: ContactFormMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    message: z
      .string()
      .trim()
      .min(1, messages.messageRequired)
      .max(5000, messages.messageTooLong),
    agree: z.literal(true, {
      error: messages.agreeRequired,
    }),
    product: z.enum(PRODUCT_IDS, { error: messages.productRequired }),
    turnstileToken: z.string().optional(),
    // Honeypot: accept any value at schema layer; the route handler silently drops
    // submissions where this is non-empty so bots can't tell they were caught.
    _hp: z.string().optional(),
  });
}

// Default (Korean) schema — the worker keeps its own copy in worker/src/schema.ts.
export const ContactFormSchema = createContactFormSchema({
  emailRequired: "이메일을 입력해주세요.",
  emailInvalid: "이메일 형식이 올바르지 않아요.",
  messageRequired: "메시지를 입력해주세요.",
  messageTooLong: "메시지가 너무 길어요.",
  agreeRequired: "개인정보 수집·이용에 동의해주세요.",
  productRequired: "문의 종류를 선택해주세요.",
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;
