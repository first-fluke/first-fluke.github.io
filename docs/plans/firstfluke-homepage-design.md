# Firstfluke Homepage — Design Brief

> 한 페이지 회사 사이트. "모두의 창업 AI 솔루션 공급기업" 선정 페이지에서 유입된 방문자에게 신뢰를 전달하면서, 일반 잠재 고객·파트너에게도 재활용 가능하도록 구색을 갖춘다.

## 1. 목적

- **1순위**: 모두의 창업 선정 페이지에서 들어온 방문자에게 5초 안에 "이 회사 진짜고 선정될 만한 곳이네"를 전달
- **2순위**: 추후 일반 잠재 고객·파트너에게 동일 페이지 재활용
- **비목적**: 대표·멤버 개인정보, 미체결 파트너십, PoC 단계 솔루션은 노출하지 않음

## 2. 핵심 결정

| 항목 | 결정 |
|---|---|
| 페이지 형태 | One-page, 5섹션 (Hero → 회사 소개 → 솔루션 → 문의 → Footer) |
| 1순위 방문자 | 선정 페이지 유입자 (검증·신뢰 확인) |
| 디자인 무드 | Shopzy 결의 차분한 B2B SaaS 미니멀 + 히어로에만 수달 마스코트 |
| 마스코트 노출 | 히어로 1회 (그 외 섹션엔 없음) |
| 멤버/대표 정보 | 미노출 |
| 회사 정보(사업자번호·주소·전화) | 미노출 (현행 미니멀 푸터 유지) |
| 파트너 섹션 | 미노출 (현 시점 공식 파트너십 없음) |
| 주니(시니어 케어 PoC) | 미노출 |
| 회사 소개 | 4단락 (정체성 → 가치·태도 → 영역·실행 → 판단 기준) |
| Sign-off 라인 | 푸터 직전 짧은 한 라인 — `fluke (n.)` 뜻풀이 + Threads 링크 |
| 카드 표현 | 추상 영역 X → 실제 운영 중 솔루션 6개 |
| 카드 클릭 영역 | 카드 전체 클릭 → 외부 링크 새 탭 (`target="_blank" rel="noopener"`) |
| 선정 배지 | 공식 배지 이미지 + 원본 페이지 링크. 데스크탑 우상단 풀배지 / 모바일 H1 위 chip |
| Contact | 문의 폼 (이메일·메시지·동의 체크). 메일 직접 링크 미노출 |
| 폼 백엔드 | Resend + Vercel Functions (`/api/contact` route handler) |
| 개인정보처리방침 | **출시와 함께 활성화 필수** (폼 운영 부수효과) |
| 분석 | Vercel Web Analytics (쿠키 동의 모달 불필요) |
| 푸터 | Shopzy 결의 미니멀 (회사 상세 정보 미노출) |
| 언어 | 한국어 only (`<html lang="ko">`), 영문 페이지 계획 없음 |

## 3. 카피

### 히어로 메인
```
MAKE YOUR FIRST WIN

당신을 첫 번째 행운으로 이끕니다.
```

- 영문 슈퍼라벨 `MAKE YOUR FIRST WIN`: 작은 대문자, letter-spacing 0.1em, Accent Fresh Green
- 한국어 메인 헤드: H1 사이즈, Primary Deep Green, 줄바꿈 한 번

### 서브카피 (메인 헤드 아래)
```
사업의 모든 일을 다루는 AI 솔루션 스튜디오, Firstfluke.
```
- 본문 사이즈, Neutral Gray
- 회사 정체성을 한 줄로 자기소개

### CTA (서브카피 아래)
- Primary: `솔루션 보기` → 페이지 내 #solutions 앵커 (smooth scroll)
- Secondary: `문의하기` → 페이지 내 #contact 앵커

