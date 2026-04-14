"use client";

import { useState } from "react";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/ask/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data);
    } catch (error) {
      console.error("Ask failed:", error);
      setAnswer({
        error: "Something went wrong while asking the AI.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "N/A";
    const match = Math.max(0, Math.min(100, (1 - score) * 100));
    return `${match.toFixed(1)}%`;
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <p className="mb-2 text-sm uppercase tracking-widest text-cyan-300">
          Semantic AI Search
        </p>
        <h1 className="text-4xl font-bold">Ask the books anything</h1>
        <p className="mt-3 text-white/70">
          Ask about habits, routine, focus, productivity, genres, or summaries.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <textarea
            className="min-h-[130px] rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none placeholder:text-white/40"
            placeholder="Example: Which books can help improve my daily routine?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAsk}
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>

            <button
              onClick={() => {
                setQuestion("");
                setAnswer(null);
              }}
              className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-5 text-2xl font-semibold">AI Response</h2>

        {!answer && (
          <p className="text-white/60">
            Your top answer and source cards will appear here.
          </p>
        )}

        {answer?.error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-red-200">
            {answer.error}
          </div>
        )}

        {answer && !answer.error && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-cyan-300">
                Top Answer
              </p>
              <p className="mb-3 text-sm text-white/60">
                Query: {answer.question}
              </p>
              <p className="leading-7 text-white/90">{answer.answer}</p>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold">Source Cards</h3>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {answer.sources?.map((src: any, index: number) => (
                  <div
                    key={src.book_id}
                    className="rounded-2xl border border-white/10 bg-black/10 p-5 shadow-lg"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-cyan-300">
                          Source {index + 1}
                        </p>
                        <h4 className="text-lg font-semibold">{src.title}</h4>
                      </div>

                      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
                        Match {formatScore(src.score_hint)}
                      </div>
                    </div>

                    <p className="mb-3 text-sm text-white/65">
                      Genre: {src.genre || "Unknown"}
                    </p>

                    <a
                      href={src.book_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                      Open source →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}