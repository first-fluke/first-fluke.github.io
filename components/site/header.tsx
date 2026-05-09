import { Wordmark } from "@/components/site/wordmark";
import { SelectionBadge } from "@/components/site/selection-badge";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 px-6 py-5 md:px-12 md:py-7">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Wordmark />
        <div className="hidden md:block">
          <SelectionBadge variant="full" />
        </div>
      </div>
    </header>
  );
}
