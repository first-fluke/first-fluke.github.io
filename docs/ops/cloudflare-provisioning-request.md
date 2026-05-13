# Cloudflare Worker 프로비저닝 요청 — firstfluke-contact

소요 10분. 작업 위치: `apps/web/worker/`

## 별도 안전 채널로 받을 3개

1. `firstfluke-contact-bot.pkcs8.pem` (파일, ~1.7KB)
2. `RESEND_API_KEY` — `re_xxx...`
3. `OPS_ALERT_TO` — `our.first.fluke@gmail.com`

> `PRODUCT_ROUTES` 값은 `docs/ops/product-routes.json`에 이미 커밋돼 있음.

## 실행

```bash
cd apps/web/worker

# 1) 네임스페이스 3개 (출력 id 메모)
wrangler kv namespace create TOKEN_CACHE
wrangler kv namespace create DEAD_LETTER
wrangler ratelimit namespace create firstfluke-contact-rl

# 2) wrangler.toml placeholder 교체
#    <TOKEN_CACHE_KV_ID>       → 1번 id
#    <DEAD_LETTER_KV_ID>       → 2번 id
#    <RATE_LIMIT_NAMESPACE_ID> → 3번 id (두 [[ratelimits]] 블록 모두)

# 3) 시크릿 4개
wrangler secret put GH_APP_PRIVATE_KEY < firstfluke-contact-bot.pkcs8.pem
echo -n 're_xxxxxxxxxxxx'           | wrangler secret put RESEND_API_KEY
echo -n 'our.first.fluke@gmail.com' | wrangler secret put OPS_ALERT_TO
jq -c 'del(._comment, ._lastUpdated, ._owners)' ../../../docs/ops/product-routes.json \
  | wrangler secret put PRODUCT_ROUTES

# 4) 배포
wrangler deploy
```

## 회신

```
TOKEN_CACHE id     :
DEAD_LETTER id     :
RATE_LIMIT id      :
Worker URL         :
배포 시각          :
이슈 사항          :
```

에러 발생 시 메시지 원문 캡처.
