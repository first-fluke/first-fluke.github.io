import type { Dictionary } from "@/lib/i18n/i18n.types";

export const DICTIONARY_KO: Dictionary = {
  header: {
    homeAria: "FIRST FLUKE 홈",
  },
  languageSwitcher: {
    groupAria: "언어 선택",
  },
  nav: {
    sectionsAria: "섹션 네비게이션",
    backToTopAria: "맨 위로",
  },
  badge: {
    chipLabel: "2026 선정",
    providerLabel: "AI 솔루션 공급기업",
    linkAria: "모두의 창업 2026 선정 페이지로 이동",
  },
  hero: {
    titleLine1: "당신의 첫 번째",
    titleLine2: "행운을 함께 만듭니다",
    subtitleLead: "AI SaaS 제품을 직접 만들고 운영하는 회사,",
    ctaSolutions: "솔루션 보기",
    ctaContact: "문의하기",
    mascotButtonAria: "마스코트에게 인사하기",
    mascotVideoAria: "FIRST FLUKE 마스코트 (수달)",
  },
  about: {
    paragraphs: [
      "퍼스트플루크는 2026년 3월 설립된 AI 프로덕트 컴퍼니입니다. 다른 회사의 제품을 대신 만들어주는 대신, 우리 이름을 건 AI SaaS 제품을 직접 만들고 운영합니다.",
      "소상공인 마케팅, 크리에이터 콘텐츠, 쇼핑몰 운영까지 — 매일 반복되는 일을 AI가 대신 처리하는 구독형 SaaS 제품군을 서비스합니다. 각 제품은 월 구독으로 운영되며, 무료 체험으로 바로 사용해볼 수 있습니다.",
      "복잡한 기술을 전면에 내세우기보다, 누구나 이해하고 곧바로 쓸 수 있는 경험을 설계합니다. 아이디어 단계부터 실제 사용까지 이어지는, 실행 중심의 프로덕트를 만듭니다.",
      "기술 자체보다 ‘왜 필요한가’와 ‘어떤 경험을 남기는가’를 먼저 생각합니다.",
    ],
  },
  oma: {
    heading: "자체 멀티에이전트 하네스,",
    descriptionLead:
      "AI 어시스턴트 하나가 모든 걸 떠안기는 대신, 역할이 다른 전문 에이전트가 한 팀처럼 일하도록 ",
    descriptionStrong: "우리가 직접 설계",
    descriptionTail: "했습니다. 그 깊이가 솔루션의 일관된 품질을 만듭니다.",
    ctaRepo: "GitHub에서 보기",
    ctaDocs: "자세히 알아보기",
    requestLabel: "요청",
    typewriterTexts: [
      "사이트 하나 만들어줘",
      "회원가입 기능 만들어줘",
      "예약 시스템 만들어줘",
      "고객 문의 폼 만들어줘",
    ],
    agents: [
      { tag: "기획자", desc: "어떤 화면이 필요한지 정리" },
      { tag: "프론트엔드", desc: "UI · 컴포넌트 설계" },
      { tag: "백엔드", desc: "데이터 · API 연결" },
      { tag: "QA 리뷰어", desc: "테스트 · 검수" },
    ],
    highlights: [
      { label: "Portable", desc: "IDE에 묶이지 않음" },
      { label: "Role-based", desc: "프롬프트 묶음이 아닌 팀 구조" },
      { label: "Multi-vendor", desc: "Claude · Codex · Gemini · Qwen 혼합" },
      { label: "Token-efficient", desc: "2계층 구조로 토큰 약 75% 절감" },
    ],
  },
  solutions: {
    heading: "솔루션",
    subtitle: "퍼스트플루크가 직접 만들고 운영하는 구독형 AI SaaS 제품군입니다.",
    openAria: "{name} 사이트로 이동 (외부 링크)",
    viewCta: "사이트 보기",
    liveBadge: "운영 중",
    items: {
      "place-haejo": {
        name: "플레이스 해줘",
        tagline: "URL 한 줄로 시작하는 우리 가게 마케팅 컨설턴트",
        category: "소상공인 · 마케팅",
        features: [
          "매장 URL만 넣으면 경쟁 매장과 비교한 헬스 스코어 진단",
          "채널별 리뷰를 모아 AI가 답글까지 자동 생성",
          "주간 리포트로 이번 주 할 일을 우선순위로 정리",
        ],
      },
      "contents-haejo": {
        name: "콘텐츠 해줘",
        tagline: "SNS 콘텐츠 운영, 매일 뭘 올릴지 고민 끝",
        category: "크리에이터 · 콘텐츠",
        features: [
          "채널 보이스를 학습해 매일 올릴 글감을 제안",
          "본문만 넣으면 카드뉴스 슬라이드까지 자동 생성",
          "발행·예약·답글을 한 곳에서 관리",
        ],
      },
      "legalize-kr": {
        name: "법률 검토해줘",
        tagline: "법령 데이터를 분석·비교하는 AI 리서치 도구",
        category: "규제 · 법령",
        features: [
          "방대한 법령·조문 데이터를 AI가 분석",
          "조문 간 비교로 규제 리스크를 빠르게 파악",
          "리서치 결과를 정리된 형태로 제공",
        ],
      },
      shopzy: {
        name: "Shopzy",
        tagline: "대화 한 마디로 운영하는 카페24 쇼핑몰 AI 에이전트",
        category: "이커머스 · 운영",
        features: [
          "대화만으로 쇼핑몰 디자인·스킨을 즉시 수정 (RAG 기반)",
          "상품·주문·재고를 채팅으로 조회하고 바로 수정",
          "모든 수정은 자동 백업되어 언제든 롤백",
        ],
      },
    },
  },
  team: {
    heading: "팀",
    subtitle: "퍼스트플루크를 만드는 사람들",
    linkedinAria: "{name}의 LinkedIn 프로필 열기",
    members: {
      gahyun: {
        name: "김가현",
        role: "대표 · 시스템 아키텍트",
        bio: "퍼스트플루크를 이끌며 제품의 시스템 아키텍처와 인프라를 책임집니다. 여러 AI SaaS가 안정적으로 돌아가는 기반을 직접 설계하고 운영합니다.",
      },
      eunkwang: {
        name: "신은광",
        role: "공동창업자 · CTO",
        bio: "제품 전반의 기술을 총괄합니다. AI에 대한 깊은 전문성을 바탕으로 프론트엔드부터 AI 모델링까지 기술 방향을 설계하고 구현을 이끕니다.",
      },
    },
  },
  contact: {
    heading: "문의",
    subtitle: "확인 후 영업일 기준 24시간 내 회신드리겠습니다.",
    productLabel: "문의 종류",
    productPlaceholder: "어떤 솔루션 관련인가요?",
    productOptions: {
      "place-haejo": "플레이스 해줘",
      "contents-haejo": "콘텐츠 해줘",
      "legalize-kr": "법률 검토해줘",
      shopzy: "Shopzy",
      oma: "OMA (oh-my-agent)",
      etc: "기타",
    },
    emailLabel: "이메일",
    messageLabel: "메시지",
    messagePlaceholder: "문의 내용을 알려주세요.",
    agreePrefix: "개인정보 수집·이용에 동의합니다.",
    agreeLink: "상세 보기",
    submitIdle: "보내기",
    submitBusy: "보내는 중…",
    successTitle: "문의가 접수되었습니다.",
    successBody: "확인 후 회신 드릴게요.",
    successReset: "새 문의 작성",
    errorRateLimited: "너무 빠르게 시도하셨어요. 잠시 후 다시 시도해주세요.",
    errorSendFailed: "전송에 실패했어요. 잠시 후 다시 시도해주세요.",
    validation: {
      emailRequired: "이메일을 입력해주세요.",
      emailInvalid: "이메일 형식이 올바르지 않아요.",
      messageRequired: "메시지를 입력해주세요.",
      messageTooLong: "메시지가 너무 길어요.",
      agreeRequired: "개인정보 수집·이용에 동의해주세요.",
      productRequired: "문의 종류를 선택해주세요.",
    },
  },
  footer: {
    flukeDefinition: "우연한 행운.",
    legalAria: "법적 고지",
    privacyLabel: "개인정보처리방침",
    business: {
      triggerAria: "사업자 정보 보기",
      title: "사업자 정보",
      rows: [
        { label: "사업자등록번호", value: "711-23-02368" },
        { label: "대표자", value: "김가현 (Kim Gahyun)" },
        { label: "전화", value: "010-3953-2827" },
        { label: "주소", value: "서울시 관악구 조원로 25" },
      ],
    },
  },
  privacy: {
    backLink: "← FIRST FLUKE 홈으로",
    title: "개인정보처리방침",
    effectiveDate: "시행일자: 2026-05-09",
    sections: [
      {
        title: "1. 수집하는 개인정보 항목",
        body: [
          "필수 항목: 이메일, 메시지 본문",
          "자동 수집: 접속 IP, 접속 시각, 브라우저 정보(스팸 방지 목적, 단기 보관)",
        ],
      },
      {
        title: "2. 수집·이용 목적",
        body: ["문의 접수 및 회신", "스팸·악용 방지"],
      },
      {
        title: "3. 보관 기간",
        body: [
          "회신 완료 후 6개월간 보관 후 즉시 파기합니다. (회신·기록 보관 목적)",
        ],
      },
      {
        title: "4. 제3자 제공",
        body: ["원칙적으로 제공하지 않습니다."],
      },
      {
        title: "5. 처리 위탁",
        body: [
          "이메일 발송 서비스: Resend, Inc. (이메일 본문, 수신자 이메일)",
          "스팸 방지: Cloudflare, Inc. (Turnstile 토큰 검증)",
        ],
      },
      {
        title: "6. 이용자의 권리",
        body: [
          "이용자는 언제든지 본인의 개인정보 열람·정정·삭제·처리정지를 요청할 수 있습니다.",
          "요청은 홈 화면 하단의 'Contact' 섹션에 마련된 문의 양식을 통해 접수해주세요.",
        ],
      },
      {
        title: "7. 개인정보 보호 책임자",
        body: [
          "직책: 대표",
          "연락 채널: 홈 화면 하단의 'Contact' 섹션 문의 양식",
        ],
      },
      {
        title: "8. 고지의 의무",
        body: [
          "본 처리방침의 내용 추가, 삭제 및 수정이 있을 시에는 시행일 7일 전부터 홈페이지에 공지합니다.",
        ],
      },
    ],
  },
};
