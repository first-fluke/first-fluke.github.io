# Contact Routing 보안 감사 — 2026-05-10

> 감사 대상: `apps/web/worker/src/{index,github-app,routes,turnstile,ratelimit,schema}.ts` (rev3 구현)
> 감사 기준: ADR 0001 D8(인젝션), D9(PII), 플랜 R1~R8, OWASP 일반
> 결과 요약: **5/5 섹션 PASS** — CRITICAL 0, HIGH 0, MEDIUM 1, LOW 2

| # | 섹션 | 결과 |
|---|---|---|
| 1 | PII 평문 로그 | PASS |
| 2 | Issue body 마크다운/HTML 인젝션 | PASS |
| 3 | CORS allowlist | PASS (LOW 권고 1건) |
| 4 | PRODUCT_ROUTES 안전 파싱 | PASS |
| 5 | 환경변수 fail-fast | PASS (MEDIUM 1건 + LOW 1건) |

---

## 1. PII 평문 로그 (D9)

### Findings — PASS
- `index.ts:16` 헤더 주석에 PII 정책 명시: "logs contain ONLY sha256-12 of email and message length".
- `index.ts:400` — `sha256Hex(email).slice(0, 12)`로 `emailHash` 생성, 모든 `console.*` 호출에 이 해시만 전달.
- `index.ts:404~410` 메인 요청 로그: `{ requestId, product, emailHash, messageLength, ip: "masked" }` — email/message/ip 평문 0건.
- `index.ts:155` cron 알람 메일 본문: `"PII (D9): email hash = ${emailHash}, message length = ${entry.payload.message.length}"` — 운영자에게 보내는 메일조차 PII 평문 미포함.
- `turnstile.ts:38, 80`, `index.ts:134~534`의 모든 `console.error`/`warn`/`info` 호출을 `Grep`으로 전수 확인 — `email`/`message` 평문이 인자로 전달되는 케이스 0건.

### Severity
**LOW** — D9 정책이 코드 + 정책 주석으로 일관되게 적용되어 있음. 단, `payload.email` 자체가 `entry.payload`로 KV(`DEAD_LETTER`)에 평문 저장되는 점은 의도된 설계(재시도/알람 시 이메일 필요). KV는 Cloudflare 인프라 내부에 머무르며 외부 로그 파이프라인(Logpush/Tail)에 노출되지 않음.

### Remediation
조치 불필요. 현재 구현은 D9를 충족.

---

## 2. Issue body 마크다운/HTML 인젝션 (D8)

### Findings — PASS
- `index.ts:71~74` `escapeBackticks(s)` — `/\`{3,}/g` 매치한 백틱 시퀀스 사이에 `\u200B`(ZWSP) 삽입. 사용자가 `` ``` `` 또는 더 긴 백틱 시퀀스를 입력해도 코드펜스 탈출 불가.
- `index.ts:103~105` 사용자 메시지를 `` ```text ... ``` `` 펜스로 감쌈 — fenced code block 안의 마크다운/HTML/이미지 태그는 GitHub 렌더러가 모두 평문으로 출력.
- 입력 케이스별 분석:
  - `<script>alert(1)</script>` → 코드펜스 안에서 평문 표시. JS 실행 X.
  - `<img src="https://evil/p.png" />` → 외부 픽셀 로드 X (코드펜스 안에서 평문).
  - `` ``` ``` `` (3+ 백틱) → ZWSP 삽입으로 펜스 탈출 X.
  - `[link](javascript:alert(1))` → 마크다운 링크 X (코드펜스 안에서 평문).

### Severity
**LOW** — D8 sanitisation이 정상 동작.

### Remediation
조치 불필요. 단위 테스트로 백틱·HTML·이미지 인젝션 케이스가 escape 되는지 검증하는 fixture 추가 권장 (T-19 후속).

---

## 3. CORS allowlist

### Findings — PASS (LOW 권고)
- `index.ts:32~42` `corsHeaders(origin, allowList)`:
  - `origin && allowList.includes(origin)` 일 때 echo, 아니면 `allowList[0] ?? "*"`로 fallback.
  - 허용되지 않은 origin은 verbatim echo 되지 않음 — fallback이 첫 allowList 항목으로 강제됨.
- 통합 테스트 `integration.test.ts > "OPTIONS preflight"` — `Origin: https://firstfluke.com` 요청에 대해 `Access-Control-Allow-Origin: https://firstfluke.com` 응답 확인.

### Concern (LOW)
- `allowList[0] ?? "*"` fallback이 **`allowList`가 빈 배열이면 `*`**로 떨어짐. `wrangler.toml`의 `ALLOWED_ORIGINS`가 빈 문자열이면 모든 origin 허용 상태가 됨.

