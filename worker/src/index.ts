import { ContactFormSchema, type ContactFormValues } from "./schema";

interface Env {
  RESEND_API_KEY: string;
  RESEND_FROM: string;
  CONTACT_TO_EMAIL: string;
  ALLOWED_ORIGINS: string;
}

interface ResendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  reply_to?: string;
  text: string;
}

function corsHeaders(origin: string | null, allowList: string[]): HeadersInit {
  const allowed = origin && allowList.includes(origin) ? origin : allowList[0];
  return {
    "Access-Control-Allow-Origin": allowed ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(
  data: unknown,
  status: number,
  cors: HeadersInit,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

function buildEmailSubject(message: string, email: string): string {
  const oneLine = message.replace(/\s+/g, " ").trim();
  const snippet = oneLine.slice(0, 60);
  const truncated = oneLine.length > 60 ? `${snippet}…` : snippet;
  return `[Contact] ${truncated || email}`;
}

function buildEmailText(
  data: Pick<ContactFormValues, "email" | "message">,
): string {
  return [
    `From: ${data.email}`,
    `Received: ${new Date().toISOString()}`,
    "",
    "---",
    "",
    data.message,
  ].join("\n");
}

async function sendResendEmail(
  apiKey: string,
  payload: ResendEmailPayload,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.text();
    return { ok: false, status: res.status, error };
  }
  return { ok: true };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const allowList = (env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const cors = corsHeaders(origin, allowList);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "POST") {
      return new Response(null, { status: 405, headers: cors });
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: "validation" }, 400, cors);
    }

    const parsed = ContactFormSchema.safeParse(payload);
    if (!parsed.success) {
      return jsonResponse(
        {
          ok: false,
          error: "validation",
          fields: parsed.error.flatten().fieldErrors,
        },
        400,
        cors,
      );
    }

    if (parsed.data._hp && parsed.data._hp.length > 0) {
      return jsonResponse({ ok: true }, 200, cors);
    }

    if (!env.RESEND_API_KEY || !env.RESEND_FROM || !env.CONTACT_TO_EMAIL) {
      // TODO(oma-deferred): set RESEND_API_KEY, RESEND_FROM, CONTACT_TO_EMAIL via `wrangler secret put` / `[vars]`.
      console.info("[contact] Resend config missing. Payload acknowledged:", {
        email: parsed.data.email,
        messageLength: parsed.data.message.length,
      });
      return jsonResponse({ ok: true }, 200, cors);
    }

    const result = await sendResendEmail(env.RESEND_API_KEY, {
      from: env.RESEND_FROM,
      to: [env.CONTACT_TO_EMAIL],
      subject: buildEmailSubject(parsed.data.message, parsed.data.email),
      reply_to: parsed.data.email,
      text: buildEmailText(parsed.data),
    });

    if (!result.ok) {
      console.error(
        "[contact] resend send failed:",
        result.status,
        result.error,
      );
      return jsonResponse({ ok: false, error: "send_failed" }, 502, cors);
    }

    return jsonResponse({ ok: true }, 200, cors);
  },
} satisfies ExportedHandler<Env>;
