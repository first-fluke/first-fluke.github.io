# Resend 운영 알람 셋업 SOP

> 관련 ADR: [`docs/adr/0001-contact-routing.md`](../adr/0001-contact-routing.md)
> 관련 플랜: [`.agents/results/plan-2026-05-10-contact-solution-routing.json`](../../.agents/results/plan-2026-05-10-contact-solution-routing.json) (T-16, D11)
> 목적: `DEAD_LETTER` KV에 24h 이상 미해결 항목이 생겼을 때 운영자 1명에게 알람 이메일 1통을 보내는 단일 채널을 셋업한다. 솔루션별 이메일 분배는 이 SOP의 범위 밖이다.

---

## 사전 준비물

- Resend 계정 (https://resend.com) 접속 권한
- `mail.firstfluke.com` 도메인이 해당 계정에서 **Verified** 상태인지 확인 (아래 단계 1)
- `apps/web/worker/` 디렉토리 접근 + Wrangler CLI (`npx wrangler --version` >= 4.36.0)

---

## 단계 1 — 도메인 Verified 상태 확인

Resend Dashboard에서 확인하거나, curl로 직접 검증한다.

**방법 A — Dashboard**

1. https://resend.com/domains 접속
2. 목록에서 `mail.firstfluke.com` 행의 Status = **Verified** 확인

**방법 B — curl**

```bash
curl -s https://api.resend.com/domains \
  -H "Authorization: Bearer <임시 키 또는 기존 키>" \
  | jq '.data[] | select(.name == "mail.firstfluke.com") | {name, status}'
# 기대 출력:
# {
#   "name": "mail.firstfluke.com",
#   "status": "verified"
# }
```

> 도메인이 없거나 `not_started` / `failed` 상태이면 Resend Dashboard → Domains → Add Domain → DNS 레코드(SPF, DKIM, DMARC)를 등록한 뒤 Verify가 완료될 때까지 대기.

---

## 단계 2 — API Key 발급

1. https://resend.com/api-keys 접속 → **Create API Key** 클릭
2. 폼 입력:

   | 항목 | 값 |
   |---|---|
   | Name | `firstfluke-ops-alert` |
   | Permission | **Sending access** ← Full access 부여 금지 |
   | Domain | `mail.firstfluke.com` (선택적으로 도메인 제한 가능) |

3. **Add** 클릭 → `re_...` 형태의 키 표시
4. 키는 **이 화면에서만 표시** — 즉시 단계 3으로 이동해 등록

---

## 단계 3 — Worker secrets / vars 등록

```bash
cd apps/web/worker

# RESEND_API_KEY — secret (대화형 입력)
npx wrangler secret put RESEND_API_KEY
# 프롬프트: Enter a secret value: re_...
# 예상 출력: ✔ Success! Uploaded secret RESEND_API_KEY
```

`wrangler.toml` `[vars]` 섹션에 아래 두 항목이 이미 있는지 확인한다.
자세한 전체 vars 목록은 `apps/web/worker/SECRETS.md` §1 참조.

```toml
[vars]
RESEND_FROM = "FIRST FLUKE <contact@mail.firstfluke.com>"
OPS_ALERT_TO = "our.first.fluke@gmail.com"
```

> `RESEND_FROM`의 발신 주소 도메인(`mail.firstfluke.com`)이 단계 1에서 Verified된 도메인과 일치해야 한다.

---

## 단계 4 — 검증 — 1회 테스트 발송

#### 4-1. DEAD_LETTER KV에 임시 항목 수동 push

```bash
# KV binding 이름 확인
npx wrangler kv:namespace list

# 24h 초과 항목 시뮬레이션 (firstFailedAt = 48h 전 타임스탬프)
DEAD_LETTER_KV_ID="<DEAD_LETTER KV namespace id>"
PAST_TS=$(( $(date +%s) - 172800 ))000  # 48h 전 (ms)

npx wrangler kv:key put \
  --namespace-id "$DEAD_LETTER_KV_ID" \
  "test-alert-001" \
  '{"id":"test-alert-001","payload":{"email":"test@example.com","message":"test","product":"oma"},"attempts":3,"firstFailedAt":'"$PAST_TS"'}'
# 예상 출력: Writing the value "test-alert-001" to namespace ...
```

#### 4-2. Cron 트리거 수동 실행

```bash
# Worker 배포 후 Cron을 즉시 트리거
npx wrangler triggers invoke --trigger-type cron
# 또는 wrangler.toml의 crons가 설정된 상태에서 wrangler dev로 로컬 테스트:
# npx wrangler dev --test-scheduled
```

> Cron이 `firstFailedAt` 기준 24h 초과를 감지 → `OPS_ALERT_TO`로 알람 발송.

#### 4-3. 수신 확인

- `our.first.fluke@gmail.com` 인박스(또는 spam 폴더) 에서 발신자 `FIRST FLUKE <contact@mail.firstfluke.com>` 메일 확인
- 확인 후 테스트 KV 항목 삭제:

```bash
npx wrangler kv:key delete \
  --namespace-id "$DEAD_LETTER_KV_ID" \
  "test-alert-001"
```

---

## 단계 5 — 무료 한도 산정

| 지표 | Resend Free 한도 | 운영 예측 |
|---|---|---|
| 일일 발송 | 100 mail/day | 0~1건 (dead-letter 24h 이상일 때만) |
| 월간 발송 | 3,000 mail/month | 월 ≤ 10건 예상 |
| 도메인 수 | 1개 | `mail.firstfluke.com` 1개로 전체 공유 |

> dead-letter는 GitHub API 일시 장애 등 비정상 상황에서만 발생하므로 정상 운영 시 Resend 발송 건수는 거의 0. 무료 한도 안에서 충분히 운영 가능하다.

---

## 단계 6 — API Key revoke 절차

1. https://resend.com/api-keys 접속
2. `firstfluke-ops-alert` 행 → **Revoke** 클릭 → 확인 다이얼로그 수락
3. revoke 즉시 키 무효화 — 이후 Worker는 `401 Unauthorized` 반환
4. 재발급이 필요하면 **단계 2**를 동일하게 반복 후, **단계 3**의 `wrangler secret put RESEND_API_KEY`로 새 키 덮어쓰기

> 키가 유출된 경우 revoke → 재발급 → secret 재등록을 즉시 순서대로 실행한다.

---

## 단계 7 — 다른 솔루션 향후 공유 가이드

D11 결정: Resend 무료 플랜은 1개 도메인(`mail.firstfluke.com`) + API Key는 무제한 발급 가능.

| 항목 | 규칙 |
|---|---|
| 도메인 | `mail.firstfluke.com` 1개 공유 — 신규 도메인 추가 불필요 |
| API Key | product별 별도 발급: `<product>-ops-alert` 네이밍 (예: `shopzy-ops-alert`) |
| 발신 주소 | `<product> <contact@mail.firstfluke.com>` 형태로 구분 |
| Worker secret | 각 product Worker에 별도 `wrangler secret put RESEND_API_KEY` 등록 |

> 키 1개 유출이 다른 product의 발송에 영향을 주지 않도록 반드시 per-product 분리 발급.

---

## 트러블슈팅

| 증상 | 원인 | 해결 |
|---|---|---|
| Resend API `401 Unauthorized` | API Key 만료 또는 revoke됨 | 단계 6 → 재발급 → `wrangler secret put RESEND_API_KEY` |
| Resend API `422 Unprocessable` / `from email not verified` | `RESEND_FROM`의 도메인이 Resend에서 미인증 | 단계 1에서 `mail.firstfluke.com` Verified 상태 재확인 |
| 알람 메일 미수신 | `OPS_ALERT_TO` 오타 또는 spam 폴더 필터 | `wrangler.toml`의 `OPS_ALERT_TO` 값 확인, Gmail spam/프로모션 탭 확인 |

---

## 참고 자료

- [Resend Docs — API Keys](https://resend.com/docs/api-reference/api-keys/create-api-key)
- [Resend Docs — Domains](https://resend.com/docs/api-reference/domains/get-domain)
- [Resend Pricing](https://resend.com/pricing) — Free: 100/day, 3,000/month, 1 domain
- `apps/web/worker/SECRETS.md` — Worker 전체 환경변수·시크릿 레퍼런스
