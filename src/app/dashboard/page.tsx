"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const fallbackImage = "/heroimage/gent-salon.png";

type Appointment = {
  _id: string;
  service: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  notes?: string;
  status: string;
  paymentStatus: string;
  createdAt?: string;
};

type ServiceInfo = {
  name: string;
  category: string;
  price: number;
  image: string;
};

type AppointmentsResponse = {
  success?: boolean;
  message?: string;
  appointments?: Appointment[];
};

type ServicesResponse = {
  success?: boolean;
  services?: Array<{
    _id?: string;
    serviceName?: string;
    name?: string;
    category?: string;
    price?: number;
    image?: string;
    imageUrl?: string;
    images?: string[];
    status?: string;
    isActive?: boolean;
  }>;
};

function formatDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatRequestDate(date?: string) {
  if (!date) return "";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(price: number) {
  return `৳${new Intl.NumberFormat("en-BD").format(price)}`;
}

function statusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300";
    default:
      return "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300";
  }
}

function paymentClasses(status: string) {
  return status.toLowerCase() === "paid"
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300"
    : "bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-200";
}

export default function DashboardPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [serviceInfo, setServiceInfo] = useState<Record<string, ServiceInfo>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [cancelingId, setCancelingId] = useState("");
  const [payingId, setPayingId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const userId = session?.user?.id;

  useEffect(() => {
    if (sessionPending) return;

    if (!userId) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadDashboard() {
      setLoading(true);
      setErrorMessage("");

      try {
        const appointmentsResponse = await fetch(
          `${API_URL}/api/appointments/mine`,
          {
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const appointmentsResult: AppointmentsResponse =
          await appointmentsResponse.json();

        if (!appointmentsResponse.ok || !appointmentsResult.success) {
          throw new Error(
            appointmentsResult.message || "Could not load appointments."
          );
        }

        setAppointments(appointmentsResult.appointments ?? []);

        // Service details enrich appointment cards when the service is active.
        try {
          const servicesResponse = await fetch(
            `${API_URL}/api/services?status=active&limit=50`,
            {
              cache: "no-store",
              signal: controller.signal,
            }
          );

          if (servicesResponse.ok) {
            const servicesResult: ServicesResponse =
              await servicesResponse.json();

            const details: Record<string, ServiceInfo> = {};

            for (const service of servicesResult.services ?? []) {
              const active =
                service.isActive === true ||
                service.status?.toLowerCase() === "active";
              const name = service.serviceName || service.name;

              if (!active || !name) continue;

              details[name.trim().toLowerCase()] = {
                name,
                category: service.category || "Grooming",
                price: typeof service.price === "number" ? service.price : 0,
                image:
                  service.image ||
                  service.imageUrl ||
                  service.images?.[0] ||
                  fallbackImage,
              };
            }

            setServiceInfo(details);
          }
        } catch {
          // Appointment data remains usable if service details cannot load.
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not connect to the server."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => controller.abort();
  }, [refreshKey, sessionPending, userId]);

  const counts = useMemo(() => {
    return appointments.reduce(
      (summary, appointment) => {
        summary.total += 1;

        switch (appointment.status.toLowerCase()) {
          case "pending":
            summary.pending += 1;
            break;
          case "confirmed":
            summary.confirmed += 1;
            break;
          case "cancelled":
            summary.cancelled += 1;
            break;
        }

        return summary;
      },
      { total: 0, pending: 0, confirmed: 0, cancelled: 0 }
    );
  }, [appointments]);

  async function startPayment(appointmentId: string) {
    setPayingId(appointmentId);
    setErrorMessage("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/api/payments/checkout-session`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId }),
      });

      const result: {
        success?: boolean;
        message?: string;
        url?: string;
      } = await response.json();

      if (!response.ok || !result.success || !result.url) {
        throw new Error(result.message || "Could not start payment.");
      }

      window.location.assign(result.url);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not connect to the payment server."
      );
      setPayingId("");
    }
  }
  async function cancelAppointment(appointmentId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    setCancelingId(appointmentId);
    setErrorMessage("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/api/appointments/${appointmentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not cancel the appointment.");
      }

      setNotice("Appointment cancelled successfully.");
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not connect to the server."
      );
    } finally {
      setCancelingId("");
    }
  }

  if (sessionPending || loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-10 text-stone-900 dark:bg-stone-950 dark:text-stone-100 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-stone-600 dark:text-stone-300 sm:text-base">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-10 text-stone-900 dark:bg-stone-950 dark:text-stone-100 sm:px-6 sm:py-12 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Sign in required</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300 sm:text-base">
            Sign in to view and manage your appointments.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 sm:w-auto"
          >
            Sign In
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 text-stone-900 dark:bg-stone-950 dark:text-stone-100 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-400 sm:text-sm">
              Customer dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Your Appointments
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300 sm:text-base">
              View and manage your salon appointment requests.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-stone-900 px-5 py-3 text-center font-semibold text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 sm:w-fit"
          >
            Browse Services
          </Link>
        </div>

        <section
          aria-label="Appointment summary"
          className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {[
            { label: "Total", value: counts.total },
            { label: "Pending", value: counts.pending },
            { label: "Confirmed", value: counts.confirmed },
            { label: "Cancelled", value: counts.cancelled },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-5"
            >
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-stone-900 dark:text-white sm:text-3xl">
                {item.value}
              </p>
            </article>
          ))}
        </section>

        {notice && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
          >
            {notice}
          </p>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="mb-5 break-words rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {errorMessage}
          </p>
        )}

        {appointments.length === 0 ? (
          <section className="rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-8">
            <h2 className="text-xl font-bold">No appointments yet</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300 sm:text-base">
              Your appointment requests will appear here.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 sm:w-auto"
            >
              Browse Services
            </Link>
          </section>
        ) : (
          <div className="space-y-5">
            {appointments.map((appointment) => {
              const details =
                serviceInfo[appointment.service.trim().toLowerCase()];

              return (
                <article
                  key={appointment._id}
                  className="min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900"
                >
                  {details && (
                    <div className="h-48 bg-stone-200 dark:bg-stone-800 sm:h-56">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={details.image}
                        alt={`${details.name} for men`}
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        {details?.category && (
                          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                            {details.category}
                          </p>
                        )}
                        <p className="mt-1 break-words text-sm font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                          {appointment.service}
                        </p>
                        <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                          {formatDate(appointment.date)}
                        </h2>
                        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300 sm:text-base">
                          {appointment.time}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${statusClasses(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${paymentClasses(
                            appointment.paymentStatus
                          )}`}
                        >
                          Payment: {appointment.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid min-w-0 gap-3 border-t border-stone-100 pt-5 text-sm text-stone-600 dark:border-stone-800 dark:text-stone-300 sm:grid-cols-2">
                      {details && (
                        <p>
                          <span className="font-semibold text-stone-800 dark:text-stone-100">
                            Price:
                          </span>{" "}
                          {formatPrice(details.price)}
                        </p>
                      )}
                      {formatRequestDate(appointment.createdAt) && (
                        <p>
                          <span className="font-semibold text-stone-800 dark:text-stone-100">
                            Requested:
                          </span>{" "}
                          {formatRequestDate(appointment.createdAt)}
                        </p>
                      )}
                      <p className="break-words">
                        <span className="font-semibold text-stone-800 dark:text-stone-100">
                          Name:
                        </span>{" "}
                        {appointment.name}
                      </p>
                      <p className="break-words">
                        <span className="font-semibold text-stone-800 dark:text-stone-100">
                          Phone:
                        </span>{" "}
                        {appointment.phone}
                      </p>
                      <p className="break-all">
                        <span className="font-semibold text-stone-800 dark:text-stone-100">
                          Email:
                        </span>{" "}
                        {appointment.email}
                      </p>
                      {appointment.notes && (
                        <p className="break-words sm:col-span-2">
                          <span className="font-semibold text-stone-800 dark:text-stone-100">
                            Notes:
                          </span>{" "}
                          {appointment.notes}
                        </p>
                      )}
                    </div>

                    {appointment.status.toLowerCase() === "confirmed" &&
                      appointment.paymentStatus.toLowerCase() !== "paid" && (
                        <button
                          type="button"
                          onClick={() => void startPayment(appointment._id)}
                          disabled={payingId === appointment._id}
                          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#647548] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#53643b] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit sm:text-base"
                        >
                          {payingId === appointment._id
                            ? "Opening Checkout..."
                            : "Pay Now"}
                        </button>
                      )}
                    {appointment.status.toLowerCase() === "pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          void cancelAppointment(appointment._id)
                        }
                        disabled={cancelingId === appointment._id}
                        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40 sm:w-fit sm:text-base"
                      >
                        {cancelingId === appointment._id
                          ? "Cancelling..."
                          : "Cancel Appointment"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
