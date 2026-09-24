// PLACEHOLDER COPY — replace before launch

export type Phase = {
  id: string;
  index: string; // zero-padded "01".."05"
  title: string;
  claim: string;
  points: string[];
};

// The Autopilot flow — how the automation agent + CRM turn contacts into
// closed deals without anyone remembering to hit "send".
export const phases: Phase[] = [
  {
    id: "capture",
    index: "01",
    title: "Capture",
    claim: "Every lead lands in the CRM automatically — nothing gets typed twice.",
    points: [
      "forms, inbox, calendar, and chat sync into one place",
      "contacts are deduped and enriched on the way in",
      "no more leads lost in a spreadsheet",
    ],
  },
  {
    id: "organize",
    index: "02",
    title: "Organize",
    claim: "One CRM for every contact, deal, and conversation you have.",
    points: [
      "pipeline stages you can actually see",
      "full history on every contact at a glance",
      "the whole team works from the same record",
    ],
  },
  {
    id: "automate",
    index: "03",
    title: "Automate",
    claim: "The agent decides who to nudge, and when — so you don't have to.",
    points: [
      "build sequences once, run them forever",
      "rules or plain English — the agent handles the logic",
      "it adapts timing to how each contact responds",
    ],
  },
  {
    id: "remind",
    index: "04",
    title: "Remind",
    claim: "Reminders send themselves across email, SMS, and WhatsApp.",
    points: [
      "scheduled and recurring reminders, zero manual sends",
      "auto-books, confirms, and reschedules meetings",
      "cuts no-shows and dead follow-ups",
    ],
  },
  {
    id: "grow",
    index: "05",
    title: "Grow",
    claim: "Nothing slips through the cracks, so more deals actually close.",
    points: [
      "see what every reminder earned you",
      "double down on the sequences that convert",
      "your pipeline compounds while you sleep",
    ],
  },
];
