import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAG, Explained — An Interactive Research Paper",
  description:
    "An interactive, visual companion to Retrieval-Augmented Generation for Large Language Models: A Survey.",
  openGraph: {
    title: "RAG, Explained",
    description: "Read the landmark RAG survey as an interactive research paper.",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "RAG, Explained",
    description: "An interactive companion to the RAG survey.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
