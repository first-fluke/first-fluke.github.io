# ADR 0001: Contact routing architecture (rev3, final)

## Status

Accepted (2026-05-10)

---

## Context

`firstfluke.com`은 현재 `oma`를 포함하여 7개 product를 운영하고 있다. 기존 Contact 폼은 단일 GitHub repo(또는 Resend 메일) 1곳으로 모든 문의를 라우팅하며, 어떤 솔루션 관련 문의인지 분류하는 수단이 전혀 없었다. 이로 인해 운영팀이 수동으로 이슈를 분류해야 했고, 트래킹 및 협업 도구로서의 가치가 크게 떨어졌다.

사이트는 Next.js 정적 export(`out/`) 방식으로 배포되므로 `app/api/` 라우트는 런타임에 호출되지 않는다. 따라서 Cloudflare Worker를 단일 백엔드 진입점으로 채택하는 것이 기술적으로 필수이며, 이 의사결정은 다른 모든 결정의 전제가 된다.

보안 측면에서는 두 가지 취약점이 식별되었다. 첫째, 기존 `layout.tsx`의 Organization JSON-LD에 `our.first.fluke@gmail.com` 주소가 평문으로 박혀 있어 봇 스크래핑 표적이 되고 있었다. 둘째, 클라이언트 측에 라우팅 테이블(repo slug 등)이 노출되면 issue spam 공격 표적이 될 수 있어 서버(Worker)에만 보관해야 한다.

신뢰성 목표는 "issue가 날아오지 않는" 케이스를 0.01% 수준으로 억제하는 것이다. GitHub API 일시 장애, 네트워크 글리치, PKCS#8 변환 실수 등 운영 실패 시나리오를 고려하여 즉시 재시도 + KV dead-letter + Cron 폴링 + 24h 임계 운영자 알람 4단계 안전망을 설계하였다.

---

## Decisions

### D1 — Routing table storage

**Topic:** product → repo 매핑을 어디에 저장하는가

**Choice:** `PRODUCT_ROUTES` JSON을 Worker `[vars]` 또는 secret에만 저장. 클라이언트에 절대 노출하지 않는다.

**Rationale:** 클라이언트가 repo slug를 알면 issue spam 공격의 표적이 된다. JSON 1개 오브젝트로 7개 product 매핑과 `installationId`를 동시에 표현하며, env 수정만으로 라우팅을 변경할 수 있다.

**Tradeoff:** 매핑 변경 시 Worker 재배포 또는 vars 업데이트가 필요하며, 코드 변경 없이 런타임 수정이 불가능하다. 단, 7개 product는 고정이므로 이 비용은 수용 가능하다.

---

### D2 — Default behavior when no product selected

**Topic:** 사용자가 product를 선택하지 않으면 어떻게 처리하는가

**Choice:** product 선택을 필수(`zod enum`)로 강제하되, 7개 솔루션 product 외에 `etc`("기타") 옵션을 8번째 enum 값으로 제공한다. `etc`는 사이트 자체 repo(`first-fluke/first-fluke.github.io`)로 라우팅한다.

**Rationale:** product 선택 자체는 여전히 필수로 강제하여 unclassified payload 자체는 막는다. 다만 7개 솔루션 중 어느 것에도 해당하지 않는 사용자가 제출하지 못해 이탈하는 케이스가 실제로 관측되어, "분류 누락 운영 부담 제거"보다 "수신 자체를 막지 않는다"가 더 큰 가치로 판단되었다. `etc`는 명시적 라우팅 대상이 있는 8번째 product로 다루어 fallback repo가 아니라 정식 destination을 가진다.

**Tradeoff:** `first-fluke/first-fluke.github.io` 사이트 repo가 솔루션과 무관한 일반 문의 트래픽을 받게 되어 issue 누적이 증가할 수 있다. 라벨(`contact` + `etc`)로 솔루션 issue와 명확히 분리하고, 운영 점검 시 `etc` 라벨 큐를 별도로 본다.

**Revision:** rev3에서는 "기타 없음"을 채택했으나, 2026-05-13 운영 피드백 반영하여 본 결정으로 갱신.

---

### D3 — GitHub authentication

**Topic:** GitHub API를 어떻게 인증하는가

