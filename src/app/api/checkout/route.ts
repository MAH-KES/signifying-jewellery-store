import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type CartInput = { items: { productId: string; quantity: number }[] };

export async function POST(req: Request) {
  const body = (await req.json()) as CartInput;

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Never trust client-supplied prices — look them up fresh from the DB.
  const productIds = body.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  const lineItems = body.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Unknown product ${item.productId}`);
    if (product.stock < item.quantity) {
      throw new Error(`${product.name} is out of stock`);
    }
    return { product, quantity: item.quantity };
  });

  const total = lineItems.reduce((sum, li) => sum + li.product.price * li.quantity, 0);

  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? "guest@example.com";

  // Create a pending order first, so we have something to reconcile the webhook against.
  const order = await prisma.order.create({
    data: {
      email,
      userId: (session?.user as { id?: string } | undefined)?.id,
      status: "pending",
      total,
      items: {
        create: lineItems.map((li) => ({
          productId: li.product.id,
          quantity: li.quantity,
          price: li.product.price,
        })),
      },
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: session?.user?.email ?? undefined,
    line_items: lineItems.map((li) => ({
      quantity: li.quantity,
      price_data: {
        currency: "inr",
        unit_amount: li.product.price * 100, // Stripe expects the smallest currency unit (paise)
        product_data: { name: li.product.name },
      },
    })),
    metadata: { orderId: order.id },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?order=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
