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
      </div>
    </main>
  );
}
