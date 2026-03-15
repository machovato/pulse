import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const deck = await prisma.update.findFirst({
    where: { title: { contains: "Atlas" }, template: "strategy" },
    orderBy: { created_at: "desc" }
  });

  if (!deck) {
    console.log("No deck found");
    return;
  }

  const parsed = JSON.parse(deck.content_json);
  console.log("Deck Title:", deck.title);
  console.log("Deck schemaVersion:", parsed.schemaVersion);
  
  // Look at slide 1 (the second slide, context slide)
  const slide1 = parsed.slides[1];
  console.log("Slide 1 Type:", slide1?.type);
  console.log("Slide 1 Title:", slide1?.title);
  console.log("Slide 1 Data Keys:", Object.keys(slide1?.data || {}));
  console.log("Slide 1 Eyebrow:", slide1?.data?.eyebrow);
  
  console.log("Slide 1 Full Data:", JSON.stringify(slide1?.data, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
