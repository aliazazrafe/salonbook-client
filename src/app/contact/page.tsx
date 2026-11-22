"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
            We’re here to help
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Contact SalonBook
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-stone-600">
            Have a question about a salon service or appointment? Send us a
            message and we’ll be happy to help.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-5">
            <section className="rounded-2xl bg-stone-950 p-6 text-white sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
                Get in touch
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                How can we help?
              </h2>

              <p className="mt-3 leading-7 text-stone-300">
                Send your question through the form. You can also browse our
                services before choosing an appointment.
              </p>

              <Link
                href="/services"
                className="mt-6 inline-flex rounded-lg bg-orange-700 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Browse Services
              </Link>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-stone-900">Location</h2>
              <p className="mt-2 text-stone-600">Dhaka, Bangladesh</p>
<a
  href="https://www.google.com/maps/search/?api=1&amp;query=Dhaka%2C+Bangladesh"
  target="_blank"
  rel="noreferrer"
  className="mt-3 inline-flex text-sm font-semibold text-[#647548] underline underline-offset-4"
>
  View Dhaka map
</a>
<p className="mt-2 text-xs text-stone-500">
  This map shows the general Dhaka area. A full address is needed for a precise salon pin.
</p>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-stone-900">Appointments</h2>
              <p className="mt-2 text-stone-600">
                Browse available salon services and prepare an appointment
                request online.
              </p>
            </section>
          </aside>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-stone-900">
              Send us a message
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Fill in the form and include a few details about your question.
            </p>

            {submitted && (
              <p
                role="status"
                className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
              >
                Your message details are ready. They have not been sent yet;
                the contact form needs a server connection to deliver messages.
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Your name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Email address
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="What do you need help with?"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Write your message here"
                  className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-700 focus:ring-2 focus:ring-orange-700/15"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-stone-900 px-5 py-3.5 font-semibold text-white transition hover:bg-orange-800 sm:w-auto"
              >
                Prepare Message
              </button>
            </form>
          </section>
        </div>
      
        <section className="mt-14">
          <header className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#647548]">
              Need to know
            </p>
            <h2 className="mt-2 text-2xl font-bold text-stone-900 dark:text-white sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <details className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
              <summary className="cursor-pointer font-semibold text-stone-900 dark:text-white">
                How do I request an appointment?
              </summary>
              <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">
                Sign in, choose a service, barber, date and available time, then submit your appointment request.
              </p>
            </details>

            <details className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
              <summary className="cursor-pointer font-semibold text-stone-900 dark:text-white">
                When is the 47% offer available?
              </summary>
              <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">
                The offer is for selected Skin Care, Hair Treatment and Spa or Massage services on Fridays and Mondays.
              </p>
            </details>

            <details className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
              <summary className="cursor-pointer font-semibold text-stone-900 dark:text-white">
                When is my appointment confirmed?
              </summary>
              <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">
                A submitted request is pending until the salon administrator confirms it.
              </p>
            </details>

            <details className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
              <summary className="cursor-pointer font-semibold text-stone-900 dark:text-white">
                How can I leave a service review?
              </summary>
              <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">
                Sign in and leave a review after your confirmed appointment has taken place.
              </p>
            </details>
          </div>
        </section>
      </div>
    </main>
  );
}


