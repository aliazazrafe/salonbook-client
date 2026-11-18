"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

const serviceOptions = [
  "Classic Haircut",
  "Skin Fade",
  "Haircut & Beard Combo",
  "Men’s Hair Coloring",
  "Grey Coverage",
  "Hair Treatment",
  "Scalp Treatment",
  "Men’s Facial",
  "Charcoal Facial",
  "Beard Shaping",
  "Men’s Manicure",
  "Scalp Massage",
];

const timeOptions = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

export default function BookAppointmentPage() {
  const [service, setService] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedService = params.get("service");

    if (selectedService) {
      setService(selectedService);
    }
  }, []);

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${apiUrl}/api/appointments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service,
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          date: formData.get("date"),
          time: formData.get("time"),
          notes: formData.get("notes"),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not save the appointment.");
      }

      setSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not connect to the server."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/services"
            className="text-sm font-semibold text-orange-800 hover:underline"
          >
            ← Back to services
          </Link>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
            SalonBook appointment
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Book Your Appointment
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Select a grooming service and choose a date and time that work for
            you.
          </p>
        </div>

        {submitted ? (
          <section
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <p className="text-sm font-bold uppercase tracking-wide text-green-700">
              Request submitted
            </p>

            <h2 className="mt-2 text-2xl font-bold text-stone-900">
              Your appointment request has been saved
            </h2>

            <p className="mt-3 leading-7 text-stone-600">
              Your request is pending. Payment status is unpaid.
            </p>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-orange-800"
            >
              Book another appointment
            </button>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="service"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Choose a service
                </label>

                <select
                  id="service"
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  required
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15"
                >
                  <option value="">Select a salon service</option>
                  {serviceOptions.map((serviceName) => (
                    <option key={serviceName} value={serviceName}>
                      {serviceName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="customer-name"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Full name
                </label>
                <input
                  id="customer-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-phone"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Phone number
                </label>
                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-email"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Email address
                </label>
                <input
                  id="customer-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15"
                />
              </div>

              <div>
                <label
                  htmlFor="appointment-date"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Appointment date
                </label>
                <input
                  id="appointment-date"
                  name="date"
                  type="date"
                  min={minDate}
                  required
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="appointment-time"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Preferred time
                </label>
                <select
                  id="appointment-time"
                  name="time"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15"
                >
                  <option value="" disabled>
                    Select a time
                  </option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="appointment-notes"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Notes{" "}
                  <span className="font-normal text-stone-500">(optional)</span>
                </label>
                <textarea
                  id="appointment-notes"
                  name="notes"
                  rows={4}
                  placeholder="Add any preference or special request"
                  className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15"
                />
              </div>
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="mt-5 text-sm font-medium text-red-700"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 w-full rounded-lg bg-stone-900 px-5 py-3.5 font-semibold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? "Saving..." : "Send Appointment Request"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}