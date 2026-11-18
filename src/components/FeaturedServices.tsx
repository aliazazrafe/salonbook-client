import Link from "next/link";

type Service = {
  id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
};

const sampleServices: Service[] = [
  {
    id: "classic-haircut",
    serviceName: "Classic Haircut",
    category: "Haircut & Styling",
    description: "A clean, classic haircut tailored to your style.",
    price: 800,
    duration: 45,
    image: "https://images.pexels.com/photos/7518755/pexels-photo-7518755.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
  {
    id: "skin-fade",
    serviceName: "Skin Fade",
    category: "Haircut & Styling",
    description: "A sharp fade with a clean, polished finish.",
    price: 900,
    duration: 50,
    image: "https://images.unsplash.com/photo-1703792686383-4f307cbfa544?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "buzz-cut",
    serviceName: "Buzz Cut",
    category: "Haircut & Styling",
    description: "A neat, low-maintenance cut with an even finish.",
    price: 600,
    duration: 30,
    image: "https://images.unsplash.com/photo-1653875700322-cf550d9a52ff?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "hair-wash-style",
    serviceName: "Hair Wash & Styling",
    category: "Hair Treatment",
    description: "A relaxing wash followed by professional styling.",
    price: 600,
    duration: 35,
    image: "https://images.pexels.com/photos/17553843/pexels-photo-17553843/free-photo-of-hairdresser-washing-man-head.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
  {
    id: "hair-color",
    serviceName: "Men’s Hair Coloring",
    category: "Hair Coloring",
    description: "Professional color treatment for men’s hair.",
    price: 1800,
    duration: 90,
    image: "https://images.pexels.com/photos/7389077/pexels-photo-7389077.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
  {
    id: "beard-trim",
    serviceName: "Beard Trim & Shape",
    category: "Beard Grooming",
    description: "A precise trim with a clean, defined beard shape.",
    price: 500,
    duration: 30,
    image: "https://images.unsplash.com/photo-1599011176306-4a96f1516d4d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "haircut-beard-combo",
    serviceName: "Haircut & Beard Combo",
    category: "Haircut & Beard Grooming",
    description: "A fresh haircut paired with a professional beard trim.",
    price: 1100,
    duration: 65,
    image: "https://images.unsplash.com/photo-1733995471061-eb3235d212b1?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "hot-towel-shave",
    serviceName: "Hot Towel Shave",
    category: "Beard Grooming",
    description: "A close shave with a warm towel and a smooth finish.",
    price: 650,
    duration: 35,
    image: "https://images.pexels.com/photos/8867485/pexels-photo-8867485.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
  {
    id: "mens-facial",
    serviceName: "Men’s Facial",
    category: "Facial & Skincare",
    description: "A refreshing facial treatment for men’s skin.",
    price: 1200,
    duration: 60,
    image: "https://images.unsplash.com/photo-1722351153083-e32ff83a0c8a?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "head-massage",
    serviceName: "Head Massage",
    category: "Spa & Massage",
    description: "A calming scalp massage to help you unwind.",
    price: 700,
    duration: 30,
    image: "https://images.pexels.com/photos/14400615/pexels-photo-14400615.png?auto=compress&dpr=1&h=750&w=1260",
  },
  {
    id: "mens-manicure",
    serviceName: "Men’s Manicure",
    category: "Manicure & Pedicure",
    description: "Men’s nail grooming and hand care in one session.",
    price: 900,
    duration: 40,
    image: "https://images.pexels.com/photos/7755173/pexels-photo-7755173.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
  {
    id: "mens-pedicure",
    serviceName: "Men’s Pedicure",
    category: "Manicure & Pedicure",
    description: "A refreshing foot-care session with nail grooming.",
    price: 1100,
    duration: 50,
    image: "https://images.pexels.com/photos/34930127/pexels-photo-34930127/free-photo-of-close-up-of-professional-pedicure-session.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
];

function formatPrice(price: number) {
  return `৳${new Intl.NumberFormat("en-BD").format(price)}`;
}

export default function FeaturedServices() {
  return (
    <section className="bg-stone-50 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Find your next look
            </p>

            <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
              Featured Salon Services
            </h2>
          </div>

          <Link
            href="/services"
            className="text-sm font-semibold text-stone-800 underline underline-offset-4 transition hover:text-amber-700"
          >
            Browse all services
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sampleServices.map((service) => (
            <article
              key={service.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-48 overflow-hidden bg-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image}
                  alt={service.serviceName}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  {service.category}
                </p>

                <h3 className="mt-2 text-lg font-semibold text-stone-900">
                  {service.serviceName}
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-5 text-stone-600">
                  {service.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
                  <div>
                    <p className="font-semibold text-stone-900">
                      {formatPrice(service.price)}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {service.duration} minutes
                    </p>
                  </div>

                  <Link
                    href="/services"
                    className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

