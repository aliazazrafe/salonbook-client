import Link from "next/link";

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
      "From haircuts and beard care to skincare, find grooming services for men in one place.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="bg-stone-950 px-5 py-20 text-white sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            About SalonBook
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Grooming that fits your style.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
            SalonBook helps men discover salon and grooming services, explore
            what suits them, and prepare for a better salon experience.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Explore Our Services
          </Link>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-2xl bg-stone-100">
            <img
              src="/heroimage/gent-salon.png"
              alt="Modern men’s salon interior"
              className="h-full min-h-72 w-full object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
              Our story
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              A simpler way to find your next grooming service
            </h2>

            <p className="mt-5 leading-7 text-stone-600">
              Finding the right grooming service should be simple. SalonBook
              brings salon services together so you can compare options, learn
              about each service, and choose what works for you.
            </p>

            <p className="mt-4 leading-7 text-stone-600">
              Whether you are looking for a fresh haircut, beard grooming, a
              facial, or a relaxing scalp treatment, SalonBook is here to help
              you explore your options.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stone-50 px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.number}
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
              >
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
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-stone-950 px-6 py-10 text-center text-white sm:px-10 sm:py-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to find your next look?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-stone-300">
            Explore grooming services and choose the one that suits your style.
          </p>

          <Link
            href="/services"
            className="mt-7 inline-flex rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Browse Services
          </Link>
        </div>
      </section>
    </main>
  );
}

