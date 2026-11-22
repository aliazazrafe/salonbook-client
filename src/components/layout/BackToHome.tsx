"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BackToHome() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <div className="w-full bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto w-full max-w-7xl px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-[#647548] hover:text-[#647548] dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200"
        >
          <span aria-hidden="true">←</span>
          Back to Home
        </Link>
      </div>
    </div>
  );
}