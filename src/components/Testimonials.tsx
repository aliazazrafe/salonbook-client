const testimonials = [
  {
    quote:
      "The haircut was exactly what I wanted, and finding the right service was simple.",
    service: "Haircut & Styling",
    name: "Demo Customer",
    initials: "DC",
  },
  {
    quote:
      "The beard grooming service made it easy to find the style I was looking for.",
    service: "Beard Grooming",
    name: "Demo Customer",
    initials: "DC",
  },
  {
    quote:
      "I could compare services and prepare an appointment request in one place.",
    service: "SalonBook Experience",
    name: "Demo Customer",
    initials: "DC",
  },
];

export default function Testimonials() {
  return (
    <section
      aria-label="Sample customer testimonials"
      className="bg-stone-50 px-5 py-16 sm:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
            Client stories
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            A Better Grooming Experience
          </h2>

          <p className="mt-4 leading-7 text-stone-600">
            Sample testimonials for the SalonBook demo. Replace these with real
            customer reviews when available.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={`${testimonial.service}-${index}`}
              className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div
                className="text-lg tracking-[0.18em] text-amber-500"
                aria-label="5 out of 5 stars"
              >
                ★★★★★
              </div>

              <blockquote className="mt-4 flex-1 text-base leading-7 text-stone-700">
                “{testimonial.quote}”
              </blockquote>

              <div className="mt-6 border-t border-stone-100 pt-5">
                <p className="text-sm font-semibold text-orange-800">
                  {testimonial.service}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white">
                    {testimonial.initials}
                  </span>

                  <span className="text-sm font-semibold text-stone-900">
                    {testimonial.name}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
