import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id?: string }).id;
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="wrap" style={{ padding: "48px 24px" }}>
      <h1 style={{ marginBottom: 24 }}>Your orders</h1>
      {orders.length === 0 && <p style={{ color: "var(--ink-soft)" }}>No orders yet.</p>}
      {orders.map((order) => (
        <div key={order.id} style={{ border: "1px solid var(--line)", padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
              Order #{order.id.slice(-8)} · {new Date(order.createdAt).toLocaleDateString()}
            </span>
            <span style={{ fontSize: 13, textTransform: "capitalize", fontWeight: 500 }}>
              {order.status}
            </span>
          </div>
          {order.items.map((item) => (
            <div key={item.id} style={{ fontSize: 14, marginBottom: 4 }}>
              {item.product.name} × {item.quantity} — {inr(item.price * item.quantity)}
            </div>
          ))}
          <div style={{ marginTop: 10, fontWeight: 500 }}>Total: {inr(order.total)}</div>
        </div>
      ))}
    </main>
  );
}
