import { z } from "zod";

export const MOODS = [
  "HAPPY",
  "SAD",
  "EXCITED",
  "GRATEFUL",
  "ANXIOUS",
  "CALM",
  "FRUSTRATED",
  "LOVED",
] as const;

export const MOOD_EMOJI: Record<(typeof MOODS)[number], string> = {
  HAPPY: "😊",
  SAD: "😢",
  EXCITED: "🤩",
  GRATEFUL: "🙏",
  ANXIOUS: "😰",
  CALM: "😌",
  FRUSTRATED: "😤",
  LOVED: "🥰",
};

export const MOOD_LABELS: Record<(typeof MOODS)[number], string> = {
  HAPPY: "Happy",
  SAD: "Sad",
  EXCITED: "Excited",
  GRATEFUL: "Grateful",
  ANXIOUS: "Anxious",
  CALM: "Calm",
  FRUSTRATED: "Frustrated",
  LOVED: "Loved",
};

export const REACTION_EMOJIS = ["❤️", "😂", "😮", "🥺", "🔥", "👏"] as const;

export const journalEntrySchema = z.object({
  title: z.string().trim().max(120).optional().or(z.literal("")),
  content: z
    .string()
    .max(20000)
    .refine((html) => html.replace(/<[^>]*>/g, "").trim().length > 0, {
      message: "Write something first",
    }),
  mood: z.enum(MOODS).optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;