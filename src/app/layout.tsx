import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Urugostay | Find Your Nest Anywhere',
  description: 'Premium short-term rentals and boutique properties.',
}
;

import { SettingsProvider } from "@/context/SettingsContext";
import { MobileNavWrapper } from "@/components/ui/MobileNavWrapper";
import { NavbarWrapper } from "@/components/ui/NavbarWrapper";

import { Toaster } from "@/components/ui/sonner";
import { ImigongoPattern } from "@/components/shared/imigongo-pattern";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} min-h-screen bg-white text-gray-900 antialiased relative overflow-x-hidden`}>
        {/* Global Background Elements */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] opacity-[0.03]">
            <ImigongoPattern variant="gold" />
          </div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] opacity-[0.02] rotate-180">
            <ImigongoPattern variant="dark" />
          </div>
          <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/5 rounded-full blur-[150px]" />
        </div>

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
