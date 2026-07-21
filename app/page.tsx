"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { papers } from "./papers";

export default function PaperLibrary() {
  const [query, setQuery] = useState("");

  const visiblePapers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return papers;
    return papers.filter((paper) =>
      [paper.title, paper.authors, paper.field, paper.summary, ...paper.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  return (
    <main className="library-shell">
      <header className="series-topbar">
        <Link className="series-wordmark" href="/" aria-label="Paper Review home">
          <span className="wordmark-mark">P</span>
          <span>paper-review</span>
        </Link>
        <span className="series-edition">An interactive reading series</span>
      </header>

      <section className="library-hero">
        <div className="library-kicker">
          <span>Independent study notes</span>
          <span>Edition 01</span>
        </div>
        <div className="library-title-row">
          <div>
            <p className="eyebrow">Paper library</p>
            <h1>Research papers,<br />made readable.</h1>
          </div>
          <p className="library-intro">
            A growing collection of visual, interactive companions to important research papers. Each review preserves the full argument while making the difficult parts easier to explore.
          </p>
        </div>
        <div className="library-stats" aria-label="Collection statistics">
          <span><strong>{String(papers.length).padStart(2, "0")}</strong>paper reviewed</span>
          <span><strong>{papers.reduce((total, paper) => total + paper.sections, 0)}</strong>sections mapped</span>
          <span><strong>∞</strong>room to grow</span>
        </div>
      </section>

      <section className="library-collection" aria-labelledby="collection-title">
        <div className="collection-heading">
          <div>
            <span className="collection-index">Collection / {String(papers.length).padStart(2, "0")}</span>
            <h2 id="collection-title">All paper reviews</h2>
          </div>
          <label className="paper-search">
            <span>Search</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, topic, author…" />
          </label>
        </div>

        <div className="paper-list">
          {visiblePapers.map((paper) => (
            <article className="library-paper-card" key={paper.slug}>
              <div className="paper-card-index">
                <span>Review</span>
                <strong>{paper.index}</strong>
              </div>
              <div className="paper-card-main">
                <div className="paper-card-meta">
                  <span>{paper.field}</span>
                  <span>{paper.year}</span>
                  <span>{paper.readingTime}</span>
                </div>
                <h3>{paper.title}</h3>
                <p className="paper-card-authors">{paper.authors} · {paper.sourceLabel}</p>
                <p className="paper-card-summary">{paper.summary}</p>
                <div className="paper-card-tags">{paper.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <div className="paper-card-action">
                <Link href={`/${paper.slug}`} aria-label={`Open interactive review of ${paper.title}`}>
                  <span>Open interactive paper</span>
                  <strong>↗</strong>
                </Link>
                <a href={paper.sourceUrl} target="_blank" rel="noreferrer">Original source ↗</a>
              </div>
            </article>
          ))}
          {visiblePapers.length === 0 && (
            <div className="empty-library"><span>0 results</span><p>No paper matches “{query}”. Try a title, author, or topic.</p></div>
          )}
        </div>

        <div className="next-paper-note">
          <span className="collection-index">Next in the series</span>
          <p>New reviews will appear here as they are added. Every paper keeps the same annotated-paper design and interaction language.</p>
        </div>
      </section>

      <footer className="library-footer">
        <span>paper-review</span>
        <p>Read the source. Explore the mechanism. Keep the nuance.</p>
      </footer>
    </main>
  );
}

