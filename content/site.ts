// PLACEHOLDER COPY — replace before launch

export type NavChild = { label: string; href: string; blurb?: string };
export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export type Social = { label: string; href: string };

export const site = {
  /** Compact wordmark. The last two characters render in the accent color. */
  name: "NHS",
  /** Expanded brand name, used in metadata and the footer. */
  fullName: "Next Higher Solution",
  /** Flagship product. */
  product: "NHS Autopilot",
  tagline: "Follow-ups on autopilot",
  description:
    "NHS Autopilot is an AI automation agent that schedules and sends your reminders — paired with a built-in CRM that keeps every contact, deal, and follow-up in one place. Set it once; it never forgets.",
  email: "hello@nexthighersolution.com",
  phone: "+1 (555) 018-2049",
  whatsapp: "+15550182049",
  location: "Remote-first · Austin · London",
  domain: "nexthighersolution.com",

  socials: [
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "GitHub", href: "https://github.com" },
    { label: "X", href: "https://x.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
  ] satisfies Social[],

  nav: [
    {
      label: "Product",
      href: "/services",
      children: [
        { label: "AI Reminder Agent", href: "/services#automation" },
        { label: "Built-in CRM", href: "/services#automation" },
        { label: "Automated Follow-ups", href: "/services#automation" },
        { label: "Smart Scheduling", href: "/services#automation" },
        { label: "Integrations", href: "/services#automation" },
      ],
    },
    {
      label: "Services",
      href: "/services",
      children: [
        { label: "Software & Product", href: "/services#software" },
        { label: "Cloud & Platform", href: "/services#cloud" },
        { label: "Data & AI", href: "/services#data-ai" },
        { label: "Business Systems", href: "/services#business" },
        { label: "Growth", href: "/services#growth" },
      ],
    },
    { label: "How it works", href: "/#method" },
    {
      label: "Case Studies",
      href: "/case-studies",
      children: [
        { label: "All work", href: "/case-studies" },
        { label: "Fintech", href: "/case-studies?industry=Fintech" },
        { label: "Healthcare", href: "/case-studies?industry=Healthcare" },
        { label: "Logistics", href: "/case-studies?industry=Logistics" },
      ],
    },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
} as const;

export type Site = typeof site;
