// Use dynamic import of PrismaClient inside main to avoid require-cycle errors when
// running under different loaders (ts-node ESM). We'll create a local prisma
// instance and disconnect it in the finally block.
// ===>>prisma setup
// Generate Prisma client & run migrations:
// npx prisma generate
// npx prisma migrate dev --name init
// Seed:
// npx ts-node prisma/seed.ts
//npm run prisma:seed
// Run dev server:
// npm run dev
async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    // create demo users
    const alice = await prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: { name: "Alice", email: "alice@example.com", isAdmin: true },
    });

    const bob = await prisma.user.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: { name: "Bob", email: "bob@example.com" },
    });

    // create a sample buyer
    await prisma.buyer.create({
      data: {
        fullName: "Rajesh Kumar",
        email: "rajesh@example.com",
        phone: "9876543210",
        city: "Chandigarh",
        propertyType: "Apartment",
        bhk: "Two",
        purpose: "Buy",
        budgetMin: 4000000,
        budgetMax: 6000000,
        timeline: "ThreeToSix",
        source: "Website",
        notes: "Prefers East-facing units",
        tags: ["verified", "priority"],
        ownerId: alice.id,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

//   What is seed.ts?
// It’s a script used to populate your database with initial/sample data after setting up the schema.
// Example use cases:
// Add dummy buyer leads for testing your Buyer Intake App.
// Create admin users or default settings that your app needs to run.
// Speed up development (you don’t need to manually insert test data).
