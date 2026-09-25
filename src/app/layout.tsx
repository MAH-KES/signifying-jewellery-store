import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Signifying Jewellery — Handcrafted Fine Jewellery",
  description:
    "Handcrafted jewellery across India — 22kt gold, sterling silver, and natural gemstones.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <CartDrawer />
          <footer>
            © {new Date().getFullYear()} Signifying Jewellery. Handcrafted across India.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
