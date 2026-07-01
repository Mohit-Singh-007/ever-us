import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});


const prisma = new PrismaClient({adapter});

const dateIdeas = [
  // INDOOR
  { title: "Build a pillow fort and watch old movies", category: "INDOOR" as const },
  { title: "Cook a three-course meal together from scratch", category: "INDOOR" as const },
  { title: "Have a board game tournament with silly stakes", category: "INDOOR" as const },
  { title: "Try a paint-and-sip night at home", category: "INDOOR" as const },

  // OUTDOOR
  { title: "Watch the sunrise from somewhere new", category: "OUTDOOR" as const },
  { title: "Rent bikes and explore a part of town you've never been", category: "OUTDOOR" as const },
  { title: "Go stargazing far from city lights", category: "OUTDOOR" as const },
  { title: "Have a picnic in the most scenic park nearby", category: "OUTDOOR" as const },

  // LONG_DISTANCE
  { title: "Watch the same movie together on a video call", category: "LONG_DISTANCE" as const },
  { title: "Cook the same recipe at the same time, then eat 'together'", category: "LONG_DISTANCE" as const },
  { title: "Mail each other a handwritten letter", category: "LONG_DISTANCE" as const },
  { title: "Play an online co-op game for the evening", category: "LONG_DISTANCE" as const },

  // LOW_BUDGET
  { title: "Take a free walking tour of your own city", category: "LOW_BUDGET" as const },
  { title: "Have a $10 cook-off — whoever makes the better dish wins", category: "LOW_BUDGET" as const },
  { title: "Visit a museum on its free admission day", category: "LOW_BUDGET" as const },
  { title: "Make a playlist of songs from when you first met", category: "LOW_BUDGET" as const },

  // LUXURY
  { title: "Book a couples spa day", category: "LUXURY" as const },
  { title: "Splurge on a tasting menu at the nicest restaurant in town", category: "LUXURY" as const },
  { title: "Spend a night at a hotel just a few minutes from home", category: "LUXURY" as const },
  { title: "Take a hot air balloon ride", category: "LUXURY" as const },

  // ADVENTURE
  { title: "Go on a hike you've never done before", category: "ADVENTURE" as const },
  { title: "Try an escape room together", category: "ADVENTURE" as const },
  { title: "Go kayaking or paddleboarding", category: "ADVENTURE" as const },
  { title: "Take a rock climbing class", category: "ADVENTURE" as const },

  // FOOD
  { title: "Do a taco crawl — three places, one bite each", category: "FOOD" as const },
  { title: "Take a cooking class in a cuisine neither of you knows", category: "FOOD" as const },
  { title: "Recreate your first date meal", category: "FOOD" as const },
  { title: "Try the most-reviewed hole-in-the-wall in your city", category: "FOOD" as const },

  // MOVIE_NIGHT
  { title: "Marathon a trilogy neither of you has seen", category: "MOVIE_NIGHT" as const },
  { title: "Let one partner pick, then swap for the sequel", category: "MOVIE_NIGHT" as const },
  { title: "Watch the worst-reviewed movie you can find, for the drama", category: "MOVIE_NIGHT" as const },
  { title: "Recreate a movie theater experience at home, snacks included", category: "MOVIE_NIGHT" as const },
];

async function main() {
  console.log(`Seeding ${dateIdeas.length} date ideas...`);

  for (const idea of dateIdeas) {
    await prisma.dateIdea.create({ data: idea });
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });