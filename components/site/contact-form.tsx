"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ContactFormSchema } from "@/lib/contact/schema";

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"email" | "message" | "agree", string>>;

export function ContactForm() {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [hp, setHp] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [serverError, setServerError] = React.useState<string | null>(null);

  const isSubmitting = status === "submitting";
  const isDisabled = !agree || isSubmitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const parsed = ContactFormSchema.safeParse({
      email,
      message,
      agree,
      _hp: hp,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        message: fieldErrors.message?.[0],
        agree: fieldErrors.agree?.[0],
      });
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
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
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <div className="flex flex-col gap-2">
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
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-message"
          className="text-sm font-medium text-[var(--color-fg)]"
        >
          메시지
        </label>
        <Textarea
          id="contact-message"
          placeholder="필요한 일을 알려주세요."
          rows={6}
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
      </div>

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

      <div className="flex flex-col gap-2">
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
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className="self-start"
      >
        {isSubmitting ? "보내는 중…" : "보내기"}
      </Button>
    </form>
  );
}
