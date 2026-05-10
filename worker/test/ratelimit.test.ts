/**
 * Unit tests for ratelimit.ts
 * checkRateLimit — burst + daily tiers
 */
import { describe, it, expect, vi } from 'vitest';
import { checkRateLimit } from '../src/ratelimit';
import type { Env } from '../src/env';

function makeKV() {
  const store = new Map<string, string>();
  return {
    get: vi.fn(async (k: string) => store.get(k) ?? null),
    put: vi.fn(async (k: string, v: string, _opts?: unknown) => { store.set(k, v); }),
    delete: vi.fn(async (k: string) => { store.delete(k); }),
    list: vi.fn(async ({ prefix }: { prefix: string }) => ({
      keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })),
      list_complete: true,
    })),
  };
}

const rateLimitOk = { limit: vi.fn(async () => ({ success: true })) };
const rateLimitDeny = { limit: vi.fn(async () => ({ success: false })) };

function makeEnv(burstResult: typeof rateLimitOk, kv: ReturnType<typeof makeKV>): Env {
  return {
    ALLOWED_ORIGINS: '',
    RESEND_FROM: '',
    OPS_ALERT_TO: '',
    GH_APP_ID: '',
    PRODUCT_ROUTES: '{}',
    GH_APP_PRIVATE_KEY: '',
    RESEND_API_KEY: '',
    TURNSTILE_SECRET_KEY: undefined,
    TOKEN_CACHE: {} as KVNamespace,
    DEAD_LETTER: kv as unknown as KVNamespace,
    RATE_LIMIT_BURST: burstResult as unknown as RateLimit,
    RATE_LIMIT_DAILY: {} as RateLimit,
  };
}

describe('checkRateLimit', () => {
  it('returns ok: true when burst and daily both pass', async () => {
    const kv = makeKV();
    const env = makeEnv(rateLimitOk, kv);
    const result = await checkRateLimit(env, { ip: '1.2.3.4', product: 'shopzy' });
    expect(result.ok).toBe(true);
    expect(kv.put).toHaveBeenCalledOnce();
  });

  it('returns ok: false with reason burst when burst binding denies', async () => {
    const kv = makeKV();
    const env = makeEnv(rateLimitDeny, kv);
    const result = await checkRateLimit(env, { ip: '1.2.3.4', product: 'shopzy' });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('burst');
    // KV should NOT be accessed when burst fails
    expect(kv.get).not.toHaveBeenCalled();
  });

  it('returns ok: false with reason daily when counter reaches 30', async () => {
    const kv = makeKV();
    // Pre-seed daily counter at 30
    const today = new Date().toISOString().slice(0, 10);
    kv.get.mockImplementation(async (k: string) => {
      if (k.includes('rl:daily:')) return '30';
      return null;
    });
    const env = makeEnv(rateLimitOk, kv);
    const result = await checkRateLimit(env, { ip: '1.2.3.4', product: 'shopzy' });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('daily');
    // put should NOT be called when daily limit reached
    expect(kv.put).not.toHaveBeenCalled();
  });

  it('starts counter at 1 for a brand new IP+product combination', async () => {
    const kv = makeKV();
    const env = makeEnv(rateLimitOk, kv);
    await checkRateLimit(env, { ip: '5.6.7.8', product: 'oma' });
    expect(kv.put).toHaveBeenCalledWith(
      expect.stringContaining('rl:daily:5.6.7.8:oma:'),
      '1',
      expect.objectContaining({ expirationTtl: 90000 }),
    );
  });

  it('increments existing counter correctly', async () => {
    const kv = makeKV();
    kv.get.mockResolvedValue('15');
    const env = makeEnv(rateLimitOk, kv);
    await checkRateLimit(env, { ip: '9.9.9.9', product: 'shopzy' });
    expect(kv.put).toHaveBeenCalledWith(
      expect.any(String),
      '16',
      expect.any(Object),
    );
  });
});
