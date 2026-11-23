export interface Solution {
  id: string;
  name: string;
  tagline: string;
  category: string;
  href: string;
  iconSrc?: string;
  /** Product UI screenshot shown on the card. Omitted when no public page exists. */
  screenshotSrc?: string;
}

export const SOLUTIONS: Solution[] = [
  {
    id: "medisupporter",
    name: "메디24",
    tagline: "병원 상담·예약·AI 답변을 한곳에서 관리하는 서비스",
    category: "의료 · 상담",
    href: "https://medi-24.com",
    iconSrc: "/icons/medi24.webp",
    screenshotSrc: "/screenshots/medi24.webp",
  },
  {
    id: "legalize-kr",
    name: "법률검토해줘",
    tagline: "법령 데이터를 분석·비교하는 AI 리서치 도구",
    category: "규제 · 법령",
    href: "https://legalize-haejo.firstfluke.com",
    iconSrc: "/icons/legalize-kr.webp",
    screenshotSrc: "/screenshots/legalize-kr.webp",
  },
  {
    id: "contents-haejo",
    name: "콘텐츠해줘",
    tagline: "SNS 콘텐츠 운영, 매일 뭘 올릴지 고민 끝",
    category: "크리에이터 · 콘텐츠",
    href: "https://contents-haejo.firstfluke.com",
    iconSrc: "/icons/contents-haejo.webp",
    screenshotSrc: "/screenshots/contents-haejo.webp",
  },
  {
    id: "shopzy",
    name: "Shopzy",
    tagline: "대화 한 마디로 운영하는 카페24 쇼핑몰 AI 에이전트",
    category: "이커머스 · 운영",
    href: "https://shopzy.firstfluke.com",
    iconSrc: "/icons/shopzy.webp",
    screenshotSrc: "/screenshots/shopzy.webp",
  },
  {
    id: "fortunebom",
    name: "운세봄",
    tagline: "사주·자미두수·타로·점성술을 한곳에서 분석하는 AI 운세 서비스",
    category: "라이프 · 운세",
    href: "https://www.fortunebom.com",
    iconSrc: "/icons/fortunebom.webp",
    screenshotSrc: "/screenshots/fortunebom.webp",
  },
];
