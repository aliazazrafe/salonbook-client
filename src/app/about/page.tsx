import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

const values = [
  {
    number: "01",
    title: "Professional Care",
    description:
      "Our services are designed around careful work, attention to detail, and your personal style.",
  },
  {
    number: "02",
    title: "Comfortable Experience",
    description:
      "We want every visit to feel welcoming, relaxed, and easy from start to finish.",
  },
  {
    number: "03",
    title: "Men’s Grooming",
    description:
      "Explore haircut, beard care, and skincare services designed for men.",
  },
];

const groomingAreas = [
  {
    number: "01",
    title: "Hair",
    description: "Haircuts, styling, coloring, and scalp treatments.",
  },
  {
    number: "02",
    title: "Beard",
    description: "Beard trimming, shaping, and grooming.",
  },
  {
    number: "03",
    title: "Skincare",
    description: "Facial and skincare services for men.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="relative isolate overflow-hidden bg-[#100e0d] px-5 py-16 text-white sm:px-8 lg:py-24">
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-orange-700/10 blur-3xl"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <RevealOnScroll>
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-400 sm:text-sm">
                <span className="h-px w-8 bg-orange-500" />
                About SalonBook
              </p>

              <h1 className="mt-6 max-w-[620px] text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
                Grooming that fits
                <span className="mt-1 block text-stone-400">your style.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-stone-300 sm:text-lg sm:leading-8">
                Discover men’s grooming services, compare your options, and plan
                a salon visit that feels right for you.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-3 rounded-lg bg-orange-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-600"
                >
                  Explore Our Services
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-4 w-4"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>

                <span className="text-sm text-stone-400">
                  Hair care · Beard care · Skincare
                </span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={140}>
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 sm:p-8">
              <div className="mb-6 border-b border-white/10 pb-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                  The SalonBook Difference
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Your grooming, made simple.
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-stone-400 sm:text-base">
                  Find the service you need, understand what it offers, and
                  choose what suits your personal style.
                </p>
              </div>

              <div className="space-y-2">
                {groomingAreas.map((area) => (
                  <div
                    key={area.number}
                    className="group flex gap-4 rounded-xl px-3 py-4 transition hover:bg-white/[0.04]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-500/30 text-xs font-bold text-orange-400">
                      {area.number}
                    </span>

                    <div>
                      <h3 className="font-semibold text-white">
                        {area.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-stone-400">
                        {area.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
                Our story
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                A simpler way to find your next grooming service
              </h2>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div className="space-y-4 leading-7 text-stone-600">
              <p>
                Finding the right grooming service should be simple. SalonBook
                brings salon services together so you can explore each option
                and choose what works for you.
              </p>

              <p>
                Whether you are looking for a fresh haircut, beard grooming, a
                facial, or a relaxing scalp treatment, SalonBook helps you
                discover services in one place.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="bg-stone-50 px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
                What matters to us
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                The SalonBook approach
              </h2>

              <p className="mt-4 leading-7 text-stone-600">
                We focus on making it easier to discover services and plan your
                grooming visit.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {values.map((value, index) => (
              <RevealOnScroll key={value.number} delay={index * 120}>
                <article className="h-full rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="text-sm font-bold tracking-wider text-orange-700">
                    {value.number}
                  </span>

                  <h3 className="mt-4 text-xl font-bold text-stone-900">
                    {value.title}
                  </h3>

                  <p className="mt-3 leading-7 text-stone-600">
                    {value.description}
                  </p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <RevealOnScroll className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-stone-950 px-6 py-10 text-center text-white sm:px-10 sm:py-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to find your next look?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-stone-300">
              Explore grooming services and choose the one that suits your
              style.
            </p>

            <Link
              href="/services"
              className="mt-7 inline-flex rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Browse Services
            </Link>
          </div>
        </RevealOnScroll>
      </section>
    </main>
  );
}