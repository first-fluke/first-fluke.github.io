import { LinkButton } from "@/components/ui/button";
import { Mascot } from "@/components/site/mascot";
import { SelectionBadge } from "@/components/site/selection-badge";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-20 md:pt-32 md:pb-24 lg:min-h-screen lg:flex lg:items-center"
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="flex justify-center lg:hidden">
              <SelectionBadge variant="chip" />
            </div>

            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] md:text-sm">
              MAKE YOUR FIRST WIN
            </p>

            <h1 className="text-4xl font-bold leading-[1.15] text-[var(--color-primary)] md:text-5xl lg:text-[64px] lg:leading-[1.1]">
              당신을 첫 번째
              <br />
              행운으로 이끕니다.
            </h1>

            <div className="flex justify-center lg:hidden">
              <Mascot size={220} priority />
            </div>

            <p className="text-base text-[var(--color-fg-muted)] md:text-lg">
              AI와 기술로 더 나은 일상을 만드는 팀,{" "}
              <span className="whitespace-nowrap">FIRST FLUKE.</span>
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <LinkButton href="#solutions" size="lg">
                솔루션 보기
              </LinkButton>
              <LinkButton href="#contact" size="lg" variant="secondary">
                문의하기
              </LinkButton>
            </div>
          </div>

          <div className="hidden justify-end lg:flex">
            <Mascot size={420} priority />
          </div>
        </div>
      </div>
    </section>
  );
}
