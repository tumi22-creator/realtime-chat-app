import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold">
          Real-Time Chat App
        </h1>

        <p className="mt-4 text-zinc-400">
          Built with Next.js, Socket.IO, MongoDB and Tailwind CSS
        </p>

        {/* ADD THIS */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700"
          >
            Signup
          </Link>
        </div>
      </div>
    </main>
  );
}