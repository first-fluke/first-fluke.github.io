// Product SSOT — no React, no Next.js imports; Worker-safe pure TypeScript
//
// Must stay a subset of the dahaejo platform's `support_products` table: the
// ingest API rejects an unregistered slug with 422 `unknown_product`, and the
// Worker treats that as a permanent error (no retry, no dead-letter), so the
// submission is simply lost. `oma` used to be listed here without a matching
// row — every OMA inquiry failed at submit.

export const PRODUCT_IDS = [
  "place-haejo",
  "contents-haejo",
  "legalize-kr",
  "shopzy",
  "deploy-haejo",
  "medisupporter",
  "fortunebom",
  "etc",
] as const;

export type ProductId = (typeof PRODUCT_IDS)[number];

// Korean display labels — brand names are closed-up (no space), matching
// support_products.label (dahaejo migration 0090) and lib/solutions.ts.
export const PRODUCT_LABELS: Record<ProductId, string> = {
  "place-haejo": "플레이스해줘",
  "contents-haejo": "콘텐츠해줘",
  "legalize-kr": "법률검토해줘",
  shopzy: "Shopzy",
  "deploy-haejo": "배포해줘",
  medisupporter: "메디서포터",
  fortunebom: "운세봄",
  etc: "기타",
};
