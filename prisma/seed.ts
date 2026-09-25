import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "handset-polki-diamond-ring",
    name: "Handset Polki Diamond Ring",
    shop: "Signifying Jewellery Studio · Jaipur",
    description:
      "22kt gold band, uncut polki diamonds, hand-finished by our Jaipur karigars.",
    material: "22kt Gold · Diamond",
    dotColor: "var(--gold)",
    price: 58400,
    oldPrice: 68700,
    badge: "Bestseller",
    rating: 5,
    reviews: 214,
    stock: 12,
    svg: '<rect width="300" height="300" fill="#F2E7D4"/><circle cx="150" cy="160" r="55" fill="none" stroke="#C6A24C" stroke-width="7"/><circle cx="150" cy="105" r="10" fill="#C6A24C"/>',
  },
  {
    slug: "moonstone-drop-pendant",
    name: "Moonstone Drop Pendant",
    shop: "SilverLeaf Co. · Jodhpur",
    description:
      "Sterling silver chain with a hand-polished moonstone cabochon pendant.",
    material: "Sterling Silver · Moonstone",
    dotColor: "var(--silver)",
    price: 6250,
    oldPrice: null,
    badge: null,
    rating: 5,
    reviews: 98,
    stock: 40,
    svg: '<rect width="300" height="300" fill="#F2E7D4"/><path d="M90 95 Q150 195 210 95" stroke="#8E97A0" stroke-width="5" fill="none"/><circle cx="150" cy="195" r="13" fill="#8E97A0"/>',
  },
  {
    slug: "raw-amethyst-drop-earrings",
    name: "Raw Amethyst Drop Earrings",
    shop: "GemAtelier · Jaipur",
    description:
      "Rose-gold plated studs set with raw, uncut amethyst crystal drops.",
    material: "Rose Gold · Amethyst",
    dotColor: "var(--gem)",
    price: 4100,
    oldPrice: null,
    badge: "New",
    rating: 5,
    reviews: 61,
    stock: 55,
    svg: '<rect width="300" height="300" fill="#F2E7D4"/><path d="M150 100 a22 22 0 1 1 -0.1 0 Z M150 144 l0 75" stroke="#5B4B7A" stroke-width="5" fill="none"/>',
  },
  {
    slug: "kundan-cuff-bangle",
    name: "Kundan Cuff Bangle",
    shop: "Signifying Jewellery Studio · Jaipur",
    description: "Gold-plated brass cuff, hand-set with kundan work along the edge.",
    material: "Gold Plated · Kundan",
    dotColor: "var(--gold)",
    price: 9800,
    oldPrice: 12000,
    badge: null,
    rating: 5,
    reviews: 140,
    stock: 30,
    svg: '<rect width="300" height="300" fill="#F2E7D4"/><circle cx="150" cy="150" r="78" fill="none" stroke="#B8743C" stroke-width="9"/>',
  },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
