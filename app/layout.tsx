import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

// 1. Initialize the Orbitron font with desired weights and subsets.
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Gashasphere",
  description: "Created by Group 10",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. Apply the font's className to the <body> tag. */}
      <body className={orbitron.className}>{children}</body>
    </html>
  );
}
