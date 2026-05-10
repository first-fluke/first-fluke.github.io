# firstfluke-contact Worker — 환경변수 · 시크릿 · 바인딩 레퍼런스

이 문서는 **신규 운영자가 이 문서만 보고 `firstfluke-contact` Worker를 배포·운영**할 수 있도록 모든 설정 항목을 한 곳에 정리한다. 변수(`[vars]`)는 `wrangler.toml`에 평문으로 기입하고, 시크릿은 반드시 `wrangler secret put` CLI로만 등록한다. KV namespace와 Rate Limiting binding은 아래 명령 시퀀스를 순서대로 실행해야 활성화된다.

---

## 1. `[vars]` — wrangler.toml 기입 항목

| 변수 | 타입 | 예시 | 설명 |
|---|---|---|---|
| `ALLOWED_ORIGINS` | `string` (콤마 구분) | `https://firstfluke.com,https://www.firstfluke.com,http://localhost:3000` | Worker가 허용하는 CORS origin 목록 |
| `RESEND_FROM` | `string` | `FIRST FLUKE <contact@mail.firstfluke.com>` | 운영자 알람 메일의 발신자 (Resend verified 도메인) |
| `OPS_ALERT_TO` | `string` | `our.first.fluke@gmail.com` | dead-letter 24h 임계 알람을 받을 운영자 이메일 |
| `GH_APP_ID` | `string` | `"123456"` | GitHub App의 App ID (App 설정 페이지 최상단) |
| `PRODUCT_ROUTES` | `string` (JSON) | 아래 §8 참조 | product slug → repo / installationId 매핑 JSON |

---

## 2. Secrets — CLI 전용 등록 항목

