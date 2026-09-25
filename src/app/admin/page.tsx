import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/login");
  }

  const [orders, products] = await Promise.all([
    prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.product.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <main className="wrap" style={{ padding: "48px 24px" }}>
      <h1 style={{ marginBottom: 24 }}>Admin</h1>

      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Inventory</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 40, fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
            <th style={{ padding: 8 }}>Product</th>
            <th style={{ padding: 8 }}>Price</th>
            <th style={{ padding: 8 }}>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: 8 }}>{p.name}</td>
              <td style={{ padding: 8 }}>{inr(p.price)}</td>
              <td style={{ padding: 8 }}>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Recent orders</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
            <th style={{ padding: 8 }}>Order</th>
            <th style={{ padding: 8 }}>Email</th>
            <th style={{ padding: 8 }}>Status</th>
            <th style={{ padding: 8 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: 8 }}>#{o.id.slice(-8)}</td>
              <td style={{ padding: 8 }}>{o.email}</td>
              <td style={{ padding: 8, textTransform: "capitalize" }}>{o.status}</td>
              <td style={{ padding: 8 }}>{inr(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
