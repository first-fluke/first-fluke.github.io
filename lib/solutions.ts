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
    name: "플레이스해줘",
    tagline: "URL 한 줄로 시작하는 우리 가게 마케팅 컨설턴트",
    category: "소상공인 · 마케팅",
    href: "https://place-haejo.firstfluke.com",
    iconSrc: "/icons/place-haejo.webp",
    screenshotSrc: "/screenshots/place-haejo.webp",
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
    id: "legalize-kr",
    name: "법률검토해줘",
    tagline: "법령 데이터를 분석·비교하는 AI 리서치 도구",
    category: "규제 · 법령",
    href: "https://legalize-haejo.firstfluke.com",
    iconSrc: "/icons/legalize-kr.webp",
    screenshotSrc: "/screenshots/legalize-kr.webp",
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
    id: "deploy-haejo",
    name: "배포해줘",
    tagline: "소스만 연결하면 알아서 배포되는 원클릭 앱 배포 플랫폼",
    category: "인프라 · 배포",
    href: "https://deploy-haejo.firstfluke.com",
    iconSrc: "/icons/deploy-haejo.webp",
    screenshotSrc: "/screenshots/deploy-haejo.webp",
  },
  {
    id: "medisupporter",
    name: "메디서포터",
    tagline: "카톡·네이버·홈페이지 문의를 상담함 하나로 모으는 병원 상담 SaaS",
    category: "의료 · 상담",
    href: "https://www.medisupporter.com",
    iconSrc: "/icons/medisupporter.webp",
    screenshotSrc: "/screenshots/medisupporter.webp",
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