**Choice:** GitHub App + `jose` (RS256, PKCS#8) + `TOKEN_CACHE` KV-cached installation token

**Rationale:** 개인 액세스 토큰(PAT)은 만료·탈취 시 수동 교체가 필요하며, 권한 범위를 좁히기 어렵다. GitHub App은 installation token을 1시간마다 자동 회전하고, 권한을 Issues:Write + Metadata:Read로만 좁힐 수 있다. `jose`는 Cloudflare Workers 공식 호환 JWT 라이브러리(메인테이너 `panva`)이며, `gr2m/cloudflare-worker-github-app-example`에서 실증된 패턴이다.

**Tradeoff:** Worker의 `WebCrypto` API는 PKCS#8 형식만 받는다. GitHub이 발급하는 private key는 기본적으로 PKCS#1 형식이므로 `openssl pkcs8 -topk8` 변환 단계가 운영 SOP에 필수로 포함되어야 한다. 이 단계를 누락하면 인증이 100% 실패한다(R2).

---

### D4 — Single entry point

**Topic:** Contact 요청의 백엔드 진입점을 몇 개로 유지하는가

**Choice:** Cloudflare Worker(`firstfluke-contact`) 단일 진입점. `apps/web/app/api/contact/route.ts`는 삭제한다(T-14).

**Rationale:** 사이트는 Next.js 정적 export(`out/`) 방식으로 빌드되므로 `app/api/` 라우트는 실제 런타임에 호출되지 않는다. 두 진입점을 모두 유지하면 동작하지 않는 코드가 코드베이스에 잔류하여 혼란을 초래한다. SSOT 1개를 유지하면 분기를 제거하고 유지보수 부담을 줄인다.

**Tradeoff:** Worker URL(`NEXT_PUBLIC_CONTACT_API_URL`)을 로컬 개발 환경의 `.env`에 별도 설정해야 한다. 개발 환경 가이드 문서를 함께 제공해야 한다.

**Implemented:** T-14 — `apps/web/app/api/contact/route.ts` 삭제 완료 (2026-05-10). `contact-form.tsx`는 `NEXT_PUBLIC_CONTACT_API_URL` 미설정 시 제출 시점에 명시적 오류를 던지도록 변경되었다.

---

### D5 — Notification channel

**Topic:** 문의 수신 알림을 어떤 채널로 전달하는가

**Choice:** GitHub Issue를 1차(primary) 단일 채널로 사용한다. 솔루션별 이메일 분배는 도입하지 않는다.

**Rationale:** GitHub Issue가 이미 팀별 협업·트래킹의 SSOT 역할을 한다. 이메일을 Issue와 병렬 채널로 운영하면 중복 알림, 부분 실패 처리 정책, 2개 채널 유지 비용이 발생한다. 이메일은 Issue 생성이 24h 연속으로 실패하는 극단 케이스에만 운영자 1명에게 단발 알람으로 제한한다.

**Tradeoff:** GitHub이 장기 서비스 중단 상태일 경우 일반 수신 채널이 없다. KV dead-letter는 이 기간 동안 계속 쌓이며, 24h 임계 운영자 알람으로 수동 대응 트리거를 제공한다.

---

### D6 — Reliability — Issue 미전달 방지

**Topic:** GitHub API 장애 또는 네트워크 글리치로 issue 생성에 실패하면 어떻게 처리하는가

**Choice:** 4단계 안전망을 적용한다.
1. 즉시 재시도 3회 (exponential backoff: 200ms → 1s → 5s)
2. 3회 모두 실패 시 `DEAD_LETTER` KV에 페이로드 push, 사용자에게는 200 응답
3. Cron Worker가 5분마다 KV 큐를 폴링하여 재시도
4. `firstFailedAt` 기준 24h 이상 미해결이면 운영자에게 Resend 단발 메일 발송

**Rationale:** GitHub API 일시 장애와 네트워크 글리치를 흡수한다. Cloudflare Queues는 paid plan 전용이므로 KV + Cron 조합으로 동등 효과를 무료 한도 내에서 구현한다.

**Tradeoff:** KV + Cron 방식은 Cloudflare Queues 대비 정확한 at-least-once 보장이 없다. Cron 자체가 실패하면 폴링이 중단되나, KV dead-letter는 영구 보존되어 수동 복구가 가능하다(R3, R7).

---

### D7 — Anti-spam

**Topic:** 봇 스팸 및 무차별 제출을 어떻게 방어하는가

**Choice:** Turnstile siteverify + Honeypot 필드 + Cloudflare Rate Limiting binding(`[[ratelimits]]`)

**Rationale:** Turnstile은 CAPTCHA 없이 봇을 탐지하며 무료 100만 req/월 한도를 제공한다. Honeypot은 단순 봇을 조용히 차단한다. Cloudflare Rate Limiting binding은 2025-09-19 GA된 Worker 네이티브 기능으로, KV 카운터 방식 대비 정확도·코드량이 우월하다. rate limit key를 `` `${ip}:${product}` ``로 설정하여 특정 product 집중 공격도 방어한다.

**Tradeoff:** `TURNSTILE_SECRET_KEY`가 없는 개발 환경에서는 Turnstile 검증을 grace skip한다. 따라서 스테이징 환경에서도 key를 설정하지 않으면 실제 스팸 방어가 없다는 점을 팀이 인지해야 한다.

---

### D8 — Issue body sanitization

**Topic:** 사용자 입력이 GitHub Issue에서 의도치 않게 렌더링되는 것을 어떻게 막는가

**Choice:** 사용자 메시지를 `` ```text `` 코드펜스로 감싸고, 메시지 내 백틱 시퀀스에 Zero-Width Space(ZWSP)를 삽입한다.

**Rationale:** 사용자 입력에 마크다운 또는 HTML이 포함되면 GitHub Issue에서 외부 픽셀 로드, 서식 깨짐, XSS 유사 렌더링 등이 발생할 수 있다. 코드펜스 wrap은 전체 메시지를 리터럴 텍스트로 강제 렌더링한다.

**Tradeoff:** GitHub Issue 본문에서 메시지가 코드 블록 형식으로만 보이므로 시각적 가독성이 다소 떨어진다. 보안 우선 결정으로 이 트레이드오프를 수용한다.

---

### D9 — PII logging

**Topic:** 운영 로그에 개인정보(PII)가 남지 않도록 어떻게 처리하는가

**Choice:** 이메일 주소는 SHA-256 12자 해시만 로그에 기록한다. 메시지 본문은 길이(byte)만 기록한다.

**Rationale:** Cloudflare Tail 또는 Logpush를 통해 Worker 로그가 외부로 전송될 수 있다. 평문 이메일이 로그에 남으면 개인정보 규정 위반 가능성이 있고, 로그 저장소가 침해될 경우 PII가 노출된다.

**Tradeoff:** 디버깅 시 특정 사용자의 요청을 추적하기 어려워진다. 운영 사고 대응 시 이메일 해시로 요청을 식별하는 절차를 SOP에 포함해야 한다.

---

### D10 — Email exposure on public site

**Topic:** 공개 사이트의 HTML/JSON-LD에 이메일 주소가 평문으로 노출되는 문제를 어떻게 차폐하는가

**Choice:** `layout.tsx`의 Organization JSON-LD에서 `email` 필드를 제거한다. `lib/site.ts`의 dead 이메일 필드도 정리한다. `/privacy` 페이지는 법규상 연락처 정보를 유지한다.

**Rationale:** 기존 코드는 모든 페이지 `<head>`의 JSON-LD에 `our.first.fluke@gmail.com`을 평문으로 박아두어 봇 스크래핑 표적이 되었다. `schema.org` Organization 스키마에서 `email`은 선택 필드이므로 제거해도 SEO 손해가 없다.

**Tradeoff:** 검색엔진 Knowledge Graph에서 Organization의 이메일 정보가 사라진다. Contact 폼 URL(`/#contact`)을 `contactPoint`로 대신 제공하여 이 손실을 부분 보완한다.

---

### D11 — Resend usage scope

**Topic:** Resend를 어떤 범위에서 사용하는가

**Choice:** 운영 알람 단일 채널로만 사용한다. API Key 1개(`firstfluke-ops-alert`), 도메인 `mail.firstfluke.com` 공유.

**Rationale:** Resend 무료 플랜은 도메인 1개를 허용하지만 API Key는 무제한이다. `mail.firstfluke.com` 도메인 하나로 firstfluke 그룹 모든 솔루션이 향후 채널을 추가할 수 있다. 이번 작업 범위에서 Resend의 역할은 dead-letter 24h 임계 알람 1건 발송에 한정된다.

**Tradeoff:** 향후 솔루션별 이메일 알람이 필요해지면 같은 도메인에서 API Key만 추가하면 되므로 아키텍처 변경 없이 확장 가능하다. 단, Resend 무료 플랜의 월 3,000건·일 100건 한도를 초과하면 유료 플랜으로 전환해야 한다.

---

### D12 — Wrangler/runtime requirements

**Topic:** Worker 빌드 및 런타임 요건은 무엇인가

**Choice:** Wrangler `>= 4.36.0`, `wrangler.toml`에 `compatibility_flags = ['nodejs_compat']` 명시

**Rationale:** Cloudflare Rate Limiting binding(`[[ratelimits]]`)은 2025-09-19 GA 이후 Wrangler 4.36.0 이상에서 안정 지원된다. `jose`는 `nodejs_compat` 플래그 없이 일부 Workers 환경에서 불안정하게 동작하는 것이 실증 검증된 함정이다.

**Tradeoff:** 팀 전원이 Wrangler 버전을 `>= 4.36.0`으로 맞춰야 하며, CI 파이프라인에서도 버전 고정이 필요하다. 구버전 Wrangler 사용 시 Rate Limiting binding이 인식되지 않아 배포가 실패한다.

---

## Revision History

이 ADR은 세 차례의 설계 검토를 거쳐 rev3에서 동결되었다. **rev1**은 Next.js api route + 단일 PAT 방식으로 시작했으나, 정적 export 환경에서 api route가 동작하지 않는 사실과 PAT의 수동 관리 부담(만료 알림 GitHub Action 별도 필요, 권한 좁힘 불가)이 문제로 지적되었다. **rev2**는 GitHub App으로 인증을 전환하되 솔루션별 Resend API Key 7개와 Issue + Email 듀얼 채널을 채택했으나, "7개 API Key 관리 복잡도 > 실제 가치" 판단과 부분 실패(Issue 성공·Email 실패 또는 반대) 시 정책 정의가 불필요하게 복잡해진다는 이유로 폐기되었다. **rev3(현재)**는 GitHub App + `jose` + Worker 단일 진입점 + Issue 단일 채널 + retry/KV dead-letter/Cron + Resend ops-alert only로 단순화했으며, 네 개의 검증 출처(Cloudflare Rate Limiting GA changelog, `panva/jose`, `gr2m` 예제, Resend 가격)를 통해 설계를 실증하였다.

---

## Consequences

### 긍정적 결과

- 7개 product 문의가 각 product의 전담 repo에 자동 분류되어 운영팀 수동 분류 작업이 제거된다.
- GitHub App 인증으로 토큰 자동 회전이 보장되어 PAT 만료 사고가 구조적으로 불가능해진다.
- retry 3회 + KV dead-letter + 5분 Cron 폴링으로 GitHub API 일시 장애에도 문의가 유실되지 않으며, 사용자에게는 항상 200 응답을 돌려준다.
- 클라이언트에 repo slug를 노출하지 않고, 평문 이메일을 사이트에서 완전히 차폐하여 봇 스크래핑 및 issue spam 표적 위협을 제거한다.
- Resend 도메인 1개로 firstfluke 그룹 전체가 향후 이메일 채널을 추가할 수 있는 확장 기반을 마련한다.

### 부정적 결과 및 완화

- PKCS#1 → PKCS#8 변환 단계를 누락하면 GitHub App 인증이 100% 실패한다(R2). T-15 운영 SOP(`docs/ops/github-app-setup.md`)에서 이 단계를 핵심 체크리스트 1번 항목으로 강제하고, 배포 전 헬스체크에서 1회 토큰 발급을 검증한다.
- Cron Worker 자체가 실패(CF 장애 등)하면 24h 임계 알람이 도달하지 않을 수 있다(R7). KV dead-letter는 Cron과 무관하게 영구 보존되므로 주간 운영 점검에서 KV 잔여를 수동 확인하는 절차를 보완책으로 유지한다.
- 리스크 전체 목록과 완화책은 플랜 JSON의 `risks[]` 섹션(R1~R8)에서 관리한다.

---

## References

- 플랜 JSON (rev3): `.agents/results/plan-2026-05-10-contact-solution-routing.json`
- 플랜 사람-읽기용 요약: `.agents/results/current-plan.md`
- 핸드오프 문서: `task.md`
- [Cloudflare Rate Limiting in Workers — GA changelog (2025-09-19)](https://developers.cloudflare.com/changelog/post/2025-09-19-ratelimit-workers-ga/)
- [Cloudflare Workers Rate Limiting binding 문서](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [`panva/jose` — JWT for Workers](https://github.com/panva/jose)
- [`gr2m/cloudflare-worker-github-app-example`](https://github.com/gr2m/cloudflare-worker-github-app-example)
- [GitHub Docs — Generating an installation access token](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Resend pricing](https://resend.com/pricing)
