export type Paper = {
  slug: string;
  index: string;
  title: string;
  authors: string;
  year: string;
  field: string;
  sourceLabel: string;
  sourceUrl: string;
  summary: string;
  tags: string[];
  sections: number;
  readingTime: string;
};

export const papers: Paper[] = [
  {
    slug: "rag",
    index: "001",
    title: "Retrieval-Augmented Generation for Large Language Models: A Survey",
    authors: "Yunfan Gao et al.",
    year: "2024",
    field: "Large language models",
    sourceLabel: "arXiv:2312.10997v5",
    sourceUrl: "https://arxiv.org/html/2312.10997v5",
    summary:
      "A systematic map of how retrieval, generation, and augmentation combine to ground language models in external knowledge.",
    tags: ["RAG", "Retrieval", "Evaluation", "LLMs"],
    sections: 8,
    readingTime: "18 min",
  },
];

