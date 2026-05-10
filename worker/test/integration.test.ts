/**
 * Integration tests for the Worker entry (`src/index.ts`).
 * Exercises the full fetch + scheduled pipeline with stub env bindings.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("jose", () => {
  class FakeSignJWT {
    setProtectedHeader() { return this; }
    setIssuedAt() { return this; }
    setExpirationTime() { return this; }
    async sign() { return "fake.jwt.token"; }
  }
  return {
    importPKCS8: vi.fn(async () => ({ fakeKey: true })),
    SignJWT: FakeSignJWT,
  };
});

import worker from "../src/index";

function makeKV() {
  const store = new Map<string, string>();
  return {
    store,
    get: vi.fn(async (k: string) => store.get(k) ?? null),
    put: vi.fn(async (k: string, v: string) => { store.set(k, v); }),
    delete: vi.fn(async (k: string) => { store.delete(k); }),
    list: vi.fn(async ({ prefix }: { prefix: string }) => ({
      keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })),
      list_complete: true,
    })),
  };
}

function makeEnv(overrides: Record<string, unknown> = {}) {
  const TOKEN_CACHE = makeKV();
  const DEAD_LETTER = makeKV();
  return {
    env: {
      ALLOWED_ORIGINS: "https://firstfluke.com,http://localhost:3000",
      RESEND_FROM: "FIRST FLUKE <contact@mail.firstfluke.com>",
      OPS_ALERT_TO: "ops@example.com",
      GH_APP_ID: "12345",
      PRODUCT_ROUTES: JSON.stringify({
        shopzy: { repo: "first-fluke/shopzy", installationId: "111" },
      }),
      GH_APP_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nfake\n-----END PRIVATE KEY-----",
      RESEND_API_KEY: "re_fake",
      TURNSTILE_SECRET_KEY: undefined, // grace skip
      TOKEN_CACHE,
      DEAD_LETTER,
      RATE_LIMIT_BURST: { limit: vi.fn(async () => ({ success: true })) } as unknown as RateLimit,
      RATE_LIMIT_DAILY: { limit: vi.fn(async () => ({ success: true })) } as unknown as RateLimit,
      ...overrides,
    } as unknown as Parameters<typeof worker.fetch>[1],
    TOKEN_CACHE,
    DEAD_LETTER,
  };
}

const validBody = {
  email: "user@example.com",
  message: "Hello",
  agree: true,
  product: "shopzy",
  _hp: "",
};

function makeRequest(body: unknown) {
  return new Request("https://worker.dev/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://firstfluke.com" },
    body: JSON.stringify(body),
  });
}

const mockCtx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext;

describe("Worker integration — fetch handler", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("happy path: POST valid body → 200 + creates GitHub issue", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      if (url.includes("/access_tokens")) {
        return new Response(JSON.stringify({ token: "tok", expires_at: "2099-01-01" }), { status: 201 });
      }
      if (url.includes("/issues")) {
        return new Response(JSON.stringify({ html_url: "https://github.com/x/y/issues/1" }), { status: 201 });
      }
      throw new Error(`unmocked fetch: ${url}`);
    });

    const { env, DEAD_LETTER } = makeEnv();
    const res = await worker.fetch(makeRequest(validBody), env, mockCtx);

    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean };
    expect(json.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/repos/first-fluke/shopzy/issues"),
      expect.any(Object),
    );
    const dlqCalls = DEAD_LETTER.put.mock.calls.filter(([k]) => String(k).startsWith("dlq:"));
    expect(dlqCalls).toHaveLength(0);
  });

  it("GitHub 5xx 3x → DEAD_LETTER push + 200 to user", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      if (url.includes("/access_tokens")) {
        return new Response(JSON.stringify({ token: "tok", expires_at: "2099" }), { status: 201 });
      }
      return new Response("server error", { status: 503 });
    });

    const { env, DEAD_LETTER } = makeEnv();
    const res = await worker.fetch(makeRequest(validBody), env, mockCtx);

    expect(res.status).toBe(200);
    const dlqCalls = DEAD_LETTER.put.mock.calls.filter(([k]) => String(k).startsWith("dlq:"));
    expect(dlqCalls).toHaveLength(1);
  });

  it("honeypot non-empty → 200 silently", async () => {
    vi.spyOn(globalThis, "fetch");
    const { env, DEAD_LETTER } = makeEnv();
    const res = await worker.fetch(
      makeRequest({ ...validBody, _hp: "i-am-a-bot" }),
      env,
      mockCtx,
    );

    expect(res.status).toBe(200);
    const dlqCalls = DEAD_LETTER.put.mock.calls.filter(([k]) => String(k).startsWith("dlq:"));
    expect(dlqCalls).toHaveLength(0);
  });

  it("rate-limit burst exceeded → 429", async () => {
    const { env } = makeEnv({
      RATE_LIMIT_BURST: { limit: vi.fn(async () => ({ success: false })) },
    });
    const res = await worker.fetch(makeRequest(validBody), env, mockCtx);
    expect(res.status).toBe(429);
  });

  it("unknown product (not in PRODUCT_ROUTES) → 422", async () => {
    const { env } = makeEnv();
    const res = await worker.fetch(
      makeRequest({ ...validBody, product: "oma" }),
      env,
      mockCtx,
    );
    expect(res.status).toBe(422);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("unknown_product");
  });

  it("validation fail (empty message) → 400", async () => {
    const { env } = makeEnv();
    const res = await worker.fetch(
      makeRequest({ ...validBody, message: "" }),
      env,
      mockCtx,
    );
    expect(res.status).toBe(400);
  });

  it("OPTIONS preflight → 204 with CORS headers", async () => {
    const { env } = makeEnv();
    const req = new Request("https://worker.dev/", {
      method: "OPTIONS",
      headers: { Origin: "https://firstfluke.com" },
    });
    const res = await worker.fetch(req, env, mockCtx);
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://firstfluke.com");
  });
});

describe("Worker integration — scheduled handler", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("processes a stale dead-letter entry: success → KV.delete", async () => {
    const { env, DEAD_LETTER } = makeEnv();
    DEAD_LETTER.store.set("dlq:abc", JSON.stringify({
      id: "abc",
      payload: validBody,
      route: { repo: "first-fluke/shopzy", installationId: "111" },
      attempts: 3,
      firstFailedAt: new Date().toISOString(),
      lastError: "503",
    }));

    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      if (url.includes("/access_tokens")) {
        return new Response(JSON.stringify({ token: "tok", expires_at: "2099" }), { status: 201 });
      }
      if (url.includes("/issues")) {
        return new Response(JSON.stringify({ html_url: "https://x/y/1" }), { status: 201 });
      }
      throw new Error(`unmocked: ${url}`);
    });

    await worker.scheduled!({} as ScheduledController, env, mockCtx);

    expect(DEAD_LETTER.delete).toHaveBeenCalledWith("dlq:abc");
  });

  it("24h+ stale entry triggers Resend ops-alert exactly once", async () => {
    const { env, DEAD_LETTER } = makeEnv();
    const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    DEAD_LETTER.store.set("dlq:old", JSON.stringify({
      id: "old",
      payload: validBody,
      route: { repo: "first-fluke/shopzy", installationId: "111" },
      attempts: 3,
      firstFailedAt: yesterday,
      lastError: "503",
    }));

    let resendCalls = 0;
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      if (url.includes("api.resend.com")) {
        resendCalls++;
        return new Response("{}", { status: 200 });
      }
      if (url.includes("/access_tokens")) {
        return new Response(JSON.stringify({ token: "tok", expires_at: "2099" }), { status: 201 });
      }
      // Issue creation still failing
      return new Response("server error", { status: 503 });
    });

    await worker.scheduled!({} as ScheduledController, env, mockCtx);

    expect(resendCalls).toBe(1);
    // Entry should be updated with alertedAt, not deleted
    expect(DEAD_LETTER.put).toHaveBeenCalled();
  });
});
