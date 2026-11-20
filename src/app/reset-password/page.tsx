"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));

    if (params.get("error")) {
      setMessage("This reset link is invalid or expired. Request a new one.");
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Reset link is missing or expired. Request a new one.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setMessage(error.message ?? "Could not reset your password.");
        return;
      }

      setComplete(true);
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
          Reset password
        </h1>

        {message && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
          >
            {message}
          </p>
        )}

        {complete ? (
          <div className="mt-6">
            <p className="text-sm text-green-800">
              Password changed successfully.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block font-semibold text-[#647548] hover:underline"
            >
              Sign in with your new password
            </Link>
          </div>
        ) : token === undefined ? (
          <p className="mt-6 text-sm text-stone-600">Loading reset link...</p>
        ) : token === null ? (
          <Link
            href="/forgot-password"
            className="mt-6 inline-block font-semibold text-[#647548] hover:underline"
          >
            Request a new reset link
          </Link>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
              >
                New password
              </label>
              <input
                id="new-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/15 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
              >
                Confirm new password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/15 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#647548] px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
          <Link
            href="/login"
            className="font-semibold text-[#647548] hover:underline"
          >
            Back to Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}
