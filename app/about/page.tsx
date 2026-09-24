import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Manifesto } from "@/components/sections/Manifesto";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { Timeline } from "@/components/sections/Timeline";
import { CTA } from "@/components/sections/CTA";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `The team behind ${site.product} — why we built an agent that never forgets a follow-up.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT"
        title="We build software that remembers."
        description={`${site.fullName} is a team of senior engineers and designers on a mission to end the forgotten follow-up. ${site.product} is how.`}
      />
      <Manifesto />
      <TeamGrid />
      <Timeline />
      <CTA />
    </>
  );
}
