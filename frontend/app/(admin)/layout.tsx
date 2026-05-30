"use client";

import Link from "next/link";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { theme, setTheme } = useTheme();

  async function handleLogout() {

    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-black dark:bg-gray-950 dark:text-white transition-colors duration-300">

      {/* SIDEBAR */}
      <div className="w-64 bg-black text-white p-6 hidden md:flex md:flex-col">

        <h1 className="text-3xl font-bold mb-10">
          SupportFlow AI
        </h1>

        <nav className="space-y-4 flex-1">

          <Link href="/dashboard">
            <div className="hover:bg-gray-800 p-3 rounded-lg cursor-pointer">
              Dashboard
            </div>
          </Link>

          <Link href="/tickets">
            <div className="hover:bg-gray-800 p-3 rounded-lg cursor-pointer">
              Tickets
            </div>
          </Link>

          <Link href="/analytics">
            <div className="hover:bg-gray-800 p-3 rounded-lg cursor-pointer">
              Analytics
            </div>
          </Link>

          <Link href="/customers">
            <div className="hover:bg-gray-800 p-3 rounded-lg cursor-pointer">
              Customers
            </div>
          </Link>

        </nav>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 p-3 rounded-lg"
        >
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1">

        {/* NAVBAR */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Admin Panel
          </h2>

          <div className="flex items-center gap-4">

            {/* THEME TOGGLE */}
            <button
              onClick={() =>
                setTheme(
                  theme === "dark"
                    ? "light"
                    : "dark"
                )
              }
              className="p-3 rounded-xl bg-gray-200 dark:bg-gray-800"
            >
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {/* PROFILE */}
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                A
              </div>

              <div>

                <p className="font-semibold">
                  Admin
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  SupportFlow AI
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* PAGE */}
        <div className="p-8">
          {children}
        </div>

      </div>

    </div>
  );
}