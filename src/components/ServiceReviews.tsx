"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

type Review = {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string | null;
};

type ReviewResponse = {
  success?: boolean;
  message?: string;
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
};

export default function ServiceReviews({
  serviceId,
}: {
  serviceId: string;
}) {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/services/${encodeURIComponent(serviceId)}/reviews`,
        { cache: "no-store" }
      );
      const result: ReviewResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load reviews.");
      }

      setReviews(result.reviews || []);
      setAverageRating(result.averageRating || 0);
      setReviewCount(result.reviewCount || 0);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/api/services/${encodeURIComponent(serviceId)}/reviews`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, comment }),
        }
      );

      const result: ReviewResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not submit your review.");
      }

      setComment("");
      setRating(5);
      setNotice(result.message || "Review submitted successfully.");
      await loadReviews();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not connect to the server."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
            Customer Reviews
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            {reviewCount > 0
              ? `${averageRating} out of 5 · ${reviewCount} review${reviewCount === 1 ? "" : "s"}`
              : "No reviews yet"}
          </p>
        </div>
        {reviewCount > 0 && (
          <p className="text-xl font-bold text-amber-500" aria-label={`${averageRating} out of 5 stars`}>
            {"★".repeat(Math.round(averageRating))}
            <span className="text-stone-300 dark:text-stone-700">
              {"★".repeat(5 - Math.round(averageRating))}
            </span>
          </p>
        )}
      </div>

      {notice && (
        <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950/40 dark:text-green-300">
          {notice}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {sessionPending ? (
        <p className="mt-6 text-sm text-stone-500">Checking your account...</p>
      ) : !session ? (
        <p className="mt-6 text-sm text-stone-600 dark:text-stone-300">
          <Link href="/login" className="font-semibold text-[#647548] underline">
            Sign in
          </Link>{" "}
          to leave a review after a confirmed appointment.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 border-t border-stone-200 pt-6 dark:border-stone-800">
          <label className="block text-sm font-semibold text-stone-800 dark:text-stone-200">
            Your rating
          </label>

          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`Rate ${value} out of 5`}
                onClick={() => setRating(value)}
                className={`text-3xl transition ${
                  value <= rating ? "text-amber-500" : "text-stone-300 dark:text-stone-700"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <label
            htmlFor={`review-${serviceId}`}
            className="mt-4 block text-sm font-semibold text-stone-800 dark:text-stone-200"
          >
            Your review
          </label>
          <textarea
            id={`review-${serviceId}`}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            minLength={8}
            maxLength={1000}
            required
            rows={4}
            placeholder="Share your experience with this service"
            className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] dark:border-stone-700 dark:bg-stone-800 dark:text-white"
          />

          <button
            type="submit"
            disabled={submitting || comment.trim().length < 8}
            className="mt-4 rounded-lg bg-[#647548] px-5 py-3 font-semibold text-white transition hover:bg-[#53643b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      <div className="mt-7 space-y-4">
        {loading ? (
          <p className="text-sm text-stone-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Be the first to review this service after your appointment.
          </p>
        ) : (
          reviews.map((review) => (
            <article
              key={review._id}
              className="rounded-xl bg-stone-50 p-4 dark:bg-stone-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-stone-900 dark:text-white">
                  {review.userName}
                </h3>
                <span className="text-amber-500">
                  {"★".repeat(review.rating)}
                  <span className="text-stone-300 dark:text-stone-700">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-700 dark:text-stone-300">
                {review.comment}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
