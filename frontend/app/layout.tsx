import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "BookIQ",
  description: "AI-powered book intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#07111f] text-white">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute right-[-5%] top-[10%] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[20%] h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        </div>

        <Navbar />
        {children}
      </body>
    </html>
  );
}