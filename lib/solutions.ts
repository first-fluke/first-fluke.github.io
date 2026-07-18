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
    id: "place-haejo",
    name: "플레이스 해줘",
    tagline: "URL 한 줄로 시작하는 우리 가게 마케팅 컨설턴트",
    category: "소상공인 · 마케팅",
    href: "https://place-haejo.firstfluke.com",
    iconSrc: "/icons/place-haejo.png",
    screenshotSrc: "/screenshots/place-haejo.webp",
  },
  {
    id: "contents-haejo",
    name: "콘텐츠 해줘",
    tagline: "SNS 콘텐츠 운영, 매일 뭘 올릴지 고민 끝",
    category: "크리에이터 · 콘텐츠",
    href: "https://contents-haejo.firstfluke.com",
    iconSrc: "/icons/contents-haejo.png",
    screenshotSrc: "/screenshots/contents-haejo.webp",
  },
  {
    id: "legalize-kr",
    name: "법률 검토해줘",
    tagline: "법령 데이터를 분석·비교하는 AI 리서치 도구",
    category: "규제 · 법령",
    href: "https://legalize-haejo.firstfluke.com",
    iconSrc: "/icons/legalize-kr.png",
    screenshotSrc: "/screenshots/legalize-kr.webp",
  },
  {
    id: "shopzy",
    name: "Shopzy",
    tagline: "대화 한 마디로 운영하는 카페24 쇼핑몰 AI 에이전트",
    category: "이커머스 · 운영",
    href: "https://shopzy.firstfluke.com",
    iconSrc: "/icons/shopzy.png",
    screenshotSrc: "/screenshots/shopzy.webp",
  },
];
