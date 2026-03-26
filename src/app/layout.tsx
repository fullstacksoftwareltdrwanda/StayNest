import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Urugostay | Find your perfect stay",
  description: "Book unique accommodations around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased`}>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
