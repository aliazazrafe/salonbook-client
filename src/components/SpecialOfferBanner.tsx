"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const DEFAULT_OFFER: OfferSettings = {
  title: "SalonBook Special Offer",
  message: "Visit the offers page to see current salon deals.",
  discountPercent: 47,
  activeDays: ["Friday", "Monday"],
  categories: ["Skin Care", "Hair Treatment", "Spa & Massage"],
  isActive: true,
};

export default function SpecialOfferBanner() {
  const [offer, setOffer] = useState<OfferSettings>(DEFAULT_OFFER);

  useEffect(() => {
    async function loadOffer() {
      try {
        const response = await fetch(`${API_URL}/api/offer-settings`, {
          cache: "no-store",
        });
        const result: OfferResponse = await response.json();

        if (response.ok && result.success && result.offer) {
          setOffer({ ...DEFAULT_OFFER, ...result.offer });
        }
      } catch {
        // Keep the default banner copy if the offer settings cannot be loaded.
      }
    }

    void loadOffer();
  }, []);

  const offerMessage = offer.isActive
    ? `${offer.title}  •  GET ${offer.discountPercent}% OFF  •  ${offer.activeDays.join(" & ")}  •  `
    : "CHECK OUR SALON SERVICES  •  ";

  return (
    <section
      aria-label="Special salon offer"
      className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-12"
    >
      <div className="overflow-hidden rounded-3xl border border-[#78866b]/20 bg-gradient-to-r from-[#26332b]/25 via-[#334638]/25 to-[#46543b]/25 px-6 py-7 text-white shadow-lg backdrop-blur-sm sm:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="offer-marquee">
              <div className="offer-marquee__group">
                <p>{offerMessage}</p>
              </div>
              <div className="offer-marquee__group" aria-hidden="true">
                <p>{offerMessage}</p>
              </div>
            </div>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#e9ede3] sm:text-base">
              {offer.message}
            </p>
          </div>

          <Link
            href="/offers"
            className="inline-flex w-fit shrink-0 items-center justify-center rounded-xl bg-[#e9ede3] px-5 py-3 text-sm font-bold text-[#29352d] transition hover:bg-white"
          >
            Get Offer
          </Link>
        </div>
      </div>

      <style jsx>{`
        .offer-marquee {
          display: flex;
          width: max-content;
          animation: offer-marquee-scroll 18s linear infinite;
        }

        .offer-marquee:hover {
          animation-play-state: paused;
        }

        .offer-marquee__group {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          white-space: nowrap;
          padding-right: 1rem;
        }

        .offer-marquee__group p {
          font-size: clamp(1.25rem, 3vw, 2rem);
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        @keyframes offer-marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .offer-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
