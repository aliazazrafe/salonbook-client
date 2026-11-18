import Link from "next/link";

type Category = {
  name: string;
  description: string;
  image: string;
};

const categories: Category[] = [
  {
    name: "Haircut & Styling",
    description: "Cuts and styles tailored to your look.",
    image:
      "https://images.pexels.com/photos/7518755/pexels-photo-7518755.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
  {
    name: "Hair Coloring",
    description: "Professional color services for men.",
    image:
      "https://images.pexels.com/photos/7389077/pexels-photo-7389077.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
  {
    name: "Hair Treatment",
    description: "Care for healthier, easier-to-style hair.",
    image:
      "https://images.pexels.com/photos/17553843/pexels-photo-17553843/free-photo-of-hairdresser-washing-man-head.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
  {
    name: "Facial & Skincare",
    description: "Refresh and care for your skin.",
    image:
      "https://images.unsplash.com/photo-1722351153083-e32ff83a0c8a?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Beard Grooming",
    description: "Trims, shaping, and classic shaves.",
    image:
      "https://images.unsplash.com/photo-1599011176306-4a96f1516d4d?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Manicure & Pedicure",
    description: "Men’s hand, nail, and foot care.",
    image:
      "https://images.pexels.com/photos/7755173/pexels-photo-7755173.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
  {
    name: "Spa & Massage",
    description: "Relaxing scalp and grooming treatments.",
    image:
      "https://images.pexels.com/photos/14400615/pexels-photo-14400615.png?auto=compress&dpr=1&h=750&w=1260",
  },
];

export default function ServiceCategories() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Explore by category
          </p>

          <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Find the Right Service
          </h2>

          <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">
            Explore grooming services and choose what suits your style.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/services?category=${encodeURIComponent(category.name)}`}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-44 overflow-hidden bg-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-stone-900">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-5 text-stone-600">
                  {category.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-800">
                  Explore services
                  <span
                    aria-hidden="true"
                    className="transition group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

