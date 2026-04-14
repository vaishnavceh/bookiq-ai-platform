"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BookDetail() {
  const params = useParams();
  const id = params.id;

  const [book, setBook] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/books/${id}/`)
      .then((res) => res.json())
      .then((data) => setBook(data));

    fetch(`http://127.0.0.1:8000/api/books/${id}/recommendations/`)
      .then((res) => res.json())
      .then((data) => setRecommendations(data.recommendations || []));
  }, [id]);

  if (!book) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur-xl">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm uppercase tracking-widest text-cyan-300">
              Book Details
            </p>
            <h1 className="text-4xl font-bold">{book.title}</h1>
            <p className="mt-2 text-white/70">{book.author || "Unknown Author"}</p>
          </div>

          <div className="rounded-2xl border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-yellow-200">
            ⭐ {book.rating ?? "N/A"}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
            {book.genre || "Unknown Genre"}
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/75">
            Reviews: {book.reviews_count ?? 0}
          </span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
            {book.sentiment || "Neutral"}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
            <h2 className="mb-3 text-xl font-semibold">Description</h2>
            <p className="leading-7 text-white/75">
              {book.description || "No description available."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
            <h2 className="mb-3 text-xl font-semibold">AI Summary</h2>
            <p className="leading-7 text-white/75">
              {book.summary || "No summary available."}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <a
            href={book.book_url}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Open Source Link
          </a>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-5 text-2xl font-semibold">Recommendations</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <a
                key={rec.id}
                href={`/book/${rec.id}`}
                className="rounded-2xl border border-white/10 bg-black/10 p-5 transition hover:bg-white/10"
              >
                <h3 className="text-lg font-semibold">{rec.title}</h3>
                <p className="mt-1 text-sm text-white/60">{rec.author}</p>
                <p className="mt-3 line-clamp-2 text-sm text-white/70">
                  {rec.description}
                </p>
              </a>
            ))
          ) : (
            <p className="text-white/65">No recommendations found.</p>
          )}
        </div>
      </section>
    </main>
  );
}