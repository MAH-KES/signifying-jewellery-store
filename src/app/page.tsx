import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic"; // always show live stock/prices

export default async function HomePage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <main>
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>Bestsellers</h2>
          </div>
          <div className="grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  shop: p.shop,
                  description: p.description,
                  material: p.material,
                  dotColor: p.dotColor,
                  svg: p.svg,
                  price: p.price,
                  oldPrice: p.oldPrice,
                  badge: p.badge,
                  rating: p.rating,
                  reviews: p.reviews,
                  stock: p.stock,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
