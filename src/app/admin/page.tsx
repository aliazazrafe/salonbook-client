"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api-fetch";

type Overview = {
  appointments: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  services: {
    total: number;
    active: number;
  };
  customers: {
    total: number;
  };
  payments: {
    successful: number;
  };
};

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

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  overview?: T;
  appointments?: T;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail?: string;
}) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-6">
      <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold text-stone-900 dark:text-white">
        {value}
      </p>
      {detail && (
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          {detail}
        </p>
      )}
    </article>
  );
}

export default function AdminPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadAdminData() {
      setLoading(true);
      setErrorMessage("");

      try {
        const [overviewResponse, appointmentsResponse] = await Promise.all([
          apiFetch(`${apiUrl}/api/admin/overview`, {
            credentials: "include",
            cache: "no-store",
          }),
          apiFetch(`${apiUrl}/api/admin/appointments`, {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const overviewResult: ApiResponse<Overview> =
          await overviewResponse.json();
        const appointmentsResult: ApiResponse<Appointment[]> =
          await appointmentsResponse.json();

        if (
          !overviewResponse.ok ||
          !overviewResult.success ||
          !overviewResult.overview
        ) {
          throw new Error(
            overviewResult.message || "Could not load the admin overview."
          );
        }

        if (
          !appointmentsResponse.ok ||
          !appointmentsResult.success ||
          !Array.isArray(appointmentsResult.appointments)
        ) {
          throw new Error(
            appointmentsResult.message || "Could not load appointments."
          );
        }

        if (!cancelled) {
          setOverview(overviewResult.overview);
          setAppointments(appointmentsResult.appointments);
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

    void loadAdminData();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function confirmAppointment(appointmentId: string) {
    const confirmed = window.confirm(
      "Do you want to confirm this appointment?"
    );

    if (!confirmed) return;

    setUpdatingId(appointmentId);
    setErrorMessage("");
    setNotice("");

    try {
      const response = await apiFetch(
        `${apiUrl}/api/admin/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Confirmed" }),
        }
      );

      const result: { success: boolean; message?: string } =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not confirm appointment.");
      }

      setNotice("Appointment confirmed successfully.");
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not connect to the server."
      );
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-10 dark:bg-stone-950 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
              SalonBook administration
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-3 text-stone-600 dark:text-stone-300">
              Review appointment requests and salon services.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRefreshKey((current) => current + 1)}
            disabled={loading}
            className="w-fit rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-600 dark:bg-stone-900 dark:text-white dark:hover:bg-stone-800"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <nav className="mb-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/admin/services"
            className="rounded-lg bg-[#647548] px-5 py-3 font-semibold text-white transition hover:bg-[#53643b]"
          >
            Manage Services
          </Link>
          <Link
            href="/admin/users"
            className="rounded-lg bg-[#647548] px-5 py-3 font-semibold text-white transition hover:bg-[#53643b]"
          >
            Manage Users
          </Link>
          <Link
            href="#appointment-requests"
            className="rounded-lg bg-[#647548] px-5 py-3 font-semibold text-white transition hover:bg-[#53643b]"
          >
            Appointments
          </Link>
          <Link
            href="/admin/transactions"
            className="rounded-lg bg-[#647548] px-5 py-3 font-semibold text-white transition hover:bg-[#53643b]"
          >
            Transactions
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#647548] px-5 py-3 font-semibold text-white transition hover:bg-[#53643b]"
          >
            Customer Dashboard
          </Link>
        </nav>

        {notice && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
          >
            {notice}
          </p>
        )}

        {errorMessage && (
          <section
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            <h2 className="font-semibold">Could not load admin data</h2>
            <p className="mt-1 text-sm">{errorMessage}</p>
            <p className="mt-2 text-sm">
              Confirm that the server is running and your admin account is
              signed in.
            </p>
          </section>
        )}

        {overview && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-stone-900 dark:text-white">
              Admin Overview
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total customers"
                value={overview.customers.total}
              />
              <StatCard
                label="Active services"
                value={overview.services.active}
                detail="Visible to customers"
              />
              <StatCard
                label="Total appointments"
                value={overview.appointments.total}
              />
              <StatCard
                label="Pending appointments"
                value={overview.appointments.pending}
                detail="Waiting for admin review"
              />
              <StatCard
                label="Confirmed appointments"
                value={overview.appointments.confirmed}
              />
              <StatCard
                label="Cancelled appointments"
                value={overview.appointments.cancelled}
              />
              <StatCard
                label="Successful payments"
                value={overview.payments.successful}
                detail="Paid appointments"
              />
            </div>
          </section>
        )}

        <section id="appointment-requests" className="mt-10 scroll-mt-24">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                Appointment Requests
              </h2>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                Confirm pending requests after reviewing their details.
              </p>
            </div>
            <span className="text-sm text-stone-500 dark:text-stone-400">
              {appointments.length} appointment
              {appointments.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading && appointments.length === 0 ? (
            <p className="rounded-xl border border-stone-200 bg-white p-6 text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
              Loading appointments...
            </p>
          ) : appointments.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-900">
              <h3 className="font-semibold text-stone-900 dark:text-white">
                No appointment requests
              </h3>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
                New customer requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <article
                  key={appointment._id}
                  className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
                        {appointment.service}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-stone-900 dark:text-white">
                        {new Date(
                          `${appointment.date}T00:00:00`
                        ).toLocaleDateString()}{" "}
                        · {appointment.time}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {appointment.status}
                      </span>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-200">
                        Payment: {appointment.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 border-t border-stone-100 pt-5 text-sm text-stone-600 dark:border-stone-800 dark:text-stone-300 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-stone-800 dark:text-white">
                        Customer:
                      </span>{" "}
                      {appointment.name}
                    </p>
                    <p>
                      <span className="font-semibold text-stone-800 dark:text-white">
                        Phone:
                      </span>{" "}
                      {appointment.phone}
                    </p>
                    <p className="break-all">
                      <span className="font-semibold text-stone-800 dark:text-white">
                        Email:
                      </span>{" "}
                      {appointment.email}
                    </p>
                    {appointment.notes && (
                      <p className="sm:col-span-2">
                        <span className="font-semibold text-stone-800 dark:text-white">
                          Notes:
                        </span>{" "}
                        {appointment.notes}
                      </p>
                    )}
                  </div>

                  {appointment.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() =>
                        void confirmAppointment(appointment._id)
                      }
                      disabled={updatingId === appointment._id}
                      className="mt-5 rounded-lg bg-[#647548] px-5 py-2.5 font-semibold text-white transition hover:bg-[#53643b] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updatingId === appointment._id
                        ? "Confirming..."
                        : "Confirm Appointment"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>


      </div>
    </main>
  );
}

