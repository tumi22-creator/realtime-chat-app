"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await fetch("/api/register", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (res.ok) {
      router.push("/login");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8">
        <h1 className="mb-6 text-3xl font-bold text-white">
          Register
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-lg bg-zinc-800 p-3 text-white outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg bg-zinc-800 p-3 text-white outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg bg-zinc-800 p-3 text-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white"
          >
            Create Account
          </button>
        </div>
      </div>
    </main>
  );
}