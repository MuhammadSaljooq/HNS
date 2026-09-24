import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

/** Compact, half-viewport hero shared by all inner pages. */
export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[60vh] flex-col justify-center overflow-hidden px-6 pb-16 pt-40">
      <div className="dot-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto w-full max-w-7xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          className="mt-6 max-w-4xl font-display font-medium leading-[0.92] tracking-[-0.03em]"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          <SplitText by="char" trigger="mount" stagger={0.02}>
            {title}
          </SplitText>
        </h1>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-dark md:text-lg">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
