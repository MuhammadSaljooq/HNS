// PLACEHOLDER COPY — replace before launch

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number; // 1..5
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Autopilot pays for itself every week. It sends the reminders our reps used to forget, and our activation numbers jumped almost overnight.",
    author: "Dana Whitfield",
    role: "VP Growth",
    company: "Meridian Pay",
    rating: 5,
  },
  {
    quote:
      "No-shows were killing us. Now the agent confirms and reschedules every appointment automatically — and the whole clinic works from one CRM.",
    author: "Marcus Lindqvist",
    role: "Operations Director",
    company: "Northwind Health",
    rating: 5,
  },
  {
    quote:
      "We set the sequences up once and haven't touched them since. It quietly recovered over a million dollars in renewals we'd have let lapse.",
    author: "Priya Raman",
    role: "Head of Revenue",
    company: "CargoLoop",
    rating: 5,
  },
  {
    quote:
      "The AI agent writes and times the follow-ups better than we did by hand. Our reply rate tripled and nothing sits in someone's inbox anymore.",
    author: "Elena Cruz",
    role: "Sales Lead",
    company: "Atlas Retail",
    rating: 5,
  },
  {
    quote:
      "Finally a CRM that actually does something. Trial-to-paid doubled and my team stopped living in a follow-up spreadsheet.",
    author: "Tomás Herrera",
    role: "Founder",
    company: "Brightwork",
    rating: 5,
  },
];
