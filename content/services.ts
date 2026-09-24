// PLACEHOLDER COPY — replace before launch

export type ServiceFlag = "ai" | "popular";

export type Service = {
  name: string;
  href: string;
  blurb: string;
  flag?: ServiceFlag;
};

export type ServiceGroup = {
  id: string;
  title: string;
  /** Short description used on the Services page accordion. */
  summary?: string;
  /** Flagship groups render with extra emphasis. */
  flagship?: boolean;
  services: Service[];
};

export const serviceGroups: ServiceGroup[] = [
  {
    id: "automation",
    title: "Automation & CRM",
    summary:
      "HNS Autopilot — the AI agent that schedules your reminders, plus the CRM that remembers everything.",
    flagship: true,
    services: [
      {
        name: "AI Reminder Agent",
        href: "/services#automation",
        blurb: "Schedules and sends every reminder for you.",
        flag: "popular",
      },
      {
        name: "Built-in CRM",
        href: "/services#automation",
        blurb: "Contacts, deals, and history in one place.",
        flag: "popular",
      },
      {
        name: "Automated Follow-ups",
        href: "/services#automation",
        blurb: "Sequences that run on their own, forever.",
      },
      {
        name: "Smart Scheduling",
        href: "/services#automation",
        blurb: "Books, confirms, and reschedules meetings.",
        flag: "ai",
      },
      {
        name: "Multi-channel Reach",
        href: "/services#automation",
        blurb: "Email, SMS, and WhatsApp from one flow.",
      },
      {
        name: "Integrations",
        href: "/services#automation",
        blurb: "Plugs into your calendar, inbox, and tools.",
      },
    ],
  },
  {
    id: "software",
    title: "Software & Product",
    summary: "Custom builds when off-the-shelf won't cut it.",
    services: [
      {
        name: "Web Applications",
        href: "/services#software",
        blurb: "Fast, resilient web apps built to last.",
      },
      {
        name: "Mobile Apps",
        href: "/services#software",
        blurb: "Native-feeling iOS and Android from one codebase.",
      },
      {
        name: "Product Design",
        href: "/services#software",
        blurb: "Research, flows, and interfaces that convert.",
      },
      {
        name: "API & Integrations",
        href: "/services#software",
        blurb: "Systems that talk to each other cleanly.",
      },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & Platform",
    summary: "Infrastructure that scales with you.",
    services: [
      {
        name: "Cloud Architecture",
        href: "/services#cloud",
        blurb: "Right-sized infrastructure on AWS, GCP, or Azure.",
      },
      {
        name: "DevOps & CI/CD",
        href: "/services#cloud",
        blurb: "Ship confidently, many times a day.",
      },
      {
        name: "Platform Engineering",
        href: "/services#cloud",
        blurb: "Golden paths your whole team can follow.",
      },
      {
        name: "Reliability & SRE",
        href: "/services#cloud",
        blurb: "Uptime you can put in a contract.",
      },
    ],
  },
  {
    id: "data-ai",
    title: "Data & AI",
    summary: "Turn your data into decisions and automations.",
    services: [
      {
        name: "AI Product Engineering",
        href: "/services#data-ai",
        blurb: "LLM features that ship, not demos.",
        flag: "ai",
      },
      {
        name: "Data Platforms",
        href: "/services#data-ai",
        blurb: "One trustworthy source of truth.",
      },
      {
        name: "ML & Forecasting",
        href: "/services#data-ai",
        blurb: "Models that earn their compute.",
        flag: "ai",
      },
      {
        name: "Analytics & BI",
        href: "/services#data-ai",
        blurb: "Dashboards people actually open.",
      },
    ],
  },
  {
    id: "business",
    title: "Business Systems",
    summary: "Kill the busywork between your tools.",
    services: [
      {
        name: "Workflow Automation",
        href: "/services#business",
        blurb: "Kill the copy-paste between tools.",
      },
      {
        name: "Internal Tools",
        href: "/services#business",
        blurb: "Admin panels your ops team will thank you for.",
      },
      {
        name: "ERP & CRM Setup",
        href: "/services#business",
        blurb: "Systems of record that fit how you work.",
      },
      {
        name: "Legacy Modernization",
        href: "/services#business",
        blurb: "Untangle the code that runs the business.",
      },
    ],
  },
  {
    id: "growth",
    title: "Growth",
    summary: "Get more from the traffic you already have.",
    services: [
      {
        name: "Marketing Sites",
        href: "/services#growth",
        blurb: "Pages that load fast and rank higher.",
      },
      {
        name: "Conversion & CRO",
        href: "/services#growth",
        blurb: "Turn the traffic you already have.",
      },
      {
        name: "SEO Engineering",
        href: "/services#growth",
        blurb: "Technical foundations search engines love.",
      },
    ],
  },
];
