"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { motion, type Variants } from "motion/react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const popularSearches = ["Haircut", "Beard Trim", "Hair Treatment"];

export default function Hero() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();

    router.push(
      query
        ? `/services?search=${encodeURIComponent(query)}`
        : "/services"
    );
  }

  function handlePopularSearch(service: string) {
    router.push(`/services?search=${encodeURIComponent(service)}`);
  }

  return (
    <section className="relative isolate flex min-h-[640px] items-center justify-center overflow-hidden bg-stone-950">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/heroimage/gent-salon.png"
          alt="Modern men's salon interior"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Overlays for readable text */}
      <div className="absolute inset-0 z-10 bg-black/60" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Centered hero content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 mx-auto w-full max-w-7xl px-5 py-20 text-center sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-4xl text-white">
          <motion.p
            variants={itemVariants}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-amber-300 sm:text-sm"
          >
            SalonBook · Men’s Salon &amp; Grooming
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="mx-auto max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          >
            Premium Men’s Salon &amp; Grooming
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg"
          >
            Find the right salon service for your next haircut, beard trim, or
            grooming appointment.
          </motion.p>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSearch}
            role="search"
            className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-white/40 bg-white/90 p-2 shadow-xl backdrop-blur-md transition-shadow duration-200 focus-within:shadow-2xl sm:flex-row"
          >
            <label htmlFor="service-search" className="sr-only">
              Search salon services
            </label>

            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 shrink-0 text-stone-500"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m16 16 4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              <input
                id="service-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search haircut, beard grooming..."
                className="h-12 min-w-0 flex-1 bg-transparent text-left text-sm text-stone-900 outline-none placeholder:text-stone-500"
              />
            </div>

            <button
              type="submit"
              className="h-12 rounded-xl bg-stone-900 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              Search
            </button>
          </motion.form>

          <motion.div
            variants={itemVariants}
            className="mt-4 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="mr-1 text-sm text-white/75">
              Popular searches:
            </span>

            {popularSearches.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => handlePopularSearch(service)}
                className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm transition-colors duration-200 hover:border-amber-300/70 hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                {service}
              </button>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6">
            <Link
              href="/services"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/60 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              Explore Salon Services
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
