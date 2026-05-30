"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl"
      >

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Admin Login
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Sign in to access the SupportFlow AI dashboard
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="demo@supportflow.ai"
            className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black p-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Login
        </button>

        <div className="mt-8 p-4 bg-black border border-zinc-800 rounded-xl">

          <p className="text-sm font-semibold text-white mb-2">
            Demo Credentials
          </p>

          <p className="text-sm text-gray-400">
            Email:
            <span className="text-white ml-2">
              demo@supportflow.ai
            </span>
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Password:
            <span className="text-white ml-2">
              SupportFlowDemo123
            </span>
          </p>

        </div>

      </form>

    </div>
  );
}