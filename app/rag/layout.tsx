import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RAG — Paper Review",
  description:
    "An interactive companion to Retrieval-Augmented Generation for Large Language Models: A Survey.",
};

export default function RagLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
