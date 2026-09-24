// PLACEHOLDER COPY — replace before launch

export const manifesto =
  "We started HNS because we were tired of watching good businesses lose deals to nothing more than a forgotten follow-up. The work was done. The interest was there. And then a reminder never got sent. Autopilot is our answer: an agent that never forgets, paired with a CRM that never loses the thread. Software should do the remembering so people can do the work that matters.";

export type Member = { name: string; role: string };

export const team: Member[] = [
  { name: "Ava Nasar", role: "Founder & CEO" },
  { name: "Deen Okafor", role: "Head of Product" },
  { name: "Lin Zhao", role: "Lead AI Engineer" },
  { name: "Marco Silva", role: "Head of Engineering" },
  { name: "Priya Kapoor", role: "Design Lead" },
  { name: "Sam Cohen", role: "Customer Success" },
];

export type Milestone = { year: string; title: string; detail: string };

export const milestones: Milestone[] = [
  {
    year: "2013",
    title: "HNS founded",
    detail: "Two engineers and a rule: outcomes over output.",
  },
  {
    year: "2017",
    title: "First CRM build",
    detail: "We kept rebuilding the same follow-up engine for clients.",
  },
  {
    year: "2021",
    title: "Autopilot is born",
    detail: "We productized that engine into a reminder agent + CRM.",
  },
  {
    year: "2024",
    title: "1M reminders/month",
    detail: "Autopilot crosses a million automated reminders a month.",
  },
  {
    year: "2026",
    title: "AI scheduling agent",
    detail: "The agent now books, confirms, and reschedules on its own.",
  },
];
