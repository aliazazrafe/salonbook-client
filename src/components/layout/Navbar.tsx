"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const navLinks = session
    ? [
        ...publicLinks.slice(0, 2),
        { label: "Dashboard", href: (session.user as { role?: string }).role === "admin" ? "/admin" : "/dashboard" },
        ...publicLinks.slice(2),
      ]
    : publicLinks;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/services") return pathname.startsWith("/services");

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage("");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setErrorMessage(error.message ?? "Could not sign out. Please try again.");
        return;
      }

      setMenuOpen(false);
      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage("Could not reach the auth server. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  function getInitials(name?: string | null, email?: string | null) {
    const value = name?.trim() || email?.trim() || "User";

    return value
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }

  function ThemeButton({ compact = false }: { compact?: boolean }) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className={`flex shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-800 transition hover:bg-stone-100 dark:border-stone-600 dark:bg-stone-800 dark:text-amber-300 dark:hover:bg-stone-700 ${
          compact ? "h-10 w-10" : "h-11 w-11"
        }`}
      >
        {isDark ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-5 w-5"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-5 w-5"
          >
            <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-[#f7f7f3] dark:bg-stone-900">
      <nav className="mx-auto flex min-h-[88px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          aria-label="SalonBook home"
          className="shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <span className="block whitespace-nowrap text-3xl font-bold leading-none tracking-tight text-stone-950 dark:text-white">
            Salon<span className="text-[#647548]">Book</span>
          </span>
          <span className="mt-2 block whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
            Men’s Salon & Grooming
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-stone-200 bg-white/80 p-1 shadow-sm xl:flex dark:border-stone-700 dark:bg-stone-800">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-4 py-3 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-stone-950 text-white shadow-sm dark:bg-white dark:text-stone-950"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-700 dark:hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <ThemeButton />

          {sessionPending ? (
            <div className="h-11 w-28" aria-hidden="true" />
          ) : session ? (
            <>
              <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-2 py-1.5 dark:border-stone-700 dark:bg-stone-800">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#647548] text-xs font-bold text-white">
                  {getInitials(session.user.name, session.user.email)}
                </span>
                <span className="max-w-32 truncate px-1 text-sm font-medium text-stone-700 dark:text-stone-200">
                  {session.user.name || session.user.email}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="whitespace-nowrap rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-600 dark:text-white dark:hover:bg-stone-800"
              >
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-3 text-sm font-medium text-stone-700 transition hover:text-[#647548] dark:text-stone-200"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#647548] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#53643b]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          <ThemeButton compact />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-xl text-stone-800 dark:border-stone-600 dark:text-white"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="bg-[#f7f7f3] px-5 pb-5 xl:hidden dark:bg-stone-900">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-stone-950 text-white dark:bg-white dark:text-stone-950"
                    : "text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 border-t border-stone-200 pt-4 dark:border-stone-700">
              {sessionPending ? (
                <div className="h-10" aria-hidden="true" />
              ) : session ? (
                <div className="flex flex-col gap-3">
                  <span className="px-3 text-sm font-medium text-stone-700 dark:text-stone-200">
                    {session.user.name || session.user.email}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="rounded-xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-100 disabled:opacity-60 dark:border-stone-600 dark:text-white dark:hover:bg-stone-800"
                  >
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl border border-stone-300 px-4 py-3 text-center text-sm font-semibold text-stone-800 dark:border-stone-600 dark:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl bg-[#647548] px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {errorMessage && (
              <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
            )}
          </nav>
        </div>
      )}

      {errorMessage && !menuOpen && (
        <p
          role="alert"
          className="mx-auto max-w-7xl px-5 pb-3 text-sm text-red-600 sm:px-8 dark:text-red-400"
        >
          {errorMessage}
        </p>
      )}
    </header>
  );
}
