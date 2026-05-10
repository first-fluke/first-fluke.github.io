/**
 * Unit tests for routes.ts
 * parseProductRoutes and resolveRoute
 */
import { describe, it, expect } from 'vitest';
import { parseProductRoutes, resolveRoute } from '../src/routes';

const validJson = JSON.stringify({
  shopzy: { repo: 'owner/shopzy', installationId: '12345' },
  oma: { repo: 'owner/oma', installationId: '67890' },
});

describe('parseProductRoutes', () => {
  it('returns empty object for empty string', () => {
    expect(parseProductRoutes('')).toEqual({});
  });

  it('returns empty object for "{}"', () => {
    expect(parseProductRoutes('{}')).toEqual({});
  });

  it('parses a valid routes JSON correctly', () => {
    const routes = parseProductRoutes(validJson);
    expect(routes.shopzy).toEqual({ repo: 'owner/shopzy', installationId: '12345' });
    expect(routes.oma).toEqual({ repo: 'owner/oma', installationId: '67890' });
  });

  it('throws on invalid JSON', () => {
    expect(() => parseProductRoutes('not-json')).toThrow(/invalid JSON/);
  });

  it('throws on invalid repo format (missing slash)', () => {
    const bad = JSON.stringify({ shopzy: { repo: 'noslash', installationId: '123' } });
    expect(() => parseProductRoutes(bad)).toThrow(/schema validation failed/);
  });

  it('throws on non-numeric installationId', () => {
    const bad = JSON.stringify({ shopzy: { repo: 'owner/repo', installationId: 'abc' } });
    expect(() => parseProductRoutes(bad)).toThrow(/schema validation failed/);
  });

  it('throws on unknown product key', () => {
    const bad = JSON.stringify({ 'unknown-product': { repo: 'owner/repo', installationId: '123' } });
    expect(() => parseProductRoutes(bad)).toThrow(/schema validation failed/);
  });
});

describe('resolveRoute', () => {
  const routes = parseProductRoutes(validJson);

  it('returns the route for a known product', () => {
    const route = resolveRoute(routes, 'shopzy');
    expect(route).toEqual({ repo: 'owner/shopzy', installationId: '12345' });
  });

  it('returns null for a product not in routes', () => {
    const route = resolveRoute(routes, 'place-haejo');
    expect(route).toBeNull();
  });

  it('returns null for an empty routes map', () => {
    expect(resolveRoute({}, 'shopzy')).toBeNull();
  });
});
