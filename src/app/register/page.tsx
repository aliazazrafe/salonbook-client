"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const image = String(formData.get("image") || "").trim();
    const password = String(formData.get("password") || "");

    if (
      password.length < 6 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password)
    ) {
      setMessage(
        "Use at least 6 characters, including one uppercase and one lowercase letter."
      );
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
        role: "customer",
        callbackURL: "/",
      });

      if (error) {
        setMessage(
          error.message ?? "Account creation failed. Please try again."
        );
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

  async function handleSocialSignIn(provider: "google") {
    setMessage("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/register`,
      });

      if (error) {
        setMessage(error.message ?? "Social sign up failed. Please try again.");
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
          Join SalonBook
        </p>

        <h1 className="mt-2 text-3xl font-bold text-stone-900 dark:text-white">
          Create your account
        </h1>

        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">
          Create an account to manage your salon appointments.
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
              htmlFor="register-name"
              className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
            >
              Full Name
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/15 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
            >
              Email
            </label>
            <input
              id="register-email"
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
              htmlFor="register-image"
              className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
            >
              Profile Image URL{" "}
              <span className="font-normal text-stone-500">(optional)</span>
            </label>
            <input
              id="register-image"
              name="image"
              type="url"
              placeholder="https://example.com/profile.jpg"
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/15 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
            >
              Password
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              pattern="(?=.*[a-z])(?=.*[A-Z]).{6,}"
              title="Use at least 6 characters, including one uppercase and one lowercase letter."
              required
              placeholder="At least 6 characters"
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/15 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
            />
            <p className="mt-2 text-xs leading-5 text-stone-500 dark:text-stone-400">
              Use at least 6 characters, including one uppercase and one
              lowercase letter.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#647548] px-5 py-3 font-semibold text-white transition hover:bg-[#53643b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
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
          Sign Up with Google
        </button>

        

        <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#647548] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}

