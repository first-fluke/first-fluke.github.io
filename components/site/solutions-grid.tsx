import { SolutionCard } from "@/components/site/solution-card";
import { SOLUTIONS } from "@/lib/solutions";

export function SolutionsGrid() {
  return (
    <section id="solutions" className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] md:text-sm">
            Solution
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-primary)] md:text-4xl">
            솔루션
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {SOLUTIONS.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      </div>
    </section>
  );
}
