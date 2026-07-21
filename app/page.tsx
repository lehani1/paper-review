"use client";

import { useEffect, useMemo, useState } from "react";

const sections = [
  ["abstract", "Abstract"],
  ["overview", "1. RAG at a glance"],
  ["paradigms", "2. Three paradigms"],
  ["retrieval", "3. Retrieval"],
  ["generation", "4. Generation"],
  ["augmentation", "5. Augmentation"],
  ["evaluation", "6. Evaluation"],
  ["future", "7. Future directions"],
] as const;

const paradigms = {
  Naive: {
    label: "Retrieve → Read",
    tone: "A dependable baseline",
    summary: "Index documents, retrieve the top-k chunks, and place them beside the question for the LLM.",
    before: ["Clean documents", "Fixed-size chunks", "Vector embeddings"],
    after: ["Top-k similarity", "Single prompt", "One generation pass"],
    weakness: "Imprecise retrieval, redundant context, and answers that may not stay grounded.",
  },
  Advanced: {
    label: "Prepare → Retrieve → Refine",
    tone: "A quality-focused pipeline",
    summary: "Improve the query and index before retrieval; rerank, select, or compress the context afterward.",
    before: ["Query rewrite / expansion", "Metadata + hybrid index", "Fine-grained chunking"],
    after: ["Reranking", "Context compression", "Relevance filtering"],
    weakness: "Better quality, but more latency, tuning, and operational complexity.",
  },
  Modular: {
    label: "Route ↔ Retrieve ↔ Reason",
    tone: "A flexible, adaptive system",
    summary: "Compose search, memory, routing, prediction, and task-adapter modules into task-specific flows.",
    before: ["Semantic routing", "Multiple data sources", "Task adapters"],
    after: ["Iterative feedback", "Self-critique", "Adaptive stopping"],
    weakness: "Powerful orchestration creates harder debugging, evaluation, and cost control.",
  },
} as const;

const pipeline = [
  {
    key: "index",
    number: "01",
    title: "Index",
    verb: "Prepare knowledge",
    detail: "Clean source documents, split them into useful units, encode each unit as an embedding, and store it with metadata.",
    artifact: "document → chunks → vectors",
  },
  {
    key: "retrieve",
    number: "02",
    title: "Retrieve",
    verb: "Find useful evidence",
    detail: "Encode the question with the same model, compare it with the index, and return the most relevant passages.",
    artifact: "query → similarity → top-k",
  },
  {
    key: "curate",
    number: "03",
    title: "Curate",
    verb: "Remove distraction",
    detail: "Rerank, filter, and compress retrieved passages so the model sees high-signal evidence rather than a long noisy prompt.",
    artifact: "rerank → select → compress",
  },
  {
    key: "generate",
    number: "04",
    title: "Generate",
    verb: "Answer with evidence",
    detail: "Combine the question and selected context in a prompt; generate an answer that is relevant, faithful, and traceable.",
    artifact: "context + question → answer",
  },
] as const;

const augmentationPatterns = {
  Iterative: {
    line: ["Retrieve", "Generate", "Retrieve", "Refine"],
    copy: "Generation reveals what is still missing. Each new retrieval uses the partial answer to gather more targeted evidence.",
    use: "Long-form answers and questions that become clearer as the answer develops.",
    examples: "ITER-RETGEN, ITRG, FLARE-like loops",
  },
  Recursive: {
    line: ["Decompose", "Retrieve", "Solve subproblem", "Synthesize"],
    copy: "Break a complex question into smaller questions, retrieve for each, and recursively assemble the evidence.",
    use: "Multi-hop reasoning, hierarchical documents, and ambiguous questions.",
    examples: "IRCoT, RAPTOR, Tree of Clarifications",
  },
  Adaptive: {
    line: ["Assess", "Retrieve?", "Critique", "Stop?"],
    copy: "Let the model decide whether retrieval is needed, what to retrieve, and when enough evidence has been gathered.",
    use: "Mixed workloads where some questions need no external knowledge and others need repeated search.",
    examples: "Self-RAG, FLARE, confidence-triggered retrieval",
  },
} as const;

