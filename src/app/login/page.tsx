"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        setMessage(error.message ?? "Sign in failed. Please try again.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setMessage("Could not reach the auth server. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: "google" | "facebook") {
    setMessage("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/login`,
      });

      if (error) {
        setMessage(error.message ?? "Social sign in failed. Please try again.");
        setLoading(false);
      }
    } catch {
      setMessage("Could not reach the auth server. Make sure it is running.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-stone-50 px-5 py-12 dark:bg-stone-950">
      <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-8">
        <Link
          href="/"
          className="text-xl font-bold text-stone-900 dark:text-white"
        >
          Salon<span className="text-[#647548]">Book</span>
        </Link>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-orange-700">
          Welcome back
        </p>

        <h1 className="mt-2 text-3xl font-bold text-stone-900 dark:text-white">
          Sign in to SalonBook
        </h1>

        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">
          Sign in to manage your appointments and grooming services.
        </p>

        {message && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
            >
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/15 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
            >
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/15 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
            />
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-[#647548] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#647548] px-5 py-3 font-semibold text-white transition hover:bg-[#53643b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
          <span className="text-xs uppercase text-stone-500">or</span>
          <span className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialSignIn("google")}
          className="w-full rounded-lg border border-stone-300 px-5 py-3 font-semibold text-stone-800 transition hover:bg-stone-50 disabled:opacity-60 dark:border-stone-600 dark:text-white dark:hover:bg-stone-800"
        >
          Continue with Google
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialSignIn("facebook")}
          className="mt-3 flex w-full items-center justify-center gap-3 rounded-lg border border-stone-300 bg-white px-5 py-3 font-semibold text-stone-800 transition hover:bg-stone-50 disabled:opacity-60 dark:border-stone-600 dark:bg-stone-900 dark:text-white dark:hover:bg-stone-800"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
            <path
              fill="#1877F2"
              d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.019 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.026 1.792-4.7 4.533-4.7 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.887v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.092 24 18.092 24 12.073Z"
            />
          </svg>
          Continue with Facebook
        </button>

        <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#647548] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </section>
    </main>
  );
}