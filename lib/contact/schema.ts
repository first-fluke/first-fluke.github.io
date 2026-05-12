import { z } from "zod";
import { PRODUCT_IDS } from "@/lib/contact/products";

export const ContactFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요.")
    .email("이메일 형식이 올바르지 않아요."),
  message: z.string().trim().min(1, "메시지를 입력해주세요.").max(5000, "메시지가 너무 길어요."),
  agree: z.literal(true, {
    error: "개인정보 수집·이용에 동의해주세요.",
  }),
  product: z.enum(PRODUCT_IDS, { error: "문의 종류를 선택해주세요." }),
  turnstileToken: z.string().optional(),
  // Honeypot: accept any value at schema layer; the route handler silently drops
  // submissions where this is non-empty so bots can't tell they were caught.
  _hp: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;
