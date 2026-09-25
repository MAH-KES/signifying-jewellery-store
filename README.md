# Signifying Jewellery — Store

A full-stack Next.js ecommerce app: product catalog from a real database, a
working cart, Stripe checkout, accounts, order history, and a basic admin
page. Same product data and visual style as the original page.

## What's inside

- **Next.js 15.5.8** (App Router) + TypeScript — patched against the December 2025 Next.js/React Server Components security advisories
- **PostgreSQL + Prisma** — products, users, orders, order items
- **NextAuth (credentials)** — sign up / sign in, session-based
- **Stripe Checkout** — hosted, secure payment page (you never touch card numbers)
- **Cart** — React context + localStorage, same behavior as the artifact version
- **Admin page** at `/admin` — inventory + recent orders, gated by your email

## 1. Install dependencies

```bash
npm install
```

## 2. Set up a database

Easiest options (all have free tiers): [Supabase](https://supabase.com),
[Neon](https://neon.tech), or [Railway](https://railway.app). Create a
Postgres database and copy its connection string.

Copy the env template and fill it in:

```bash
cp .env.example .env
```

Set `DATABASE_URL` to your connection string.

## 3. Create the database tables and seed products

```bash
npm run prisma:migrate
npm run prisma:seed
```

This creates the `Product`, `User`, `Order`, and `OrderItem` tables and loads
the same 4 products from your original page.

## 4. Set up Stripe (test mode)

1. Create a free account at [stripe.com](https://stripe.com).
2. Copy your **test** secret key and publishable key from the Dashboard into `.env`.
3. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   This prints a webhook signing secret — put it in `STRIPE_WEBHOOK_SECRET`.
4. Use [Stripe's test card](https://stripe.com/docs/testing) `4242 4242 4242 4242`,
   any future expiry, any CVC, to test a full purchase.

## 5. Set NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Paste the output into `NEXTAUTH_SECRET` in `.env`.

## 6. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`. Add items to your cart, sign up for an
account, and check out with the Stripe test card above. You'll land on
`/checkout/success`, and the order will show up in `/account/orders` and
in `/admin` (set `ADMIN_EMAIL` in `.env` to your account's email first).

## 7. Deploy

1. Push this project to a GitHub repo.
2. Import it into [Vercel](https://vercel.com).
3. Add all the same environment variables from `.env` in Vercel's project settings —
   but with your **live** Stripe keys and production database URL.
4. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` to your real domain.
5. Add a **production** webhook endpoint in the Stripe Dashboard pointing to
   `https://yourdomain.com/api/webhooks/stripe`, and use that webhook's
   signing secret in production.

## What to build next

- Product detail pages (`/product/[id]`)
- Order shipping status updates from the admin page
- Order confirmation emails (Resend or Postmark integrate easily with the webhook)
- Once live, revisit the earlier Google Merchant Center steps — this app's
  product data can be turned into a feed so your store shows up in Google
  Shopping and Search.
