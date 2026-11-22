"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type ApiService = {
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

type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: string;
  isActive: boolean;
};

type ServicesResponse = {
  success?: boolean;
  message?: string;
  services?: ApiService[];
};

type SortOrder = "default" | "price-low-high" | "price-high-low";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const fallbackImage = "/heroimage/gent-salon.png";

const baseCategories = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Beard Grooming",
  "Manicure & Pedicure",
  "Spa & Massage",
];

function formatPrice(price: number) {
  return `৳${new Intl.NumberFormat("en-BD").format(price)}`;
}

function isActiveService(service: ApiService) {
  return (
    service.isActive === true ||
    service.status?.toLowerCase() === "active"
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Services");
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const loadServices = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/services?status=active&limit=50`,
        {
          signal,
          cache: "no-store",
        }
      );

      const result: ServicesResponse = await response.json();

      if (!response.ok || !result.success || !Array.isArray(result.services)) {
        throw new Error(result.message || "Could not load salon services.");
      }

      const activeServices = result.services
        .filter(isActiveService)
        .map((service, index) => {
          const name =
            service.serviceName || service.name || "Salon service";

          return {
            id: service._id || service.id || `${name}-${index}`,
            name,
            category: service.category || "Grooming",
            description: service.description || "",
            price: typeof service.price === "number" ? service.price : 0,
            duration:
              typeof service.duration === "number" ? service.duration : 0,
            image:
              service.image ||
              service.imageUrl ||
              service.images?.[0] ||
              fallbackImage,
            status: service.status || "Active",
            isActive: service.isActive === true || isActiveService(service),
          };
        });

      setServices(activeServices);
    } catch (error) {
      if (signal.aborted) return;

      setError(
        error instanceof Error
          ? error.message
          : "Could not connect to the server."
      );
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void loadServices(controller.signal);

    return () => controller.abort();
  }, [loadServices, retryKey]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchFromUrl = params.get("search") || "";
    const categoryFromUrl = params.get("category") || "";

    setSearch(searchFromUrl);

    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, []);

  const categories = useMemo(() => {
    const serviceCategories = services
      .map((service) => service.category)
      .filter(Boolean);

    return [
      "All Services",
      ...new Set([...baseCategories, ...serviceCategories]),
    ];
  }, [services]);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = services.filter((service) => {
      const matchesCategory =
        activeCategory === "All Services" ||
        service.category === activeCategory;

      const searchableText =
        `${service.name} ${service.category} ${service.description}`.toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sortOrder === "price-low-high") {
      return filtered.sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "price-high-low") {
      return filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [services, search, activeCategory, sortOrder]);

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 dark:bg-stone-950 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-9 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-400">
            Find your next look
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
            Browse Salon Services
          </h1>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-stone-600 dark:text-stone-300">
            Explore professional men’s grooming services and find the right one
            for you.
          </p>
        </header>

        <div className="mb-5">
          <label htmlFor="service-search" className="sr-only">
            Search salon services
          </label>

          <input
            id="service-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search haircut, beard grooming, facial..."
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:placeholder:text-stone-500"
          />
        </div>

        <div className="mb-6 flex justify-start sm:justify-end">
          <label className="flex items-center gap-3 text-sm font-medium text-stone-700 dark:text-stone-300">
            Sort by price
            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
              className="max-w-[180px] rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-800 outline-none focus:border-orange-700 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
            >
              <option value="default">Recommended</option>
              <option value="price-low-high">Low to High</option>
              <option value="price-high-low">High to Low</option>
            </select>
          </label>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const selected = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selected
                    ? "border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-stone-900"
                    : "border-stone-300 bg-white text-stone-700 hover:border-orange-700 hover:text-orange-800 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:text-orange-400"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {!loading && !error && (
          <p className="mb-5 text-sm text-stone-600 dark:text-stone-400" aria-live="polite">
            Showing {filteredServices.length}{" "}
            {filteredServices.length === 1 ? "service" : "services"}
          </p>
        )}

        {loading && (
          <div
            aria-label="Loading services"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="h-52 bg-stone-200 dark:bg-stone-800" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-2/5 rounded bg-stone-200 dark:bg-stone-800" />
                  <div className="h-5 w-3/4 rounded bg-stone-200 dark:bg-stone-800" />
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

        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <article
                key={service.id}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="h-52 overflow-hidden bg-stone-100 dark:bg-stone-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={`${service.name} for men`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = fallbackImage;
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-800 dark:text-orange-400">
                    {service.category}
                  </p>

                  <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                    {service.name}
                  </h2>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-stone-600 dark:text-stone-300">
                    {service.description}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
                    <div>
                      <p className="text-lg font-bold text-stone-900 dark:text-white">
                        {formatPrice(service.price)}
                      </p>
                      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                        {service.duration} minutes
                      </p>
                    </div>

                    <Link
                      href={`/services/${encodeURIComponent(service.id)}`}
                      className="shrink-0 rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-800 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white dark:border-stone-700 dark:text-stone-200 dark:hover:border-white dark:hover:bg-white dark:hover:text-stone-900"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && filteredServices.length === 0 && (
          <div className="rounded-2xl border border-stone-200 bg-white px-5 py-12 text-center dark:border-stone-800 dark:bg-stone-900">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white">
              No services found
            </h2>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
              Try another search term or choose a different category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}