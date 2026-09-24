import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start with ${site.product}, or tell us what you're trying to automate.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title="Let's put your follow-ups on autopilot."
        description="Tell us what's slipping through the cracks. We'll show you what Autopilot can automate — usually in the first call."
      />

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 pb-32 lg:grid-cols-[1fr_20rem]">
        <ContactForm />

        <aside className="flex flex-col gap-10">
          <ContactBlock label="Email">
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-accent"
            >
              {site.email}
            </a>
          </ContactBlock>
          <ContactBlock label="Phone">
            <a
              href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
              className="transition-colors hover:text-accent"
            >
              {site.phone}
            </a>
          </ContactBlock>
          <ContactBlock label="WhatsApp">
            <a
              href={`https://wa.me/${site.whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              Message us
            </a>
          </ContactBlock>
          <ContactBlock label="Where">{site.location}</ContactBlock>
          <ContactBlock label="Social">
            <div className="flex flex-col gap-1">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </ContactBlock>
        </aside>
      </section>
    </>
  );
}

function ContactBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-paper/40">
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
