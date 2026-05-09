import { ContactFormSchema, type ContactFormValues } from "./schema";

interface Env {
  GITHUB_ISSUE_TOKEN: string;
  GITHUB_ISSUE_REPO: string;
}

interface GithubIssuePayload {
  title: string;
  body: string;
  labels?: string[];
}

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function buildIssueTitle(message: string, email: string): string {
  const oneLine = message.replace(/\s+/g, " ").trim();
  const snippet = oneLine.slice(0, 60);
  const truncated = oneLine.length > 60 ? `${snippet}…` : snippet;
  return `[Contact] ${truncated || email}`;
}

function buildIssueBody(
  data: Pick<ContactFormValues, "email" | "message">,
): string {
  return [
    `**From:** ${data.email}`,
    `**Received:** ${new Date().toISOString()}`,
    "",
    "---",
    "",
    data.message,
  ].join("\n");
}

async function createGithubIssue(
  env: Env,
  payload: GithubIssuePayload,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_ISSUE_REPO}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_ISSUE_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "firstfluke-contact-worker",
      },
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    const error = await res.text();
    return { ok: false, status: res.status, error };
  }
  return { ok: true };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response(null, { status: 405 });
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: "validation" }, 400);
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
      );
    }

    if (parsed.data._hp && parsed.data._hp.length > 0) {
      return jsonResponse({ ok: true }, 200);
    }

    if (!env.GITHUB_ISSUE_TOKEN || !env.GITHUB_ISSUE_REPO) {
      // TODO(oma-deferred): set GITHUB_ISSUE_TOKEN and GITHUB_ISSUE_REPO via `wrangler secret put`.
      console.info(
        "[contact] GitHub credentials missing. Payload acknowledged:",
        {
          email: parsed.data.email,
          messageLength: parsed.data.message.length,
        },
      );
      return jsonResponse({ ok: true }, 200);
    }

    const result = await createGithubIssue(env, {
      title: buildIssueTitle(parsed.data.message, parsed.data.email),
      body: buildIssueBody(parsed.data),
      labels: ["contact"],
    });

    if (!result.ok) {
      console.error(
        "[contact] github issue create failed:",
        result.status,
        result.error,
      );
      return jsonResponse({ ok: false, error: "send_failed" }, 502);
    }

    return jsonResponse({ ok: true }, 200);
  },
} satisfies ExportedHandler<Env>;
