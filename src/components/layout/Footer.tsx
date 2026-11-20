import Link from "next/link";

const popularServices = [
  "Haircut & Styling",
  "Beard Grooming",
  "Facial & Skincare",
];

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/" },
  { name: "Instagram", href: "https://www.instagram.com/" },
  { name: "WhatsApp", href: "https://wa.me/8801700000000" },
] as const;

function SocialIcon({ name }: { name: (typeof socialLinks)[number]["name"] }) {
  if (name === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          fill="currentColor"
          d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.019 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.026 1.792-4.7 4.533-4.7 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.887v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.092 24 18.092 24 12.073Z"
        />
      </svg>
    );
  }

  if (name === "Instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-5 w-5"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="18" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L4 20l.8-3.8a8.5 8.5 0 1 1 15.7-4.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.3 7.7c-.3 0-.6.1-.8.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1 .1-1.2-.1-.2-.3-.2-.6-.4l-1.6-.8c-.2-.1-.4-.2-.6.2-.2.3-.7.8-.9 1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.2-1.4-.8-.7-1.3-1.5-1.5-1.8-.2-.3 0-.4.1-.6l.4-.5.3-.4c.1-.2 0-.4 0-.5l-.8-1.8c-.2-.5-.4-.5-.6-.5h-.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function socialColor(name: (typeof socialLinks)[number]["name"]) {
  if (name === "Facebook") return "bg-[#1877F2]";

  if (name === "Instagram") {
    return "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]";
  }

  return "bg-[#25D366]";
}

export default function Footer() {
  return (
    <footer className="bg-stone-950 px-5 py-12 text-stone-300 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-white"
            >
              Salon<span className="text-lime-400">Book</span>
            </Link>

            <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
              Men’s Salon & Grooming
            </p>

            <p className="mt-5 max-w-sm text-sm leading-6 text-stone-400">
              Discover grooming services, compare options, and find the right
              salon experience for your style.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:-translate-y-0.5 hover:opacity-85 ${socialColor(
                    social.name
                  )}`}
                >
                  <SocialIcon name={social.name} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="font-semibold text-white">Quick Links</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link className="hover:text-white" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/services">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Popular salon services">
            <h2 className="font-semibold text-white">Popular Services</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {popularServices.map((service) => (
                <li key={service}>
                  <Link
                    className="hover:text-white"
                    href={`/services?category=${encodeURIComponent(service)}`}
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-semibold text-white">Contact & Hours</h2>

            <address className="mt-4 space-y-3 text-sm not-italic text-stone-400">
              <p>
                <span className="font-medium text-stone-200">Phone:</span>{" "}
                <a className="hover:text-white" href="tel:+8801700000000">
                  +880 1700-000000
                </a>
              </p>

              <p>
                <span className="font-medium text-stone-200">Email:</span>{" "}
                <a
                  className="hover:text-white"
                  href="mailto:hello@salonbook.com"
                >
                  hello@salonbook.com
                </a>
              </p>

              <p>
                <span className="font-medium text-stone-200">Address:</span>
                <br />
                Dhanmondi, Dhaka, Bangladesh
              </p>

              <p>
                <span className="font-medium text-stone-200">
                  Opening Hours:
                </span>
                <br />
                Saturday–Thursday: 10:00 AM–9:00 PM
                <br />
                Friday: 2:00 PM–9:00 PM
              </p>
            </address>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-800 pt-6 text-sm text-stone-500">
          <p>© 2026 SalonBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}