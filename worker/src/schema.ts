import { z } from "zod";

export const ContactFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아니에요."),
  message: z
    .string()
    .trim()
    .min(1, "메시지를 입력해주세요.")
    .max(5000, "메시지가 너무 길어요."),
  agree: z.literal(true, {
    error: "개인정보 수집·이용에 동의해주세요.",
  }),
  turnstileToken: z.string().optional(),
  _hp: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;
