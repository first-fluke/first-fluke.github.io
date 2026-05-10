// Product SSOT — no React, no Next.js imports; Worker-safe pure TypeScript

export const PRODUCT_IDS = [
  "place-haejo",
  "contents-haejo",
  "shopzy",
  "curate-ai",
  "prompt-ops",
  "legalize-kr",
  "oma",
] as const;

export type ProductId = (typeof PRODUCT_IDS)[number];

// Korean display labels — kept in sync with lib/solutions.ts name fields (6 products) + oma
export const PRODUCT_LABELS: Record<ProductId, string> = {
  "place-haejo": "플레이스 해줘",
  "contents-haejo": "콘텐츠 해줘",
  shopzy: "Shopzy",
  "curate-ai": "CurateAI",
  "prompt-ops": "PromptOps",
  "legalize-kr": "Legalize KR",
  oma: "OMA (oh-my-agent)",
};
