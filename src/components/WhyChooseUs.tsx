import Link from "next/link";

const benefits = [
  {
    number: "01",
    title: "Expert Barbers",
    description:
      "Get your haircut and grooming services from skilled professionals.",
    icon: "scissors",
  },
  {
    number: "02",
    title: "Premium Products",
    description:
      "We use quality grooming products selected for a better salon experience.",
    icon: "star",
  },
  {
    number: "03",
    title: "Easy Online Booking",
    description:
      "Choose a service and book your preferred appointment with ease.",
    icon: "calendar",
  },
  {
    number: "04",
    title: "Clean & Hygienic Space",
    description:
      "Enjoy your service in a clean, comfortable, and welcoming environment.",
    icon: "shield",
  },
] as const;

type BenefitIconName = (typeof benefits)[number]["icon"];

function BenefitIcon({ name }: { name: BenefitIconName }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "scissors":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="m8.2 8.2 12.3 12.3M14.5 9.5 20.5 3.5M8.2 15.8l4.2-4.2" />
        </svg>
      );

    case "star":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
        </svg>
      );

    case "calendar":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18M8 14h3M8 17h6" />
        </svg>
      );

    case "shield":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
  }
}

export default function WhyChooseUs() {
  return (
    <section className="bg-stone-50 px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
            The SalonBook experience
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Grooming Made Simple
          </h2>

          <p className="mt-4 leading-7 text-stone-600">
            Quality salon services, trusted professionals, and a convenient
            booking experience—all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <article
              key={benefit.number}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-800">
                  <span className="h-6 w-6">
                    <BenefitIcon name={benefit.icon} />
                  </span>
                </span>

                <span className="text-sm font-semibold tracking-wider text-stone-400">
                  {benefit.number}
                </span>
              </div>

              <h3 className="text-lg font-bold text-stone-900">
                {benefit.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-9 text-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-800"
          >
            Explore Salon Services
          </Link>
        </div>
      </div>
    </section>
  );
}

