"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/chat");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8">
        <h1 className="mb-6 text-3xl font-bold text-white">
          Login
        </h1>

        <div className="space-y-4">
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
            onClick={handleLogin}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white"
          >
            Login
          </button>

        </div>
        <p className="mt-4 text-center">
  Don't have an account?
  <Link
    href="/signup"
    className="ml-2 text-blue-500"
  >
    Sign Up
  </Link>
</p>
      </div>
      
    </main>

    
  );
}