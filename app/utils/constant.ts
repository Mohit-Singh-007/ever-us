import { BookOpen, Heart, ListChecks, Sparkles } from "lucide-react";

export const FEATURES = [
  {
    icon: BookOpen,
    title: "Memory timeline",
    body: "Every photo, every date, laid out in the order you lived it. Scroll back whenever you want to remember.",
  },
  {
    icon: Heart,
    title: "One question a day",
    body: "You both answer. Neither sees the other's reply until you've both said yours.",
  },
  {
    icon: ListChecks,
    title: "A shared list of dreams",
    body: "The trip you keep talking about. The restaurant you never book. Write it down, check it off together.",
  },
  {
    icon: Sparkles,
    title: "Something new, always",
    body: "A date idea when you're out of ideas. A prompt when the journal page is blank. Small nudges, not noise.",
  },
] as const;