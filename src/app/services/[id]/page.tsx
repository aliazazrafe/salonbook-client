import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ServiceReviews from "@/components/ServiceReviews";

const API_URL = (
  process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
).replace(/\/+$/, "");

type Service = {
  _id: string;
  serviceName?: string;
  name?: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  imageUrl?: string;
  images?: string[];
};

type ServiceResponse = {
  success?: boolean;
  message?: string;
  service?: Service;
};

type OfferSettings = {
  title: string;
  message: string;
  discountPercent: number;
  activeDays: string[];
  categories: string[];
  isActive: boolean;
};

type OfferResponse = {
  success?: boolean;
  offer?: Partial<OfferSettings>;
};

const DEFAULT_OFFER: OfferSettings = {
  title: "Friday & Monday Special",
  message: "Offers may be changed or updated by the salon management at any time.",
  discountPercent: 47,
  activeDays: ["Friday", "Monday"],
  categories: ["Skin Care", "Hair Treatment", "Spa & Massage"],
  isActive: true,
};

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatPrice(price: number) {
  return `৳${new Intl.NumberFormat("en-BD").format(price)}`;
}

function hasSpecialOffer(service: Service, offer?: Partial<OfferSettings>) {
  const categories = Array.isArray(offer?.categories)
    ? offer.categories
    : DEFAULT_OFFER.categories;
  const category = service.category?.toLowerCase() || "";
  const name = (service.serviceName || service.name || "").toLowerCase();

  const categoryEligible = categories.some((item) => {
    const eligibleCategory = item.toLowerCase();
    return (
      category.includes(eligibleCategory) ||
      eligibleCategory.includes(category)
    );
  });

  return (
    (offer?.isActive ?? true) &&
    (categoryEligible || /spa|massage/i.test(name))
  );
}

function ServiceLoading() {
  return (
    <main className="min-h-screen bg-stone-50 px-5 py-16 dark:bg-stone-950 sm:px-8">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-6 w-40 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="mt-8 h-64 rounded-2xl bg-stone-200 dark:bg-stone-800 sm:h-96" />
        <div className="mt-6 h-8 w-64 rounded bg-stone-200 dark:bg-stone-800" />
      </div>
    </main>
  );
}

function ServiceLoadError() {
  return (
    <main className="min-h-screen bg-stone-50 px-5 py-16 dark:bg-stone-950 sm:px-8">
      <section className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-8 text-center dark:border-stone-800 dark:bg-stone-900">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          Could not load this service
        </h1>
        <p className="mt-3 text-stone-600 dark:text-stone-300">
          Please try again, or browse the available salon services.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-flex rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
        >
          Browse Services
        </Link>
      </section>
    </main>
  );
}

export default function ServiceDetailsPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ServiceLoading />}>
      <ServiceDetailsContent params={params} />
    </Suspense>
  );
}

async function ServiceDetailsContent({ params }: PageProps) {
  const { id } = await params;

  let response: Response;

  try {
    response = await fetch(
      `${API_URL}/api/services/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    );
  } catch {
    return <ServiceLoadError />;
  }

  if (response.status === 404) {
    notFound();
  }

  let result: ServiceResponse;

  try {
    result = await response.json();
  } catch {
    return <ServiceLoadError />;
  }

  if (!response.ok || !result.success || !result.service) {
    return <ServiceLoadError />;
  }

  const service = result.service;

  let offerSettings = DEFAULT_OFFER;
  try {
    const offerResponse = await fetch(`${API_URL}/api/offer-settings`, {
      cache: "no-store",
    });
    const offerResult: OfferResponse = await offerResponse.json();

    if (offerResponse.ok && offerResult.success && offerResult.offer) {
      offerSettings = { ...DEFAULT_OFFER, ...offerResult.offer };
    }
  } catch {
    // Keep default offer settings if the public offer endpoint is unavailable.
  }
  const serviceName = service.serviceName || service.name || "Salon service";
  const image =
    service.image ||
    service.imageUrl ||
    service.images?.[0] ||
    "/heroimage/gent-salon.png";

  const offerAvailable = hasSpecialOffer(service);
  const discountedPrice = Math.round(service.price * 0.53);

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 dark:bg-stone-950 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href={offerAvailable ? "/offers" : "/services"}
          className="mb-6 inline-flex font-semibold text-orange-800 hover:underline dark:text-orange-400"
        >
          ← Back to services
        </Link>

        <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <div className="h-64 bg-stone-100 dark:bg-stone-800 sm:h-96">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`${serviceName} for men`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_280px] lg:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-orange-800 dark:text-orange-400">
                {service.category}
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
                {serviceName}
              </h1>

              <p className="mt-5 max-w-2xl leading-7 text-stone-600 dark:text-stone-300">
                {service.description}
              </p>

              <h2 className="mt-8 text-lg font-bold text-stone-900 dark:text-white">
                About this service
              </h2>

              <p className="mt-2 max-w-2xl leading-7 text-stone-600 dark:text-stone-300">
                Our salon professionals provide this grooming service with care
                and attention to your preferences. Choose a suitable
                appointment date and time to continue.
              </p>

              {offerAvailable && (
                <div className="mt-6 rounded-xl border border-orange-300/50 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/30">
                  <p className="font-bold text-orange-800 dark:text-orange-300">
                    {offerSettings.discountPercent}% OFF — {offerSettings.activeDays.join(" & ")}
                  </p>
                  <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">
                    The discounted price applies to appointments scheduled on
                    Friday or Monday.
                  </p>
                </div>
              )}
            </div>

            <aside className="h-fit rounded-xl bg-stone-50 p-5 dark:bg-stone-800">
              {offerAvailable ? (
                <>
                  <div className="flex items-center justify-between border-b border-stone-200 pb-4 dark:border-stone-700">
                    <span className="text-sm text-stone-600 dark:text-stone-300">
                      Regular price
                    </span>
                    <span className="font-semibold text-stone-500 line-through">
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-stone-200 py-4 dark:border-stone-700">
                    <span className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                      Offer price
                    </span>
                    <span className="text-xl font-extrabold text-orange-800 dark:text-orange-300">
                      {formatPrice(discountedPrice)}
                    </span>
                  </div>

                  <p className="pt-3 text-xs text-stone-500 dark:text-stone-400">
                    {offerSettings.discountPercent}% discount for {offerSettings.activeDays.join(" and ")} appointments
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-between border-b border-stone-200 pb-4 dark:border-stone-700">
                  <span className="text-sm text-stone-600 dark:text-stone-300">
                    Price
                  </span>
                  <span className="text-xl font-bold text-stone-900 dark:text-white">
                    {formatPrice(service.price)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-stone-600 dark:text-stone-300">
                  Duration
                </span>
                <span className="font-semibold text-stone-900 dark:text-white">
                  {service.duration} minutes
                </span>
              </div>

              <Link
                href={`/book-appointment?service=${encodeURIComponent(serviceName)}`}
                className="mt-2 block rounded-lg bg-stone-900 px-5 py-3 text-center font-semibold text-white transition hover:bg-orange-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
              >
                Request Appointment
              </Link>
            </aside>
          </div>
        </article>

        <ServiceReviews serviceId={id} />
      </div>
    </main>
  );
}