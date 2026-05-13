# GitHub App 등록·배포·owner 요청 SOP

> 관련 ADR: [`docs/adr/0001-contact-routing.md`](../adr/0001-contact-routing.md)
> 관련 플랜: [`.agents/results/plan-2026-05-10-contact-solution-routing.json`](../../.agents/results/plan-2026-05-10-contact-solution-routing.json) (T-15)
> 목적: `firstfluke-contact-bot` GitHub App을 만들고, 7개 product repo owner에게 install 요청을 보내고, Cloudflare Worker에서 사용 가능한 상태로 배포한다.

## 사전 준비물

- 본인 GitHub 계정 (App 소유자가 됨)
- Cloudflare Worker 프로젝트 접근 권한 (`apps/web/worker/wrangler.toml`)
- **Wrangler CLI ≥ 4.36.0** — `npx wrangler --version` 으로 확인. 그 미만이면 Rate Limiting binding이 동작 안 함.
- `openssl` (macOS 기본 포함)
- 7개 product의 owner 연락처 (Slack/이메일 등)

---

## 단계 1 — GitHub App 등록

1. https://github.com/settings/apps/new 진입
2. 폼 입력:

   | 항목 | 값 |
   |---|---|
   | GitHub App name | **firstfluke-contact-bot** |
   | Homepage URL | `https://firstfluke.com` |
   | Webhook → Active | **체크 해제 (off)** |
   | Webhook URL / Secret | (off이므로 비워둠) |

3. **Repository permissions** (필요한 것만 켜기, 나머지 No access)

   | 권한 | 설정 |
   |---|---|
   | Issues | **Read and write** |
   | Metadata | **Read-only** (자동 권장됨) |
   | 그 외 모든 항목 | **No access** |

4. **Subscribe to events** — 모두 비워둠 (webhook 안 씀)
5. **Where can this GitHub App be installed?** — **"Any account"** 선택 (다른 owner에게 install 요청 보내려면 필수)
6. **Create GitHub App** 클릭

## 단계 2 — App ID 확인

- 등록 직후 App **General** 설정 페이지 상단에 `App ID: 1234567` 같은 형식으로 표시됨
- 이 숫자가 `GH_APP_ID` 환경변수 값이 됨

## 단계 3 — Private Key 발급

1. App **General** 페이지 하단 "Private keys" 섹션
2. **Generate a private key** 클릭
3. `.pem` 파일 자동 다운로드 (`firstfluke-contact-bot.2026-05-10.private-key.pem` 같은 이름)
4. 이 파일은 **다시 발급 불가** — 즉시 단계 4로 넘어가서 처리

## 단계 4 — ⚠ CRITICAL: PKCS#1 → PKCS#8 변환

GitHub이 발급하는 PEM은 **PKCS#1 형식**인데, Cloudflare Worker의 WebCrypto API는 **PKCS#8만** 받습니다. 변환 안 하면 100% 인증 실패.

```bash
# 다운로드된 키를 PKCS#8로 변환
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt \
  -in firstfluke-contact-bot.2026-05-10.private-key.pem \
  -out firstfluke-contact-bot.pkcs8.pem

# 변환 확인 — 첫 줄이 "-----BEGIN PRIVATE KEY-----" 이어야 함 (PKCS#1이면 "-----BEGIN RSA PRIVATE KEY-----")
head -1 firstfluke-contact-bot.pkcs8.pem
# 출력: -----BEGIN PRIVATE KEY-----   ← OK
```

> 💡 헷갈림 방지: PKCS#1은 `BEGIN RSA PRIVATE KEY`, PKCS#8은 `BEGIN PRIVATE KEY`. RSA 빠지면 PKCS#8.

## 단계 5 — Cloudflare Worker secrets 등록

