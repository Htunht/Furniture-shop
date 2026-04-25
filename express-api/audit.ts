import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("--- DATABASE AUDIT ---");
  
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  const userCount = await prisma.user.count();
  const categoryCount = await prisma.category.count();
  
  console.log(`Products: ${productCount}`);
  console.log(`Orders: ${orderCount}`);
  console.log(`Users: ${userCount}`);
  console.log(`Categories: ${categoryCount}`);
  
  if (productCount > 0) {
    const firstProduct = await prisma.product.findFirst();
    console.log(`Sample Product: ${firstProduct?.name} (Price: ${firstProduct?.price})`);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error("Database connection failed:", e);
  process.exit(1);
});
