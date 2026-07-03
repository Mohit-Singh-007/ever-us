import { z } from "zod";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const memorySchema = z.object({
  imageUrl: z.string().trim().url("Add a photo first"),
  caption: z.string().trim().max(300).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  date: z
    .string()
    .trim()
    .min(1, "Pick a date")
    .regex(DATE_RE, "Invalid date")
    .refine((val) => !Number.isNaN(new Date(val).getTime()), "Invalid date")
    .refine((val) => new Date(val) <= new Date(), "Date can't be in the future"),
});

export type MemoryFormValues = z.infer<typeof memorySchema>;