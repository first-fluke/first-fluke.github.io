/**
 * Unit tests for turnstile.ts
 * verifyTurnstile — grace skip + token validation
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyTurnstile } from '../src/turnstile';
import type { Env } from '../src/env';

function makeEnv(overrides?: Partial<Env>): Env {
  return {
    ALLOWED_ORIGINS: 'http://localhost:3000',
    RESEND_FROM: 'ops@test.com',
    OPS_ALERT_TO: 'alert@test.com',
    GH_APP_ID: '12345',
    PRODUCT_ROUTES: '{}',
    GH_APP_PRIVATE_KEY: '',
    RESEND_API_KEY: '',
    TURNSTILE_SECRET_KEY: undefined,
    TOKEN_CACHE: {} as KVNamespace,
    DEAD_LETTER: {} as KVNamespace,
    RATE_LIMIT_BURST: {} as RateLimit,
    RATE_LIMIT_DAILY: {} as RateLimit,
    ...overrides,
  };
}

describe('verifyTurnstile — grace skip', () => {
  it('returns skipped: true when TURNSTILE_SECRET_KEY is absent', async () => {
    const result = await verifyTurnstile(makeEnv(), undefined, '1.2.3.4');
    expect(result.ok).toBe(true);
    expect(result.skipped).toBe(true);
  });
});

describe('verifyTurnstile — with secret key', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns ok: false with missing-input-response when token is absent', async () => {
    const env = makeEnv({ TURNSTILE_SECRET_KEY: 'test-secret' });
    const result = await verifyTurnstile(env, undefined, '1.2.3.4');
    expect(result.ok).toBe(false);
    expect(result.codes).toContain('missing-input-response');
  });

  it('returns ok: true on successful siteverify response', async () => {
    const env = makeEnv({ TURNSTILE_SECRET_KEY: 'test-secret' });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, 'error-codes': [] }),
    } as unknown as Response);

    const result = await verifyTurnstile(env, 'valid-token', '1.2.3.4');
    expect(result.ok).toBe(true);
    expect(result.skipped).toBeUndefined();
  });

  it('returns ok: false on failed siteverify response', async () => {
    const env = makeEnv({ TURNSTILE_SECRET_KEY: 'test-secret' });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
    } as unknown as Response);

    const result = await verifyTurnstile(env, 'bad-token', '1.2.3.4');
    expect(result.ok).toBe(false);
    expect(result.codes).toContain('invalid-input-response');
  });

  it('returns internal-error when fetch throws', async () => {
    const env = makeEnv({ TURNSTILE_SECRET_KEY: 'test-secret' });
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('network failure'));

    const result = await verifyTurnstile(env, 'token', null);
    expect(result.ok).toBe(false);
    expect(result.codes).toContain('internal-error');
  });

  it('does NOT include the secret key in the error log (PII safety)', async () => {
    const env = makeEnv({ TURNSTILE_SECRET_KEY: 'SUPER_SECRET' });
    const consoleSpy = vi.spyOn(console, 'error');
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('network failure'));

    await verifyTurnstile(env, 'token', null);
    // ensure secret not in any console.error call
    const calls = consoleSpy.mock.calls.flat().map(String).join(' ');
    expect(calls).not.toContain('SUPER_SECRET');
  });
});
