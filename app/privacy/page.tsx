import type { Metadata } from "next";
import { PrivacyPolicyArticle } from "@/components/site/privacy-policy-article";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "FIRST FLUKE 홈페이지 문의 폼에서 수집하는 개인정보의 처리에 관한 사항을 안내합니다.",
  robots: { index: false, follow: false },
};

// TODO(user-review): 보관 기간 정책 확정 (lib/i18n/dictionary-*.ts privacy 섹션)

export default function PrivacyPage() {
  return <PrivacyPolicyArticle />;
}
