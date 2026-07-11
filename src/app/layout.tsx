import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { AuthProvider } from "@/components/layout/auth-provider";
import { MembershipProvider } from "@/components/layout/membership-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";

export const metadata: Metadata = {
  title: "HabeshaWii - Premium Entertainment Platform",
  description:
    "Exclusive videos, shorts, models, and premium content. Join the ultimate entertainment experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <AuthProvider>
            <MembershipProvider>
            <Header />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileNav />
            </MembershipProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
