"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { data: session } = useSession();
  const { items, openCart } = useCart();
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header>
      <div className="headerbar">
        <Link href="/" className="wordmark">
          SIGNIFYING JEWELLERY
        </Link>
        <div className="icons">
          {session ? (
            <>
              <Link href="/account/orders" aria-label="Your orders">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c1.6-4 5-6 8-6s6.4 2 8 6" />
                </svg>
              </Link>
              <button onClick={() => signOut()} aria-label="Sign out">
                <svg viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
              </button>
            </>
          ) : (
            <Link href="/login" aria-label="Sign in">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.6-4 5-6 8-6s6.4 2 8 6" />
              </svg>
            </Link>
          )}
          <button onClick={openCart} aria-label="Cart">
            <svg viewBox="0 0 24 24">
              <path d="M6 8h12l-1 13H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {totalQty > 0 && <span className="cart-count">{totalQty}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
