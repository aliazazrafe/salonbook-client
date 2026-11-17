"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "About Us", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => {
      window.removeEventListener("hashchange", syncHash);
    };
  }, [pathname]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const desktop = window.matchMedia("(min-width: 1024px)");

    const closeOnDesktop = () => {
      if (desktop.matches) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  const isActive = (href: string) => {
    if (href.includes("#")) {
      const hash = href.slice(href.indexOf("#"));

      return pathname === "/" && activeHash === hash;
    }

    if (href === "/") {
      return pathname === "/" && !activeHash;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleNavigation = (href: string) => {
    setMenuOpen(false);
    setActiveHash(
      href.includes("#") ? href.slice(href.indexOf("#")) : ""
    );
  };

  const navClass = (href: string) =>
    `rounded-lg px-3 py-2 text-base font-medium transition-colors ${
      isActive(href)
        ? "bg-[#eef0e6] text-[#536238]"
        : "text-[#64665e] hover:bg-[#f0eee7] hover:text-[#252820]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7e5dc] bg-[#faf9f6]/95 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"
      >
        <div className="flex h-20 items-center justify-between gap-6">
          <Link
            href="/"
            onClick={() => handleNavigation("/")}
            aria-label="SalonBook home"
            className="shrink-0"
          >
            <span className="block text-3xl font-semibold tracking-tight text-[#252820]">
              Salon<span className="text-[#667547]">Book</span>
            </span>

            <span className="mt-0.5 block text-[10px] font-medium tracking-[0.22em] text-[#77796f]">
              MEN&apos;S SALON & GROOMING
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavigation(item.href)}
                aria-current={
                  isActive(item.href)
                    ? item.href.includes("#")
                      ? "location"
                      : "page"
                    : undefined
                }
                className={navClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/sign-in"
              className="rounded-lg px-4 py-2.5 text-base font-medium text-[#42463a] transition-colors hover:bg-[#eeede6]"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-lg bg-[#59683e] px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-[#465332]"
            >
              Sign Up
            </Link>
          </div>

          <button
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-[#e2e3d9] text-[#353a2d] transition-colors hover:bg-[#eeede6] lg:hidden"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="m6 6 12 12M6 18 18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div
          id="mobile-navigation"
          hidden={!menuOpen}
          className="border-t border-[#e7e5dc] pb-5 pt-4 lg:hidden"
        >
          <div className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavigation(item.href)}
                aria-current={
                  isActive(item.href)
                    ? item.href.includes("#")
                      ? "location"
                      : "page"
                    : undefined
                }
                className={navClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/sign-in"
              onClick={() => handleNavigation("/sign-in")}
              className="rounded-lg border border-[#dcded1] px-4 py-2.5 text-center text-base font-medium text-[#42463a] transition-colors hover:bg-[#eeede6]"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              onClick={() => handleNavigation("/sign-up")}
              className="rounded-lg bg-[#59683e] px-4 py-2.5 text-center text-base font-medium text-white transition-colors hover:bg-[#465332]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}