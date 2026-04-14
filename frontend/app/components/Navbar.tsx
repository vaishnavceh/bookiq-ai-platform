export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="/"
          className="text-xl font-bold text-white transition hover:text-cyan-300"
        >
          📚 BookIQ
        </a>

        <div className="flex items-center gap-6 text-sm font-medium text-white/90">
          <a href="/" className="transition hover:text-cyan-300">
            Home
          </a>
          <a href="/ask" className="transition hover:text-cyan-300">
            Ask AI
          </a>
        </div>
      </div>
    </nav>
  );
}