/**
 * Unit tests for schema.ts
 * ContactFormSchema validation cases
 */
import { describe, it, expect } from 'vitest';
import { ContactFormSchema } from '../src/schema';

describe('ContactFormSchema', () => {
  const valid = {
    email: 'test@example.com',
    message: 'Hello, I have a question.',
    agree: true as const,
    product: 'shopzy' as const,
    turnstileToken: 'token123',
    _hp: '',
  };

  it('accepts a fully valid payload', () => {
    const result = ContactFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects missing email', () => {
    const result = ContactFormSchema.safeParse({ ...valid, email: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email format', () => {
    const result = ContactFormSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects empty message', () => {
    const result = ContactFormSchema.safeParse({ ...valid, message: '' });
    expect(result.success).toBe(false);
  });

  it('rejects message exceeding 5000 chars', () => {
    const result = ContactFormSchema.safeParse({ ...valid, message: 'a'.repeat(5001) });
    expect(result.success).toBe(false);
  });

  it('rejects agree = false', () => {
    const result = ContactFormSchema.safeParse({ ...valid, agree: false });
    expect(result.success).toBe(false);
  });

  it('rejects unknown product', () => {
    const result = ContactFormSchema.safeParse({ ...valid, product: 'unknown-product' });
    expect(result.success).toBe(false);
  });

  it('accepts all valid product IDs', () => {
    const products = ['place-haejo', 'contents-haejo', 'legalize-kr', 'shopzy', 'oma', 'etc'];
    for (const product of products) {
      const result = ContactFormSchema.safeParse({ ...valid, product });
      expect(result.success, `product '${product}' should be valid`).toBe(true);
    }
  });

  it('allows optional turnstileToken to be absent', () => {
    const { turnstileToken: _, ...rest } = valid;
    const result = ContactFormSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it('trims whitespace from email', () => {
    const result = ContactFormSchema.safeParse({ ...valid, email: '  test@example.com  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });
});
