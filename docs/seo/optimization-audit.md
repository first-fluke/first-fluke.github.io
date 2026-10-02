# SEO · AEO · GEO 적용 기록

검토일: 2026-10-03. 대상: 회사 홈페이지 `https://firstfluke.com/`과 `/en/`, `/ja/`. 개별 제품의 도메인·앱은 이 저장소의 배포 대상이 아니다.

## 문서 검토 범위

사용자가 제공한 [Google 검색 문서](https://developers.google.com/search/docs?hl=ko)의 목차에서 163개 문서 URL을 확인했다. URL 별 범위는 [문서 목록](google-search-docs-inventory.md)에 기록했다. **목차 전체에 대한 적용성 분류와 모든 본문·하위 링크의 정독은 다르다. 전체 문서 정독을 완료했다는 기록이 아니다.** 아래 직접 관련된 원문을 검토하고 현재 회사 사이트에 적용했다. 상품 결제, 뉴스, 채용, 레시피, AMP 등 존재하지 않는 기능은 추가하지 않았다.

## 적용과 검증

| 영역 | 처리 | 근거 및 확인 위치 |
| --- | --- | --- |
| 크롤링·색인 | 정적 HTML, 정상 페이지 200, 없는 페이지 404, robots 크롤링 허용 | `app/robots.ts`, 정적 배포 결과, [기술 요구사항](https://developers.google.com/search/docs/essentials/technical) |
| URL·다국어 | 언어별 URL, self canonical, 상호 hreflang, x-default, 실제 언어 링크 | `lib/site-seo.ts`, [다국어 버전](https://developers.google.com/search/docs/specialty/international/localized-versions), [언어 적응형 페이지](https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages) |
| HTTPS·호스트 통일 | HTTP와 www 요청을 경로·쿼리를 유지한 채 `https://firstfluke.com`으로 301 리디렉션 | Cloudflare 단일 리디렉션 `firstfluke.com canonical HTTPS`. 실제 HTTP·HTTPS·www 응답 확인 |
| 검색 제목·설명 | 7개 제품 분야를 반영한 언어별 설명, OG·Twitter 이미지 | `lib/site-seo.ts`, [기본 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) |
| 사이트맵 | 정규 홈페이지 3개와 언어 대체 링크, 근거 없는 lastmod 제외 | `app/sitemap.ts`, [사이트맵 가이드](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) |
| 개인정보 페이지 | 별도 canonical, noindex·follow, robots에서 접근 허용 | `tests/seo.test.mjs`, [색인 차단](https://developers.google.com/search/docs/crawling-indexing/block-indexing) |
| 방문자 질문 | 회사, 제품 선택, 요금 확인, 문의 방법을 3개 언어의 질문·답변으로 제공. 서버 HTML에 포함 | `components/site/product-faq.tsx`, [유용한 콘텐츠](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [추천 스니펫](https://developers.google.com/search/docs/appearance/featured-snippets) |
| 정보 정확성 | 모든 제품이 월 구독·무료 체험이라는 일괄 표현을 제품별 안내로 수정 | `lib/i18n/dictionary-*.ts` |
| 회사 식별 | 사업자 번호·연락처·주소를 JS 없이 펼칠 수 있는 회사 정보로 제공. 창업자 이름은 본문 번역과 동일한 데이터 사용 | `footer.tsx`, `site-document.tsx`, [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization) |
| 구조화된 데이터 | Organization·WebSite 사용. 가격·평점이 없는 SoftwareApplication 판매 제안 제거. 실제 표시 정보와 일치 | [일반 정책](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [소프트웨어 앱 요건](https://developers.google.com/search/docs/appearance/structured-data/software-app) |
| 내부·외부 링크 | FAQ에서 해당 본문으로 이동, 언어별 실제 링크, 제품 7개 링크 HTTP 200 확인 | [링크 권장사항](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) |
| 이미지·접근성 | 제품 화면·팀 이미지와 대체 텍스트 유지, 링크 이름과 실제 텍스트 일치, 타이핑 효과의 접근성 수정, 소개 글 대비 보완 | `solution-card.tsx`, `typewriter-text.tsx`, `scroll-reveal-text.tsx`, [페이지 경험](https://developers.google.com/search/docs/appearance/page-experience) |
| 불필요한 요청 | GitHub Pages에서 404가 나는 Vercel Analytics 스크립트 제거. 기존 Clarity 유지 | 실제 `/_vercel/insights/script.js` 404 확인 |

## AI 검색

[Google 생성형 AI 최적화 가이드](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)와 [AI 기능 안내](https://developers.google.com/search/docs/appearance/ai-features)에 따라 일반 검색의 크롤링·색인·콘텐츠 원칙을 적용했다. Google 검색만을 위한 `llms.txt`, 숨겨진 AI 전용 문장, 키워드 변형별 대량 페이지, 임의 평점·리뷰는 추가하지 않는다. FAQ는 방문자에게 보이는 이용 안내이며, FAQ 리치 결과나 AI 답변 인용을 보장하지 않는다.

- Aside MCP로 Search Console의 **Google 검색 생성형 AI: 포함** 상태 확인. [Google 제어 안내](https://support.google.com/webmasters/answer/16908024?hl=ko).
- robots의 `User-agent: *` 규칙은 검색 크롤러의 홈페이지 접근을 허용한다.
- Googlebot, Google-InspectionTool, bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot 사용자 에이전트 요청에서 모두 HTTP 200 확인. 이는 사용자 에이전트별 응답 점검이며, 실제 공급자 IP의 접근·수집·인용까지 입증하는 검사는 아니다.
- 검색 크롤러와 학습 크롤러는 별개다. 기존 학습 정책을 검색 설정 변경과 혼동하지 않는다. [OpenAI](https://developers.openai.com/api/docs/bots), [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).

## 계정·서비스 상태

2026-10-03 Aside MCP 확인:

- 도메인 속성 `firstfluke.com` 소유권 인증 상태 정상.
- `https://firstfluke.com/`은 **Google에 등록되어 있음 / 페이지 색인이 생성됨**.
- 배포 후 홈페이지의 색인 생성 재요청에서 **색인 생성 요청됨** 확인.
- 영문·일본어 페이지 모두 요청 이후 재검사에서 **Google에 등록되어 있음 / 페이지 색인이 생성됨** 확인. 요청 접수 상태에서 실제 색인 생성 상태로 바뀌었다.
- 영문 페이지는 최근 크롤링 2026-10-03 00:39:11 KST, Googlebot 스마트폰, 페이지 가져오기 성공. 사용자 선언 canonical과 Google에서 선택한 canonical 모두 `https://firstfluke.com/en/`. URL 검사 내부의 Sitemaps 항목은 **일시적인 처리 오류**로 표시되며 페이지 자체의 색인 생성은 완료 상태다.
- 일본어 페이지는 최근 크롤링 2026-10-03 00:45:11 KST, Googlebot 스마트폰, 페이지 가져오기 성공. 사용자 선언 canonical과 Google에서 선택한 canonical 모두 `https://firstfluke.com/ja/`.
- `https://firstfluke.com/sitemap.xml` 제출 완료. 보고서는 **가져올 수 없음 / 발견된 페이지 0**. 제출 완료와 처리 성공을 구분한다.
- 공개 사이트맵은 HTTP 200, `application/xml`, 유효한 XML 및 홈페이지 3개를 반환한다. 기존 `/sitemap`도 같은 XML을 반환한다. **2026-10-03 00:51:23 KST Google 실제 URL 테스트에서 크롤링 허용·페이지 가져오기 성공** 확인. 테스트된 페이지의 소스에서도 세 언어 URL과 상호 hreflang이 있는 XML을 직접 확인했다. 사이트맵 보고서 처리 성공과 구분하며, 오류 원인을 확정하지 않는다.
- Search Console의 **직접 조치·보안 문제 모두 감지된 문제 없음**. [사이트맵 오류 진단 안내](https://support.google.com/webmasters/answer/7451001?hl=en-GB)에 따라 접근 차단·수동 조치·실제 가져오기를 점검했다. 확인된 기술 결함 없이 사이트맵을 반복 변경하거나 재제출하지 않는다.
- robots 보고서의 심각한 오류 1건은 `haejo-api.firstfluke.com`에 해당한다. 회사 홈페이지 robots에는 정상 수집 기록이 있으며 최신 파일 재크롤링을 요청했다. API의 접근 제한을 임의 해제하지 않았다.
- Google 처리·재색인·순위·AI 인용은 배포와 별도의 외부 결과다. 정상 응답이나 테스트 통과만으로 처리 성공이라고 보고하지 않는다.

## 검증 결과

- [PR #10](https://github.com/first-fluke/first-fluke.github.io/pull/10) 병합 및 [프로덕션 배포](https://github.com/first-fluke/first-fluke.github.io/actions/runs/37027184851) 성공. 배포 커밋 `2059c65290a0f8418c3d04a61ac9eeece2c83db7`.
- 배포 후 한국어·영어·일본어 페이지 HTTP 200, 새 FAQ·회사 정보, 불필요한 분석 스크립트 제거를 확인. 사이트맵은 홈페이지 URL 3개를 포함한 유효 XML을 반환.
- 세 언어의 실제 HTML에서 잘못된 head 요소 없음, 이미지 21개씩 alt 속성 존재, 색인 허용 및 언어 전환 링크 확인. Chrome에서 영문 FAQ의 `#:~:text=` 링크가 해당 문장으로 이동하는 것을 확인.
- 정적 빌드 및 TypeScript 검사 통과.
- SEO 회귀 검사: 17개 테스트, 355개 assertion 통과. 3개 언어 본문·FAQ·회사 정보·구조화된 데이터, metadata, sitemap, privacy noindex 검증.
- 변경 파일 ESLint 통과.
- 로컬 정적 배포물 모바일 Lighthouse: SEO 100, 접근성 100, Agentic Browsing 100. Agentic Browsing 점수는 검색엔진 순위나 AEO/GEO 성과 점수가 아니다.
- Best Practices 77: 기존 Clarity의 서드파티 쿠키 관련 2개 항목. 분석 기능을 점수 개선만을 위해 제거하지 않았다.
- 로컬 비제한 네트워크 관측: LCP 109ms, CLS 0.00. 프로덕션 실제 사용자 Core Web Vitals 통과를 뜻하지 않는다. [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)는 실제 사용자 데이터로 별도 평가한다.

## 운영 확인

배포 후 세 언어 URL을 다시 수집할 수 있는지 확인하고 Search Console에서 색인 생성과 사이트맵 처리 결과를 점검한다. 실적의 검색어·페이지·클릭·노출 및 생성형 AI 보고서를 확인해 실제 발견성과 문의 전환을 평가한다. 운영 데이터가 없는 상태에서 노출 개선 수치나 AI 인용 성과를 만들지 않는다.
