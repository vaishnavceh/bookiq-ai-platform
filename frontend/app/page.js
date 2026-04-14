"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/books/")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Book Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
            <p className="text-sm text-gray-600 mb-1">Author: {book.author}</p>
            <p className="text-sm text-gray-600 mb-1">Genre: {book.genre}</p>
            <p className="text-sm text-gray-600 mb-1">Rating: {book.rating}</p>
            <p className="text-sm text-gray-700 mt-3">{book.description}</p>
            <a
              href={book.book_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 text-blue-600 font-medium"
            >
              View Book
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}