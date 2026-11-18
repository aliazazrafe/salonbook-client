"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const services = [
  {
    id: "classic-haircut",
    name: "Classic Haircut",
    category: "Haircut & Styling",
    description: "A clean, classic haircut tailored to your style.",
    price: 800,
    duration: 45,
    image:
      "https://images.pexels.com/photos/7518755/pexels-photo-7518755.jpeg?auto=compress&cs=tinysrgb&w=1000",
  },
  {
    id: "skin-fade",
    name: "Skin Fade",
    category: "Haircut & Styling",
    description: "A precise fade finished to suit your look.",
    price: 900,
    duration: 50,
    image: "https://barbertheme.pages.dev/img/slider/3.jpg",
  },
  {
    id: "haircut-beard-combo",
    name: "Haircut & Beard Combo",
    category: "Beard Grooming",
    description: "A fresh haircut paired with a professional beard trim.",
    price: 1100,
    duration: 65,
    image:
      "https://images.unsplash.com/photo-1599011176306-4a96f1516d4d?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "hair-coloring",
    name: "Men’s Hair Coloring",
    category: "Hair Coloring",
    description: "Refresh your look with professional hair coloring.",
    price: 1800,
    duration: 90,
    image: "https://www.welefulunisexsalon.com/images/services/13-colour.png",
  },
  {
    id: "grey-coverage",
    name: "Grey Coverage",
    category: "Hair Coloring",
    description: "Natural-looking color to blend or cover grey hair.",
    price: 1500,
    duration: 75,
    image:
      "https://images.pexels.com/photos/7389077/pexels-photo-7389077.jpeg?auto=compress&cs=tinysrgb&w=1000",
  },
  {
    id: "hair-treatment",
    name: "Hair Treatment",
    category: "Hair Treatment",
    description: "A nourishing treatment for healthier, softer hair.",
    price: 1400,
    duration: 60,
    image:
      "https://images.pexels.com/photos/17553843/pexels-photo-17553843.jpeg?auto=compress&cs=tinysrgb&w=1000",
  },
  {
    id: "scalp-treatment",
    name: "Scalp Treatment",
    category: "Hair Treatment",
    description: "A cleansing scalp treatment for a refreshed feel.",
    price: 1200,
    duration: 50,
    image: "https://hofg.co.uk/assets/gallery-5-CDsSirrN.jpg",
  },
  {
    id: "mens-facial",
    name: "Men’s Facial",
    category: "Facial & Skincare",
    description: "A refreshing facial treatment for men’s skin.",
    price: 1200,
    duration: 60,
    image: "https://www.welefulunisexsalon.com/images/blog/blog-20.png",
  },
  {
    id: "charcoal-facial",
    name: "Charcoal Facial",
    category: "Facial & Skincare",
    description: "A deep-cleansing facial to leave your skin feeling fresh.",
    price: 1500,
    duration: 70,
    image: "/services/charcoal-facial.webp",
  },
  {
    id: "beard-shaping",
    name: "Beard Shaping",
    category: "Beard Grooming",
    description: "Careful trimming and shaping for a neat beard style.",
    price: 600,
    duration: 30,
    image: "/services/beard-shaping.jpg",
  },
  {
    id: "mens-manicure",
    name: "Men’s Manicure",
    category: "Manicure & Pedicure",
    description: "Neat nail grooming and hand care in one session.",
    price: 900,
    duration: 40,
    image:
      "https://images.pexels.com/photos/7755173/pexels-photo-7755173.jpeg?auto=compress&cs=tinysrgb&w=1000",
  },
  {
    id: "scalp-massage",
    name: "Scalp Massage",
    category: "Spa & Massage",
    description: "A calming scalp massage to help you unwind.",
    price: 700,
    duration: 30,
    image:
      "https://img1.wsimg.com/isteam/ip/dbbb5924-150a-4ec7-a833-ef2cb590d0c3/Men%20Head%20Spa.png",
  },
];

const categories = [
  "All Services",
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Beard Grooming",
  "Manicure & Pedicure",
  "Spa & Massage",
];

type SortOrder = "default" | "price-low-high" | "price-high-low";

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-BD")}`;
}

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Services");
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");

  useEffect(() => {
    const categoryFromUrl = new URLSearchParams(window.location.search).get(
      "category"
    );

    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setActiveCategory(categoryFromUrl);
    }
  }, []);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = services.filter((service) => {
      const matchesCategory =
        activeCategory === "All Services" ||
        service.category === activeCategory;

      const matchesSearch =
        query.length === 0 ||
        `${service.name} ${service.category} ${service.description}`
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sortOrder === "price-low-high") {
      return result.sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "price-high-low") {
      return result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, activeCategory, sortOrder]);

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-9 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
            Find your next look
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Browse Salon Services
          </h1>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-stone-600">
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
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15"
          />
        </div>

        <div className="mb-6 flex justify-end">
          <label className="flex items-center gap-3 text-sm font-medium text-stone-700">
            Sort by price
            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-800 outline-none focus:border-orange-700"
            >
              <option value="default">Recommended</option>
              <option value="price-low-high">Low to High</option>
              <option value="price-high-low">High to Low</option>
            </select>
          </label>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-orange-700 hover:text-orange-800"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <p className="mb-5 text-sm text-stone-600" aria-live="polite">
          Showing {filteredServices.length}{" "}
          {filteredServices.length === 1 ? "service" : "services"}
        </p>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <article
                key={service.id}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="h-52 overflow-hidden bg-stone-100">
                  <img
                    src={service.image}
                    alt={`${service.name} for men`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-800">
                    {service.category}
                  </p>

                  <h2 className="text-xl font-bold text-stone-900">
                    {service.name}
                  </h2>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-stone-600">
                    {service.description}
                  </p>

                  <div className="mt-4 flex items-end justify-between border-t border-stone-100 pt-4">
                    <div>
                      <p className="text-lg font-bold text-stone-900">
                        {formatPrice(service.price)}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        {service.duration} minutes
                      </p>
                    </div>

                    <Link
                      href={`/services/${service.id}`}
                      className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-800 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white px-5 py-12 text-center">
            <h2 className="text-lg font-semibold text-stone-900">
              No services found
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Try another search term or choose a different category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

