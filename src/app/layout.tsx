import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Urugostay | Find Your Nest Anywhere',
  description: 'Premium short-term rentals and boutique properties.',
}
;

import { SettingsProvider } from "@/context/SettingsContext";
import { MobileNavWrapper } from "@/components/ui/MobileNavWrapper";
import { NavbarWrapper } from "@/components/ui/NavbarWrapper";

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased`}>
        <SettingsProvider>
          <NavbarWrapper>
            <Navbar />
          </NavbarWrapper>
          <MobileNavWrapper>
            {children}
          </MobileNavWrapper>
        </SettingsProvider>
        <Toaster />
      </body>
    </html>
  );
}
