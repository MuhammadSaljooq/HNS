import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { CaseStudiesGrid } from "@/components/sections/CaseStudiesGrid";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = pageMetadata({
  title: "Case Studies",
  description:
    "How teams put follow-ups on autopilot with NHS — fewer no-shows, higher reply rates, and pipelines that never go cold.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="CASE STUDIES"
        title="Follow-ups that paid off."
        description="Real teams, real numbers. Here's what happened when reminders started sending themselves and the CRM stopped dropping the ball."
      />

      <Suspense fallback={null}>
        <CaseStudiesGrid />
      </Suspense>

      <CTA />
    </>
  );
}