| secret | 필수여부 | 설명 |
|---|---|---|
| `GH_APP_PRIVATE_KEY` | **필수** | GitHub App private key **(PKCS#8 PEM)**. GitHub에서 다운받은 원본은 PKCS#1이므로 반드시 아래 명령으로 변환 후 등록: `openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in app.pem -out app.pkcs8.pem` — 변환 없이 등록하면 Worker WebCrypto가 키를 거부하여 **100% 인증 실패** |
| `RESEND_API_KEY` | **필수** | Resend API Key (`re_...`). `firstfluke-ops-alert` 전용 키, Sending access만 부여 |
| `TURNSTILE_SECRET_KEY` | 선택 | Cloudflare Turnstile site secret. 미설정 시 검증을 grace skip하고 `console.warn` 1회 출력 (개발·스테이징 환경용) |

---

## 3. KV Bindings

| binding 이름 | 용도 | TTL 정책 |
|---|---|---|
| `TOKEN_CACHE` | GitHub App installation token 캐시 | 키 저장 시 `expirationTtl: 3000` (50분) — 토큰 만료 전 자동 삭제 |
| `DEAD_LETTER` | Issue 생성 3회 실패 시 페이로드 영구 적재 | TTL 없음 (영구 보존) — Cron이 폴링·재시도 후 성공 시 `kv.delete` |

`wrangler.toml` 기입 예시:

```toml
[[kv_namespaces]]
binding = "TOKEN_CACHE"
id = "<TOKEN_CACHE_KV_ID>"

[[kv_namespaces]]
binding = "DEAD_LETTER"
id = "<DEAD_LETTER_KV_ID>"
```

---

## 4. Rate Limiting Bindings (`[[ratelimits]]`)

| binding 이름 | 제한 | period | key 패턴 | 설명 |
|---|---|---|---|---|
| `RATE_LIMIT_BURST` | 5 req | 60s | `${ip}:${product}` | 동일 IP·product 짧은 버스트 차단 |
| `RATE_LIMIT_DAILY` | 30 req | 86400s | `${ip}:${product}` | 동일 IP·product 일일 총량 차단 |

`wrangler.toml` 기입 예시:

```toml
[[ratelimits]]
binding = "RATE_LIMIT_BURST"
namespace_id = "<CF_RATELIMIT_NAMESPACE_ID>"
simple = { limit = 5, period = 60 }

[[ratelimits]]
binding = "RATE_LIMIT_DAILY"
namespace_id = "<CF_RATELIMIT_NAMESPACE_ID>"
simple = { limit = 30, period = 86400 }
```

> Rate Limiting binding은 Cloudflare dashboard에서 **Rate Limiting Rule** namespace ID를 발급받아야 한다. Wrangler >= 4.36.0 이상에서만 `[[ratelimits]]` 블록이 지원된다.

---

## 5. Cron Triggers

```toml
[triggers]
crons = ["*/5 * * * *"]
```

5분마다 `scheduled` handler가 실행되어 `DEAD_LETTER` KV를 폴링·재시도하고, `firstFailedAt` 기준 24h 초과 항목에 운영자 알람을 발송한다.

---

## 6. Wrangler / Runtime 요건

| 항목 | 요구 버전/값 | 비고 |
|---|---|---|
| `wrangler` | `>= 4.36.0` | `[[ratelimits]]` 블록 GA 요건 (2025-09-19) |
| `compatibility_date` | `2025-05-01` 이상 | — |
| `compatibility_flags` | `["nodejs_compat"]` | `jose` (RS256 서명) Workers 안정 동작 요건 |

`wrangler.toml` 기입 예시:

```toml
compatibility_date = "2025-05-01"
compatibility_flags = ["nodejs_compat"]
```

---

## 7. Wrangler 명령 시퀀스

아래 명령을 **순서대로** 실행한다. `apps/web/worker/` 디렉토리 기준.

```bash
# 1. KV namespace 생성 (출력된 id를 wrangler.toml에 기입)
wrangler kv:namespace create TOKEN_CACHE
wrangler kv:namespace create DEAD_LETTER

# 2. Secrets 등록 (interactive prompt로 값 입력)
wrangler secret put GH_APP_PRIVATE_KEY   # PKCS#8 변환된 PEM 전체 (헤더·바닥 포함)
wrangler secret put RESEND_API_KEY
wrangler secret put TURNSTILE_SECRET_KEY  # 선택 — 스킵하려면 Enter → empty

# 3. wrangler.toml에 vars 기입 (평문 — 시크릿 아님)
#    ALLOWED_ORIGINS, RESEND_FROM, OPS_ALERT_TO, GH_APP_ID, PRODUCT_ROUTES
#    (편집기로 직접 수정)

# 4. 배포
wrangler deploy
```

> **vars는 wrangler.toml에, secrets는 CLI로만.** `wrangler.toml`에 시크릿 값을 직접 기입하지 않는다.

---

## 8. `PRODUCT_ROUTES` JSON 예시

`wrangler.toml` `[vars]` 섹션에 아래 JSON을 **한 줄 문자열**로 기입한다.

```json
{
  "oma": {
    "repo": "owner/<oma-repo>",
    "installationId": "TODO"
  },
  "place-haejo": {
    "repo": "owner/<place-haejo-repo>",
    "installationId": "TODO"
  },
  "contents-haejo": {
    "repo": "owner/<contents-haejo-repo>",
    "installationId": "TODO"
  },
  "shopzy": {
    "repo": "owner/<shopzy-repo>",
    "installationId": "TODO"
  },
  "curate-ai": {
    "repo": "owner/<curate-ai-repo>",
    "installationId": "TODO"
  },
  "prompt-ops": {
    "repo": "owner/<prompt-ops-repo>",
    "installationId": "TODO"
  },
  "legalize-kr": {
    "repo": "owner/<legalize-kr-repo>",
    "installationId": "TODO"
  }
}
```

`installationId`는 GitHub App을 각 repo의 org/owner가 설치한 후 `https://github.com/settings/apps/<app-name>/installations` 에서 확인한다. owner 미동의 product는 `"TODO"` 상태로 두면 Worker가 422를 반환하고 dead-letter에 자동 적재된다.

---

## 9. 최초 배포 체크리스트

1. `wrangler --version` 출력이 `4.36.0` 이상인지 확인
2. GitHub App을 생성하고 **Permissions: Issues = Write, Metadata = Read** 설정, Webhook 비활성
3. App private key 다운로드 후 **`openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in app.pem -out app.pkcs8.pem`** 변환 실행 (이 단계를 건너뛰면 배포 후 모든 요청이 실패함)
4. 각 product repo owner에게 App install 링크 전달 후 `installationId` 수집
5. `PRODUCT_ROUTES` JSON에 수집한 `installationId` 채우기 (미확보 product는 `"TODO"` 유지)
6. `wrangler kv:namespace create TOKEN_CACHE` 및 `DEAD_LETTER` 실행 후 출력된 id를 `wrangler.toml`에 기입
7. `wrangler.toml`에 `compatibility_flags = ["nodejs_compat"]`, `[[ratelimits]]` 2개, `[triggers]` crons 추가 (T-17 참조)
8. `wrangler secret put GH_APP_PRIVATE_KEY` — PKCS#8 PEM 전체를 붙여넣기
9. `wrangler secret put RESEND_API_KEY` — Resend `firstfluke-ops-alert` 키 등록
10. `wrangler secret put TURNSTILE_SECRET_KEY` — Turnstile site secret 등록 (개발 단계라면 스킵 가능)
11. `wrangler deploy` 실행 후 배포 URL 확인
12. 헬스체크: `curl -X POST <worker-url> -H 'Content-Type: application/json' -d '{"email":"test@example.com","message":"hello","agree":true,"product":"oma","_hp":""}'` — `{"ok":true}` 또는 `turnstile_failed` 응답이면 라우팅·인증 정상
