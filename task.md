# Contact 라우팅 — Task Handoff

> 작성일: 2026-05-10 · 인계자: sorang@across.center · 인계받는 사람이 처음 보는 문서라고 가정하고 self-contained로 작성됨.
> 상세 산출물: [.agents/results/plan-2026-05-10-contact-solution-routing.json](.agents/results/plan-2026-05-10-contact-solution-routing.json) (rev3) / [.agents/results/current-plan.md](.agents/results/current-plan.md)

---

## TL;DR

`firstfluke.com` 문의 폼에 **8개 product 드롭다운** (oma + 6 솔루션 + 기타)을 추가하고, **Cloudflare Worker가 GitHub App으로 product별 repo에 Issue를 생성**한다. 즉시 재시도 + KV dead-letter + 5분 Cron 폴링으로 신뢰성을 누르고, 솔루션별 이메일 분배는 도입하지 않는다(이메일은 dead-letter 24h 미해결 시 운영자 1명에게만). 모든 페이지에서 메일 평문 노출은 0으로 차폐 완료.

---

## 1. 배경 / 목표

| 항목 | 내용 |
|---|---|
| 프로젝트 | firstfluke 메인 페이지 contact 폼 라우팅 개선 |
| 현재 상태 | 폼은 단일 GitHub repo(또는 Resend 메일) 1곳으로만 라우팅. 7개 솔루션 운영 중인데 분류 없음. |
| 목표 | 사용자가 product 선택 → 해당 repo에 자동 issue 생성 (운영팀 분리·트래킹 위해). |
| 비기능 요구 | 안전성(권한 격리·평문 노출 0)·신뢰성(거의 100% 적재)·운영 단순성(이메일은 1개 채널만). |
| 진입점 | Cloudflare Worker (`apps/web/worker/`) 단일 — 정적 export(`out/`) 환경이라 Next.js api route 미사용. |

8개 product slug:
`oma`, `place-haejo`, `contents-haejo`, `shopzy`, `curate-ai`, `prompt-ops`, `legalize-kr`, `etc`

---

## 2. 핵심 결정 (rev3 — 2026-05-10 동결)

