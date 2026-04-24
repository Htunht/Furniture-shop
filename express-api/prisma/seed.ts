import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.type.deleteMany();

  const categories = ["Living Room", "Bedroom", "Office", "Kitchen", "Dining"];
  const types = ["Chair", "Sofa", "Table", "Bed", "Cabinet"];

  const createdCategories = await Promise.all(
    categories.map((name) =>
      prisma.category.create({
        data: { name },
      }),
    ),
  );

  const createdTypes = await Promise.all(
    types.map((name) =>
      prisma.type.create({
        data: { name },
      }),
    ),
  );

  const products = [
    {
      name: "Velvet Accent Chair",
      description:
        "A luxurious velvet accent chair with gold-finished legs, perfect for any modern living room.",
      price: 299.99,
      discount: 249.99,
      rating: 5,
      inventory: 15,
      categoryIdx: 0,
      typeIdx: 0,
      images: [
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      name: "Modern Leather Sofa",
      description:
        "Spacious 3-seater sofa made with premium Italian leather and a solid oak frame.",
      price: 1299.99,
      discount: 1099.99,
      rating: 4,
      inventory: 5,
      categoryIdx: 0,
      typeIdx: 1,
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      name: "Minimalist Work Desk",
      description:
        "Sleek and functional work desk with built-in cable management and a durable laminate finish.",
      price: 450.0,
      discount: 399.0,
      rating: 4,
      inventory: 20,
      categoryIdx: 2,
      typeIdx: 2,
      images: [
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      name: "King Size Platform Bed",
      description:
        "Contemporary platform bed with a tufted headboard and sturdy wooden slats.",
      price: 899.0,
      discount: 799.0,
      rating: 5,
      inventory: 8,
      categoryIdx: 1,
      typeIdx: 3,
      images: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      name: "Scandinavian Dining Table",
      description:
        "Solid birch dining table that seats six comfortably. Simple, elegant design.",
      price: 550.0,
      discount: 499.0,
      rating: 5,
      inventory: 12,
      categoryIdx: 4,
      typeIdx: 2,
      images: [
        "https://images.pexels.com/photos/3356416/pexels-photo-3356416.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
    },
    {
      name: "Industrial Bookshelf",
      description:
        "Five-tier bookshelf combining reclaimed wood and black metal frame for an industrial look.",
      price: 350.0,
      discount: 299.0,
      rating: 4,
      inventory: 18,
      categoryIdx: 2,
      typeIdx: 4,
      images: [
        "https://images.pexels.com/photos/2067561/pexels-photo-2067561.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
    },
    {
      name: "Ergonomic Office Chair",
      description:
        "Fully adjustable office chair with lumbar support and breathable mesh back.",
      price: 199.99,
      discount: 179.99,
      rating: 4,
      inventory: 25,
      categoryIdx: 2,
      typeIdx: 0,
      images: [
        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      name: "Marble Top Coffee Table",
      description:
        "Elegant coffee table with a genuine marble top and a gold-brushed stainless steel base.",
      price: 450.0,
      discount: 420.0,
      rating: 5,
      inventory: 10,
      categoryIdx: 0,
      typeIdx: 2,
      images: [
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      name: "Rustic Wardrobe",
      description:
        "Large 3-door wardrobe made of solid pine with a hand-applied honey finish.",
      price: 1100.0,
      discount: 950.0,
      rating: 4,
      inventory: 4,
      categoryIdx: 1,
      typeIdx: 4,
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800",
      ],
    },
    {
      name: "Contemporary Bar Stool",
      description:
        "Swivel bar stool with adjustable height and a cushioned seat in charcoal grey fabric.",
      price: 120.0,
      discount: 99.0,
      rating: 4,
      inventory: 30,
      categoryIdx: 3,
      typeIdx: 0,
      images: [
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      name: "Classic Wingback Chair",
      description:
        "A timeless wingback chair with button tufting and nailhead trim.",
      price: 399.99,
      discount: 349.99,
      rating: 5,
      inventory: 20,
      categoryIdx: 0,
      typeIdx: 0,
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      name: "L-Shaped Sectional Sofa",
      description:
        "Large L-shaped sofa with plush cushions and modular design.",
      price: 1599.99,
      discount: 1399.99,
      rating: 4,
      inventory: 7,
      categoryIdx: 0,
      typeIdx: 1,
      images: [
        "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=800&q=80",
      ],
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        discount: p.discount,
        rating: p.rating,
        inventory: p.inventory,
        categoryId: createdCategories[p.categoryIdx].id,
        typeId: createdTypes[p.typeIdx].id,
        images: {
          create: p.images.map((url) => ({ url })),
        },
      },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
