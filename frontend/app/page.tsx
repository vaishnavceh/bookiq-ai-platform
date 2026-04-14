"use client";

import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/books/")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  const filteredBooks = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return books;

    return books.filter((book) => {
      return (
        String(book.title || "").toLowerCase().includes(query) ||
        String(book.author || "").toLowerCase().includes(query) ||
        String(book.genre || "").toLowerCase().includes(query) ||
        String(book.description || "").toLowerCase().includes(query)
      );
    });
  }, [books, search]);

  const stats = useMemo(() => {
    const totalBooks = books.length;

    const booksWithRating = books.filter(
      (book) => book.rating !== null && book.rating !== undefined && !isNaN(Number(book.rating))
    );

    const avgRating =
      booksWithRating.length > 0
        ? (
            booksWithRating.reduce((sum, book) => sum + Number(book.rating), 0) /
            booksWithRating.length
          ).toFixed(2)
        : "N/A";

    const totalReviews = books.reduce(
      (sum, book) => sum + Number(book.reviews_count || 0),
      0
    );

    return { totalBooks, avgRating, totalReviews };
  }, [books]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section className="mb-10 rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <p className="mb-3 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-200">
          AI-Powered Book Intelligence Platform
        </p>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Discover, analyze, and explore books with semantic AI.
        </h1>

        <p className="mt-4 max-w-2xl text-base text-white/75 md:text-lg">
          Scraped with Selenium, stored in Django + MySQL, retrieved through semantic search, and displayed in a polished frontend.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="/ask"
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:scale-105 hover:bg-cyan-400"
          >
            Ask AI
          </a>
          <a
            href="http://127.0.0.1:8000/api/books/"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white transition hover:scale-105 hover:bg-white/15"
          >
            Open API
          </a>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15">
          <p className="text-sm text-cyan-300">Total Books</p>
          <h2 className="mt-2 text-3xl font-bold">{stats.totalBooks}</h2>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15">
          <p className="text-sm text-cyan-300">Average Rating</p>
          <h2 className="mt-2 text-3xl font-bold">{stats.avgRating}</h2>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15">
          <p className="text-sm text-cyan-300">Total Reviews</p>
          <h2 className="mt-2 text-3xl font-bold">{stats.totalReviews}</h2>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Books Dashboard</h2>
            <p className="text-white/60">
              Showing {filteredBooks.length} of {books.length} books
            </p>
          </div>

          <div className="w-full md:w-[360px]">
            <input
              type="text"
              placeholder="Search by title, author, genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-3 text-white outline-none placeholder:text-white/40"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="group rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:rotate-[0.2deg] hover:bg-white/15 hover:shadow-cyan-500/10"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white transition group-hover:text-cyan-300">
                  {book.title}
                </h3>
                <p className="mt-1 text-sm text-white/65">
                  {book.author || "Unknown Author"}
                </p>
              </div>

              <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-sm text-yellow-200 transition group-hover:scale-105">
                ⭐ {book.rating ? `${book.rating}/5` : "N/A"}
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                {book.genre || "Unknown"}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/75">
                Reviews: {book.reviews_count ?? 0}
              </span>
            </div>

            <p className="line-clamp-3 text-sm leading-6 text-white/75">
              {book.description || "No description available."}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <a
                href={`/book/${book.id}`}
                className="font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                View Details →
              </a>

              <a
                href={book.book_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/60 transition hover:text-white"
              >
                Source
              </a>
            </div>
          </div>
        ))}
      </section>

      {filteredBooks.length === 0 && (
        <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-8 text-center shadow-xl backdrop-blur-xl">
          <p className="text-lg text-white/70">No books found for this search.</p>
        </section>
      )}
    </main>
  );
}