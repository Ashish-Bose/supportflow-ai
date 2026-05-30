"use client";

import Link from "next/link";
import {
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type CurrentUser = {
  name: string;
  email: string;
  role: "admin" | "viewer";
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] =
  useState(false);

const [
  mobileSidebarOpen,
  setMobileSidebarOpen,
] = useState(false);
  const [user, setUser] =
    useState<CurrentUser | null>(null);
  const menuRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((response) =>
        response.ok
          ? response.json()
          : null
      )
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    function handleClick(
      event: MouseEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-black dark:bg-gray-950 dark:text-white transition-colors duration-300">
      <aside className="sticky top-0 h-screen w-64 shrink-0 bg-black text-white p-6 hidden md:flex md:flex-col">
        <div className="mb-10">
          <h1 className="text-2xl font-bold leading-tight">
            SupportFlow AI
          </h1>
          <p className="text-sm text-gray-400">
            by Ashish Bose
          </p>
        </div>

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
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">

  <button
    type="button"
    onClick={() =>
      setMobileSidebarOpen(
        !mobileSidebarOpen
      )
    }
    className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-800"
  >
    {mobileSidebarOpen ? (
      <X size={20} />
    ) : (
      <Menu size={20} />
    )}
  </button>

  <h2 className="text-xl font-bold">
    Admin Panel
  </h2>

</div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setTheme(
                  theme === "dark"
                    ? "light"
                    : "dark"
                )
              }
              className="p-3 rounded-xl bg-gray-200 dark:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <div
              className="relative"
              ref={menuRef}
            >
              <button
                type="button"
                onClick={() =>
                  setMenuOpen(
                    (open) => !open
                  )
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user?.role === "viewer"
                    ? "D"
                    : "A"}
                </div>

                <div className="text-left hidden sm:block">
                  <p className="font-semibold leading-tight">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.role === "viewer"
                      ? "View-only demo"
                      : "SupportFlow AI"}
                  </p>
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                    <p className="font-semibold">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-gray-500 cursor-not-allowed"
                    disabled
                  >
                    <Settings size={16} />
                    Edit profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        {mobileSidebarOpen && (
  <div className="md:hidden bg-black text-white border-b border-gray-800">

    <nav className="p-4 space-y-2">

      <Link
        href="/dashboard"
        onClick={() =>
          setMobileSidebarOpen(false)
        }
      >
        <div className="hover:bg-gray-800 p-3 rounded-lg">
          Dashboard
        </div>
      </Link>

      <Link
        href="/tickets"
        onClick={() =>
          setMobileSidebarOpen(false)
        }
      >
        <div className="hover:bg-gray-800 p-3 rounded-lg">
          Tickets
        </div>
      </Link>

      <Link
        href="/analytics"
        onClick={() =>
          setMobileSidebarOpen(false)
        }
      >
        <div className="hover:bg-gray-800 p-3 rounded-lg">
          Analytics
        </div>
      </Link>

      <Link
        href="/customers"
        onClick={() =>
          setMobileSidebarOpen(false)
        }
      >
        <div className="hover:bg-gray-800 p-3 rounded-lg">
          Customers
        </div>
      </Link>

    </nav>

  </div>
)}

        {user?.role === "viewer" && (
          <div className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200 px-8 py-3 text-sm border-b border-blue-100 dark:border-blue-900 flex items-center gap-2">
            <User size={16} />
            Demo mode is view-only. Editing actions are disabled.
          </div>
        )}

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
