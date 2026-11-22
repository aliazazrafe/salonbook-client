"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api-fetch";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CATEGORIES = ["Skin Care", "Hair Treatment", "Spa & Massage"];

type OfferForm = {
  title: string;
  message: string;
  discountPercent: number;
  activeDays: string[];
  categories: string[];
  isActive: boolean;
};

type OfferResponse = {
  success: boolean;
  message?: string;
  offer?: Partial<OfferForm>;
};

const DEFAULT_FORM: OfferForm = {
  title: "Friday & Monday Special",
  message:
    "Offers may be changed or updated by the salon management at any time.",
  discountPercent: 47,
  activeDays: ["Friday", "Monday"],
  categories: ["Skin Care", "Hair Treatment", "Spa & Massage"],
  isActive: true,
};

export default function AdminOffersPage() {
  const [form, setForm] = useState<OfferForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function loadOffer() {
      setLoading(true);
      setError("");

      try {
        const response = await apiFetch(
          `${API_URL}/api/admin/offer-settings`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result: OfferResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load offer settings.");
        }

        if (result.offer) {
          setForm({
            ...DEFAULT_FORM,
            ...result.offer,
            activeDays: result.offer.activeDays || DEFAULT_FORM.activeDays,
            categories: result.offer.categories || DEFAULT_FORM.categories,
          });
        }
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not connect to the server."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadOffer();
  }, []);

  function toggleListValue(
    key: "activeDays" | "categories",
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await apiFetch(
        `${API_URL}/api/admin/offer-settings`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const result: OfferResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not save offer settings.");
      }

      setNotice(result.message || "Offer settings saved successfully.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not connect to the server."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-10 dark:bg-stone-950 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin"
          className="inline-flex rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100 dark:border-stone-600 dark:text-white dark:hover:bg-stone-900"
        >
          ← Admin Overview
        </Link>

        <header className="mb-8 mt-7">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#647548]">
            SalonBook administration
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900 dark:text-white sm:text-4xl">
            Manage Special Offer
          </h1>
          <p className="mt-3 text-stone-600 dark:text-stone-300">
            Update the offer shown to customers.
          </p>
        </header>

        {notice && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
          >
            {notice}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-8"
        >
          <div>
            <label
              htmlFor="offerTitle"
              className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
            >
              Offer title
            </label>
            <input
              id="offerTitle"
              required
              maxLength={100}
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] dark:border-stone-600 dark:bg-stone-800 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="offerMessage"
              className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
            >
              Offer message
            </label>
            <textarea
              id="offerMessage"
              required
              maxLength={300}
              rows={3}
              value={form.message}
              onChange={(event) =>
                setForm({ ...form, message: event.target.value })
              }
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] dark:border-stone-600 dark:bg-stone-800 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="discountPercent"
              className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
            >
              Discount percentage
            </label>
            <div className="flex max-w-xs items-center gap-3">
              <input
                id="discountPercent"
                type="number"
                min={1}
                max={100}
                required
                value={form.discountPercent}
                onChange={(event) =>
                  setForm({
                    ...form,
                    discountPercent: Number(event.target.value),
                  })
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] dark:border-stone-600 dark:bg-stone-800 dark:text-white"
              />
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                % off
              </span>
            </div>
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-stone-800 dark:text-stone-200">
              Active days
            </legend>
            <div className="flex flex-wrap gap-3">
              {DAYS.map((day) => (
                <label
                  key={day}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm dark:border-stone-700"
                >
                  <input
                    type="checkbox"
                    checked={form.activeDays.includes(day)}
                    onChange={() => toggleListValue("activeDays", day)}
                    className="accent-[#647548]"
                  />
                  {day}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-stone-800 dark:text-stone-200">
              Eligible service categories
            </legend>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm dark:border-stone-700"
                >
                  <input
                    type="checkbox"
                    checked={form.categories.includes(category)}
                    onChange={() => toggleListValue("categories", category)}
                    className="accent-[#647548]"
                  />
                  {category}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex w-fit cursor-pointer items-center gap-3 rounded-lg border border-stone-200 px-4 py-3 text-sm font-semibold dark:border-stone-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.checked })
              }
              className="accent-[#647548]"
            />
            Offer is active
          </label>

          <button
            type="submit"
            disabled={loading || saving}
            className="rounded-lg bg-[#647548] px-6 py-3 font-semibold text-white transition hover:bg-[#53643b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : saving ? "Saving..." : "Save Offer"}
          </button>
        </form>
      </div>
    </main>
  );
}