```bash
cd apps/web/worker

# Wrangler 버전 확인 (4.36+ 필수)
npx wrangler --version

# Private key — 반드시 PKCS#8 변환된 파일
cat ../../../firstfluke-contact-bot.pkcs8.pem | npx wrangler secret put GH_APP_PRIVATE_KEY

# (이미 있으면 건너뜀) Resend ops-alert 키
npx wrangler secret put RESEND_API_KEY

# (옵션) Turnstile
npx wrangler secret put TURNSTILE_SECRET_KEY
```

## 단계 6 — Worker `[vars]`에 App ID, PRODUCT_ROUTES 등록

`apps/web/worker/wrangler.toml`을 다음과 같이 갱신 (예시):

```toml
[vars]
ALLOWED_ORIGINS = "https://firstfluke.com,https://www.firstfluke.com,http://localhost:3000"
RESEND_FROM = "FIRST FLUKE <contact@mail.firstfluke.com>"
OPS_ALERT_TO = "our.first.fluke@gmail.com"
GH_APP_ID = "1234567"   # ← 단계 2에서 확인한 App ID
# PRODUCT_ROUTES — 단계 9까지 완료 후 채움. 우선 빈 객체로 시작 가능.
PRODUCT_ROUTES = "{}"
```

## 단계 7 — 본인 소유 레포에 install (e2e 검증)

owner 협조를 받기 전에 **본인 계정의 임의 private repo 1개**에 먼저 install해서 동작을 검증합니다.

1. `https://github.com/apps/firstfluke-contact-bot` 접속
2. **Configure** → 본인 계정 선택 → **Only select repositories** → 테스트용 private repo 1개 체크 → **Install**
3. install 완료 후 URL 끝의 숫자 = INSTALLATION_ID
   - 예: `https://github.com/settings/installations/87654321` → `87654321`
4. 또는 `https://github.com/settings/apps/firstfluke-contact-bot/installations` 페이지에서도 확인 가능

이 INSTALLATION_ID로 `PRODUCT_ROUTES`에 임시 1개 매핑 추가:

```json
{
  "oma": { "repo": "<your-username>/<test-repo>", "installationId": "87654321" }
}
```

```bash
npx wrangler deploy
# Worker URL로 product=oma + email + message 페이로드 보내서 테스트 issue 생성 확인
```

issue가 잘 생성되면 인증·라우팅·이슈 생성이 모두 통과한 것 — owner 협조 단계로 진행.

## 단계 8 — owner들에게 install 요청 메시지 (복붙용)

```
안녕하세요, [이름]님.

firstfluke 홈페이지(https://firstfluke.com) 문의 폼에 들어오는 사용자 문의를
[레포명]에 GitHub Issue로 자동 적재하려고 합니다.

부탁드릴 일: 제가 만든 GitHub App `firstfluke-contact-bot`을 [레포명]에 install
한 번만 눌러주시면 됩니다.

권한:
  - Issues: Read & Write
  - Metadata: Read-only
  코드/PR/Settings/Webhooks 등 다른 권한은 일절 없습니다.

언제든 회수 가능: GitHub Settings → Installed GitHub Apps → Uninstall (1초)

Install 링크:
  https://github.com/apps/firstfluke-contact-bot/installations/new

설치 완료 후, 화면 URL 마지막의 숫자(installation id)만 알려주시면 됩니다.
예: https://github.com/settings/installations/12345678 → "12345678"

감사합니다.
```

## 단계 9 — INSTALLATION_ID 회수 후 PRODUCT_ROUTES 완성

owner 7명에게서 install + ID 회수가 끝나면, `wrangler.toml`의 `PRODUCT_ROUTES`를 채워 넣습니다.

> ⚠ JSON 안전성: `wrangler.toml`의 문자열 값에 JSON을 박으니 큰따옴표 escape 처리. **별도 `.env` 파일에 두고 wrangler vars로 등록하는 방식 권장**.

