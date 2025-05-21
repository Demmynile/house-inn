import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearAllData() {
  try {
    // Delete in reverse order of dependencies (children → parents)
    await prisma.payment.deleteMany({});
    await prisma.application.deleteMany({});
    await prisma.lease.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.tenant.deleteMany({});
    await prisma.manager.deleteMany({});
    await prisma.location.deleteMany({});

    console.log("✅ All data cleared from the database.");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearAllData();