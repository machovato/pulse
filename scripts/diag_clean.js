const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get the most recent kickoff deck
  const kickoff = await prisma.update.findFirst({
    where: { template: 'kickoff' },
    orderBy: { created_at: 'desc' }
  });
  
  if (kickoff) {
    const parsed = JSON.parse(kickoff.content_json);
    console.log('=== KICKOFF DECK ===');
    console.log('Title:', kickoff.title);
    console.log('Schema Version:', parsed.schemaVersion);
    for (let i = 0; i < parsed.slides.length; i++) {
      const s = parsed.slides[i];
      console.log(`  Slide ${i}: type="${s.type}" | eyebrow="${s.data?.eyebrow || 'MISSING'}"`);
    }
  }

  console.log('\n');

  // Get the most recent strategy deck  
  const strategy = await prisma.update.findFirst({
    where: { template: 'strategy' },
    orderBy: { created_at: 'desc' }
  });

  if (strategy) {
    const parsed = JSON.parse(strategy.content_json);
    console.log('=== STRATEGY DECK ===');
    console.log('Title:', strategy.title);
    console.log('Schema Version:', parsed.schemaVersion);
    for (let i = 0; i < parsed.slides.length; i++) {
      const s = parsed.slides[i];
      console.log(`  Slide ${i}: type="${s.type}" | eyebrow="${s.data?.eyebrow || 'MISSING'}"`);
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
