import Link from "next/link";
import { notFound } from "next/navigation";

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

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-BD")}`;
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = services.find((item) => item.id === id);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/services"
          className="mb-6 inline-flex font-semibold text-orange-800 hover:underline"
        >
          ← Back to services
        </Link>

        <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="h-64 bg-stone-100 sm:h-96">
            <img
              src={service.image}
              alt={`${service.name} for men`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_280px] lg:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-orange-800">
                {service.category}
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                {service.name}
              </h1>

              <p className="mt-5 max-w-2xl leading-7 text-stone-600">
                {service.description}
              </p>

              <h2 className="mt-8 text-lg font-bold text-stone-900">
                About this service
              </h2>

              <p className="mt-2 max-w-2xl leading-7 text-stone-600">
                Our salon professionals provide this grooming service with
                care and attention to your preferences. Choose a suitable
                appointment date and time to continue.
              </p>
            </div>

            <aside className="h-fit rounded-xl bg-stone-50 p-5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <span className="text-sm text-stone-600">Price</span>
                <span className="text-xl font-bold text-stone-900">
                  {formatPrice(service.price)}
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-stone-600">Duration</span>
                <span className="font-semibold text-stone-900">
                  {service.duration} minutes
                </span>
              </div>

              <Link
                href={`/book-appointment?service=${encodeURIComponent(service.name)}`}
                className="mt-2 block rounded-lg bg-stone-900 px-5 py-3 text-center font-semibold text-white transition hover:bg-orange-800"
              >
                Request Appointment
              </Link>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}

