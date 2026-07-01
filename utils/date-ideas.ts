export const DATE_CATEGORIES = [
  "INDOOR",
  "OUTDOOR",
  "LONG_DISTANCE",
  "LOW_BUDGET",
  "LUXURY",
  "ADVENTURE",
  "FOOD",
  "MOVIE_NIGHT",
] as const;

export const DATE_CATEGORY_LABELS: Record<(typeof DATE_CATEGORIES)[number], string> = {
  INDOOR: "Indoor",
  OUTDOOR: "Outdoor",
  LONG_DISTANCE: "Long distance",
  LOW_BUDGET: "Low budget",
  LUXURY: "Luxury",
  ADVENTURE: "Adventure",
  FOOD: "Food",
  MOVIE_NIGHT: "Movie night",
};