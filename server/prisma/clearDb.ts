
import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    return toPascalCase(path.basename(fileName, path.extname(fileName)));
  });

  for (const modelName of modelNames.reverse()) {
    const modelNameCamel = toCamelCase(modelName);
    const model = (prisma as any)[modelNameCamel];
    if (!model) {
      console.error(`Model ${modelName} not found in Prisma client`);
      continue;
    }
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function main() {
  const orderedFileNames = [
    "location.json",
    "manager.json",
    "property.json",
    "tenant.json",
    "lease.json",
    "application.json",
    "payment.json",
  ];

  await deleteAllData(orderedFileNames);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
