import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Outrexo",
  description: "Secure, serverless email automation platform.",
  icons: {
    icon: "/images/Outrexo1.png",
  },
};

import { SnowEffect } from "@/components/ui/SnowEffect";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}>
        <SnowEffect />
        {children}
      </body>
    </html>
  );
}
