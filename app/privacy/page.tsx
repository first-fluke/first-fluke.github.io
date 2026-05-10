import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "FIRST FLUKE 홈페이지 문의 폼에서 수집하는 개인정보의 처리에 관한 사항을 안내합니다.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "1. 수집하는 개인정보 항목",
    body: [
      "필수 항목: 이메일, 메시지 본문",
      "자동 수집: 접속 IP, 접속 시각, 브라우저 정보(스팸 방지 목적, 단기 보관)",
    ],
  },
  {
    title: "2. 수집·이용 목적",
    body: [
      "문의 접수 및 회신",
      "스팸·악용 방지",
    ],
  },
  {
    title: "3. 보관 기간",
    body: [
      "회신 완료 후 6개월간 보관 후 즉시 파기합니다. (회신·기록 보관 목적)",
      // TODO(user-review): 보관 기간 정책 확정
    ],
  },
  {
    title: "4. 제3자 제공",
    body: ["원칙적으로 제공하지 않습니다."],
  },
  {
    title: "5. 처리 위탁",
    body: [
      "이메일 발송 서비스: Resend, Inc. (이메일 본문, 수신자 이메일)",
      "스팸 방지: Cloudflare, Inc. (Turnstile 토큰 검증)",
    ],
  },
  {
    title: "6. 이용자의 권리",
    body: [
      "이용자는 언제든지 본인의 개인정보 열람·정정·삭제·처리정지를 요청할 수 있습니다.",
      "요청은 홈 화면 하단의 'Contact' 섹션에 마련된 문의 양식을 통해 접수해주세요.",
    ],
  },
  {
    title: "7. 개인정보 보호 책임자",
    body: [
      "직책: 대표",
      "연락 채널: 홈 화면 하단의 'Contact' 섹션 문의 양식",
    ],
  },
  {
    title: "8. 고지의 의무",
    body: [
      "본 처리방침의 내용 추가, 삭제 및 수정이 있을 시에는 시행일 7일 전부터 홈페이지에 공지합니다.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-20 md:px-12 md:py-28">
      <Link
        href="/"
        className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-primary)]"
      >
        ← FIRST FLUKE 홈으로
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-[var(--color-primary)] md:text-4xl">
        개인정보처리방침
      </h1>
      <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
        시행일자: 2026-05-09 (초안)
      </p>

      <div className="mt-12 space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              {section.title}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--color-fg)]">
              {section.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-16 rounded-xl bg-[var(--color-bg-soft)] px-4 py-3 text-xs text-[var(--color-fg-muted)]">
        본 처리방침은 초안입니다. 출시 전 사용자 검토 후 시행일자와 본문을
        확정해주세요.
      </p>
    </main>
  );
}
