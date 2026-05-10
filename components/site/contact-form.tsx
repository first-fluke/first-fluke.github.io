"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactFormSchema } from "@/lib/contact/schema";
import { PRODUCT_IDS, PRODUCT_LABELS, type ProductId } from "@/lib/contact/products";

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"email" | "message" | "agree" | "product", string>>;

export function ContactForm() {
  const [product, setProduct] = React.useState<ProductId | "">("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [hp, setHp] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [serverError, setServerError] = React.useState<string | null>(null);

  const isSubmitting = status === "submitting";
  const isDisabled = !agree || !product || isSubmitting;
  const reduceMotion = useReducedMotion();
  const isFormValid = React.useMemo(
    () => ContactFormSchema.safeParse({ email, message, agree, product, _hp: hp }).success,
    [email, message, agree, product, hp],
  );
  const shouldPulse = isFormValid && !isSubmitting && !reduceMotion;

  const fieldStagger = {
    hidden: {},
    show: reduceMotion
      ? { transition: { staggerChildren: 0 } }
      : { transition: { staggerChildren: 0.07, delayChildren: 0.02 } },
  };
  const fieldItem = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    show: reduceMotion
      ? { opacity: 1, transition: { duration: 0.3 } }
      : {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
        },
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const parsed = ContactFormSchema.safeParse({
      email,
      message,
      agree,
      product,
      _hp: hp,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        message: fieldErrors.message?.[0],
        agree: fieldErrors.agree?.[0],
        product: fieldErrors.product?.[0],
      });
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const endpoint =
        process.env.NEXT_PUBLIC_CONTACT_API_URL || "/api/contact";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "send_failed");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error && err.message === "rate_limit"
          ? "너무 빠르게 시도하셨어요. 잠시 후 다시 시도해주세요."
          : "전송에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-card)]"
      >
        <p className="text-lg font-semibold text-[var(--color-primary)]">
          문의가 접수되었습니다.
        </p>
        <p className="mt-2 text-[var(--color-fg-muted)]">
          확인 후 회신 드릴게요.
        </p>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
      variants={fieldStagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <motion.div variants={fieldItem} className="flex flex-col gap-2">
        <label
          htmlFor="contact-product"
          className="text-sm font-medium text-[var(--color-fg)]"
        >
          문의 종류
        </label>
        <Select
          value={product}
          onValueChange={(v) => setProduct(v as ProductId)}
        >
          <SelectTrigger
            id="contact-product"
            className="w-full"
            aria-invalid={Boolean(errors.product)}
            aria-describedby={
              errors.product ? "contact-product-error" : undefined
            }
          >
            <SelectValue placeholder="어떤 솔루션 관련인가요?" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_IDS.map((id) => (
              <SelectItem key={id} value={id}>
                {PRODUCT_LABELS[id]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.product && (
          <p
            id="contact-product-error"
            className="text-sm text-red-600"
            role="alert"
          >
            {errors.product}
          </p>
        )}
      </motion.div>

      <motion.div variants={fieldItem} className="flex flex-col gap-2">
        <label
          htmlFor="contact-email"
          className="text-sm font-medium text-[var(--color-fg)]"
        >
          이메일
        </label>
        <Input
          id="contact-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          required
        />
        {errors.email && (
          <p
            id="contact-email-error"
            className="text-sm text-red-600"
            role="alert"
          >
            {errors.email}
          </p>
        )}
      </motion.div>

      <motion.div variants={fieldItem} className="flex flex-col gap-2">
        <label
          htmlFor="contact-message"
          className="text-sm font-medium text-[var(--color-fg)]"
        >
          메시지
        </label>
        <Textarea
          id="contact-message"
          placeholder="문의 내용을 알려주세요."
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          required
        />
        {errors.message && (
          <p
            id="contact-message-error"
            className="text-sm text-red-600"
            role="alert"
          >
            {errors.message}
          </p>
        )}
      </motion.div>

      {/* Honeypot — hidden from users, bots fill it */}
      <input
        type="text"
        name="_hp"
        tabIndex={-1}
        autoComplete="off"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <motion.div variants={fieldItem} className="flex flex-col gap-2">
        <Checkbox
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          aria-invalid={Boolean(errors.agree)}
          label={
            <span className="text-sm text-[var(--color-fg-muted)]">
              개인정보 수집·이용에 동의합니다.{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                상세 보기
              </a>
            </span>
          }
        />
        {errors.agree && (
          <p className="text-sm text-red-600" role="alert">
            {errors.agree}
          </p>
        )}
      </motion.div>

      <motion.div variants={fieldItem} className="self-start">
        <motion.div
          animate={
            shouldPulse
              ? {
                  boxShadow: [
                    "0 0 0 0 rgba(15,84,64,0.0)",
                    "0 0 0 10px rgba(15,84,64,0.18)",
                    "0 0 0 0 rgba(15,84,64,0.0)",
                  ],
                }
              : { boxShadow: "0 0 0 0 rgba(15,84,64,0.0)" }
          }
          transition={
            shouldPulse
              ? { duration: 1.6, repeat: Infinity, ease: "easeOut" }
              : { duration: 0.2 }
          }
          style={{ borderRadius: 9999 }}
        >
          <Button
            type="submit"
            size="lg"
            disabled={isDisabled}
            aria-disabled={isDisabled}
          >
            {isSubmitting ? "보내는 중…" : "보내기"}
          </Button>
        </motion.div>
      </motion.div>
    </motion.form>
  );
}
