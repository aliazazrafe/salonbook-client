import BackToHome from "@/components/layout/BackToHome";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SalonBook | Men’s Salon & Grooming",
    template: "%s | SalonBook",
  },
  description: "Explore men’s salon and grooming services with SalonBook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <Suspense
            fallback={
              <div
                aria-hidden="true"
                className="min-h-[88px] bg-[#f7f7f3] dark:bg-stone-900"
              />
            }
          >
            <Navbar />
          </Suspense>

          <Suspense fallback={null}>
            <BackToHome />
          </Suspense>

          <Suspense
            fallback={
              <main className="min-h-[40vh] bg-stone-50 dark:bg-stone-950">
                <p className="mx-auto max-w-7xl px-5 py-12 text-stone-600 dark:text-stone-300">
                  Loading page...
                </p>
              </main>
            }
          >
            {children}
          </Suspense>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
