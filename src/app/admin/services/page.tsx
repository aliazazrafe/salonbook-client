"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import { apiFetch } from "@/lib/api-fetch";

type Service = {
  _id: string;
  serviceName?: string;
  name?: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  imageUrl?: string;
  status?: string;
  isActive?: boolean;
};

type ServiceForm = {
  serviceName: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  status: "Active" | "Inactive";
};

type ServiceResponse = {
  success: boolean;
  message?: string;
  services?: Service[];
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const emptyForm: ServiceForm = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  image: "",
  status: "Active",
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await apiFetch(`${apiUrl}/api/admin/services`, {
          credentials: "include",
          cache: "no-store",
        });

        const result: ServiceResponse = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.services)) {
          throw new Error(result.message || "Could not load services.");
        }

        if (!cancelled) {
          setServices(result.services);
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

    void loadServices();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId("");
  }

  function startEditing(service: Service) {
    setEditingId(service._id);
    setNotice("");
    setErrorMessage("");
    setForm({
      serviceName: service.serviceName || service.name || "",
      category: service.category || "",
      description: service.description || "",
      price: String(service.price ?? ""),
      duration: String(service.duration ?? ""),
      image: service.image || service.imageUrl || "",
      status:
        service.status === "Inactive" || service.isActive === false
          ? "Inactive"
          : "Active",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setNotice("");

    const payload = {
      serviceName: form.serviceName.trim(),
      name: form.serviceName.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      duration: Number(form.duration),
      image: form.image.trim(),
      imageUrl: form.image.trim(),
      status: form.status,
      isActive: form.status === "Active",
    };

    try {
      const response = await apiFetch(
        editingId
          ? `${apiUrl}/api/admin/services/${editingId}`
          : `${apiUrl}/api/admin/services`,
        {
          method: editingId ? "PATCH" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result: { success: boolean; message?: string } =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not save the service.");
      }

      setNotice(
        editingId
          ? "Service updated successfully."
          : "Service added successfully."
      );
      resetForm();
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not connect to the server."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deactivateService(service: Service) {
    const serviceName = service.serviceName || service.name || "this service";
    const confirmed = window.confirm(
      `Deactivate "${serviceName}"? Customers will no longer see it.`
    );

    if (!confirmed) return;

    setErrorMessage("");
    setNotice("");

    try {
      const response = await apiFetch(
        `${apiUrl}/api/admin/services/${service._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Inactive",
            isActive: false,
          }),
        }
      );

      const result: { success: boolean; message?: string } =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not deactivate the service.");
      }

      setNotice("Service deactivated successfully.");
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not connect to the server."
      );
    }
  }

  async function deleteService(service: Service) {
    const serviceName = service.serviceName || service.name || "this service";
    const confirmed = window.confirm(
      `Delete "${serviceName}" permanently? This action cannot be undone.`
    );

    if (!confirmed) return;

    setErrorMessage("");
    setNotice("");

    try {
      const response = await apiFetch(
        `${apiUrl}/api/admin/services/${service._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result: { success: boolean; message?: string } =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not delete the service.");
      }

      if (editingId === service._id) {
        resetForm();
      }

      setNotice("Service deleted successfully.");
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not connect to the server."
      );
    }
  }
  return (
    <main className="min-h-screen bg-stone-50 px-5 py-10 dark:bg-stone-950 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="inline-flex rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100 dark:border-stone-600 dark:text-white dark:hover:bg-stone-900"
        >
          ← Admin Overview
        </Link>

        <Link
          href="/admin/offers"
          className="ml-3 inline-flex rounded-lg bg-[#647548] px-4 py-2 text-sm font-semibold text-white hover:bg-[#53643b]"
        >
          Manage Offers
        </Link>

        <header className="mb-8 mt-7">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
            SalonBook administration
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900 dark:text-white sm:text-4xl">
            Manage Services
          </h1>
          <p className="mt-3 text-stone-600 dark:text-stone-300">
            Add services, update their details, or deactivate them.
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

        {errorMessage && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {errorMessage}
          </p>
        )}

        <section className="mb-10 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-7">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            {editingId ? "Edit service" : "Add a service"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="serviceName"
                className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
              >
                Service name
              </label>
              <input
                id="serviceName"
                name="serviceName"
                required
                value={form.serviceName}
                onChange={(event) =>
                  setForm({ ...form, serviceName: event.target.value })
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/20 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
                placeholder="Classic Haircut"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
              >
                Category
              </label>
              <input
                id="category"
                name="category"
                required
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/20 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
                placeholder="Haircut & Styling"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/20 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
                placeholder="Describe the salon service"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
              >
                Price (৳)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                required
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/20 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
                placeholder="800"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
              >
                Duration (minutes)
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                required
                value={form.duration}
                onChange={(event) =>
                  setForm({ ...form, duration: event.target.value })
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/20 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
                placeholder="45"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
              >
                Upload service image (PNG, JPG, or WEBP; max 2 MB)
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                required={!form.image}
                onChange={(event) => {
                  const input = event.currentTarget;
                  const file = input.files?.[0];
                  if (!file) return;

                  const allowedTypes = [
                    "image/png",
                    "image/jpeg",
                    "image/webp",
                  ];

                  if (!allowedTypes.includes(file.type)) {
                    setErrorMessage("Choose a PNG, JPG, or WEBP image.");
                    input.value = "";
                    return;
                  }

                  if (file.size > 2 * 1024 * 1024) {
                    setErrorMessage("Image size must be 2 MB or less.");
                    input.value = "";
                    return;
                  }

                  setErrorMessage("");
                  const reader = new FileReader();

                  reader.onload = () => {
                    if (typeof reader.result !== "string") {
                      setErrorMessage("Could not read the selected image.");
                      input.value = "";
                      return;
                    }

                    setForm((current) => ({
                      ...current,
                      image: reader.result as string,
                    }));
                    input.value = "";
                  };

                  reader.onerror = () => {
                    setErrorMessage("Could not read the selected image.");
                    input.value = "";
                  };

                  reader.readAsDataURL(file);
                }}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] focus:ring-2 focus:ring-[#647548]/20 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
              />

              {form.image && (
                <div
                  role="img"
                  aria-label="Service image preview"
                  className="mt-3 h-40 w-64 rounded-lg border border-stone-300 bg-cover bg-center dark:border-stone-600"
                  style={{ backgroundImage: `url("${form.image}")` }}
                />
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value as "Active" | "Inactive",
                  })
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-[#647548] dark:border-stone-600 dark:bg-stone-800 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#647548] px-5 py-3 font-semibold text-white transition hover:bg-[#53643b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Service"
                    : "Add Service"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-stone-300 px-5 py-3 font-semibold text-stone-800 hover:bg-stone-100 dark:border-stone-600 dark:text-white dark:hover:bg-stone-800"
                >
                  Stop Editing
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                All Services
              </h2>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                {services.length} service{services.length === 1 ? "" : "s"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRefreshKey((current) => current + 1)}
              disabled={loading}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100 disabled:opacity-60 dark:border-stone-600 dark:text-white dark:hover:bg-stone-900"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading && services.length === 0 ? (
            <p className="rounded-xl border border-stone-200 bg-white p-6 text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
              Loading services...
            </p>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-900">
              <p className="text-stone-600 dark:text-stone-300">
                No services found.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service) => {
                const isActive =
                  service.status !== "Inactive" && service.isActive !== false;

                return (
                  <article
                    key={service._id}
                    className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-orange-700">
                          {service.category}
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-stone-900 dark:text-white">
                          {service.serviceName || service.name}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                            : "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">
                      {service.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
                      <div>
                        <p className="font-bold text-stone-900 dark:text-white">
                          ৳{service.price.toLocaleString("en-BD")}
                        </p>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                          {service.duration} minutes
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(service)}
                          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100 dark:border-stone-600 dark:text-white dark:hover:bg-stone-800"
                        >
                          Edit
                        </button>

                        {isActive && (
                          <button
                            type="button"
                            onClick={() => void deactivateService(service)}
                            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                          >
                            Deactivate
                          </button>
                        )}                        <button
                          type="button"
                          onClick={() => void deleteService(service)}
                          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