### 회사 소개 (Section 2)
```
AI와 기술을 통해 자연스럽고 실용적인 사용자 경험을 만드는 팀입니다.

퍼스트플루크는 기능을 많이 담는 서비스보다, 사람들이 오래 쓰는 경험을 고민합니다.
복잡한 기술을 전면에 드러내는 대신, 사용자가 편하게 이해하고 쓸 수 있도록 구조와 흐름을 설계합니다.

AI, 콘텐츠, 자동화를 기반으로 다양한 디지털 제품과 서비스를 기획하고 개발합니다.
아이디어 단계부터 실제 사용까지 이어지는, 실행 중심의 프로덕트를 만듭니다.

기술 자체보다 '왜 필요한가'와 '어떤 경험을 남기는가'를 먼저 생각합니다.
```
- 헤딩: `Firstfluke란` (H2, Primary Deep Green)
- 본문: 16–18px, line-height 1.7, max-width 56ch (가독성)
- 단락 사이 간격: 약 1em (마지막 한 줄 단락 앞 간격은 1.25em로 살짝 더 띄움)
- 톤: 차분·단단. 비교 도발 없음. 첫 단락은 정체성 한 줄 선언, 마지막 단락은 판단 기준 클로저

### 푸터 직전 sign-off 라인
```
fluke (n.) 뜻밖에 잘 풀린 한 번의 행운.
우리는 그걸 직접 만드는 팀입니다.

Threads · @firstfluke
```
- 위치: Section 4 문의 폼 ↓ Footer ↑ 사이에 짧게
- 헤딩 없음. 본문보다 한 단계 작은 사이즈(13–14px), `--color-fg-muted`
- `fluke (n.)` 부분만 영문 monospace 또는 italic으로 살짝 강조하여 사전 정의 톤
- Threads 링크: `https://www.threads.net/@firstfluke` (핸들 미확정 시 §8 자산에서 사용자 확인)

### 문의 (Section 4)
```
문의

[ 이메일                              ]
[ 메시지                              ]
[                                    ]
[                                    ]
☐ 개인정보 수집·이용에 동의합니다.

[ 보내기 ]
```
- 헤딩: `문의` 한 단어
- 부제·서브카피 없음
- 동의 체크 미체크 시 보내기 비활성

## 4. 페이지 구조

### Section 1 — Hero

**데스크탑**
```
[좌상단: 로고 마크 + Firstfluke 워드마크]    [우상단: 모두의 창업 선정 풀배지]

  MAKE YOUR FIRST WIN
  당신을 첫 번째 행운으로
  이끕니다.

  사업의 모든 일을 다루는 AI 솔루션 스튜디오, Firstfluke.

  [ 솔루션 보기 ]   [ 문의하기 ]
                                                      [수달 마스코트 일러스트]
```

**모바일**
```
[로고 마크 + Firstfluke 워드마크]

  ✨ 모두의 창업 2026 선정  ← chip 형태, H1 위
  MAKE YOUR FIRST WIN
  당신을 첫 번째
  행운으로 이끕니다.

  [수달 마스코트 — 180~220px, 가운데 정렬]

  사업의 모든 일을 다루는 AI 솔루션 스튜디오, Firstfluke.

  [ 솔루션 보기 ]
  [ 문의하기 ]
```
- 모바일 마스코트는 H1 아래 / 서브카피 위 위치
- chip은 Primary Deep Green 텍스트 + Soft Sage Tint 배경, radius 999px
- 선정 배지 chip·풀배지 모두 클릭 시 모두의 창업 선정 페이지로 이동(`target="_blank" rel="noopener"`)

### Section 2 — 회사 소개

