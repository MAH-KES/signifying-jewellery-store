import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="wrap" style={{ padding: "100px 24px", textAlign: "center" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Checkout cancelled</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 24 }}>
        No charge was made. Your cart is still saved.
      </p>
      <Link href="/" style={{ textDecoration: "underline" }}>
        Back to shop
      </Link>
    </main>
  );
}
