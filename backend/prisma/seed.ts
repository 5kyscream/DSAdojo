import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.problem.createMany({
    data: [
      {
        title: "Island Perimeter",
        topic: "Graphs",
        difficulty: "Easy",
        expectedTimeMs: 600000, // 10 minutes benchmark
        description: "Given a grid where 1 represents land and 0 represents water, calculate the perimeter of the island. Assume only one valid island exists.",
        codeTemplate: "function getPerimeter(grid) {\n  // Your tactical approach here\n  return 0;\n}"
      },
      {
        title: "Knapsack Subnets",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        expectedTimeMs: 1200000, // 20 minutes benchmark
        description: "Given arrays of packet weights and their respective tactical values, determine the maximum value extractable in the target bandwidth.",
        codeTemplate: "function knapsackSolver(weights, values, W) {\n  // Optimize your caching here\n  return 0;\n}"
      }
    ]
  });
  console.log("[DB] Database seeded with initial problems!");
}
main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
