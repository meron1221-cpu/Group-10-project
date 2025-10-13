import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

// 1. Initialize the Orbitron font with desired weights and subsets.
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GashaSphere - Scam Detection",
  description: "AI-powered scam detection and cybersecurity platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 2. Apply the font's className and antialiased class to the <body> tag. */}
      <body className={`${orbitron.className} antialiased`}>{children}</body>
    </html>
  );
}
