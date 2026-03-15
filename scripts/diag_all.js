const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const decks = await prisma.update.findMany({
    orderBy: { created_at: 'desc' },
    take: 10
  });

  for (const deck of decks) {
    const parsed = JSON.parse(deck.content_json);
    console.log('\n========================================');
    console.log('Title:', deck.title);
    console.log('Template:', deck.template);
    console.log('Schema Version:', parsed.schemaVersion);
    console.log('Meta Eyebrow:', parsed.meta?.eyebrow);
    console.log('Slides:');
    for (let i = 0; i < parsed.slides.length; i++) {
      const s = parsed.slides[i];
      console.log(`  [${i}] type=${s.type}, title="${s.title}", data.eyebrow="${s.data?.eyebrow || '(MISSING)'}"`);
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
