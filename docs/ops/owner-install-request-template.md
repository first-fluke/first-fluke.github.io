# Owner Install 요청 메시지

`[…]` 부분만 받는 사람에 맞춰 교체 후 발송.

---

```
안녕하세요 [받는분 이름]님,

firstfluke 메인 페이지 문의 폼을 솔루션별로 자동 분류하도록 개편했습니다.
[Product 이름] 관련 문의가 들어오면 해당 저장소에 자동으로 GitHub Issue가
생성되게 하려고, App 설치 1건 요청드립니다. 1분 작업이에요.

──────────────────────────────────────
1. 이 링크 클릭
   https://github.com/apps/firstfluke-contact-bot/installations/new

2. 설치할 계정/조직 선택 → [Product 저장소가 있는 곳]

3. "Only select repositories" 선택 → [Product 저장소] 1개만 체크

4. 초록색 [Install] 버튼 클릭
──────────────────────────────────────

권한:
  • Issues: Read & write   (이슈 생성용, 이게 핵심)
  • Metadata: Read-only    (필수)
  → 코드 read/write 없음. App이 할 수 있는 건 issue 만들기뿐.

설치 후 페이지 URL이 다음 패턴으로 바뀝니다:
   https://github.com/<account>/settings/installations/12345678
                                                       ^^^^^^^^
                                                       이 숫자가 ID

설치 완료 후 두 가지만 회신 부탁드립니다:
  ① 저장소 이름 (예: my-team/place-haejo)
  ② INSTALLATION_ID (위 URL 끝 숫자)

감사합니다 🙇
```
