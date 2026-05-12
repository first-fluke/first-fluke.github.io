export interface Solution {
  id: string;
  name: string;
  tagline: string;
  category: string;
  href: string;
  iconSrc?: string;
}

export const SOLUTIONS: Solution[] = [
  {
    id: "place-haejo",
    name: "플레이스 해줘",
    tagline: "소상공인의 멀티 채널 마케팅을 한 번에 자동화",
    category: "소상공인 · 마케팅",
    href: "https://place-haejo.firstfluke.com",
    iconSrc: "/icons/place-haejo.png",
  },
  {
    id: "contents-haejo",
    name: "콘텐츠 해줘",
    tagline: "콘텐츠 기획부터 수익화까지 한 번에",
    category: "크리에이터 · 콘텐츠",
    href: "https://contents-haejo.firstfluke.com",
    iconSrc: "/icons/contents-haejo.png",
  },
  {
    id: "legalize-kr",
    name: "법률 검토해줘",
    tagline: "법령 데이터를 분석·비교하는 AI",
    category: "규제 · 법령",
    href: "https://legalize-haejo.firstfluke.com",
    iconSrc: "/icons/legalize-kr.png",
  },
  {
    id: "curate-ai",
    name: "CurateAI",
    tagline: "고객 진단·추천을 자동 생성하는 AI SaaS",
    category: "추천 · 전환",
    href: "https://curate.ai.kr",
    iconSrc: "/icons/curate-ai.png",
  },
  {
    id: "prompt-ops",
    name: "PromptOps",
    tagline: "PM이 직접 다루는 프롬프트 운영 플랫폼",
    category: "AI Ops · 인프라",
    href: "https://promptsops.com",
    iconSrc: "/icons/prompt-ops.png",
  },
  {
    id: "shopzy",
    name: "Shopzy",
    tagline: "대화 한 마디로 운영하는 쇼핑몰",
    category: "이커머스 · 운영",
    href: "https://shopzy.firstfluke.com",
    iconSrc: "/icons/shopzy.png",
  },
];
