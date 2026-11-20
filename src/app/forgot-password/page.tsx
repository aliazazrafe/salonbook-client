"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setMessage(error.message ?? "Could not request a password reset.");
        return;
      }

      setSent(true);
    } catch {
      setMessage("Could not reach the auth server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-stone-50 px-5 py-12 dark:bg-stone-950">
      <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-8">
        <Link href="/" className="text-xl font-bold text-stone-900 dark:text-white">
          Salon<span className="text-[#647548]">Book</span>
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-stone-900 dark:text-white">
          Forgot password?
        </h1>

        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">
          Enter your account email and we’ll send a reset link if an account exists.
        </p>

        {message && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
          >
            {message}
          </p>
        )}

        {sent ? (
          <p className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
            If an account exists for that email, a reset link will be sent.
            Check your inbox and spam folder.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="reset-email"
                className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
              >
                Email
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/15 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#647548] px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
          <Link href="/login" className="font-semibold text-[#647548] hover:underline">
            Back to Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}
