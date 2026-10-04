import {
  email,
  enum as enumeration,
  literal,
  maxLength,
  minLength,
  object,
  optional,
  string,
  trim,
  type infer as Infer,
} from "zod/mini";
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
  return object({
    email: string().check(
      trim(),
      minLength(1, messages.emailRequired),
      email(messages.emailInvalid),
    ),
    message: string().check(
      trim(),
      minLength(1, messages.messageRequired),
      maxLength(5000, messages.messageTooLong),
    ),
    agree: literal(true, {
      error: messages.agreeRequired,
    }),
    product: enumeration(PRODUCT_IDS, { error: messages.productRequired }),
    turnstileToken: optional(string()),
    // Honeypot: accept any value at schema layer; the route handler silently drops
    // submissions where this is non-empty so bots can't tell they were caught.
    _hp: optional(string()),
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

export type ContactFormValues = Infer<typeof ContactFormSchema>;