```
Firstfluke란

AI와 기술을 통해 자연스럽고 실용적인 사용자 경험을 만드는 팀입니다.

퍼스트플루크는 기능을 많이 담는 서비스보다, 사람들이 오래 쓰는 경험을 고민합니다.
복잡한 기술을 전면에 드러내는 대신, 사용자가 편하게 이해하고 쓸 수 있도록 구조와 흐름을 설계합니다.

AI, 콘텐츠, 자동화를 기반으로 다양한 디지털 제품과 서비스를 기획하고 개발합니다.
아이디어 단계부터 실제 사용까지 이어지는, 실행 중심의 프로덕트를 만듭니다.

기술 자체보다 '왜 필요한가'와 '어떤 경험을 남기는가'를 먼저 생각합니다.
```
- 4단락 구성 (정체성 한 줄 → 가치·태도 → 영역·실행 → 판단 기준)
- 좌측 정렬, max-width 56ch, 가운데 컨테이너 정렬
- 시각 장식 없음. 위·아래 padding으로 호흡만 확보
- 마스코트·아이콘·이미지 없음
- 첫 단락(정체성 한 줄)과 마지막 단락(판단 기준)은 다른 단락보다 약간 더 떨어트려 강조

### Section 3 — Solutions (3×2 grid / 모바일 1열)

| # | 제품 | 한 줄 카피 | 카테고리 태그 | 외부 링크 |
|---|---|---|---|---|
| 1 | **플레이스 해줘** | 소상공인의 멀티 채널 마케팅을 한 번에 자동화 | 소상공인 · 마케팅 | place-haejo.firstfluke.com |
| 2 | **콘텐츠 해줘** | 콘텐츠 기획부터 수익화까지 한 번에 | 크리에이터 · 콘텐츠 | contents-haejo.firstfluke.com |
| 3 | **Shopzy** | 대화 한 마디로 운영하는 쇼핑몰 | 이커머스 · 운영 | shopzy.firstfluke.com |
| 4 | **CurateAI** | 고객 진단·추천을 자동 생성하는 AI SaaS | 추천 · 전환 | curate.ai.kr |
| 5 | **PromptOps** | PM이 직접 다루는 프롬프트 운영 플랫폼 | AI Ops · 인프라 | promptsops.com |
| 6 | **Legalize KR** | 법령 데이터를 분석·비교하는 AI | 규제 · 법령 | legalize-haejo.firstfluke.com |

> 노출 순서는 구현 시 PM 판단으로 결정 (현재 표 순서는 초안).

각 카드 구성:
- 상단: 제품 아이콘/마크 (없으면 카테고리 라인 아이콘 placeholder)
- 제품명 (H3)
- 한 줄 카피 (Body)
- 카테고리 태그 (작은 라벨 chip)
- 외부 링크 시각 라벨 (`외부로 이동 ↗` — 카드 하단)

상호작용:
- **카드 전체가 클릭 가능** (`<a>` wrapper). 키보드 포커스 링 표시 필수
- 호버 시 카드 살짝 elevate (translateY -2px, shadow 강조)
- 클릭 시 새 탭 (`target="_blank" rel="noopener noreferrer"`)
- 외부 링크 라벨은 시각 명시용 — 키보드 사용자에겐 카드 자체가 링크라 별도 tabindex 없음

### Section 4 — 문의 (Contact Form)

```
문의

이메일 [                                    ]
메시지 [                                    ]
       [                                    ]
       [                                    ]
☐ 개인정보 수집·이용에 동의합니다.   [상세 보기]

[ 보내기 ]
```

폼 동작:
- 제출 = `POST /api/contact` (Vercel Functions, Resend로 운영자 메일 송부 + 자동회신)
- 클라이언트 검증: 이메일 형식, 메시지 1자 이상, 동의 체크
- 서버 검증: 동일 + Cloudflare Turnstile(무료 honeypot 대안 가능)
- 제출 성공: 폼 자리에 inline 성공 메시지(`문의가 접수되었습니다. 확인 후 회신 드릴게요.`)
- 제출 실패: 폼 위에 inline 에러 + 재시도 버튼
- "[상세 보기]" → 개인정보처리방침 페이지 새 탭

