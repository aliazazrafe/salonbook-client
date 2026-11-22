"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Service = {
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

type OfferSettings = {
  title: string;
  message: string;
  discountPercent: number;
  activeDays: string[];
  categories: string[];
  isActive: boolean;
};

type ServicesResponse = {
  success?: boolean;
  message?: string;
  services?: Service[];
};

type OfferResponse = {
  success?: boolean;
  message?: string;
  offer?: Partial<OfferSettings>;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const DEFAULT_OFFER: OfferSettings = {
  title: "Friday & Monday Special",
  message:
    "Offers may be changed or updated by the salon management at any time.",
  discountPercent: 47,
  activeDays: ["Friday", "Monday"],
  categories: ["Skin Care", "Hair Treatment", "Spa & Massage"],
  isActive: true,
};

function isActiveService(service: Service) {
  return service.isActive === true || service.status?.toLowerCase() === "active";
}

function isOfferService(service: Service, offer: OfferSettings) {
  const category = service.category?.toLowerCase() || "";
  const name = (service.serviceName || service.name || "").toLowerCase();

  const categoryEligible = offer.categories.some((item) => {
    const eligibleCategory = item.toLowerCase();
    return (
      category.includes(eligibleCategory) ||
      eligibleCategory.includes(category)
    );
  });

  return categoryEligible || /spa|massage/i.test(name);
}

function formatPrice(price: number) {
  return `৳${new Intl.NumberFormat("en-BD").format(price)}`;
}

export default function OffersPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [offer, setOffer] = useState<OfferSettings>(DEFAULT_OFFER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOffers() {
      try {
        const [servicesResponse, offerResponse] = await Promise.all([
          fetch(`${API_URL}/api/services?status=active&limit=50`, {
            cache: "no-store",
          }),
          fetch(`${API_URL}/api/offer-settings`, {
            cache: "no-store",
          }),
        ]);

        const [servicesResult, offerResult]: [
          ServicesResponse,
          OfferResponse
        ] = await Promise.all([
          servicesResponse.json(),
          offerResponse.json(),
        ]);

        if (
          !servicesResponse.ok ||
          !servicesResult.success ||
          !Array.isArray(servicesResult.services)
        ) {
          throw new Error(
            servicesResult.message || "Could not load offer services."
          );
        }

        if (!offerResponse.ok || !offerResult.success || !offerResult.offer) {
          throw new Error(
            offerResult.message || "Could not load offer settings."
          );
        }

        const currentOffer = { ...DEFAULT_OFFER, ...offerResult.offer };
        setOffer(currentOffer);

        setServices(
          servicesResult.services.filter(
            (service) =>
              currentOffer.isActive &&
              isActiveService(service) &&
              isOfferService(service, currentOffer)
          )
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not connect to the server."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadOffers();
  }, []);

  const activeDays = offer.activeDays.join(" and ");

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 text-stone-900 dark:bg-stone-950 dark:text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-3xl bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 px-6 py-8 text-white sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-100">
            {offer.title}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-5xl">
            {offer.discountPercent}% Off Selected Services
          </h1>
          <p className="mt-3 text-orange-50">
            {offer.categories.join(", ")}.
            {activeDays ? ` Valid every ${activeDays}.` : ""}
          </p>
          <p className="mt-2 text-sm text-orange-100">{offer.message}</p>
        </div>

        {loading && <p>Loading offer services...</p>}

        {!loading && error && (
          <p role="alert" className="rounded-xl bg-red-100 p-5 text-red-800">
            {error}
          </p>
        )}

        {!loading && !error && !offer.isActive && (
          <p className="rounded-xl border border-stone-200 p-6 dark:border-stone-800">
            There is no active offer right now.
          </p>
        )}

        {!loading && !error && offer.isActive && services.length === 0 && (
          <p className="rounded-xl border border-stone-200 p-6 dark:border-stone-800">
            No eligible services are available for this offer right now.
          </p>
        )}

        {!loading && !error && offer.isActive && services.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service, index) => {
              const serviceId = service._id || service.id;
              const name = service.serviceName || service.name || "Salon service";
              const image =
                service.image ||
                service.imageUrl ||
                service.images?.[0] ||
                "/heroimage/gent-salon.png";
              const discountedPrice =
                typeof service.price === "number"
                  ? Math.round(
                      service.price * (100 - offer.discountPercent) / 100
                    )
                  : null;

              return (
                <article
                  key={serviceId || `${name}-${index}`}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
                >
                  <div className="h-48 overflow-hidden bg-stone-200 dark:bg-stone-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={name}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = "/heroimage/gent-salon.png";
                      }}
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                        {service.category || "Salon Service"}
                      </p>
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                        {offer.discountPercent}% OFF
                      </span>
                    </div>

                    <h2 className="mt-2 text-lg font-bold">{name}</h2>

                    <p className="mt-2 min-h-10 text-sm text-stone-600 dark:text-stone-300">
                      {service.description ||
                        "Enjoy this service with our special offer."}
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
                      <div>
                        {typeof service.price === "number" &&
                        discountedPrice !== null ? (
                          <>
                            <p className="text-sm text-stone-500 line-through">
                              {formatPrice(service.price)}
                            </p>
                            <p className="text-xl font-extrabold text-orange-700 dark:text-orange-400">
                              {formatPrice(discountedPrice)}
                            </p>
                          </>
                        ) : (
                          <p className="font-semibold">Contact us for price</p>
                        )}

                        {typeof service.duration === "number" && (
                          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                            {service.duration} minutes
                          </p>
                        )}
                      </div>

                      <Link
                        href={
                          serviceId
                            ? `/services/${encodeURIComponent(serviceId)}`
                            : "/services"
                        }
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium transition hover:bg-stone-900 hover:text-white dark:border-stone-700"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
