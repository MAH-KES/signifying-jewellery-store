"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { ProductCardData } from "@/components/ProductCard";

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function CartDrawer() {
  const { items, changeQty, removeItem, isOpen, closeCart } = useCart();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const rows = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((r): r is { productId: string; quantity: number; product: ProductCardData } => !!r);

  const subtotal = rows.reduce((sum, r) => sum + r.product.price * r.quantity, 0);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe-hosted checkout
      } else {
        alert(data.error || "Could not start checkout");
      }
    } catch {
      alert("Could not start checkout. Check your Stripe keys in .env");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={`overlay ${isOpen ? "open" : ""}`} onClick={closeCart} />
      <aside className={`cart-drawer ${isOpen ? "open" : ""}`} aria-label="Shopping cart">
        <div className="cart-head">
          <h3>Your Cart</h3>
          <button className="cart-close" onClick={closeCart} aria-label="Close cart">
            &times;
          </button>
        </div>
        <div className="cart-items">
          {rows.length === 0 ? (
            <div className="cart-empty">Your cart is empty.</div>
          ) : (
            rows.map((r) => (
              <div className="cart-row" key={r.productId}>
                <div className="thumb">
                  <svg viewBox="0 0 300 300" dangerouslySetInnerHTML={{ __html: r.product.svg }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="name">{r.product.name}</div>
                  <div className="shop">{r.product.shop}</div>
                  <div className="price">{inr(r.product.price)}</div>
                  <div className="qty-row">
                    <button onClick={() => changeQty(r.productId, -1)} aria-label="Decrease">
                      −
                    </button>
                    <span>{r.quantity}</span>
                    <button onClick={() => changeQty(r.productId, 1)} aria-label="Increase">
                      +
                    </button>
                    <button className="remove" onClick={() => removeItem(r.productId)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-foot">
          <div className="subtotal">
            <span>Subtotal</span>
            <strong>{inr(subtotal)}</strong>
          </div>
          <button className="checkout-btn" disabled={rows.length === 0 || loading} onClick={handleCheckout}>
            {loading ? "Redirecting…" : "Checkout"}
          </button>
        </div>
      </aside>
    </>
  );
}
