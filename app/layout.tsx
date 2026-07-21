import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paper Review — Interactive Research Papers",
  description:
    "A growing collection of visual, interactive companions to important research papers.",
  openGraph: {
    title: "Paper Review",
    description: "Research papers, made readable through interactive visual companions.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Paper Review",
    description: "A growing collection of interactive research paper reviews.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
