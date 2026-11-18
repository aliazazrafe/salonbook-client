"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

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
};

export default function DashboardPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [cancelingId, setCancelingId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const userId = session?.user?.id;

  useEffect(() => {
    if (sessionPending) return;

    if (!userId) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadAppointments() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${apiUrl}/api/appointments/mine`, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load appointments.");
        }

        if (!cancelled) {
          setAppointments(result.appointments ?? []);
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

    void loadAppointments();

    return () => {
      cancelled = true;
    };
  }, [apiUrl, refreshKey, sessionPending, userId]);

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
        `${apiUrl}/api/appointments/${appointmentId}`,
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
      <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-stone-600">Loading your appointments...</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8">
        <section className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-stone-900">
            Sign in required
          </h1>
          <p className="mt-3 text-stone-600">
            Sign in to view and manage your appointments.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white hover:bg-orange-800"
          >
            Sign In
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
              Customer dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Your Appointments
            </h1>
            <p className="mt-3 text-stone-600">
              View and manage your salon appointment requests.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex w-fit rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-orange-800"
          >
            Browse Services
          </Link>
        </div>

        {notice && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
          >
            {notice}
          </p>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
          >
            {errorMessage}
          </p>
        )}

        {appointments.length === 0 ? (
          <section className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-stone-900">
              No appointments yet
            </h2>
            <p className="mt-2 text-stone-600">
              Your appointment requests will appear here.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-block rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-orange-800"
            >
              Browse Services
            </Link>
          </section>
        ) : (
          <div className="space-y-5">
            {appointments.map((appointment) => (
              <article
                key={appointment._id}
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
                      {appointment.service}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-stone-900">
                      {new Date(
                        `${appointment.date}T00:00:00`
                      ).toLocaleDateString()}
                    </h2>
                    <p className="mt-1 text-stone-600">
                      {appointment.time}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                      {appointment.status}
                    </span>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700">
                      Payment: {appointment.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 border-t border-stone-100 pt-5 text-sm text-stone-600 sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-stone-800">Name:</span>{" "}
                    {appointment.name}
                  </p>
                  <p>
                    <span className="font-semibold text-stone-800">Phone:</span>{" "}
                    {appointment.phone}
                  </p>
                  <p>
                    <span className="font-semibold text-stone-800">Email:</span>{" "}
                    {appointment.email}
                  </p>
                  {appointment.notes && (
                    <p className="sm:col-span-2">
                      <span className="font-semibold text-stone-800">
                        Notes:
                      </span>{" "}
                      {appointment.notes}
                    </p>
                  )}
                </div>

                {appointment.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() => void cancelAppointment(appointment._id)}
                    disabled={cancelingId === appointment._id}
                    className="mt-6 rounded-lg border border-red-300 px-5 py-2.5 font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {cancelingId === appointment._id
                      ? "Cancelling..."
                      : "Cancel Appointment"}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}