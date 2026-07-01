import { z } from "zod";

export const BUCKET_CATEGORIES = [
  "TRAVEL",
  "FOOD",
  "ADVENTURE",
  "MOVIES",
  "DREAMS",
] as const;

export const BUCKET_CATEGORY_LABELS: Record<(typeof BUCKET_CATEGORIES)[number], string> = {
  TRAVEL: "Travel",
  FOOD: "Food",
  ADVENTURE: "Adventure",
  MOVIES: "Movies",
  DREAMS: "Dreams",
};

export const bucketItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  category: z.enum(BUCKET_CATEGORIES),
});

export type BucketItemFormValues = z.infer<typeof bucketItemSchema>;