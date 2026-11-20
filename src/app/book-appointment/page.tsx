"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

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

type ApiService = {
  _id?: string;
  id?: string;
  serviceName?: string;
  name?: string;
  status?: string;
  isActive?: boolean;
};

type ServicesResponse = {
  success?: boolean;
  message?: string;
  services?: ApiService[];
};

type ServiceOption = {
  id: string;
  name: string;
};

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:placeholder:text-stone-500";

const labelClass =
  "mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200";

export default function BookAppointmentPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [services, setServices] = useState<ServiceOption[]>([]);
  const [service, setService] = useState("");
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");
  const [minDate, setMinDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const isAdmin = userRole?.toLowerCase() === "admin";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedService = params.get("service");

    if (selectedService) {
      setService(selectedService);
    }

    const today = new Date();
    setMinDate(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(today.getDate()).padStart(2, "0")}`
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      setServicesLoading(true);
      setServicesError("");

      try {
        const response = await fetch(
          `${API_URL}/api/services?status=active&limit=50`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result: ServicesResponse = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.services)) {
          throw new Error(result.message || "Could not load salon services.");
        }

        const activeServices = result.services
          .filter(
            (item) =>
              item.isActive === true ||
              item.status?.toLowerCase() === "active"
          )
          .map((item, index) => ({
            id: item._id || item.id || `service-${index}`,
            name: item.serviceName || item.name || "",
          }))
          .filter((item) => item.name);

        setServices(activeServices);

        setService((current) => {
          const match = activeServices.find(
            (item) => item.name.toLowerCase() === current.toLowerCase()
          );
          return match?.name || "";
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setServicesError(
          error instanceof Error
            ? error.message
            : "Could not connect to the server."
        );
      } finally {
        if (!controller.signal.aborted) {
          setServicesLoading(false);
        }
      }
    }

    void loadServices();

    return () => controller.abort();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
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

  if (sessionPending) {
    return (
      <main className="min-h-screen bg-stone-50 px-5 py-16 dark:bg-stone-950 sm:px-8">
        <p className="mx-auto max-w-5xl text-stone-600 dark:text-stone-300">
          Checking your account...
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-stone-50 px-5 py-16 dark:bg-stone-950 sm:px-8">
        <section className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-8 text-center dark:border-stone-800 dark:bg-stone-900">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
            Sign in to request an appointment
          </h1>
          <p className="mt-3 text-stone-600 dark:text-stone-300">
            Please sign in to your SalonBook account before booking.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
          >
            Sign In
          </Link>
        </section>
      </main>
    );
  }

  if (isAdmin) {
    return (
      <main className="min-h-screen bg-stone-50 px-5 py-16 dark:bg-stone-950 sm:px-8">
        <section className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-8 text-center dark:border-stone-800 dark:bg-stone-900">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
            Customer booking only
          </h1>
          <p className="mt-3 text-stone-600 dark:text-stone-300">
            Admin accounts cannot request customer appointments.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
          >
            Browse Services
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 dark:bg-stone-950 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/services"
            className="text-sm font-semibold text-orange-800 hover:underline dark:text-orange-400"
          >
            ← Back to services
          </Link>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-400">
            SalonBook appointment
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
            Book Your Appointment
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600 dark:text-stone-300">
            Select a grooming service and choose a date and time that work for
            you.
          </p>
        </div>

        {submitted ? (
          <section
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm dark:border-green-900 dark:bg-stone-900 sm:p-8"
          >
            <p className="text-sm font-bold uppercase tracking-wide text-green-700 dark:text-green-400">
              Request submitted
            </p>

            <h2 className="mt-2 text-2xl font-bold text-stone-900 dark:text-white">
              Your appointment request has been saved
            </h2>

            <p className="mt-3 leading-7 text-stone-600 dark:text-stone-300">
              Your request is pending. Payment status is unpaid.
            </p>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
            >
              Book another appointment
            </button>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="service" className={labelClass}>
                  Choose a service
                </label>

                <select
                  id="service"
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  required
                  disabled={servicesLoading || services.length === 0}
                  className={inputClass}
                >
                  <option value="">
                    {servicesLoading
                      ? "Loading services..."
                      : "Select a salon service"}
                  </option>

                  {services.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {servicesError && (
                  <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-400">
                    {servicesError}
                  </p>
                )}

                {!servicesLoading &&
                  !servicesError &&
                  services.length === 0 && (
                    <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                      No active services are available right now.
                    </p>
                  )}
              </div>

              <div>
                <label htmlFor="customer-name" className={labelClass}>
                  Full name
                </label>
                <input
                  id="customer-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  defaultValue={session.user.name || ""}
                  required
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className={labelClass}>
                  Phone number
                </label>
                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="customer-email" className={labelClass}>
                  Email address
                </label>
                <input
                  id="customer-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={session.user.email || ""}
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="appointment-date" className={labelClass}>
                  Appointment date
                </label>
                <input
                  id="appointment-date"
                  name="date"
                  type="date"
                  min={minDate}
                  required
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="appointment-time" className={labelClass}>
                  Preferred time
                </label>
                <select
                  id="appointment-time"
                  name="time"
                  required
                  defaultValue=""
                  className={inputClass}
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
                <label htmlFor="appointment-notes" className={labelClass}>
                  Notes{" "}
                  <span className="font-normal text-stone-500 dark:text-stone-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="appointment-notes"
                  name="notes"
                  rows={4}
                  placeholder="Add any preference or special request"
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>

            {errorMessage && (
              <p role="alert" className="mt-5 text-sm font-medium text-red-700 dark:text-red-400">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || servicesLoading || services.length === 0}
              className="mt-7 w-full rounded-lg bg-stone-900 px-5 py-3.5 font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 sm:w-auto"
            >
              {isSubmitting ? "Saving..." : "Send Appointment Request"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}