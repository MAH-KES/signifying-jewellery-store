"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="wrap" style={{ padding: "100px 24px", textAlign: "center" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Thank you — your order is confirmed.</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 24 }}>
        A confirmation will be sent to your email. You can check order status anytime from
        your account.
      </p>
      <Link href="/account/orders" style={{ textDecoration: "underline" }}>
        View your orders
      </Link>
    </main>
  );
}
