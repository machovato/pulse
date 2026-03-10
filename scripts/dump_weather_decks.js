const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("Fetching decks containing 'Weather' in title...");
    const decks = await prisma.update.findMany({
        where: {
            title: {
                contains: "Weather",
                mode: "insensitive"
            }
        }
    });

    console.log(`Found ${decks.length} matching decks.`);

    for (const deck of decks) {
        console.log(`\n\n--- DECK: ${deck.title} (Template: ${deck.template}) ---`);
        const json = JSON.parse(deck.content_json);
        const problemSlide = json.slides.find(s => s.type === "problem");
        if (problemSlide) {
            console.log(JSON.stringify(problemSlide, null, 2));
        } else {
            console.log("No problem slide found.");
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
