// PLACEHOLDER COPY — replace before launch

export type Metric = { label: string; value: string };

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  year: string;
  headline: string;
  summary: string;
  services: string[];
  metrics: Metric[];
  /** Path under /public, or a solid-color placeholder handled by the UI. */
  cover: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "meridian-pay",
    client: "Meridian Pay",
    industry: "Fintech",
    year: "2025",
    headline: "Automated onboarding reminders lifted activation by 38%.",
    summary:
      "We rolled out NHS Autopilot to nudge new merchants through activation. The agent scheduled every reminder and logged each touch in the CRM — no rep had to chase.",
    services: ["AI Reminder Agent", "Built-in CRM", "Automated Follow-ups"],
    metrics: [
      { label: "activation", value: "+38%" },
      { label: "manual follow-ups", value: "-91%" },
      { label: "reminders/mo", value: "60k" },
    ],
    cover: "/case-studies/meridian.svg",
  },
  {
    slug: "northwind-health",
    client: "Northwind Health",
    industry: "Healthcare",
    year: "2025",
    headline: "Appointment reminders cut no-shows nearly in half.",
    summary:
      "Autopilot books, confirms, and reschedules patient appointments across SMS and email, while the CRM keeps every clinic working from one shared record.",
    services: ["Smart Scheduling", "Multi-channel Reach", "Built-in CRM"],
    metrics: [
      { label: "no-shows", value: "-47%" },
      { label: "confirm rate", value: "+62%" },
      { label: "clinics live", value: "24" },
    ],
    cover: "/case-studies/northwind.svg",
  },
  {
    slug: "cargoloop",
    client: "CargoLoop",
    industry: "Logistics",
    year: "2024",
    headline: "Renewal reminders recovered $1.2M in lapsed contracts.",
    summary:
      "We wired CargoLoop's renewals into Autopilot. The agent flags at-risk accounts in the CRM and fires timed reminder sequences before contracts lapse.",
    services: ["AI Reminder Agent", "Automated Follow-ups", "Integrations"],
    metrics: [
      { label: "recovered", value: "$1.2M" },
      { label: "renewal rate", value: "+18%" },
      { label: "accounts", value: "3,400" },
    ],
    cover: "/case-studies/cargoloop.svg",
  },
  {
    slug: "atlas-retail",
    client: "Atlas Retail",
    industry: "Retail",
    year: "2024",
    headline: "An AI agent that follows up with every wholesale lead.",
    summary:
      "The Autopilot agent works Atlas's wholesale pipeline in the CRM — writing, timing, and sending follow-ups so buyers never go cold.",
    services: ["AI Reminder Agent", "Built-in CRM", "Multi-channel Reach"],
    metrics: [
      { label: "reply rate", value: "+3.1x" },
      { label: "lead response", value: "-96%" },
      { label: "sequences", value: "12k/wk" },
    ],
    cover: "/case-studies/atlas.svg",
  },
  {
    slug: "brightwork",
    client: "Brightwork",
    industry: "SaaS",
    year: "2023",
    headline: "Trial-to-paid reminders doubled conversion.",
    summary:
      "We replaced a manual email spreadsheet with Autopilot sequences and a CRM that tracks every trial. Conversions climbed without adding headcount.",
    services: ["Automated Follow-ups", "Built-in CRM", "Smart Scheduling"],
    metrics: [
      { label: "trial→paid", value: "+108%" },
      { label: "rep hours saved", value: "30/wk" },
      { label: "seats", value: "1,900" },
    ],
    cover: "/case-studies/brightwork.svg",
  },
  {
    slug: "verde-energy",
    client: "Verde Energy",
    industry: "Energy",
    year: "2023",
    headline: "Service reminders kept 310 sites on schedule.",
    summary:
      "Autopilot schedules recurring maintenance reminders and routes them to the right crews, with the CRM tracking every site, contact, and visit.",
    services: ["Smart Scheduling", "AI Reminder Agent", "Built-in CRM"],
    metrics: [
      { label: "on-time service", value: "+34%" },
      { label: "missed visits", value: "-71%" },
      { label: "sites", value: "310" },
    ],
    cover: "/case-studies/verde.svg",
  },
];

export const industries: string[] = Array.from(
  new Set(caseStudies.map((c) => c.industry)),
);
