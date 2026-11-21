"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Service = {
  _id?: string;
  id?: string;
  serviceName?: string;
  name?: string;
  category?: string;
  description?: string;
  price?: number;
  duration?: number;
  image?: string;
  imageUrl?: string;
  images?: string[];
  status?: string;
  isActive?: boolean;
};

type ServicesResponse = {
  success?: boolean;
  message?: string;
  services?: Service[];
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function isActiveService(service: Service) {
  return (
    service.isActive === true ||
    service.status?.toLowerCase() === "active"
  );
}

function formatPrice(price: number) {
  return `৳${new Intl.NumberFormat("en-BD").format(price)}`;
}

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/services?status=active&limit=12`,
        { cache: "no-store" }
      );

      const result: ServicesResponse = await response.json();

      if (!response.ok || !result.success || !Array.isArray(result.services)) {
        throw new Error(result.message || "Could not load featured services.");
      }

      setServices(result.services.filter(isActiveService).slice(0, 12));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices, retryKey]);

  return (
    <section className="bg-stone-50 px-5 py-16 dark:bg-stone-950 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-400">
              Find your next look
            </p>

            <h2 className="mt-2 text-3xl font-bold text-stone-900 dark:text-white sm:text-4xl">
              Featured Salon Services
            </h2>
          </div>

          <Link
            href="/services"
            className="w-fit text-sm font-semibold text-stone-800 underline underline-offset-4 transition hover:text-orange-700 dark:text-stone-200 dark:hover:text-orange-400"
          >
            Browse all services
          </Link>
        </div>

        {loading && (
          <div
            aria-label="Loading featured services"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="h-44 bg-stone-200 dark:bg-stone-800" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-2/5 rounded bg-stone-200 dark:bg-stone-800" />
                  <div className="h-5 w-4/5 rounded bg-stone-200 dark:bg-stone-800" />
                  <div className="h-4 w-full rounded bg-stone-200 dark:bg-stone-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30"
          >
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            <button
              type="button"
              onClick={() => setRetryKey((current) => current + 1)}
              className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <p className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
            No active services are available right now.
          </p>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service, index) => {
              const serviceId = service._id || service.id;
              const serviceName =
                service.serviceName || service.name || "Salon service";
              const image =
                service.image ||
                service.imageUrl ||
                service.images?.[0] ||
                "/heroimage/gent-salon.png";

              return (
                <article
                  key={serviceId || `${serviceName}-${index}`}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
                >
                  <div className="h-44 overflow-hidden bg-stone-200 dark:bg-stone-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={serviceName}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = "/heroimage/gent-salon.png";
                      }}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                      {service.category || "Grooming"}
                    </p>

                    <h3 className="mt-2 line-clamp-2 min-h-12 text-lg font-semibold text-stone-900 dark:text-white">
                      {serviceName}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-stone-600 dark:text-stone-300">
                      {service.description || "Explore this grooming service."}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-white">
                          {typeof service.price === "number"
                            ? formatPrice(service.price)
                            : "Contact us"}
                        </p>

                        {typeof service.duration === "number" && (
                          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                            {service.duration} minutes
                          </p>
                        )}
                      </div>

                      {serviceId ? (
                        <Link
                          href={`/services/${encodeURIComponent(serviceId)}`}
                          className="shrink-0 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white dark:border-stone-700 dark:text-stone-200 dark:hover:border-white dark:hover:bg-white dark:hover:text-stone-900"
                        >
                          Details
                        </Link>
                      ) : (
                        <Link
                          href="/services"
                          className="shrink-0 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white dark:border-stone-700 dark:text-stone-200 dark:hover:border-white dark:hover:bg-white dark:hover:text-stone-900"
                        >
                          Details
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}