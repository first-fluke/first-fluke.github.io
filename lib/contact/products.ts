// Product SSOT — no React, no Next.js imports; Worker-safe pure TypeScript
//
// Must stay a subset of the dahaejo platform's `support_products` table: the
// ingest API rejects an unregistered slug with 422 `unknown_product`, and the
// Worker treats that as a permanent error (no retry, no dead-letter), so the
// submission is simply lost. `oma` used to be listed here without a matching
// row — every OMA inquiry failed at submit.

export const PRODUCT_IDS = [
  "medisupporter",
  "deploy-haejo",
  "legalize-kr",
  "shopzy",
  "fortunebom",
  "contents-haejo",
  "place-haejo",
  "etc",
] as const;

export type ProductId = (typeof PRODUCT_IDS)[number];

// Retain registered transport IDs for existing inquiries; only active products
// appear in the public form. Medi24 still uses the registered medisupporter ID.
export type ActiveProductId = Exclude<ProductId, "deploy-haejo" | "place-haejo">;
export const ACTIVE_PRODUCT_IDS = PRODUCT_IDS.filter(
  (id): id is ActiveProductId => id !== "deploy-haejo" && id !== "place-haejo",
);

// Current Korean brand labels, independent of the API transport IDs.
export const PRODUCT_LABELS: Record<ProductId, string> = {
  medisupporter: "메디24",
  "deploy-haejo": "배포해줘",
  "legalize-kr": "법률검토해줘",
  shopzy: "샵지",
  fortunebom: "운세봄",
  "contents-haejo": "콘텐츠해줘",
  "place-haejo": "플레이스해줘",
  etc: "기타",
};
