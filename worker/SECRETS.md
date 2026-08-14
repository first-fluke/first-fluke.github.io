# firstfluke-contact Worker — 환경변수 · 시크릿 · 바인딩 레퍼런스

이 문서는 **신규 운영자가 이 문서만 보고 `firstfluke-contact` Worker를 배포·운영**할 수 있도록 모든 설정 항목을 한 곳에 정리한다. 변수(`[vars]`)는 `wrangler.toml`에 평문으로 기입하고, 시크릿은 반드시 `wrangler secret put` CLI로만 등록한다. KV namespace와 Rate Limiting binding은 아래 명령 시퀀스를 순서대로 실행해야 활성화된다.

> **역할 (design 013 Phase 4 이후)**
> 이 Worker는 **엣지 방어 + 재시도 그물망**만 담당한다. CORS · honeypot · Turnstile · rate limit을 통과한 요청을 dahaejo 플랫폼의 ingest API(`POST /v1/support/inquiries`)로 넘기고, 그쪽이 authoritative row(`public.support_inquiries`)와 GitHub Issue(best-effort)를 모두 소유한다.
> Worker가 직접 GitHub Issue를 만들던 시절의 GitHub App 인증(`GH_APP_ID` / `GH_APP_PRIVATE_KEY` / `TOKEN_CACHE`)과 product→repo 라우팅(`PRODUCT_ROUTES`)은 **전부 제거되었다.** product별 라우팅은 이제 API의 `support_products` 테이블이 해결한다.

---

## 1. `[vars]` — wrangler.toml 기입 항목

| 변수 | 타입 | 예시 | 설명 |
|---|---|---|---|
| `ALLOWED_ORIGINS` | `string` (콤마 구분) | `https://firstfluke.com,https://www.firstfluke.com,http://localhost:3000` | Worker가 허용하는 CORS origin 목록. 미설정 시 wildcard로 떨어지지 않고 `Access-Control-Allow-Origin` 자체를 생략하여 브라우저가 차단 |
| `RESEND_FROM` | `string` | `FIRST FLUKE <contact@mail.firstfluke.com>` | 운영자 알람 메일의 발신자 (Resend verified 도메인) |
| `INGEST_API_URL` | `string` | `https://haejo-api.firstfluke.com/v1/support/inquiries` | dahaejo ingest API 엔드포인트. 미설정 시 요청이 502 `queue_unavailable`로 fail-fast |

---

## 2. Secrets — CLI 전용 등록 항목

| secret | 필수여부 | 설명 |
|---|---|---|
| `SUPPORT_INGEST_SECRET` | **필수** | ingest API의 `X-Internal-Secret` 게이트용 전용 시크릿. API쪽 `settings.SUPPORT_INGEST_SECRET`과 **정확히 일치**해야 한다. api↔worker 내부 RPC용 `INTERNAL_API_SECRET`과 **다른 값** — Worker가 털려도 피해 범위가 "가짜 문의 제출"로 한정된다. 미설정 시 502 `queue_unavailable` |
| `OPS_ALERT_TO` | **필수** | dead-letter 24h 임계 알람을 받을 운영자 이메일 (PII이므로 vars가 아닌 secret) |
| `RESEND_API_KEY` | **필수** | Resend API Key (`re_...`). `firstfluke-ops-alert` 전용 키, Sending access만 부여. 미설정 시 dead-letter 알람만 스킵되고 본 파이프라인은 정상 동작 |
| `TURNSTILE_SECRET_KEY` | 선택 | Cloudflare Turnstile site secret. 미설정 시 검증을 grace skip하고 `console.warn` 1회 출력 (개발·스테이징 환경용) |

---

## 3. KV Bindings

| binding 이름 | 용도 | TTL 정책 |
|---|---|---|
| `DEAD_LETTER` | ingest API POST 3회 실패 시 페이로드 영구 적재 | TTL 없음 (영구 보존) — Cron이 폴링·재시도 후 성공 시 `kv.delete` |

`wrangler.toml` 기입 예시:

```toml
[[kv_namespaces]]
binding = "DEAD_LETTER"
id = "<DEAD_LETTER_KV_ID>"
```

---

## 4. Rate Limiting Bindings (`[[ratelimits]]`)

| binding 이름 | 제한 | period | key 패턴 | 설명 |
|---|---|---|---|---|
| `RATE_LIMIT_BURST` | 5 req | 60s | `${ip}:${product}` | 동일 IP·product 짧은 버스트 차단 |
| `RATE_LIMIT_DAILY` | 30 req | 60s | `${ip}:${product}` | 보조 분당 가드. **진짜 30req/day 상한은 Worker 코드의 KV 카운터가 강제** (wrangler `simple.period`는 10 또는 60만 허용) |

`wrangler.toml` 기입 예시:

```toml
[[ratelimits]]
name = "RATE_LIMIT_BURST"
namespace_id = "1001"
simple = { limit = 5, period = 60 }

[[ratelimits]]
name = "RATE_LIMIT_DAILY"
namespace_id = "1002"
simple = { limit = 30, period = 60 }
```

> wrangler >= 4.36 부터 `[[ratelimits]]`는 `binding`이 아닌 **`name`** 키를 쓴다. `namespace_id`는 계정 범위에서 유일하기만 하면 되는 임의의 정수 문자열이며 시크릿이 아니다.

