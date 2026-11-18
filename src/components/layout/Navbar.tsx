"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const visibleNavLinks = session
    ? [
        ...navLinks.slice(0, 2),
        { label: "Dashboard", href: "/dashboard" },
        ...navLinks.slice(2),
      ]
    : navLinks;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  function toggleTheme() {
    const nextTheme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("salonbook-theme", nextTheme);
    setTheme(nextTheme);
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    setSignOutError("");

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setSignOutError(result.error.message || "Could not sign out.");
        return;
      }

      setMenuOpen(false);
      router.replace("/");
      router.refresh();
    } catch {
      setSignOutError("Could not reach the auth server. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  function renderDesktopAuth() {
    if (sessionPending) {
      return <div className="h-10 w-28" aria-hidden="true" />;
    }

    if (session) {
      return (
        <div className="flex items-center gap-3">
          <span
            className="max-w-36 truncate text-sm font-medium text-stone-700 dark:text-stone-200"
            title={session.user.name || session.user.email}
          >
            {session.user.name || session.user.email}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="whitespace-nowrap rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-600 dark:text-white dark:hover:bg-stone-800"
          >
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      );
    }

    return (
      <>
        <Link
          href="/login"
          className="whitespace-nowrap px-2 py-2 text-sm font-medium text-stone-700 hover:text-[#647548] dark:text-stone-200"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="whitespace-nowrap rounded-lg bg-[#647548] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#53643b]"
        >
          Sign Up
        </Link>
      </>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#f7f7f3] dark:border-stone-700 dark:bg-stone-900">
      <nav className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <span className="block whitespace-nowrap text-2xl font-bold leading-none tracking-tight text-stone-900 dark:text-white sm:text-3xl">
            Salon<span className="text-[#647548]">Book</span>
          </span>
          <span className="mt-1.5 block whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 sm:text-[10px]">
            Men’s Salon & Grooming
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          {visibleNavLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-stone-600 transition hover:text-[#647548] dark:text-stone-300 dark:hover:text-lime-300"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-800 transition hover:bg-stone-100 dark:border-stone-600 dark:bg-stone-800 dark:text-amber-300 dark:hover:bg-stone-700"
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

          <div className="hidden items-center gap-3 sm:flex">
            {renderDesktopAuth()}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 text-stone-800 dark:border-stone-600 dark:text-white sm:hidden"
          >
            <span className="text-xl leading-none">{menuOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-stone-200 bg-[#f7f7f3] px-4 pb-4 pt-2 dark:border-stone-700 dark:bg-stone-900 sm:hidden">
          <div className="mx-auto flex max-w-7xl flex-col">
            {visibleNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
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
                    className="rounded-lg border border-stone-300 px-4 py-2.5 text-center text-sm font-semibold text-stone-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-600 dark:text-white"
                  >
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg border border-stone-300 px-4 py-2.5 text-center text-sm font-semibold text-stone-800 dark:border-stone-600 dark:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-[#647548] px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {signOutError && (
              <p
                role="alert"
                className="mt-3 text-sm text-red-600 dark:text-red-400"
              >
                {signOutError}
              </p>
            )}
          </div>
        </div>
      )}

      {signOutError && !menuOpen && (
        <p
          role="alert"
          className="mx-auto max-w-7xl px-4 pb-3 text-sm text-red-600 dark:text-red-400 sm:px-6 lg:px-8"
        >
          {signOutError}
        </p>
      )}
    </header>
  );
}