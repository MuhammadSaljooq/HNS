import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ServicesAccordion } from "@/components/sections/ServicesAccordion";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import { CTA } from "@/components/sections/CTA";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Product & Services",
  description: `${site.product} — the AI reminder agent and CRM — plus the full-stack team behind it.`,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="PRODUCT & SERVICES"
        title="Autopilot, and the team behind it."
        description={`${site.product} is the AI agent that schedules your reminders and the CRM that remembers everything. When you need more than a product, the same team builds it.`}
      />

      <section className="py-16">
        <ServicesAccordion />
      </section>

      <ProcessStrip />

      <CTA />
    </>
  );
}
