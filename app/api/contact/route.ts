import { NextResponse } from "next/server";
import { ContactFormSchema, type ContactFormValues } from "@/lib/contact/schema";

interface GithubIssuePayload {
  title: string;
  body: string;
  labels?: string[];
}

function buildIssueTitle(message: string, email: string): string {
  const oneLine = message.replace(/\s+/g, " ").trim();
  const snippet = oneLine.slice(0, 60);
  const truncated = oneLine.length > 60 ? `${snippet}…` : snippet;
  return `[Contact] ${truncated || email}`;
}

function buildIssueBody(data: Pick<ContactFormValues, "email" | "message">): string {
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
  repo: string,
  token: string,
  payload: GithubIssuePayload,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "firstfluke-contact-form",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.text();
    return { ok: false, status: res.status, error };
  }
  return { ok: true };
}

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

  if (parsed.data._hp && parsed.data._hp.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const token = process.env.GITHUB_ISSUE_TOKEN;
  const repo = process.env.GITHUB_ISSUE_REPO;

  if (!token || !repo) {
    // TODO(oma-deferred): integrate GitHub Issues when GITHUB_ISSUE_TOKEN/GITHUB_ISSUE_REPO is provisioned.
    console.info("[contact] GitHub credentials missing. Payload acknowledged:", {
      email: parsed.data.email,
      messageLength: parsed.data.message.length,
    });
    return NextResponse.json({ ok: true });
  }

  const result = await createGithubIssue(repo, token, {
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
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