---

## 5. Cron Triggers

```toml
[triggers]
crons = ["*/5 * * * *"]
```

5분마다 `scheduled` handler가 실행되어 `DEAD_LETTER` KV를 폴링·재시도하고, `firstFailedAt` 기준 24h 초과 항목에 운영자 알람을 발송한다. 재시도는 엔트리 `id`를 `source_ref`로 재사용하므로 API가 멱등 처리한다 — 중복 삽입이 발생하지 않는다.

4xx(429 제외) 응답은 영구 오류로 간주하여 엔트리를 드롭한다. 5xx / 429 / 네트워크 오류만 계속 재큐잉된다.

---

## 6. Wrangler / Runtime 요건

| 항목 | 요구 버전/값 | 비고 |
|---|---|---|
| `wrangler` | `>= 4.36.0` | `[[ratelimits]]` 블록 GA 요건 (2025-09-19) |
| `compatibility_date` | `2025-05-01` 이상 | — |
| `compatibility_flags` | `["nodejs_compat"]` | — |

---

## 7. Wrangler 명령 시퀀스

아래 명령을 **순서대로** 실행한다. `worker/` 디렉토리 기준.

```bash
# 1. KV namespace 생성 (출력된 id를 wrangler.toml에 기입)
wrangler kv namespace create DEAD_LETTER

# 2. Secrets 등록 (interactive prompt로 값 입력)
wrangler secret put SUPPORT_INGEST_SECRET   # API의 동일 시크릿과 일치해야 함
wrangler secret put OPS_ALERT_TO
wrangler secret put RESEND_API_KEY
wrangler secret put TURNSTILE_SECRET_KEY    # 선택 — 스킵하려면 Enter → empty

# 3. wrangler.toml에 vars 기입 (평문 — 시크릿 아님)
#    ALLOWED_ORIGINS, RESEND_FROM, INGEST_API_URL

# 4. 배포
wrangler deploy
```

> **vars는 wrangler.toml에, secrets는 CLI로만.** `wrangler.toml`에 시크릿 값을 직접 기입하지 않는다.

---

## 8. Product 카탈로그

product 목록의 SSOT는 두 곳이며 **site가 API의 부분집합이어야 한다.**

| 계층 | 위치 | 역할 |
|---|---|---|
| 폼 / Worker 검증 | `lib/contact/products.ts` `PRODUCT_IDS` | 드롭다운 옵션 + zod enum (사이트와 Worker가 같은 파일을 공유) |
| 라우팅 / 브랜딩 | dahaejo `public.support_products` | slug → label / service / 답변 envelope. **여기 없는 slug는 API가 422로 거부** |

전 product의 문의는 **`first-fluke/dahaejo` 한 repo**에 쌓이고, 구분은 GitHub 라벨 `contact` + `<slug>`로만 한다. product별 repo 분기는 존재하지 않는다 (API의 `GITHUB_INQUIRY_REPO_OWNER` / `GITHUB_INQUIRY_REPO_NAME` 고정값).

현재 slug: `place-haejo`, `contents-haejo`, `legalize-kr`, `shopzy`, `etc`

> **product 추가 시 순서를 지킬 것.** `support_products`에 row를 먼저 넣고, 그다음 `PRODUCT_IDS`에 추가한다. 순서를 뒤집으면 그 사이 제출된 문의는 API가 422를 반환하고 Worker가 영구 오류로 판단해 **재시도도 dead-letter도 없이 유실된다.** (`oma`가 실제로 이 상태였다.)

---

## 9. 최초 배포 체크리스트

1. `wrangler --version` 출력이 `4.36.0` 이상인지 확인
2. `wrangler kv namespace create DEAD_LETTER` 실행 후 출력된 id를 `wrangler.toml`에 기입
3. `wrangler.toml`에 `compatibility_flags = ["nodejs_compat"]`, `[[ratelimits]]` 2개, `[triggers]` crons 확인
4. `wrangler secret put SUPPORT_INGEST_SECRET` — dahaejo API에 설정된 값과 동일하게
5. `wrangler secret put OPS_ALERT_TO` / `RESEND_API_KEY` 등록
6. `wrangler secret put TURNSTILE_SECRET_KEY` 등록 (개발 단계라면 스킵 가능)
7. `wrangler deploy` 실행 후 배포 URL 확인
8. 사이트 `.env`의 `NEXT_PUBLIC_CONTACT_API_URL`을 배포 URL로 설정
9. 헬스체크:
   ```bash
   curl -X POST <worker-url> \
     -H 'Content-Type: application/json' \
     -d '{"email":"test@example.com","message":"hello","agree":true,"product":"etc","_hp":""}'
   ```
   `{"ok":true}` 또는 `turnstile_failed` 응답이면 라우팅·인증 정상. `queue_unavailable`이면 `INGEST_API_URL` / `SUPPORT_INGEST_SECRET` 미설정, `unknown_product`면 `support_products`에 해당 slug 없음.
10. 실제 수신 확인: `wrangler tail firstfluke-contact` 로그 또는 어드민 콘솔 `https://haejo-admin.firstfluke.com/admin/inquiries`
