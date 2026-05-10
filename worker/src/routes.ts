import { z } from "zod";
import { PRODUCT_IDS } from "../../lib/contact/products";
import type { ProductId } from "../../lib/contact/products";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Route {
  repo: string; // "owner/name"
  installationId: string; // GitHub App installation id (numeric string)
}

export type ProductRoutes = Partial<Record<ProductId, Route>>;

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const RouteSchema = z.object({
  repo: z.string().regex(/^[^/\s]+\/[^/\s]+$/, "must be owner/name"),
  installationId: z
    .string()
    .regex(/^\d+$/, "must be numeric string"),
});

// Build a partial-record schema where every PRODUCT_ID key is optional.
// (zod v4's `z.record(z.enum(...), V)` requires all keys; we want partial.)
const ProductRoutesSchema = z.object(
  Object.fromEntries(PRODUCT_IDS.map((id) => [id, RouteSchema.optional()])),
).strict();

// ---------------------------------------------------------------------------
// parseProductRoutes
// ---------------------------------------------------------------------------

/**
 * Parse the PRODUCT_ROUTES env var (JSON string) into a validated ProductRoutes map.
 *
 * - Empty string or "{}" is valid and returns {} (no products mapped yet).
 * - Any JSON parse failure or schema mismatch throws with an actionable message.
 *
 * This function is pure: no I/O, no env access.
 */
export function parseProductRoutes(rawJson: string): ProductRoutes {
  const trimmed = rawJson.trim();

  // Treat empty / explicitly empty-object strings as "nothing configured yet"
  if (trimmed === "" || trimmed === "{}") {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`PRODUCT_ROUTES: invalid JSON — ${msg}`);
  }

  const result = ProductRoutesSchema.safeParse(parsed);
  if (!result.success) {
    // Flatten issues to produce a developer-readable message
    const issues = result.error.issues
      .map((issue: z.core.$ZodIssue) => `  [${issue.path.join(".")}] ${issue.message}`)
      .join("\n");
    throw new Error(
      `PRODUCT_ROUTES: schema validation failed:\n${issues}`,
    );
  }

  return result.data;
}

// ---------------------------------------------------------------------------
// resolveRoute
// ---------------------------------------------------------------------------

/**
 * Resolve a ProductId to its configured Route.
 *
 * Returns null when the product has no entry in the routes map.
 * The caller (T-12 handler) should treat null as a 422 unknown_product response.
 *
 * This function is pure: no I/O, no env access.
 */
export function resolveRoute(
  routes: ProductRoutes,
  productId: ProductId,
): Route | null {
  return routes[productId] ?? null;
}