```bash
# 한 줄 JSON으로 압축
cat <<'EOF' > /tmp/product-routes.json
{
  "oma":            { "repo": "ownerA/oma",            "installationId": "11111111" },
  "place-haejo":    { "repo": "ownerB/place-haejo",    "installationId": "22222222" },
  "contents-haejo": { "repo": "ownerB/contents-haejo", "installationId": "22222222" },
  "shopzy":         { "repo": "ownerC/shopzy",         "installationId": "33333333" },
  "curate-ai":      { "repo": "ownerD/curate-ai",      "installationId": "44444444" },
  "prompt-ops":     { "repo": "ownerE/prompt-ops",     "installationId": "55555555" },
  "legalize-kr":    { "repo": "ownerF/legalize-kr",    "installationId": "66666666" }
}
EOF

# 한 줄로 압축해서 vars로 박기
PRODUCT_ROUTES_JSON=$(jq -c . < /tmp/product-routes.json)
echo "$PRODUCT_ROUTES_JSON" | npx wrangler secret put PRODUCT_ROUTES
# (vars 대신 secret로 두면 dashboard에 평문 노출도 안 됨 — 권장)

npx wrangler deploy
```

> 같은 owner가 여러 레포를 가진 경우 INSTALLATION_ID는 **공유**됩니다 (위 예시의 `ownerB` 참고).

## 단계 10 — 일부 owner가 응답을 안 줘도 진행 가능

설계상 `PRODUCT_ROUTES`에 매핑이 누락된 product가 들어오면 Worker는 **dead-letter KV에 적재 + 사용자에게 200**으로 응답합니다. 추후 owner 회신 도착 시점에 `PRODUCT_ROUTES` 항목만 추가 → `wrangler deploy` 1회로 즉시 활성화. 코드 변경 0.

## 단계 11 — 정기 점검 체크리스트 (월 1회)

- [ ] `wrangler tail`로 직전 30일 ratelimit/turnstile 거부 카운트 확인
- [ ] `DEAD_LETTER` KV에 잔여 항목 0인지 확인 (`wrangler kv:key list --binding DEAD_LETTER`)
- [ ] Resend dashboard에서 ops-alert 발송 0건이 정상 (있으면 dead-letter 24h 미해결 발생)
- [ ] App General 페이지에서 install 카운트 = 매핑된 product 수와 일치
- [ ] App owner(본인) 계정의 2FA 활성 상태 유지

## 트러블슈팅

| 증상 | 원인 | 해결 |
|---|---|---|
| `JsonWebTokenError: secretOrPrivateKey ... must be PKCS#8` | PKCS#1 PEM을 그대로 등록 | 단계 4 재실행, 변환된 파일로 secret put 다시 |
| `401 Unauthorized` from `/app/installations/.../access_tokens` | App ID 또는 PKCS#8 키 불일치 | App General의 App ID와 `GH_APP_ID` vars 일치 확인 |
| `404 Not Found` from `/repos/{owner}/{repo}/issues` | App이 그 레포에 install 안 됨 | owner에게 install 재요청 또는 INSTALLATION_ID 오타 확인 |
| `403 Resource not accessible by integration` | App permissions에서 Issues:Write 미설정 | App General → Permissions → Issues: Read and write로 갱신 + owner들에게 권한 확장 승인 안내 |
| Worker가 `crypto2.createHmac is not a function` | `nodejs_compat` flag 누락 | `wrangler.toml`에 `compatibility_flags = ["nodejs_compat"]` 추가 |

## 참고 자료

- [gr2m/cloudflare-worker-github-app-example](https://github.com/gr2m/cloudflare-worker-github-app-example) — canonical 레퍼런스 구현
- [GitHub Docs — Generating an installation access token for a GitHub App](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Cloudflare Rate Limiting in Workers — GA changelog (2025-09-19)](https://developers.cloudflare.com/changelog/post/2025-09-19-ratelimit-workers-ga/)
- [`panva/jose` — JWT signing for Workers](https://github.com/panva/jose)
