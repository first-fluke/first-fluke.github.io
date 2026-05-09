export function CompanyIntro() {
  return (
    <section
      id="about"
      className="border-y border-[var(--color-border)] bg-white py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="container-prose">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] md:text-3xl">
            FIRST FLUKE란
          </h2>

          <div className="mt-8 space-y-7 text-[17px] leading-[1.75] text-[var(--color-fg)] md:text-lg md:leading-[1.7]">
            <p className="font-medium">
              AI와 기술로 더 나은 일상을 만드는 팀입니다.
            </p>

            <p>
              퍼스트플루크는 기능을 많이 담는 서비스보다, 사람들이 오래 쓰는
              경험을 고민합니다. 복잡한 기술을 전면에 드러내는 대신, 사용자가
              편하게 이해하고 쓸 수 있도록 구조와 흐름을 설계합니다.
            </p>

            <p>
              AI, 콘텐츠, 자동화를 기반으로 다양한 디지털 제품과 서비스를
              기획하고 개발합니다. 아이디어 단계부터 실제 사용까지 이어지는,
              실행 중심의 프로덕트를 만듭니다.
            </p>

            <p className="pt-2 font-medium text-[var(--color-primary)]">
              기술 자체보다 ‘왜 필요한가’와 ‘어떤 경험을 남기는가’를 먼저
              생각합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
