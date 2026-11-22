"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api-fetch";

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  banned: boolean;
  banReason: string;
  createdAt: string | null;
};

type UsersResponse = {
  success: boolean;
  message?: string;
  users?: AdminUser[];
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await apiFetch(`${apiUrl}/api/admin/users`, {
          credentials: "include",
          cache: "no-store",
        });

        const result: UsersResponse = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.users)) {
          throw new Error(result.message || "Could not load users.");
        }

        if (!cancelled) {
          setUsers(result.users);
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

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function changeUserStatus(user: AdminUser) {
    const nextStatus = user.banned ? "Active" : "Banned";
    const confirmed = window.confirm(
      user.banned
        ? `Unblock ${user.name || user.email}?`
        : `Block ${user.name || user.email}? They will not be able to sign in.`
    );

    if (!confirmed) return;

    setUpdatingId(user._id);
    setErrorMessage("");
    setNotice("");

    try {
      const response = await apiFetch(
        `${apiUrl}/api/admin/users/${user._id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const result: { success: boolean; message?: string } =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not update user status.");
      }

      setNotice(result.message || "User status updated.");
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
      <div className="mx-auto max-w-5xl">
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
              Manage Users
            </h1>
            <p className="mt-3 text-stone-600 dark:text-stone-300">
              View customer accounts and block or unblock access.
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

        {notice && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
          >
            {notice}
          </p>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {errorMessage}
          </p>
        )}

        {loading && users.length === 0 ? (
          <p className="rounded-xl border border-stone-200 bg-white p-6 text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
            Loading users...
          </p>
        ) : users.length === 0 ? (
          <section className="rounded-2xl border border-stone-200 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-900">
            <h2 className="font-semibold text-stone-900 dark:text-white">
              No customer accounts found
            </h2>
          </section>
        ) : (
          <section className="space-y-4">
            {users.map((user) => (
              <article
                key={user._id}
                className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="flex min-w-0 items-center gap-4">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#647548] font-bold text-white">
                      {(user.name || user.email || "U")
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-stone-900 dark:text-white">
                      {user.name || "Unnamed user"}
                    </h2>
                    <p className="mt-1 break-all text-sm text-stone-600 dark:text-stone-300">
                      {user.email}
                    </p>
                    {user.createdAt && (
                      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                        Joined{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      user.banned
                        ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        : "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                    }`}
                  >
                    {user.banned ? "Blocked" : "Active"}
                  </span>

                  <button
                    type="button"
                    onClick={() => void changeUserStatus(user)}
                    disabled={updatingId === user._id}
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      user.banned
                        ? "bg-[#647548] hover:bg-[#53643b]"
                        : "bg-red-700 hover:bg-red-800"
                    }`}
                  >
                    {updatingId === user._id
                      ? "Updating..."
                      : user.banned
                        ? "Unblock"
                        : "Block User"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}