### Remediation (LOW)
```ts
// 현재
const allowed = origin && allowList.includes(origin) ? origin : (allowList[0] ?? "*");

// 권장: allowList 비어있으면 echo 거부 (Origin 헤더 자체 미설정)
const allowed = origin && allowList.includes(origin) ? origin : allowList[0];
// allowed가 undefined면 cors 객체에서 그 키를 빼거나 빈 문자열 — 결과적으로 브라우저가 차단
```
또는 deploy 시 `ALLOWED_ORIGINS` 비어있으면 `provision.sh`가 fail-fast.

---

## 4. PRODUCT_ROUTES 안전 파싱

### Findings — PASS
- `routes.ts:51~57` `JSON.parse(trimmed)` 만 사용. `eval`/`Function`/`new Function` 없음.
- `routes.ts:27~30` zod 스키마(`ProductRoutesSchema`)로 `repo` (regex `^[^/\s]+\/[^/\s]+$`)와 `installationId` (regex `^\d+$`) 검증.
- `routes.ts:25` `.strict()` — 허용된 PRODUCT_IDS 외 키가 들어오면 거부.
- `Grep "eval\|new Function" worker/src/` → 매치 0건.

### Severity
**해당 없음** — 안전.

### Remediation
조치 불필요.

---

## 5. 환경변수 fail-fast

### Findings — PASS (MEDIUM 1건 + LOW 1건)

| 환경변수 | 누락 시 동작 | 평가 |
|---|---|---|
| `GH_APP_PRIVATE_KEY` | `importPKCS8` 호출에서 throw → handler가 catch → DLQ로 폴백 + 200 | OK |
| `GH_APP_ID` | `JWT.iss = ""` 로 발급 시도 → GitHub 401 → 캐시 무효화 + DLQ 폴백 | **MEDIUM**: GitHub API 호출 비용을 낭비. 사전 fail-fast 권장 |
| `PRODUCT_ROUTES` | 빈 문자열 → 빈 객체 반환 → `resolveRoute` null → 422 unknown_product | OK (의도된 동작) |
| `RESEND_API_KEY` (cron) | `console.error` 후 알람 미발송, Worker 살아있음 | OK (D11 정책) |
| `TURNSTILE_SECRET_KEY` | grace skip + 1회 warn | OK (D7) |
| `TOKEN_CACHE` / `DEAD_LETTER` KV | 미바인딩 시 wrangler가 deploy 거부 | OK (인프라 레벨) |
| `RATE_LIMIT_BURST` / `RATE_LIMIT_DAILY` | 미바인딩 시 wrangler가 deploy 거부 | OK |

### Concern 1 (MEDIUM): `GH_APP_ID` 미설정 시 GitHub API에 빈 iss로 호출
- 위치: `github-app.ts:51`, 호출 경로 `index.ts:472` createIssue 시도.
- 영향: 사용자 응답 200은 보장되지만 매 요청마다 GitHub `/access_tokens` API에 의미 없는 호출 → 401 → DLQ로 적재 → cron이 5분마다 재시도 → 24h 후 운영자 알람.
- **Remediation**:
  ```ts
  // index.ts 핸들러 진입부 또는 createIssue 직전에 추가
  if (!env.GH_APP_ID || !env.GH_APP_PRIVATE_KEY || !env.PRODUCT_ROUTES) {
    console.error("[contact] required GitHub App env missing", {
      requestId,
      hasAppId: Boolean(env.GH_APP_ID),
      hasPrivateKey: Boolean(env.GH_APP_PRIVATE_KEY),
      hasRoutes: Boolean(env.PRODUCT_ROUTES),
    });
    // dead-letter로 직행 (createIssue 호출 자체를 건너뜀)
  }
  ```

### Concern 2 (LOW): `ALLOWED_ORIGINS` 빈 문자열 시 wildcard
- 위치: `index.ts:34`. 위 §3에서 동일 사항 — 함께 픽스 권장.

### Remediation Priority
- 배포 전: §5 Concern 1을 핸들러 진입부 가드로 추가하면 GitHub API 비용 + 운영 노이즈 감소.
- 사후 처리 가능: §3 / §5 Concern 2.

---

## 종합 권고

### 즉시 조치 (배포 전)
1. **MEDIUM**: `index.ts` 핸들러 진입부에 GitHub App 필수 env 가드 추가 — 1시간 미만 작업.

### 배포 후 후속
1. **LOW**: CORS allowlist 빈 배열 시 wildcard fallback 제거.
2. **LOW**: `escapeBackticks` 단위 테스트에 fixture 5개 추가 (백틱·HTML·이미지·링크·zalgo).

### 합격 판정
배포 가능 (MEDIUM 1건은 권고이며 차단 사유 아님). CRITICAL/HIGH 없음.
