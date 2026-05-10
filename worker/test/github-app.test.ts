/**
 * Unit tests for github-app.ts
 * Mocks `jose` (PKCS#8 import + JWT sign) and global `fetch`.
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
    importPKCS8: vi.fn(async (pem: string) => {
      if (!pem.includes("PRIVATE KEY")) {
        throw new Error("Invalid PEM");
      }
      if (pem.includes("RSA PRIVATE KEY")) {
        throw new Error("PKCS#1 not supported");
      }
      return { fakeKey: true };
    }),
    SignJWT: FakeSignJWT,
  };
});

import { getInstallationToken, createIssue } from "../src/github-app";

function makeKV() {
  const store = new Map<string, string>();
  return {
    store,
    get: vi.fn(async (k: string) => store.get(k) ?? null),
    put: vi.fn(async (k: string, v: string) => {
      store.set(k, v);
    }),
    delete: vi.fn(async (k: string) => {
      store.delete(k);
    }),
    list: vi.fn(async () => ({ keys: [], list_complete: true })),
  };
}

const PKCS8_PEM = "-----BEGIN PRIVATE KEY-----\nfakebody\n-----END PRIVATE KEY-----";
const PKCS1_PEM = "-----BEGIN RSA PRIVATE KEY-----\nfakebody\n-----END RSA PRIVATE KEY-----";

function makeEnv(overrides: Partial<Record<string, unknown>> = {}) {
  const kv = makeKV();
  return {
    env: {
      GH_APP_ID: "12345",
      GH_APP_PRIVATE_KEY: PKCS8_PEM,
      TOKEN_CACHE: kv as unknown as KVNamespace,
      ...overrides,
    } as unknown as Parameters<typeof getInstallationToken>[0],
    kv,
  };
}

describe("github-app", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getInstallationToken — KV cache behaviour", () => {
    it("returns cached token without calling GitHub when present", async () => {
      const { env, kv } = makeEnv();
      kv.store.set("installation:42", "cached_token_xyz");
      const fetchMock = vi.spyOn(globalThis, "fetch");

      const t = await getInstallationToken(env, "42");

      expect(t).toBe("cached_token_xyz");
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("issues fresh token on cache miss and caches it", async () => {
      const { env, kv } = makeEnv();
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ token: "fresh_token", expires_at: "2099-01-01" }), {
          status: 201,
        }),
      );

      const t = await getInstallationToken(env, "42");

      expect(t).toBe("fresh_token");
      expect(kv.put).toHaveBeenCalledWith(
        "installation:42",
        "fresh_token",
        expect.objectContaining({ expirationTtl: 3000 }),
      );
    });
  });

  describe("PKCS#1 input — clear error message", () => {
    it("throws with openssl pkcs8 conversion hint", async () => {
      const { env } = makeEnv({ GH_APP_PRIVATE_KEY: PKCS1_PEM });
      vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 200 }));

      await expect(getInstallationToken(env, "42")).rejects.toThrow(/openssl pkcs8 -topk8/);
    });
  });

  describe("createIssue", () => {
    it("returns ok with URL on 201 success", async () => {
      const { env, kv } = makeEnv();
      kv.store.set("installation:42", "tok");
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ html_url: "https://github.com/o/r/issues/1" }), {
          status: 201,
        }),
      );

      const r = await createIssue(env, {
        installationId: "42",
        repo: "o/r",
        title: "t",
        body: "b",
      });

      expect(r).toEqual({ ok: true, url: "https://github.com/o/r/issues/1" });
    });

    it("invalidates cache on 401 and returns ok:false", async () => {
      const { env, kv } = makeEnv();
      kv.store.set("installation:42", "stale_tok");
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response("Bad credentials", { status: 401 }),
      );

      const r = await createIssue(env, {
        installationId: "42",
        repo: "o/r",
        title: "t",
        body: "b",
      });

      expect(r).toEqual({ ok: false, status: 401, error: "Bad credentials" });
      expect(kv.delete).toHaveBeenCalledWith("installation:42");
    });

    it("returns structured error on 5xx without invalidating cache", async () => {
      const { env, kv } = makeEnv();
      kv.store.set("installation:42", "tok");
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response("server error", { status: 503 }),
      );

      const r = await createIssue(env, {
        installationId: "42",
        repo: "o/r",
        title: "t",
        body: "b",
      });

      expect(r).toEqual({ ok: false, status: 503, error: "server error" });
      expect(kv.delete).not.toHaveBeenCalled();
    });
  });
});
