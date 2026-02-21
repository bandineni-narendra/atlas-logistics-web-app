import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { SidebarLayout } from "@/components";
import { SheetBuilderProvider } from "@/contexts/SheetBuilderContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "./providers";
import { UIProvider } from "@/contexts/UIContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas Logistics",
  description: "Ocean freight and logistics platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <QueryProvider>
            <AuthProvider>
              <SheetBuilderProvider>
                <UIProvider>
                  <SidebarLayout>{children}</SidebarLayout>
                </UIProvider>
              </SheetBuilderProvider>
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
