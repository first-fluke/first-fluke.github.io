// Product SSOT — no React, no Next.js imports; Worker-safe pure TypeScript

export const PRODUCT_IDS = [
  "place-haejo",
  "contents-haejo",
  "legalize-kr",
  "shopzy",
  "oma",
  "etc",
] as const;

export type ProductId = (typeof PRODUCT_IDS)[number];

// Korean display labels — kept in sync with lib/solutions.ts name fields (4 products) + oma + etc fallback
export const PRODUCT_LABELS: Record<ProductId, string> = {
  "place-haejo": "플레이스 해줘",
  "contents-haejo": "콘텐츠 해줘",
  "legalize-kr": "법률 검토해줘",
  shopzy: "Shopzy",
  oma: "OMA (oh-my-agent)",
  etc: "기타",
};
