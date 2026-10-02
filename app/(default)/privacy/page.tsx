import { PrivacyPolicyArticle } from "@/components/site/privacy-policy-article";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata = createPageMetadata("ko", "privacy");

// TODO(user-review): 보관 기간 정책 확정 (lib/i18n/dictionary-*.ts privacy 섹션)

export default function PrivacyPage() {
  return <PrivacyPolicyArticle />;
}
