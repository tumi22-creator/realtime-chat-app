"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {

  const router =
    useRouter();

  const [username,
    setUsername] =
    useState("");

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      const res =
        await fetch(
          "/api/signup",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              username,
              email,
              password,
            }),
          }
        );

      if (res.ok) {
        router.push("/login");
      }

    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">

      <form
        onSubmit={
          handleSubmit
        }
        className="w-full max-w-md rounded-xl bg-zinc-900 p-8"
      >

        <h1 className="mb-6 text-3xl font-bold">
          Create Account
        </h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          className="mb-4 w-full rounded p-3 text-white"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="mb-4 w-full rounded p-3 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="mb-4 w-full rounded p-3 text-white"
        />

        <button
          type="submit"
          className="w-full rounded bg-blue-600 p-3"
        >
          Sign Up
        </button>

      </form>

    </div>
  );
}