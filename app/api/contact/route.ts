import { NextResponse } from "next/server";
import { ContactFormSchema } from "@/lib/contact/schema";

// TODO(oma-deferred): integrate Resend + Cloudflare Turnstile in backend stage.
// For now, this handler validates payload and acknowledges. Wire real send when
// RESEND_API_KEY is provisioned.

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "validation" },
      { status: 400 },
    );
  }

  const parsed = ContactFormSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Honeypot tripped — silently drop, return ok=true to fool bots.
  if (parsed.data._hp && parsed.data._hp.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Fallback path — log and acknowledge so demo flows work without secrets.
    console.info("[contact] RESEND_API_KEY missing. Payload acknowledged:", {
      email: parsed.data.email,
      messageLength: parsed.data.message.length,
    });
    return NextResponse.json({ ok: true });
  }

  // Real send path — implemented by backend stage.
  return NextResponse.json({ ok: true });
}