const glossary = [
  ["Embedding", "A numeric representation that places semantically similar text near each other."],
  ["Chunk", "A retrieval unit: a sentence, proposition, passage, document, or other slice of knowledge."],
  ["Top-k", "The k highest-scoring retrieval results returned for a query."],
  ["Reranking", "A second scoring pass that reorders retrieved candidates with a more precise model."],
  ["Faithfulness", "Whether the answer is supported by—and does not contradict—the supplied context."],
  ["NDCG", "A ranking metric that rewards relevant results appearing near the top of the list."],
] as const;

export default function Home() {
  const [activeSection, setActiveSection] = useState("abstract");
  const [progress, setProgress] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [activeStage, setActiveStage] = useState(1);
  const [paradigm, setParadigm] = useState<keyof typeof paradigms>("Advanced");
  const [augmentation, setAugmentation] = useState<keyof typeof augmentationPatterns>("Iterative");
  const [chunkSize, setChunkSize] = useState(256);
  const [topK, setTopK] = useState(4);
  const [hybrid, setHybrid] = useState(true);
  const [rerank, setRerank] = useState(true);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [glossaryQuery, setGlossaryQuery] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0.08, 0.3, 0.6] },
    );
    sections.forEach(([id]) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  const retrievalScore = useMemo(() => {
    const granularity = 100 - Math.abs(chunkSize - 320) / 5;
    const breadth = 68 + topK * 4;
    const method = (hybrid ? 8 : 0) + (rerank ? 10 : 0);
    return Math.max(58, Math.min(96, Math.round((granularity + breadth) / 2 + method / 2)));
  }, [chunkSize, topK, hybrid, rerank]);

  const filteredGlossary = glossary.filter(([term, definition]) =>
    `${term} ${definition}`.toLowerCase().includes(glossaryQuery.toLowerCase()),
  );

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className={focusMode ? "site-shell focus-mode" : "site-shell"}>
      <div className="reading-progress" style={{ width: `${progress}%` }} />
      <header className="topbar">
        <button className="wordmark" onClick={() => jump("abstract")} aria-label="Back to paper top">
          <span className="wordmark-mark">R</span>
          <span>RAG, explained</span>
        </button>
        <div className="topbar-actions">
          <span className="read-percent">{Math.round(progress)}% read</span>
          <button className="text-button" onClick={() => setGlossaryOpen(true)}>Glossary</button>
          <button className="focus-button" onClick={() => setFocusMode((value) => !value)} aria-pressed={focusMode}>
            {focusMode ? "Exit focus" : "Focus mode"}
          </button>
          <a className="source-button" href="https://arxiv.org/html/2312.10997v5" target="_blank" rel="noreferrer">Original paper ↗</a>
        </div>
      </header>

      <div className="paper-layout">
        <aside className="toc" aria-label="Paper contents">
          <p className="eyebrow">Contents</p>
          <nav>
            {sections.map(([id, label]) => (
              <button key={id} className={activeSection === id ? "toc-link active" : "toc-link"} onClick={() => jump(id)}>
                <span>{label}</span>
                {activeSection === id && <span className="toc-dot" />}
              </button>
            ))}
          </nav>
          <div className="toc-note">
            <span className="note-index">Reading guide</span>
            <p>Start with the diagrams. Expand “technical detail” only when you want the research vocabulary.</p>
          </div>
        </aside>

        <article className="paper">
          <header className="paper-header">
            <div className="paper-kicker"><span>Interactive survey companion</span><span>arXiv:2312.10997v5</span></div>
            <h1>Retrieval-Augmented Generation for Large Language Models</h1>
          </header>

          <section id="abstract" className="paper-section abstract-section">
            <SectionLabel number="00" title="Abstract" />
            <p className="lead dropcap">Large language models know a lot—but their knowledge can be stale, incomplete, and impossible to trace. Retrieval-Augmented Generation (RAG) gives a model a way to consult external knowledge before answering.</p>
            <div className="thesis-box">
              <span className="thesis-mark">Thesis</span>
              <p>RAG combines the model’s <em>parametric memory</em> with an external, updateable <em>non-parametric memory</em>, improving accuracy, credibility, and domain adaptation.</p>
            </div>
            <p>The survey organizes more than 100 studies around three evolving paradigms—Naive, Advanced, and Modular RAG—and three technical foundations: retrieval, generation, and augmentation. It also unifies how RAG systems are evaluated and where the field is headed.</p>
            <div className="contributions">
              <div><span>01</span><p>Maps the evolution of RAG architectures.</p></div>
              <div><span>02</span><p>Connects retrieval, generation, and augmentation techniques.</p></div>
              <div><span>03</span><p>Organizes tasks, metrics, benchmarks, and open problems.</p></div>
            </div>
          </section>

          <section id="overview" className="paper-section">
            <SectionLabel number="01" title="RAG at a glance" />
            <h2>Give the model a library card.</h2>
            <p className="section-intro">A standard RAG system turns documents into a searchable memory. At question time, it retrieves evidence and places that evidence inside the model’s context window.</p>
            <div className="pipeline" aria-label="Interactive RAG pipeline">
              <div className="pipeline-tabs" role="tablist" aria-label="RAG stages">
                {pipeline.map((stage, index) => (
                  <button key={stage.key} role="tab" aria-selected={activeStage === index} className={activeStage === index ? "stage-tab active" : "stage-tab"} onClick={() => setActiveStage(index)}>
                    <span>{stage.number}</span>{stage.title}
                  </button>
                ))}
              </div>
              <div className="pipeline-visual">
                {pipeline.map((stage, index) => (
                  <button key={stage.key} onClick={() => setActiveStage(index)} className={activeStage === index ? "pipeline-node active" : "pipeline-node"} aria-label={`Show ${stage.title} explanation`}>
                    <span className="node-number">{stage.number}</span>
                    <strong>{stage.title}</strong>
                    {index < pipeline.length - 1 && <span className="pipeline-arrow">→</span>}
                  </button>
                ))}
              </div>
              <div className="stage-detail" role="tabpanel">
                <div><span className="detail-label">{pipeline[activeStage].verb}</span><code>{pipeline[activeStage].artifact}</code></div>
                <p>{pipeline[activeStage].detail}</p>
              </div>
            </div>
            <details className="technical-detail">
              <summary>Technical detail: why semantic similarity works <span>+</span></summary>
              <p>Both document chunks and the query are encoded in the same vector space. Similarity measures—often cosine similarity or dot product—estimate which chunks express related meaning even when they do not share exact keywords. This enables dense retrieval, often paired with sparse keyword retrieval in hybrid systems.</p>
            </details>
          </section>

          <section id="paradigms" className="paper-section">
            <SectionLabel number="02" title="Three RAG paradigms" />
            <h2>From a fixed chain to a reasoning system.</h2>
            <p className="section-intro">The survey frames RAG’s evolution as a response to failure modes in the previous generation. Select a paradigm to compare its moving parts.</p>
            <div className="paradigm-switcher" role="tablist" aria-label="RAG paradigms">
              {(Object.keys(paradigms) as Array<keyof typeof paradigms>).map((name, index) => (
                <button key={name} role="tab" aria-selected={paradigm === name} className={paradigm === name ? "paradigm-tab active" : "paradigm-tab"} onClick={() => setParadigm(name)}>
                  <span>0{index + 1}</span>{name} RAG
                </button>
              ))}
            </div>
            <div className="paradigm-card">
              <div className="paradigm-heading"><div><span>{paradigms[paradigm].tone}</span><h3>{paradigms[paradigm].label}</h3></div><p>{paradigms[paradigm].summary}</p></div>
              <div className="paradigm-columns">
                <div><h4>Before & during retrieval</h4>{paradigms[paradigm].before.map((item) => <p key={item}>↳ {item}</p>)}</div>
                <div><h4>After retrieval</h4>{paradigms[paradigm].after.map((item) => <p key={item}>↳ {item}</p>)}</div>
              </div>
              <div className="weakness"><span>Trade-off</span>{paradigms[paradigm].weakness}</div>
            </div>
            <div className="compare-note"><strong>RAG vs fine-tuning.</strong> RAG is like giving a model a current, inspectable textbook; fine-tuning is like changing the model’s habits and internalized style. The survey treats them as complementary—not mutually exclusive.</div>
          </section>

          <section id="retrieval" className="paper-section">
            <SectionLabel number="03" title="Retrieval" />
            <h2>The answer can only be as good as the evidence.</h2>
            <p className="section-intro">Retrieval quality depends on where knowledge comes from, how it is divided, how the query is expressed, and how candidates are scored.</p>
            <div className="concept-grid">
              <Concept number="A" title="Source" body="Unstructured text, semi-structured PDFs and tables, structured knowledge graphs, or even LLM-generated content." />
              <Concept number="B" title="Granularity" body="Tokens, phrases, propositions, sentences, chunks, documents—or entities, triples, and subgraphs." />
              <Concept number="C" title="Index" body="Chunking, metadata, hierarchical summaries, and graph structure shape what can be found." />
              <Concept number="D" title="Query" body="Expansion, decomposition, rewriting, HyDE, step-back prompting, and routing make retrieval intent clearer." />
              <Concept number="E" title="Embedding" body="Dense, sparse, and hybrid representations trade semantic reach against exact-term precision." />
              <Concept number="F" title="Adapter" body="Task-aware bridges align what the retriever returns with what the generator can use." />
            </div>

            <div className="lab" aria-label="Retrieval design lab">
              <div className="lab-heading"><div><span className="eyebrow">Design lab</span><h3>Tune a retrieval strategy</h3></div><div className="quality-score"><span>{retrievalScore}</span>/100<br /><small>illustrative balance</small></div></div>
              <label className="slider-row"><span>Chunk size <strong>{chunkSize} tokens</strong></span><input type="range" min="64" max="768" step="64" value={chunkSize} onChange={(event) => setChunkSize(Number(event.target.value))} /></label>
              <label className="slider-row"><span>Top-k results <strong>{topK} passages</strong></span><input type="range" min="1" max="10" value={topK} onChange={(event) => setTopK(Number(event.target.value))} /></label>
              <div className="toggle-row">
                <button className={hybrid ? "toggle active" : "toggle"} onClick={() => setHybrid((value) => !value)} aria-pressed={hybrid}><span />Hybrid search</button>
                <button className={rerank ? "toggle active" : "toggle"} onClick={() => setRerank((value) => !value)} aria-pressed={rerank}><span />Reranking</button>
              </div>
              <div className="retrieval-preview">
                <div><span>Precision</span><div><i style={{ width: `${Math.min(98, 54 + (rerank ? 24 : 4) + (768 - chunkSize) / 32)}%` }} /></div></div>
                <div><span>Coverage</span><div><i style={{ width: `${Math.min(98, 48 + topK * 5 + (hybrid ? 12 : 0))}%` }} /></div></div>
                <div><span>Prompt noise</span><div className="noise"><i style={{ width: `${Math.min(96, 18 + topK * 5 + chunkSize / 18 - (rerank ? 16 : 0))}%` }} /></div></div>
              </div>
              <p className="lab-caption">This is a conceptual simulator, not a benchmark. It exposes the central trade-off: more and larger chunks improve coverage, but can add noise, cost, and “lost in the middle” failures.</p>
            </div>
            <details className="technical-detail"><summary>Methods named in the survey <span>+</span></summary><p>Proposition-level DenseX; multi-query RAG-Fusion; sub-question decomposition; Chain-of-Verification; Rewrite-Retrieve-Read; hypothetical document embeddings (HyDE); step-back prompting; metadata and semantic routers; hybrid sparse/dense retrieval; fine-tuned embedding models; and bridge or task-adapter modules.</p></details>
          </section>

          <section id="generation" className="paper-section">
            <SectionLabel number="04" title="Generation" />
            <h2>More context is not always better context.</h2>
            <p className="section-intro">The generator must see enough evidence to answer, but not so much that key information is buried. The survey’s generation stage centers on context curation and model alignment.</p>
            <div className="before-after">
              <div className="context-stack noisy-stack">
                <span className="stack-title">Raw top-k</span>
                {[88, 63, 94, 52, 76].map((width, index) => <div key={index} className={index === 2 ? "context-line relevant" : "context-line"} style={{ width: `${width}%` }} />)}
                <small>Repeated facts · weak matches · long prompt</small>
              </div>
              <div className="curation-arrow"><span>rerank</span><span>select</span><span>compress</span>→</div>
              <div className="context-stack clean-stack">
                <span className="stack-title">Curated context</span>
                {[96, 82, 68].map((width, index) => <div key={index} className="context-line relevant" style={{ width: `${width}%` }} />)}
                <small>High-signal evidence · ordered for attention</small>
              </div>
            </div>
            <div className="two-column-notes">
              <div><span>Context curation</span><h3>Control what the model reads.</h3><p>Rerank candidates, drop weak passages, compress long evidence, and ask the LLM itself to critique relevance. LLMLingua, RECOMP, PRCA, and Filter-Reranker are representative approaches.</p></div>
              <div><span>LLM fine-tuning</span><h3>Align how the model uses evidence.</h3><p>Teach domain formats and response styles, distill stronger models, or jointly align retriever and generator preferences. RA-DIT coordinates the two with dual instruction tuning.</p></div>
            </div>
            <blockquote>“Lost in the middle” matters: models tend to use information near the beginning and end of long contexts more reliably than evidence buried between them.</blockquote>
          </section>

          <section id="augmentation" className="paper-section">
            <SectionLabel number="05" title="Augmentation process" />
            <h2>Retrieval can happen once—or become part of reasoning.</h2>
            <p className="section-intro">A single retrieval is often insufficient for multi-step questions. The survey separates three richer processes.</p>
            <div className="augmentation-tabs" role="tablist" aria-label="Augmentation patterns">
              {(Object.keys(augmentationPatterns) as Array<keyof typeof augmentationPatterns>).map((name) => <button key={name} role="tab" aria-selected={augmentation === name} className={augmentation === name ? "active" : ""} onClick={() => setAugmentation(name)}>{name}</button>)}
            </div>
            <div className="augmentation-card">
              <div className="flow-line">
                {augmentationPatterns[augmentation].line.map((item, index) => <div key={`${item}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < augmentationPatterns[augmentation].line.length - 1 && <i>→</i>}</div>)}
              </div>
              <p className="augmentation-copy">{augmentationPatterns[augmentation].copy}</p>
              <div className="augmentation-meta"><div><span>Best for</span>{augmentationPatterns[augmentation].use}</div><div><span>Representative methods</span>{augmentationPatterns[augmentation].examples}</div></div>
            </div>
          </section>

          <section id="evaluation" className="paper-section">
            <SectionLabel number="06" title="Tasks & evaluation" />
            <h2>Evaluate the evidence and the answer.</h2>
            <p className="section-intro">The paper spans QA, dialogue, recommendation, information extraction, reasoning, fact checking, summarization, classification, code, math, and translation. Across them, RAG needs a more specific evaluation lens than task accuracy alone.</p>
            <div className="eval-triad">
              <div><span className="triad-number">01</span><h3>Context relevance</h3><p>Did retrieval return precise, useful evidence without unnecessary material?</p><small>Hit rate · MRR · NDCG · precision</small></div>
              <div><span className="triad-number">02</span><h3>Answer faithfulness</h3><p>Is every claim supported by the retrieved context, without contradiction?</p><small>Accuracy · entailment · judge scores</small></div>
              <div><span className="triad-number">03</span><h3>Answer relevance</h3><p>Does the response directly address the question with the right level of detail?</p><small>EM · F1 · BLEU · ROUGE</small></div>
            </div>
            <h3 className="subheading">Four abilities a trustworthy RAG system needs</h3>
            <div className="ability-list">
              <div><span>Noise robustness</span><p>Ignore related but unhelpful documents.</p></div>
              <div><span>Negative rejection</span><p>Decline when the evidence cannot answer.</p></div>
              <div><span>Information integration</span><p>Synthesize across multiple sources.</p></div>
              <div><span>Counterfactual robustness</span><p>Resist incorrect or adversarial context.</p></div>
            </div>
            <div className="benchmark-strip"><span>Benchmarks</span><strong>RGB</strong><strong>RECALL</strong><strong>CRUD</strong><span>Tools</span><strong>RAGAS</strong><strong>ARES</strong><strong>TruLens</strong></div>
            <p className="footnote">The survey notes that these metrics and frameworks are useful but not yet a mature, standardized evaluation system for every RAG setting.</p>
          </section>

          <section id="future" className="paper-section future-section">
            <SectionLabel number="07" title="Discussion & future prospects" />
            <h2>RAG is becoming an adaptable knowledge layer.</h2>
            <div className="future-grid">
              <Future number="01" title="Long context + RAG" body="Long windows do not eliminate retrieval: selective evidence can be faster, cheaper, observable, and easier to cite." />
              <Future number="02" title="Robustness" body="Noise and contradiction can be worse than no context. Systems need explicit resistance to misinformation." />
              <Future number="03" title="Hybrid approaches" body="Combine RAG with fine-tuning, reinforcement learning, and specialized small models." />
              <Future number="04" title="Scaling laws" body="We still do not understand how retriever size, generator size, data, and compute scale together." />
              <Future number="05" title="Production-ready RAG" body="Improve recall, latency, monitoring, security, access control, and reliable source attribution." />
              <Future number="06" title="Multimodal RAG" body="Extend retrieval and generation across images, audio, video, code, tables, and knowledge graphs." />
            </div>
            <div className="conclusion-box">
              <span>Conclusion</span>
              <p>RAG’s core promise is not simply “better search.” It is a design pattern for connecting generative models to dynamic, inspectable knowledge—and for deciding when, where, and how that knowledge should shape an answer.</p>
            </div>
            <div className="citation">
              <span>Cite the source</span>
              <p>Yunfan Gao et al. “Retrieval-Augmented Generation for Large Language Models: A Survey.” arXiv:2312.10997, version 5.</p>
              <a href="https://arxiv.org/html/2312.10997v5" target="_blank" rel="noreferrer">Read the complete paper ↗</a>
            </div>
          </section>
        </article>

        <aside className="margin-notes" aria-label="Reading annotations">
          <div className="margin-card"><span className="note-index">Key idea</span><p>RAG keeps knowledge outside the model, so it can be updated without retraining model weights.</p></div>
          <div className="margin-card"><span className="note-index">Keep in mind</span><p>Retrieval is not automatically grounding. The generator can still ignore, distort, or over-trust evidence.</p></div>
          <div className="margin-card accent-note"><span className="note-index">Paper map</span><p><strong>Retrieval</strong> finds evidence.<br /><strong>Generation</strong> uses it.<br /><strong>Augmentation</strong> controls the loop.</p></div>
        </aside>
      </div>

      {glossaryOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setGlossaryOpen(false); }}>
          <section className="glossary-modal" role="dialog" aria-modal="true" aria-labelledby="glossary-title">
            <div className="modal-heading"><div><span className="eyebrow">Quick reference</span><h2 id="glossary-title">RAG glossary</h2></div><button onClick={() => setGlossaryOpen(false)} aria-label="Close glossary">×</button></div>
            <input autoFocus value={glossaryQuery} onChange={(event) => setGlossaryQuery(event.target.value)} placeholder="Search terms…" aria-label="Search glossary" />
            <div className="glossary-list">{filteredGlossary.map(([term, definition]) => <div key={term}><strong>{term}</strong><p>{definition}</p></div>)}{filteredGlossary.length === 0 && <p>No matching term.</p>}</div>
          </section>
        </div>
      )}
    </main>
  );
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  return <div className="section-label"><span>{number}</span><p>{title}</p></div>;
}

function Concept({ number, title, body }: { number: string; title: string; body: string }) {
  return <div className="concept"><span>{number}</span><h3>{title}</h3><p>{body}</p></div>;
}

function Future({ number, title, body }: { number: string; title: string; body: string }) {
  return <div className="future-card"><span>{number}</span><h3>{title}</h3><p>{body}</p></div>;
}
