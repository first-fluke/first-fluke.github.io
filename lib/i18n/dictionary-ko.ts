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
    scrollHintAria: "아래로 스크롤",
  },
  about: {
    paragraphs: [
      "퍼스트플루크는 2026년 3월 설립된 AI 프로덕트 컴퍼니입니다. 우리 이름을 건 AI SaaS 제품을 직접 만들고 운영하며, 그 과정에서 쌓은 경험으로 고객의 웹사이트도 함께 구축합니다.",
      "병원 상담, 법령 리서치, SNS 콘텐츠, 쇼핑몰 운영, 운세까지 다양한 분야의 AI 서비스를 제공합니다. 요금제와 무료 이용 범위는 각 제품 사이트에서 확인할 수 있습니다.",
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
    subtitle: "퍼스트플루크가 직접 개발하고 운영하는 AI 제품입니다.",
    openAria: "{name} 사이트로 이동 (외부 링크)",
    viewCta: "사이트 보기",
    liveBadge: "운영 중",
    items: {
      "contents-haejo": {
        name: "콘텐츠해줘",
        tagline: "SNS 콘텐츠 운영, 매일 뭘 올릴지 고민 끝",
        category: "크리에이터 · 콘텐츠",
        features: [
          "채널 보이스를 학습해 매일 올릴 글감을 제안",
          "본문만 넣으면 카드뉴스 슬라이드까지 자동 생성",
          "발행·예약·답글을 한 곳에서 관리",
        ],
      },
      "legalize-kr": {
        name: "법률검토해줘",
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
      medisupporter: {
        name: "메디24",
        tagline: "병원 상담·예약·AI 답변을 한곳에서 관리하는 서비스",
        category: "의료 · 상담",
        features: [
          "카카오톡·네이버·홈페이지 문의를 하나의 상담함에서 관리",
          "승인된 병원 매뉴얼 기반 AI 답변 초안을 직원이 검토하고 전송",
          "상담에서 이어지는 예약을 캘린더로 관리",
        ],
      },
      fortunebom: {
        name: "운세봄",
        tagline: "사주·자미두수·타로·점성술을 한곳에서 분석하는 AI 운세 서비스",
        category: "라이프 · 운세",
        features: [
          "생년월일시 기반 자체 정밀 만세력으로 사주팔자 및 자미두수 명반 분석",
          "서양 점성술 천궁도와 인터랙티브 타로 카드 리딩 통합 제공",
          "오늘의 운세부터 궁합, 재회, 인생 대운 흐름까지 맞춤형 AI 리포트",
        ],
      },
    },
  },
  websiteProjects: {
    heading: "웹사이트 구축",
    subtitle: "기획부터 디자인·개발·배포까지, 비즈니스에 맞는 웹사이트를 직접 만듭니다.",
    contactCta: "구축 문의하기",
    badge: "구축 사례",
    items: {
      jiinfabric: {
        name: "지인패브릭",
        tagline: "커튼·블라인드·침구·홈패브릭 전문업체 지인패브릭의 공식 웹사이트",
        category: "홈패브릭 · 브랜드 사이트",
        features: [
          "제품·시공사례·가이드를 한곳에 담은 브랜드 사이트",
          "방문 실측 견적 신청과 카카오톡 문의 연결",
          "직영 매장 안내와 호텔·병원·펜션 B2B 납품 소개",
        ],
      },
    },
  },
  faq: {
    "heading": "제품 이용 안내",
    "intro": "필요한 제품을 고르고 시작하는 데 도움이 되는 안내입니다.",
    "items": [
      {
        "question": "퍼스트플루크는 어떤 회사인가요?",
        "answer": "퍼스트플루크(FIRST FLUKE)는 2026년 3월 설립된 AI 프로덕트 회사입니다. 콘텐츠해줘, 법률검토해줘, 샵지, 메디24, 운세봄을 직접 개발하고 운영합니다.",
        "href": "#about",
        "linkLabel": "회사 소개"
      },
      {
        "question": "SNS 콘텐츠 제작에는 어떤 제품을 사용하나요?",
        "answer": "SNS 게시물 아이디어와 콘텐츠 제작을 도우려면 콘텐츠해줘를 살펴보세요. 제품의 기능과 실제 화면은 솔루션 목록에서 확인할 수 있습니다.",
        "href": "#solutions",
        "linkLabel": "제품 기능과 화면 보기"
      },
      {
        "question": "쇼핑몰 운영과 병원 상담에는 어떤 제품이 맞나요?",
        "answer": "샵지는 Cafe24 쇼핑몰 운영을, 메디24는 병원의 여러 채널 상담과 예약 관리를 돕습니다. 해결하려는 업무에 맞춰 제품을 선택하세요.",
        "href": "#solutions",
        "linkLabel": "업무별 제품 살펴보기"
      },
      {
        "question": "법률검토해줘와 운세봄은 어떤 서비스인가요?",
        "answer": "법률검토해줘는 법령과 조문을 분석·비교하는 AI 리서치 도구입니다. 운세봄은 사주, 자미두수, 타로, 서양 점성술을 다루는 AI 운세 서비스입니다. 각 제품 사이트에서 제공 기능과 이용 안내를 확인할 수 있습니다.",
        "href": "#solutions",
        "linkLabel": "서비스 사이트 찾기"
      },
      {
        "question": "이용 요금과 무료 체험은 어디서 확인하나요?",
        "answer": "요금제, 무료 이용 범위, 체험 제공 여부는 제품마다 다릅니다. 솔루션 목록에서 원하는 제품의 사이트를 열어 현재 안내를 확인하세요. 도입이나 제휴 상담은 제품명을 선택해 문의할 수 있습니다.",
        "href": "#contact",
        "linkLabel": "제품 도입 문의"
      },
      {
        "question": "제품 문의는 어떻게 하나요?",
        "answer": "아래 문의 폼에서 제품을 선택하고 이메일과 문의 내용을 보내주세요. 담당자가 확인한 뒤 답변드립니다. 회사 연락처와 사업자 정보는 페이지 하단에서도 확인할 수 있습니다.",
        "href": "#contact",
        "linkLabel": "문의 폼으로 이동"
      }
    ]
  },
  team: {
    heading: "팀",
    subtitle: "퍼스트플루크를 만드는 사람들",
    linkedinAria: "{name}의 LinkedIn 프로필 열기",
    members: {
      gahyun: {
        name: "김가현",
        role: "공동창업자 · CEO",
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
      "contents-haejo": "콘텐츠해줘",
      "legalize-kr": "법률검토해줘",
      shopzy: "샵지",
      medisupporter: "메디24",
      fortunebom: "운세봄",
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