| ID | 결정 | 근거 요약 |
|---|---|---|
| D1 | 라우팅 매핑 = `PRODUCT_ROUTES` JSON env (Worker only) | 클라이언트가 repo slug 알면 spam 표적 |
| D2 | product **선택 필수**, 8개 enum (`oma + 6 솔루션 + etc`); `etc`("기타")는 `first-fluke/first-fluke.github.io` 로 라우팅 | 솔루션 분류 강제는 유지하되, 7개 어디에도 안 맞아 이탈하는 케이스를 8번째 enum 값으로 흡수 (2026-05-13 갱신) |
| D3 | GitHub 인증 = **GitHub App + `jose` (RS256, PKCS#8) + KV-cached installation token** | 토큰 1h 자동 회전, 권한 좁힘(Issues:Write만), owner 부담 install 1회 |
| D4 | 진입점 = **Cloudflare Worker 단일**, `apps/web/app/api/contact` 삭제 예정 | 정적 export 환경, SSOT 1개 |
| D5 | 알림 채널 = **GitHub Issue 단일** | Issue가 협업·트래킹 SSOT, 솔루션별 이메일 분배 X |
| D6 | 신뢰성 = retry 3회 → KV `DEAD_LETTER` push → 5분 Cron 폴링 → 24h 임계 운영자 1통 | GitHub API 일시 장애 흡수, 사용자에겐 항상 200 |
| D7 | 안티스팸 = Turnstile + Honeypot + **Cloudflare Rate Limiting binding (`[[ratelimits]]`)** | 2025-09-19 GA 기능, KV 카운터 대비 정확도↑ |
| D8 | Issue body는 `\`\`\`text` 코드펜스 wrap + 백틱 ZWSP escape | 마크다운/HTML 인젝션 차단 |
| D9 | PII 로깅 = 이메일 SHA-256 12자 해시, 메시지는 길이만 | Tail/Logpush 평문 PII 차단 |
| D10 | 메일 평문 = layout JSON-LD/site.ts 제거, /privacy만 "문의 양식" 안내 | 봇 스크래핑 표적 제거, 법규 충족 |
| D11 | Resend 사용 범위 = **운영 알람 단일 채널**, API Key 1개, 도메인 `mail.firstfluke.com` 공유 | Resend 무료 한도 안에서 firstfluke 그룹 모든 솔루션 향후 공유 가능 |
| D12 | 런타임 = **Wrangler ≥ 4.36.0**, `compatibility_flags = ["nodejs_compat"]` | Rate Limiting binding GA 요건 + jose 안정 동작 |

> 검증 출처: [Cloudflare Rate Limiting GA changelog (2025-09-19)](https://developers.cloudflare.com/changelog/post/2025-09-19-ratelimit-workers-ga/), [`panva/jose`](https://github.com/panva/jose), [`gr2m/cloudflare-worker-github-app-example`](https://github.com/gr2m/cloudflare-worker-github-app-example), [Resend pricing](https://resend.com/pricing).

---

## 3. 진행 상태 (T-01 ~ T-19)

| ID | 제목 | 담당 | 우선 | 상태 |
|---|---|---|---|---|
| T-01 | ADR 0001 — Contact routing architecture (final) | architecture | P0 | ⬜ Todo |
| T-02 | Product SSOT (`apps/web/lib/contact/products.ts`) | backend | P0 | ⬜ Todo |
| T-03 | 환경변수/시크릿 매트릭스 문서 (`apps/web/worker/SECRETS.md`) | architecture | P0 | ⬜ Todo |
| T-04 | FE schema 확장 (`product` enum 추가) | frontend | P0 | ⬜ Todo |
| T-05 | Worker schema 동기화 | backend | P0 | ⬜ Todo |
| T-06 | shadcn/ui Select 도입 (`pnpm dlx shadcn@latest add select`) | frontend | P0 | ⬜ Todo |
| T-07 | ContactForm 드롭다운 통합 | frontend | P0 | ⬜ Todo |
| T-08 | GitHub App 인증 모듈 (`worker/src/github-app.ts`, `jose`) | backend | P0 | ⬜ Todo |
| T-09 | Product → Route 리졸버 (`worker/src/routes.ts`) | backend | P0 | ⬜ Todo |
| T-10 | Turnstile siteverify (`worker/src/turnstile.ts`) | backend | P1 | ⬜ Todo |
| T-11 | CF Rate Limiting binding 적용 | backend | P1 | ⬜ Todo |
| T-12 | Worker 메인 (`worker/src/index.ts`): issue + retry + dead-letter + 이스케이프 + PII 마스킹 | backend | P0 | ⬜ Todo |
| T-13 | Cron Worker (`worker/src/cron.ts`) — 5분 폴링·재시도·24h 운영자 알람 | backend | P0 | ⬜ Todo |
| T-14 | `apps/web/app/api/contact/route.ts` 삭제 (SSOT 통일) | architecture | P1 | ⬜ Todo |
| T-15 | GitHub App 등록·배포·owner 요청 SOP | architecture | P0 | ✅ **Done** ([docs/ops/github-app-setup.md](docs/ops/github-app-setup.md)) |
| T-16 | Resend 운영 알람 SOP (`docs/ops/resend-setup.md`) | architecture | P1 | ⬜ Todo |
| T-17 | Cloudflare KV/secrets/ratelimits/cron 프로비저닝 | tf-infra | P0 | ⬜ Todo |
| T-18 | 메일 평문 차폐 (`layout.tsx` JSON-LD, `lib/site.ts`, `/privacy`) | frontend | P0 | ✅ **Done** (`our.first.fluke` 빌드 산출물 0건 검증 완료) |
| T-19 | 단위·통합 테스트 + 보안 점검 (Miniflare 포함) | qa | P1 | ⬜ Todo |

---

## 4. 지금까지 완료된 변경 (파일 단위)

### T-18 — 메일 평문 차폐 (배포 시 효과 발생)

| 파일 | 변경 |
|---|---|
| [apps/web/app/layout.tsx](apps/web/app/layout.tsx) | `ORGANIZATION_JSONLD`에서 `email` 필드 제거 (모든 페이지 `<head>`의 JSON-LD에서 평문 사라짐) |
| [apps/web/lib/site.ts](apps/web/lib/site.ts) | `SITE.email` dead 필드 제거 |
| [apps/web/app/privacy/page.tsx](apps/web/app/privacy/page.tsx) | 6번 항목 메일 안내 → "홈 화면 하단 'Contact' 섹션 문의 양식". 7번 항목 "이메일: ..." → "직책: 대표 / 연락 채널: 문의 양식" (개인정보 보호책임자 이름은 placeholder, 추후 채워야 함) |

검증:
```bash
grep -r "our\.first\.fluke\|@gmail\|mailto:" apps/web/app apps/web/components apps/web/lib apps/web/public
# 결과: 0건
cd apps/web && rm -rf out .next && pnpm build
# ✓ Compiled successfully, 정적 7페이지, out/에서 our.first.fluke 검색 0건 확인됨
```

### T-15 — GitHub App SOP 작성

[docs/ops/github-app-setup.md](docs/ops/github-app-setup.md) — 11단계 + 5개 트러블슈팅. 핵심:
- 단계 4 **PKCS#1 → PKCS#8 변환** (`openssl pkcs8 -topk8`) — 누락 시 100% 인증 실패
- 단계 8 owner 협조 메시지 복붙 템플릿
- 단계 10: 일부 owner 응답 안 와도 dead-letter로 자동 처리 + 추후 코드 변경 0

### 플랜 문서 갱신 (rev3)

| 파일 | 상태 |
|---|---|
| [.agents/results/plan-2026-05-10-contact-solution-routing.json](.agents/results/plan-2026-05-10-contact-solution-routing.json) | rev3 (D1~D12, R1~R8, T-01~T-19, executionOrder) |
| [.agents/results/current-plan.md](.agents/results/current-plan.md) | 사람-읽기용 요약 |

---

## 5. 앞으로 할 일 — 두 트랙 병렬

### 🧑 트랙 A — 운영자가 직접 (코드 X)

[docs/ops/github-app-setup.md](docs/ops/github-app-setup.md) 따라 진행. 대략 10~15분.

- [ ] 단계 1: GitHub App `firstfluke-contact-bot` 등록 (Permissions: Issues Write + Metadata Read, Webhook off, Any account)
- [ ] 단계 2: App ID 메모
- [ ] 단계 3: Private key `.pem` 다운로드
- [ ] 단계 4: ⚠ **PKCS#8 변환** (`openssl pkcs8 -topk8 ...`)
- [ ] 단계 5: `wrangler secret put GH_APP_PRIVATE_KEY` (변환된 PKCS#8 파일)
- [ ] 단계 6: `wrangler.toml` `[vars]`에 `GH_APP_ID`, `RESEND_FROM`, `OPS_ALERT_TO` 추가
- [ ] 단계 7: 본인 소유 private repo 1개에 install → INSTALLATION_ID 메모 (e2e 검증용)
- [ ] 단계 8: 7개 product owner들에게 install 요청 메시지 발송 (응답 비동기 진행 가능)
- [ ] 단계 9: 회신 받은 INSTALLATION_ID들로 `PRODUCT_ROUTES` 작성 + 등록
- [ ] Resend 도메인 `mail.firstfluke.com` Verified 확인 (이미 OK 확인됨), API Key 1개 발급(`firstfluke-ops-alert`) → `wrangler secret put RESEND_API_KEY`

### 🤖 트랙 B — 코드 작업 (개발자/AI)

권장 실행 순서 (Tier별 병렬 가능):

**Tier 1 (병렬)** — SSOT·UI 키트
- [ ] **T-02** `apps/web/lib/contact/products.ts` 신규 — `PRODUCT_IDS` const tuple, `PRODUCT_LABELS` 한글 매핑, `ProductId` type
- [ ] **T-06** `pnpm dlx shadcn@latest add select` (apps/web 기준) — 디자인 토큰 매핑

**Tier 2 (T-02 후)** — 스키마 + 폼
- [ ] **T-04** `apps/web/lib/contact/schema.ts`에 `product: z.enum(PRODUCT_IDS)` 추가 (필수)
- [ ] **T-05** `apps/web/worker/src/schema.ts` 동기화 (FE 모듈 import 또는 빌드 시 복사)
- [ ] **T-07** `apps/web/components/site/contact-form.tsx`에 product Select 통합 (라벨 "문의 종류", aria-describedby, motion 스태거)

**Tier 3 (병렬)** — Worker 모듈 4개
- [ ] **T-08** `worker/src/github-app.ts` — `pnpm add jose`, `wrangler.toml`에 `compatibility_flags=["nodejs_compat"]` + `importPKCS8` + `SignJWT(RS256)` + installation token 교환 + `TOKEN_CACHE` KV 캐시 (TTL 50분)
- [ ] **T-09** `worker/src/routes.ts` — `env.PRODUCT_ROUTES` JSON 파싱 + zod 검증 + `resolveRoute(productId)`
- [ ] **T-10** `worker/src/turnstile.ts` — siteverify, secret 미설정 시 grace skip
- [ ] **T-11** `wrangler.toml`에 `[[ratelimits]]` 2개 (BURST 5/60s, DAILY 30/86400s) + handler에서 `env.RATE_LIMIT_BURST.limit({ key: \`${ip}:${product}\` })`

**Tier 4** — Worker 핸들러 통합
- [ ] **T-12** `worker/src/index.ts` 재작성 — CORS → method → JSON → zod → honeypot → turnstile → ratelimit → resolveRoute → `createIssue` (retry 3회 backoff 200ms/1s/5s) → 실패 시 `DEAD_LETTER` KV put `{ id: ulid, payload, attempts, firstFailedAt }` → 항상 200. Issue body는 코드펜스 wrap + product 라벨/repo URL. console.info에는 `emailHash`(SHA-256 12자) + `messageLength`만.

**Tier 5** — Cron + 레거시 정리
- [ ] **T-13** `worker/src/cron.ts` (또는 동일 worker `scheduled`) — `[triggers] crons = ["*/5 * * * *"]`. KV list → 재시도 → 성공 시 delete, 실패 시 `attempts++`. `firstFailedAt` 24h+ & `alertedAt` 미존재 → Resend로 `OPS_ALERT_TO`에 단발 메일 → `alertedAt` 기록 (24h 단위 재알람)
- [ ] **T-14** `apps/web/app/api/contact/route.ts` 삭제, `contact-form.tsx`의 endpoint default를 Worker URL로 통일

**Tier 6** — 검증
- [ ] **T-19** vitest (schema, routes, turnstile mock, ratelimit mock, github-app token cache) + Miniflare 통합 (happy path, GitHub 5xx → KV dead-letter, Cron이 큐 처리, 24h+ → ops-alert 1회) + 보안 체크리스트 5개 (PII 평문 0, Issue body 인젝션 차단, CORS allowlist, PRODUCT_ROUTES 안전 파싱, env fail-fast)

### 운영 SOP 추가 (트랙 A·B 어디든)
- [ ] **T-01** `docs/adr/0001-contact-routing.md` — D1~D12 동결 + 검증 출처
- [ ] **T-03** `apps/web/worker/SECRETS.md` — 환경변수 매트릭스 문서
- [ ] **T-16** `docs/ops/resend-setup.md` — API Key 1개 발급, ops-alert 운영 절차

---

## 6. 환경변수 매트릭스 (Cloudflare Worker)

### `[vars]` (`apps/web/worker/wrangler.toml`)

| 변수 | 예시 |
|---|---|
| `ALLOWED_ORIGINS` | `https://firstfluke.com,https://www.firstfluke.com,http://localhost:3000` |
| `RESEND_FROM` | `FIRST FLUKE <contact@mail.firstfluke.com>` |
| `OPS_ALERT_TO` | `our.first.fluke@gmail.com` |
| `GH_APP_ID` | (단계 2에서 확인한 App ID 숫자) |
| `PRODUCT_ROUTES` | JSON: `{ [productId]: { repo: "owner/name", installationId: "..." } }` × 7 |

### secrets (`wrangler secret put`)

| 시크릿 | 비고 |
|---|---|
| `GH_APP_PRIVATE_KEY` | **PKCS#8 변환된 PEM** (필수) |
| `RESEND_API_KEY` | 운영 알람 전용 |
| `TURNSTILE_SECRET_KEY` | 옵션 (없으면 grace skip) |

### KV bindings

| Binding | 용도 | TTL |
|---|---|---|
| `TOKEN_CACHE` | GitHub App installation token 캐시 | 50분 |
| `DEAD_LETTER` | issue 생성 실패 페이로드 | 영구 (Cron이 정리) |

### Rate Limiting bindings (`[[ratelimits]]`)

| Binding | 정책 |
|---|---|
| `RATE_LIMIT_BURST` | `simple = { limit = 5, period = 60 }` |
| `RATE_LIMIT_DAILY` | `simple = { limit = 30, period = 86400 }` |

### Cron Triggers

```toml
[triggers]
crons = ["*/5 * * * *"]
```

### Compatibility flags

```toml
compatibility_flags = ["nodejs_compat"]
```

### Wrangler 버전

`>= 4.36.0` — `npx wrangler --version`으로 확인.

---

## 7. API 계약 — `POST https://<worker-host>/`

```jsonc
// Request
{
  "email": "string (RFC 5322), 1..254",
  "message": "string, 1..5000",
  "agree": true,
  "product": "oma | place-haejo | contents-haejo | shopzy | curate-ai | prompt-ops | legalize-kr",
  "turnstileToken": "string?",
  "_hp": "string (honeypot, must be empty)"
}

// Responses
200: { "ok": true }                                  // 즉시 성공 또는 dead-letter 큐 적재
400: { "ok": false, "error": "validation", "fields": ... }
401: { "ok": false, "error": "turnstile_failed" }
422: { "ok": false, "error": "unknown_product" }     // PRODUCT_ROUTES 매핑 누락
429: { "ok": false, "error": "rate_limit" }
502: { "ok": false, "error": "queue_unavailable" }   // KV write조차 실패한 극단 케이스만
```

---

## 8. 리스크 & 완화

| ID | 심각도 | 내용 | 완화책 |
|---|---|---|---|
| R1 | HIGH | 잘못된 repo 라우팅 → 정보 노출 (특히 public repo) | Zod enum + Worker-only resolver + 422 + private repo만 등록 정책 |
| R2 | HIGH | PKCS#1 → PKCS#8 변환 누락 시 100% 인증 실패 | T-15 SOP 단계 4 핵심 체크리스트 |
| R3 | MED | GitHub API 일시 장애·네트워크 글리치 | retry 3회 + KV dead-letter + 5분 Cron + 24h 운영자 알람 |
| R4 | MED | 봇 스팸 (특정 product 집중) | Turnstile + Honeypot + ratelimit `${ip}:${product}` |
| R5 | MED | 사용자 메시지의 마크다운/HTML 인젝션 | 코드펜스 wrap + ZWSP escape |
| R6 | MED | layout JSON-LD에 메일 평문 노출 | T-18 완료 — 빌드 산출물 0건 검증 |
| R7 | LOW | Cron 자체 실패 | KV dead-letter 영구 보존, 주간 운영 점검 |
| R8 | LOW | 사용자가 product 잘못 선택 | labels로 식별 + GitHub issue transfer |

---

## 9. 검증 체크리스트 (배포 전)

- [ ] 7개 product 각각으로 폼 제출 시 해당 repo에 issue 생성 (e2e)
- [ ] GitHub API 5xx 모킹 시 KV dead-letter 적재 + 사용자에게 200
- [ ] Cron이 5분 후 재시도 → 성공 시 KV에서 삭제
- [ ] 24h 임계 도달 시 `OPS_ALERT_TO`에 메일 1통, 24h 단위 재알람
- [ ] honeypot 값 채워진 페이로드 → 200으로 silently drop
- [ ] Turnstile 토큰 누락 → 401 (secret 등록 후)
- [ ] ratelimit BURST/DAILY 초과 → 429
- [ ] PRODUCT_ROUTES 매핑 누락 → 422
- [ ] CORS allowlist 외 origin → preflight 거부
- [ ] Worker tail 로그에 평문 이메일 0건 (해시만)
- [ ] Issue body에 백틱·HTML·이미지 태그가 escape됨
- [ ] 사이트 빌드 산출물에서 `our.first.fluke` 검색 0건 (현재 ✅)
- [ ] schema.org Organization JSON-LD validator 통과 (email 필드 제거 후)
- [ ] `/privacy` 페이지의 보호책임자 이름 placeholder를 실제 이름으로 채움 (법규)

---

## 10. 미해결 항목

1. **product owner들의 install 협조 여부** — 일부 거절 시 해당 product만 dead-letter에 적재 유지(코드 변경 0). 추후 회신 시 `PRODUCT_ROUTES`에 항목 추가.
2. **개인정보 보호책임자 이름** — `apps/web/app/privacy/page.tsx` 7번 항목에 현재 직책만 표시. 실명 추가 필요.
3. **Cron 주기** — 5분 권장, 운영 부하 보고 1분/15분 조정 가능.
4. **Resend 무료 한도 초과 시점** — 7개 솔루션 향후 확장 시점에 재평가 (월 3,000건/일 100건). 운영 알람만 쓰면 거의 0건.

---

## 11. 참고 자료

- [Cloudflare Rate Limiting in Workers — GA changelog (2025-09-19)](https://developers.cloudflare.com/changelog/post/2025-09-19-ratelimit-workers-ga/)
- [Cloudflare Workers Rate Limiting binding 문서](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [`panva/jose` (JWT for Workers)](https://github.com/panva/jose)
- [`gr2m/cloudflare-worker-github-app-example`](https://github.com/gr2m/cloudflare-worker-github-app-example) — canonical 레퍼런스
- [GitHub Docs — Generating an installation access token](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/)
- [Resend pricing](https://resend.com/pricing)
- [Resend — Create API key](https://resend.com/docs/api-reference/api-keys/create-api-key)

---

## 12. 변경 이력

| 날짜 | 리비전 | 요약 |
|---|---|---|
| 2026-05-10 | rev1 | Next.js api route + 단일 PAT (폐기) |
| 2026-05-10 | rev2 | App + 솔루션별 Resend 듀얼 채널 (폐기) |
| 2026-05-10 | **rev3 (현재)** | GitHub App via jose + Worker 단일 + Issue 단일 + retry/KV dead-letter/Cron + Resend ops-alert only. 검증 완료. |

---

## 13. 인계받는 분에게 한 마디

- **트랙 A (운영자 작업)와 트랙 B (코드)는 병렬 진행 가능**합니다. 트랙 A의 단계 1~7만 끝나도 본인 레포로 e2e 1회 가능. owner 협조(단계 8~9)는 비동기로 받아도 됨.
- **PKCS#8 변환 (T-15 단계 4)** 만 안 빠뜨리면 GitHub App 인증은 그냥 동작합니다. 디버깅 시간 가장 많이 잡아먹는 함정.
- **사용자 응답은 항상 200**이 정상 (큐 적재 포함). 4xx/5xx는 검증·인증·인프라 실패 케이스만.
- 운영 알람 메일이 들어오면 KV `DEAD_LETTER`에 24h 이상 잔류한 항목이 있다는 뜻 → GitHub API 또는 매핑을 손봐야 함.
- 질문/막힘은 [.agents/results/plan-2026-05-10-contact-solution-routing.json](.agents/results/plan-2026-05-10-contact-solution-routing.json) 의 `decisions[]` / `risks[]` 섹션에 답이 있을 가능성이 큽니다.
