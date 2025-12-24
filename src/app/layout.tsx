import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Human JSON Generator",
  description: "Generate detailed JSON prompts for photorealistic human image creation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
