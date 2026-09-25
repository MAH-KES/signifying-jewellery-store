"use client";

import { useCart } from "@/context/CartContext";

export type ProductCardData = {
  id: string;
  name: string;
  shop: string;
  description: string;
  material: string;
  dotColor: string;
  svg: string;
  price: number;
  oldPrice: number | null;
  badge: string | null;
  rating: number;
  reviews: number;
  stock: number;
};

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();

  return (
    <div className="product">
      <div className="swatch">
        {product.badge && <span className="badge">{product.badge}</span>}
        <svg viewBox="0 0 300 300" dangerouslySetInnerHTML={{ __html: product.svg }} />
      </div>
      <div className="body">
        <div className="shop">{product.shop}</div>
        <div className="name">{product.name}</div>
        <div className="rating">
          <span className="stars">{"★".repeat(product.rating)}</span> ({product.reviews})
        </div>
        <p className="desc">{product.description}</p>
        <div className="material">
          <span className="dot" style={{ background: product.dotColor }} />
          {product.material}
        </div>
        <div className="price-row">
          <span className="price">{inr(product.price)}</span>
          {product.oldPrice && (
            <>
              <span className="strike">{inr(product.oldPrice)}</span>
              <span className="off">
                {Math.round((1 - product.price / product.oldPrice) * 100)}% off
              </span>
            </>
          )}
        </div>
        <button
          className="addcart"
          disabled={product.stock <= 0}
          onClick={() => addItem(product.id)}
        >
          {product.stock <= 0 ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