### Sign-off 라인 (Section 4 문의 ↓ Footer ↑ 사이)
```
─────

fluke (n.) 뜻밖에 잘 풀린 한 번의 행운.
우리는 그걸 직접 만드는 팀입니다.

Threads · @firstfluke

─────
```
- 가운데 정렬, max-width 56ch
- 13–14px, `--color-fg-muted`
- `fluke (n.)` 부분만 살짝 강조 (italic 또는 monospace)
- Threads 링크: `target="_blank" rel="noopener"`. 핸들 미확정 시 placeholder
- 위·아래 옅은 구분선 또는 padding 64px(데스크탑) / 48px(모바일)

### Footer (Shopzy 결의 미니멀)
```
© 2026 Firstfluke

개인정보처리방침 · 이용약관
```
- 사업자등록번호·주소·대표자명·전화번호 모두 미노출 (현행 유지)
- **개인정보처리방침**: 출시와 함께 활성화 필수 (폼 운영 부수효과)
- **이용약관**: 첫 출시는 placeholder 페이지(준비 중) 또는 비활성, 추후 활성

## 5. 비주얼 시스템

### 컬러
| 역할 | 토큰 | HEX |
|---|---|---|
| Primary Deep Green | `--color-primary` | `#0F4C3A` |
| Accent Fresh Green | `--color-accent` | `#7AB94C` |
| Background Off-white | `--color-bg` | `#FAFAF7` |
| Soft Sage Tint | `--color-bg-soft` | `#E8F0E4` |
| Body Text | `--color-fg` | `#1F2A26` |
| Muted Text | `--color-fg-muted` | `#5C6660` |
| Border | `--color-border` | `#E5E7E2` |

색 용도 가이드:
- **Primary Deep Green**: 헤딩, 본문 강조, 워드마크, **CTA Primary 배경 (흰 텍스트 위 ~11:1, AAA)**
- **Accent Fresh Green**: 로고 마크, 영문 슈퍼라벨, 하이라이트 라인, 선정 chip 액센트 — **단독으로 흰 텍스트 위에 사용 금지** (대비 ~2.4:1, AA 미달)
- **Soft Sage Tint**: 카드 아이콘 원형 배경, 선정 chip 배경, 섹션 구분 배경

### 타이포
- 한글 우선: **Pretendard Variable** (시스템 폴백: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)
- 영문: 한글 폰트의 영문 글리프 사용 (별도 영문 폰트 X)
- 스케일:
  - H1: 48–64px (모바일 36–40px), weight 700
  - H2: 28–32px, weight 700
  - H3: 20–22px, weight 600
  - Body: 16–17px, weight 400, line-height 1.6
  - 회사 소개 Body: 16–18px, line-height 1.7, max-width 56ch
  - Sign-off: 13–14px, `--color-fg-muted`
  - 영문 슈퍼라벨: 13–14px, weight 600, letter-spacing 0.1em, uppercase

### 컴포넌트 모티프
- 라운드 카드: radius 16–20px
- 그림자: 옅은 그림자 (offset 0 4px 16px, 8% opacity)
- 아이콘 백: 옅은 그린 원형 (`--color-bg-soft`, 56–64px)
- 8px 그리드, 섹션 padding 96px(데스크탑) / 64px(모바일)
- shadcn/ui: `Button`, `Card`, `Input`, `Textarea`, `Checkbox` 베이스로만 사용
- 포커스 링: `outline: 2px solid --color-primary; outline-offset: 2px;` (모든 인터랙티브 요소)

### 모션
- opacity + transform만 사용 (60fps 보장)
- 마이크로 인터랙션: 150ms ease-out
- 섹션 페이드인: 200–400ms, IntersectionObserver 트리거
- `prefers-reduced-motion: reduce` 존중 (애니메이션 0ms)

### 반응형
- 모바일 우선 (375px 기준)
- Breakpoints: sm 640 / md 768 / lg 1024 / xl 1280
- 데스크탑 Hero가 한 화면에 들어오도록 (vh 100 기준)

