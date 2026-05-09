import Link from "next/link";
import { SITE } from "@/lib/site";

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.84 7.355c.98-1.454 2.568-2.256 4.475-2.256h.044c3.188.02 5.087 1.973 5.276 5.388.108.046.216.094.32.143 1.45.683 2.51 1.717 3.061 2.992.77 1.781.842 4.687-1.532 7.012C17.69 22.31 15.612 23.985 12.186 24zm1.353-9.495c-.92 0-1.764.14-2.34.404-.62.28-.88.71-.85 1.158.07 1.018 1.16 1.604 2.61 1.526 1.32-.07 2.36-.71 3.18-1.96-.42-.13-.91-.22-1.46-.27a8.36 8.36 0 0 0-1.16-.05c-.05 0-.1 0-.16.02h-.05a.215.215 0 0 1-.05-.01z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-10 md:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 text-sm text-[var(--color-fg-muted)] md:px-12">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <p>
            <span className="font-mono italic">fluke (n.)</span>{" "}
            우연한 행운.
          </p>
          <a
            href={`https://www.threads.com/@${SITE.threadsHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Threads @${SITE.threadsHandle}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--color-primary)]"
          >
            <ThreadsIcon className="h-4 w-4" />
            <span className="font-semibold tracking-tight">Threads</span>
            <span className="text-[var(--color-fg-muted)]">@{SITE.threadsHandle}</span>
          </a>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <p>© 2026 FIRST FLUKE</p>
          <nav aria-label="법적 고지" className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[var(--color-primary)]"
            >
              개인정보처리방침
            </Link>
            <span aria-hidden className="text-[var(--color-border)]">·</span>
            <span
              aria-disabled
              className="cursor-not-allowed opacity-70"
              title="준비 중"
            >
              이용약관
            </span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
