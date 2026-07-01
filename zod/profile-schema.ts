import { z } from "zod";

export const LOVE_LANGUAGES = [
  "Words of affirmation",
  "Quality time",
  "Acts of service",
  "Receiving gifts",
  "Physical touch",
] as const;

export const profileSchema = z.object({
  nickname: z.string().trim().max(50).optional().or(z.literal("")),
  bio: z.string().trim().max(280).optional().or(z.literal("")),
  birthday: z.string().optional().or(z.literal("")), // yyyy-mm-dd from <input type="date">
  favoriteMovie: z.string().trim().max(100).optional().or(z.literal("")),
  favoriteFood: z.string().trim().max(100).optional().or(z.literal("")),
  loveLanguage: z.enum(LOVE_LANGUAGES).optional().or(z.literal("")),
  interests: z.array(z.string().trim().min(1).max(30)).max(15),
  image: z.string().url().optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;