## 6. 기술 스택

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind v4** (`@theme` 디렉티브 기반 토큰)
- **shadcn/ui** (Button, Card, Input, Textarea, Checkbox)
- **호스팅**: Vercel (main 브랜치 자동 배포)
- **빌드 모드**: 기본 SSG + `/api/contact`만 Edge/Node Function (정적 export 모드는 사용 불가 — 폼 도입 부수효과)
- **폼 처리**: `Resend` SDK로 운영자(`our.first.fluke@gmail.com`)에게 메일 전달 + 자동회신. API 키는 `RESEND_API_KEY` 환경변수
- **스팸 방어**: Cloudflare Turnstile (무료) + 서버 측 honeypot 필드
- **분석**: Vercel Web Analytics (`@vercel/analytics`) — 쿠키리스, 동의 모달 불필요
- **AEO/SEO**:
  - 시맨틱 HTML5 (`<main>`, `<section>`, `<article>`)
  - JSON-LD: `Organization` (legalName, url, logo만 노출. address·phone 미노출 유지)
  - Next.js `metadata` API로 OG / Twitter Card
  - `sitemap.xml` + `robots.txt`
- **OG 이미지**: 정적 PNG 1장 (1200×630). 좌측 마스코트 + 우측 "MAKE YOUR FIRST WIN" 슈퍼라벨 + 하단 워드마크. `/public/og.png`
- **이미지**: `next/image` + AVIF/WebP, 마스코트는 PNG 투명배경
- **404**: Next.js 기본 `not-found.tsx` 짧게 ("페이지를 찾을 수 없어요" + 홈으로 가기)
- **언어**: `<html lang="ko">` 고정

## 7. 회사 정보 (참조용 — 본문 노출 X)

| 항목 | 값 |
|---|---|
| 기업명 | 퍼스트플루크 (FIRST FLUKE) |
| 사업자등록번호 | 711-23-02368 |
| 설립일 | 2026-03-10 |
| 주소 | 서울특별시 관악구 조원로 25 힐스테이트 뉴포레 |
| 공식 이메일 | our.first.fluke@gmail.com |

## 8. 자산 인벤토리

### 확보된 자산
| 자산 | 경로 | 비고 |
|---|---|---|
| 수달 마스코트 | `/Users/sorang/Documents/모두의창업공급솔루션/firstfluke_profile.jpeg` | 흰 배경. 구현 시 배경 제거 권장 |
| 로고 마크 (채택) | `/Users/sorang/Documents/firstfluke/assets/logo/firstfluke-logo-mark.png` | oma image(codex/gpt-image-2) 생성, 1024×1024 PNG, 투명 배경, fresh green #7AB94C. **클로버 + 사람 이중 모티프** — 4개의 둥근 잎이 X자로 모이고 위에 작은 머리. 행운(fluke) · 시작 의미를 동시에 담음 |
| 로고 시안 archive | 동 디렉터리: `firstfluke-logo-mark-v1-x-shape.png`, `firstfluke-logo-mark-v1b-x-shape.png`, `firstfluke-logo-mark-v2-human-leaning.png` | 대안 시안 보관. 향후 SVG 변환·재시도 시 참고용 |
| 플레이스 해줘 아이콘 | `/Users/sorang/Documents/모두의창업공급솔루션/icon_place.png` | |
| 콘텐츠 해줘 아이콘 | `/Users/sorang/Documents/모두의창업공급솔루션/icon_contnets.png` | 파일명 오타(`contnets`) 원본 그대로 |
| Legalize KR 아이콘 | `/Users/sorang/Documents/모두의창업공급솔루션/icon_legal.png` | |
| favicon | `/Users/sorang/Documents/모두의창업공급솔루션/favicon.png` | |
| 다크 배경 일러스트 | `/Users/sorang/Documents/모두의창업공급솔루션/firstfluke_bg.png` | oh-my-agent 결의 다크 테마. 본 사이트 라이트 톤과 충돌 — 미사용 또는 별도 페이지에서만 |

