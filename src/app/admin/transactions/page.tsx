"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-fetch";

type Transaction = {
  _id: string;
  appointmentId: string;
  userId: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string | null;
};

type TransactionsResponse = {
  success: boolean;
  message?: string;
  transactions?: Transaction[];
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatAmount(amount: number, currency: string) {
  const normalizedCurrency = currency.toUpperCase();

  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: normalizedCurrency,
    }).format(amount / 100);
  } catch {
    return `${normalizedCurrency} ${(amount / 100).toFixed(2)}`;
  }
}

function formatDate(date: string | null) {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Date unavailable";

  return parsed.toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadTransactions() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await apiFetch(
          `${apiUrl}/api/admin/transactions`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result: TransactionsResponse = await response.json();

        if (
          !response.ok ||
          !result.success ||
          !Array.isArray(result.transactions)
        ) {
          throw new Error(result.message || "Could not load transactions.");
        }

        if (!cancelled) {
          setTransactions(result.transactions);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not connect to the server."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTransactions();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-10 dark:bg-stone-950 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="inline-flex rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100 dark:border-stone-600 dark:text-white dark:hover:bg-stone-900"
        >
          ← Admin Overview
        </Link>

        <header className="mb-8 mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
              SalonBook administration
            </p>
            <h1 className="mt-2 text-3xl font-bold text-stone-900 dark:text-white sm:text-4xl">
              Transaction History
            </h1>
            <p className="mt-3 text-stone-600 dark:text-stone-300">
              Successful Stripe payments recorded by the payment webhook.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRefreshKey((current) => current + 1)}
            disabled={loading}
            className="w-fit rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-100 disabled:opacity-60 dark:border-stone-600 dark:text-white dark:hover:bg-stone-900"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {errorMessage && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {errorMessage}
          </p>
        )}

        {loading && transactions.length === 0 ? (
          <p className="rounded-xl border border-stone-200 bg-white p-6 text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
            Loading transactions...
          </p>
        ) : transactions.length === 0 ? (
          <section className="rounded-2xl border border-stone-200 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-900">
            <h2 className="font-semibold text-stone-900 dark:text-white">
              No successful payments yet
            </h2>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
              Completed payments will appear here after Stripe confirms them.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            {transactions.map((transaction) => (
              <article
                key={transaction._id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-orange-700">
                      Appointment payment
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-stone-900 dark:text-white">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </h2>
                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-950 dark:text-green-300">
                    {transaction.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 border-t border-stone-100 pt-5 text-sm text-stone-600 dark:border-stone-800 dark:text-stone-300 sm:grid-cols-2">
                  <p className="break-all">
                    <span className="font-semibold text-stone-800 dark:text-white">
                      Appointment ID:
                    </span>{" "}
                    {transaction.appointmentId || "Unavailable"}
                  </p>
                  <p className="break-all">
                    <span className="font-semibold text-stone-800 dark:text-white">
                      Checkout Session:
                    </span>{" "}
                    {transaction.stripeCheckoutSessionId || "Unavailable"}
                  </p>
                  <p className="break-all sm:col-span-2">
                    <span className="font-semibold text-stone-800 dark:text-white">
                      Payment Intent:
                    </span>{" "}
                    {transaction.stripePaymentIntentId || "Unavailable"}
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}