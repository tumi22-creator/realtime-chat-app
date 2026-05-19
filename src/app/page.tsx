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
      </div>
    </main>
  );
}