### 사용자 제공 예정
- **Shopzy 아이콘** — 사용자 보유, 경로 추후 제공
- **모두의 창업 공식 선정 배지** — 공식 자료가 있다면 사용, 없으면 자체 chip 디자인으로 대체
- **모두의 창업 선정 페이지 URL** — 우상단 배지 클릭 대상
- **도메인** — `firstfluke.com` 등 메인 도메인 보유 여부 확인 / 결정
- **Resend API 키** — 폼 운영용. 미발급 시 mailto 폴백 임시 사용 (`// TODO(oma-deferred)` 처리)
- **Cloudflare Turnstile site key** — 미발급 시 honeypot만으로 임시 운영
- **Threads 핸들 / URL** — sign-off 라인용. 가정값 `@firstfluke` (`https://www.threads.net/@firstfluke`). 다른 핸들이면 사용자 확정 필요

### 출시와 함께 필수 작성
- **개인정보처리방침** 본문 — 폼이 이름·이메일 수집하므로 PIPA 준수 필수. 푸터 링크 활성화 상태로 출시
- **이용약관** — 첫 출시 시점에는 placeholder 페이지(준비 중) 가능. 추후 활성

### 추후 보강
- **CurateAI · PromptOps 아이콘** — 첫 출시 후 보강. 같은 oma image 파이프라인으로 같은 결로 생성 가능
- **OG 이미지 1장** — 디자인 후 `/public/og.png` 위치

### 자산 정리 권장(구현 시)
- 모든 자산을 `apps/web/public/` 또는 `assets/` 통일 디렉터리로 복사·정리
- 마스코트 배경 제거(remove.bg 또는 Figma) → `firstfluke-mascot.png` (투명 배경)
- 로고 마크는 SVG 변환 권장(Vectorizer.AI 또는 Figma Trace) → 무한 확대 대응

## 9. 향후 확장 (선택)

- `/solutions/[slug]` 서브 페이지: 각 솔루션이 외부 도메인을 갖고 있어 당장은 카드 → 외부 링크지만, 추후 firstfluke.com 내부 케이스 페이지 추가 가능
- `/blog`: 기술·도메인 인사이트
- `/careers`: 채용 시점에 추가
- 영문 페이지: `/en` 라우팅 (현재 미계획)
- 폼 발전: 회사명·관련 솔루션 dropdown 등 필드 확장, 알림 Slack 연동

## 10. 컴포넌트 인벤토리 (구현 단계 참고)

- `<Header />` — 워드마크 + 선정 배지 (반응형: 데스크탑 우상단 풀배지 / 모바일 H1 위 chip은 Hero 내부)
- `<Hero />` — 슈퍼라벨, H1, 서브카피, CTA, 마스코트, 모바일 chip
- `<CompanyIntro />` — 회사 소개 4단락 (Section 2)
- `<SolutionsGrid />` + `<SolutionCard />` — 카드 전체 클릭 가능
- `<ContactForm />` — 이메일·메시지·동의 + Resend 제출 핸들러
- `<SignOff />` — fluke 뜻풀이 한 마디 + Threads 링크 (푸터 직전)
- `<Footer />` — 카피라이트 + 약관·개인정보처리방침 링크
- `<Mascot />` — 마스코트 이미지 컴포넌트 (responsive sizing)
- shadcn/ui: `<Button />`, `<Card />`, `<Input />`, `<Textarea />`, `<Checkbox />`

## 11. 변경 이력

- **2026-05-09 v3**: 회사 소개를 단일 문단 manifesto → 4단락 차분 톤(정체성·가치·실행·판단 기준)으로 교체. 푸터 직전 sign-off 라인 추가(`fluke (n.)` 뜻풀이 + Threads 링크). 컴포넌트 인벤토리에 `<CompanyIntro />`, `<SignOff />` 반영.
- **2026-05-09 v2**: 5섹션 구조로 확장(회사 소개 추가), 문의 폼 도입(Resend), 선정 배지 모바일 chip 분기, 컬러 용도 가이드 추가, Vercel Analytics 채택, 개인정보처리방침 출시 필수화. 브레인스토밍 세션 기반.
- **v1**: 3섹션 + mailto Contact 초안.
